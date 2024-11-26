import React from 'react';

type Neighborhood = {
  name: string;
  description: string;
  highlights: string[];
  score: number;
};

const neighborhoods: Neighborhood[] = [
  {
    name: 'Downtown Core',
    description: 'Vibrant urban center with easy access to business districts and entertainment',
    highlights: ['Business hub', 'Cultural venues', 'Public transit'],
    score: 4.5
  },
  {
    name: 'West End',
    description: 'Family-friendly area with parks and excellent schools',
    highlights: ['Parks', 'Schools', 'Community centers'],
    score: 4.2
  },
  {
    name: 'East Side',
    description: 'Trendy area with diverse dining options and boutique shopping',
    highlights: ['Restaurants', 'Shopping', 'Nightlife'],
    score: 4.0
  }
];

export function NeighborhoodGuide() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Neighborhood Guide</h3>
      
      <div className="space-y-6">
        {neighborhoods.map((neighborhood) => (
          <div
            key={neighborhood.name}
            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-gray-900">{neighborhood.name}</h4>
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">⭐</span>
                <span className="text-sm text-gray-600">{neighborhood.score}</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">
              {neighborhood.description}
            </p>
            
            <div className="flex flex-wrap gap-2">
              {neighborhood.highlights.map((highlight) => (
                <span
                  key={highlight}
                  className="px-2 py-1 bg-white rounded-full text-xs text-gray-600"
                >
                  {highlight}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}