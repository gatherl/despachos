// app/dashboard/orders/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  Search,
  Clock,
  ArrowRight,
  FileDown,
  Printer,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrderData {
  id: string;
  tracking_id: string;
  state: string;
  creation_date: string;
  sender_name: string | null;
  receiver_name: string | null;
  destination_city: string;
  destination_state: string;
}

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("CREATED");

  // Redirect if not admin or employee
  useEffect(() => {
    if (
      status === "authenticated" &&
      session?.user?.role !== "ADMIN" &&
      session?.user?.role !== "EMPLOYEE"
    ) {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/shipments?state=${statusFilter}`);

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError("Error loading orders. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (
      (session?.user?.role === "ADMIN" || session?.user?.role === "EMPLOYEE") &&
      status === "authenticated"
    ) {
      fetchOrders();
    }
  }, [session, status, statusFilter]);

  // Filter orders based on search term
  const filteredOrders = orders.filter(
    (order) =>
      (order.sender_first_name + " " + order.sender_last_name)
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (order.receiver_first_name + " " + order.receiver_last_name)
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.destination_city
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.destination_state?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-AR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Generate PDF label
  const handleGenerateLabel = async (shipmentId: string) => {
    try {
      window.open(`/api/shipments/${shipmentId}/pdf`, "_blank");
    } catch (err) {
      console.error("Error generating label:", err);
      alert("Error generating shipping label. Please try again.");
    }
  };

  // Handle status change
  const handleStatusChange = async (shipmentId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/shipments/${shipmentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          state: newStatus,
          state_date: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update shipment status");
      }

      // Update local state to reflect the change
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === shipmentId ? { ...order, state: newStatus } : order
        )
      );

      // If using the current status as filter, remove the item from the list
      if (statusFilter === "CREATED" && newStatus !== "CREATED") {
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.id !== shipmentId)
        );
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Error updating shipment status. Please try again.");
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="animate-spin h-12 w-12 text-blue-500" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
        <Link href="/shipments/new">
          <Button className="flex items-center">
            <Package className="w-4 h-4 mr-2" />
            Create New Shipment
          </Button>
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <h3 className="text-2xl font-bold text-blue-700">
                  {orders.filter((o) => o.state === "CREATED").length}
                </h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Clock className="h-5 w-5 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Today's Orders
                </p>
                <h3 className="text-2xl font-bold text-green-700">
                  {
                    orders.filter((o) => {
                      const today = new Date();
                      const creationDate = new Date(o.creation_date);
                      return (
                        creationDate.setHours(0, 0, 0, 0) ===
                        today.setHours(0, 0, 0, 0)
                      );
                    }).length
                  }
                </h3>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Package className="h-5 w-5 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Processing</p>
                <h3 className="text-2xl font-bold text-purple-700">
                  {orders.filter((o) => o.state === "PICKED_UP").length}
                </h3>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <ArrowRight className="h-5 w-5 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex justify-between items-center">
            <span>Shipment Orders</span>
            <div className="flex items-center space-x-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CREATED">Created</SelectItem>
                  <SelectItem value="PICKED_UP">Picked Up</SelectItem>
                  <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardTitle>
          <div className="flex items-center mt-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-gray-500 border-b">
                  <th className="px-4 py-3 font-medium">Tracking</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3 font-medium">From</th>
                  <th className="px-4 py-3 font-medium">To</th>
                  <th className="px-4 py-3 font-medium">Destination</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      No orders found with status: {statusFilter}
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Link
                          href={`/shipments/${order.id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {order.tracking_id}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatDate(order.creation_date)}
                      </td>
                      <td className="px-4 py-3">
                        {(
                          (order.sender_first_name || "") +
                          " " +
                          (order.sender_last_name || "")
                        ).trim() || "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        {(
                          (order.receiver_first_name || "") +
                          " " +
                          (order.receiver_last_name || "")
                        ).trim() || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {order.destination_city}, {order.destination_state}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleGenerateLabel(order.id)}
                            className="h-8 w-8 p-0"
                            title="Print Label"
                          >
                            <Printer className="h-4 w-4" />
                          </Button>

                          {order.state === "CREATED" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleStatusChange(order.id, "PICKED_UP")
                              }
                              className="h-8 w-8 p-0 text-green-600 border-green-200 hover:bg-green-50"
                              title="Mark as Picked Up"
                            >
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          )}

                          <Link href={`/shipments/${order.id}`}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 px-3"
                            >
                              Details
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
