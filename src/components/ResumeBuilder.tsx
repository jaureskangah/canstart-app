import React, { useState } from 'react';
import { FileText, Download, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { saveResume } from '../services/userService';
import toast from 'react-hot-toast';

type ResumeSection = {
  id: string;
  type: 'experience' | 'education' | 'skills';
  content: any;
};

export function ResumeBuilder() {
  const { user } = useAuth();
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    summary: ''
  });
  const [sections, setSections] = useState<ResumeSection[]>([]);

  const addSection = (type: 'experience' | 'education' | 'skills') => {
    const newSection: ResumeSection = {
      id: Date.now().toString(),
      type,
      content: type === 'skills' ? [] : {
        title: '',
        organization: '',
        location: '',
        startDate: '',
        endDate: '',
        description: ''
      }
    };
    setSections([...sections, newSection]);
  };

  const updateSection = (id: string, content: any) => {
    setSections(sections.map(section =>
      section.id === id ? { ...section, content } : section
    ));
  };

  const removeSection = (id: string) => {
    setSections(sections.filter(section => section.id !== id));
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please sign in to save your resume');
      return;
    }

    try {
      await saveResume(user.uid, {
        personalInfo,
        sections,
        createdAt: new Date().toISOString()
      });
      toast.success('Resume saved successfully!');
    } catch (error) {
      toast.error('Failed to save resume');
    }
  };

  const downloadPDF = () => {
    // TODO: Implement PDF generation
    toast.success('Resume downloaded as PDF');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Resume Builder</h2>
          <div className="flex gap-4">
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              <FileText className="h-5 w-5" />
              Save Resume
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

        {/* Personal Information */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={personalInfo.fullName}
              onChange={e => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
              className="rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={personalInfo.email}
              onChange={e => setPersonalInfo({ ...personalInfo, email: e.target.value })}
              className="rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={personalInfo.phone}
              onChange={e => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
              className="rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
            />
            <input
              type="text"
              placeholder="Location"
              value={personalInfo.location}
              onChange={e => setPersonalInfo({ ...personalInfo, location: e.target.value })}
              className="rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
            />
            <textarea
              placeholder="Professional Summary"
              value={personalInfo.summary}
              onChange={e => setPersonalInfo({ ...personalInfo, summary: e.target.value })}
              className="col-span-2 rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
              rows={4}
            />
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map(section => (
            <div key={section.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-gray-900 capitalize">{section.type}</h4>
                <button
                  onClick={() => removeSection(section.id)}
                  className="text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              {section.type === 'skills' ? (
                <div className="flex flex-wrap gap-2">
                  {section.content.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder="Add skill"
                    className="px-3 py-1 border-none focus:ring-0 text-sm"
                    onKeyPress={e => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement;
                        updateSection(section.id, [...section.content, input.value]);
                        input.value = '';
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Title"
                    value={section.content.title}
                    onChange={e => updateSection(section.id, {
                      ...section.content,
                      title: e.target.value
                    })}
                    className="rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
                  />
                  <input
                    type="text"
                    placeholder="Organization"
                    value={section.content.organization}
                    onChange={e => updateSection(section.id, {
                      ...section.content,
                      organization: e.target.value
                    })}
                    className="rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={section.content.location}
                    onChange={e => updateSection(section.id, {
                      ...section.content,
                      location: e.target.value
                    })}
                    className="rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
                  />
                  <div className="flex gap-4">
                    <input
                      type="date"
                      value={section.content.startDate}
                      onChange={e => updateSection(section.id, {
                        ...section.content,
                        startDate: e.target.value
                      })}
                      className="flex-1 rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
                    />
                    <input
                      type="date"
                      value={section.content.endDate}
                      onChange={e => updateSection(section.id, {
                        ...section.content,
                        endDate: e.target.value
                      })}
                      className="flex-1 rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  <textarea
                    placeholder="Description"
                    value={section.content.description}
                    onChange={e => updateSection(section.id, {
                      ...section.content,
                      description: e.target.value
                    })}
                    className="col-span-2 rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
                    rows={4}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Section Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={() => addSection('experience')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <Plus className="h-5 w-5" />
            Add Experience
          </button>
          <button
            onClick={() => addSection('education')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <Plus className="h-5 w-5" />
            Add Education
          </button>
          <button
            onClick={() => addSection('skills')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <Plus className="h-5 w-5" />
            Add Skills
          </button>
        </div>
      </div>
    </div>
  );
}