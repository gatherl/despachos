'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, Truck, Search, ArrowRight, LogIn, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Homepage() {
  const [trackingId, setTrackingId] = useState('');
  const router = useRouter();

  const handleTrackingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      router.push(`/tracking?tracking_id=${encodeURIComponent(trackingId)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                Envíos rápidos y confiables
              </h1>
              <p className="mt-4 text-lg md:text-xl text-blue-100">
                Sigue tus envíos en tiempo real y recibe actualizaciones en cada paso del camino.
              </p>
              
              {/* Quick Tracking Form */}
              <div className="mt-8">
                <form onSubmit={handleTrackingSubmit} className="sm:flex">
                  <div className="min-w-0 flex-1">
                    <label htmlFor="hero-tracking" className="sr-only">Número de seguimiento</label>
                    <input
                      id="hero-tracking"
                      type="text"
                      placeholder="Ingresa tu número de seguimiento"
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value)}
                      className="block w-full rounded-md border-0 px-4 py-3 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <button
                      type="submit"
                      className="block w-full rounded-md bg-blue-500 py-3 px-4 font-medium text-white shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
                    >
                      Rastrear Envío
                    </button>
                  </div>
                </form>
                <p className="mt-3 text-sm text-blue-200">
                  O visita nuestra <Link href="/tracking" className="font-medium underline">página de seguimiento</Link> para más opciones.
                </p>
              </div>
            </div>
            
            <div className="hidden md:block relative h-64 lg:h-96">
              <div className="absolute inset-0 bg-blue-700 rounded-xl overflow-hidden opacity-20"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 lg:w-56 lg:h-56">
                <svg className="w-full h-full text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Options Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">¿Qué necesitas hacer hoy?</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Nuestra plataforma te ofrece todo lo que necesitas para gestionar tus envíos.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Option 1: Track Shipment */}
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
            <div className="h-2 bg-blue-600"></div>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-xl">
                <Search className="mr-2 h-6 w-6 text-blue-600" />
                Rastrear un Envío
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Sigue tu paquete y obtén actualizaciones en tiempo real sobre su estado y ubicación.
              </p>
              <Link href="/tracking" className="block">
                <Button className="w-full group">
                  Rastrear Ahora
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          {/* Option 2: Create Shipment */}
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
            <div className="h-2 bg-green-600"></div>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-xl">
                <Plus className="mr-2 h-6 w-6 text-green-600" />
                Crear un Envío
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Crea una nueva solicitud de envío para que tus paquetes lleguen de forma rápida y segura.
              </p>
              <Link href="/shipments/new" className="block">
                <Button className="w-full group bg-green-600 hover:bg-green-700">
                  Crear Envío
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          {/* Option 3: Login */}
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
            <div className="h-2 bg-purple-600"></div>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-xl">
                <LogIn className="mr-2 h-6 w-6 text-purple-600" />
                Iniciar Sesión
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Accede a tu cuenta para gestionar tus envíos, ver tu historial y administrar tu perfil.
              </p>
              <Link href="/login" className="block">
                <Button className="w-full group bg-purple-600 hover:bg-purple-700">
                  Iniciar Sesión
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="bg-gray-100 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Nuestros Servicios</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Ofrecemos soluciones completas de envío con seguimiento en tiempo real y confirmación de entrega.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="w-12 h-12 rounded-md bg-blue-100 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Seguimiento en Tiempo Real</h3>
                <p className="mt-2 text-base text-gray-600">
                  Monitorea tus envíos con información de seguimiento actualizada al minuto para siempre saber dónde está tu entrega.
                </p>
              </div>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="w-12 h-12 rounded-md bg-green-100 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Entregas Seguras</h3>
                <p className="mt-2 text-base text-gray-600">
                  Descansa tranquilo sabiendo que tus envíos son manejados con cuidado y entregados de forma segura en su destino.
                </p>
              </div>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="w-12 h-12 rounded-md bg-yellow-100 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Tarifas Accesibles</h3>
                <p className="mt-2 text-base text-gray-600">
                  Precios competitivos en todos nuestros servicios de envío que garantizan el mejor valor para tus entregas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-blue-700 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-12 md:py-16 md:px-12 text-center text-white">
              <h2 className="text-3xl font-extrabold">¿Listo para enviar un paquete?</h2>
              <p className="mt-4 text-lg text-blue-100 max-w-xl mx-auto">
                Crea una cuenta hoy y comienza a enviar paquetes con facilidad. Haz seguimiento de todas tus entregas en un solo lugar.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/shipments/new"
                  className="inline-block bg-white py-2.5 px-5 rounded-md text-blue-700 font-medium hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-700"
                >
                  Crear Nuevo Envío
                </Link>
                <Link
                  href="/shipments"
                  className="inline-block bg-blue-600 py-2.5 px-5 border border-blue-400 rounded-md text-white font-medium hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-700"
                >
                  Ver Todos los Envíos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">Cómo Funciona</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Nuestro sencillo proceso de envío facilita que tus paquetes lleguen a donde necesitan ir.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Step 1 */}
          <div className="relative">
            <div className="absolute top-0 left-0 ml-6 mt-1 flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full">
              <span className="text-white font-bold">1</span>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 ml-4 border-l-4 border-blue-600">
              <h3 className="text-lg font-medium text-gray-900 mb-2 mt-2">Crear</h3>
              <p className="text-gray-600">
                Crea tu envío ingresando los datos del remitente, destinatario y detalles del paquete.
              </p>
            </div>
          </div>
          
          {/* Step 2 */}
          <div className="relative">
            <div className="absolute top-0 left-0 ml-6 mt-1 flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full">
              <span className="text-white font-bold">2</span>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 ml-4 border-l-4 border-blue-600">
              <h3 className="text-lg font-medium text-gray-900 mb-2 mt-2">Enviar</h3>
              <p className="text-gray-600">
                Imprime tu etiqueta de envío y deja tu paquete en cualquiera de nuestras ubicaciones.
              </p>
            </div>
          </div>
          
          {/* Step 3 */}
          <div className="relative">
            <div className="absolute top-0 left-0 ml-6 mt-1 flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full">
              <span className="text-white font-bold">3</span>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 ml-4 border-l-4 border-blue-600">
              <h3 className="text-lg font-medium text-gray-900 mb-2 mt-2">Rastrear</h3>
              <p className="text-gray-600">
                Sigue tu envío en tiempo real mientras se dirige a su destino.
              </p>
            </div>
          </div>
          
          {/* Step 4 */}
          <div className="relative">
            <div className="absolute top-0 left-0 ml-6 mt-1 flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full">
              <span className="text-white font-bold">4</span>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 ml-4 border-l-4 border-blue-600">
              <h3 className="text-lg font-medium text-gray-900 mb-2 mt-2">Entregar</h3>
              <p className="text-gray-600">
                Tu envío se entrega de forma segura y puntual al destinatario.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">Sobre Nosotros</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Carreras</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Noticias</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Contacto</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Servicios</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">Envíos Nacionales</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Envíos Internacionales</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Entrega Express</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Envíos a Gran Escala</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Recursos</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">Guía de Seguimiento</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Tarifas de Envío</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Preguntas Frecuentes</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Soporte</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Conéctate</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-2">Suscríbete a nuestro boletín</h4>
                <form className="flex">
                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    className="w-full px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Suscribir
                  </button>
                </form>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
            <p>&copy; 2025 Despachos Online. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}