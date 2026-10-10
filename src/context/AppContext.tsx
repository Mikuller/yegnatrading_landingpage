import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Theme = 'light' | 'dark';
type Language = 'en' | 'am';

interface AppContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (en: string, am: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // 1. Theme state: Default is 'light' per user requirement
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('yegna_theme');
      if (stored === 'dark') return 'dark';
    }
    return 'light'; // Light is the explicit default
  });

  // 2. Language state: Default is 'en'
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('yegna_lang');
      if (stored === 'am') return 'am';
    }
    return 'en';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem('yegna_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('yegna_lang', lang);
  }, [lang]);

  const setTheme = (nextTheme: Theme) => {
    setThemeState(nextTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setLang = (nextLang: Language) => {
    setLangState(nextLang);
  };

  const toggleLanguage = () => {
    setLangState((prev) => (prev === 'en' ? 'am' : 'en'));
  };

  // Helper translator
  const t = (en: string, am: string) => (lang === 'am' ? am : en);

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        lang,
        setLang,
        toggleLanguage,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
