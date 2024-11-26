import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { LineChart } from './charts/LineChart';
import toast from 'react-hot-toast';

type MarketData = {
  averagePrice: number;
  medianPrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  priceHistory: {
    date: string;
    price: number;
  }[];
  similarListings: {
    id: string;
    title: string;
    price: number;
    location: string;
    url: string;
  }[];
  recommendations: {
    type: 'success' | 'warning' | 'danger';
    message: string;
  }[];
};

type MarketComparisonProps = {
  type: 'job' | 'property';
  location: string;
  category?: string;
  currentPrice: number;
  className?: string;
};

export function MarketComparison({
  type,
  location,
  category,
  currentPrice,
  className = ''
}: MarketComparisonProps) {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'1m' | '3m' | '6m' | '1y'>('3m');

  // Simulated market data - In production, fetch from API
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockData: MarketData = {
          averagePrice: type === 'job' ? 75000 : 500000,
          medianPrice: type === 'job' ? 70000 : 485000,
          priceRange: {
            min: type === 'job' ? 50000 : 400000,
            max: type === 'job' ? 100000 : 600000
          },
          priceHistory: Array.from({ length: 12 }, (_, i) => ({
            date: new Date(2024, i, 1).toISOString(),
            price: type === 'job' 
              ? 70000 + Math.random() * 10000 
              : 480000 + Math.random() * 40000
          })),
          similarListings: Array.from({ length: 5 }, (_, i) => ({
            id: `listing-${i}`,
            title: type === 'job' 
              ? `Senior Developer at Company ${i + 1}`
              : `Modern ${i + 2} Bedroom House`,
            price: type === 'job' 
              ? 70000 + Math.random() * 10000 
              : 480000 + Math.random() * 40000,
            location: 'Toronto, ON',
            url: '#'
          })),
          recommendations: []
        };

        // Add recommendations based on price comparison
        const priceDiff = ((currentPrice - mockData.averagePrice) / mockData.averagePrice) * 100;
        
        if (priceDiff > 15) {
          mockData.recommendations.push({
            type: 'danger',
            message: 'Your price is significantly higher than market average. Consider lowering to attract more interest.'
          });
        } else if (priceDiff < -15) {
          mockData.recommendations.push({
            type: 'warning',
            message: 'Your price is significantly lower than market average. You might be undervaluing.'
          });
        } else {
          mockData.recommendations.push({
            type: 'success',
            message: 'Your price is competitive with current market rates.'
          });
        }

        setMarketData(mockData);
      } catch (error) {
        toast.error('Failed to fetch market data');
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, [type, location, category, currentPrice, timeRange]);

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!marketData) return null;

  const priceVariance = ((currentPrice - marketData.averagePrice) / marketData.averagePrice) * 100;

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Market Price Comparison</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as '1m' | '3m' | '6m' | '1y')}
          className="text-sm border rounded-md px-2 py-1"
        >
          <option value="1m">Last Month</option>
          <option value="3m">Last 3 Months</option>
          <option value="6m">Last 6 Months</option>
          <option value="1y">Last Year</option>
        </select>
      </div>

      {/* Price Overview */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <DollarSign className="h-4 w-4" />
            Your Price
          </div>
          <div className="text-2xl font-bold text-gray-900">
            ${currentPrice.toLocaleString()}
          </div>
          <div className={`text-sm mt-1 ${
            priceVariance > 0 ? 'text-red-600' : 'text-green-600'
          }`}>
            {priceVariance > 0 ? (
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                {priceVariance.toFixed(1)}% above market
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <TrendingDown className="h-4 w-4" />
                {Math.abs(priceVariance).toFixed(1)}% below market
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <DollarSign className="h-4 w-4" />
            Market Average
          </div>
          <div className="text-2xl font-bold text-gray-900">
            ${marketData.averagePrice.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            in {location}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <DollarSign className="h-4 w-4" />
            Price Range
          </div>
          <div className="text-2xl font-bold text-gray-900">
            ${marketData.priceRange.min.toLocaleString()} - ${marketData.priceRange.max.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            min - max
          </div>
        </div>
      </div>

      {/* Price History Chart */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Price Trends</h3>
        <div className="h-64">
          <LineChart
            data={marketData.priceHistory}
            xKey="date"
            yKey="price"
            color="#dc2626"
            height={256}
          />
        </div>
      </div>

      {/* Similar Listings */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Similar Listings</h3>
        <div className="space-y-4">
          {marketData.similarListings.map((listing) => (
            <a
              key={listing.id}
              href={listing.url}
              className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">{listing.title}</h4>
                  <p className="text-sm text-gray-600">{listing.location}</p>
                </div>
                <span className="font-medium text-gray-900">
                  ${listing.price.toLocaleString()}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-4">Recommendations</h3>
        <div className="space-y-4">
          {marketData.recommendations.map((rec, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 p-4 rounded-lg ${
                rec.type === 'success' ? 'bg-green-50' :
                rec.type === 'warning' ? 'bg-yellow-50' :
                'bg-red-50'
              }`}
            >
              <AlertCircle className={`h-5 w-5 ${
                rec.type === 'success' ? 'text-green-600' :
                rec.type === 'warning' ? 'text-yellow-600' :
                'text-red-600'
              }`} />
              <p className={`text-sm ${
                rec.type === 'success' ? 'text-green-700' :
                rec.type === 'warning' ? 'text-yellow-700' :
                'text-red-700'
              }`}>
                {rec.message}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}