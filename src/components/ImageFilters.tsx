import React, { useState, useRef, useEffect } from 'react';
import { Sliders, Image as ImageIcon, RotateCw, Maximize2 } from 'lucide-react';

type Filter = {
  name: string;
  class: string;
  style?: React.CSSProperties;
};

type Adjustment = {
  name: string;
  min: number;
  max: number;
  step: number;
  value: number;
  unit: string;
};

type ImageFiltersProps = {
  image: File | string;
  onProcessed?: (processedImage: string) => void;
  className?: string;
};

const filters: Filter[] = [
  { name: 'Original', class: '' },
  { name: 'Enhance', class: 'brightness-110 contrast-110 saturate-110' },
  { name: 'Vivid', class: 'brightness-105 contrast-120 saturate-150' },
  { name: 'Sharp', class: 'brightness-100 contrast-150 saturate-100' },
  { name: 'Warm', class: 'brightness-105 sepia-[.3]' },
  { name: 'Cool', class: 'brightness-100 hue-rotate-[330deg]' },
  { name: 'Dramatic', class: 'brightness-110 contrast-150 grayscale-[.3]' },
  { name: 'Professional', class: 'brightness-105 contrast-110 saturate-95' }
];

const adjustments: Adjustment[] = [
  { name: 'Brightness', min: 0, max: 200, step: 5, value: 100, unit: '%' },
  { name: 'Contrast', min: 0, max: 200, step: 5, value: 100, unit: '%' },
  { name: 'Saturation', min: 0, max: 200, step: 5, value: 100, unit: '%' },
  { name: 'Temperature', min: -100, max: 100, step: 5, value: 0, unit: '' },
  { name: 'Sharpness', min: 0, max: 100, step: 5, value: 0, unit: '%' }
];

export function ImageFilters({
  image,
  onProcessed,
  className = ''
}: ImageFiltersProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>('Original');
  const [currentAdjustments, setCurrentAdjustments] = useState<Adjustment[]>(adjustments);
  const [preview, setPreview] = useState<string>('');
  const [rotation, setRotation] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof image === 'string') {
      setPreview(image);
    } else {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(image);
    }
  }, [image]);

  useEffect(() => {
    applyFilters();
  }, [preview, selectedFilter, currentAdjustments, rotation]);

  const applyFilters = () => {
    const canvas = canvasRef.current;
    if (!canvas || !preview) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = preview;
    img.onload = () => {
      // Set canvas size
      canvas.width = img.width;
      canvas.height = img.height;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Apply rotation
      if (rotation !== 0) {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
      }

      // Draw image
      ctx.drawImage(img, 0, 0);

      if (rotation !== 0) {
        ctx.restore();
      }

      // Apply filters
      const filter = filters.find(f => f.name === selectedFilter);
      if (filter?.style) {
        Object.assign(ctx, filter.style);
      }

      // Apply adjustments
      currentAdjustments.forEach(adj => {
        switch (adj.name) {
          case 'Brightness':
            ctx.filter = `brightness(${adj.value}%)`;
            break;
          case 'Contrast':
            ctx.filter = `contrast(${adj.value}%)`;
            break;
          case 'Saturation':
            ctx.filter = `saturate(${adj.value}%)`;
            break;
          case 'Temperature':
            ctx.filter = `hue-rotate(${adj.value}deg)`;
            break;
          case 'Sharpness':
            // Simulate sharpness using multiple draws
            if (adj.value > 0) {
              const tempCanvas = document.createElement('canvas');
              const tempCtx = tempCanvas.getContext('2d');
              if (tempCtx) {
                tempCanvas.width = canvas.width;
                tempCanvas.height = canvas.height;
                tempCtx.drawImage(canvas, 0, 0);
                ctx.globalAlpha = adj.value / 100;
                ctx.drawImage(tempCanvas, -1, -1);
                ctx.drawImage(tempCanvas, 1, 1);
                ctx.globalAlpha = 1;
              }
            }
            break;
        }
      });

      // Notify parent component
      const processedImage = canvas.toDataURL('image/jpeg');
      onProcessed?.(processedImage);
    };
  };

  const handleAdjustmentChange = (name: string, value: number) => {
    setCurrentAdjustments(prev =>
      prev.map(adj =>
        adj.name === name ? { ...adj, value } : adj
      )
    );
  };

  const resetAdjustments = () => {
    setCurrentAdjustments(adjustments);
    setSelectedFilter('Original');
    setRotation(0);
  };

  const rotateImage = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      {/* Preview */}
      <div className="relative rounded-lg overflow-hidden mb-6">
        <canvas
          ref={canvasRef}
          className="max-w-full h-auto"
        />
      </div>

      {/* Filter Presets */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Filters</h3>
        <div className="grid grid-cols-4 gap-2">
          {filters.map((filter) => (
            <button
              key={filter.name}
              onClick={() => setSelectedFilter(filter.name)}
              className={`p-2 text-sm rounded-lg transition-colors ${
                selectedFilter === filter.name
                  ? 'bg-red-50 text-red-600'
                  : 'hover:bg-gray-50'
              }`}
            >
              {filter.name}
            </button>
          ))}
        </div>
      </div>

      {/* Adjustments */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700">Adjustments</h3>
          <div className="flex gap-2">
            <button
              onClick={rotateImage}
              className="p-2 text-gray-600 hover:text-red-600 rounded-lg"
              title="Rotate"
            >
              <RotateCw className="h-5 w-5" />
            </button>
            <button
              onClick={resetAdjustments}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Reset All
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {currentAdjustments.map((adj) => (
            <div key={adj.name}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">{adj.name}</span>
                <span className="text-gray-900">{adj.value}{adj.unit}</span>
              </div>
              <input
                type="range"
                min={adj.min}
                max={adj.max}
                step={adj.step}
                value={adj.value}
                onChange={(e) => handleAdjustmentChange(adj.name, Number(e.target.value))}
                className="w-full"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}