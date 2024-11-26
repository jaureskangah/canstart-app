import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { JobCard } from './JobCard';
import { JobFilters } from './JobFilters';
import { JobTrends } from './JobTrends';
import { JobResources } from './JobResources';
import { searchJobs, type JobResponse, type JobSearchParams } from '../services/jobsApi';
import { saveJob, updateSearchHistory } from '../services/userService';
import toast from 'react-hot-toast';
import { SavedJobsDrawer } from './SavedJobsDrawer';
import { RecommendedJobs } from './RecommendedJobs';
import { JobAlerts } from './JobAlerts';

export function JobsPage() {
  const { t } = useLanguage();
  const { user, userData } = useAuth();
  const [jobs, setJobs] = useState<JobResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showSavedJobs, setShowSavedJobs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<JobSearchParams>({
    location: '',
    employment_type: '',
    experience: '',
    salary_min: ''
  });

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const jobsData = await searchJobs({
        query: searchQuery,
        ...filters
      });
      setJobs(jobsData);

      if (user?.uid && searchQuery) {
        await updateSearchHistory(user.uid, searchQuery, 'job');
      }
    } catch (err) {
      setError('Failed to fetch jobs. Please try again later.');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchJobs();
  };

  const handleSaveJob = async (job: JobResponse) => {
    if (!user) {
      toast.error('Please sign in to save jobs');
      return;
    }

    try {
      await saveJob(user.uid, {
        id: `${job.employer_name}-${job.job_title}-${Date.now()}`.replace(/[^a-zA-Z0-9-]/g, '-'),
        title: job.job_title,
        company: job.employer_name,
        location: `${job.job_city}, ${job.job_country}`,
        type: job.job_employment_type,
        description: job.job_description,
        url: job.job_apply_link,
        posted_at: new Date(job.job_posted_at_datetime_utc).toLocaleDateString()
      });
      toast.success('Job saved successfully!');
    } catch (error) {
      toast.error('Failed to save job');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-red-600 to-red-700 py-12">
        <div className="container px-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">
                {t('jobs.title')}
              </h1>
              <p className="text-red-100 text-lg">
                {t('jobs.subtitle')}
              </p>
            </div>
            {user && (
              <button
                onClick={() => setShowSavedJobs(true)}
                className="flex items-center gap-2 bg-white text-red-600 px-4 py-2 rounded-lg hover:bg-red-50"
              >
                <span className="text-xl">❤️</span>
                Saved Jobs
              </button>
            )}
          </div>
          
          <form onSubmit={handleSearch} className="flex gap-4 max-w-4xl">
            <div className="flex-1 bg-white rounded-lg shadow-lg flex items-center p-2">
              <span className="text-gray-400 mx-2">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('jobs.searchPlaceholder')}
                className="flex-1 border-none focus:ring-0 text-gray-800"
              />
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
              >
                <span>⚙️</span>
                <span>{t('jobs.filters')}</span>
              </button>
            </div>
            <button 
              type="submit"
              className="bg-white text-red-600 px-8 py-3 rounded-lg font-medium hover:bg-red-50 transition-colors"
            >
              {t('jobs.search')}
            </button>
          </form>
        </div>
      </div>

      <div className="container px-6 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3">
            <JobFilters
              filters={filters}
              setFilters={setFilters}
              className={showFilters ? 'block' : 'hidden lg:block'}
            />
            {user && <JobAlerts className="mt-6" />}
          </div>

          <div className="lg:col-span-6">
            {user && userData?.preferences && (
              <RecommendedJobs 
                preferences={userData.preferences}
                className="mb-8"
              />
            )}
            
            <div className="space-y-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin h-8 w-8 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600">{t('jobs.loading')}</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-600">{error}</p>
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">{t('jobs.noResults')}</p>
                </div>
              ) : (
                jobs.map((job) => (
                  <JobCard 
                    key={`${job.employer_name}-${job.job_title}-${job.job_posted_at_datetime_utc}`.replace(/[^a-zA-Z0-9-]/g, '-')}
                    job={{
                      id: `${job.employer_name}-${job.job_title}-${job.job_posted_at_datetime_utc}`.replace(/[^a-zA-Z0-9-]/g, '-'),
                      title: job.job_title,
                      company: job.employer_name,
                      location: `${job.job_city}, ${job.job_country}`,
                      type: job.job_employment_type,
                      description: job.job_description,
                      url: job.job_apply_link,
                      posted_at: new Date(job.job_posted_at_datetime_utc).toLocaleDateString()
                    }}
                    onSave={() => handleSaveJob(job)}
                    showSaveButton={!!user}
                  />
                ))
              )}
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <JobTrends />
            <JobResources />
          </div>
        </div>
      </div>

      <SavedJobsDrawer
        isOpen={showSavedJobs}
        onClose={() => setShowSavedJobs(false)}
      />
    </div>
  );
}