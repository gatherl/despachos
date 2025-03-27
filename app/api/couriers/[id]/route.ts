import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET a specific courier
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const courier = await prisma.courier.findUnique({
      where: { id },
      include: {
        shipments: {
          select: {
            id: true,
            tracking_id: true,
            state: true,
            creation_date: true,
            sender: {
              select: {
                id: true,
                name: true,
              },
            },
            receiver: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        courierShipments: {
          include: {
            shipment: {
              select: {
                id: true,
                tracking_id: true,
                state: true,
              },
            },
          },
        },
      },
    });
    
    if (!courier) {
      return NextResponse.json({ error: 'Courier not found' }, { status: 404 });
    }
    
    return NextResponse.json(courier);
  } catch (error) {
    console.error('Error fetching courier:', error);
    return NextResponse.json({ error: 'Failed to fetch courier' }, { status: 500 });
  }
}

// PUT - Update a courier completely
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const data = await request.json();
    
    // Check if courier exists
    const existingCourier = await prisma.courier.findUnique({
      where: { id },
    });
    
    if (!existingCourier) {
      return NextResponse.json({ error: 'Courier not found' }, { status: 404 });
    }
    
    // Check for required fields
    if (!data.name) {
      return NextResponse.json({ error: 'Missing required field: name' }, { status: 400 });
    }
    
    // Update the courier
    const updatedCourier = await prisma.courier.update({
      where: { id },
      data: {
        name: data.name,
      },
    });
    
    return NextResponse.json(updatedCourier);
  } catch (error) {
    console.error('Error updating courier:', error);
    return NextResponse.json({ error: 'Failed to update courier' }, { status: 500 });
  }
}

// PATCH - Update specific fields of a courier
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const data = await request.json();
    
    // Check if courier exists
    const existingCourier = await prisma.courier.findUnique({
      where: { id },
    });
    
    if (!existingCourier) {
      return NextResponse.json({ error: 'Courier not found' }, { status: 404 });
    }
    
    // Update the courier with only the provided fields
    const updatedCourier = await prisma.courier.update({
      where: { id },
      data,
    });
    
    return NextResponse.json(updatedCourier);
  } catch (error) {
    console.error('Error updating courier:', error);
    return NextResponse.json({ error: 'Failed to update courier' }, { status: 500 });
  }
}

// DELETE - Remove a courier
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Check if courier exists
    const existingCourier = await prisma.courier.findUnique({
      where: { id },
      include: {
        shipments: true,
        courierShipments: true,
      },
    });
    
    if (!existingCourier) {
      return NextResponse.json({ error: 'Courier not found' }, { status: 404 });
    }
    
    // Check if courier has associated shipments
    if (existingCourier.shipments.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete courier with associated shipments. Update shipments first.' 
      }, { status: 400 });
    }
    
    // Delete associated courier shipments
    if (existingCourier.courierShipments.length > 0) {
      await prisma.courierShipment.deleteMany({
        where: { courier_id: id },
      });
    }
    
    // Delete the courier
    await prisma.courier.delete({
      where: { id },
    });
    
    return NextResponse.json({ message: 'Courier deleted successfully' });
  } catch (error) {
    console.error('Error deleting courier:', error);
    return NextResponse.json({ error: 'Failed to delete courier' }, { status: 500 });
  }
}