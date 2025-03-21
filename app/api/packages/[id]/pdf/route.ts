import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params;
    console.log('PDF generation requested for package ID:', id);
    
    // Fetch package data
    const packageData = await prisma.package.findUnique({
      where: { id },
      include: {
        sender: true,
        receiver: true,
        courier: true,
      },
    });
    
    if (!packageData) {
      console.error('Package not found:', id);
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }
    
    console.log('Package data retrieved, generating QR code');
    
    // Generate QR code
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const trackingUrl = `${baseUrl}/track/${id}`;
    const qrCodeDataUrl = await QRCode.toDataURL(trackingUrl);
    
    console.log('QR code generated, creating PDF document');
    
    // Create a PDF document using jsPDF
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    // Render shipping label
    try {
      renderShippingLabel(doc, packageData, qrCodeDataUrl);
      console.log('Shipping label rendered successfully');
    } catch (renderError) {
      console.error('Error rendering shipping label:', renderError);
      return NextResponse.json({ error: 'Failed to render shipping label' }, { status: 500 });
    }
    
    // Get the PDF as a buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    
    // Create the response
    const response = new NextResponse(pdfBuffer);
    response.headers.set('Content-Type', 'application/pdf');
    response.headers.set('Content-Disposition', `attachment; filename="shipping-label-${packageData.tracking_id}.pdf"`);
    
    console.log('PDF response ready to be sent');
    return response;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ 
      error: 'Failed to generate PDF',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function renderShippingLabel(doc: jsPDF, packageData: any, qrCodeDataUrl: string) {
  try {
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20; // 20mm margin
    const contentWidth = pageWidth - (margin * 2);
    let yPos = margin;
    
    // Helper function to center text
    const centerText = (text: string, y: number, fontSize: number = 12) => {
      doc.setFontSize(fontSize);
      const textWidth = doc.getStringUnitWidth(text) * fontSize / doc.internal.scaleFactor;
      const x = (pageWidth - textWidth) / 2;
      doc.text(text, x, y);
      return y + (fontSize / 5); // Return the new Y position
    };
    
    // Title
    doc.setFont('helvetica', 'bold');
    yPos = centerText('SHIPPING LABEL', yPos, 16);
    yPos += 10;
    
    // Tracking number
    doc.setFontSize(12);
    yPos = centerText(`Tracking #: ${packageData.tracking_id}`, yPos, 12);
    yPos += 5;
    
    // Horizontal line
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;
    
    // From address
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('FROM:', margin, yPos);
    yPos += 5;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(packageData.sender.name, margin, yPos);
    yPos += 5;
    doc.text(packageData.origin_street, margin, yPos);
    yPos += 5;
    doc.text(`${packageData.origin_city}, ${packageData.origin_state} ${packageData.origin_zip_code}`, margin, yPos);
    yPos += 5;
    doc.text(packageData.origin_country, margin, yPos);
    yPos += 10;
    
    // To address
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('TO:', margin, yPos);
    yPos += 5;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(packageData.receiver.name, margin, yPos);
    yPos += 5;
    doc.text(packageData.destination_street, margin, yPos);
    yPos += 5;
    doc.text(`${packageData.destination_city}, ${packageData.destination_state} ${packageData.destination_zip_code}`, margin, yPos);
    yPos += 5;
    doc.text(packageData.destination_country, margin, yPos);
    yPos += 10;
    
    // Package information
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('PACKAGE INFORMATION:', margin, yPos);
    yPos += 5;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Type: ${packageData.package_type}`, margin, yPos);
    yPos += 5;
    doc.text(`Size: ${packageData.size}`, margin, yPos);
    yPos += 5;
    doc.text(`Weight: ${packageData.weight} kg`, margin, yPos);
    yPos += 10;
    
    // QR Code
    try {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      yPos = centerText('SCAN QR CODE TO TRACK:', yPos, 11);
      yPos += 5;
      
      // Calculate position for centered QR code
      const qrSize = 50; // mm
      const qrX = (pageWidth - qrSize) / 2;
      
      // Add QR code to the PDF
      doc.addImage(qrCodeDataUrl, 'PNG', qrX, yPos, qrSize, qrSize);
      yPos += qrSize + 10;
      
      console.log('QR code added to PDF');
    } catch (qrError) {
      console.error('Error adding QR code to PDF:', qrError);
      // Continue without the QR code
      doc.setFont('helvetica', 'bold');
      yPos = centerText('QR CODE NOT AVAILABLE', yPos, 11);
      yPos += 10;
    }
    
    // Tracking URL text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    yPos = centerText(`Track at: ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/track/${packageData.id}`, yPos, 8);
    yPos += 5;
    
    // Footer
    doc.setFontSize(8);
    yPos = centerText(`Created on: ${new Date().toLocaleString()}`, yPos, 8);
    
    console.log('Shipping label rendering completed');
  } catch (error) {
    console.error('Error in renderShippingLabel:', error);
    throw error;
  }
}