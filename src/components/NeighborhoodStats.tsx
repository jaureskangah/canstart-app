import React from 'react';
import { TrendingUp, Users, Home, DollarSign, Building } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import type { NeighborhoodData } from '../services/neighborhoodService';

type NeighborhoodStatsProps = {
  data: NeighborhoodData;
  className?: string;
};

export function NeighborhoodStats({ data, className = '' }: NeighborhoodStatsProps) {
  const priceHistoryData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Average Price',
        data: data.priceHistory,
        borderColor: 'rgb(239, 68, 68)',
        tension: 0.4
      }
    ]
  };

  const stats = [
    {
      icon: <DollarSign className="h-5 w-5 text-green-600" />,
      label: 'Avg. Price',
      value: `$${data.averagePrice.toLocaleString()}`,
      change: data.priceChange
    },
    {
      icon: <Building className="h-5 w-5 text-blue-600" />,
      label: 'Properties',
      value: data.totalProperties.toLocaleString(),
      change: data.propertyChange
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-purple-600" />,
      label: 'Market Trend',
      value: data.marketTrend,
      change: null
    },
    {
      icon: <Users className="h-5 w-5 text-orange-600" />,
      label: 'Population',
      value: data.population.toLocaleString(),
      change: data.populationChange
    }
  ];

  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
      <h3 className="font-semibold text-gray-900 mb-4">Neighborhood Statistics</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              {stat.icon}
              <span className="text-sm text-gray-600">{stat.label}</span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-lg font-semibold text-gray-900">
                {stat.value}
              </span>
              {stat.change !== null && (
                <span className={`text-sm ${
                  stat.change > 0 
                    ? 'text-green-600' 
                    : stat.change < 0 
                    ? 'text-red-600' 
                    : 'text-gray-600'
                }`}>
                  {stat.change > 0 ? '+' : ''}{stat.change}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-700 mb-4">Price History</h4>
        <div className="h-48">
          <Line 
            data={priceHistoryData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false
                }
              },
              scales: {
                y: {
                  beginAtZero: false,
                  ticks: {
                    callback: (value) => `$${value.toLocaleString()}`
                  }
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}