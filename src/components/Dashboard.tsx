import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { ListingAnalytics } from './ListingAnalytics';
import { LayoutGrid, List, TrendingUp, Home, Briefcase } from 'lucide-react';

type TabType = 'overview' | 'jobs' | 'properties';
type ViewType = 'grid' | 'list';

// Mock data - In production, this would come from your backend
const mockAnalytics = {
  views: 1250,
  uniqueViews: 850,
  applications: 45,
  averageTimeSpent: '2m 30s',
  conversionRate: 3.6,
  viewsByDay: [
    { date: '2024-02-01', views: 120 },
    { date: '2024-02-02', views: 145 },
    { date: '2024-02-03', views: 165 },
    { date: '2024-02-04', views: 140 },
    { date: '2024-02-05', views: 180 },
    { date: '2024-02-06', views: 190 },
    { date: '2024-02-07', views: 210 }
  ],
  applicationsBySource: [
    { source: 'Direct', count: 20 },
    { source: 'Search', count: 15 },
    { source: 'Social', count: 8 },
    { source: 'Email', count: 2 }
  ],
  demographicData: [
    { label: '18-24', value: 150 },
    { label: '25-34', value: 300 },
    { label: '35-44', value: 250 },
    { label: '45+', value: 150 }
  ]
};

export function Dashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [viewType, setViewType] = useState<ViewType>('grid');

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Please sign in to view your dashboard
          </h2>
          <p className="text-gray-600">
            You need to be signed in to access your listings and analytics.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Track and manage your listings</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white rounded-lg shadow-sm p-1">
              <button
                onClick={() => setViewType('grid')}
                className={`p-2 rounded ${
                  viewType === 'grid' ? 'bg-red-50 text-red-600' : 'text-gray-400'
                }`}
              >
                <LayoutGrid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewType('list')}
                className={`p-2 rounded ${
                  viewType === 'list' ? 'bg-red-50 text-red-600' : 'text-gray-400'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
            <select className="rounded-lg border-gray-300 text-sm focus:ring-red-500 focus:border-red-500">
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium ${
              activeTab === 'overview'
                ? 'border-b-2 border-red-600 text-red-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <TrendingUp className="h-5 w-5" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium ${
              activeTab === 'jobs'
                ? 'border-b-2 border-red-600 text-red-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Briefcase className="h-5 w-5" />
            Job Listings
          </button>
          <button
            onClick={() => setActiveTab('properties')}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium ${
              activeTab === 'properties'
                ? 'border-b-2 border-red-600 text-red-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Home className="h-5 w-5" />
            Property Listings
          </button>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-8">
            <ListingAnalytics
              data={mockAnalytics}
              type="job"
              className="md:col-span-2"
            />
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Job Listings</h3>
              {/* Add job listings table/grid */}
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Property Listings</h3>
              {/* Add property listings table/grid */}
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="space-y-8">
            <ListingAnalytics
              data={mockAnalytics}
              type="job"
            />
            {/* Add detailed job listings management */}
          </div>
        )}

        {activeTab === 'properties' && (
          <div className="space-y-8">
            <ListingAnalytics
              data={mockAnalytics}
              type="property"
            />
            {/* Add detailed property listings management */}
          </div>
        )}
      </div>
    </div>
  );
}