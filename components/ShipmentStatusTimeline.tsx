'use client';

import React, { useEffect, useState } from 'react';
import { Package, Truck, CheckCircle, X, AlertCircle, ArrowRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ShipmentStatusTimelineProps {
  currentState: string;
  stateDate: string;
  creationDate: string;
  shipmentLogs?: Array<{
    date: string;
    new_shipment: {
      state: string;
    };
  }>;
}

export default function ShipmentStatusTimeline({
  currentState,
  stateDate,
  creationDate,
  shipmentLogs = []
}: ShipmentStatusTimelineProps) {
  const isMobile = useIsMobile();
  const [animateIn, setAnimateIn] = useState(false);
  
  // Add entrance animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateIn(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  // Define all possible shipment states in order
  const allStates = [
    { key: 'CREATED', label: 'Creado', icon: Package, color: 'purple' },
    { key: 'PICKED_UP', label: 'Recolectado', icon: Package, color: 'indigo' },
    { key: 'IN_TRANSIT', label: 'En Tránsito', icon: Truck, color: 'blue' },
    { key: 'DELIVERED', label: 'Entregado', icon: CheckCircle, color: 'green' },
    { key: 'RETURNED', label: 'Devuelto', icon: ArrowRight, color: 'red' },
    { key: 'CANCELLED', label: 'Cancelado', icon: X, color: 'gray' }
  ];

  // Find the index of the current state in the allStates array
  const currentStateIndex = allStates.findIndex(state => state.key === currentState);
  
  // Get logs sorted by date
  const sortedLogs = [...shipmentLogs].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Find the timestamp for each state from logs
  const stateTimestamps: Record<string, string> = {};
  
  // Add creation date for CREATED state
  stateTimestamps['CREATED'] = creationDate;
  
  // Add timestamps from logs
  sortedLogs.forEach(log => {
    if (log.new_shipment && log.new_shipment.state) {
      stateTimestamps[log.new_shipment.state] = log.date;
    }
  });
  
  // If no timestamp for current state, use stateDate
  if (!stateTimestamps[currentState]) {
    stateTimestamps[currentState] = stateDate;
  }

  // Format date to locale string
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Function to determine if a state should be marked as completed
  const isStateCompleted = (stateKey: string) => {
    const stateIndex = allStates.findIndex(state => state.key === stateKey);
    
    // Special cases for terminal states
    if (currentState === 'RETURNED' || currentState === 'CANCELLED') {
      // Only states before the current state (excluding DELIVERED) are completed
      return stateIndex < currentStateIndex && stateKey !== 'DELIVERED';
    }
    
    // Normal flow: all states up to current state are completed
    return stateIndex <= currentStateIndex;
  };

  // Filter out terminal states if not in that state
  const displayStates = allStates.filter(state => {
    // Always show CREATED, PICKED_UP, IN_TRANSIT, DELIVERED
    if (['CREATED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED'].includes(state.key)) {
      return true;
    }
    
    // Show RETURNED only if current state is RETURNED
    if (state.key === 'RETURNED') {
      return currentState === 'RETURNED';
    }
    
    // Show CANCELLED only if current state is CANCELLED
    if (state.key === 'CANCELLED') {
      return currentState === 'CANCELLED';
    }
    
    return false;
  });

  return (
    <div className="w-full bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center mb-4">
        <div className="p-2 bg-blue-100 rounded-md mr-3">
          <Truck className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Seguimiento del Envío</h3>
      </div>
      
      {/* Mobile Layout */}
      {isMobile ? (
        <div className="mt-6">
          <div className="relative pl-8 ml-4">
            {/* Vertical line connecting all steps */}
            <div 
              className="absolute top-0 bottom-0 left-0 w-0.5 bg-gray-200" 
              style={{ height: '100%', zIndex: 0 }}
            />
            
            {/* Timeline items */}
            <div className="space-y-8">
              {displayStates.map((state, index) => {
                const isCompleted = isStateCompleted(state.key);
                const isCurrent = state.key === currentState;
                
                // Determine icon color
                const IconComponent = state.icon;
                let iconColorClass = 'text-gray-400';
                let bgColorClass = 'bg-gray-100';
                let borderColorClass = 'border-gray-200';
                let textColorClass = 'text-gray-500';
                
                if (isCompleted) {
                  switch(state.color) {
                    case 'green':
                      iconColorClass = 'text-green-600';
                      bgColorClass = 'bg-green-100';
                      borderColorClass = 'border-green-200';
                      textColorClass = 'text-green-700';
                      break;
                    case 'blue':
                      iconColorClass = 'text-blue-600';
                      bgColorClass = 'bg-blue-100';
                      borderColorClass = 'border-blue-200';
                      textColorClass = 'text-blue-700';
                      break;
                    case 'red':
                      iconColorClass = 'text-red-600';
                      bgColorClass = 'bg-red-100';
                      borderColorClass = 'border-red-200';
                      textColorClass = 'text-red-700';
                      break;
                    case 'purple':
                      iconColorClass = 'text-purple-600';
                      bgColorClass = 'bg-purple-100';
                      borderColorClass = 'border-purple-200';
                      textColorClass = 'text-purple-700';
                      break;
                    case 'indigo':
                      iconColorClass = 'text-indigo-600';
                      bgColorClass = 'bg-indigo-100';
                      borderColorClass = 'border-indigo-200';
                      textColorClass = 'text-indigo-700';
                      break;
                    default:
                      iconColorClass = 'text-gray-600';
                      bgColorClass = 'bg-gray-100';
                      borderColorClass = 'border-gray-200';
                      textColorClass = 'text-gray-700';
                  }
                }
                
                // For vertical line color between elements
                const lineColorClass = isCompleted && index < displayStates.length - 1 && 
                  isStateCompleted(displayStates[index + 1].key) ? 
                  `bg-${state.color}-500` : 'bg-gray-200';
                
                return (
                  <div 
                    key={state.key} 
                    className={`relative flex items-start ${animateIn ? 'opacity-100' : 'opacity-0'}`}
                    style={{ 
                      transition: `opacity 0.5s ease-in-out ${index * 0.15}s, transform 0.5s ease-in-out ${index * 0.15}s`,
                      transform: animateIn ? 'translateY(0)' : 'translateY(20px)'
                    }}
                  >
                    {/* Icon */}
                    <div 
                      className={`${bgColorClass} w-8 h-8 rounded-full flex items-center justify-center border-2 ${borderColorClass} z-10
                        absolute -left-12 
                        ${isCurrent ? 'animate-pulse shadow-lg transform scale-110' : ''}
                        transition-all duration-500 ease-in-out`}
                    >
                      <IconComponent className={`w-4 h-4 ${iconColorClass}`} />
                    </div>
                    
                    {/* Connect line to next element */}
                    {index < displayStates.length - 1 && (
                      <div 
                        className={`absolute -left-8 top-8 w-0.5 ${lineColorClass} transition-all duration-1000 ease-in-out`} 
                        style={{ 
                          height: '40px',
                          opacity: animateIn ? 1 : 0,
                          transition: `opacity 0.8s ease-in-out ${(index * 0.15) + 0.3}s`
                        }}
                      />
                    )}
                    
                    {/* Content */}
                    <div className="ml-2">
                      <h4 className={`text-sm font-semibold ${textColorClass} mb-1`}>{state.label}</h4>
                      {stateTimestamps[state.key] && isCompleted && (
                        <p className="text-xs text-gray-500">{formatDate(stateTimestamps[state.key])}</p>
                      )}
                      
                      {isCurrent && (
                        <div className="mt-2 text-xs bg-gray-50 p-2 rounded border border-gray-100 max-w-xs">
                          <p className="text-gray-700">
                            {state.key === 'CREATED' ? 'Paquete creado y registrado' :
                              state.key === 'PICKED_UP' ? 'Paquete recolectado del remitente' :
                                state.key === 'IN_TRANSIT' ? 'Paquete en tránsito hacia destino' :
                                  state.key === 'DELIVERED' ? 'Paquete entregado con éxito' :
                                    state.key === 'RETURNED' ? 'Paquete devuelto al remitente' :
                                      state.key === 'CANCELLED' ? 'Envío cancelado' : 'Estado desconocido'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        // Desktop Layout
        <div className={`mt-8 relative ${animateIn ? 'opacity-100' : 'opacity-0'}`} style={{ transition: 'opacity 0.5s ease-in-out' }}>
          {/* Horizontal line connecting all steps */}
          <div 
            className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200" 
            style={{ width: '100%', zIndex: 0 }}
          />
          
          {/* Steps */}
          <div className="relative flex justify-between items-start">
            {displayStates.map((state, index) => {
              const isCompleted = isStateCompleted(state.key);
              const isCurrent = state.key === currentState;
              
              // Determine icon color
              const IconComponent = state.icon;
              let iconColorClass = 'text-gray-400';
              let bgColorClass = 'bg-gray-100';
              let borderColorClass = 'border-gray-200';
              let textColorClass = 'text-gray-500';
              
              if (isCompleted) {
                switch(state.color) {
                  case 'green':
                    iconColorClass = 'text-green-600';
                    bgColorClass = 'bg-green-100';
                    borderColorClass = 'border-green-200';
                    textColorClass = 'text-green-700';
                    break;
                  case 'blue':
                    iconColorClass = 'text-blue-600';
                    bgColorClass = 'bg-blue-100';
                    borderColorClass = 'border-blue-200';
                    textColorClass = 'text-blue-700';
                    break;
                  case 'red':
                    iconColorClass = 'text-red-600';
                    bgColorClass = 'bg-red-100';
                    borderColorClass = 'border-red-200';
                    textColorClass = 'text-red-700';
                    break;
                  case 'purple':
                    iconColorClass = 'text-purple-600';
                    bgColorClass = 'bg-purple-100';
                    borderColorClass = 'border-purple-200';
                    textColorClass = 'text-purple-700';
                    break;
                  case 'indigo':
                    iconColorClass = 'text-indigo-600';
                    bgColorClass = 'bg-indigo-100';
                    borderColorClass = 'border-indigo-200';
                    textColorClass = 'text-indigo-700';
                    break;
                  default:
                    iconColorClass = 'text-gray-600';
                    bgColorClass = 'bg-gray-100';
                    borderColorClass = 'border-gray-200';
                    textColorClass = 'text-gray-700';
                }
              }
              
              // Animation delay based on index
              const transitionDelay = `${index * 0.15}s`;
              
              return (
                <div 
                  key={state.key} 
                  className={`flex flex-col items-center relative ${index === 0 ? 'ml-0' : ''} ${index === displayStates.length - 1 ? 'mr-0' : ''}`}
                  style={{ 
                    minWidth: '80px', 
                    maxWidth: '120px',
                    opacity: animateIn ? 1 : 0,
                    transform: animateIn ? 'translateY(0)' : 'translateY(20px)',
                    transition: `opacity 0.5s ease-in-out ${transitionDelay}, transform 0.5s ease-in-out ${transitionDelay}`
                  }}
                >
                  {/* Icon */}
                  <div 
                    className={`${bgColorClass} w-8 h-8 rounded-full flex items-center justify-center border-2 ${borderColorClass} z-10
                      ${isCurrent ? 'animate-pulse shadow-lg transform scale-110' : ''}
                      transition-all duration-500 ease-in-out`}
                  >
                    <IconComponent className={`w-4 h-4 ${iconColorClass}`} />
                  </div>
                  
                  {/* Label */}
                  <div className="mt-2 text-center">
                    <p className={`text-xs font-medium ${textColorClass}`}>{state.label}</p>
                    {stateTimestamps[state.key] && isCompleted && (
                      <p className="text-xs text-gray-400 mt-1">{formatDate(stateTimestamps[state.key])}</p>
                    )}
                  </div>
                  
                  {/* Connector Line - progress line that fills based on status */}
                  {index < displayStates.length - 1 && (
                    <div className="absolute top-4 w-full h-0.5 flex items-center" style={{ left: '50%', zIndex: 0 }}>
                      <div 
                        className={`h-0.5 ${
                          (isCompleted && isStateCompleted(displayStates[index + 1].key)) 
                            ? `bg-${state.color}-500` 
                            : 'bg-gray-200'
                        } transition-all duration-1000 ease-in-out`}
                        style={{ 
                          width: animateIn ? '100%' : '0%',
                          position: 'absolute',
                          left: '0%',
                          transition: `width 1s ease-in-out ${transitionDelay}`
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Additional info for current state */}
      <div className="mt-8 pt-4 border-t border-gray-100">
        <div className="flex items-start">
          <div className={`p-2 rounded-full 
            ${currentState === 'DELIVERED' ? 'bg-green-100' : 
              currentState === 'RETURNED' ? 'bg-red-100' : 
                currentState === 'CANCELLED' ? 'bg-gray-100' : 'bg-blue-100'}`}
          >
            {currentState === 'DELIVERED' ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : currentState === 'RETURNED' ? (
              <ArrowRight className="h-5 w-5 text-red-600" />
            ) : currentState === 'CANCELLED' ? (
              <X className="h-5 w-5 text-gray-600" />
            ) : (
              <Truck className="h-5 w-5 text-blue-600" />
            )}
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-gray-900">
              {currentState === 'CREATED' ? 'Paquete creado y registrado' :
                currentState === 'PICKED_UP' ? 'Paquete recolectado del remitente' :
                  currentState === 'IN_TRANSIT' ? 'Paquete en tránsito hacia destino' :
                    currentState === 'DELIVERED' ? 'Paquete entregado con éxito' :
                      currentState === 'RETURNED' ? 'Paquete devuelto al remitente' :
                        currentState === 'CANCELLED' ? 'Envío cancelado' : 'Estado desconocido'}
            </h4>
            <p className="mt-1 text-sm text-gray-500">
              {formatDate(stateTimestamps[currentState] || stateDate)}
            </p>
          </div>
        </div>
        
        {/* Estimated delivery if not yet delivered */}
        {currentState !== 'DELIVERED' && currentState !== 'RETURNED' && currentState !== 'CANCELLED' && (
          <div className="mt-4 flex items-start">
            <div className="p-2 rounded-full bg-gray-100">
              <AlertCircle className="h-5 w-5 text-gray-500" />
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-gray-900">
                Entrega estimada
              </h4>
              <p className="mt-1 text-sm text-gray-500">
                {(() => {
                  const creationDateObj = new Date(creationDate);
                  const estimatedDate = new Date(creationDateObj);
                  estimatedDate.setDate(estimatedDate.getDate() + 7);
                  
                  return estimatedDate.toLocaleDateString('es-AR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long'
                  });
                })()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}