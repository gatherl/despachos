// Import types directly from Prisma client
import { 
  User,
  Shipment,
  Package,
  Courier,
  CourierShipment,
  ShipmentLog,
  Role
} from '@prisma/client';

// Re-export Prisma types
export type {
  User,
  Shipment,
  Package,
  Courier,
  CourierShipment, 
  ShipmentLog,
  Role
};

// Custom types that extend Prisma types
export type UserWithoutPassword = Omit<User, 'password'>;

// Enhanced types with relations
export interface UserWithShipments extends User {
  shipments: Shipment[];
  received: Shipment[];
}

export interface ShipmentWithRelations extends Shipment {
  sender: User;
  receiver: User;
  courier?: Courier;
  packages: Package[];
  shipmentLogs?: ShipmentLog[];
  courierShipments?: CourierShipment[];
}

export interface CourierWithShipments extends Courier {
  shipments: Shipment[];
  courierShipments: CourierShipment[];
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Form input types (for creating/updating records)
export interface ShipmentInput {
  tracking_id?: string; // Optional as it might be auto-generated
  state?: string;
  state_date?: Date;
  sender_id: string;
  receiver_id: string;
  courier_id?: string;
  transportist_id?: string;
  destination_zip_code: string;
  destination_street: string;
  destination_street_number: string;
  destination_floor?: string;
  destination_apartment?: string;
  destination_city: string;
  destination_state: string;
  origin_zip_code: string;
  origin_street: string;
  origin_street_number: string;
  origin_floor?: string;
  origin_apartment?: string;
  origin_city: string;
  origin_state: string;
  details?: string;
  payment: string;
}

export interface PackageInput {
  weight: number;
  height?: number;
  width?: number;
  length?: number;
  shipment_id: string;
  package_type: string;
}

export interface UserInput {
  dni?: string;
  cult?: string;
  name: string;
  password?: string;
  email?: string;
  role?: Role;
  cellphone?: string;
}

export interface CourierInput {
  name: string;
}