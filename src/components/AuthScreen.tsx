import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { GraduationCap, User, Users, Mail, Lock, ArrowRight, ArrowLeft, Globe } from 'lucide-react';
import { AnimatedDoor } from './AnimatedDoor';
import { useApp, t } from '../store';
import type { Role } from '../types';

export function AuthScreen() {
  const { language, dir, toggleLanguage, role, setRole, setIsAuthed, setUser } = useApp();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [doorOpen, setDoorOpen] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleAuth = () => {
    setDoorOpen(true);
    setTransitioning(true);

    const burstColor = role === 'student' ? '#3E7B4A' : '#D97706';
    setTimeout(() => {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#3E7B4A', '#D97706', '#C9A227', '#6FA079'],
        scalar: 0.8,
      });
    }, 600);

    setTimeout(() => {
      setUser({
        id: 'u1',
        name: name || (language === 'ar' ? 'أحمد' : 'Ahmed'),
        role,
        grade: language === 'ar' ? 'الصف الثالث الثانوي' : 'Grade 12',
        avatar: role === 'student' ? '🧑‍🎓' : '👨‍🏫',
      });
      setIsAuthed(true);
    }, 2500);
  };

  const toggleMode = () => {
    setDoorOpen(false);
    setMode((m) => (m === 'signin' ? 'signup' : 'signin'));
  };

  return (
    <div className="min-h-screen flex bg-cream-100 grain-overlay relative overflow-hidden">
      {/* Language toggle */}
      <button
        onClick={toggleLanguage}
        className="absolute top-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-cream-200/80 backdrop-blur-sm border border-cream-400/50 text-ink-700 hover:bg-cream-300/80 transition-all shadow-organic"
        style={{ [dir === 'rtl' ? 'left' : 'right']: 24 } as React.CSSProperties}
      >
        <Globe size={16} />
        <span className="text-sm font-semibold">{language === 'ar' ? 'EN' : 'ع'}</span>
      </button>

      {/* Visual door side */}
      <div
        className="hidden lg:flex flex-1 relative items-center justify-center"
        style={{
          background: 'linear-gradient(160deg, #0F3823 0%, #174B2E 40%, #1E5E3A 100%)',
        }}
      >
        {/* Soft noise/grain overlay */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E\")",
        }} />

        {/* Tree-line silhouettes */}
        <svg className="absolute bottom-0 w-full" height="200" viewBox="0 0 1200 200" preserveAspectRatio="none" fill="none">
          <path d="M0 200 L0 140 Q50 100 100 130 Q150 90 200 120 Q260 80 320 110 Q380 70 440 100 Q500 60 560 90 Q620 70 680 95 Q740 60 800 85 Q860 75 920 100 Q980 65 1040 90 Q1100 75 1160 100 L1200 110 L1200 200 Z" fill="#0A2A18" opacity="0.6" />
          <path d="M0 200 L0 160 Q60 130 120 150 Q200 120 280 145 Q360 115 440 140 Q520 110 600 135 Q680 115 760 140 Q840 120 920 145 Q1000 125 1080 150 Q1160 130 1200 145 L1200 200 Z" fill="#061D10" opacity="0.5" />
        </svg>

        <div className="relative z-10 w-full h-full flex items-center justify-center pt-8">
          <AnimatedDoor isOpen={doorOpen} mode={mode} />
        </div>

        {/* Tagline */}
        <motion.div
          className="absolute bottom-16 left-0 right-0 text-center z-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: transitioning ? 0 : 1, y: transitioning ? 30 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-cream-200/70 text-sm font-arabic tracking-wide">
            {language === 'ar' ? 'بوابة المعرفة تُفتح بالتعليم' : 'The Gateway of Knowledge Opens Through Learning'}
          </p>
        </motion.div>

        {/* Zoom transition overlay */}
        <AnimatePresence>
          {transitioning && (
            <motion.div
              className="absolute inset-0 z-30"
              style={{ background: 'linear-gradient(160deg, #0F3823 0%, #174B2E 40%, #1E5E3A 100%)' }}
              initial={{ clipPath: 'circle(0% at 50% 50%)', opacity: 0 }}
              animate={{ clipPath: 'circle(150% at 50% 50%)', opacity: 1 }}
              transition={{ duration: 1.5, ease: 'easeInOut', delay: 1 }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Form side */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-forest-500 to-forest-700 flex items-center justify-center shadow-organic">
              <GraduationCap className="text-cream-100" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-ink-800 font-arabic">
                {language === 'ar' ? 'منصة الإبداع التعليمية' : 'Creative Learning Platform'}
              </h1>
              <p className="text-xs text-ink-400">
                {language === 'ar' ? 'نظام إدارة التعلم والحضور' : 'LMS + Attendance System'}
              </p>
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-3xl font-bold text-ink-800 mb-2 font-arabic">
            {mode === 'signin'
              ? t('تسجيل الدخول', 'Sign In', language)
              : t('إنشاء حساب جديد', 'Create Account', language)}
          </h2>
          <p className="text-ink-400 text-sm mb-8 font-arabic">
            {mode === 'signin'
              ? t('ادخل بوابة المعرفة وابدأ رحلتك', 'Enter the gateway of knowledge and begin your journey', language)
              : t('انضم إلينا وافتح آفاقاً جديدة', 'Join us and open new horizons', language)}
          </p>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {([
              { key: 'student' as Role, labelAr: 'الطالب', labelEn: 'Student', icon: User },
              { key: 'teacher' as Role, labelAr: 'المدرس / الإدارة', labelEn: 'Teacher / Admin', icon: Users },
            ]).map((r) => (
              <button
                key={r.key}
                onClick={() => setRole(r.key)}
                className={`relative p-4 rounded-2xl border-2 transition-all overflow-hidden group ${
                  role === r.key
                    ? 'border-forest-500 bg-forest-50 shadow-organic'
                    : 'border-cream-400/60 bg-cream-50 hover:border-sage-300'
                }`}
              >
                {role === r.key && (
                  <motion.div
                    layoutId="role-bg"
                    className="absolute inset-0 bg-gradient-to-br from-forest-50 to-sage-50"
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}
                <div className="relative flex flex-col items-center gap-2">
                  <r.icon
                    size={24}
                    className={role === r.key ? 'text-forest-600' : 'text-ink-400'}
                  />
                  <span className={`text-sm font-semibold font-arabic ${role === r.key ? 'text-forest-700' : 'text-ink-500'}`}>
                    {language === 'ar' ? r.labelAr : r.labelEn}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Form fields */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {mode === 'signup' && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="relative">
                    <User className="absolute top-1/2 -translate-y-1/2 text-ink-300" size={18} style={{ [dir === 'rtl' ? 'right' : 'left']: 14 } as React.CSSProperties} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('الاسم الكامل', 'Full Name', language)}
                      className="w-full pl-11 pr-11 py-3.5 rounded-xl bg-cream-50 border-2 border-cream-400/60 text-ink-800 placeholder:text-ink-300 font-arabic focus:border-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-200 transition-all"
                      style={{ direction: dir }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Mail className="absolute top-1/2 -translate-y-1/2 text-ink-300" size={18} style={{ [dir === 'rtl' ? 'right' : 'left']: 14 } as React.CSSProperties} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('البريد الإلكتروني', 'Email', language)}
                className="w-full pl-11 pr-11 py-3.5 rounded-xl bg-cream-50 border-2 border-cream-400/60 text-ink-800 placeholder:text-ink-300 font-arabic focus:border-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-200 transition-all"
                style={{ direction: 'ltr', textAlign: dir === 'rtl' ? 'right' : 'left' }}
              />
            </div>

            <div className="relative">
              <Lock className="absolute top-1/2 -translate-y-1/2 text-ink-300" size={18} style={{ [dir === 'rtl' ? 'right' : 'left']: 14 } as React.CSSProperties} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('كلمة المرور', 'Password', language)}
                className="w-full pl-11 pr-11 py-3.5 rounded-xl bg-cream-50 border-2 border-cream-400/60 text-ink-800 placeholder:text-ink-300 font-arabic focus:border-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-200 transition-all"
                style={{ direction: 'ltr', textAlign: dir === 'rtl' ? 'right' : 'left' }}
                onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
              />
            </div>
          </div>

          {/* Submit button */}
          <motion.button
            onClick={handleAuth}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={transitioning}
            className="w-full mt-6 py-3.5 rounded-xl bg-gradient-to-br from-forest-500 to-forest-700 text-cream-100 font-bold font-arabic shadow-organic-lg flex items-center justify-center gap-2 disabled:opacity-70 transition-all"
          >
            {transitioning ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-cream-100/40 border-t-cream-100 rounded-full"
              />
            ) : (
              <>
                {mode === 'signin' ? t('ادخل البوابة', 'Enter Gateway', language) : t('انضم الآن', 'Join Now', language)}
                {dir === 'rtl' ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
              </>
            )}
          </motion.button>

          {/* Toggle mode */}
          <div className="text-center mt-6 font-arabic">
            <span className="text-ink-400 text-sm">
              {mode === 'signin'
                ? t('ليس لديك حساب؟', "Don't have an account?", language)
                : t('لديك حساب بالفعل؟', 'Already have an account?', language)}
            </span>
            <button
              onClick={toggleMode}
              className="mr-2 text-terracotta-600 hover:text-terracotta-700 text-sm font-bold transition-colors"
            >
              {mode === 'signin' ? t('أنشئ واحداً', 'Create one', language) : t('سجل دخول', 'Sign in', language)}
            </button>
          </div>
        </motion.div>

        {/* Mobile door mini visual */}
        <div
          className="lg:hidden absolute bottom-0 left-0 right-0 h-32 z-0"
          style={{ background: 'linear-gradient(180deg, transparent, #1E5E3A)' }}
        />
      </div>
    </div>
  );
}
