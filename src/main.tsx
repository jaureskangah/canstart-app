import React from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

const root = document.getElementById('root');

if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <AuthProvider>
        <LanguageProvider>
          <App />
          <Toaster position="top-right" />
        </LanguageProvider>
      </AuthProvider>
    </React.StrictMode>
  );
}