/**
 * OCA API endpoint paths
 */

export const ENDPOINTS = {
    // E-Pak tracking endpoints
    EPAK: {
      TRACK_PACKAGE: 'Oep_TrackEPak.asmx/Tracking_Pieza',
      RATE_SHIPPING: 'Oep_TrackEPak.asmx/Tarifar_Envio_Corporativo',
      GET_BRANCHES: 'Oep_TrackEPak.asmx/GetCentrosImposicionConServiciosByCP',
      CREATE_SHIPMENT: 'Oep_TrackEPak.asmx/IngresoORMultiplesRetiros',
      CANCEL_ORDER: 'Oep_TrackEPak.asmx/AnularOrdenGenerada',
      GET_PACKAGE_STATUS: 'Oep_TrackEPak.asmx/GetEnvioEstadoActual',
      LIST_SHIPMENTS: 'Oep_TrackEPak.asmx/List_Envios',
      
      // Label generation
      GET_HTML_LABEL_A4: 'Oep_Trackepak.asmx/GetHtmlDeEtiquetasPorOrdenOrNumeroEnvio',
      GET_HTML_LABEL_SMALL: 'Oep_Trackepak.asmx/GetHtmlDeEtiquetasPorOrdenOrNumeroEnvioParaEtiquetadora',
      GET_PDF_LABEL_A4: 'Oep_Trackepak.asmx/GetPdfDeEtiquetasPorOrdenOrNumeroEnvio',
      GET_PDF_LABEL_SMALL: 'Oep_Trackepak.asmx/GetPdfDeEtiquetasPorOrdenOrNumeroEnvioParaEtiquetadora',
      GET_ZPL_LABEL: 'Oep_Trackepak.asmx/ObtenerEtiquetasZPL',
    },
    
    // OEP tracking endpoints
    OEP: {
      GET_COST_CENTERS: 'Oep_Track.asmx/GetCentroCostoPorOperativa',
    }
  };
  
  /**
   * Helper function to get the full endpoint URL based on the environment
   */
  export const getEndpointUrl = (
    baseUrl: string, 
    trackingPath: string, 
    endpoint: string
  ): string => {
    return `${baseUrl}${trackingPath}${endpoint}`;
  };
  
  /**
   * Helper function to get the WSDL URL for a specific endpoint
   */
  export const getWsdlUrl = (fullEndpointUrl: string): string => {
    return `${fullEndpointUrl}?wsdl`;
  };