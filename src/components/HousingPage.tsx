import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { PropertyCard } from './PropertyCard';
import { HousingFilters } from './HousingFilters';
import { HousingTips } from './HousingTips';
import { searchProperties, type PropertyResponse, type HousingSearchParams } from '../services/housingApi';
import { saveProperty, updateSearchHistory } from '../services/userService';
import { SavedPropertiesDrawer } from './SavedPropertiesDrawer';
import { PropertyAlerts } from './PropertyAlerts';
import { NeighborhoodGuide } from './NeighborhoodGuide';
import toast from 'react-hot-toast';

const propertyTypes = [
  { icon: '🏠', label: 'Houses', value: 'house' },
  { icon: '🏢', label: 'Apartments', value: 'apartment' },
  { icon: '🏘️', label: 'Condos', value: 'condo' }
];

export function HousingPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [properties, setProperties] = useState<PropertyResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showSavedProperties, setShowSavedProperties] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [filters, setFilters] = useState<HousingSearchParams>({
    location: '',
    minPrice: '',
    maxPrice: '',
    beds: '',
    baths: '',
    propertyType: ''
  });

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const propertiesData = await searchProperties({
        location: searchQuery || filters.location,
        propertyType: selectedType || filters.propertyType,
        ...filters
      });
      setProperties(propertiesData);

      // Save search to history if user is logged in
      if (user?.uid && searchQuery) {
        await updateSearchHistory(user.uid, searchQuery, 'property');
      }
    } catch (err) {
      setError('Failed to fetch properties. Please try again later.');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [selectedType]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProperties();
  };

  const handleSaveProperty = async (property: PropertyResponse) => {
    if (!user) {
      toast.error('Please sign in to save properties');
      return;
    }

    try {
      await saveProperty(user.uid, property);
      toast.success('Property saved successfully!');
    } catch (error) {
      toast.error('Failed to save property');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-red-600 to-red-700 py-12">
        <div className="container px-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">
                {t('housing.title')}
              </h1>
              <p className="text-red-100 text-lg">
                {t('housing.subtitle')}
              </p>
            </div>
            {user && (
              <button
                onClick={() => setShowSavedProperties(true)}
                className="flex items-center gap-2 bg-white text-red-600 px-4 py-2 rounded-lg hover:bg-red-50"
              >
                <span>🏠</span>
                Saved Properties
              </button>
            )}
          </div>

          {/* Property Type Selection */}
          <div className="flex gap-4 mb-6">
            {propertyTypes.map(type => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  selectedType === type.value
                    ? 'bg-white text-red-600'
                    : 'bg-red-500 text-white hover:bg-red-400'
                }`}
              >
                <span>{type.icon}</span>
                {type.label}
              </button>
            ))}
          </div>
          
          <form onSubmit={handleSearch} className="flex gap-4 max-w-4xl">
            <div className="flex-1 bg-white rounded-lg shadow-lg flex items-center p-2">
              <span className="text-gray-400 mx-2">📍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('housing.searchPlaceholder')}
                className="flex-1 border-none focus:ring-0 text-gray-800"
              />
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
              >
                <span>⚙️</span>
                <span>{t('housing.filters')}</span>
              </button>
            </div>
            <button 
              type="submit"
              className="bg-white text-red-600 px-8 py-3 rounded-lg font-medium hover:bg-red-50 transition-colors"
            >
              {t('housing.search')}
            </button>
          </form>
        </div>
      </div>

      <div className="container px-6 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3">
            <HousingFilters
              filters={filters}
              setFilters={setFilters}
              className={showFilters ? 'block' : 'hidden lg:block'}
            />
            {user && <PropertyAlerts className="mt-6" />}
          </div>

          <div className="lg:col-span-6">
            <div className="space-y-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin h-8 w-8 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600">{t('housing.loading')}</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-600">{error}</p>
                </div>
              ) : properties.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">{t('housing.noResults')}</p>
                </div>
              ) : (
                properties.map((property) => (
                  <PropertyCard 
                    key={property.id} 
                    property={property}
                    onSave={() => handleSaveProperty(property)}
                    showSaveButton={!!user}
                  />
                ))
              )}
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <NeighborhoodGuide />
            <HousingTips />
          </div>
        </div>
      </div>

      {/* Saved Properties Drawer */}
      <SavedPropertiesDrawer
        isOpen={showSavedProperties}
        onClose={() => setShowSavedProperties(false)}
      />
    </div>
  );
}