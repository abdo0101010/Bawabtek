import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Language, Direction, Role, User, ViewKey } from './types';

interface AppContextValue {
  language: Language;
  dir: Direction;
  toggleLanguage: () => void;
  role: Role;
  setRole: (r: Role) => void;
  user: User | null;
  setUser: (u: User | null) => void;
  currentView: ViewKey;
  setCurrentView: (v: ViewKey) => void;
  gradeThreshold: number;
  setGradeThreshold: (n: number) => void;
  isAuthed: boolean;
  setIsAuthed: (b: boolean) => void;
  showLanding: boolean;
  setShowLanding: (b: boolean) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ar');
  const [role, setRole] = useState<Role>('student');
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewKey>('dashboard');
  const [gradeThreshold, setGradeThreshold] = useState(70);
  const [isAuthed, setIsAuthed] = useState(false);
  const [showLanding, setShowLanding] = useState(true);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const dir: Direction = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <AppContext.Provider
      value={{
        language,
        dir,
        toggleLanguage,
        role,
        setRole,
        user,
        setUser,
        currentView,
        setCurrentView,
        gradeThreshold,
        setGradeThreshold,
        isAuthed,
        setIsAuthed,
        showLanding,
        setShowLanding,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export const t = (ar: string, en: string, lang: Language) => (lang === 'ar' ? ar : en);
