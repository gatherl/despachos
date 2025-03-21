'use client';

import { useState } from 'react';
import { Search, Package, Truck, BarChart2, Users, Settings, LogOut, Plus, Box, Scan } from 'lucide-react';

const PackageTrackingDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');

  const packages = [
    { id: 'PKG-001', destinatario: 'Juan Pérez', direccion: 'Av. Corrientes 1234, CABA', estado: 'En tránsito', fechaCreacion: '12/03/2025', fechaEntrega: '21/03/2025' },
    { id: 'PKG-002', destinatario: 'María González', direccion: 'Av. Santa Fe 4567, CABA', estado: 'Pendiente', fechaCreacion: '15/03/2025', fechaEntrega: '23/03/2025' },
    { id: 'PKG-003', destinatario: 'Carlos Rodríguez', direccion: 'Córdoba 2345, Rosario', estado: 'Entregado', fechaCreacion: '10/03/2025', fechaEntrega: '18/03/2025' },
    { id: 'PKG-004', destinatario: 'Ana Martínez', direccion: 'San Martín 789, Mendoza', estado: 'En preparación', fechaCreacion: '17/03/2025', fechaEntrega: '25/03/2025' },
  ];

  const estadoColors: { [key: string]: string } = {
    'Pendiente': 'bg-yellow-100 text-yellow-800',
    'En preparación': 'bg-blue-100 text-blue-800',
    'En tránsito': 'bg-purple-100 text-purple-800',
    'Entregado': 'bg-green-100 text-green-800',
    'default': 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800">PackTrack</h1>
        </div>
        <div className="p-4">
          <div className="flex items-center mb-4 p-2 rounded-md bg-gray-100">
            <Search className="w-5 h-5 text-gray-500 mr-2" />
            <span className="text-gray-500">Buscar...</span>
          </div>
          <nav className="space-y-1">
            {['orders', 'packages', 'tracking', 'delivered', 'dashboard', 'users', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center w-full p-3 rounded-md ${activeTab === tab ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                {tab === 'orders' && <BarChart2 className="w-5 h-5 mr-3" />}
                {tab === 'packages' && <Package className="w-5 h-5 mr-3" />}
                {tab === 'tracking' && <Truck className="w-5 h-5 mr-3" />}
                {tab === 'delivered' && <Scan className="w-5 h-5 mr-3" />}
                {tab === 'dashboard' && <Users className="w-5 h-5 mr-3" />}
                {tab === 'users' && <Users className="w-5 h-5 mr-3" />}
                {tab === 'settings' && <Settings className="w-5 h-5 mr-3" />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
            <hr className="my-2 border-gray-200" />
            <button className="flex items-center w-full p-3 rounded-md text-gray-700 hover:bg-gray-50">
              <LogOut className="w-5 h-5 mr-3" />
              Cerrar sesión
            </button>
          </nav>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm px-6 py-4 flex justify-between">
          <h2 className="text-xl font-semibold text-gray-800 capitalize">{activeTab}</h2>
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">AR</div>
        </header>
        <main className="p-6">
          {activeTab === 'orders' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries({ Total: '128', Entregados: '87', 'En Tránsito': '24', Pendientes: '17' }).map(([key, value]) => (
                <div key={key} className="bg-white shadow rounded-lg p-4 flex items-center">
                  <div className={`p-3 rounded-full ${estadoColors[key] || estadoColors['default']}`}>{key === 'En Tránsito' ? <Truck className="w-6 h-6" /> : <Box className="w-6 h-6" />}</div>
                  <div className="ml-4">
                    <h3 className="text-gray-500 text-sm">{key}</h3>
                    <p className="text-2xl font-semibold text-gray-800">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PackageTrackingDashboard;
