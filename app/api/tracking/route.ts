import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * API endpoint specifically for tracking shipments by tracking_id
 * This provides a streamlined, dedicated endpoint just for tracking
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trackingId = searchParams.get('tracking_id');
    
    if (!trackingId) {
      return NextResponse.json({ 
        error: 'Missing required query parameter: tracking_id' 
      }, { status: 400 });
    }
    
    // Find shipment by tracking ID with essential tracking info
    const shipment = await prisma.shipment.findUnique({
      where: { tracking_id: trackingId },
      include: {
        shipmentLogs: {
          select: {
            date: true,
            new_shipment: true
          },
          orderBy: {
            date: 'asc'
          }
        },
        packages: {
          select: {
            id: true,
            weight: true,
            package_type: true
          }
        },
        courier: {
          select: {
            name: true
          }
        }
      },
    });
    
    if (!shipment) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
    }
    
    // Calculate estimated delivery date (7 days from creation)
    const creationDate = new Date(shipment.creation_date);
    const estimatedDelivery = new Date(creationDate);
    estimatedDelivery.setDate(creationDate.getDate() + 7);
    
    // Prepare tracking response with only necessary info for public view
    const trackingResponse = {
      tracking_id: shipment.tracking_id,
      state: shipment.state,
      state_date: shipment.state_date,
      creation_date: shipment.creation_date,
      estimated_delivery: estimatedDelivery,
      destination_city: shipment.destination_city,
      destination_state: shipment.destination_state,
      origin_city: shipment.origin_city,
      origin_state: shipment.origin_state,
      courier: shipment.courier?.name,
      shipmentLogs: shipment.shipmentLogs,
      packages: shipment.packages.map(pkg => ({
        id: pkg.id,
        weight: pkg.weight,
        type: pkg.package_type
      }))
    };
    
    return NextResponse.json(trackingResponse);
  } catch (error) {
    console.error('Error fetching tracking info:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch tracking information',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}