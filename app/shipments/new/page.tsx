'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Package, MapPin, User, Truck, Plus, Trash2, ArrowLeft } from 'lucide-react';

// Define package type options
const packageTypes = [
  { value: 'DOCUMENT', label: 'Documento' },
  { value: 'PARCEL', label: 'Paquete' },
  { value: 'FRAGILE', label: 'Frágil' },
  { value: 'ELECTRONICS', label: 'Electrónica' },
  { value: 'PERISHABLE', label: 'Perecedero' },
];

// Define payment status options
const paymentOptions = [
  { value: 'PAGO', label: 'Pagado' },
  { value: 'NO_PAGO', label: 'No Pagado' },
  { value: 'PAGA_DESTINO', label: 'Pago en Destino' },
];

// Countries list
const countries = [
  { value: 'argentina', label: 'Argentina' },
  { value: 'bolivia', label: 'Bolivia' },
  { value: 'brasil', label: 'Brasil' },
  { value: 'chile', label: 'Chile' },
  { value: 'colombia', label: 'Colombia' },
  { value: 'ecuador', label: 'Ecuador' },
  { value: 'paraguay', label: 'Paraguay' },
  { value: 'peru', label: 'Perú' },
  { value: 'uruguay', label: 'Uruguay' },
  { value: 'venezuela', label: 'Venezuela' },
];

// Package data type definition
interface PackageData {
  id?: string;
  weight: number;
  height?: number;
  width?: number;
  length?: number;
  package_type: string;
}

