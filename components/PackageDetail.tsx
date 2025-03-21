'use client';

import { useState, useEffect } from 'react';

interface PackageDetailProps {
  packageId: string;
}

export default function PackageDetail({ packageId }: PackageDetailProps) {
  const [packageData, setPackageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchPackage() {
      try {
        setLoading(true);
        const response = await fetch(`/api/packages/${packageId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch package details');
        }
        
        const data = await response.json();
        setPackageData(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch package details');
        setLoading(false);
        console.error(err);
      }
    }
    
    fetchPackage();
  }, [packageId]);
  
  if (loading) {
    return (
      <div className="bg-white rounded-b-xl shadow-md overflow-hidden">
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading package details...</p>
        </div>
      </div>
    );
  }
  
  if (error || !packageData) {
    return (
      <div className="bg-white rounded-b-xl shadow-md overflow-hidden">
        <div className="p-8 bg-red-50 border-l-4 border-red-500 text-red-700">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{error || 'Failed to load package data'}</span>
          </div>
        </div>
      </div>
    );
  }
  
  // Format the creation date
  const formattedDate = new Date(packageData.creation_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Get the status color based on the package state
  const getStatusColor = (state: string) => {
    switch (state.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'in transit':
        return 'bg-blue-100 text-blue-800';
      case 'created':
        return 'bg-purple-100 text-purple-800';
      case 'picked up':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="bg-white rounded-b-xl shadow-md overflow-hidden">
      {/* Status Bar */}
      <div className="px-6 py-4 bg-gray-50 border-b flex flex-wrap justify-between items-center gap-4">
        <div>
          <span className="text-sm text-gray-500">Tracking ID</span>
          <h2 className="text-lg font-bold text-gray-900">{packageData.tracking_id}</h2>
        </div>
        
        <div className="flex items-center">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(packageData.state)}`}>
            {packageData.state}
          </span>
          <div className="ml-4 text-right">
            <span className="text-sm text-gray-500">Created</span>
            <p className="text-sm font-medium text-gray-900">{formattedDate}</p>
          </div>
        </div>
      </div>
      
      {/* Package Details */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Package Information */}
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-100 rounded-md mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Package Information</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Size</span>
                <span className="font-medium text-gray-900">{packageData.size}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Weight</span>
                <span className="font-medium text-gray-900">{packageData.weight} kg</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Type</span>
                <span className="font-medium text-gray-900">{packageData.package_type}</span>
              </div>
              {packageData.details && (
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Details</span>
                  <span className="font-medium text-gray-900">{packageData.details}</span>
                </div>
              )}
              <div className="flex justify-between pt-1">
                <span className="text-gray-500">Value</span>
                <span className="font-medium text-gray-900">
                  ${(packageData.units_value * packageData.units_number).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Courier Information */}
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-green-100 rounded-md mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delivery Details</h3>
            </div>
            
            <div className="space-y-3">
              {packageData.courier && (
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Courier</span>
                  <span className="font-medium text-gray-900">{packageData.courier.name}</span>
                </div>
              )}
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Current Status</span>
                <span className={`font-medium ${getStatusColor(packageData.state)}`}>{packageData.state}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Status Date</span>
                <span className="font-medium text-gray-900">
                  {new Date(packageData.state_date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-gray-500">Estimated Delivery</span>
                <span className="font-medium text-gray-900">
                  {new Date(new Date(packageData.creation_date).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Addresses */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Sender Information */}
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-yellow-100 rounded-md mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Sender Information</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Name</span>
                <span className="font-medium text-gray-900">{packageData.sender?.name}</span>
              </div>
              {packageData.sender?.email && (
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium text-gray-900">{packageData.sender.email}</span>
                </div>
              )}
              {packageData.sender?.cellphone && (
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Phone</span>
                  <span className="font-medium text-gray-900">{packageData.sender.cellphone}</span>
                </div>
              )}
              <div className="pt-2">
                <span className="text-gray-500 block mb-2">Address</span>
                <div className="bg-gray-50 p-3 rounded-md text-gray-900">
                  <p>{packageData.origin_street}{packageData.origin_apartment ? `, Apt ${packageData.origin_apartment}` : ''}</p>
                  <p>{packageData.origin_city}, {packageData.origin_state} {packageData.origin_zip_code}</p>
                  <p>{packageData.origin_country}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Receiver Information */}
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-red-100 rounded-md mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Receiver Information</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Name</span>
                <span className="font-medium text-gray-900">{packageData.receiver?.name}</span>
              </div>
              {packageData.receiver?.email && (
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium text-gray-900">{packageData.receiver.email}</span>
                </div>
              )}
              {packageData.receiver?.cellphone && (
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Phone</span>
                  <span className="font-medium text-gray-900">{packageData.receiver.cellphone}</span>
                </div>
              )}
              <div className="pt-2">
                <span className="text-gray-500 block mb-2">Address</span>
                <div className="bg-gray-50 p-3 rounded-md text-gray-900">
                  <p>{packageData.destination_street}{packageData.destination_apartment ? `, Apt ${packageData.destination_apartment}` : ''}</p>
                  <p>{packageData.destination_city}, {packageData.destination_state} {packageData.destination_zip_code}</p>
                  <p>{packageData.destination_country}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}