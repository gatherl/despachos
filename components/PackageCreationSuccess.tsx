'use client';

import React from 'react';
import Link from 'next/link';
import DownloadLabel from './DownloadLabel';

interface PackageCreationSuccessProps {
  packageId: string;
  trackingId: string;
  qrCodeUrl: string;
}

export default function PackageCreationSuccess({ 
  packageId, 
  trackingId, 
  qrCodeUrl 
}: PackageCreationSuccessProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="text-center">
        <div className="rounded-full bg-green-100 p-3 inline-flex items-center justify-center mb-4">
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h2 className="text-xl font-semibold mb-2">Package Created Successfully!</h2>
        <p className="text-gray-600 mb-6">Your package has been created with tracking ID: <span className="font-semibold">{trackingId}</span></p>
        
        <div className="flex flex-col items-center mb-6">
          <p className="text-sm font-medium mb-2">Scan this QR code to track your package:</p>
          <div className="border border-gray-300 p-3 bg-white inline-block mb-2">
            <img src={qrCodeUrl} alt="Package Tracking QR Code" className="w-40 h-40" />
          </div>
          <p className="text-xs text-gray-500">
            URL: {window.location.origin}/track/{packageId}
          </p>
        </div>
        
        <div className="mb-8">
          <DownloadLabel packageId={packageId} />
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <Link
            href={`/packages/${packageId}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            View Package Details
          </Link>
          
          <Link
            href="/packages/new"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Create Another Package
          </Link>
          
          <Link
            href="/packages"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            View All Packages
          </Link>
        </div>
      </div>
    </div>
  );
}