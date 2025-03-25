// OCA e-Pak API TypeScript definitions

// Base interfaces for XML structure
export interface OcaXmlCabecera {
    ver: string;
    nrocuenta: string;
  }
  
  export interface OcaPaquete {
    alto: number;
    ancho: number;
    largo: number;
    peso: number;
    valor: number;
    cant: number;
  }
  
  export interface OcaDestinatario {
    apellido: string;
    nombre: string;
    calle: string;
    nro: string;
    piso?: string;
    depto?: string;
    localidad: string;
    provincia: string;
    cp: string;
    telefono?: string;
    email?: string;
    idci?: string; // Required only for delivery to OCA branch. Corresponde al ID Centro Imposicion OCA. La lista de Centros de Imposiciones está disponible en el método “GetCentrosImposicionConServiciosByCP”.
    celular?: string;
    observaciones?: string;
  }
  
  export interface OcaEnvio {
    idoperativa: string;
    nroremito: string;
    cantidadremitos: number // Obligatorio, corresponde la cantidad de remitos que acompañaran al envío
    destinatario: OcaDestinatario;
    paquetes: OcaPaquete[];
  }
  
  export interface OcaOrigen {
    calle: string;
    nro: string;
    piso?: string;
    depto?: string;
    cp: string;
    localidad: string;
    provincia: string;
    contacto?: string;
    email: string;
    solicitante?: string;
    observaciones: string;
    centrocosto: string; // Obligatorio, corresponde al número de centro de costo habilitado en OCA para las sucursales del cliente habilitados en la operativa. Este dato se extrae desde el método “GetCentroCostoPorOperativa”
    idfranjahoraria: string;
    idcentroimposicionorigen?: string; // Obligatorio sólo para Admisión en Sucursal. Corresponde al ID Centro Imposicion OCA que va admitir el envío. La lista de Centros de Imposiciones está disponible en el método “GetCentrosImposicionConServiciosByCP”.
    fecha: string; // Format: YYYYMMDD
    envios: OcaEnvio[];
  }
  
  export interface OcaShipmentRequest {
    cabecera: OcaXmlCabecera;
    origenes: OcaOrigen[];
    fromDespachos: boolean;
  }
  
  // FranjaHoraria enum for better type safety
  export enum FranjaHoraria {
    DE_8_A_17 = "1",
    DE_8_A_12 = "2",
    DE_14_A_17 = "3"
  }
  
  // Operativas is a predefined id for the current client
  export enum Operativas {
    PuertaPuerta = Number.parseInt(process.env.OCA_DOOR_TO_BRANCH_OPERATIVE_ID || "64665"),
    PuertaSucursal = Number.parseInt(process.env.OCA_DOOR_TO_DOOR_OPERATIVE_ID || "62342")
  }
  
  // Response from OCA API
  export interface OcaShipmentResponse {
    isSuccess: boolean;
    numeroEnvio?: string;
    errorMessage?: string;
    xmlResponse?: string;
  }
  
  // Configuration for OCA e-Pak API
  export interface OcaEpakConfig {
    baseUrl: string;
    epakTrackingUrl: string;
    oepTrackingUrl: string;
    username: string;
    password: string;
    accountNumber: string;
    cuit: string;
    operationId: string;
  }
