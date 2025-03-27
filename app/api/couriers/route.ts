import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

// GET all couriers
export async function GET(request: NextRequest) {
  try {
    const couriers = await prisma.courier.findMany({
      include: {
        shipments: {
          select: {
            id: true,
            tracking_id: true,
            state: true,
          },
        },
      },
    });
    
    return NextResponse.json(couriers);
  } catch (error) {
    console.error('Error fetching couriers:', error);
    return NextResponse.json({ error: 'Failed to fetch couriers' }, { status: 500 });
  }
}

// POST - Create a new courier
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Check for required fields
    if (!data.name) {
      return NextResponse.json({ error: 'Missing required field: name' }, { status: 400 });
    }
    
    // Create the courier
    const newCourier = await prisma.courier.create({
      data: {
        id: data.id || randomUUID(),
        name: data.name,
      },
    });
    
    return NextResponse.json(newCourier, { status: 201 });
  } catch (error) {
    console.error('Error creating courier:', error);
    return NextResponse.json({ error: 'Failed to create courier' }, { status: 500 });
  }
}