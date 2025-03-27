// components/DownloadLabel.tsx
'use client';

import React, { useState } from 'react';

interface DownloadLabelProps {
  shipmentId: string;
  trackingId?: string;
}

export default function DownloadLabel({ shipmentId, trackingId }: DownloadLabelProps) {
  const [downloading, setDownloading] = useState(false);
  const [printing, setPrinting] = useState(false);
  
  const downloadUrl = `/api/shipments/${shipmentId}/pdf`;
  
  const handleDownload = () => {
    setDownloading(true);
    
    // Create a hidden anchor element and trigger the download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `shipping-label-${trackingId || shipmentId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Reset state after a short delay
    setTimeout(() => {
      setDownloading(false);
    }, 2000);
  };

  const handlePrint = () => {
    setPrinting(true);
    
    // Open PDF in new tab for printing
    const printWindow = window.open(downloadUrl, '_blank');
    
    // Reset state after a short delay
    setTimeout(() => {
      setPrinting(false);
    }, 2000);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className={`group relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 
          ${downloading ? 'opacity-70 cursor-not-allowed' : 'hover:from-blue-700 hover:to-blue-800'}`}
          type="button"
        >
          <span className="absolute inset-0 bg-white rounded-lg opacity-0 group-hover:opacity-10 transition-opacity"></span>
          
          {downloading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Descargando...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              <span>Descargar Etiqueta</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}