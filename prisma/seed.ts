import { PrismaClient, UserRole, ShipmentState, PaymentStatus, LogAction, PackageType } from '@prisma/client';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clean up existing data
  await prisma.courierShipment.deleteMany({});
  await prisma.shipmentLog.deleteMany({});
  await prisma.package.deleteMany({});
  await prisma.shipment.deleteMany({});
  await prisma.courier.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Seeding database...');

  // Hash a password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash('password123', saltRounds);

  // Create users
  const adminUser = await prisma.user.create({
    data: {
      id: randomUUID(),
      dni: '11223344',
      cuit: '20-11223344-5',
      name: 'Admin User',
      password: hashedPassword,
      email: 'admin@example.com',
      role: UserRole.ADMIN,
      cellphone: '+1122334455',
    },
  });

  const transportistUser = await prisma.user.create({
    data: {
      id: randomUUID(),
      dni: '12345678',
      cuit: '20-12345678-9',
      name: 'John Driver',
      password: hashedPassword,
      email: 'driver@example.com',
      role: UserRole.TRANSPORTIST,
      cellphone: '+1234567890',
    },
  });

  const employeeUser = await prisma.user.create({
    data: {
      id: randomUUID(),
      dni: '87654321',
      cuit: '20-87654321-9',
      name: 'Jane Worker',
      password: hashedPassword,
      email: 'worker@example.com',
      role: UserRole.EMPLOYEE,
      cellphone: '+0987654321',
    },
  });

  // Create couriers
  const courier1 = await prisma.courier.create({
    data: {
      id: randomUUID(),
      name: 'OCA',
    },
  });

  const courier2 = await prisma.courier.create({
    data: {
      id: randomUUID(),
      name: 'Despachos Online',
    },
  });

  // Create shipments
  const shipment1 = await prisma.shipment.create({
    data: {
      id: randomUUID(),
      tracking_id: 'TRK12345',
      state: ShipmentState.IN_TRANSIT,
      state_date: new Date(),
      creation_date: new Date(Date.now() - 86400000), // 1 day ago
      transportist_id: transportistUser.id,
      courier_id: courier1.id,
      destination_zip_code: '10001',
      destination_street: 'Main St',
      destination_street_number: '123',
      destination_floor: '4',
      destination_apartment: '4B',
      destination_city: 'New York',
      destination_state: 'NY',
      origin_zip_code: '90210',
      origin_street: 'Palm Dr',
      origin_street_number: '456',
      origin_floor: '1',
      origin_apartment: 'Suite 100',
      origin_city: 'Beverly Hills',
      origin_state: 'CA',
      details: 'Handle with care',
      payment: PaymentStatus.PAGO,
    },
  });

  const shipment2 = await prisma.shipment.create({
    data: {
      id: randomUUID(),
      tracking_id: 'TRK67890',
      state: ShipmentState.DELIVERED,
      state_date: new Date(),
      creation_date: new Date(Date.now() - 172800000), // 2 days ago
      transportist_id: transportistUser.id,
      courier_id: courier2.id,
      destination_zip_code: '90210',
      destination_street: 'Palm Dr',
      destination_street_number: '456',
      destination_floor: '1',
      destination_apartment: 'Suite 100',
      destination_city: 'Beverly Hills',
      destination_state: 'CA',
      origin_zip_code: '10001',
      origin_street: 'Main St',
      origin_street_number: '123',
      origin_floor: '4',
      origin_apartment: '4B',
      origin_city: 'New York',
      origin_state: 'NY',
      details: 'Fragile items inside',
      payment: PaymentStatus.PAGA_DESTINO,
    },
  });

  // Create packages
  const package1 = await prisma.package.create({
    data: {
      id: randomUUID(),
      shipment_id: shipment1.id,
      weight: 2.5,
      height: 30,
      width: 25,
      length: 20,
      package_type: PackageType.ELECTRONICS
    }
  });

  const package2_1 = await prisma.package.create({
    data: {
      id: randomUUID(),
      shipment_id: shipment2.id,
      weight: 1.5,
      height: 20,
      width: 15,
      length: 10,
      package_type: PackageType.PARCEL
    }
  });

  const package2_2 = await prisma.package.create({
    data: {
      id: randomUUID(),
      shipment_id: shipment2.id,
      weight: 3.5,
      height: 40,
      width: 30,
      length: 25,
      package_type: PackageType.FRAGILE
    }
  });

  // Create shipment logs
  const shipmentLog1 = await prisma.shipmentLog.create({
    data: {
      id: randomUUID(),
      shipment_id: shipment1.id,
      old_shipment: { state: 'CREATED' },
      new_shipment: { state: 'IN_TRANSIT' },
      action: LogAction.UPDATE,
      date: new Date(Date.now() - 43200000), // 12 hours ago
    },
  });

  const shipmentLog2 = await prisma.shipmentLog.create({
    data: {
      id: randomUUID(),
      shipment_id: shipment2.id,
      old_shipment: { state: 'IN_TRANSIT' },
      new_shipment: { state: 'DELIVERED' },
      action: LogAction.UPDATE,
      date: new Date(Date.now() - 21600000), // 6 hours ago
    },
  });

  // Create courier shipments
  const courierShipment1 = await prisma.courierShipment.create({
    data: {
      id: randomUUID(),
      shipment_id: shipment1.id,
      courier_id: courier1.id,
      courier_package_id: 'CP12345',
    },
  });

  const courierShipment2 = await prisma.courierShipment.create({
    data: {
      id: randomUUID(),
      shipment_id: shipment2.id,
      courier_id: courier2.id,
      courier_package_id: 'CP67890',
    },
  });

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });