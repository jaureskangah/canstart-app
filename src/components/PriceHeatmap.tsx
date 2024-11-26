import React from 'react';
import { Source, Layer } from 'react-map-gl';
import type { PropertyResponse } from '../services/housingApi';

type PriceHeatmapProps = {
  properties: PropertyResponse[];
  visible: boolean;
};

export function PriceHeatmap({ properties, visible }: PriceHeatmapProps) {
  const heatmapData = {
    type: 'FeatureCollection',
    features: properties.map(property => ({
      type: 'Feature',
      properties: {
        price: parseFloat(property.price.replace(/[^0-9.]/g, '')),
      },
      geometry: {
        type: 'Point',
        coordinates: [property.longitude, property.latitude],
      },
    })),
  };

  if (!visible) return null;

  return (
    <Source type="geojson" data={heatmapData}>
      <Layer
        id="property-heat"
        type="heatmap"
        paint={{
          'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['get', 'price'],
            200000, 0,
            2000000, 1
          ],
          'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 1,
            15, 3
          ],
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(33,102,172,0)',
            0.2, 'rgb(103,169,207)',
            0.4, 'rgb(209,229,240)',
            0.6, 'rgb(253,219,199)',
            0.8, 'rgb(239,138,98)',
            1, 'rgb(178,24,43)'
          ],
          'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 2,
            15, 20
          ],
          'heatmap-opacity': 0.7
        }}
      />
    </Source>
  );
}