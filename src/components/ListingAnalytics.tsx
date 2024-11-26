import React from 'react';
import { LineChart, BarChart, PieChart } from './charts';
import { Eye, UserCheck, Clock, TrendingUp, Users, Share2 } from 'lucide-react';

type AnalyticsData = {
  views: number;
  uniqueViews: number;
  applications: number;
  averageTimeSpent: string;
  conversionRate: number;
  viewsByDay: {
    date: string;
    views: number;
  }[];
  applicationsBySource: {
    source: string;
    count: number;
  }[];
  demographicData: {
    label: string;
    value: number;
  }[];
};

type ListingAnalyticsProps = {
  data: AnalyticsData;
  type: 'job' | 'property';
  className?: string;
};

export function ListingAnalytics({ data, type, className = '' }: ListingAnalyticsProps) {
  const metrics = [
    {
      icon: <Eye className="h-5 w-5 text-blue-500" />,
      label: 'Total Views',
      value: data.views.toLocaleString(),
      change: '+12%',
      positive: true
    },
    {
      icon: <UserCheck className="h-5 w-5 text-green-500" />,
      label: type === 'job' ? 'Applications' : 'Inquiries',
      value: data.applications.toLocaleString(),
      change: '+5%',
      positive: true
    },
    {
      icon: <Clock className="h-5 w-5 text-purple-500" />,
      label: 'Avg. Time Spent',
      value: data.averageTimeSpent,
      change: '+8%',
      positive: true
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-red-500" />,
      label: 'Conversion Rate',
      value: `${data.conversionRate}%`,
      change: '+2%',
      positive: true
    }
  ];

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Performance Analytics</h2>
        <div className="flex gap-2">
          <select className="text-sm border rounded-md px-2 py-1">
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
          <button className="text-red-600 hover:text-red-700">
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              {metric.icon}
              <span className="text-sm text-gray-600">{metric.label}</span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
              <span className={`text-sm ${
                metric.positive ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Views Over Time */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-4">Views Over Time</h3>
          <LineChart
            data={data.viewsByDay}
            xKey="date"
            yKey="views"
            color="#dc2626"
            height={200}
          />
        </div>

        {/* Applications by Source */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-4">
            {type === 'job' ? 'Applications' : 'Inquiries'} by Source
          </h3>
          <BarChart
            data={data.applicationsBySource}
            xKey="source"
            yKey="count"
            color="#dc2626"
            height={200}
          />
        </div>
      </div>

      {/* Demographic Data */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-700">Viewer Demographics</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Users className="h-4 w-4" />
            <span>{data.uniqueViews.toLocaleString()} unique visitors</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <PieChart
            data={data.demographicData}
            colors={['#dc2626', '#ef4444', '#f87171', '#fca5a5']}
            height={200}
          />
          <div className="grid grid-cols-2 gap-4 content-center">
            {data.demographicData.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-600" />
                <div>
                  <span className="block text-sm font-medium text-gray-900">
                    {item.label}
                  </span>
                  <span className="text-sm text-gray-500">
                    {((item.value / data.uniqueViews) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="mt-8 border-t pt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Engagement Metrics</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Bounce Rate</div>
            <div className="text-xl font-bold text-gray-900">32.4%</div>
            <div className="text-sm text-red-600">+2.3%</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Avg. Session Duration</div>
            <div className="text-xl font-bold text-gray-900">2m 45s</div>
            <div className="text-sm text-green-600">+0.5%</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Return Visitors</div>
            <div className="text-xl font-bold text-gray-900">45.8%</div>
            <div className="text-sm text-green-600">+4.2%</div>
          </div>
        </div>
      </div>

      {/* Action Items */}
      <div className="mt-8 bg-red-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-red-900 mb-2">Recommendations</h3>
        <ul className="space-y-2 text-sm text-red-700">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
            Consider updating the listing title for better visibility
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
            Add more detailed description to improve engagement
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
            Promote your listing during peak hours (2PM - 5PM)
          </li>
        </ul>
      </div>
    </div>
  );
}