import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getSavedJobs, unsaveJob } from '../services/userService';
import type { Job } from './JobCard';
import toast from 'react-hot-toast';

type SavedJobsDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function SavedJobsDrawer({ isOpen, onClose }: SavedJobsDrawerProps) {
  const { user } = useAuth();
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && user) {
      loadSavedJobs();
    }
  }, [isOpen, user]);

  const loadSavedJobs = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const jobs = await getSavedJobs(user.uid);
      setSavedJobs(jobs);
    } catch (error) {
      toast.error('Failed to load saved jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (jobId: string) => {
    if (!user) return;
    try {
      await unsaveJob(user.uid, jobId);
      setSavedJobs(jobs => jobs.filter(job => job.id !== jobId));
      toast.success('Job removed from saved list');
    } catch (error) {
      toast.error('Failed to remove job');
    }
  };

  if (!isOpen) return null;

  const JobDetail = ({ icon, text, jobId, type }: { icon: string; text: string; jobId: string; type: string }) => (
    <div key={`${jobId}-${type}`} className="flex items-center gap-2 text-sm text-gray-600">
      <span>{icon}</span>
      <span>{text}</span>
    </div>
  );

  const renderJobDetails = (job: Job) => {
    const details = [
      { icon: '🏢', text: job.company, type: 'company' },
      { icon: '📍', text: job.location, type: 'location' },
      { icon: '⏰', text: job.type, type: 'type' }
    ];

    return (
      <div className="space-y-2">
        {details.map(detail => (
          <JobDetail
            key={`${job.id}-${detail.type}`}
            icon={detail.icon}
            text={detail.text}
            jobId={job.id}
            type={detail.type}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="absolute inset-y-0 right-0 w-full max-w-md bg-white shadow-xl">
        <div className="h-full flex flex-col">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Saved Jobs</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="text-xl">×</span>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin h-8 w-8 border-4 border-red-600 border-t-transparent rounded-full"></div>
              </div>
            ) : savedJobs.length === 0 ? (
              <div className="text-center text-gray-500">
                <p>No saved jobs yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {savedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white border rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900">{job.title}</h3>
                      <button
                        onClick={() => handleUnsave(job.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <span className="text-xl">×</span>
                      </button>
                    </div>
                    {renderJobDetails(job)}
                    <div className="mt-4 flex justify-end">
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Apply →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}