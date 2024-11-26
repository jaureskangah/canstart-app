import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { RichTextEditor } from './RichTextEditor';
import { ScreeningQuestions } from './ScreeningQuestions';
import { Save, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

type ScreeningQuestion = {
  id: string;
  question: string;
  type: 'text' | 'yesno' | 'multiple' | 'number';
  options?: string[];
  required: boolean;
  eliminatory: boolean;
  correctAnswer?: string | number | boolean;
};

type JobPosting = {
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  benefits: string[];
  promotionPlan: string;
  status: 'draft' | 'published';
  lastSaved?: string;
  screeningQuestions: ScreeningQuestion[];
};

const promotionPlans = [
  { id: 'basic', name: 'Basic', price: 0, features: ['Standard listing', '30-day visibility'] },
  { id: 'featured', name: 'Featured', price: 49.99, features: ['Highlighted listing', 'Top of search results', '60-day visibility'] },
  { id: 'premium', name: 'Premium', price: 99.99, features: ['Highlighted listing', 'Top of search results', '90-day visibility', 'Social media promotion'] }
];

export function PostJobForm() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [jobData, setJobData] = useState<JobPosting>({
    title: '',
    company: '',
    location: '',
    type: '',
    salary: '',
    description: '',
    requirements: [''],
    benefits: [''],
    promotionPlan: 'basic',
    status: 'draft',
    screeningQuestions: []
  });
  const [showPreview, setShowPreview] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load draft from localStorage on mount
  useEffect(() => {
    if (user) {
      const savedDraft = localStorage.getItem(`job-draft-${user.uid}`);
      if (savedDraft) {
        setJobData(JSON.parse(savedDraft));
        toast.success('Draft loaded');
      }
    }
  }, [user]);

  // Auto-save draft every 30 seconds if enabled
  useEffect(() => {
    if (!autoSaveEnabled || !user) return;

    const interval = setInterval(() => {
      saveDraft();
    }, 30000);

    return () => clearInterval(interval);
  }, [jobData, autoSaveEnabled, user]);

  const saveDraft = async () => {
    if (!user) return;

    try {
      setIsSaving(true);
      const draftData = {
        ...jobData,
        lastSaved: new Date().toISOString()
      };
      localStorage.setItem(`job-draft-${user.uid}`, JSON.stringify(draftData));
      setJobData(draftData);
      toast.success('Draft saved');
    } catch (error) {
      toast.error('Failed to save draft');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, status: 'draft' | 'published') => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to post a job');
      return;
    }

    try {
      const finalData = {
        ...jobData,
        status,
        lastSaved: new Date().toISOString()
      };

      if (status === 'published') {
        // TODO: Submit to backend
        localStorage.removeItem(`job-draft-${user.uid}`);
        toast.success('Job posted successfully!');
      } else {
        await saveDraft();
      }
    } catch (error) {
      toast.error('Failed to submit job posting');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Post a Job</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="autoSave"
                checked={autoSaveEnabled}
                onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <label htmlFor="autoSave" className="text-sm text-gray-600">
                Auto-save draft
              </label>
            </div>
            {jobData.lastSaved && (
              <span className="text-sm text-gray-500">
                Last saved: {new Date(jobData.lastSaved).toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        <form onSubmit={(e) => handleSubmit(e, 'published')} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title
              </label>
              <input
                type="text"
                value={jobData.title}
                onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
                className="w-full rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company
              </label>
              <input
                type="text"
                value={jobData.company}
                onChange={(e) => setJobData({ ...jobData, company: e.target.value })}
                className="w-full rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={jobData.location}
                onChange={(e) => setJobData({ ...jobData, location: e.target.value })}
                className="w-full rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Type
              </label>
              <select
                value={jobData.type}
                onChange={(e) => setJobData({ ...jobData, type: e.target.value })}
                className="w-full rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
                required
              >
                <option value="">Select type</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="remote">Remote</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salary Range
              </label>
              <input
                type="text"
                value={jobData.salary}
                onChange={(e) => setJobData({ ...jobData, salary: e.target.value })}
                className="w-full rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
                placeholder="e.g. $50,000 - $70,000"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description
            </label>
            <RichTextEditor
              content={jobData.description}
              onChange={(content) => setJobData({ ...jobData, description: content })}
            />
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Requirements
            </label>
            {jobData.requirements.map((req, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={req}
                  onChange={(e) => {
                    const newReqs = [...jobData.requirements];
                    newReqs[index] = e.target.value;
                    setJobData({ ...jobData, requirements: newReqs });
                  }}
                  className="flex-1 rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
                  placeholder="Add a requirement"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newReqs = jobData.requirements.filter((_, i) => i !== index);
                    setJobData({ ...jobData, requirements: newReqs });
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setJobData({
                ...jobData,
                requirements: [...jobData.requirements, '']
              })}
              className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
            >
              <Plus className="h-4 w-4" />
              Add Requirement
            </button>
          </div>

          {/* Benefits */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Benefits
            </label>
            {jobData.benefits.map((benefit, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={benefit}
                  onChange={(e) => {
                    const newBenefits = [...jobData.benefits];
                    newBenefits[index] = e.target.value;
                    setJobData({ ...jobData, benefits: newBenefits });
                  }}
                  className="flex-1 rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
                  placeholder="Add a benefit"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newBenefits = jobData.benefits.filter((_, i) => i !== index);
                    setJobData({ ...jobData, benefits: newBenefits });
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setJobData({
                ...jobData,
                benefits: [...jobData.benefits, '']
              })}
              className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
            >
              <Plus className="h-4 w-4" />
              Add Benefit
            </button>
          </div>

          {/* Screening Questions */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Screening Questions</h3>
            <p className="text-sm text-gray-600 mb-4">
              Add questions to pre-screen candidates. You can mark questions as required
              and/or eliminatory (wrong answers will automatically disqualify candidates).
            </p>
            <ScreeningQuestions
              questions={jobData.screeningQuestions}
              onChange={(questions) => setJobData({ ...jobData, screeningQuestions: questions })}
            />
          </div>

          {/* Promotion Plans */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Promotion Plan</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {promotionPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    jobData.promotionPlan === plan.id
                      ? 'border-red-600 bg-red-50'
                      : 'hover:border-gray-400'
                  }`}
                  onClick={() => setJobData({ ...jobData, promotionPlan: plan.id })}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-900">{plan.name}</h4>
                    <span className="text-lg font-bold text-gray-900">
                      ${plan.price.toFixed(2)}
                    </span>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, 'draft')}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
            >
              <Save className="h-5 w-5" />
              Save as Draft
            </button>
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
            >
              Preview
            </button>
            <button
              type="submit"
              className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              {jobData.promotionPlan === 'basic' 
                ? 'Publish Job' 
                : `Publish Job ($${promotionPlans.find(p => p.id === jobData.promotionPlan)?.price.toFixed(2)})`
              }
            </button>
          </div>
        </form>

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Preview Job Posting</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              <div className="prose max-w-none">
                <h1>{jobData.title}</h1>
                <div className="flex gap-4 text-gray-600">
                  <span>{jobData.company}</span>
                  <span>{jobData.location}</span>
                  <span>{jobData.type}</span>
                  <span>{jobData.salary}</span>
                </div>
                <div dangerouslySetInnerHTML={{ __html: jobData.description }} />
                <div>
                  <h3>Requirements</h3>
                  <ul>
                    {jobData.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3>Benefits</h3>
                  <ul>
                    {jobData.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
                {jobData.screeningQuestions.length > 0 && (
                  <div>
                    <h3>Screening Questions</h3>
                    <div className="space-y-4">
                      {jobData.screeningQuestions.map((q, index) => (
                        <div key={q.id} className="border rounded-lg p-4">
                          <p className="font-medium">
                            {index + 1}. {q.question}
                            {q.required && <span className="text-red-600">*</span>}
                          </p>
                          {q.type === 'multiple' && q.options && (
                            <div className="mt-2 space-y-2">
                              {q.options.map((option, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name={`preview-q-${q.id}`}
                                    disabled
                                    className="text-red-600 focus:ring-red-500"
                                  />
                                  <span>{option}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}