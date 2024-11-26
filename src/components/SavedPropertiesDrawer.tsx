import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getSavedProperties, unsaveProperty } from '../services/userService';
import type { PropertyResponse } from '../services/housingApi';
import toast from 'react-hot-toast';

type SavedPropertiesDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function SavedPropertiesDrawer({ isOpen, onClose }: SavedPropertiesDrawerProps) {
  const { user } = useAuth();
  const [savedProperties, setSavedProperties] = useState<PropertyResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && user) {
      loadSavedProperties();
    }
  }, [isOpen, user]);

  const loadSavedProperties = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const properties = await getSavedProperties(user.uid);
      setSavedProperties(properties);
    } catch (error) {
      toast.error('Failed to load saved properties');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (propertyId: string) => {
    if (!user) return;
    try {
      await unsaveProperty(user.uid, propertyId);
      setSavedProperties(properties => properties.filter(p => p.id !== propertyId));
      toast.success('Property removed from saved list');
    } catch (error) {
      toast.error('Failed to remove property');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="absolute inset-y-0 right-0 w-full max-w-md bg-white shadow-xl">
        <div className="h-full flex flex-col">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Saved Properties</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 p-2"
              >
                <span className="text-xl">×</span>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin h-8 w-8 border-4 border-red-600 border-t-transparent rounded-full"></div>
              </div>
            ) : savedProperties.length === 0 ? (
              <div className="text-center text-gray-500">
                <p>No saved properties yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {savedProperties.map((property) => (
                  <div
                    key={property.id}
                    className="bg-white border rounded-lg overflow-hidden"
                  >
                    <img
                      src={property.imgSrc}
                      alt={property.address}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-gray-900">{property.price}</h3>
                          <p className="text-sm text-gray-600">{property.address}</p>
                        </div>
                        <button
                          onClick={() => handleUnsave(property.id)}
                          className="text-gray-400 hover:text-red-600 p-1"
                        >
                          <span className="text-xl">×</span>
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <span>🛏️</span> {property.beds} beds
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <span>🚿</span> {property.baths} baths
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <span>📏</span> {property.area}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}