import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

export function JobResources() {
  const { t } = useLanguage();
  const { user } = useAuth();

  const resources = [
    {
      icon: '📄',
      title: 'Resume Builder',
      description: 'Create a professional resume with our easy-to-use builder',
      link: '/resume-builder',
      requiresAuth: true
    },
    {
      icon: '✍️',
      title: 'Cover Letter Generator',
      description: 'Generate customized cover letters for your applications',
      link: '/cover-letter-builder',
      requiresAuth: true
    },
    {
      icon: '🏆',
      title: 'Certifications Guide',
      description: 'Most valued certifications by industry',
      link: '#',
      requiresAuth: false
    },
    {
      icon: '📚',
      title: 'Interview Prep',
      description: 'Common questions and best practices',
      link: '#',
      requiresAuth: false
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Career Resources</h3>

      <div className="space-y-4">
        {resources.map((resource) => (
          <a
            key={resource.title}
            href={resource.link}
            className={`block p-4 rounded-lg hover:bg-gray-50 transition-colors ${
              resource.requiresAuth && !user ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-xl">{resource.icon}</span>
              <div>
                <h4 className="font-medium text-gray-900">{resource.title}</h4>
                <p className="text-sm text-gray-600">{resource.description}</p>
                {resource.requiresAuth && !user && (
                  <span className="text-xs text-red-600">Sign in required</span>
                )}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}