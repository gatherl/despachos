// app/api/shipments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, ShipmentState, PaymentStatus, LogAction, PackageType } from '@prisma/client';
import { randomUUID } from 'crypto';
import QRCode from 'qrcode';

// Create a new Prisma client
const prisma = new PrismaClient();

// GET all shipments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trackingId = searchParams.get('tracking_id');
    
    if (trackingId) {
      // Find by tracking ID
      const shipment = await prisma.shipment.findUnique({
        where: { tracking_id: trackingId },
        include: {
          transportist: true,
          courier: true,
          shipmentLogs: true,
          packages: true
        },
      });
      
      if (!shipment) {
        return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
      }
      
      return NextResponse.json(shipment);
    }
    
    // Get all shipments
    const shipments = await prisma.shipment.findMany({
      include: {
        transportist: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        courier: true,
        packages: true
      },
    });
    
    return NextResponse.json(shipments);
  } catch (error) {
    console.error('Error fetching shipments:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch shipments',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST - Create a new shipment
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log("Creating new shipment with data:", data);
    
    // Generate tracking ID if not provided
    if (!data.tracking_id) {
      data.tracking_id = `TRK${Math.floor(Math.random() * 1000000)}`;
    }
    
    // Ensure required fields are present
    const requiredFields = [
      'destination_zip_code', 'destination_street', 'destination_street_number',
      'destination_city', 'destination_state',
      'origin_zip_code', 'origin_street', 'origin_street_number',
      'origin_city', 'origin_state',
      'payment'
    ];
    
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }
    
    // Extract packages data
    const packagesData = data.packages || [];
    delete data.packages;
    
    // Convert string values to enum values
    const stateValue = data.state ? 
      data.state.toUpperCase() as keyof typeof ShipmentState : 'CREATED';
    
    const paymentValue = data.payment ? 
      data.payment.replace(/\s+/g, '_').toUpperCase() as keyof typeof PaymentStatus : 'NO_PAGO';
    
    // Set default state if not provided
    const state = ShipmentState[stateValue] || ShipmentState.CREATED;
    const payment = PaymentStatus[paymentValue] || PaymentStatus.NO_PAGO;
    
    // Generate shipment ID 
    const shipmentId = randomUUID();
    
    // Extract sender and receiver information
    const senderInfo = {
      sender_name: data.sender_name,
      sender_dni: data.sender_dni,
      sender_phone: data.sender_phone,
      sender_email: data.sender_email
    };
    
    const receiverInfo = {
      receiver_name: data.receiver_name,
      receiver_dni: data.receiver_dni,
      receiver_phone: data.receiver_phone,
      receiver_email: data.receiver_email
    };
    
    // Create the shipment record with sender and receiver info
    const newShipment = await prisma.shipment.create({
      data: {
        id: shipmentId,
        tracking_id: data.tracking_id,
        state: state,
        state_date: new Date(),
        courier_id: data.courier_id,
        transportist_id: data.transportist_id,
        details: data.details || '',
        
        // Sender information
        sender_name: senderInfo.sender_name,
        sender_dni: senderInfo.sender_dni,
        sender_phone: senderInfo.sender_phone,
        
        // Receiver information
        receiver_name: receiverInfo.receiver_name,
        receiver_dni: receiverInfo.receiver_dni,
        receiver_phone: receiverInfo.receiver_phone,
        
        // Destination address
        destination_zip_code: data.destination_zip_code,
        destination_street: data.destination_street,
        destination_street_number: data.destination_street_number,
        destination_floor: data.destination_floor,
        destination_apartment: data.destination_apartment,
        destination_city: data.destination_city,
        destination_state: data.destination_state,
        
        // Origin address
        origin_zip_code: data.origin_zip_code,
        origin_street: data.origin_street,
        origin_street_number: data.origin_street_number,
        origin_floor: data.origin_floor,
        origin_apartment: data.origin_apartment,
        origin_city: data.origin_city,
        origin_state: data.origin_state,
        
        payment: payment,
      },
      include: {
        transportist: true,
        courier: true,
      },
    });
    
    // Create shipment log
    await prisma.shipmentLog.create({
      data: {
        id: randomUUID(),
        shipment_id: newShipment.id,
        old_shipment: {},
        new_shipment: { 
          state: newShipment.state,
          tracking_id: newShipment.tracking_id
        },
        action: LogAction.CREATE,
      }
    });
    
    // Create packages
    for (const packageData of packagesData) {
      // Convert package type string to enum
      const packageTypeValue = packageData.package_type ? 
        packageData.package_type.toUpperCase() as keyof typeof PackageType : 'PARCEL';
      
      const packageType = PackageType[packageTypeValue] || PackageType.PARCEL;
      
      await prisma.package.create({
        data: {
          id: randomUUID(),
          shipment_id: newShipment.id,
          weight: packageData.weight,
          height: packageData.height || null,
          width: packageData.width || null,
          length: packageData.length || null,
          package_type: packageType,
        }
      });
    }
    
    // Generate QR code for tracking
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const trackingUrl = `${baseUrl}/tracking?tracking_id=${newShipment.tracking_id}`;
    const qrCodeDataUrl = await QRCode.toDataURL(trackingUrl);
    
    // Get the full shipment data with packages
    const fullShipment = await prisma.shipment.findUnique({
      where: { id: newShipment.id },
      include: {
        transportist: true,
        courier: true,
        packages: true,
      },
    });
    
    return NextResponse.json({
      ...fullShipment,
      qrCodeDataUrl,
      trackingUrl,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating shipment:', error);
    return NextResponse.json({ 
      error: 'Failed to create shipment',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}