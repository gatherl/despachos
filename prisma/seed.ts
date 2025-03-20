import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data (optional - be careful in production)
  await prisma.$transaction([
    prisma.courierPackage.deleteMany({}),
    prisma.packageLog.deleteMany({}),
    prisma.package.deleteMany({}),
    prisma.courier.deleteMany({}),
    prisma.user.deleteMany({}),
  ]);
  // Test commit
  console.log('Database cleaned');

  // Create users with different roles
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'John Admin',
        email: 'admin@example.com',
        password: 'admin123', // In production, use hashed passwords
        role: 'ADMIN',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Alice User',
        email: 'alice@example.com',
        password: 'alice123',
        role: 'USER',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Bob User',
        email: 'bob@example.com',
        password: 'bob123',
        role: 'USER',
      },
    }),
  ]);

  console.log('Created users:', users);

  // Create couriers
  const couriers = await Promise.all([
    prisma.courier.create({
      data: {
        name: 'Express Delivery',
      },
    }),
    prisma.courier.create({
      data: {
        name: 'Global Shipping',
      },
    }),
    prisma.courier.create({
      data: {
        name: 'Fast Track Logistics',
      },
    }),
  ]);

  console.log('Created couriers:', couriers);

  // Create packages
  const packages = await Promise.all([
    prisma.package.create({
      data: {
        destination: 'New York, NY',
        origin: 'Los Angeles, CA',
        size: 'Medium',
        weight: 2.5,
        state: 'Processing',
        state_date: new Date(),
        sender: {
          connect: { id: users[1].id }, // Alice
        },
        courier: {
          connect: { id: couriers[0].id }, // Express Delivery
        },
      },
    }),
    prisma.package.create({
      data: {
        destination: 'Chicago, IL',
        origin: 'Miami, FL',
        size: 'Large',
        weight: 5.8,
        state: 'In Transit',
        state_date: new Date(),
        sender: {
          connect: { id: users[1].id }, // Alice
        },
        courier: {
          connect: { id: couriers[1].id }, // Global Shipping
        },
      },
    }),
    prisma.package.create({
      data: {
        destination: 'Seattle, WA',
        origin: 'Boston, MA',
        size: 'Small',
        weight: 1.2,
        state: 'Delivered',
        state_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        sender: {
          connect: { id: users[2].id }, // Bob
        },
        courier: {
          connect: { id: couriers[2].id }, // Fast Track Logistics
        },
      },
    }),
    prisma.package.create({
      data: {
        destination: 'Austin, TX',
        origin: 'Portland, OR',
        size: 'Medium',
        weight: 3.1,
        state: 'Processing',
        state_date: new Date(),
        sender: {
          connect: { id: users[2].id }, // Bob
        },
        // No courier assigned yet
      },
    }),
  ]);

  console.log('Created packages:', packages);

  // Create package logs
  const packageLogs = await Promise.all([
    prisma.packageLog.create({
      data: {
        package: {
          connect: { id: packages[0].id },
        },
        old_package: null, // Initial state
        new_package: { ...packages[0], id: undefined, courier_id: undefined, sender_id: undefined },
        action: 'CREATE',
        date: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      },
    }),
    prisma.packageLog.create({
      data: {
        package: {
          connect: { id: packages[1].id },
        },
        old_package: { state: 'Processing' },
        new_package: { state: 'In Transit' },
        action: 'UPDATE_STATE',
        date: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      },
    }),
    prisma.packageLog.create({
      data: {
        package: {
          connect: { id: packages[2].id },
        },
        old_package: { state: 'In Transit' },
        new_package: { state: 'Delivered' },
        action: 'UPDATE_STATE',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
    }),
  ]);

  console.log('Created package logs:', packageLogs);

  // Create courier packages (junction table entries)
  const courierPackages = await Promise.all([
    prisma.courierPackage.create({
      data: {
        package: {
          connect: { id: packages[0].id },
        },
        courier: {
          connect: { id: couriers[0].id },
        },
        courier_package_id: 'EXP-12345',
      },
    }),
    prisma.courierPackage.create({
      data: {
        package: {
          connect: { id: packages[1].id },
        },
        courier: {
          connect: { id: couriers[1].id },
        },
        courier_package_id: 'GS-67890',
      },
    }),
    prisma.courierPackage.create({
      data: {
        package: {
          connect: { id: packages[2].id },
        },
        courier: {
          connect: { id: couriers[2].id },
        },
        courier_package_id: 'FTL-54321',
      },
    }),
  ]);

  console.log('Created courier packages:', courierPackages);

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });