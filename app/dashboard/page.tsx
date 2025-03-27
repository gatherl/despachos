// app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Package, Truck, CheckCircle, Calendar, ArrowUp, ArrowDown, 
  PackageOpen, Clock, UserCircle, MapPin 
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardHome() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    totalShipments: 0,
    inTransit: 0,
    delivered: 0,
    pendingPickup: 0,
    recentShipments: [],
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, this would fetch from an API endpoint
    // For demonstration purposes, we're using mock data
    const fetchDashboardData = async () => {
      setLoading(true);
      
      // Mock data - in a real app, fetch from API
      setTimeout(() => {
        setStats({
          totalShipments: 128,
          inTransit: 24,
          delivered: 87,
          pendingPickup: 17,
          recentShipments: []
        });
        setLoading(false);
      }, 1000);
    };
    
    fetchDashboardData();
  }, []);

  const userRole = session?.user?.role || 'USER';
  
  // Get status badge styles based on shipment state
  const getStatusBadge = (state: string) => {
    switch (state) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'IN_TRANSIT':
        return 'bg-blue-100 text-blue-800';
      case 'PICKED_UP':
        return 'bg-indigo-100 text-indigo-800';
      case 'CREATED':
        return 'bg-purple-100 text-purple-800';
      case 'RETURNED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format status text for display
  const formatStatus = (state: string) => {
    switch (state) {
      case 'DELIVERED':
        return 'Delivered';
      case 'IN_TRANSIT':
        return 'In Transit';
      case 'PICKED_UP':
        return 'Picked Up';
      case 'CREATED':
        return 'Created';
      case 'RETURNED':
        return 'Returned';
      default:
        return state;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {session?.user?.name || 'User'}
        </h1>
        <p className="text-gray-600 mt-1">
          Here's an overview of your shipping operations
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Shipments</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats.totalShipments}</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">In Transit</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats.inTransit}</h3>
              </div>
              <div className="bg-indigo-100 p-3 rounded-full">
                <Truck className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Delivered</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats.delivered}</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Pending Pickup</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats.pendingPickup}</h3>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <PackageOpen className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Shipments */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Recent Shipments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-gray-500 border-b">
                  <th className="px-4 py-3 font-medium">Tracking</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Destination</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {stats.recentShipments.map((shipment: any) => (
                  <tr key={shipment.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-blue-600 font-medium">
                      {shipment.tracking_id}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(shipment.state)}`}>
                        {formatStatus(shipment.state)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                        {shipment.destination_city}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard/tracking?tracking_id=${shipment.tracking_id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Show more link */}
          {(userRole === 'ADMIN' || userRole === 'EMPLOYEE') && (
            <div className="mt-4 text-center">
              <Link
                href="/dashboard/packages"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View All Shipments
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Role-specific content */}
      {userRole === 'ADMIN' && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Administrative Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/dashboard/users">
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 flex items-center">
                  <div className="mr-4 bg-purple-100 p-3 rounded-full">
                    <UserCircle className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">User Management</h3>
                    <p className="text-sm text-gray-500">Add, edit, or remove system users</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/dashboard/settings">
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 flex items-center">
                  <div className="mr-4 bg-gray-100 p-3 rounded-full">
                    <Calendar className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Reports</h3>
                    <p className="text-sm text-gray-500">View and export system reports</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/shipments/new">
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 flex items-center">
                  <div className="mr-4 bg-green-100 p-3 rounded-full">
                    <Package className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Create Shipment</h3>
                    <p className="text-sm text-gray-500">Create a new shipment entry</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      )}
      
      {userRole === 'TRANSPORTIST' && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Transportist Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/dashboard/tracking">
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 flex items-center">
                  <div className="mr-4 bg-blue-100 p-3 rounded-full">
                    <Truck className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Track Shipments</h3>
                    <p className="text-sm text-gray-500">View shipment status and details</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Card className="h-full">
              <CardContent className="p-6">
                <h3 className="font-medium mb-2">Today's Stats</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Shipments Delivered</span>
                    <span className="font-medium flex items-center text-green-600">
                      <ArrowUp className="h-4 w-4 mr-1" /> 12
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Pending Deliveries</span>
                    <span className="font-medium flex items-center text-orange-600">
                      <Clock className="h-4 w-4 mr-1" /> 5
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Returns</span>
                    <span className="font-medium flex items-center text-gray-600">
                      <ArrowDown className="h-4 w-4 mr-1" /> 2
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      
      {userRole === 'EMPLOYEE' && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/shipments/new">
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 flex items-center">
                  <div className="mr-4 bg-green-100 p-3 rounded-full">
                    <Package className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Create Shipment</h3>
                    <p className="text-sm text-gray-500">Create a new shipment entry</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/dashboard/tracking">
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 flex items-center">
                  <div className="mr-4 bg-blue-100 p-3 rounded-full">
                    <Truck className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Track Package</h3>
                    <p className="text-sm text-gray-500">Check shipment status</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/dashboard/settings">
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 flex items-center">
                  <div className="mr-4 bg-purple-100 p-3 rounded-full">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">View Reports</h3>
                    <p className="text-sm text-gray-500">Check delivery performance</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      )}
      
      {/* Performance Metrics - All roles can see this */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                On-Time Delivery Rate
              </h3>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-gray-900">92.7%</span>
                <span className="text-sm text-green-600 flex items-center pb-1">
                  <ArrowUp className="h-3 w-3 mr-0.5" /> 3.2%
                </span>
              </div>
              <div className="mt-2 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '92.7%' }}></div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Average Delivery Time
              </h3>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-gray-900">1.4 days</span>
                <span className="text-sm text-green-600 flex items-center pb-1">
                  <ArrowDown className="h-3 w-3 mr-0.5" /> 0.3
                </span>
              </div>
              <div className="mt-2 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Customer Satisfaction
              </h3>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-gray-900">4.8/5</span>
                <span className="text-sm text-green-600 flex items-center pb-1">
                  <ArrowUp className="h-3 w-3 mr-0.5" /> 0.2
                </span>
              </div>
              <div className="mt-2 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 rounded-full" style={{ width: '96%' }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}