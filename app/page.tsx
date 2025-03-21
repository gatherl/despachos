'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

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
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                Fast, Reliable Package Delivery
              </h1>
              <p className="mt-4 text-lg md:text-xl text-blue-100">
                Track your packages in real-time and get updates every step of the way.
              </p>
              
              {/* Quick Tracking Form */}
              <div className="mt-8">
                <form onSubmit={handleTrackingSubmit} className="sm:flex">
                  <div className="min-w-0 flex-1">
                    <label htmlFor="hero-tracking" className="sr-only">Tracking number</label>
                    <input
                      id="hero-tracking"
                      type="text"
                      placeholder="Enter your tracking number"
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
                      Track Package
                    </button>
                  </div>
                </form>
                <p className="mt-3 text-sm text-blue-200">
                  Or visit our <Link href="/tracking" className="font-medium underline">tracking page</Link> for more options.
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
      
      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">Our Shipping Services</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            We offer comprehensive shipping solutions with real-time tracking and delivery confirmation.
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
              <h3 className="text-lg font-medium text-gray-900">Real-Time Tracking</h3>
              <p className="mt-2 text-base text-gray-600">
                Monitor your packages with up-to-the-minute tracking information to always know where your shipment is.
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
              <h3 className="text-lg font-medium text-gray-900">Secure Deliveries</h3>
              <p className="mt-2 text-base text-gray-600">
                Rest easy knowing your packages are handled with care and delivered securely to their destination.
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
              <h3 className="text-lg font-medium text-gray-900">Affordable Rates</h3>
              <p className="mt-2 text-base text-gray-600">
                Competitive pricing on all our shipping services ensures you get the best value for your deliveries.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-blue-700 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-12 md:py-16 md:px-12 text-center text-white">
              <h2 className="text-3xl font-extrabold">Ready to ship a package?</h2>
              <p className="mt-4 text-lg text-blue-100 max-w-xl mx-auto">
                Create an account today and start shipping packages with ease. Track all your deliveries in one place.
              </p>
              <div className="mt-8 flex justify-center space-x-4">
                <Link
                  href="/packages/new"
                  className="inline-block bg-white py-2.5 px-5 rounded-md text-blue-700 font-medium hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-700"
                >
                  Create New Package
                </Link>
                <Link
                  href="/packages"
                  className="inline-block bg-blue-600 py-2.5 px-5 border border-blue-400 rounded-md text-white font-medium hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-700"
                >
                  View All Packages
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">How It Works</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Our simple shipping process makes it easy to get your packages where they need to go.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Step 1 */}
          <div className="relative">
            <div className="absolute top-0 left-0 ml-6 mt-1 flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full">
              <span className="text-white font-bold">1</span>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 ml-4 border-l-4 border-blue-600">
              <h3 className="text-lg font-medium text-gray-900 mb-2 mt-2">Create</h3>
              <p className="text-gray-600">
                Create your package by entering the sender, receiver, and package details.
              </p>
            </div>
          </div>
          
          {/* Step 2 */}
          <div className="relative">
            <div className="absolute top-0 left-0 ml-6 mt-1 flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full">
              <span className="text-white font-bold">2</span>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 ml-4 border-l-4 border-blue-600">
              <h3 className="text-lg font-medium text-gray-900 mb-2 mt-2">Ship</h3>
              <p className="text-gray-600">
                Print your shipping label and drop off your package at any of our locations.
              </p>
            </div>
          </div>
          
          {/* Step 3 */}
          <div className="relative">
            <div className="absolute top-0 left-0 ml-6 mt-1 flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full">
              <span className="text-white font-bold">3</span>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 ml-4 border-l-4 border-blue-600">
              <h3 className="text-lg font-medium text-gray-900 mb-2 mt-2">Track</h3>
              <p className="text-gray-600">
                Track your package in real-time as it makes its way to the destination.
              </p>
            </div>
          </div>
          
          {/* Step 4 */}
          <div className="relative">
            <div className="absolute top-0 left-0 ml-6 mt-1 flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full">
              <span className="text-white font-bold">4</span>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 ml-4 border-l-4 border-blue-600">
              <h3 className="text-lg font-medium text-gray-900 mb-2 mt-2">Deliver</h3>
              <p className="text-gray-600">
                Your package is delivered safely and on time to the recipient.
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
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">News</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">Domestic Shipping</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">International Shipping</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Express Delivery</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Bulk Shipping</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">Tracking Guide</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Shipping Rates</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">FAQ</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
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
                <h4 className="text-sm font-semibold mb-2">Subscribe to our newsletter</h4>
                <form className="flex">
                  <input
                    type="email"
                    placeholder="Email address"
                    className="w-full px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
            <p>&copy; 2025 Shipping Company. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}