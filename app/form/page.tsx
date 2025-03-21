"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"

import {User} from '@/types/prisma';

export default function NewPackagePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [couriers, setCouriers] = useState([])

  // Fetch users and couriers on component mount
  useState(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, couriersResponse] = await Promise.all([fetch("/api/users"), fetch("/api/couriers")])

        const usersData = await usersResponse.json()
        const couriersData = await couriersResponse.json()

        setUsers(usersData)
        setCouriers(couriersData)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast("Error", {
          description: "Failed to load required data",
          // variant: "destructive",
        })
      }
    }

    fetchData()
  })

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.target)
    const packageData = {
      size: formData.get("size"),
      weight: formData.get("weight"),
      state: formData.get("state"),
      courier_id: formData.get("courier_id") || null,
      sender_id: formData.get("sender_id"),
      receiver_id: formData.get("receiver_id"),
      destination_zip_code: formData.get("destination_zip_code"),
      destination_street: formData.get("destination_street"),
      destination_floor: formData.get("destination_floor"),
      destination_city: formData.get("destination_city"),
      destination_state: formData.get("destination_state"),
      destination_country: formData.get("destination_country"),
      destination_apartment: formData.get("destination_apartment") || null,
      destination_btw_st_1: formData.get("destination_btw_st_1"),
      destination_btw_st_2: formData.get("destination_btw_st_2"),
      origin_zip_code: formData.get("origin_zip_code"),
      origin_street: formData.get("origin_street"),
      origin_floor: formData.get("origin_floor"),
      origin_city: formData.get("origin_city"),
      origin_state: formData.get("origin_state"),
      origin_country: formData.get("origin_country"),
      origin_apartment: formData.get("origin_apartment"),
      origin_btw_st_1: formData.get("origin_btw_st_1"),
      origin_btw_st_2: formData.get("origin_btw_st_2"),
      details: formData.get("details") || null,
      units_value: formData.get("units_value"),
      units_number: formData.get("units_number"),
      package_type: formData.get("package_type"),
    }

    try {
      const response = await fetch("/api/packages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(packageData),
      })

      if (!response.ok) {
        throw new Error("Failed to create package")
      }

      const data = await response.json()

      toast("Success", {
        description: "Package created successfully",
      })

      router.push(`/packages/${data.id}`)
    } catch (error) {
      console.error("Error creating package:", error)
      toast("Error", {
        description: "Failed to create package",
        // variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/packages">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Create New Package</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Package Information</CardTitle>
              <CardDescription>Enter the basic details about the package</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="size">Size</Label>
                  <Select name="size" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SMALL">Small</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="LARGE">Large</SelectItem>
                      <SelectItem value="EXTRA_LARGE">Extra Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input type="number" name="weight" step="0.01" min="0" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="package_type">Package Type</Label>
                  <Select name="package_type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DOCUMENT">Document</SelectItem>
                      <SelectItem value="PARCEL">Parcel</SelectItem>
                      <SelectItem value="FRAGILE">Fragile</SelectItem>
                      <SelectItem value="PERISHABLE">Perishable</SelectItem>
                      <SelectItem value="ELECTRONICS">Electronics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">Status</Label>
                  <Select name="state" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="PROCESSING">Processing</SelectItem>
                      <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                      <SelectItem value="DELIVERED">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="units_number">Number of Units</Label>
                  <Input type="number" name="units_number" min="1" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="units_value">Value ($)</Label>
                  <Input type="number" name="units_value" step="0.01" min="0" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="details">Additional Details</Label>
                <Textarea name="details" placeholder="Enter any additional details about the package" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
              <CardDescription>Enter the sender, receiver, and courier details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sender_id">Sender</Label>
                  <Select name="sender_id" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sender" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user: User) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receiver_id">Receiver</Label>
                  <Select name="receiver_id" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select receiver" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user: any) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="courier_id">Courier (Optional)</Label>
                <Select name="courier_id">
                  <SelectTrigger>
                    <SelectValue placeholder="Select courier" />
                  </SelectTrigger>
                  <SelectContent>
                    {couriers.map((courier: any) => (
                      <SelectItem key={courier.id} value={courier.id}>
                        {courier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4">
                <h3 className="font-semibold mb-2">Origin Address</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="origin_street">Street</Label>
                    <Input name="origin_street" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="origin_floor">Floor</Label>
                    <Input name="origin_floor" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="origin_apartment">Apartment</Label>
                    <Input name="origin_apartment" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="origin_zip_code">ZIP Code</Label>
                    <Input name="origin_zip_code" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="origin_city">City</Label>
                    <Input name="origin_city" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="origin_state">State/Province</Label>
                    <Input name="origin_state" required />
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <Label htmlFor="origin_country">Country</Label>
                  <Input name="origin_country" required />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="origin_btw_st_1">Between Street 1</Label>
                    <Input name="origin_btw_st_1" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="origin_btw_st_2">Between Street 2</Label>
                    <Input name="origin_btw_st_2" required />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <h3 className="font-semibold mb-2">Destination Address</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="destination_street">Street</Label>
                    <Input name="destination_street" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="destination_floor">Floor</Label>
                    <Input name="destination_floor" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="destination_apartment">Apartment</Label>
                    <Input name="destination_apartment" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="destination_zip_code">ZIP Code</Label>
                    <Input name="destination_zip_code" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="destination_city">City</Label>
                    <Input name="destination_city" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="destination_state">State/Province</Label>
                    <Input name="destination_state" required />
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <Label htmlFor="destination_country">Country</Label>
                  <Input name="destination_country" required />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="destination_btw_st_1">Between Street 1</Label>
                    <Input name="destination_btw_st_1" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="destination_btw_st_2">Between Street 2</Label>
                    <Input name="destination_btw_st_2" required />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end mt-6">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Package"}
          </Button>
        </div>
      </form>
    </div>
  )
}

