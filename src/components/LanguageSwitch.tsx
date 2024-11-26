import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
      className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
      aria-label="Toggle language"
    >
      <span className="text-xl">🌐</span>
      <span className="text-sm font-medium uppercase">{language}</span>
    </button>
  );
}