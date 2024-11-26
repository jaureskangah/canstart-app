import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

type FiltersType = {
  location: string;
  jobType: string;
  experience: string;
  salary: string;
};

type JobFiltersProps = {
  filters: FiltersType;
  setFilters: (filters: FiltersType) => void;
  className?: string;
};

export function JobFilters({ filters, setFilters, className = '' }: JobFiltersProps) {
  const { t } = useLanguage();

  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
      <h3 className="font-semibold text-gray-900 mb-4">{t('jobs.filters')}</h3>
      
      <div className="space-y-6">
        {/* Location Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <select
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          >
            <option value="">All Locations</option>
            <option value="toronto">Toronto</option>
            <option value="vancouver">Vancouver</option>
            <option value="montreal">Montreal</option>
            <option value="ottawa">Ottawa</option>
          </select>
        </div>

        {/* Job Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Type
          </label>
          <select
            value={filters.jobType}
            onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          >
            <option value="">All Types</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="remote">Remote</option>
          </select>
        </div>

        {/* Experience Level Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Experience Level
          </label>
          <select
            value={filters.experience}
            onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          >
            <option value="">All Levels</option>
            <option value="entry">Entry Level</option>
            <option value="mid">Mid Level</option>
            <option value="senior">Senior Level</option>
            <option value="executive">Executive</option>
          </select>
        </div>

        {/* Salary Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Salary Range
          </label>
          <select
            value={filters.salary}
            onChange={(e) => setFilters({ ...filters, salary: e.target.value })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          >
            <option value="">Any Salary</option>
            <option value="0-50k">$0 - $50,000</option>
            <option value="50k-100k">$50,000 - $100,000</option>
            <option value="100k-150k">$100,000 - $150,000</option>
            <option value="150k+">$150,000+</option>
          </select>
        </div>
      </div>
    </div>
  );
}