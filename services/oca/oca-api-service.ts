import { OcaEpakConfig, OcaOrigen, OcaShipmentRequest, OcaShipmentResponse } from '@/types/oca-epak';
import { XmlService } from './xml-service';

/**
 * OCA e-PAK API service
 */
export class OcaApiService {
  private config: OcaEpakConfig;
  
  constructor(config: OcaEpakConfig) {
    this.config = config;
  }

  /**
   * Creates a new shipment in the OCA system
   * @param shipmentRequest The shipment request data
   * @param confirmRetrieval Whether to confirm the retrieval immediately (true) or leave it in the cart (false) Si se envía False, el envío quedará alojado en el Carrito de Envíos de e-Pak a la espera de la confirmación del mismo. Si se envía True, la confirmación será instantánea.
   * @returns API response with tracking number if successful
   */
  async createShipment(
    shipmentRequest: OcaShipmentRequest, 
    confirmRetrieval: boolean = true
  ): Promise<OcaShipmentResponse> {
    try {
      // Override Origin from the Despachos online
      if (shipmentRequest.fromDespachos) {
        shipmentRequest = {...shipmentRequest, ...getDespachosOnlineOrigin()}
      }

      // Convert request to XML
      const xmlData = XmlService.shipmentRequestToXml(shipmentRequest);
      
      // Form data for the request
      const formData = new URLSearchParams();
      formData.append('usr', this.config.username);
      formData.append('psw', this.config.password);
      formData.append('XML_Datos', xmlData);
      formData.append('ConfirmarRetiro', confirmRetrieval ? 'true' : 'false');
      formData.append('ArchivoCliente', ''); // Internal use, don't complete
      formData.append('ArchivoProceso', ''); // Internal use, don't complete
      
      // Make the API call
      const response = await fetch(`${this.config.baseUrl}/IngresoORMultiplesRetiros`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
      });
      
      if (!response.ok) {
        throw new Error(`OCA API error: ${response.status} ${response.statusText} ${JSON.stringify(response.body)} ${await response.text()}}`);
      }
      const xmlResponse = await response.text();
      return XmlService.parseXmlResponse(xmlResponse);
    } catch (error) {
      console.error('Error creating OCA shipment:', error);
      return {
        isSuccess: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Utility method to create a new OCA shipping request
   * with the account number pre-filled
   */
  createShipmentRequest(): OcaShipmentRequest {
    return {
      cabecera: {
        ver: '2.0',
        nrocuenta: this.config.accountNumber
      },
      origenes: [],
      fromDespachos: true
    };
  }
}

// Create a singleton instance for the application
let ocaApiService: OcaApiService | null = null;

export const getOcaApiService = (): OcaApiService => {
  if (!ocaApiService) {
    // Get config from environment variables
    const config: OcaEpakConfig = {
      username: process.env.OCA_USERNAME || '',
      password: process.env.OCA_PASSWORD || '',
      accountNumber: process.env.OCA_ACCOUNT_NUMBER || '',
      baseUrl: process.env.OCA_BASE_URL || '',
      cuit: process.env.DESPACHOS_ONLINE_CUIT || '',
      operationId: process.env.OCA_DOOR_TO_DOOR_OPERATIVE_ID || '',
    };
    
    ocaApiService = new OcaApiService(config);
  }
  
  return ocaApiService;
};

let ocaDespachosOnlineOrigen: Omit<OcaOrigen, "idfranjahoraria" | "envios" | "fecha" | "idcentroimposicionorigen" | "observaciones"> | null = null;

export const getDespachosOnlineOrigin = (): Omit<OcaOrigen, "idfranjahoraria" | "envios" | "fecha" | "idcentroimposicionorigen" | "observaciones"> => {
  if (!ocaDespachosOnlineOrigen) {
    ocaDespachosOnlineOrigen = {
      calle: process.env.DESPACHOS_ONLINE_STREET || '',
      nro: process.env.DESPACHOS_ONLINE_NUMBER || '',
      piso: process.env.DESPACHOS_ONLINE_FLOOR || '',
      depto: process.env.DESPACHOS_ONLINE_APARTMENT || '',
      cp: process.env.DESPACHOS_ONLINE_ZIP_CODE || '',
      localidad: process.env.DESPACHOS_ONLINE_CITY || '',
      provincia: process.env.DESPACHOS_ONLINE_STATE || '',
      email: process.env.OCA_USERNAME || '',
      contacto: process.env.DESPACHOS_ONLINE_PHONE || '',
      centrocosto: process.env.OCA_COST_CENTER || '',
    }
}
  return ocaDespachosOnlineOrigen;
}
