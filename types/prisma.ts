// Basic type definitions

export enum Role {
    ADMIN = 'ADMIN',
    USER = 'USER',
    COURIER = 'COURIER'
  }
  
  export interface User {
    id: string;
    dni: string;
    cult: string;
    name: string;
    password?: string;
    email?: string;
    role?: Role;
    cellphone?: string;
  }
  
  export interface Package {
    id: string;
    size: string;
    weight: number;
    tracking_id: string;
    state: string;
    state_date: Date;
    creation_date: Date;
    courier_id?: string;
    sender_id: string;
    receiver_id: string;
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
    sender?: User;
    receiver?: User;
    courier?: Courier;
  }
  
  export interface Courier {
    id: string;
    name: string;
  }
  
  export interface PackageWithRelations extends Package {
    sender: User;
    receiver: User;
    courier?: Courier;
    packageLogs?: PackageLog[];
  }
  
  export interface PackageLog {
    id: string;
    package_id: string;
    old_package: any;
    new_package: any;
    action: string;
    date: Date;
  }
  
  // Input types for creating/updating records
  export interface PackageInput {
    size: string;
    weight: number;
    tracking_id?: string; 
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