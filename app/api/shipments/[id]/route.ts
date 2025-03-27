// app/api/shipments/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, ShipmentState, PackageType, LogAction } from '@prisma/client';
import { randomUUID } from 'crypto';

// Create a single PrismaClient instance and export it
const prisma = new PrismaClient();

// GET a specific shipment
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Using await on context.params to satisfy Next.js requirement
    const { id } = await context.params;
    console.log('Fetching shipment with ID:', id);
    
    const shipment = await prisma.shipment.findUnique({
      where: { id },
      include: {
        transportist: true,
        courier: true,
        shipmentLogs: {
          orderBy: {
            date: 'desc',
          },
        },
        courierShipments: {
          include: {
            courier: true,
          },
        },
        packages: true
      },
    });
    
    if (!shipment) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
    }
    
    return NextResponse.json(shipment);
  } catch (error) {
    console.error('Error fetching shipment:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch shipment',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// ... rest of the code remains the same

// PUT - Update a shipment completely
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Using await on context.params to satisfy Next.js requirement
    const { id } = await context.params;
    const data = await request.json();
    
    // Get the existing shipment before updating
    const existingShipment = await prisma.shipment.findUnique({
      where: { id },
    });
    
    if (!existingShipment) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
    }
    
    // Handle packages separately
    const packagesData = data.packages || [];
    delete data.packages;
    
    // Convert string values to enum values if provided
    let stateValue = undefined;
    if (data.state) {
      stateValue = data.state.toUpperCase() as keyof typeof ShipmentState;
    }
    
    // Prepare update data
    const updateData = {
      ...data,
      state: stateValue ? ShipmentState[stateValue] : undefined,
      state_date: data.state_date ? new Date(data.state_date) : undefined,
    };
    
    // Update the shipment
    const updatedShipment = await prisma.shipment.update({
      where: { id },
      data: updateData,
      include: {
        transportist: true,
        courier: true,
      },
    });
    
    // Create shipment log if state changed
    if (data.state && data.state !== existingShipment.state) {
      await prisma.shipmentLog.create({
        data: {
          id: randomUUID(),
          shipment_id: id,
          old_shipment: { state: existingShipment.state },
          new_shipment: { state: updatedShipment.state },
          action: LogAction.UPDATE,
        },
      });
    }
    
    // Handle packages if provided
    if (packagesData.length > 0) {
      // Get existing packages
      const existingPackages = await prisma.package.findMany({
        where: { shipment_id: id },
      });
      
      const existingIds = existingPackages.map(pkg => pkg.id);
      const newPackageIds = packagesData
        .map((pkg: any) => pkg.id)
        .filter((id: string | undefined) => id);
      
      // Delete packages that are no longer in the list
      const packagesToDelete = existingIds.filter(pkgId => !newPackageIds.includes(pkgId));
      if (packagesToDelete.length > 0) {
        await prisma.package.deleteMany({
          where: { id: { in: packagesToDelete } },
        });
      }
      
      // Update or create packages
      for (const packageData of packagesData) {
        // Convert package type string to enum if present
        let packageType = undefined;
        if (packageData.package_type) {
          const packageTypeValue = packageData.package_type.toUpperCase() as keyof typeof PackageType;
          packageType = PackageType[packageTypeValue] || undefined;
        }
        
        if (packageData.id && existingIds.includes(packageData.id)) {
          // Update existing package
          await prisma.package.update({
            where: { id: packageData.id },
            data: {
              weight: packageData.weight,
              height: packageData.height,
              width: packageData.width,
              length: packageData.length,
              package_type: packageType,
            },
          });
        } else {
          // Create new package
          await prisma.package.create({
            data: {
              id: packageData.id || randomUUID(),
              shipment_id: id,
              weight: packageData.weight,
              height: packageData.height || null,
              width: packageData.width || null,
              length: packageData.length || null,
              package_type: packageType || PackageType.PARCEL,
            },
          });
        }
      }
    }
    
    // Get the updated shipment with all related data
    const fullUpdatedShipment = await prisma.shipment.findUnique({
      where: { id },
      include: {
        transportist: true,
        courier: true,
        packages: true,
      },
    });
    
    return NextResponse.json(fullUpdatedShipment);
  } catch (error) {
    console.error('Error updating shipment:', error);
    return NextResponse.json({ 
      error: 'Failed to update shipment',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PATCH - Update specific fields of a shipment
export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Using await on context.params to satisfy Next.js requirement
    const { id } = await context.params;
    const data = await request.json();
    
    // Get the existing shipment before updating
    const existingShipment = await prisma.shipment.findUnique({
      where: { id },
    });
    
    if (!existingShipment) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
    }
    
    // Handle packages separately if provided
    const packagesData = data.packages || [];
    delete data.packages;
    
    // Convert string values to enum values if provided
    let updateData = { ...data };
    
    if (data.state) {
      const stateValue = data.state.toUpperCase() as keyof typeof ShipmentState;
      updateData.state = ShipmentState[stateValue];
    }
    
    // Update the shipment with only the provided fields
    const updatedShipment = await prisma.shipment.update({
      where: { id },
      data: updateData,
      include: {
        transportist: true,
        courier: true,
      },
    });
    
    // Create shipment log if state changed
    if (data.state && data.state !== existingShipment.state) {
      await prisma.shipmentLog.create({
        data: {
          id: randomUUID(),
          shipment_id: id,
          old_shipment: { state: existingShipment.state },
          new_shipment: { state: updatedShipment.state },
          action: LogAction.UPDATE,
        },
      });
    }
    
    // Handle packages if provided
    if (packagesData.length > 0) {
      // Get existing packages
      const existingPackages = await prisma.package.findMany({
        where: { shipment_id: id },
      });
      
      const existingIds = existingPackages.map(pkg => pkg.id);
      const newPackageIds = packagesData
        .map((pkg: any) => pkg.id)
        .filter((id: string | undefined) => id);
      
      // Delete packages that are no longer in the list
      const packagesToDelete = existingIds.filter(pkgId => !newPackageIds.includes(pkgId));
      if (packagesToDelete.length > 0) {
        await prisma.package.deleteMany({
          where: { id: { in: packagesToDelete } },
        });
      }
      
      // Update or create packages
      for (const packageData of packagesData) {
        // Convert package type string to enum if present
        let packageType = undefined;
        if (packageData.package_type) {
          const packageTypeValue = packageData.package_type.toUpperCase() as keyof typeof PackageType;
          packageType = PackageType[packageTypeValue] || undefined;
        }
        
        if (packageData.id && existingIds.includes(packageData.id)) {
          // Update existing package
          await prisma.package.update({
            where: { id: packageData.id },
            data: {
              weight: packageData.weight,
              height: packageData.height,
              width: packageData.width,
              length: packageData.length,
              package_type: packageType,
            },
          });
        } else {
          // Create new package
          await prisma.package.create({
            data: {
              id: packageData.id || randomUUID(),
              shipment_id: id,
              weight: packageData.weight,
              height: packageData.height || null,
              width: packageData.width || null,
              length: packageData.length || null,
              package_type: packageType || PackageType.PARCEL,
            },
          });
        }
      }
    }
    
    // Get the updated shipment with all related data
    const fullUpdatedShipment = await prisma.shipment.findUnique({
      where: { id },
      include: {
        transportist: true,
        courier: true,
        packages: true,
      },
    });
    
    return NextResponse.json(fullUpdatedShipment);
  } catch (error) {
    console.error('Error updating shipment:', error);
    return NextResponse.json({ 
      error: 'Failed to update shipment',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE - Remove a shipment
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Using await on context.params to satisfy Next.js requirement
    const { id } = await context.params;
    
    // Check if shipment exists
    const existingShipment = await prisma.shipment.findUnique({
      where: { id },
    });
    
    if (!existingShipment) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
    }
    
    // Delete in reverse order of dependencies
    
    // Delete associated courier shipments
    await prisma.courierShipment.deleteMany({
      where: { shipment_id: id },
    });
    
    // Delete associated shipment logs
    await prisma.shipmentLog.deleteMany({
      where: { shipment_id: id },
    });
    
    // Delete associated packages
    await prisma.package.deleteMany({
      where: { shipment_id: id },
    });
    
    // Create a delete log before deleting the shipment
    await prisma.shipmentLog.create({
      data: {
        id: randomUUID(),
        shipment_id: id,
        old_shipment: {
          id: existingShipment.id,
          tracking_id: existingShipment.tracking_id,
          state: existingShipment.state
        },
        new_shipment: {},
        action: LogAction.DELETE,
      }
    });
    
    // Delete the shipment
    await prisma.shipment.delete({
      where: { id },
    });
    
    return NextResponse.json({ message: 'Shipment deleted successfully' });
  } catch (error) {
    console.error('Error deleting shipment:', error);
    return NextResponse.json({ 
      error: 'Failed to delete shipment',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}