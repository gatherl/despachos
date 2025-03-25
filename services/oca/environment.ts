/**
 * OCA API environment configuration
 */

export enum Environment {
    TEST = 'TEST',
    PRODUCTION = 'PRODUCTION',
  }
  
  export interface ApiEnvironment {
    baseUrl: string;
    epakTrackingUrl: string;
    oepTrackingUrl: string;
  }
  
  export const ENVIRONMENTS: Record<Environment, ApiEnvironment> = {
    [Environment.TEST]: {
      baseUrl: 'http://webservice.oca.com.ar',
      epakTrackingUrl: '/ePak_Tracking_TEST/',
      oepTrackingUrl: '/OEP_Tracking_TEST/',
    },
    [Environment.PRODUCTION]: {
      baseUrl: 'http://webservice.oca.com.ar',
      epakTrackingUrl: '/ePak_tracking/',
      oepTrackingUrl: '/oep_tracking/',
    },
  };
  
  export const DEFAULT_ENVIRONMENT = Environment.TEST;