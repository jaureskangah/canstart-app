import React from 'react';
import { Copy } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import toast from 'react-hot-toast';

type DuplicateButtonProps = {
  listingId: string;
  listingType: 'job' | 'property';
  onDuplicate: (newListing: any) => void;
  className?: string;
};

export function DuplicateButton({ 
  listingId, 
  listingType,
  onDuplicate,
  className = '' 
}: DuplicateButtonProps) {
  const { user } = useAuth();
  const { t } = useLanguage();

  const handleDuplicate = async () => {
    if (!user) {
      toast.error(t('auth.signInRequired'));
      return;
    }

    try {
      // Fetch the original listing data
      const response = await fetch(`/api/listings/${listingId}`);
      const originalListing = await response.json();

      // Create a new listing based on the original
      const newListing = {
        ...originalListing,
        id: undefined, // Remove ID to create new
        title: `${originalListing.title} (Copy)`,
        createdAt: new Date().toISOString(),
        status: 'draft',
        views: 0,
        applications: 0,
        // Reset analytics and tracking data
        analytics: {
          views: 0,
          uniqueViews: 0,
          applications: 0,
          averageTimeSpent: '0s',
          conversionRate: 0
        }
      };

      // Save the new listing
      const saveResponse = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newListing)
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to create duplicate listing');
      }

      const savedListing = await saveResponse.json();
      onDuplicate(savedListing);
      
      toast.success(t('listings.duplicateSuccess'));
    } catch (error) {
      console.error('Error duplicating listing:', error);
      toast.error(t('listings.duplicateError'));
    }
  };

  return (
    <button
      onClick={handleDuplicate}
      className={`flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors ${className}`}
      title={t('listings.duplicate')}
    >
      <Copy className="h-4 w-4" />
      <span>{t('listings.duplicate')}</span>
    </button>
  );
}