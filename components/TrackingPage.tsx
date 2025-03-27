import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Package, Search, Truck, AlertCircle, Share2, Camera, X } from 'lucide-react';
import ShipmentStatusTimeline from '@/components/ShipmentStatusTimeline';
import TrackingQRCode from '@/components/TrackingQRCode';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Html5Qrcode } from 'html5-qrcode';

const TrackingPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [trackingId, setTrackingId] = useState('');
  const [shipmentData, setShipmentData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [scannerVisible, setScannerVisible] = useState(false);
  
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = 'qr-reader';

  // Comprobar parámetros URL para tracking_id en la carga inicial
  useEffect(() => {
    const trackingParam = searchParams.get('tracking_id');
    
    if (trackingParam) {
      setTrackingId(trackingParam);
      handleSearch(trackingParam);
    }
  }, [searchParams]);

  // Inicializar y limpiar el scanner QR
  useEffect(() => {
    // Solo inicializar el scanner cuando sea visible
    if (scannerVisible) {
      // Crear la instancia de scanner
      scannerRef.current = new Html5Qrcode(scannerContainerId);
      
      // Iniciar el escaneo
      scannerRef.current.start(
        { facingMode: "environment" }, // Usar cámara trasera si está disponible
        {
          fps: 10,
          qrbox: {
            width: Math.min(250, window.innerWidth * 0.7), 
            height: Math.min(250, window.innerWidth * 0.7)
          },
          aspectRatio: window.innerHeight > window.innerWidth ? 1.77 : 1.33 // Ajustar para móvil o desktop
        },
        (decodedText) => {
          // Éxito - QR escaneado
          handleQrResult(decodedText);
        },
        (errorMessage) => {
          // Error en el escaneo (ignoramos errores comunes de no detectar código)
          if (errorMessage.includes("No QR code found")) {
            return;
          }
          console.error("Error al escanear:", errorMessage);
        }
      ).catch(err => {
        console.error("Error al iniciar el scanner:", err);
        setError("No se pudo acceder a la cámara. Por favor, verifica los permisos e inténtalo de nuevo.");
      });
    }

    // Limpiar y detener el scanner al desmontar o cuando no sea visible
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(err => {
          console.error("Error al detener el scanner:", err);
        });
      }
    };
  }, [scannerVisible]);

  const handleSearch = async (id = trackingId) => {
    if (!id.trim()) {
      setError('Por favor, introduce un número de seguimiento');
      return;
    }

    setLoading(true);
    setError(null);
    setSearchPerformed(true);
    setScannerVisible(false);
    
    try {
      const response = await fetch(`/api/shipments?tracking_id=${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Envío no encontrado. Por favor, verifica el número de seguimiento e inténtalo de nuevo.');
        }
        throw new Error('Error al buscar el envío');
      }
      
      const data = await response.json();
      setShipmentData(data);
      
      // Actualizar URL con el ID de seguimiento sin recargar la página
      const params = new URLSearchParams(searchParams.toString());
      params.set('tracking_id', id);
      router.push(`/tracking?${params.toString()}`, { scroll: false });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error al buscar tu envío');
      setShipmentData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const handleQrResult = (result: string) => {
    if (result) {
      // Detener el scanner después de un escaneo exitoso
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
      
      // Extraer tracking_id del QR si es una URL
      try {
        const url = new URL(result);
        const trackingParam = url.searchParams.get('tracking_id');
        
        if (trackingParam) {
          setTrackingId(trackingParam);
          handleSearch(trackingParam);
        } else {
          // Si el QR no contiene un param tracking_id,
          // asumimos que todo el texto es el tracking ID
          setTrackingId(result);
          handleSearch(result);
        }
      } catch (e) {
        // Si no es una URL, tratamos todo el resultado como el tracking ID
        setTrackingId(result);
        handleSearch(result);
      }
    }
  };

  // Función auxiliar para formatear fechas
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
              <Package className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Seguimiento de Paquetes</h1>
          <p className="text-gray-600 max-w-md mx-auto text-sm sm:text-base">
            Introduce tu número de seguimiento o escanea un código QR para obtener actualizaciones en tiempo real de tu envío
          </p>
        </div>

        {/* Formulario de búsqueda */}
        <Card className="mb-8 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Search className="mr-2 h-5 w-5 text-blue-600" />
              Seguimiento de Paquete
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!scannerVisible ? (
              <div className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-0 sm:flex sm:gap-3">
                  <div className="flex-grow">
                    <Input
                      placeholder="Introduce número de seguimiento (ej., TRK123456)"
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {loading ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Buscando...
                      </>
                    ) : "Buscar Paquete"}
                  </Button>
                </form>

                <div className="pt-4 flex justify-center border-t border-gray-100">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2 w-full sm:w-auto"
                    onClick={() => setScannerVisible(true)}
                  >
                    <Camera className="h-4 w-4" />
                    Escanear Código QR
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute top-2 right-2 z-10">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full p-2 h-auto"
                    onClick={() => setScannerVisible(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="bg-black text-white text-center py-2 mb-2 rounded-t-md">
                  <p className="text-sm">Posiciona el código QR frente a la cámara</p>
                </div>
                
                <div className="overflow-hidden rounded-b-md">
                  <div 
                    id={scannerContainerId} 
                    className="w-full h-72 sm:h-96 bg-gray-100 flex items-center justify-center"
                    style={{ minHeight: '300px' }}
                  >
                    <div className="animate-pulse text-gray-500">
                      Inicializando cámara...
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => setScannerVisible(false)}
                  >
                    Volver a la búsqueda manual
                  </Button>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sección de resultados */}
        {searchPerformed && (
          <div className="transition-all duration-300">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : shipmentData ? (
              <div className="space-y-6">
                {/* Resumen del envío */}
                <Card className="shadow-md overflow-hidden">
                  <div className="bg-blue-600 text-white px-4 sm:px-6 py-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <div>
                        <h2 className="text-xl font-semibold">Seguimiento: {shipmentData.tracking_id}</h2>
                        <p className="text-blue-100 text-sm">Creado el {formatDate(shipmentData.creation_date)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium 
                          ${shipmentData.state === 'DELIVERED' ? 'bg-green-100 text-green-800' : 
                          shipmentData.state === 'IN_TRANSIT' ? 'bg-blue-100 text-blue-800' :
                          shipmentData.state === 'CREATED' ? 'bg-purple-100 text-purple-800' :
                          shipmentData.state === 'PICKED_UP' ? 'bg-indigo-100 text-indigo-800' :
                          shipmentData.state === 'RETURNED' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'}`}
                        >
                          {shipmentData.state === 'DELIVERED' ? 'ENTREGADO' :
                           shipmentData.state === 'IN_TRANSIT' ? 'EN TRÁNSITO' :
                           shipmentData.state === 'CREATED' ? 'CREADO' :
                           shipmentData.state === 'PICKED_UP' ? 'RECOGIDO' :
                           shipmentData.state === 'RETURNED' ? 'DEVUELTO' :
                           shipmentData.state === 'CANCELLED' ? 'CANCELADO' :
                           shipmentData.state}
                        </span>
                        <button 
                          onClick={() => {
                            const url = `${window.location.origin}/tracking?tracking_id=${shipmentData.tracking_id}`;
                            navigator.clipboard.writeText(url);
                            alert('¡Enlace de seguimiento copiado al portapapeles!');
                          }}
                          className="p-1.5 bg-white text-blue-600 rounded-full hover:bg-blue-50"
                          title="Copiar enlace de seguimiento"
                        >
                          <Share2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="px-4 sm:px-6 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Información básica del envío */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Remitente</h3>
                        <p className="text-gray-900 mb-4">
                          {shipmentData.sender_name || 'N/A'}
                          {shipmentData.origin_city && shipmentData.origin_state && (
                            <span className="block text-sm text-gray-500">
                              {shipmentData.origin_city}, {shipmentData.origin_state}
                            </span>
                          )}
                        </p>
                        
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Destinatario</h3>
                        <p className="text-gray-900">
                          {shipmentData.receiver_name || 'N/A'}
                          {shipmentData.destination_city && shipmentData.destination_state && (
                            <span className="block text-sm text-gray-500">
                              {shipmentData.destination_city}, {shipmentData.destination_state}
                            </span>
                          )}
                        </p>
                      </div>
                      
                      {/* Detalles del envío */}
                      <div className="border-t md:border-t-0 md:border-l border-gray-200 md:pl-6 pt-4 md:pt-0">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Detalles del Envío</h3>
                        
                        <div className="flex items-start mb-2">
                          <Truck className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                          <div>
                            <p className="text-gray-900 font-medium">
                              {shipmentData.courier?.name || 'Envío Estándar'}
                            </p>
                            <p className="text-sm text-gray-500">
                              Actualizado: {formatDate(shipmentData.state_date)}
                            </p>
                          </div>
                        </div>
                        
                        {shipmentData.packages && shipmentData.packages.length > 0 && (
                          <div className="flex items-start">
                            <Package className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                            <div>
                              <p className="text-gray-900 font-medium">
                                {shipmentData.packages.length} {shipmentData.packages.length === 1 ? 'Paquete' : 'Paquetes'}
                              </p>
                              <p className="text-sm text-gray-500">
                                Peso Total: {shipmentData.packages.reduce((sum: number, pkg: any) => sum + pkg.weight, 0).toFixed(2)} kg
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* QR code section */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-2">Compartir Seguimiento</h3>
                          <p className="text-gray-600 text-sm">
                            Escanea este código QR para compartir el seguimiento de este envío o acceder desde tu dispositivo móvil.
                          </p>
                          <Button 
                            onClick={() => {
                              const url = `${window.location.origin}/tracking?tracking_id=${shipmentData.tracking_id}`;
                              navigator.clipboard.writeText(url);
                              alert('¡Enlace de seguimiento copiado al portapapeles!');
                            }}
                            variant="outline"
                            size="sm"
                            className="mt-2"
                          >
                            <Share2 className="h-4 w-4 mr-2" />
                            Copiar Enlace
                          </Button>
                        </div>
                        <TrackingQRCode 
                          trackingId={shipmentData.tracking_id} 
                          size={120} 
                          className="self-center md:self-start"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Línea de tiempo de estado */}
                <ShipmentStatusTimeline 
                  currentState={shipmentData.state}
                  stateDate={shipmentData.state_date}
                  creationDate={shipmentData.creation_date}
                  shipmentLogs={shipmentData.shipmentLogs}
                />
                
                {/* Detalles adicionales */}
                {shipmentData.packages && shipmentData.packages.length > 0 && (
                  <Card className="shadow-md">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Package className="mr-2 h-5 w-5 text-blue-600" />
                        Detalles del Paquete
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {shipmentData.packages.map((pkg: any, index: number) => (
                          <div key={pkg.id} className="p-4 border rounded-lg bg-gray-50">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-sm text-gray-500">Paquete {index + 1}</span>
                                <h4 className="font-medium">
                                  {pkg.package_type === 'DOCUMENT' ? 'Documento' :
                                  pkg.package_type === 'PARCEL' ? 'Paquete' :
                                  pkg.package_type === 'FRAGILE' ? 'Frágil' : 
                                  pkg.package_type === 'ELECTRONICS' ? 'Electrónica' :
                                  pkg.package_type === 'PERISHABLE' ? 'Perecedero' :
                                  'Paquete Estándar'}
                                </h4>
                              </div>
                              <div className="text-right">
                                <span className="text-sm text-gray-500">Peso</span>
                                <p className="font-medium">{pkg.weight} kg</p>
                              </div>
                            </div>
                            
                            {(pkg.height || pkg.width || pkg.length) && (
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <span className="text-sm text-gray-500">Dimensiones</span>
                                <p className="font-medium">
                                  {pkg.height || '–'} × {pkg.width || '–'} × {pkg.length || '–'} cm
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : searchPerformed && !loading && (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="flex justify-center mb-4">
                  <AlertCircle className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontró ningún envío</h3>
                <p className="text-gray-600 mb-4">
                  No pudimos encontrar ningún envío con el número de seguimiento proporcionado.
                  Por favor, verifica el número e inténtalo de nuevo.
                </p>
                <Button 
                  onClick={() => setSearchPerformed(false)}
                  variant="outline"
                  className="mx-auto"
                >
                  Buscar de Nuevo
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingPage;