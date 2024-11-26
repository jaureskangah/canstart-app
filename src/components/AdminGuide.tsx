import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { trackProgress } from '../services/progressService';
import { downloadDocument } from '../services/documentService';
import toast from 'react-hot-toast';

type Step = {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  documents: {
    name: string;
    url: string;
  }[];
  timeline: string;
  tips: string[];
  status: 'pending' | 'in_progress' | 'completed';
};

const adminSteps: Step[] = [
  {
    id: 'permanent_residence',
    title: 'Permanent Residence Application',
    description: 'Complete your permanent residence application through Express Entry or other immigration programs.',
    requirements: [
      'Valid passport',
      'Language test results (IELTS/TEF)',
      'Educational credentials assessment',
      'Work experience letters'
    ],
    documents: [
      { name: 'IMM 5406 Form', url: '/documents/imm5406.pdf' },
      { name: 'IMM 5669 Form', url: '/documents/imm5669.pdf' }
    ],
    timeline: '6-8 months',
    tips: [
      'Start gathering documents early',
      'Ensure all documents are translated if not in English/French',
      'Keep copies of everything submitted'
    ],
    status: 'pending'
  },
  {
    id: 'sin_number',
    title: 'Social Insurance Number (SIN)',
    description: 'Apply for your Social Insurance Number, required for working in Canada.',
    requirements: [
      'Permanent Resident Card or Work Permit',
      'Valid passport',
      'Proof of address'
    ],
    documents: [
      { name: 'SIN Application Guide', url: '/documents/sin_guide.pdf' }
    ],
    timeline: '1-2 days',
    tips: [
      'Visit a Service Canada office in person for fastest processing',
      'Keep your SIN confidential',
      'Start applying for jobs once you receive your SIN'
    ],
    status: 'pending'
  },
  {
    id: 'health_insurance',
    title: 'Provincial Health Insurance',
    description: 'Register for your provincial health insurance card.',
    requirements: [
      'Permanent Resident Card or Work Permit',
      'Proof of address',
      'Proof of identity'
    ],
    documents: [
      { name: 'Health Card Application', url: '/documents/health_card.pdf' }
    ],
    timeline: '2-3 weeks',
    tips: [
      'Apply as soon as you arrive',
      'Consider private insurance for the waiting period',
      'Keep temporary confirmation documents'
    ],
    status: 'pending'
  }
];

export function AdminGuide() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [steps, setSteps] = useState(adminSteps);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const handleStepClick = (stepId: string) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  const updateStepStatus = async (stepId: string, status: Step['status']) => {
    if (!user) {
      toast.error('Please sign in to track your progress');
      return;
    }

    try {
      await trackProgress(user.uid, stepId, status);
      setSteps(steps.map(step =>
        step.id === stepId ? { ...step, status } : step
      ));
      toast.success('Progress updated');
    } catch (error) {
      toast.error('Failed to update progress');
    }
  };

  const handleDownload = async (document: { name: string; url: string }) => {
    try {
      await downloadDocument(document.url);
      toast.success(`${document.name} downloaded successfully`);
    } catch (error) {
      toast.error('Failed to download document');
    }
  };

  const getStatusIcon = (status: Step['status']) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'in_progress':
        return '⏳';
      default:
        return '📄';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Administrative Guide
        </h2>

        <div className="space-y-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className="border rounded-lg overflow-hidden"
            >
              <button
                onClick={() => handleStepClick(step.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{getStatusIcon(step.status)}</span>
                  <span className="font-medium text-gray-900">{step.title}</span>
                </div>
                <span className="text-gray-400 text-xl">
                  {expandedStep === step.id ? '▼' : '▶'}
                </span>
              </button>

              {expandedStep === step.id && (
                <div className="p-4 border-t bg-gray-50">
                  <p className="text-gray-600 mb-4">{step.description}</p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Requirements</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        {step.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Timeline</h4>
                      <p className="text-gray-600">{step.timeline}</p>

                      <h4 className="font-medium text-gray-900 mt-4 mb-2">Documents</h4>
                      <div className="space-y-2">
                        {step.documents.map((doc, index) => (
                          <button
                            key={index}
                            onClick={() => handleDownload(doc)}
                            className="flex items-center gap-2 text-red-600 hover:text-red-700"
                          >
                            <span>📄</span>
                            <span>{doc.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-2">Tips</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      {step.tips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 flex gap-4">
                    <button
                      onClick={() => updateStepStatus(step.id, 'in_progress')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        step.status === 'in_progress'
                          ? 'bg-yellow-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Mark In Progress
                    </button>
                    <button
                      onClick={() => updateStepStatus(step.id, 'completed')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        step.status === 'completed'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Mark Complete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}