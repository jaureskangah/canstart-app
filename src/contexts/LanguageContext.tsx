import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'fr';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const translations = {
  en: {
    // Navigation
    'nav.jobs': 'Jobs',
    'nav.housing': 'Housing',
    'nav.support': 'Support',
    'nav.getStarted': 'Get Started',
    'nav.profile': 'Profile',
    'nav.signOut': 'Sign Out',

    // Hero Section
    'hero.title': 'Start Your New Life in Canada with Confidence',
    'hero.subtitle': 'Your all-in-one platform for finding jobs, housing, and guidance for a smooth transition to Canadian life.',
    'hero.getStarted': 'Get Started',
    'hero.learnMore': 'Learn More',

    // Features
    'features.title': 'Everything You Need to Start Fresh',
    'features.jobSearch.title': 'Job Search',
    'features.jobSearch.description': 'Find the perfect job matching your skills and experience.',
    'features.housing.title': 'Housing Solutions',
    'features.housing.description': 'Discover affordable housing options that suit your needs.',
    'features.admin.title': 'Administrative Support',
    'features.admin.description': 'Get guidance on documentation and legal requirements.',

    // Jobs Page
    'jobs.title': 'Find Your Dream Job',
    'jobs.subtitle': 'Browse through thousands of opportunities across Canada',
    'jobs.searchPlaceholder': 'Search jobs by title, company, or keywords',
    'jobs.filters': 'Filters',
    'jobs.search': 'Search',
    'jobs.loading': 'Loading jobs...',
    'jobs.noResults': 'No jobs found',
    'jobs.location': 'Location',
    'jobs.type': 'Job Type',
    'jobs.experience': 'Experience',
    'jobs.salary': 'Salary Range',
    'jobs.savedJobs': 'Saved Jobs',
    'jobs.apply': 'Apply Now',
    'jobs.save': 'Save Job',
    'jobs.posted': 'Posted',

    // Housing Page
    'housing.title': 'Find Your Perfect Home',
    'housing.subtitle': 'Discover properties that match your lifestyle',
    'housing.searchPlaceholder': 'Search by city, neighborhood, or address',
    'housing.filters': 'Filters',
    'housing.search': 'Search',
    'housing.loading': 'Loading properties...',
    'housing.noResults': 'No properties found',
    'housing.price': 'Price',
    'housing.beds': 'Bedrooms',
    'housing.baths': 'Bathrooms',
    'housing.type': 'Property Type',
    'housing.savedProperties': 'Saved Properties',
    'housing.contact': 'Contact Agent',
    'housing.save': 'Save Property',
    'housing.viewDetails': 'View Details',

    // Support Page
    'support.title': 'Administrative Guide',
    'support.subtitle': 'Everything you need to know about settling in Canada',
    'support.documents': 'Required Documents',
    'support.timeline': 'Timeline',
    'support.tips': 'Tips & Advice',
    'support.help': 'Need Help?',
    'support.contact': 'Contact Support',

    // Auth
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.name': 'Full Name',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.googleSignIn': 'Continue with Google',
    'auth.alreadyAccount': 'Already have an account?',
    'auth.noAccount': "Don't have an account?",

    // Stats
    'stats.users': 'Happy Users',
    'stats.companies': 'Partner Companies',
    'stats.cities': 'Cities Covered',

    // Footer
    'footer.tagline': 'Making your transition to Canada smooth and successful.',
    'footer.services': 'Services',
    'footer.company': 'Company',
    'footer.legal': 'Legal',
    'footer.about': 'About Us',
    'footer.careers': 'Careers',
    'footer.contact': 'Contact',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.cookies': 'Cookie Policy'
  },
  fr: {
    // Navigation
    'nav.jobs': 'Emplois',
    'nav.housing': 'Logement',
    'nav.support': 'Assistance',
    'nav.getStarted': 'Commencer',
    'nav.profile': 'Profil',
    'nav.signOut': 'Déconnexion',

    // Hero Section
    'hero.title': 'Commencez votre nouvelle vie au Canada en toute confiance',
    'hero.subtitle': 'Votre plateforme tout-en-un pour trouver un emploi, un logement et des conseils pour une transition en douceur.',
    'hero.getStarted': 'Commencer',
    'hero.learnMore': 'En savoir plus',

    // Features
    'features.title': 'Tout ce dont vous avez besoin pour un nouveau départ',
    'features.jobSearch.title': 'Recherche d\'emploi',
    'features.jobSearch.description': 'Trouvez l\'emploi parfait correspondant à vos compétences.',
    'features.housing.title': 'Solutions de logement',
    'features.housing.description': 'Découvrez des options de logement adaptées à vos besoins.',
    'features.admin.title': 'Support administratif',
    'features.admin.description': 'Obtenez des conseils sur la documentation et les exigences légales.',

    // Jobs Page
    'jobs.title': 'Trouvez l\'emploi de vos rêves',
    'jobs.subtitle': 'Parcourez des milliers d\'opportunités à travers le Canada',
    'jobs.searchPlaceholder': 'Rechercher par titre, entreprise ou mots-clés',
    'jobs.filters': 'Filtres',
    'jobs.search': 'Rechercher',
    'jobs.loading': 'Chargement des emplois...',
    'jobs.noResults': 'Aucun emploi trouvé',
    'jobs.location': 'Lieu',
    'jobs.type': 'Type d\'emploi',
    'jobs.experience': 'Expérience',
    'jobs.salary': 'Fourchette de salaire',
    'jobs.savedJobs': 'Emplois sauvegardés',
    'jobs.apply': 'Postuler',
    'jobs.save': 'Sauvegarder',
    'jobs.posted': 'Publié le',

    // Housing Page
    'housing.title': 'Trouvez votre maison idéale',
    'housing.subtitle': 'Découvrez des propriétés qui correspondent à votre style de vie',
    'housing.searchPlaceholder': 'Rechercher par ville, quartier ou adresse',
    'housing.filters': 'Filtres',
    'housing.search': 'Rechercher',
    'housing.loading': 'Chargement des propriétés...',
    'housing.noResults': 'Aucune propriété trouvée',
    'housing.price': 'Prix',
    'housing.beds': 'Chambres',
    'housing.baths': 'Salles de bain',
    'housing.type': 'Type de propriété',
    'housing.savedProperties': 'Propriétés sauvegardées',
    'housing.contact': 'Contacter l\'agent',
    'housing.save': 'Sauvegarder',
    'housing.viewDetails': 'Voir les détails',

    // Support Page
    'support.title': 'Guide administratif',
    'support.subtitle': 'Tout ce que vous devez savoir pour vous installer au Canada',
    'support.documents': 'Documents requis',
    'support.timeline': 'Calendrier',
    'support.tips': 'Conseils',
    'support.help': 'Besoin d\'aide ?',
    'support.contact': 'Contacter le support',

    // Auth
    'auth.signIn': 'Connexion',
    'auth.signUp': 'Inscription',
    'auth.email': 'Email',
    'auth.password': 'Mot de passe',
    'auth.name': 'Nom complet',
    'auth.forgotPassword': 'Mot de passe oublié ?',
    'auth.googleSignIn': 'Continuer avec Google',
    'auth.alreadyAccount': 'Déjà un compte ?',
    'auth.noAccount': 'Pas encore de compte ?',

    // Stats
    'stats.users': 'Utilisateurs satisfaits',
    'stats.companies': 'Entreprises partenaires',
    'stats.cities': 'Villes couvertes',

    // Footer
    'footer.tagline': 'Facilitons votre transition au Canada.',
    'footer.services': 'Services',
    'footer.company': 'Entreprise',
    'footer.legal': 'Mentions légales',
    'footer.about': 'À propos',
    'footer.careers': 'Carrières',
    'footer.contact': 'Contact',
    'footer.privacy': 'Politique de confidentialité',
    'footer.terms': 'Conditions d\'utilisation',
    'footer.cookies': 'Politique des cookies'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}