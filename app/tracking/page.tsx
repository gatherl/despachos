'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TrackingPage() {
  const [trackingId, setTrackingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trackingId.trim()) {
      setError('Please enter a tracking number');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Search for shipment by tracking ID
      const response = await fetch(`/api/shipments?tracking_id=${trackingId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Shipment not found. Please check your tracking number and try again.');
        } else {
          throw new Error('Failed to search for shipment');
        }
        setLoading(false);
        return;
      }
      
      const shipmentData = await response.json();
      router.push(`/shipments/${shipmentData.id}`);
    } catch (err) {
      setError('An error occurred while searching for your shipment. Please try again.');
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <h1 className="mt-6 text-3xl font-extrabold text-gray-900">Track Your Shipment</h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your tracking number to get real-time updates on your delivery
          </p>
        </div>
        
        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSearch} className="space-y-6">
            <div>
              <label htmlFor="tracking-id" className="block text-sm font-medium text-gray-700">
                Tracking Number
              </label>
              <div className="mt-1">
                <input
                  id="tracking-id"
                  name="tracking-id"
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  required
                  placeholder="Enter your tracking number (e.g., TRK123456)"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Searching...</span>
                  </>
                ) : "Track Shipment"}
              </button>
            </div>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 gap-3">
              <Link
                href="/"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Return to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-6 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <h2 className="text-lg font-medium text-gray-900">Need Help?</h2>
            <p className="mt-2 text-sm text-gray-600">
              If you're having trouble tracking your shipment, please contact our customer service team.
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Customer Service: support@example.com
            </p>
          </div>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-6 px-4 shadow sm:rounded-lg sm:px-10">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Where can I find my tracking number?</h3>
              <p className="mt-1 text-sm text-gray-600">
                Your tracking number can be found in your order confirmation email or receipt. It usually starts with "TRK".
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-900">How often is tracking information updated?</h3>
              <p className="mt-1 text-sm text-gray-600">
                Tracking information is typically updated once per day, but may update more frequently as the shipment nears delivery.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-900">What if my tracking information isn't available?</h3>
              <p className="mt-1 text-sm text-gray-600">
                It may take up to 24 hours for tracking information to appear after your order is shipped. If it's been longer, please contact customer support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}