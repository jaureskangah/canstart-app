import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export function JobTrends() {
  const { t } = useLanguage();

  const trends = [
    {
      title: 'Software Development',
      growth: '+15%',
      demand: 'High',
    },
    {
      title: 'Data Science',
      growth: '+12%',
      demand: 'Very High',
    },
    {
      title: 'Healthcare',
      growth: '+18%',
      demand: 'Critical',
    },
    {
      title: 'Digital Marketing',
      growth: '+8%',
      demand: 'Moderate',
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl text-red-600">📈</span>
        <h3 className="font-semibold text-gray-900">Industry Trends</h3>
      </div>

      <div className="space-y-4">
        {trends.map((trend) => (
          <div key={trend.title} className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{trend.title}</p>
              <p className="text-sm text-gray-600">Growth: {trend.growth}</p>
            </div>
            <span className="flex items-center gap-1 text-sm">
              <span className="text-yellow-500">⚡</span>
              {trend.demand}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}