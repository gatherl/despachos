import { PrismaClient, Role } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  // Clean up existing data
  await prisma.courierPackage.deleteMany({});
  await prisma.packageLog.deleteMany({});
  await prisma.package.deleteMany({});
  await prisma.courier.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Seeding database...');

  // Create users
  const user1 = await prisma.user.create({
    data: {
      id: randomUUID(),
      dni: '12345678',
      cult: 'CULT001',
      name: 'John Doe',
      password: 'pass',
      email: 'john@example.com',
      role: Role.USER,
      cellphone: '+1234567890',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      id: randomUUID(),
      dni: '87654321',
      cult: 'CULT002',
      name: 'Jane Smith',
      password: 'pass',
      email: 'jane@example.com',
      role: Role.USER,
      cellphone: '+0987654321',
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      id: randomUUID(),
      dni: '11223344',
      cult: 'CULT003',
      name: 'Admin User',
      password: 'pass',
      email: 'admin@example.com',
      role: Role.ADMIN,
      cellphone: '+1122334455',
    },
  });

  // Create couriers
  const courier1 = await prisma.courier.create({
    data: {
      id: randomUUID(),
      name: 'Fast Delivery Co.',
    },
  });

  const courier2 = await prisma.courier.create({
    data: {
      id: randomUUID(),
      name: 'Express Shipping Ltd.',
    },
  });

  // Create packages
  const package1 = await prisma.package.create({
    data: {
      id: randomUUID(),
      size: 'Medium',
      weight: 2.5,
      tracking_id: 'TRK12345',
      state: 'In Transit',
      state_date: new Date(),
      creation_date: new Date(Date.now() - 86400000), // 1 day ago
      sender_id: user1.id,
      receiver_id: user2.id,
      courier_id: courier1.id,
      destination_zip_code: '10001',
      destination_street: '123 Main St',
      destination_floor: '4',
      destination_city: 'New York',
      destination_state: 'NY',
      destination_country: 'USA',
      destination_apartment: 'Apt 4B',
      destination_btw_st_1: '1st Ave',
      destination_btw_st_2: '2nd Ave',
      origin_zip_code: '90210',
      origin_street: '456 Palm Dr',
      origin_floor: '1',
      origin_city: 'Beverly Hills',
      origin_state: 'CA',
      origin_country: 'USA',
      origin_apartment: 'Suite 100',
      origin_btw_st_1: 'Rodeo Dr',
      origin_btw_st_2: 'Canon Dr',
      details: 'Handle with care',
      units_value: 150.00,
      units_number: 1,
      package_type: 'Electronics',
    },
  });

  const package2 = await prisma.package.create({
    data: {
      id: randomUUID(),
      size: 'Large',
      weight: 5.0,
      tracking_id: 'TRK67890',
      state: 'Delivered',
      state_date: new Date(),
      creation_date: new Date(Date.now() - 172800000), // 2 days ago
      sender_id: user2.id,
      receiver_id: user1.id,
      courier_id: courier2.id,
      destination_zip_code: '90210',
      destination_street: '456 Palm Dr',
      destination_floor: '1',
      destination_city: 'Beverly Hills',
      destination_state: 'CA',
      destination_country: 'USA',
      destination_apartment: 'Suite 100',
      destination_btw_st_1: 'Rodeo Dr',
      destination_btw_st_2: 'Canon Dr',
      origin_zip_code: '10001',
      origin_street: '123 Main St',
      origin_floor: '4',
      origin_city: 'New York',
      origin_state: 'NY',
      origin_country: 'USA',
      origin_apartment: 'Apt 4B',
      origin_btw_st_1: '1st Ave',
      origin_btw_st_2: '2nd Ave',
      details: 'Fragile items inside',
      units_value: 250.00,
      units_number: 2,
      package_type: 'Clothing',
    },
  });

  // Create package logs
  const packageLog1 = await prisma.packageLog.create({
    data: {
      id: randomUUID(),
      package_id: package1.id,
      old_package: { state: 'Created' },
      new_package: { state: 'In Transit' },
      action: 'Status Update',
      date: new Date(Date.now() - 43200000), // 12 hours ago
    },
  });

  const packageLog2 = await prisma.packageLog.create({
    data: {
      id: randomUUID(),
      package_id: package2.id,
      old_package: { state: 'In Transit' },
      new_package: { state: 'Delivered' },
      action: 'Status Update',
      date: new Date(Date.now() - 21600000), // 6 hours ago
    },
  });

  // Create courier packages
  const courierPackage1 = await prisma.courierPackage.create({
    data: {
      id: randomUUID(),
      package_id: package1.id,
      courier_id: courier1.id,
      courier_package_id: 'CP12345',
    },
  });

  const courierPackage2 = await prisma.courierPackage.create({
    data: {
      id: randomUUID(),
      package_id: package2.id,
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