import React from 'react';
import type { UserPreferences } from '../services/userService';

type RecommendedJobsProps = {
  preferences: UserPreferences;
  className?: string;
};

export function RecommendedJobs({ preferences, className = '' }: RecommendedJobsProps) {
  return (
    <div className={`bg-gradient-to-r from-yellow-50 to-red-50 rounded-xl p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl text-yellow-600">✨</span>
        <h2 className="font-semibold text-gray-900">Recommended for You</h2>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {preferences.preferredJobTypes.map((type) => (
          <span
            key={type}
            className="px-3 py-1 bg-white text-gray-700 rounded-full text-sm"
          >
            {type}
          </span>
        ))}
        {preferences.preferredLocations.map((location) => (
          <span
            key={location}
            className="px-3 py-1 bg-white text-gray-700 rounded-full text-sm"
          >
            {location}
          </span>
        ))}
      </div>
    </div>
  );
}