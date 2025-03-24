import { FranjaHoraria } from '@/types/oca-epak';

export interface OriginData {
  street: string;
  number: string;
  floor: string;
  apartment: string;
  zipCode: string;
  city: string;
  state: string;
  contactName: string;
  email: string;
  requesterName: string;
  observations: string;
  costCenter: string;
  timeSlot: string;
  phone: string;
  betweenStreet1: string;
  betweenStreet2: string;
  country: string;
}

export interface PackageData {
  height: number;
  width: number;
  length: number;
  weight: number;
  value: number;
  quantity: number;
  type: string;
  description: string;
}

export interface RecipientData {
  firstName: string;
  lastName: string;
  street: string;
  number: string;
  floor: string;
  apartment: string;
  zipCode: string;
  city: string;
  state: string;
  country: string;
  email: string;
  phone: string;
  cellPhone: string;
  observations: string;
  betweenStreet1: string;
  betweenStreet2: string;
}

export interface ShipmentFormData {
  originData: OriginData;
  packageData: PackageData;
  recipientData: RecipientData;
  operationId: string;
  remitNumber: string;
  confirmRetrieval: boolean;
}

export type FormSection = 'origin' | 'package' | 'recipient';

export interface CreatedPackage {
  packageId: string;
  trackingId: string;
  qrCodeUrl: string;
}

export interface FormState {
  formData: ShipmentFormData;
  activeSection: FormSection;
  loading: boolean;
  error: string | null;
  success: boolean;
  createdPackage: CreatedPackage | null;
}

// Create default/initial values
export const initialFormData: ShipmentFormData = {
  originData: {
    street: '',
    number: '',
    floor: '',
    apartment: '',
    zipCode: '',
    city: '',
    state: '',
    contactName: '',
    email: '',
    requesterName: '',
    observations: '',
    costCenter: '0',
    timeSlot: FranjaHoraria.DE_8_A_17,
    phone: '',
    betweenStreet1: '',
    betweenStreet2: '',
    country: 'Argentina'
  },
  packageData: {
    height: 10,
    width: 10,
    length: 10,
    weight: 1,
    value: 0,
    quantity: 1,
    type: 'Standard',
    description: ''
  },
  recipientData: {
    firstName: '',
    lastName: '',
    street: '',
    number: '',
    floor: '',
    apartment: '',
    zipCode: '',
    city: '',
    state: '',
    country: 'Argentina',
    email: '',
    phone: '',
    cellPhone: '',
    observations: '',
    betweenStreet1: '',
    betweenStreet2: ''
  },
  operationId: '252014', // Default operation ID
  remitNumber: `REM-${Date.now()}`,
  confirmRetrieval: true
}
