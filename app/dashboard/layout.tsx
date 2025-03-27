// app/dashboard/layout.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Package, Truck, BarChart2, Users, Settings, LogOut, Plus, Box, Scan } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('');

  // If not authenticated, redirect to login
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Set active tab based on current path
  useEffect(() => {
    if (pathname.includes('/dashboard/orders')) {
      setActiveTab('orders');
    } else if (pathname.includes('/dashboard/packages')) {
      setActiveTab('packages');
    } else if (pathname.includes('/dashboard/tracking')) {
      setActiveTab('tracking');
    } else if (pathname.includes('/dashboard/users')) {
      setActiveTab('users');
    } else if (pathname.includes('/dashboard/settings')) {
      setActiveTab('settings');
    } else {
      setActiveTab('dashboard');
    }
  }, [pathname]);

  // Show loading state
  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const userRole = session?.user?.role || 'USER';

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800">Despachos Online</h1>
        </div>
        <div className="p-4">
          <div className="flex items-center mb-6 p-3 rounded-md bg-gray-100">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
              {session?.user?.name?.charAt(0) || 'U'}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{session?.user?.name}</p>
              <p className="text-xs text-gray-500">{userRole}</p>
            </div>
          </div>
          
          <nav className="space-y-1">
            {/* Dashboard - All roles */}
            <Link
              href="/dashboard"
              className={`flex items-center w-full p-3 rounded-md ${
                activeTab === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <BarChart2 className="w-5 h-5 mr-3" />
              Dashboard
            </Link>
            
            {/* Packages - Admin and Employee */}
            {(userRole === 'ADMIN' || userRole === 'EMPLOYEE') && (
              <Link
                href="/dashboard/packages"
                className={`flex items-center w-full p-3 rounded-md ${
                  activeTab === 'packages' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Package className="w-5 h-5 mr-3" />
                Packages
              </Link>
            )}
            
            {/* Tracking - All roles */}
            <Link
              href="/dashboard/tracking"
              className={`flex items-center w-full p-3 rounded-md ${
                activeTab === 'tracking' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Truck className="w-5 h-5 mr-3" />
              Tracking
            </Link>
            
            {/* Orders - Admin and Employee only */}
            {(userRole === 'ADMIN' || userRole === 'EMPLOYEE') && (
            <Link
                href="/dashboard/orders"
                className={`flex items-center w-full p-3 rounded-md ${
                activeTab === 'orders' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
                <Box className="w-5 h-5 mr-3" />
                Orders
            </Link>
            )}
            
            {/* Users - Admin only */}
            {userRole === 'ADMIN' && (
              <Link
                href="/dashboard/users"
                className={`flex items-center w-full p-3 rounded-md ${
                  activeTab === 'users' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Users className="w-5 h-5 mr-3" />
                Users
              </Link>
            )}
            
            {/* Settings - Admin and Employee */}
            {(userRole === 'ADMIN' || userRole === 'EMPLOYEE') && (
              <Link
                href="/dashboard/settings"
                className={`flex items-center w-full p-3 rounded-md ${
                  activeTab === 'settings' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Settings className="w-5 h-5 mr-3" />
                Settings
              </Link>
            )}
            
            <hr className="my-2 border-gray-200" />
            
            {/* Logout Button */}
            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center w-full p-3 rounded-md text-gray-700 hover:bg-gray-50"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Cerrar sesión
            </button>
          </nav>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm px-6 py-4 flex justify-between">
          <h2 className="text-xl font-semibold text-gray-800 capitalize">{activeTab}</h2>
          
          {/* Add new buttons - role based */}
          <div className="flex items-center space-x-4">
            {/* New Package button - Admin and Employee only */}
            {(userRole === 'ADMIN' || userRole === 'EMPLOYEE') && activeTab === 'packages' && (
              <Link href="/shipments/new">
                <Button className="flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Paquete
                </Button>
              </Link>
            )}
            
            {/* New User button - Admin only */}
            {userRole === 'ADMIN' && activeTab === 'users' && (
              <Link href="/dashboard/users/new">
                <Button className="flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Usuario
                </Button>
              </Link>
            )}
          </div>
        </header>
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}