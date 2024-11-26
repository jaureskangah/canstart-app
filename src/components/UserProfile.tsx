import React from 'react';
import { User, MapPin, Briefcase, GraduationCap, Languages } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

type ProfileData = {
  name: string;
  location: string;
  occupation: string;
  education: string;
  languages: string[];
};

export function UserProfile() {
  const { t } = useLanguage();
  
  const profileData: ProfileData = {
    name: "Sarah Thompson",
    location: "Toronto, ON",
    occupation: "Software Developer",
    education: "Master's in Computer Science",
    languages: ["English", "French"],
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-8">
          <div className="flex items-center space-x-4">
            <div className="bg-white p-2 rounded-full">
              <User className="h-16 w-16 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{profileData.name}</h1>
              <div className="flex items-center text-red-100 mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{profileData.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            <ProfileSection
              icon={<Briefcase className="h-5 w-5 text-red-600" />}
              title={t('profile.occupation')}
              content={profileData.occupation}
            />
            
            <ProfileSection
              icon={<GraduationCap className="h-5 w-5 text-red-600" />}
              title={t('profile.education')}
              content={profileData.education}
            />
            
            <ProfileSection
              icon={<Languages className="h-5 w-5 text-red-600" />}
              title={t('profile.languages')}
              content={
                <div className="flex gap-2">
                  {profileData.languages.map((lang) => (
                    <span
                      key={lang}
                      className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileSection({ 
  icon, 
  title, 
  content 
}: { 
  icon: React.ReactNode; 
  title: string; 
  content: React.ReactNode; 
}) {
  return (
    <div>
      <div className="flex items-center space-x-2 mb-2">
        {icon}
        <h2 className="font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="text-gray-600">{content}</div>
    </div>
  );
}