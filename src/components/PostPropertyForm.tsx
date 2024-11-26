import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Home, DollarSign, MapPin, Ruler, BedDouble, Bath, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

type PropertyPosting = {
  title: string;
  type: string;
  price: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  beds: number;
  baths: number;
  area: string;
  description: string;
  features: string[];
  images: File[];
  listingType: 'sale' | 'rent';
  availability: string;
};

export function PostPropertyForm() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [propertyData, setPropertyData] = useState<PropertyPosting>({
    title: '',
    type: '',
    price: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    beds: 1,
    baths: 1,
    area: '',
    description: '',
    features: [''],
    images: [],
    listingType: 'sale',
    availability: ''
  });

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...propertyData.features];
    newFeatures[index] = value;
    setPropertyData({ ...propertyData, features: newFeatures });
  };

  const addFeature = () => {
    setPropertyData({
      ...propertyData,
      features: [...propertyData.features, '']
    });
  };

  const removeFeature = (index: number) => {
    const newFeatures = propertyData.features.filter((_, i) => i !== index);
    setPropertyData({ ...propertyData, features: newFeatures });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setPropertyData({
        ...propertyData,
        images: [...propertyData.images, ...newImages]
      });
    }
  };

  const removeImage = (index: number) => {
    const newImages = propertyData.images.filter((_, i) => i !== index);
    setPropertyData({ ...propertyData, images: newImages });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to post a property');
      return;
    }

    try {
      // TODO: Implement property posting submission
      toast.success('Property posted successfully!');
    } catch (error) {
      toast.error('Failed to post property');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Post a Property</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Title
              </label>
              <div className="relative">
                <Home className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={propertyData.title}
                  onChange={(e) => setPropertyData({ ...propertyData, title: e.target.value })}
                  className="pl-10 w-full rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type
              </label>
              <select
                value={propertyData.type}
                onChange={(e) => setPropertyData({ ...propertyData, type: e.target.value })}
                className="w-full rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
                required
              >
                <option value="">Select type</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Listing Type
              </label>
              <select
                value={propertyData.listingType}
                onChange={(e) => setPropertyData({ ...propertyData, listingType: e.target.value as 'sale' | 'rent' })}
                className="w-full rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
                required
              >
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={propertyData.price}
                  onChange={(e) => setPropertyData({ ...propertyData, price: e.target.value })}
                  className="pl-10 w-full rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Area (sq ft)
              </label>
              <div className="relative">
                <Ruler className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={propertyData.area}
                  onChange={(e) => setPropertyData({ ...propertyData, area: e.target.value })}
                  className="pl-10 w-full rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={propertyData.address}
                  onChange={(e) => setPropertyData({ ...propertyData, address: e.target.value })}
                  className="pl-10 w-full rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                value={propertyData.city}
                onChange={(e) => setPropertyData({ ...propertyData, city: e.target.value })}
                className="w-full rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Province
              </label>
              <input
                type="text"
                value={propertyData.province}
                onChange={(e) => setPropertyData({ ...propertyData, province: e.target.value })}
                className="w-full rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Postal Code
              </label>
              <input
                type="text"
                value={propertyData.postalCode}
                onChange={(e) => setPropertyData({ ...propertyData, postalCode: e.target.value })}
                className="w-full rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
                required
              />
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bedrooms
              </label>
              <div className="relative">
                <BedDouble className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  min="0"
                  value={propertyData.beds}
                  onChange={(e) => setPropertyData({ ...propertyData, beds: parseInt(e.target.value) })}
                  className="pl-10 w-full rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bathrooms
              </label>
              <div className="relative">
                <Bath className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={propertyData.baths}
                  onChange={(e) => setPropertyData({ ...propertyData, baths: parseFloat(e.target.value) })}
                  className="pl-10 w-full rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Description
            </label>
            <textarea
              value={propertyData.description}
              onChange={(e) => setPropertyData({ ...propertyData, description: e.target.value })}
              className="w-full rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
              rows={6}
              required
            />
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Features
            </label>
            {propertyData.features.map((feature, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  className="flex-1 rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
                  placeholder="Add a feature"
                />
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addFeature}
              className="text-sm text-red-600 hover:text-red-700"
            >
              + Add Feature
            </button>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Images
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Camera className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG or WEBP (MAX. 800x400px)
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-4">
              {propertyData.images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Property ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-sm hover:bg-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available From
            </label>
            <input
              type="date"
              value={propertyData.availability}
              onChange={(e) => setPropertyData({ ...propertyData, availability: e.target.value })}
              className="w-full rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Post Property
          </button>
        </form>
      </div>
    </div>
  );
}