import React, { useState } from 'react';
import { useLanguage } from './contexts/LanguageContext';
import { useAuth } from './contexts/AuthContext';
import { AuthModal } from './components/AuthModal';
import { LanguageSwitch } from './components/LanguageSwitch';
import { JobsPage } from './components/JobsPage';
import { HousingPage } from './components/HousingPage';
import { AdminGuide } from './components/AdminGuide';
import { PostJobForm } from './components/PostJobForm';
import { PostPropertyForm } from './components/PostPropertyForm';

type Page = 'home' | 'jobs' | 'housing' | 'support' | 'post-job' | 'post-property';

function App() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'jobs':
        return (
          <div>
            {user && (
              <div className="container mx-auto px-6 py-4">
                <button
                  onClick={() => setCurrentPage('post-job')}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Post a Job
                </button>
              </div>
            )}
            <JobsPage />
          </div>
        );
      case 'housing':
        return (
          <div>
            {user && (
              <div className="container mx-auto px-6 py-4">
                <button
                  onClick={() => setCurrentPage('post-property')}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Post a Property
                </button>
              </div>
            )}
            <HousingPage />
          </div>
        );
      case 'support':
        return <AdminGuide />;
      case 'post-job':
        return <PostJobForm />;
      case 'post-property':
        return <PostPropertyForm />;
      default:
        return (
          <>
            <div className="bg-gradient-to-r from-red-600 to-red-700 py-24">
              <div className="container mx-auto px-6 text-center">
                <h1 className="text-5xl font-bold text-white mb-6">
                  {t('hero.title')}
                </h1>
                <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
                  {t('hero.subtitle')}
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="bg-white text-red-600 px-8 py-3 rounded-lg font-medium hover:bg-red-50 transition-colors"
                  >
                    {t('hero.getStarted')}
                  </button>
                  <button
                    onClick={() => setCurrentPage('support')}
                    className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
                  >
                    {t('hero.learnMore')}
                  </button>
                </div>
              </div>
            </div>

            <div className="py-24 bg-white">
              <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                  {t('features.title')}
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  <FeatureCard
                    title={t('features.jobSearch.title')}
                    description={t('features.jobSearch.description')}
                    image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800"
                    onClick={() => setCurrentPage('jobs')}
                  />
                  <FeatureCard
                    title={t('features.housing.title')}
                    description={t('features.housing.description')}
                    image="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800"
                    onClick={() => setCurrentPage('housing')}
                  />
                  <FeatureCard
                    title={t('features.admin.title')}
                    description={t('features.admin.description')}
                    image="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800"
                    onClick={() => setCurrentPage('support')}
                  />
                </div>
              </div>
            </div>

            <div className="py-24 bg-gray-50">
              <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-3 gap-8 text-center">
                  <StatCard number="10,000+" label={t('stats.users')} />
                  <StatCard number="500+" label={t('stats.companies')} />
                  <StatCard number="20+" label={t('stats.cities')} />
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => setCurrentPage('home')}
            >
              <span className="text-2xl text-red-600">🧭</span>
              <span className="text-2xl font-bold text-gray-800">CanStart</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => setCurrentPage('jobs')}
                className={`text-gray-600 hover:text-gray-900 ${
                  currentPage === 'jobs' ? 'text-red-600' : ''
                }`}
              >
                {t('nav.jobs')}
              </button>
              <button
                onClick={() => setCurrentPage('housing')}
                className={`text-gray-600 hover:text-gray-900 ${
                  currentPage === 'housing' ? 'text-red-600' : ''
                }`}
              >
                {t('nav.housing')}
              </button>
              <button
                onClick={() => setCurrentPage('support')}
                className={`text-gray-600 hover:text-gray-900 ${
                  currentPage === 'support' ? 'text-red-600' : ''
                }`}
              >
                {t('nav.support')}
              </button>
              <LanguageSwitch />
              {user ? (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors"
                >
                  {t('nav.profile')}
                </button>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors"
                >
                  {t('nav.getStarted')}
                </button>
              )}
            </div>

            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              <span className="sr-only">Menu</span>
              <div className="w-6 h-px bg-current mb-1"></div>
              <div className="w-6 h-px bg-current mb-1"></div>
              <div className="w-6 h-px bg-current"></div>
            </button>
          </div>

          {showMobileMenu && (
            <div className="md:hidden mt-4 space-y-4">
              <button
                onClick={() => {
                  setCurrentPage('jobs');
                  setShowMobileMenu(false);
                }}
                className="block w-full text-left text-gray-600 hover:text-gray-900"
              >
                {t('nav.jobs')}
              </button>
              <button
                onClick={() => {
                  setCurrentPage('housing');
                  setShowMobileMenu(false);
                }}
                className="block w-full text-left text-gray-600 hover:text-gray-900"
              >
                {t('nav.housing')}
              </button>
              <button
                onClick={() => {
                  setCurrentPage('support');
                  setShowMobileMenu(false);
                }}
                className="block w-full text-left text-gray-600 hover:text-gray-900"
              >
                {t('nav.support')}
              </button>
              <LanguageSwitch />
              <button
                onClick={() => {
                  setShowAuthModal(true);
                  setShowMobileMenu(false);
                }}
                className="w-full bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors"
              >
                {user ? t('nav.profile') : t('nav.getStarted')}
              </button>
            </div>
          )}
        </nav>
      </header>

      <main>
        {renderPage()}
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl text-red-500">🧭</span>
                <span className="text-2xl font-bold">CanStart</span>
              </div>
              <p className="text-gray-400">{t('footer.tagline')}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">{t('footer.services')}</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button
                    onClick={() => setCurrentPage('jobs')}
                    className="hover:text-white"
                  >
                    {t('nav.jobs')}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentPage('housing')}
                    className="hover:text-white"
                  >
                    {t('nav.housing')}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentPage('support')}
                    className="hover:text-white"
                  >
                    {t('nav.support')}
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">{t('footer.company')}</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#about" className="hover:text-white">{t('footer.about')}</a></li>
                <li><a href="#contact" className="hover:text-white">{t('footer.contact')}</a></li>
                <li><a href="#careers" className="hover:text-white">{t('footer.careers')}</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">{t('footer.legal')}</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#privacy" className="hover:text-white">{t('footer.privacy')}</a></li>
                <li><a href="#terms" className="hover:text-white">{t('footer.terms')}</a></li>
                <li><a href="#cookies" className="hover:text-white">{t('footer.cookies')}</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} CanStart. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}

function FeatureCard({ 
  title, 
  description, 
  image, 
  onClick 
}: { 
  title: string; 
  description: string; 
  image: string;
  onClick?: () => void;
}) {
  return (
    <div 
      className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="aspect-w-16 aspect-h-9 mb-6">
        <img
          src={image}
          alt={title}
          className="rounded-lg object-cover w-full h-48"
        />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="text-4xl font-bold text-red-600 mb-2">{number}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
}

export default App;