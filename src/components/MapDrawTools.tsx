import React from 'react';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { useControl } from 'react-map-gl';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

type MapDrawToolsProps = {
  onSelectionChange?: (e: { features: any[] }) => void;
};

export function MapDrawTools({ onSelectionChange }: MapDrawToolsProps) {
  useControl(
    () => {
      const draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: true
        },
        defaultMode: 'simple_select',
        styles: [
          {
            'id': 'gl-draw-polygon-fill',
            'type': 'fill',
            'filter': ['all', ['==', '$type', 'Polygon']],
            'paint': {
              'fill-color': '#ff0000',
              'fill-outline-color': '#ff0000',
              'fill-opacity': 0.1
            }
          },
          {
            'id': 'gl-draw-polygon-stroke',
            'type': 'line',
            'filter': ['all', ['==', '$type', 'Polygon']],
            'paint': {
              'line-color': '#ff0000',
              'line-width': 2
            }
          }
        ]
      });

      if (onSelectionChange) {
        draw.on('selectionchange', onSelectionChange);
      }

      return draw;
    },
    {
      position: 'top-left'
    }
  );

  return null;
}