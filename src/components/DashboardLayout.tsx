import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  PlayCircle,
  FileText,
  ScanLine,
  BarChart3,
  Globe,
  LogOut,
  GraduationCap,
  Menu,
  X,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { useApp, t } from '../store';
import type { ViewKey, Role } from '../types';

interface NavItem {
  key: ViewKey;
  labelAr: string;
  labelEn: string;
  icon: typeof Home;
  roles: Role[];
}

const NAV_ITEMS: NavItem[] = [
  { key: 'dashboard', labelAr: 'الرئيسية', labelEn: 'Dashboard', icon: Home, roles: ['student', 'teacher'] },
  { key: 'study', labelAr: 'المشاهدة والمذاكرة', labelEn: 'Study Hub', icon: PlayCircle, roles: ['student'] },
  { key: 'assignments', labelAr: 'الواجبات', labelEn: 'Assignments', icon: FileText, roles: ['student'] },
  { key: 'attendance', labelAr: 'الحضور والباركود', labelEn: 'Attendance & QR', icon: ScanLine, roles: ['teacher', 'student'] },
  { key: 'reports', labelAr: 'التقارير والتنبيهات', labelEn: 'Reports & Alerts', icon: BarChart3, roles: ['student', 'teacher'] },
];

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { language, dir, toggleLanguage, currentView, setCurrentView, user, role, setIsAuthed } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(role));

  const handleNav = (key: ViewKey) => {
    setCurrentView(key);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    setIsAuthed(false);
  };

  const SidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 flex items-center gap-3 border-b border-forest-800/40">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sage-300 to-forest-500 flex items-center justify-center shadow-lg">
          <GraduationCap className="text-cream-100" size={22} />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-bold text-cream-100 font-arabic truncate">
            {language === 'ar' ? 'منصة الإبداع' : 'Creative LMS'}
          </h1>
          <p className="text-[11px] text-cream-200/50 font-arabic">
            {language === 'ar' ? 'تعليم وإدارة حضور' : 'Learning + Attendance'}
          </p>
        </div>
      </div>

      {/* User card */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-forest-800/40 border border-forest-700/30">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-terracotta-400 to-terracotta-600 flex items-center justify-center text-lg shadow-md">
            {user?.avatar || '🧑‍🎓'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-cream-100 font-arabic truncate">{user?.name}</p>
            <p className="text-[11px] text-cream-200/50 font-arabic truncate">
              {role === 'student' ? (language === 'ar' ? 'طالب' : 'Student') : (language === 'ar' ? 'مدرس / إدارة' : 'Teacher / Admin')}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 overflow-y-auto scrollbar-thin">
        <p className="px-3 py-2 text-[11px] uppercase tracking-wider text-cream-200/40 font-bold">
          {language === 'ar' ? 'القائمة' : 'Menu'}
        </p>
        {visibleItems.map((item) => {
          const active = currentView === item.key;
          return (
            <button
              key={item.key}
              onClick={() => handleNav(item.key)}
              className={`relative w-full flex items-center gap-3 px-3 py-3 rounded-xl mb-1 transition-all group ${
                active ? 'text-cream-100' : 'text-cream-200/60 hover:text-cream-100 hover:bg-forest-800/30'
              }`}
            >
              {active && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-xl bg-gradient-to-br from-sage-400/30 to-forest-500/20 border border-sage-300/20"
                  transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                />
              )}
              <div className="relative z-10 flex items-center gap-3 w-full">
                <item.icon size={20} className={active ? 'text-sage-200' : ''} />
                <span className="text-sm font-semibold font-arabic text-start">
                  {language === 'ar' ? item.labelAr : item.labelEn}
                </span>
                {active && (
                  <motion.div
                    className={`w-1.5 h-1.5 rounded-full bg-sage-300 ${dir === 'rtl' ? 'mr-auto' : 'ml-auto'}`}
                    layoutId="nav-dot"
                  />
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer actions */}
      <div className="px-4 py-4 border-t border-forest-800/40 space-y-2">
        <button
          onClick={toggleLanguage}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-cream-200/60 hover:text-cream-100 hover:bg-forest-800/30 transition-all"
        >
          <Globe size={18} />
          <span className="text-sm font-semibold font-arabic">
            {language === 'ar' ? 'English' : 'العربية'}
          </span>
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-terracotta-300/70 hover:text-terracotta-300 hover:bg-terracotta-600/10 transition-all"
        >
          <LogOut size={18} />
          <span className="text-sm font-semibold font-arabic">
            {language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
          </span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream-100 flex" style={{ direction: dir }}>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col w-72 shrink-0 sticky top-0 h-screen z-30"
        style={{ background: 'linear-gradient(180deg, #0F3823 0%, #174B2E 50%, #0A2A18 100%)' }}
      >
        {SidebarContent}
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-ink-900/50 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="fixed top-0 bottom-0 w-72 z-50 lg:hidden"
              style={{
                background: 'linear-gradient(180deg, #0F3823 0%, #174B2E 50%, #0A2A18 100%)',
                [dir === 'rtl' ? 'right' : 'left']: 0,
              }}
              initial={{ x: dir === 'rtl' ? 300 : -300 }}
              animate={{ x: 0 }}
              exit={{ x: dir === 'rtl' ? 300 : -300 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 z-10 p-2 rounded-lg text-cream-200/60 hover:text-cream-100"
                style={{ [dir === 'rtl' ? 'left' : 'right']: 12 } as React.CSSProperties}
              >
                <X size={20} />
              </button>
              {SidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-20 flex items-center gap-3 px-4 py-3 bg-cream-50 border-b border-cream-300 shadow-sm">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg bg-cream-200 text-ink-700 hover:bg-cream-300 transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-forest-500 to-forest-700 flex items-center justify-center">
              <GraduationCap className="text-cream-100" size={16} />
            </div>
            <span className="font-bold text-ink-800 font-arabic text-sm">
              {language === 'ar' ? 'منصة الإبداع' : 'Creative LMS'}
            </span>
          </div>
          <div className="mr-auto w-9 h-9 rounded-full bg-gradient-to-br from-terracotta-400 to-terracotta-600 flex items-center justify-center text-base shadow-md">
            {user?.avatar || '🧑‍🎓'}
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto scrollbar-thin grain-overlay">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export { NAV_ITEMS };
