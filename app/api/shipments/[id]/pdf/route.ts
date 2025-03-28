// app/api/shipments/[id]/pdf/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Use await with context.params to satisfy Next.js requirements
    const { id } = await context.params;
    console.log("PDF generation requested for shipment ID:", id);

    // Fetch shipment data with all related information
    const shipmentData = await prisma.shipment.findUnique({
      where: { id },
      include: {
        transportist: true,
        courier: true,
        packages: true,
      },
    });

    if (!shipmentData) {
      console.error("Shipment not found:", id);
      return NextResponse.json(
        { error: "Shipment not found" },
        { status: 404 }
      );
    }

    console.log("Shipment data retrieved, generating QR code");

    // Generate QR code
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const trackingUrl = `${baseUrl}/tracking?tracking_id=${shipmentData.tracking_id}`;
    const qrCodeDataUrl = await QRCode.toDataURL(trackingUrl);

    console.log("QR code generated, creating PDF document");

    // Create a PDF document using jsPDF
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Render shipping label
    try {
      renderShippingLabel(doc, shipmentData, qrCodeDataUrl);
      console.log("Shipping label rendered successfully");
    } catch (renderError) {
      console.error("Error rendering shipping label:", renderError);
      return NextResponse.json(
        { error: "Failed to render shipping label" },
        { status: 500 }
      );
    }

    // Get the PDF as a buffer
    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

    // Create the response
    const response = new NextResponse(pdfBuffer);
    response.headers.set("Content-Type", "application/pdf");
    response.headers.set(
      "Content-Disposition",
      `attachment; filename="shipping-label-${shipmentData.tracking_id}.pdf"`
    );

    console.log("PDF response ready to be sent");
    return response;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      {
        error: "Failed to generate PDF",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

function renderShippingLabel(
  doc: jsPDF,
  shipmentData: any,
  qrCodeDataUrl: string
) {
  try {
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20; // 20mm margin
    const contentWidth = pageWidth - margin * 2;
    let yPos = margin;

    // Helper function to center text
    const centerText = (text: string, y: number, fontSize: number = 12) => {
      doc.setFontSize(fontSize);
      const textWidth =
        (doc.getStringUnitWidth(text) * fontSize) / doc.internal.scaleFactor;
      const x = (pageWidth - textWidth) / 2;
      doc.text(text, x, y);
      return y + fontSize / 5; // Return the new Y position
    };

    // Title
    doc.setFont("helvetica", "bold");
    yPos = centerText("GUÍA DE ENVÍO", yPos, 16);
    yPos += 10;

    // Tracking number
    doc.setFontSize(12);
    yPos = centerText(
      `Código de seguimiento: ${shipmentData.tracking_id}`,
      yPos,
      12
    );
    yPos += 5;

    // Horizontal line
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;

    // Payment Status
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);

    const paymentText = (() => {
      switch (shipmentData.payment) {
        case "PAGO":
          return "PAGADO";
        case "NO_PAGO":
          return "NO PAGADO";
        case "PAGA_DESTINO":
          return "PAGO EN DESTINO";
        default:
          return shipmentData.payment;
      }
    })();

    yPos = centerText(paymentText, yPos, 14);
    yPos += 8;

    // From address
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("REMITENTE:", margin, yPos);
    yPos += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    // Use sender_name or transportist name depending on what's available
    const senderName =
      (
        (shipmentData.sender_first_name || "") +
        " " +
        (shipmentData.sender_last_name || "")
      ).trim() ||
      (shipmentData.transportist
        ? shipmentData.transportist.name
        : "Remitente");
    doc.text(senderName, margin, yPos);
    yPos += 5;

    // Add sender contact information if available
    if (shipmentData.sender_phone) {
      doc.text(`Tel: ${shipmentData.sender_phone}`, margin, yPos);
      yPos += 5;
    } else if (shipmentData.transportist?.cellphone) {
      doc.text(`Tel: ${shipmentData.transportist.cellphone}`, margin, yPos);
      yPos += 5;
    }

    if (shipmentData.sender_dni) {
      doc.text(`DNI: ${shipmentData.sender_dni}`, margin, yPos);
      yPos += 5;
    }

    if (shipmentData.sender_email) {
      doc.text(`Email: ${shipmentData.sender_email}`, margin, yPos);
      yPos += 5;
    } else if (shipmentData.transportist?.email) {
      doc.text(`Email: ${shipmentData.transportist.email}`, margin, yPos);
      yPos += 5;
    }

    // Sender address
    doc.text(
      `${shipmentData.origin_street} ${shipmentData.origin_street_number}`,
      margin,
      yPos
    );
    yPos += 5;
    if (shipmentData.origin_floor || shipmentData.origin_apartment) {
      doc.text(
        `Piso ${shipmentData.origin_floor || "-"}, Dpto ${
          shipmentData.origin_apartment || "-"
        }`,
        margin,
        yPos
      );
      yPos += 5;
    }
    doc.text(
      `${shipmentData.origin_city}, ${shipmentData.origin_state} ${shipmentData.origin_zip_code}`,
      margin,
      yPos
    );
    yPos += 10;

    // To address
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("DESTINATARIO:", margin, yPos);
    yPos += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    // Use receiver_name if available, otherwise fallback to "Destinatario"
    const receiverName =
      (
        (shipmentData.receiver_first_name || "") +
        " " +
        (shipmentData.receiver_last_name || "")
      ).trim() || "Destinatario";
    doc.text(receiverName, margin, yPos);
    yPos += 5;

    // Add receiver contact information if available
    if (shipmentData.receiver_phone) {
      doc.text(`Tel: ${shipmentData.receiver_phone}`, margin, yPos);
      yPos += 5;
    }

    if (shipmentData.receiver_dni) {
      doc.text(`DNI: ${shipmentData.receiver_dni}`, margin, yPos);
      yPos += 5;
    }

    if (shipmentData.receiver_email) {
      doc.text(`Email: ${shipmentData.receiver_email}`, margin, yPos);
      yPos += 5;
    }

    // Receiver address
    doc.text(
      `${shipmentData.destination_street} ${shipmentData.destination_street_number}`,
      margin,
      yPos
    );
    yPos += 5;
    if (shipmentData.destination_floor || shipmentData.destination_apartment) {
      doc.text(
        `Piso ${shipmentData.destination_floor || "-"}, Dpto ${
          shipmentData.destination_apartment || "-"
        }`,
        margin,
        yPos
      );
      yPos += 5;
    }
    doc.text(
      `${shipmentData.destination_city}, ${shipmentData.destination_state} ${shipmentData.destination_zip_code}`,
      margin,
      yPos
    );
    yPos += 10;

    // Shipment information
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("INFORMACIÓN DEL ENVÍO:", margin, yPos);
    yPos += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Estado: ${shipmentData.state}`, margin, yPos);
    yPos += 5;
    if (shipmentData.courier) {
      doc.text(`Transportista: ${shipmentData.courier.name}`, margin, yPos);
      yPos += 5;
    }
    if (shipmentData.details) {
      doc.text(`Detalles: ${shipmentData.details}`, margin, yPos);
      yPos += 5;
    }

    // Format the creation date
    const creationDate = new Date(shipmentData.creation_date);
    doc.text(
      `Fecha de creación: ${creationDate.toLocaleDateString("es-AR")}`,
      margin,
      yPos
    );
    yPos += 5;

    // Format the state date
    const stateDate = new Date(shipmentData.state_date);
    doc.text(
      `Fecha de estado: ${stateDate.toLocaleDateString("es-AR")}`,
      margin,
      yPos
    );
    yPos += 5;

    // Format package type
    const formatPackageType = (type: string) => {
      switch (type) {
        case "DOCUMENT":
          return "Documento";
        case "PARCEL":
          return "Paquete";
        case "FRAGILE":
          return "Frágil";
        case "ELECTRONICS":
          return "Electrónica";
        case "PERISHABLE":
          return "Perecedero";
        default:
          return type;
      }
    };

    // Package information
    if (shipmentData.packages && shipmentData.packages.length > 0) {
      yPos += 5;
      doc.setFont("helvetica", "bold");
      doc.text("PAQUETES:", margin, yPos);
      yPos += 5;

      doc.setFont("helvetica", "normal");
      shipmentData.packages.forEach((pkg: any, index: number) => {
        doc.text(
          `Paquete ${index + 1}: ${formatPackageType(pkg.package_type)}, ${
            pkg.weight
          } kg`,
          margin,
          yPos
        );
        yPos += 5;
        if (pkg.height && pkg.width && pkg.length) {
          doc.text(
            `Dimensiones: ${pkg.height} × ${pkg.width} × ${pkg.length} cm`,
            margin + 10,
            yPos
          );
          yPos += 5;
        }
      });
    }

    yPos += 5;

    // QR Code
    try {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      yPos = centerText("ESCANEE EL CÓDIGO QR PARA SEGUIMIENTO:", yPos, 11);
      yPos += 5;

      // Calculate position for centered QR code
      const qrSize = 50; // mm
      const qrX = (pageWidth - qrSize) / 2;

      // Add QR code to the PDF
      doc.addImage(qrCodeDataUrl, "PNG", qrX, yPos, qrSize, qrSize);
      yPos += qrSize + 10;

      console.log("QR code added to PDF");
    } catch (qrError) {
      console.error("Error adding QR code to PDF:", qrError);
      // Continue without the QR code
      doc.setFont("helvetica", "bold");
      yPos = centerText("CÓDIGO QR NO DISPONIBLE", yPos, 11);
      yPos += 10;
    }

    // Tracking URL text
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    const trackUrl = `${
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    }/tracking?tracking_id=${shipmentData.tracking_id}`;
    yPos = centerText(`Seguir en: ${trackUrl}`, yPos, 8);
    yPos += 5;

    // Footer
    doc.setFontSize(8);
    yPos = centerText(`Creado el: ${new Date().toLocaleString()}`, yPos, 8);

    console.log("Shipping label rendering completed");
  } catch (error) {
    console.error("Error in renderShippingLabel:", error);
    throw error;
  }
}
