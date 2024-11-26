import React from 'react';

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  url: string;
  posted_at: string;
};

type JobCardProps = {
  job: Job;
  onSave?: () => void;
  showSaveButton?: boolean;
};

export function JobCard({ job, onSave, showSaveButton }: JobCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {job.title}
          </h3>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <span>🏢</span>
              <span>{job.company}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>📍</span>
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>⏰</span>
              <span>{job.posted_at}</span>
            </div>
          </div>
        </div>
        {showSaveButton && (
          <button
            onClick={onSave}
            className="text-gray-600 hover:text-red-600 transition-colors"
            title="Save job"
          >
            <span className="text-xl">❤️</span>
          </button>
        )}
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-3">{job.description}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm">
            {job.type}
          </span>
        </div>
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-600 hover:text-red-700 font-medium"
        >
          View Details →
        </a>
      </div>
    </div>
  );
}