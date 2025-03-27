'use client';

import { useState, useEffect } from 'react';
import ShipmentStatusTimeline from './ShipmentStatusTimeline';

interface ShipmentDetailProps {
  shipmentId: string;
}

export default function ShipmentDetail({ shipmentId }: ShipmentDetailProps) {
  const [shipmentData, setShipmentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchShipment() {
      try {
        setLoading(true);
        const response = await fetch(`/api/shipments/${shipmentId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch shipment details');
        }
        
        const data = await response.json();
        setShipmentData(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch shipment details');
        setLoading(false);
        console.error(err);
      }
    }
    
    fetchShipment();
  }, [shipmentId]);
  
  if (loading) {
    return (
      <div className="bg-white rounded-b-xl shadow-md overflow-hidden">
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Cargando detalles del envío...</p>
        </div>
      </div>
    );
  }
  
  if (error || !shipmentData) {
    return (
      <div className="bg-white rounded-b-xl shadow-md overflow-hidden">
        <div className="p-8 bg-red-50 border-l-4 border-red-500 text-red-700">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{error || 'No se pudieron cargar los datos del envío'}</span>
          </div>
        </div>
      </div>
    );
  }
  
  // Format the creation date
  const formattedDate = new Date(shipmentData.creation_date).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Format the state date
  const formattedStateDate = new Date(shipmentData.state_date).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Get the status color based on the shipment state
  const getStatusColor = (state: string) => {
    switch (state.toUpperCase()) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'IN_TRANSIT':
        return 'bg-blue-100 text-blue-800';
      case 'CREATED':
        return 'bg-purple-100 text-purple-800';
      case 'PICKED_UP':
        return 'bg-indigo-100 text-indigo-800';
      case 'RETURNED':
        return 'bg-red-100 text-red-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Format payment status
  const formatPaymentStatus = (status: string) => {
    switch (status) {
      case 'PAGO':
        return 'Pagado';
      case 'NO_PAGO':
        return 'No Pagado';
      case 'PAGA_DESTINO':
        return 'Pago en Destino';
      default:
        return status;
    }
  };
  
  // Format package type
  const formatPackageType = (type: string) => {
    switch (type) {
      case 'DOCUMENT':
        return 'Documento';
      case 'PARCEL':
        return 'Paquete';
      case 'FRAGILE':
        return 'Frágil';
      case 'ELECTRONICS':
        return 'Electrónica';
      case 'PERISHABLE':
        return 'Perecedero';
      default:
        return type;
    }
  };
  
  // Calculate estimated delivery date (7 days from creation date)
  const estimatedDeliveryDate = new Date(shipmentData.creation_date);
  estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 7);
  const formattedEstimatedDate = estimatedDeliveryDate.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="bg-white rounded-b-xl shadow-md overflow-hidden">
      {/* Status Bar */}
      <div className="px-6 py-4 bg-gray-50 border-b flex flex-wrap justify-between items-center gap-4">
        <div>
          <span className="text-sm text-gray-500">Numero de Seguimiento</span>
          <h2 className="text-lg font-bold text-gray-900">{shipmentData.tracking_id}</h2>
        </div>
        
        <div className="flex items-center">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(shipmentData.state)}`}>
            {shipmentData.state}
          </span>
          <div className="ml-4 text-right">
            <span className="text-sm text-gray-500">Creado</span>
            <p className="text-sm font-medium text-gray-900">{formattedDate}</p>
          </div>
        </div>
      </div>
      
      {/* Shipment Details */}
      <div className="p-6">
        {/* Status Timeline */}
        <div className="mb-8">
          <ShipmentStatusTimeline 
            currentState={shipmentData.state}
            stateDate={shipmentData.state_date}
            creationDate={shipmentData.creation_date}
            shipmentLogs={shipmentData.shipmentLogs}
          />
        </div>
        
        {/* Sender & Receiver Information Card */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Sender Information */}
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-100 rounded-md mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Remitente</h3>
            </div>
            
            <div className="space-y-3">
              {/* Name */}
              {(shipmentData.transportist?.name || shipmentData.sender_name) && (
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Nombre</span>
                  <span className="font-medium text-gray-900">
                    {shipmentData.transportist?.name || shipmentData.sender_name}
                  </span>
                </div>
              )}
              
              {/* Email */}
              {shipmentData.transportist?.email && (
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium text-gray-900">{shipmentData.transportist.email}</span>
                </div>
              )}
              
              {/* Phone */}
              {(shipmentData.transportist?.cellphone || shipmentData.sender_phone) && (
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Teléfono</span>
                  <span className="font-medium text-gray-900">
                    {shipmentData.transportist?.cellphone || shipmentData.sender_phone}
                  </span>
                </div>
              )}
              
              {/* DNI */}
              {shipmentData.sender_dni && (
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">DNI</span>
                  <span className="font-medium text-gray-900">{shipmentData.sender_dni}</span>
                </div>
              )}
              
              {/* Address */}
              <div className="pt-2">
                <span className="text-gray-500 block mb-2">Dirección</span>
                <div className="bg-gray-50 p-3 rounded-md text-gray-900">
                  <p>{shipmentData.origin_street} {shipmentData.origin_street_number}</p>
                  {(shipmentData.origin_floor || shipmentData.origin_apartment) && (
                    <p>Piso: {shipmentData.origin_floor || '-'}, Dpto: {shipmentData.origin_apartment || '-'}</p>
                  )}
                  <p>{shipmentData.origin_city}, {shipmentData.origin_state} {shipmentData.origin_zip_code}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Receiver Information */}
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-red-100 rounded-md mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Destinatario</h3>
            </div>
            
            <div className="space-y-3">
              {/* Name */}
              {shipmentData.receiver_name && (
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Nombre</span>
                  <span className="font-medium text-gray-900">{shipmentData.receiver_name}</span>
                </div>
              )}
              
              {/* Email */}
              {shipmentData.receiver?.email && (
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium text-gray-900">{shipmentData.receiver.email}</span>
                </div>
              )}
              
              {/* Phone */}
              {shipmentData.receiver_phone && (
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Teléfono</span>
                  <span className="font-medium text-gray-900">{shipmentData.receiver_phone}</span>
                </div>
              )}
              
              {/* DNI */}
              {shipmentData.receiver_dni && (
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">DNI</span>
                  <span className="font-medium text-gray-900">{shipmentData.receiver_dni}</span>
                </div>
              )}
              
              {/* Address */}
              <div className="pt-2">
                <span className="text-gray-500 block mb-2">Dirección</span>
                <div className="bg-gray-50 p-3 rounded-md text-gray-900">
                  <p>{shipmentData.destination_street} {shipmentData.destination_street_number}</p>
                  {(shipmentData.destination_floor || shipmentData.destination_apartment) && (
                    <p>Piso: {shipmentData.destination_floor || '-'}, Dpto: {shipmentData.destination_apartment || '-'}</p>
                  )}
                  <p>{shipmentData.destination_city}, {shipmentData.destination_state} {shipmentData.destination_zip_code}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Packages Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <div className="p-2 bg-blue-100 rounded-md mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            Paquetes
          </h3>
          
          {shipmentData.packages && shipmentData.packages.length > 0 ? (
            <div className="space-y-4">
              {shipmentData.packages.map((pkg: any, index: number) => (
                <div key={pkg.id} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      Paquete {index + 1}
                    </h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800`}>
                      {formatPackageType(pkg.package_type)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="mb-3">
                        <span className="text-sm text-gray-500 block">Peso</span>
                        <span className="font-medium text-gray-900">{pkg.weight} kg</span>
                      </div>
                      
                      {pkg.id && (
                        <div className="mb-3">
                          <span className="text-sm text-gray-500 block">ID del Paquete</span>
                          <span className="font-medium text-gray-900 text-sm">{pkg.id}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      {(pkg.height || pkg.width || pkg.length) && (
                        <div className="mb-3">
                          <span className="text-sm text-gray-500 block">Dimensiones</span>
                          <span className="font-medium text-gray-900">
                            {pkg.height ? `${pkg.height} cm` : '-'} × {pkg.width ? `${pkg.width} cm` : '-'} × {pkg.length ? `${pkg.length} cm` : '-'}
                          </span>
                        </div>
                      )}
                      
                      {(pkg.height && pkg.width && pkg.length) && (
                        <div className="mb-3">
                          <span className="text-sm text-gray-500 block">Volumen</span>
                          <span className="font-medium text-gray-900">
                            {(pkg.height * pkg.width * pkg.length / 1000).toFixed(2)} litros
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-md text-center text-gray-500">
              No hay paquetes asociados a este envío
            </div>
          )}
        </div>
      </div>
    </div>
  );
}