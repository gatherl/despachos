'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Package, MapPin, User, Truck, Plus, Trash2, ArrowLeft } from 'lucide-react';

// Package type definition
interface PackageData {
  id: string;
  package_type: string;
  size: string;
  weight: number;
  length?: number;
  width?: number;
  height?: number;
  units_value: number;
  details?: string;
}

// Define types of packages
const packageTypes = [
  { value: 'Document', label: 'Documento' },
  { value: 'Parcel', label: 'Paquete' },
  { value: 'Fragile', label: 'Frágil' },
  { value: 'Electronics', label: 'Electrónica' },
  { value: 'Perishable', label: 'Perecedero' },
];

// Define sizes of packages
const packageSizes = [
  { value: 'Small', label: 'Pequeño' },
  { value: 'Medium', label: 'Mediano' },
  { value: 'Large', label: 'Grande' },
  { value: 'Extra Large', label: 'Extra Grande' },
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

export default function NewPackagePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form data state for sender and receiver
  const [formData, setFormData] = useState({
    // Sender information
    sender_name: '',
    sender_id_number: '',
    sender_street: '',
    sender_zip_code: '',
    sender_apartment: '',
    sender_directions: '',
    sender_phone: '',
    sender_city: '',
    sender_state: '',
    sender_country: 'argentina',
    
    // Receiver information
    receiver_name: '',
    receiver_id_number: '',
    receiver_street: '',
    receiver_zip_code: '',
    receiver_apartment: '',
    receiver_directions: '',
    receiver_phone: '',
    receiver_city: '',
    receiver_state: '',
    receiver_country: 'argentina',
    
    // For API requirements
    courier_id: '55765151-10d6-41a9-aa6b-f1bbdeb1e3ef', // Default value
  });

  // Packages data
  const [packages, setPackages] = useState<PackageData[]>([
    {
      id: '1',
      package_type: 'Parcel',
      size: 'Medium',
      weight: 1,
      length: 10,
      width: 10,
      height: 10,
      units_value: 1,
      details: '',
    }
  ]);

  // Handle input changes for form data
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

  // Handle package select changes
  const handlePackageSelectChange = (index: number, field: keyof PackageData, value: string) => {
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
        id: (prevPackages.length + 1).toString(),
        package_type: 'Parcel',
        size: 'Medium',
        weight: 1,
        length: 10,
        width: 10,
        height: 10,
        units_value: 1,
        details: '',
      }
    ]);
  };

  // Remove a package
  const removePackage = (index: number) => {
    if (packages.length > 1) {
      setPackages(prevPackages => prevPackages.filter((_, i) => i !== index));
    }
  };

  // Prepare data for API submission
  const prepareSubmissionData = (pkg: PackageData, index: number) => {
    // Create mock sender_id and receiver_id if they don't exist
    const sender_id = 'bd652f6c-35f5-4fd6-9ae1-d2c4b200f99c'; // Example ID from API doc
    const receiver_id = 'bd652f6c-35f5-4fd6-9ae1-d2c4b200f99c'; // Example ID from API doc
    
    // Create tracking ID
    const tracking_id = `TRK${Math.floor(Math.random() * 1000000)}`;

    // Map form data to API expected format
    return {
      // Package details
      size: pkg.size,
      weight: pkg.weight,
      tracking_id: tracking_id,
      state: 'Created',
      state_date: new Date().toISOString(),
      package_type: pkg.package_type,
      details: pkg.details || '',
      units_value: 1,
      units_number: 1,
      
      // Sender details
      sender_id: sender_id,
      origin_street: formData.sender_street,
      origin_zip_code: formData.sender_zip_code,
      origin_apartment: formData.sender_apartment || 'N/A',
      origin_floor: '1', // Default value as required by model
      origin_city: formData.sender_city || 'Ciudad por defecto',
      origin_state: formData.sender_state || 'Estado por defecto',
      origin_country: formData.sender_country || 'argentina',
      origin_btw_st_1: 'Calle 1', // Default values
      origin_btw_st_2: 'Calle 2', // Default values
      
      // Receiver details
      receiver_id: receiver_id,
      destination_street: formData.receiver_street,
      destination_zip_code: formData.receiver_zip_code,
      destination_apartment: formData.receiver_apartment || 'N/A',
      destination_floor: '1', // Default value as required by model
      destination_city: formData.receiver_city || 'Ciudad por defecto',
      destination_state: formData.receiver_state || 'Estado por defecto',
      destination_country: formData.receiver_country || 'argentina',
      destination_btw_st_1: 'Calle 1', // Default values
      destination_btw_st_2: 'Calle 2', // Default values
      
      // Optional courier
      courier_id: formData.courier_id,
    };
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Use the first package for now (in a real app, you'd submit all packages)
      const submissionData = prepareSubmissionData(packages[0], 0);
      
      console.log('Submitting data:', submissionData);
      
      const response = await fetch('/api/packages', {
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
      
      const result = await response.json();
      
      // Redirect to package details page
      router.push(`/packages/${result.id}`);
      
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : 'Error al crear el envío');
      console.error(err);
    }
  };

  // Validation for form data
  const isFormValid = () => {
    // Basic validation for sender
    const isSenderValid = formData.sender_name && formData.sender_street && formData.sender_city;
    
    // Basic validation for receiver
    const isReceiverValid = formData.receiver_name && formData.receiver_street && formData.receiver_city;
    
    // Basic validation for packages
    const arePackagesValid = packages.every(pkg => pkg.weight > 0);
    
    return isSenderValid && isReceiverValid && arePackagesValid;
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Nuevo Envío</h1>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Sender Card */}
          <Card className="rounded-3xl shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Datos Personales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sender_name">Nombre Completo *</Label>
                <Input
                  id="sender_name"
                  name="sender_name"
                  value={formData.sender_name}
                  onChange={handleChange}
                  placeholder="Nombre y apellidos"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sender_id_number">DNI / Documento</Label>
                  <Input
                    id="sender_id_number"
                    name="sender_id_number"
                    value={formData.sender_id_number}
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
                    placeholder="+54 9 11 1234-5678"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sender_street">Dirección *</Label>
                <Input
                  id="sender_street"
                  name="sender_street"
                  value={formData.sender_street}
                  onChange={handleChange}
                  placeholder="Av. Rivadavia 1234"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sender_city">Ciudad *</Label>
                  <Input
                    id="sender_city"
                    name="sender_city"
                    value={formData.sender_city}
                    onChange={handleChange}
                    placeholder="Buenos Aires"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sender_zip_code">Código Postal</Label>
                  <Input
                    id="sender_zip_code"
                    name="sender_zip_code"
                    value={formData.sender_zip_code}
                    onChange={handleChange}
                    placeholder="C1414"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sender_state">Provincia</Label>
                  <Input
                    id="sender_state"
                    name="sender_state"
                    value={formData.sender_state}
                    onChange={handleChange}
                    placeholder="CABA"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sender_country">País</Label>
                  <Select
                    value={formData.sender_country}
                    onValueChange={(value) => handleSelectChange('sender_country', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar país" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map(country => (
                        <SelectItem key={country.value} value={country.value}>
                          {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Receiver Card */}
          <Card className="rounded-3xl shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Destinatario</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="receiver_name">Nombre Completo *</Label>
                <Input
                  id="receiver_name"
                  name="receiver_name"
                  value={formData.receiver_name}
                  onChange={handleChange}
                  placeholder="Nombre y apellidos"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="receiver_id_number">DNI / Documento</Label>
                  <Input
                    id="receiver_id_number"
                    name="receiver_id_number"
                    value={formData.receiver_id_number}
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
                    placeholder="+54 9 11 1234-5678"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="receiver_street">Dirección *</Label>
                <Input
                  id="receiver_street"
                  name="receiver_street"
                  value={formData.receiver_street}
                  onChange={handleChange}
                  placeholder="Av. Corrientes 1234"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="receiver_city">Ciudad *</Label>
                  <Input
                    id="receiver_city"
                    name="receiver_city"
                    value={formData.receiver_city}
                    onChange={handleChange}
                    placeholder="Córdoba"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="receiver_zip_code">Código Postal</Label>
                  <Input
                    id="receiver_zip_code"
                    name="receiver_zip_code"
                    value={formData.receiver_zip_code}
                    onChange={handleChange}
                    placeholder="X5000"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="receiver_state">Provincia</Label>
                  <Input
                    id="receiver_state"
                    name="receiver_state"
                    value={formData.receiver_state}
                    onChange={handleChange}
                    placeholder="Córdoba"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="receiver_country">País</Label>
                  <Select
                    value={formData.receiver_country}
                    onValueChange={(value) => handleSelectChange('receiver_country', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar país" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map(country => (
                        <SelectItem key={country.value} value={country.value}>
                          {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Packages */}
        {packages.map((pkg, index) => (
          <Card key={pkg.id} className="mb-6 rounded-3xl shadow-sm">
            <CardHeader className="pb-4 flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Paquete {index + 1}</CardTitle>
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
                    onValueChange={(value) => handlePackageSelectChange(index, 'package_type', value)}
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
                  <Label htmlFor={`size-${index}`}>Tamaño</Label>
                  <Select
                    value={pkg.size}
                    onValueChange={(value) => handlePackageSelectChange(index, 'size', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tamaño" />
                    </SelectTrigger>
                    <SelectContent>
                      {packageSizes.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
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

                <div className="space-y-2">
                  <Label htmlFor={`length-${index}`}>Largo (cm)</Label>
                  <div className="flex">
                    <Input
                      id={`length-${index}`}
                      type="number"
                      value={pkg.length?.toString() || "0"}
                      onChange={(e) => handlePackageChange(index, 'length', parseFloat(e.target.value))}
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
                      value={pkg.width?.toString() || "0"}
                      onChange={(e) => handlePackageChange(index, 'width', parseFloat(e.target.value))}
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
                      value={pkg.height?.toString() || "0"}
                      onChange={(e) => handlePackageChange(index, 'height', parseFloat(e.target.value))}
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

              <div className="space-y-2">
                <Label htmlFor={`description-${index}`}>Descripción del Paquete</Label>
                <Textarea
                  id={`description-${index}`}
                  value={pkg.details || ''}
                  onChange={(e) => handlePackageChange(index, 'details', e.target.value)}
                  placeholder="Describa el contenido de su paquete"
                  className="min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add Package Button - Positioned to the right */}
        <div className="flex justify-end mb-8">
          <Button 
            type="button" 
            variant="outline"
            onClick={addPackage}
            className="rounded-full"
          >
            + Paquete
          </Button>
        </div>

        {/* Create Shipment Button - Right aligned */}
        <div className="flex justify-end">
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