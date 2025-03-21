import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import QRCode from 'qrcode';


const prisma = new PrismaClient();

// GET all packages
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trackingId = searchParams.get('tracking_id');
    
    if (trackingId) {
      // Find by tracking ID
      const package_ = await prisma.package.findUnique({
        where: { tracking_id: trackingId },
        include: {
          sender: true,
          receiver: true,
          courier: true,
          packageLogs: true,
        },
      });
      
      if (!package_) {
        return NextResponse.json({ error: 'Package not found' }, { status: 404 });
      }
      
      return NextResponse.json(package_);
    }
    
    // Get all packages
    const packages = await prisma.package.findMany({
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        courier: true,
      },
    });
    
    return NextResponse.json(packages);
  } catch (error) {
    console.error('Error fetching packages:', error);
    return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 });
  }
}

// POST - Create a new package
export async function POST(request: NextRequest) {
    try {
      const data = await request.json();
      
      // Generate tracking ID if not provided
      if (!data.tracking_id) {
        data.tracking_id = `TRK${Math.floor(Math.random() * 1000000)}`;
      }
      
      // Ensure required fields are present
      const requiredFields = [
        'size', 'weight', 'sender_id', 'receiver_id', 
        'destination_zip_code', 'destination_street', 'destination_floor',
        'destination_city', 'destination_state', 'destination_country',
        'destination_btw_st_1', 'destination_btw_st_2',
        'origin_zip_code', 'origin_street', 'origin_floor',
        'origin_city', 'origin_state', 'origin_country', 'origin_apartment',
        'origin_btw_st_1', 'origin_btw_st_2', 
        'units_value', 'units_number', 'package_type'
      ];
      
      for (const field of requiredFields) {
        if (!data[field]) {
          return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
        }
      }
      
      // Set default state if not provided
      if (!data.state) {
        data.state = 'Created';
      }
      
      // Set state date if not provided
      if (!data.state_date) {
        data.state_date = new Date();
      }
      
      // Generate package ID if not provided
      const packageId = data.id || randomUUID();
      
      const newPackage = await prisma.package.create({
        data: {
          id: packageId,
          ...data
        },
        include: {
          sender: true,
          receiver: true,
          courier: true,
        },
      });
      
      // Create initial package log
      await prisma.packageLog.create({
        data: {
          id: randomUUID(),
          package_id: newPackage.id,
          old_package: { state: 'None' },
          new_package: { state: newPackage.state },
          action: 'Package Created',
        },
      });
      
      // Generate QR code URL for the package
      // This URL points to the package detail page
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const packageUrl = `${baseUrl}/packages/${packageId}`;
      
      // Generate QR code as data URL
      const qrCodeDataUrl = await QRCode.toDataURL(packageUrl);
      
      return NextResponse.json({ 
        ...newPackage, 
        qrCodeDataUrl,
        trackingUrl: packageUrl 
      }, { status: 201 });
    } catch (error) {
      console.error('Error creating package:', error);
      return NextResponse.json({ error: 'Failed to create package' }, { status: 500 });
    }
  }

// Other methods like PUT, PATCH, DELETE will be handled in the [id] route