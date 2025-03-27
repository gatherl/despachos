'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ShipmentCreationSuccess from './ShipmentCreationSuccess';

interface FormData {
  sender_id: string;
  receiver_id: string;
  payment: string;
  destination_zip_code: string;
  destination_street: string;
  destination_street_number: string;
  destination_floor: string;
  destination_apartment: string;
  destination_city: string;
  destination_state: string;
  origin_zip_code: string;
  origin_street: string;
  origin_street_number: string;
  origin_floor: string;
  origin_apartment: string;
  origin_city: string;
  origin_state: string;
  details: string;
  packages: Array<{
    id?: string;
    weight: number;
    height?: number;
    width?: number;
    length?: number;
    package_type: string;
  }>;
}

interface User {
  id: string;
  name: string;
  email?: string;
}

export default function ShipmentForm() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [createdShipment, setCreatedShipment] = useState<any>(null);
  
  const [formData, setFormData] = useState<FormData>({
    sender_id: '',
    receiver_id: '',
    payment: 'Credit Card',
    destination_zip_code: '',
    destination_street: '',
    destination_street_number: '',
    destination_floor: '',
    destination_apartment: '',
    destination_city: '',
    destination_state: '',
    origin_zip_code: '',
    origin_street: '',
    origin_street_number: '',
    origin_floor: '',
    origin_apartment: '',
    origin_city: '',
    origin_state: '',
    details: '',
    packages: [
      {
        weight: 1,
        package_type: 'Box',
      }
    ]
  });
  
  // Fetch users for dropdown selection
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load user data. Please try again.');
      }
    }
    
    fetchUsers();
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handlePackageChange = (index: number, field: string, value: string | number) => {
    const updatedPackages = [...formData.packages];
    updatedPackages[index] = {
      ...updatedPackages[index],
      [field]: value
    };
    
    setFormData(prevState => ({
      ...prevState,
      packages: updatedPackages
    }));
  };
  
  const addPackage = () => {
    setFormData(prevState => ({
      ...prevState,
      packages: [
        ...prevState.packages,
        {
          weight: 1,
          package_type: 'Box',
        }
      ]
    }));
  };
  
  const removePackage = (index: number) => {
    const updatedPackages = [...formData.packages];
    updatedPackages.splice(index, 1);
    
    setFormData(prevState => ({
      ...prevState,
      packages: updatedPackages
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Create the shipment
      const response = await fetch('/api/shipments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create shipment');
      }
      
      const data = await response.json();
      setCreatedShipment(data);
      setSuccess(true);
      
    } catch (err: any) {
      console.error('Error creating shipment:', err);
      setError(err.message || 'Failed to create shipment. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  if (success && createdShipment) {
    return (
      <ShipmentCreationSuccess
        shipmentId={createdShipment.id}
        trackingId={createdShipment.tracking_id}
        qrCodeUrl={createdShipment.qrCodeDataUrl}
      />
    );
  }
  
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-blue-600 text-white">
        <h2 className="text-xl font-semibold">Create New Shipment</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}
        
        {/* Sender and Receiver */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="sender_id" className="block text-sm font-medium text-gray-700 mb-1">
              Sender
            </label>
            <select
              id="sender_id"
              name="sender_id"
              value={formData.sender_id}
              onChange={handleInputChange}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a sender</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} {user.email ? `(${user.email})` : ''}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="receiver_id" className="block text-sm font-medium text-gray-700 mb-1">
              Receiver
            </label>
            <select
              id="receiver_id"
              name="receiver_id"
              value={formData.receiver_id}
              onChange={handleInputChange}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a receiver</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} {user.email ? `(${user.email})` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Origin Address */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Origin Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="origin_street" className="block text-sm font-medium text-gray-700 mb-1">
                Street
              </label>
              <input
                type="text"
                id="origin_street"
                name="origin_street"
                value={formData.origin_street}
                onChange={handleInputChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="origin_street_number" className="block text-sm font-medium text-gray-700 mb-1">
                Street Number
              </label>
              <input
                type="text"
                id="origin_street_number"
                name="origin_street_number"
                value={formData.origin_street_number}
                onChange={handleInputChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="origin_floor" className="block text-sm font-medium text-gray-700 mb-1">
                Floor
              </label>
              <input
                type="text"
                id="origin_floor"
                name="origin_floor"
                value={formData.origin_floor}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="origin_apartment" className="block text-sm font-medium text-gray-700 mb-1">
                Apartment
              </label>
              <input
                type="text"
                id="origin_apartment"
                name="origin_apartment"
                value={formData.origin_apartment}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="origin_city" className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                id="origin_city"
                name="origin_city"
                value={formData.origin_city}
                onChange={handleInputChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="origin_state" className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                id="origin_state"
                name="origin_state"
                value={formData.origin_state}
                onChange={handleInputChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="origin_zip_code" className="block text-sm font-medium text-gray-700 mb-1">
                ZIP Code
              </label>
              <input
                type="text"
                id="origin_zip_code"
                name="origin_zip_code"
                value={formData.origin_zip_code}
                onChange={handleInputChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
        
        {/* Destination Address */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Destination Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="destination_street" className="block text-sm font-medium text-gray-700 mb-1">
                Street
              </label>
              <input
                type="text"
                id="destination_street"
                name="destination_street"
                value={formData.destination_street}
                onChange={handleInputChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="destination_street_number" className="block text-sm font-medium text-gray-700 mb-1">
                Street Number
              </label>
              <input
                type="text"
                id="destination_street_number"
                name="destination_street_number"
                value={formData.destination_street_number}
                onChange={handleInputChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="destination_floor" className="block text-sm font-medium text-gray-700 mb-1">
                Floor
              </label>
              <input
                type="text"
                id="destination_floor"
                name="destination_floor"
                value={formData.destination_floor}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="destination_apartment" className="block text-sm font-medium text-gray-700 mb-1">
                Apartment
              </label>
              <input
                type="text"
                id="destination_apartment"
                name="destination_apartment"
                value={formData.destination_apartment}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="destination_city" className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                id="destination_city"
                name="destination_city"
                value={formData.destination_city}
                onChange={handleInputChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="destination_state" className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                id="destination_state"
                name="destination_state"
                value={formData.destination_state}
                onChange={handleInputChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="destination_zip_code" className="block text-sm font-medium text-gray-700 mb-1">
                ZIP Code
              </label>
              <input
                type="text"
                id="destination_zip_code"
                name="destination_zip_code"
                value={formData.destination_zip_code}
                onChange={handleInputChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
        
        {/* Shipment Details */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Shipment Details</h3>
          
          <div className="mb-4">
            <label htmlFor="payment" className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method
            </label>
            <select
              id="payment"
              name="payment"
              value={formData.payment}
              onChange={handleInputChange}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Credit Card">Credit Card</option>
              <option value="PayPal">PayPal</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cash">Cash</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">
              Additional Details
            </label>
            <textarea
              id="details"
              name="details"
              rows={3}
              value={formData.details}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Special instructions or notes"
            />
          </div>
        </div>
        
        {/* Packages */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Packages</h3>
            <button
              type="button"
              onClick={addPackage}
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Package
            </button>
          </div>
          
          {formData.packages.length === 0 ? (
            <div className="bg-yellow-50 p-4 rounded-md">
              <p className="text-yellow-700">At least one package is required.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {formData.packages.map((pkg, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-md">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-900">Package {index + 1}</h4>
                    {formData.packages.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePackage(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor={`package-type-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <select
                        id={`package-type-${index}`}
                        value={pkg.package_type}
                        onChange={(e) => handlePackageChange(index, 'package_type', e.target.value)}
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Box">Box</option>
                        <option value="Envelope">Envelope</option>
                        <option value="Pallet">Pallet</option>
                        <option value="Tube">Tube</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor={`package-weight-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        id={`package-weight-${index}`}
                        value={pkg.weight}
                        onChange={(e) => handlePackageChange(index, 'weight', parseFloat(e.target.value))}
                        required
                        min="0.1"
                        step="0.1"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label htmlFor={`package-height-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Height (cm)
                      </label>
                      <input
                        type="number"
                        id={`package-height-${index}`}
                        value={pkg.height || ''}
                        onChange={(e) => handlePackageChange(index, 'height', parseFloat(e.target.value))}
                        min="0"
                        step="0.1"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor={`package-width-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Width (cm)
                      </label>
                      <input
                        type="number"
                        id={`package-width-${index}`}
                        value={pkg.width || ''}
                        onChange={(e) => handlePackageChange(index, 'width', parseFloat(e.target.value))}
                        min="0"
                        step="0.1"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor={`package-length-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Length (cm)
                      </label>
                      <input
                        type="number"
                        id={`package-length-${index}`}
                        value={pkg.length || ''}
                        onChange={(e) => handlePackageChange(index, 'length', parseFloat(e.target.value))}
                        min="0"
                        step="0.1"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <Link
            href="/shipments"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </Link>
          
          <button
            type="submit"
            disabled={loading || formData.packages.length === 0}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${(loading || formData.packages.length === 0) ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Creating...' : 'Create Shipment'}
          </button>
        </div>
      </form>
    </div>
  );
}