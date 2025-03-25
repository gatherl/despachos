import { OcaShipmentRequest } from '@/types/oca-epak';

/**
 * Service to convert TypeScript objects to XML for OCA e-Pak API
 */
export class XmlService {
  /**
   * Converts a shipment request object to XML
   * @param request The OCA shipment request object
   * @returns XML string representation
   */
  static shipmentRequestToXml(request: OcaShipmentRequest): string {
    let xml = '<?xml version="1.0" encoding="iso-8859-1" standalone="yes"?>\n';
    xml += '<ROWS>\n';
    
    // Cabecera
    xml += `  <cabecera ver="${request.cabecera.ver}" nrocuenta="${request.cabecera.nrocuenta}" />\n`;
    
    // Origenes
    xml += '  <origenes>\n';
    
    for (const origen of request.origenes) {
      // Origin attributes
      xml += `    <origen calle="${this.escapeXml(origen.calle)}" nro="${origen.nro}" `;
      xml += `piso="${origen.piso || ''}" depto="${origen.depto || ''}" `;
      xml += `cp="${origen.cp}" localidad="${this.escapeXml(origen.localidad)}" `;
      xml += `provincia="${this.escapeXml(origen.provincia)}" contacto="${this.escapeXml(origen.contacto || '')}" `;
      xml += `email="${origen.email}" solicitante="${this.escapeXml(origen.solicitante || '')}" `;
      xml += `observaciones="${this.escapeXml(origen.observaciones)}" centrocosto="${origen.centrocosto}" `;
      xml += `idfranjahoraria="${origen.idfranjahoraria}" idcentroimposicionorigen="${origen.idcentroimposicionorigen}" `;
      // Format YYYYMMDD
      xml += `fecha="${origen.fecha}">\n`;
      
      // Envios
      xml += '      <envios>\n';
      
      for (const envio of origen.envios) {
        xml += `        <envio idoperativa="${envio.idoperativa}" nroremito="${this.escapeXml(envio.nroremito)}" `;
        //TODO: Check where to configure this
        xml += `cantidadremitos="${envio.cantidadremitos}">\n`;
        
        // Destinatario
        const dest = envio.destinatario;
        xml += `          <destinatario apellido="${this.escapeXml(dest.apellido)}" nombre="${this.escapeXml(dest.nombre)}" `;
        xml += `calle="${this.escapeXml(dest.calle)}" nro="${dest.nro}" piso="${dest.piso || ''}" `;
        xml += `depto="${dest.depto || ''}" localidad="${this.escapeXml(dest.localidad)}" `;
        xml += `provincia="${this.escapeXml(dest.provincia)}" cp="${dest.cp}" `;
        xml += `telefono="${dest.telefono || ''}" email="${dest.email || ''}" `;
        xml += `idci="${dest.idci || '0'}" celular="${dest.celular || ''}" `;
        xml += `observaciones="${this.escapeXml(dest.observaciones || '')}" />\n`;
        
        // Paquetes
        xml += '          <paquetes>\n';
        
        for (const paquete of envio.paquetes) {
          xml += `            <paquete alto="${paquete.alto}" ancho="${paquete.ancho}" largo="${paquete.largo}" `;
          xml += `peso="${paquete.peso}" valor="${paquete.valor}" cant="${paquete.cant}" />\n`;
        }
        
        xml += '          </paquetes>\n';
        xml += '        </envio>\n';
      }
      
      xml += '      </envios>\n';
      xml += '    </origen>\n';
    }
    
    xml += '  </origenes>\n';
    xml += '</ROWS>';
    
    return xml;
  }

  /**
   * Escapes special characters for XML
   * @param text The text to escape
   * @returns Escaped text for XML
   */
  private static escapeXml(text: string): string {
    if (!text) return '';
    
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /**
   * Helper method to parse OCA XML responses
   * @param xmlString The XML response from OCA
   * @returns Parsed XML object
   */
  static parseXmlResponse(xmlString: string): any {
    console.log(xmlString)
    // Basic XML parsing - in a real application you might want to use a proper XML parser
    if (!xmlString || xmlString.includes('Error')) {
      return {
        isSuccess: false,
        errorMessage: xmlString
      };
    }

    // Look for the transaction number in the response
    const match = xmlString.match(/<NumeroEnvio>(.*?)<\/NumeroEnvio>/);
    if (match && match[1]) {
      return {
        isSuccess: true,
        numeroEnvio: match[1],
        xmlResponse: xmlString
      };
    }

    return {
      isSuccess: false,
      errorMessage: 'Could not parse response',
      xmlResponse: xmlString
    };
  }
}
