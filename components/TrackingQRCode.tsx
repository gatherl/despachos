'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import QRCode from 'qrcode';

interface TrackingQRCodeProps {
  trackingId: string;
  size?: number;
  className?: string;
}

const TrackingQRCode: React.FC<TrackingQRCodeProps> = ({ 
  trackingId, 
  size = 200,
  className = ""
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!trackingId) return;
    
    // Generar código QR cuando cambia el ID de seguimiento
    const generateQR = async () => {
      try {
        // Crear la URL de seguimiento
        const baseUrl = typeof window !== 'undefined' 
          ? `${window.location.origin}/tracking` 
          : 'https://tudominio.com/tracking';
        
        const trackingUrl = `${baseUrl}?tracking_id=${encodeURIComponent(trackingId)}`;
        
        // Generar URL de datos del código QR
        const dataUrl = await QRCode.toDataURL(trackingUrl, {
          width: size,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        });
        
        setQrDataUrl(dataUrl);
        setError(null);
      } catch (err) {
        console.error('Error al generar código QR:', err);
        setError('Error al generar código QR');
      }
    };

    generateQR();
  }, [trackingId, size]);

  if (error) {
    return (
      <Card className={`flex items-center justify-center overflow-hidden ${className}`} style={{ width: size, height: size }}>
        <CardContent className="p-4 text-center text-sm text-red-500">
          {error}
        </CardContent>
      </Card>
    );
  }

  if (!qrDataUrl) {
    return (
      <Card className={`flex items-center justify-center overflow-hidden ${className}`} style={{ width: size, height: size }}>
        <CardContent className="p-4">
          <div className="animate-pulse bg-gray-200 w-full h-full rounded-md" style={{ width: size - 32, height: size - 32 }}></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-4 flex items-center justify-center">
        <img 
          src={qrDataUrl} 
          alt={`Código QR de seguimiento para ${trackingId}`} 
          width={size} 
          height={size}
          className="max-w-full max-h-full"
        />
      </CardContent>
    </Card>
  );
};

export default TrackingQRCode;