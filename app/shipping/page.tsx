import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, User, MapPin, ArrowRight } from "lucide-react"

export default function ShippingPage() {
  return (
    <div className="container mx-auto py-10">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Shipping Information</CardTitle>
          <CardDescription>Enter the sender and receiver details along with package information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sender Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium">Sender Information</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sender-name">Full Name</Label>
                  <Input id="sender-name" placeholder="Enter full name" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sender-id">ID / Document Number</Label>
                  <Input id="sender-id" placeholder="Enter ID number" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sender-street">Street Address</Label>
                  <Input id="sender-street" placeholder="Enter street address" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sender-zip">Zip Code</Label>
                    <Input id="sender-zip" placeholder="Enter zip code" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sender-apt">Apartment/Suite</Label>
                    <Input id="sender-apt" placeholder="Apt/Suite #" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sender-directions">Additional Directions</Label>
                  <Textarea
                    id="sender-directions"
                    placeholder="Enter any additional directions or landmarks"
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sender-phone">Phone Number</Label>
                  <Input id="sender-phone" placeholder="Enter phone number" />
                </div>
              </div>

              {/* Receiver Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium">Receiver Information</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receiver-name">Full Name</Label>
                  <Input id="receiver-name" placeholder="Enter full name" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receiver-id">ID / Document Number</Label>
                  <Input id="receiver-id" placeholder="Enter ID number" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receiver-street">Street Address</Label>
                  <Input id="receiver-street" placeholder="Enter street address" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="receiver-zip">Zip Code</Label>
                    <Input id="receiver-zip" placeholder="Enter zip code" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="receiver-apt">Apartment/Suite</Label>
                    <Input id="receiver-apt" placeholder="Apt/Suite #" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receiver-directions">Additional Directions</Label>
                  <Textarea
                    id="receiver-directions"
                    placeholder="Enter any additional directions or landmarks"
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receiver-phone">Phone Number</Label>
                  <Input id="receiver-phone" placeholder="Enter phone number" />
                </div>
              </div>
            </div>

            {/* Divider */}
            <Separator className="my-8" />

            {/* Package Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Package className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">Package Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="package-weight">Weight</Label>
                  <div className="flex">
                    <Input id="package-weight" type="number" placeholder="0.00" />
                    <Select defaultValue="kg">
                      <SelectTrigger className="w-[80px]">
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="lb">lb</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="package-length">Length</Label>
                  <div className="flex">
                    <Input id="package-length" type="number" placeholder="0.00" />
                    <Select defaultValue="cm">
                      <SelectTrigger className="w-[80px]">
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cm">cm</SelectItem>
                        <SelectItem value="in">in</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="package-width">Width</Label>
                  <div className="flex">
                    <Input id="package-width" type="number" placeholder="0.00" />
                    <Select defaultValue="cm">
                      <SelectTrigger className="w-[80px]">
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cm">cm</SelectItem>
                        <SelectItem value="in">in</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="package-height">Height</Label>
                  <div className="flex">
                    <Input id="package-height" type="number" placeholder="0.00" />
                    <Select defaultValue="cm">
                      <SelectTrigger className="w-[80px]">
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cm">cm</SelectItem>
                        <SelectItem value="in">in</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="package-units">Number of Units</Label>
                  <Input id="package-units" type="number" placeholder="1" min="1" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="package-unit-weight">Unit Weight</Label>
                  <div className="flex">
                    <Input id="package-unit-weight" type="number" placeholder="0.00" />
                    <Select defaultValue="kg">
                      <SelectTrigger className="w-[80px]">
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="lb">lb</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="package-description">Package Description</Label>
                <Textarea
                  id="package-description"
                  placeholder="Describe the contents of your package"
                  className="min-h-[80px]"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-end">
              <Button type="submit" className="flex items-center gap-2">
                Submit Package Information
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

