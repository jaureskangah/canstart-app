import React, { useState } from 'react';
import { FileText, Download, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { saveCoverLetter } from '../services/userService';
import toast from 'react-hot-toast';

export function CoverLetterBuilder() {
  const { user } = useAuth();
  const [letterInfo, setLetterInfo] = useState({
    recipientName: '',
    companyName: '',
    jobTitle: '',
    introduction: '',
    body: '',
    conclusion: '',
    signature: ''
  });

  const generateAIContent = async (section: keyof typeof letterInfo) => {
    // TODO: Implement AI content generation
    toast.success('AI content generated');
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please sign in to save your cover letter');
      return;
    }

    try {
      await saveCoverLetter(user.uid, {
        ...letterInfo,
        createdAt: new Date().toISOString()
      });
      toast.success('Cover letter saved successfully!');
    } catch (error) {
      toast.error('Failed to save cover letter');
    }
  };

  const downloadPDF = () => {
    // TODO: Implement PDF generation
    toast.success('Cover letter downloaded as PDF');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Cover Letter Builder</h2>
          <div className="flex gap-4">
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              <FileText className="h-5 w-5" />
              Save Letter
            </button>
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              <Download className="h-5 w-5" />
              Download PDF
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Recipient's Name"
              value={letterInfo.recipientName}
              onChange={e => setLetterInfo({ ...letterInfo, recipientName: e.target.value })}
              className="rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
            />
            <input
              type="text"
              placeholder="Company Name"
              value={letterInfo.companyName}
              onChange={e => setLetterInfo({ ...letterInfo, companyName: e.target.value })}
              className="rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
            />
            <input
              type="text"
              placeholder="Job Title"
              value={letterInfo.jobTitle}
              onChange={e => setLetterInfo({ ...letterInfo, jobTitle: e.target.value })}
              className="col-span-2 rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
            />
          </div>

          {/* Introduction */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Introduction
            </label>
            <button
              onClick={() => generateAIContent('introduction')}
              className="absolute right-2 top-8 text-gray-400 hover:text-yellow-600"
              title="Generate with AI"
            >
              <Sparkles className="h-5 w-5" />
            </button>
            <textarea
              value={letterInfo.introduction}
              onChange={e => setLetterInfo({ ...letterInfo, introduction: e.target.value })}
              className="w-full rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
              rows={4}
              placeholder="Write an engaging introduction..."
            />
          </div>

          {/* Body */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Body
            </label>
            <button
              onClick={() => generateAIContent('body')}
              className="absolute right-2 top-8 text-gray-400 hover:text-yellow-600"
              title="Generate with AI"
            >
              <Sparkles className="h-5 w-5" />
            </button>
            <textarea
              value={letterInfo.body}
              onChange={e => setLetterInfo({ ...letterInfo, body: e.target.value })}
              className="w-full rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
              rows={8}
              placeholder="Describe your relevant experience and skills..."
            />
          </div>

          {/* Conclusion */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Conclusion
            </label>
            <button
              onClick={() => generateAIContent('conclusion')}
              className="absolute right-2 top-8 text-gray-400 hover:text-yellow-600"
              title="Generate with AI"
            >
              <Sparkles className="h-5 w-5" />
            </button>
            <textarea
              value={letterInfo.conclusion}
              onChange={e => setLetterInfo({ ...letterInfo, conclusion: e.target.value })}
              className="w-full rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
              rows={4}
              placeholder="Write a strong closing paragraph..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Signature
            </label>
            <input
              type="text"
              placeholder="Your Name"
              value={letterInfo.signature}
              onChange={e => setLetterInfo({ ...letterInfo, signature: e.target.value })}
              className="w-full rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}