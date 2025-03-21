import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

// GET a specific package
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const package_ = await prisma.package.findUnique({
      where: { id },
      include: {
        sender: true,
        receiver: true,
        courier: true,
        packageLogs: {
          orderBy: {
            date: 'desc',
          },
        },
        courierPackages: {
          include: {
            courier: true,
          },
        },
      },
    });
    
    if (!package_) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }
    
    return NextResponse.json(package_);
  } catch (error) {
    console.error('Error fetching package:', error);
    return NextResponse.json({ error: 'Failed to fetch package' }, { status: 500 });
  }
}

// PUT - Update a package completely
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const data = await request.json();
    
    // Get the existing package before updating
    const existingPackage = await prisma.package.findUnique({
      where: { id },
    });
    
    if (!existingPackage) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }
    
    // Update the package
    const updatedPackage = await prisma.package.update({
      where: { id },
      data,
      include: {
        sender: true,
        receiver: true,
        courier: true,
      },
    });
    
    // Create package log if state changed
    if (data.state && data.state !== existingPackage.state) {
      await prisma.packageLog.create({
        data: {
          id: randomUUID(),
          package_id: id,
          old_package: { state: existingPackage.state },
          new_package: { state: data.state },
          action: 'Status Update',
        },
      });
    }
    
    return NextResponse.json(updatedPackage);
  } catch (error) {
    console.error('Error updating package:', error);
    return NextResponse.json({ error: 'Failed to update package' }, { status: 500 });
  }
}

// PATCH - Update specific fields of a package
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const data = await request.json();
    
    // Get the existing package before updating
    const existingPackage = await prisma.package.findUnique({
      where: { id },
    });
    
    if (!existingPackage) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }
    
    // Update the package with only the provided fields
    const updatedPackage = await prisma.package.update({
      where: { id },
      data,
      include: {
        sender: true,
        receiver: true,
        courier: true,
      },
    });
    
    // Create package log if state changed
    if (data.state && data.state !== existingPackage.state) {
      await prisma.packageLog.create({
        data: {
          id: randomUUID(),
          package_id: id,
          old_package: { state: existingPackage.state },
          new_package: { state: data.state },
          action: 'Status Update',
        },
      });
    }
    
    return NextResponse.json(updatedPackage);
  } catch (error) {
    console.error('Error updating package:', error);
    return NextResponse.json({ error: 'Failed to update package' }, { status: 500 });
  }
}

// DELETE - Remove a package
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Check if package exists
    const existingPackage = await prisma.package.findUnique({
      where: { id },
    });
    
    if (!existingPackage) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }
    
    // Delete associated courier packages first
    await prisma.courierPackage.deleteMany({
      where: { package_id: id },
    });
    
    // Delete associated package logs
    await prisma.packageLog.deleteMany({
      where: { package_id: id },
    });
    
    // Delete the package
    await prisma.package.delete({
      where: { id },
    });
    
    return NextResponse.json({ message: 'Package deleted successfully' });
  } catch (error) {
    console.error('Error deleting package:', error);
    return NextResponse.json({ error: 'Failed to delete package' }, { status: 500 });
  }
}