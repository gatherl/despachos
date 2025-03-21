'use client';

import React, { useState } from 'react';

interface DownloadLabelProps {
  packageId: string;
}

export default function DownloadLabel({ packageId }: DownloadLabelProps) {
  const [downloading, setDownloading] = useState(false);
  
  const downloadUrl = `/api/packages/${packageId}/pdf`;
  
  const handleClick = () => {
    setDownloading(true);
    
    // Create a hidden anchor element and trigger the download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `shipping-label-${packageId}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Reset state after a short delay
    setTimeout(() => {
      setDownloading(false);
    }, 2000);
  };

  return (
    <div>
      <button
        onClick={handleClick}
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
            <span>Generating PDF...</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
            <span>Download Shipping Label</span>
          </>
        )}
      </button>
      
      <div className="mt-2 text-sm text-gray-500 flex items-center justify-end">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Or <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline">open in new tab</a></span>
      </div>
    </div>
  );
}