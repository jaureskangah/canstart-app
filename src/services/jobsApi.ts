import axios from 'axios';

const API_KEY = 'a9f0778b1cmshc343c764ac997c8p1aa701jsn52a949d7d714';
const BASE_URL = 'https://jsearch.p.rapidapi.com';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-RapidAPI-Key': API_KEY,
    'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
  }
});

export type JobSearchParams = {
  query?: string;
  location?: string;
  employment_type?: string;
  experience?: string;
  salary_min?: string;
};

export type JobResponse = {
  id: string;
  employer_name: string;
  job_title: string;
  job_description: string;
  job_city: string;
  job_country: string;
  job_employment_type: string;
  job_apply_link: string;
  job_posted_at_datetime_utc: string;
};

const sanitizeJobData = (job: any): JobResponse => {
  // Create a unique ID from stable job properties
  const id = [
    job.employer_name,
    job.job_title,
    job.job_posted_at_datetime_utc
  ].filter(Boolean).join('-').replace(/[^a-zA-Z0-9-]/g, '-');

  return {
    id,
    employer_name: String(job.employer_name || 'Unknown Company'),
    job_title: String(job.job_title || 'Untitled Position'),
    job_description: String(job.job_description || 'No description available'),
    job_city: String(job.job_city || 'Unknown City'),
    job_country: String(job.job_country || 'Canada'),
    job_employment_type: String(job.job_employment_type || 'Not specified'),
    job_apply_link: String(job.job_apply_link || '#'),
    job_posted_at_datetime_utc: String(job.job_posted_at_datetime_utc || new Date().toISOString())
  };
};

export const searchJobs = async (params: JobSearchParams): Promise<JobResponse[]> => {
  try {
    const queryString = [
      params.query || '',
      params.location ? `in ${params.location}` : 'in Canada'
    ].filter(Boolean).join(' ');

    const response = await api.get('/search', {
      params: {
        query: queryString,
        page: '1',
        num_pages: '1',
        ...(params.employment_type && { employment_type: params.employment_type })
      }
    });

    if (!response.data?.data) {
      return [];
    }

    // Ensure we have an array of jobs
    const jobsData = Array.isArray(response.data.data) ? response.data.data : [];
    
    // Map and sanitize each job
    return jobsData.map(sanitizeJobData);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
};