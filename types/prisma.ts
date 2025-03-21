// Import types directly from Prisma client
import { 
  User,
  Package,
  Courier,
  CourierPackage,
  PackageLog,
  Role
} from '@prisma/client';

// Re-export Prisma types
export type {
  User,
  Package,
  Courier,
  CourierPackage, 
  PackageLog,
  Role
};

// Custom types that extend Prisma types
export type UserWithoutPassword = Omit<User, 'password'>;

// Enhanced types with relations
export interface UserWithPackages extends User {
  packages: Package[];
  received: Package[];
}

export interface PackageWithRelations extends Package {
  sender: User;
  receiver: User;
  courier?: Courier;
  packageLogs?: PackageLog[];
  courierPackages?: CourierPackage[];
}

export interface CourierWithPackages extends Courier {
  packages: Package[];
  courierPackages: CourierPackage[];
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Form input types (for creating/updating records)
export interface PackageInput {
  size: string;
  weight: number;
  tracking_id?: string; // Optional as it might be auto-generated
  state?: string;
  state_date?: Date;
  sender_id: string;
  receiver_id: string;
  courier_id?: string;
  destination_zip_code: string;
  destination_street: string;
  destination_floor: string;
  destination_city: string;
  destination_state: string;
  destination_country: string;
  destination_apartment?: string;
  destination_btw_st_1: string;
  destination_btw_st_2: string;
  origin_zip_code: string;
  origin_street: string;
  origin_floor: string;
  origin_city: string;
  origin_state: string;
  origin_country: string;
  origin_apartment: string;
  origin_btw_st_1: string;
  origin_btw_st_2: string;
  details?: string;
  units_value: number;
  units_number: number;
  package_type: string;
}

export interface UserInput {
  dni: string;
  cult: string;
  name: string;
  password?: string;
  email?: string;
  role?: Role;
  cellphone?: string;
}

export interface CourierInput {
  name: string;
}