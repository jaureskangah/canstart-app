import React, { useState, useRef, useEffect } from 'react';
import { Settings, Download } from 'lucide-react';

type WatermarkOptions = {
  text: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  opacity: number;
  size: number;
  color: string;
};

type ImageWatermarkProps = {
  image: File | string;
  options?: Partial<WatermarkOptions>;
  onProcessed?: (watermarkedImage: string) => void;
  className?: string;
};

const defaultOptions: WatermarkOptions = {
  text: 'CanStart.ca',
  position: 'bottom-right',
  opacity: 0.5,
  size: 24,
  color: '#ffffff'
};

export function ImageWatermark({
  image,
  options = {},
  onProcessed,
  className = ''
}: ImageWatermarkProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [watermarkOptions, setWatermarkOptions] = useState<WatermarkOptions>({
    ...defaultOptions,
    ...options
  });
  const [preview, setPreview] = useState<string>('');
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
    if (preview) {
      applyWatermark();
    }
  }, [preview, watermarkOptions]);

  const applyWatermark = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = preview;
    img.onload = () => {
      // Set canvas size to match image
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Configure watermark text
      ctx.font = `${watermarkOptions.size}px Arial`;
      ctx.fillStyle = watermarkOptions.color;
      ctx.globalAlpha = watermarkOptions.opacity;

      // Calculate text metrics
      const metrics = ctx.measureText(watermarkOptions.text);
      const padding = 20;

      // Calculate position
      let x = 0;
      let y = 0;

      switch (watermarkOptions.position) {
        case 'top-left':
          x = padding;
          y = watermarkOptions.size + padding;
          break;
        case 'top-right':
          x = canvas.width - metrics.width - padding;
          y = watermarkOptions.size + padding;
          break;
        case 'bottom-left':
          x = padding;
          y = canvas.height - padding;
          break;
        case 'bottom-right':
          x = canvas.width - metrics.width - padding;
          y = canvas.height - padding;
          break;
        case 'center':
          x = (canvas.width - metrics.width) / 2;
          y = canvas.height / 2;
          break;
      }

      // Draw watermark text
      ctx.fillText(watermarkOptions.text, x, y);

      // Reset global alpha
      ctx.globalAlpha = 1;

      // Notify parent component
      const watermarkedImage = canvas.toDataURL('image/jpeg');
      onProcessed?.(watermarkedImage);
    };
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'watermarked-image.jpg';
    link.href = canvas.toDataURL('image/jpeg');
    link.click();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Preview */}
      <div className="relative rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          className="max-w-full h-auto"
        />
        
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition-opacity"
          >
            <Settings className="h-5 w-5" />
          </button>
          <button
            onClick={downloadImage}
            className="p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition-opacity"
          >
            <Download className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-12 right-2 w-64 bg-white rounded-lg shadow-lg p-4 z-10">
          <h3 className="font-medium text-gray-900 mb-4">Watermark Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Text</label>
              <input
                type="text"
                value={watermarkOptions.text}
                onChange={(e) => setWatermarkOptions({
                  ...watermarkOptions,
                  text: e.target.value
                })}
                className="w-full rounded-md border-gray-300 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Position</label>
              <select
                value={watermarkOptions.position}
                onChange={(e) => setWatermarkOptions({
                  ...watermarkOptions,
                  position: e.target.value as WatermarkOptions['position']
                })}
                className="w-full rounded-md border-gray-300 text-sm"
              >
                <option value="top-left">Top Left</option>
                <option value="top-right">Top Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="bottom-right">Bottom Right</option>
                <option value="center">Center</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Opacity</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={watermarkOptions.opacity}
                onChange={(e) => setWatermarkOptions({
                  ...watermarkOptions,
                  opacity: parseFloat(e.target.value)
                })}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Size</label>
              <input
                type="range"
                min="12"
                max="48"
                value={watermarkOptions.size}
                onChange={(e) => setWatermarkOptions({
                  ...watermarkOptions,
                  size: parseInt(e.target.value)
                })}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Color</label>
              <input
                type="color"
                value={watermarkOptions.color}
                onChange={(e) => setWatermarkOptions({
                  ...watermarkOptions,
                  color: e.target.value
                })}
                className="w-full h-8 rounded-md"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}