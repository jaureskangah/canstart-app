import React from 'react';
import type { PropertyResponse } from '../services/housingApi';

type PropertyCardProps = {
  property: PropertyResponse;
  onSave?: () => void;
  showSaveButton?: boolean;
};

export function PropertyCard({ property, onSave, showSaveButton }: PropertyCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="aspect-w-16 aspect-h-9 relative">
        <img
          src={property.imgSrc}
          alt={property.address}
          className="object-cover w-full h-48"
        />
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 bg-red-600 text-white text-sm rounded-full">
            {property.listingStatus}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {property.price}
          </h3>
          <p className="text-gray-600">{property.address}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-gray-600">
            <span>🛏️</span>
            <span>{property.beds} Beds</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <span>🚿</span>
            <span>{property.baths} Baths</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <span>📏</span>
            <span>{property.area}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <span>🏠</span>
            <span>{property.propertyType}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          {showSaveButton && (
            <button
              onClick={onSave}
              className="text-gray-600 hover:text-red-600 transition-colors"
            >
              <span className="text-xl">❤️</span>
            </button>
          )}
          <button className="text-red-600 hover:text-red-700 font-medium">
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
}