import { NextRequest, NextResponse } from 'next/server';
import { getOcaApiService } from '@/services/oca/oca-api-service';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import { OcaShipmentRequest } from '@/types/oca-epak';

const prisma = new PrismaClient();

/**
 * API route for creating OCA shipments
 */
export async function POST(request: NextRequest) {
  try {
    // Get the request data
    const data = await request.json();
    
    // Validate required fields
    if (!data.originData || !data.packageData || !data.recipientData) {
      return NextResponse.json({ 
        error: 'Missing required data fields: originData, packageData, recipientData' 
      }, { status: 400 });
    }
    
    // Get the OCA API service
    const ocaApiService = getOcaApiService();
    
    // Create a new shipment request
    const shipmentRequest = createOcaShipmentRequestFromData(data);
    
    // Call the OCA API
    const ocaResponse = await ocaApiService.createShipment(shipmentRequest, data.confirmRetrieval !== false);
    
    if (!ocaResponse.isSuccess) {
      return NextResponse.json({ 
        error: 'Failed to create OCA shipment', 
        details: ocaResponse.errorMessage 
      }, { status: 500 });
    }
    
    // Save the shipment to our database
    const savedShipment = await saveShipmentToDatabase(data, ocaResponse.numeroEnvio!);
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Shipment created successfully',
      shipmentId: savedShipment.id,
      ocaTrackingNumber: ocaResponse.numeroEnvio,
      packageTrackingId: savedShipment.tracking_id
    }, { status: 201 });
  } catch (error) {
    console.error('Error processing OCA shipment request:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * Creates an OCA shipment request from our application data
 */
function createOcaShipmentRequestFromData(data: any): OcaShipmentRequest {
  const { originData, packageData, recipientData, operationId } = data;
  
  // Format date for OCA (YYYYMMDD)
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().slice(0, 10).replace(/-/g, '');
  
  // Create the shipment request
  const shipmentRequest: OcaShipmentRequest = {
    cabecera: {
      ver: '2.0',
      nrocuenta: process.env.OCA_ACCOUNT_NUMBER || ''
    },
    origenes: [
      {
        calle: originData.street,
        nro: originData.number,
        piso: originData.floor,
        depto: originData.apartment,
        cp: originData.zipCode,
        localidad: originData.city,
        provincia: originData.state,
        contacto: originData.contactName,
        email: originData.email,
        solicitante: originData.requesterName,
        observaciones: originData.observations || 'Sin observaciones',
        centrocosto: originData.costCenter || '0',
        idfranjahoraria: originData.timeSlot || '1',
        idcentroimposicionorigen: originData.impositionCenterId || '0',
        fecha: formattedDate,
        envios: [
          {
            // TODO: Change this to a better way to get this data from the package orders
            idoperativa: process.env.OCA_DOOR_TO_DOOR_OPERATIVE_ID || '', // Default operation ID
            nroremito: data.remitNumber || `REM-${randomUUID().slice(0, 8)}`,
            cantidadremitos: 1,
            destinatario: {
              apellido: recipientData.lastName,
              nombre: recipientData.firstName,
              calle: recipientData.street,
              nro: recipientData.number,
              piso: recipientData.floor || '',
              depto: recipientData.apartment || '',
              localidad: recipientData.city,
              provincia: recipientData.state,
              cp: recipientData.zipCode,
              telefono: recipientData.phone || '',
              email: recipientData.email || '',
              idci: recipientData.impositionCenterId || '0',
              celular: recipientData.cellPhone || '',
              observaciones: recipientData.observations || ''
            },
            paquetes: [
              {
                alto: packageData.height,
                ancho: packageData.width,
                largo: packageData.length,
                peso: packageData.weight,
                valor: packageData.value || 0,
                cant: packageData.quantity || 1
              }
            ]
          }
        ]
      }
    ],
    fromDespachos: true
  };
  
  return shipmentRequest;
}

/**
 * Saves the shipment to our database
 */
async function saveShipmentToDatabase(data: any, ocaTrackingNumber: string) {
  const { originData, packageData, recipientData } = data;
  
  // First ensure we have the sender and recipient in our database
  const sender = await getOrCreateUser({
    name: `${originData.contactName || 'Sender'}`,
    email: originData.email,
    cellphone: originData.phone
  });
  
  const recipient = await getOrCreateUser({
    name: `${recipientData.firstName} ${recipientData.lastName}`,
    email: recipientData.email,
    cellphone: recipientData.cellPhone
  });
  
  // Create the package in our system
  const newPackage = await prisma.package.create({
    data: {
      id: randomUUID(),
      size: `${packageData.length}x${packageData.width}x${packageData.height}`,
      weight: packageData.weight,
      tracking_id: ocaTrackingNumber,
      state: 'Created',
      state_date: new Date(),
      sender_id: sender.id,
      receiver_id: recipient.id,
      destination_zip_code: recipientData.zipCode,
      destination_street: recipientData.street,
      destination_floor: recipientData.floor || '',
      destination_city: recipientData.city,
      destination_state: recipientData.state,
      destination_country: recipientData.country || 'Argentina',
      destination_apartment: recipientData.apartment || '',
      destination_btw_st_1: recipientData.betweenStreet1 || '',
      destination_btw_st_2: recipientData.betweenStreet2 || '',
      origin_zip_code: originData.zipCode,
      origin_street: originData.street,
      origin_floor: originData.floor || '',
      origin_city: originData.city,
      origin_state: originData.state,
      origin_country: originData.country || 'Argentina',
      origin_apartment: originData.apartment || '',
      origin_btw_st_1: originData.betweenStreet1 || '',
      origin_btw_st_2: originData.betweenStreet2 || '',
      details: packageData.description || '',
      units_value: packageData.value || 0,
      units_number: packageData.quantity || 1,
      package_type: packageData.type || 'Standard'
    }
  });
  
  // Create a package log
  await prisma.packageLog.create({
    data: {
      id: randomUUID(),
      package_id: newPackage.id,
      old_package: { state: 'None' },
      new_package: { state: 'Created' },
      action: 'Package Created with OCA',
    }
  });
  
  return newPackage;
}

/**
 * Helper to get or create a user in the database
 */
async function getOrCreateUser(userData: { name: string, email?: string, cellphone?: string }) {
  // Try to find by email first
  if (userData.email) {
    const existingUser = await prisma.user.findFirst({
      where: { email: userData.email }
    });
    
    if (existingUser) {
      return existingUser;
    }
  }
  
  // Generate a random DNI for demonstration purposes
  // In a real application, you should collect proper identification
  const randomDni = Math.floor(10000000 + Math.random() * 90000000).toString();
  
  // Create new user
  return prisma.user.create({
    data: {
      id: randomUUID(),
      dni: randomDni,
      cult: 'CULT' + randomDni,
      name: userData.name,
      email: userData.email,
      cellphone: userData.cellphone,
      role: 'USER'
    }
  });
}