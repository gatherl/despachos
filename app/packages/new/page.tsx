'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PackageInput } from '@/types/prisma';
import PackageCreationSuccess from '@/components/PackageCreationSuccess';

export default function NewPackagePage() {
  const [formData, setFormData] = useState<PackageInput>({
    // default form data
    size: 'Medium',
    weight: 1,
    state: 'Created',
    state_date: new Date(),
    sender_id: '',
    receiver_id: '',
    // other required fields with default values
    destination_zip_code: '',
    destination_street: '',
    destination_floor: '',
    destination_city: '',
    destination_state: '',
    destination_country: '',
    destination_btw_st_1: '',
    destination_btw_st_2: '',
    origin_zip_code: '',
    origin_street: '',
    origin_floor: '',
    origin_city: '',
    origin_state: '',
    origin_country: '',
    origin_apartment: '',
    origin_btw_st_1: '',
    origin_btw_st_2: '',
    units_value: 0,
    units_number: 1,
    package_type: 'General',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [createdPackage, setCreatedPackage] = useState<{
    id: string;
    tracking_id: string;
    qrCodeDataUrl: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create package');
      }
      
      const result = await response.json();
      setCreatedPackage({
        id: result.id,
        tracking_id: result.tracking_id,
        qrCodeDataUrl: result.qrCodeDataUrl
      });
      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : 'Failed to create package');
      console.error(err);
    }
  };

  // Show success view if package was created successfully
  if (success && createdPackage) {
    return (
      <div className="container mx-auto py-8 px-4">
        <PackageCreationSuccess 
          packageId={createdPackage.id}
          trackingId={createdPackage.tracking_id}
          qrCodeUrl={createdPackage.qrCodeDataUrl}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Create New Package</h1>
        <Link
          href="/packages"
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Packages
        </Link>
      </div>
      
      {/* Here you would include your full package form */}
      {/* For brevity, I've included just a placeholder */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Your form fields go here */}
          <div className="mt-6 flex justify-end space-x-3">
            <Link
              href="/packages"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
            >
              Cancel
            </Link>
            
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Package'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}