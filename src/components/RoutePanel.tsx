import React, { useState } from 'react';
import { Navigation, Clock, Car, Bus, Bike } from 'lucide-react';
import type { PropertyResponse } from '../services/housingApi';

type TransportMode = 'driving' | 'transit' | 'cycling' | 'walking';
type RouteInfo = {
  duration: number;
  distance: number;
  steps: string[];
};

type RoutePanelProps = {
  property: PropertyResponse;
  destination?: { lat: number; lng: number; name: string };
  onClose: () => void;
};

export function RoutePanel({ property, destination, onClose }: RoutePanelProps) {
  const [mode, setMode] = useState<TransportMode>('driving');
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);

  const transportModes = [
    { id: 'driving', icon: <Car className="h-5 w-5" />, label: 'Drive' },
    { id: 'transit', icon: <Bus className="h-5 w-5" />, label: 'Transit' },
    { id: 'cycling', icon: <Bike className="h-5 w-5" />, label: 'Bike' },
    { id: 'walking', icon: <Navigation className="h-5 w-5" />, label: 'Walk' }
  ];

  // Simulated route info - In production, this would come from a routing API
  const simulatedRoutes: Record<TransportMode, RouteInfo> = {
    driving: {
      duration: 25,
      distance: 8.5,
      steps: [
        'Head north on Main St',
        'Turn right onto Queen St',
        'Continue onto King St',
        'Arrive at destination'
      ]
    },
    transit: {
      duration: 45,
      distance: 9.2,
      steps: [
        'Walk to Main St Station',
        'Take Line 1 northbound',
        'Transfer at Queen Station',
        'Walk to destination'
      ]
    },
    cycling: {
      duration: 35,
      distance: 7.8,
      steps: [
        'Take the bike lane on Main St',
        'Turn right onto the Queen St bike path',
        'Continue on dedicated bike lane',
        'Arrive at destination'
      ]
    },
    walking: {
      duration: 95,
      distance: 7.5,
      steps: [
        'Walk north on Main St',
        'Turn right onto Queen St',
        'Continue on pedestrian path',
        'Arrive at destination'
      ]
    }
  };

  const handleModeChange = (newMode: TransportMode) => {
    setMode(newMode);
    setRouteInfo(simulatedRoutes[newMode]);
  };

  if (!destination) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-gray-900">Route to Destination</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {transportModes.map(({ id, icon, label }) => (
          <button
            key={id}
            onClick={() => handleModeChange(id as TransportMode)}
            className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              mode === id
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {icon}
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </div>

      {routeInfo && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>{routeInfo.duration} mins</span>
            </div>
            <div className="text-gray-500">
              {routeInfo.distance} km
            </div>
          </div>

          <div className="space-y-2">
            {routeInfo.steps.map((step, index) => (
              <div
                key={index}
                className="flex items-start gap-3 text-sm"
              >
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-red-600" />
                  {index < routeInfo.steps.length - 1 && (
                    <div className="w-0.5 h-full bg-gray-200" />
                  )}
                </div>
                <p className="flex-1 text-gray-700">{step}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}