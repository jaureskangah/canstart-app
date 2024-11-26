import React, { useEffect, useState, useMemo } from 'react';
import Map, { 
  Marker, 
  Popup, 
  NavigationControl,
  FullscreenControl,
  GeolocateControl
} from 'react-map-gl';
import { MapPin, School, Train, Hospital, Coffee, Layers } from 'lucide-react';
import type { PropertyResponse } from '../services/housingApi';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

type HousingMapProps = {
  properties: PropertyResponse[];
};

type POI = {
  type: 'school' | 'transit' | 'hospital' | 'restaurant';
  name: string;
  latitude: number;
  longitude: number;
  distance?: number;
};

type MapStyle = 'streets-v12' | 'satellite-v9' | 'light-v11' | 'dark-v11';
type MapLayer = 'heatmap' | 'draw' | 'poi';

export function HousingMap({ properties }: HousingMapProps) {
  const [selectedProperty, setSelectedProperty] = useState<PropertyResponse | null>(null);
  const [mapStyle, setMapStyle] = useState<MapStyle>('streets-v12');
  const [activeLayers, setActiveLayers] = useState<MapLayer[]>(['poi']);
  const [viewport, setViewport] = useState({
    latitude: 43.6532,
    longitude: -79.3832,
    zoom: 11
  });

  const pointsOfInterest: POI[] = useMemo(() => [
    { type: 'school', name: 'University of Toronto', latitude: 43.6629, longitude: -79.3957 },
    { type: 'transit', name: 'Union Station', latitude: 43.6453, longitude: -79.3806 },
    { type: 'hospital', name: 'Toronto General Hospital', latitude: 43.6579, longitude: -79.3873 },
    { type: 'restaurant', name: 'St. Lawrence Market', latitude: 43.6489, longitude: -79.3715 }
  ], []);

  const clusters = useMemo(() => {
    if (viewport.zoom < 11) {
      const grid: { [key: string]: PropertyResponse[] } = {};
      properties.forEach(property => {
        const key = `${Math.floor(property.latitude)}${Math.floor(property.longitude)}`;
        if (!grid[key]) grid[key] = [];
        grid[key].push(property);
      });
      return Object.values(grid);
    }
    return properties.map(p => [p]);
  }, [properties, viewport.zoom]);

  const toggleLayer = (layer: MapLayer) => {
    setActiveLayers(current => 
      current.includes(layer)
        ? current.filter(l => l !== layer)
        : [...current, layer]
    );
  };

  const POIIcon = ({ type }: { type: POI['type'] }) => {
    switch (type) {
      case 'school': return <School className="h-5 w-5 text-blue-600" />;
      case 'transit': return <Train className="h-5 w-5 text-green-600" />;
      case 'hospital': return <Hospital className="h-5 w-5 text-red-600" />;
      case 'restaurant': return <Coffee className="h-5 w-5 text-yellow-600" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-900">Map View</h3>
        <div className="flex gap-4">
          <select
            value={mapStyle}
            onChange={(e) => setMapStyle(e.target.value as MapStyle)}
            className="rounded-md border-gray-300 text-sm"
          >
            <option value="streets-v12">Street View</option>
            <option value="satellite-v9">Satellite View</option>
            <option value="light-v11">Light Mode</option>
            <option value="dark-v11">Dark Mode</option>
          </select>
          
          <div className="flex gap-2">
            {[
              { id: 'heatmap', label: 'Price Heatmap' },
              { id: 'draw', label: 'Draw Tools' },
              { id: 'poi', label: 'Points of Interest' }
            ].map(layer => (
              <button
                key={layer.id}
                onClick={() => toggleLayer(layer.id as MapLayer)}
                className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm ${
                  activeLayers.includes(layer.id as MapLayer)
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Layers className="h-4 w-4" />
                {layer.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="h-[600px] rounded-lg overflow-hidden">
        <Map
          {...viewport}
          onMove={evt => setViewport(evt.viewState)}
          mapStyle={`mapbox://styles/mapbox/${mapStyle}`}
          mapboxAccessToken={MAPBOX_TOKEN}
        >
          <GeolocateControl position="top-right" />
          <FullscreenControl position="top-right" />
          <NavigationControl position="top-right" />

          {clusters.map((cluster, idx) => (
            <Marker
              key={`cluster-${idx}`}
              latitude={cluster[0].latitude}
              longitude={cluster[0].longitude}
              anchor="bottom"
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedProperty(cluster[0]);
                }}
                className="relative"
              >
                <MapPin className="h-6 w-6 text-red-600 hover:text-red-700" />
                {cluster.length > 1 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cluster.length}
                  </span>
                )}
              </button>
            </Marker>
          ))}

          {activeLayers.includes('poi') && pointsOfInterest.map((poi) => (
            <Marker
              key={poi.name}
              latitude={poi.latitude}
              longitude={poi.longitude}
              anchor="bottom"
            >
              <div className="p-1 rounded-full bg-white shadow-md">
                <POIIcon type={poi.type} />
              </div>
            </Marker>
          ))}

          {selectedProperty && (
            <Popup
              latitude={selectedProperty.latitude}
              longitude={selectedProperty.longitude}
              anchor="bottom"
              onClose={() => setSelectedProperty(null)}
              closeButton={true}
              closeOnClick={false}
            >
              <div className="p-2">
                <img
                  src={selectedProperty.imgSrc}
                  alt={selectedProperty.address}
                  className="w-full h-24 object-cover rounded-lg mb-2"
                />
                <h4 className="font-medium text-gray-900">{selectedProperty.price}</h4>
                <p className="text-sm text-gray-600">{selectedProperty.address}</p>
              </div>
            </Popup>
          )}
        </Map>
      </div>
    </div>
  );
}