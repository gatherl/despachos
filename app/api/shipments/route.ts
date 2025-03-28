// app/api/shipments/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  PrismaClient,
  ShipmentState,
  PaymentStatus,
  LogAction,
  PackageType,
} from "@prisma/client";
import { randomUUID } from "crypto";
import QRCode from "qrcode";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// Create a new Prisma client
const prisma = new PrismaClient();

// GET all shipments
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const tracking_id = searchParams.get("tracking_id");
    const state = searchParams.get("state");

    // If tracking ID is provided, redirect to the dedicated tracking endpoint
    // or handle it here if you prefer
    if (tracking_id) {
      // Option 1: Redirect to the dedicated tracking endpoint
      // return NextResponse.redirect(`/api/tracking?tracking_id=${tracking_id}`);

      // Option 2: Handle it directly here for backward compatibility
      const shipment = await prisma.shipment.findUnique({
        where: { tracking_id },
        include: {
          shipmentLogs: {
            select: {
              date: true,
              new_shipment: true,
            },
            orderBy: {
              date: "asc",
            },
          },
          packages: {
            select: {
              id: true,
              weight: true,
              package_type: true,
            },
          },
          courier: {
            select: {
              name: true,
            },
          },
        },
      });

      if (!shipment) {
        return NextResponse.json(
          { error: "Shipment not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(shipment);
    }

    // For all other operations, require authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check role-based access
    const userRole = session.user.role;
    if (
      userRole !== "ADMIN" &&
      userRole !== "EMPLOYEE" &&
      userRole !== "TRANSPORTIST"
    ) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // Build where clause based on filters
    let whereClause: any = {};

    // Filter by state if provided
    if (state) {
      whereClause.state = state;
    }

    // For transportists, only show their shipments
    if (userRole === "TRANSPORTIST") {
      whereClause.transportist_id = session.user.id;
    }

    // Get filtered shipments
    const shipments = await prisma.shipment.findMany({
      where: whereClause,
      include: {
        transportist: {
          select: {
            id: true,
            name: true,
          },
        },
        courier: {
          select: {
            id: true,
            name: true,
          },
        },
        packages: {
          select: {
            id: true,
            weight: true,
            package_type: true,
          },
        },
      },
      orderBy: {
        creation_date: "desc",
      },
    });

    return NextResponse.json(shipments);
  } catch (error) {
    console.error("Error fetching shipments:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch shipments",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
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
      "destination_zip_code",
      "destination_street",
      "destination_street_number",
      "destination_city",
      "destination_state",
      "origin_zip_code",
      "origin_street",
      "origin_street_number",
      "origin_city",
      "origin_state",
      "payment",
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Extract packages data
    const packagesData = data.packages || [];
    delete data.packages;

    // Convert string values to enum values
    const stateValue = data.state
      ? (data.state.toUpperCase() as keyof typeof ShipmentState)
      : "CREATED";

    const paymentValue = data.payment
      ? (data.payment
          .replace(/\s+/g, "_")
          .toUpperCase() as keyof typeof PaymentStatus)
      : "NO_PAGO";

    // Set default state if not provided
    const state = ShipmentState[stateValue] || ShipmentState.CREATED;
    const payment = PaymentStatus[paymentValue] || PaymentStatus.NO_PAGO;

    // Generate shipment ID
    const shipmentId = randomUUID();

    // Extract and process sender information with split names
    const senderInfo = {
      sender_name:
        data.sender_name ||
        `${data.sender_first_name || ""} ${data.sender_last_name || ""}`.trim(),
      sender_first_name: data.sender_first_name,
      sender_last_name: data.sender_last_name,
      sender_dni: data.sender_dni,
      sender_phone: data.sender_phone,
      sender_email: data.sender_email,
    };

    // If only full name is provided but not first/last names, try to split it
    if (
      senderInfo.sender_name &&
      (!senderInfo.sender_first_name || !senderInfo.sender_last_name)
    ) {
      const nameParts = senderInfo.sender_name.split(" ");
      if (nameParts.length > 1) {
        senderInfo.sender_first_name = nameParts[0];
        senderInfo.sender_last_name = nameParts.slice(1).join(" ");
      } else {
        senderInfo.sender_first_name = senderInfo.sender_name;
        senderInfo.sender_last_name = "";
      }
    }

    // Extract and process receiver information with split names
    const receiverInfo = {
      receiver_name:
        data.receiver_name ||
        `${data.receiver_first_name || ""} ${
          data.receiver_last_name || ""
        }`.trim(),
      receiver_first_name: data.receiver_first_name,
      receiver_last_name: data.receiver_last_name,
      receiver_dni: data.receiver_dni,
      receiver_phone: data.receiver_phone,
      receiver_email: data.receiver_email,
    };

    // If only full name is provided but not first/last names, try to split it
    if (
      receiverInfo.receiver_name &&
      (!receiverInfo.receiver_first_name || !receiverInfo.receiver_last_name)
    ) {
      const nameParts = receiverInfo.receiver_name.split(" ");
      if (nameParts.length > 1) {
        receiverInfo.receiver_first_name = nameParts[0];
        receiverInfo.receiver_last_name = nameParts.slice(1).join(" ");
      } else {
        receiverInfo.receiver_first_name = receiverInfo.receiver_name;
        receiverInfo.receiver_last_name = "";
      }
    }

    // Create the shipment record with sender and receiver info
    const newShipment = await prisma.shipment.create({
      data: {
        id: shipmentId,
        tracking_id: data.tracking_id,
        state: state,
        state_date: new Date(),
        courier_id: data.courier_id,
        transportist_id: data.transportist_id,
        details: data.details || "",

        // Sender information with split names
        sender_name: senderInfo.sender_name,
        sender_first_name: senderInfo.sender_first_name,
        sender_last_name: senderInfo.sender_last_name,
        sender_dni: senderInfo.sender_dni,
        sender_phone: senderInfo.sender_phone,
        sender_email: senderInfo.sender_email,

        // Receiver information with split names
        receiver_name: receiverInfo.receiver_name,
        receiver_first_name: receiverInfo.receiver_first_name,
        receiver_last_name: receiverInfo.receiver_last_name,
        receiver_dni: receiverInfo.receiver_dni,
        receiver_phone: receiverInfo.receiver_phone,
        receiver_email: receiverInfo.receiver_email,

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

    // Rest of the function remains the same...

    // Create shipment log
    await prisma.shipmentLog.create({
      data: {
        id: randomUUID(),
        shipment_id: newShipment.id,
        old_shipment: {},
        new_shipment: {
          state: newShipment.state,
          tracking_id: newShipment.tracking_id,
        },
        action: LogAction.CREATE,
      },
    });

    // Create packages
    for (const packageData of packagesData) {
      // Convert package type string to enum
      const packageTypeValue = packageData.package_type
        ? (packageData.package_type.toUpperCase() as keyof typeof PackageType)
        : "PARCEL";

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
        },
      });
    }

    // Generate QR code for tracking
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
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

    return NextResponse.json(
      {
        ...fullShipment,
        qrCodeDataUrl,
        trackingUrl,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating shipment:", error);
    return NextResponse.json(
      {
        error: "Failed to create shipment",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