export default function NewShipmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form data state
  const [formData, setFormData] = useState({
    // Sender information
    sender_name: '',
    sender_dni: '',
    sender_phone: '',
    
    // Receiver information
    receiver_name: '',
    receiver_dni: '',
    receiver_phone: '',
    
    // Origin information
    origin_street: '',
    origin_street_number: '',
    origin_zip_code: '',
    origin_floor: '',
    origin_apartment: '',
    origin_city: '',
    origin_state: '',
    origin_country: 'argentina',
    
    // Destination information
    destination_street: '',
    destination_street_number: '',
    destination_zip_code: '',
    destination_floor: '',
    destination_apartment: '',
    destination_city: '',
    destination_state: '',
    destination_country: 'argentina',
    
    details: '',
    payment: 'PAGO',
  });
  
  // Packages data
  const [packages, setPackages] = useState<PackageData[]>([
    {
      weight: 1,
      package_type: 'PARCEL',
    }
  ]);
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle package input changes
  const handlePackageChange = (index: number, field: keyof PackageData, value: any) => {
    setPackages(prevPackages => {
      const updatedPackages = [...prevPackages];
      updatedPackages[index] = {
        ...updatedPackages[index],
        [field]: value
      };
      return updatedPackages;
    });
  };
  
  // Add a new package
  const addPackage = () => {
    setPackages(prevPackages => [
      ...prevPackages,
      {
        weight: 1,
        package_type: 'PARCEL'
      }
    ]);
  };
  
  // Remove a package
  const removePackage = (index: number) => {
    if (packages.length > 1) {
      setPackages(prevPackages => prevPackages.filter((_, i) => i !== index));
    }
  };
  
  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Prepare data for submission
      const submissionData = {
        // Add sender and receiver info
        sender_name: formData.sender_name,
        sender_dni: formData.sender_dni,
        sender_phone: formData.sender_phone,
        receiver_name: formData.receiver_name,
        receiver_dni: formData.receiver_dni,
        receiver_phone: formData.receiver_phone,
        
        // Origin fields
        origin_street: formData.origin_street,
        origin_street_number: formData.origin_street_number,
        origin_zip_code: formData.origin_zip_code,
        origin_floor: formData.origin_floor,
        origin_apartment: formData.origin_apartment,
        origin_city: formData.origin_city,
        origin_state: formData.origin_state,
        
        // Destination fields
        destination_street: formData.destination_street,
        destination_street_number: formData.destination_street_number,
        destination_zip_code: formData.destination_zip_code,
        destination_floor: formData.destination_floor,
        destination_apartment: formData.destination_apartment,
        destination_city: formData.destination_city,
        destination_state: formData.destination_state,
        
        details: formData.details,
        payment: formData.payment,
        packages: packages,
      };
      
      // Create the shipment
      const response = await fetch('/api/shipments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear el envío');
      }
      
      const data = await response.json();
      
      // Redirect to shipment details page
      router.push(`/shipments/${data.id}`);
      
    } catch (err: any) {
      setError(err.message || 'Error al crear el envío');
      console.error('Error creating shipment:', err);
      setLoading(false);
    }
  };
  
  // Form validation
  const isFormValid = () => {
    return (
      // Sender validation
      formData.sender_name &&
      
      // Origin validation
      formData.origin_street &&
      formData.origin_street_number &&
      formData.origin_city &&
      formData.origin_state &&
      
      // Receiver validation
      formData.receiver_name &&
      
      // Destination validation
      formData.destination_street &&
      formData.destination_street_number &&
      formData.destination_city &&
      formData.destination_state &&
      
      // Package validation
      packages.length > 0 &&
      packages.every(pkg => pkg.weight > 0)
    );
  };
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Crear Nuevo Envío</h1>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Origin Card */}
          <Card className="rounded-3xl shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                Datos de Origen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Sender Info */}
              <div className="space-y-2">
                <Label htmlFor="sender_name">Nombre del Remitente *</Label>
                <Input
                  id="sender_name"
                  name="sender_name"
                  value={formData.sender_name}
                  onChange={handleChange}
                  placeholder="Nombre completo"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sender_dni">DNI</Label>
                  <Input
                    id="sender_dni"
                    name="sender_dni"
                    value={formData.sender_dni}
                    onChange={handleChange}
                    placeholder="12345678"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sender_phone">Teléfono</Label>
                  <Input
                    id="sender_phone"
                    name="sender_phone"
                    value={formData.sender_phone}
                    onChange={handleChange}
                    placeholder="+54 11 1234-5678"
                  />
                </div>
              </div>
              
              {/* Address */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="origin_street">Calle *</Label>
                  <Input
                    id="origin_street"
                    name="origin_street"
                    value={formData.origin_street}
                    onChange={handleChange}
                    placeholder="Nombre de la calle"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="origin_street_number">Número *</Label>
                  <Input
                    id="origin_street_number"
                    name="origin_street_number"
                    value={formData.origin_street_number}
                    onChange={handleChange}
                    placeholder="123"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="origin_floor">Piso</Label>
                  <Input
                    id="origin_floor"
                    name="origin_floor"
                    value={formData.origin_floor}
                    onChange={handleChange}
                    placeholder="1"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="origin_apartment">Departamento</Label>
                  <Input
                    id="origin_apartment"
                    name="origin_apartment"
                    value={formData.origin_apartment}
                    onChange={handleChange}
                    placeholder="A"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="origin_city">Ciudad *</Label>
                  <Input
                    id="origin_city"
                    name="origin_city"
                    value={formData.origin_city}
                    onChange={handleChange}
                    placeholder="Buenos Aires"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="origin_zip_code">Código Postal *</Label>
                  <Input
                    id="origin_zip_code"
                    name="origin_zip_code"
                    value={formData.origin_zip_code}
                    onChange={handleChange}
                    placeholder="1414"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="origin_state">Provincia *</Label>
                <Input
                  id="origin_state"
                  name="origin_state"
                  value={formData.origin_state}
                  onChange={handleChange}
                  placeholder="CABA"
                  required
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Destination Card */}
          <Card className="rounded-3xl shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-red-600" />
                Datos de Destino
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Receiver Info */}
              <div className="space-y-2">
                <Label htmlFor="receiver_name">Nombre del Destinatario *</Label>
                <Input
                  id="receiver_name"
                  name="receiver_name"
                  value={formData.receiver_name}
                  onChange={handleChange}
                  placeholder="Nombre completo"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="receiver_dni">DNI</Label>
                  <Input
                    id="receiver_dni"
                    name="receiver_dni"
                    value={formData.receiver_dni}
                    onChange={handleChange}
                    placeholder="12345678"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="receiver_phone">Teléfono</Label>
                  <Input
                    id="receiver_phone"
                    name="receiver_phone"
                    value={formData.receiver_phone}
                    onChange={handleChange}
                    placeholder="+54 11 1234-5678"
                  />
                </div>
              </div>
              
              {/* Address */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="destination_street">Calle *</Label>
                  <Input
                    id="destination_street"
                    name="destination_street"
                    value={formData.destination_street}
                    onChange={handleChange}
                    placeholder="Nombre de la calle"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="destination_street_number">Número *</Label>
                  <Input
                    id="destination_street_number"
                    name="destination_street_number"
                    value={formData.destination_street_number}
                    onChange={handleChange}
                    placeholder="123"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="destination_floor">Piso</Label>
                  <Input
                    id="destination_floor"
                    name="destination_floor"
                    value={formData.destination_floor}
                    onChange={handleChange}
                    placeholder="1"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="destination_apartment">Departamento</Label>
                  <Input
                    id="destination_apartment"
                    name="destination_apartment"
                    value={formData.destination_apartment}
                    onChange={handleChange}
                    placeholder="A"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="destination_city">Ciudad *</Label>
                  <Input
                    id="destination_city"
                    name="destination_city"
                    value={formData.destination_city}
                    onChange={handleChange}
                    placeholder="Córdoba"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="destination_zip_code">Código Postal *</Label>
                  <Input
                    id="destination_zip_code"
                    name="destination_zip_code"
                    value={formData.destination_zip_code}
                    onChange={handleChange}
                    placeholder="5000"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="destination_state">Provincia *</Label>
                <Input
                  id="destination_state"
                  name="destination_state"
                  value={formData.destination_state}
                  onChange={handleChange}
                  placeholder="Córdoba"
                  required
                />
              </div>
              
            </CardContent>
          </Card>
        </div>
        
        {/* Packages */}
        {packages.map((pkg, index) => (
          <Card key={index} className="mb-6 rounded-3xl shadow-sm">
            <CardHeader className="pb-4 flex flex-row items-center justify-between">
              <CardTitle className="text-xl flex items-center">
                <Package className="h-5 w-5 mr-2 text-blue-600" />
                Paquete {index + 1}
              </CardTitle>
              {packages.length > 1 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => removePackage(index)}
                  className="h-8 w-8 rounded-full"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`packageType-${index}`}>Tipo de Paquete</Label>
                  <Select
                    value={pkg.package_type}
                    onValueChange={(value) => handlePackageChange(index, 'package_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {packageTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`weight-${index}`}>Peso (kg) *</Label>
                  <div className="flex">
                    <Input
                      id={`weight-${index}`}
                      type="number"
                      value={pkg.weight.toString()}
                      onChange={(e) => handlePackageChange(index, 'weight', parseFloat(e.target.value))}
                      placeholder="0.00"
                      required
                      min="0.1"
                      step="0.1"
                      className="rounded-r-none"
                    />
                    <div className="flex items-center justify-center px-3 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md">
                      kg
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`length-${index}`}>Largo (cm)</Label>
                  <div className="flex">
                    <Input
                      id={`length-${index}`}
                      type="number"
                      value={pkg.length?.toString() || ""}
                      onChange={(e) => handlePackageChange(index, 'length', e.target.value ? parseFloat(e.target.value) : undefined)}
                      placeholder="0"
                      min="1"
                      className="rounded-r-none"
                    />
                    <div className="flex items-center justify-center px-3 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md">
                      cm
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`width-${index}`}>Ancho (cm)</Label>
                  <div className="flex">
                    <Input
                      id={`width-${index}`}
                      type="number"
                      value={pkg.width?.toString() || ""}
                      onChange={(e) => handlePackageChange(index, 'width', e.target.value ? parseFloat(e.target.value) : undefined)}
                      placeholder="0"
                      min="1"
                      className="rounded-r-none"
                    />
                    <div className="flex items-center justify-center px-3 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md">
                      cm
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`height-${index}`}>Alto (cm)</Label>
                  <div className="flex">
                    <Input
                      id={`height-${index}`}
                      type="number"
                      value={pkg.height?.toString() || ""}
                      onChange={(e) => handlePackageChange(index, 'height', e.target.value ? parseFloat(e.target.value) : undefined)}
                      placeholder="0"
                      min="1"
                      className="rounded-r-none"
                    />
                    <div className="flex items-center justify-center px-3 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md">
                      cm
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Add Package Button */}
        <div className="flex justify-end mb-8">
          <Button 
            type="button" 
            variant="outline"
            onClick={addPackage}
            className="rounded-full"
          >
            <Plus className="h-4 w-4 mr-2" /> Agregar Paquete
          </Button>
        </div>
        
        {/* Form Buttons */}
        <div className="flex justify-end gap-4">
          <Button 
            type="button"
            variant="outline"
            className="rounded-full"
            onClick={() => router.push('/shipments')}
          >
            Cancelar
          </Button>
          
          <Button 
            type="submit" 
            className="rounded-full px-8"
            disabled={loading || !isFormValid()}
          >
            {loading ? "Procesando..." : "Crear Envío"}
          </Button>
        </div>
      </form>
    </div>
  );
}