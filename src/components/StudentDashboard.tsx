import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  PlayCircle,
  MapPin,
  Monitor,
  ShoppingCart,
  CheckCircle2,
  Clock,
  TrendingUp,
  Award,
  Calendar,
  X,
  Download,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BarChart3,
} from 'lucide-react';
import { useApp, t } from '../store';
import { MOCK_COURSES } from '../mockData';
import type { Course } from '../types';

export function StudentDashboard() {
  const { language, dir, user, setCurrentView } = useApp();
  const [courses, setCourses] = useState(MOCK_COURSES);
  const [buyModalCourse, setBuyModalCourse] = useState<Course | null>(null);
  const [whatsappModal, setWhatsappModal] = useState(false);

  const purchasedCourses = courses.filter((c) => c.purchased);
  const avgProgress = Math.round(
    purchasedCourses.reduce((sum, c) => sum + c.progress, 0) / Math.max(purchasedCourses.length, 1)
  );

  const handlePurchase = (course: Course, type: 'online' | 'offline') => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === course.id
          ? { ...c, purchased: true, type }
          : c
      )
    );
    setBuyModalCourse(null);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3E7B4A', '#D97706', '#C9A227', '#6FA079'],
    });

    if (type === 'offline') {
      setTimeout(() => setWhatsappModal(true), 600);
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Welcome banner */}
      <motion.div
        className="relative rounded-3xl overflow-hidden mb-6 p-6 lg:p-8 shadow-organic-lg"
        style={{ background: 'linear-gradient(135deg, #0F3823 0%, #1E5E3A 60%, #3E7B4A 100%)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
        }} />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <motion.p
              className="text-sage-200/70 text-sm font-arabic mb-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {t('أهلاً بك', 'Welcome', language)}
            </motion.p>
            <motion.h1
              className="text-2xl lg:text-3xl font-bold text-cream-100 font-arabic"
              initial={{ opacity: 0, x: dir === 'rtl' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {user?.name} 👋
            </motion.h1>
            <motion.div
              className="flex items-center gap-2 mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream-100/10 backdrop-blur-sm border border-cream-100/20 text-cream-100 text-xs font-arabic">
                <Calendar size={12} />
                {user?.grade}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-terracotta-500/20 backdrop-blur-sm border border-terracotta-400/30 text-terracotta-200 text-xs font-arabic">
                <Sparkles size={12} />
                {t('الفصل الدراسي الأول', 'Term 1', language)}
              </span>
            </motion.div>
          </div>

          {/* Mini stats */}
          <div className="flex gap-3">
            {[
              { icon: PlayCircle, labelAr: 'كورسات', labelEn: 'Courses', value: purchasedCourses.length, color: 'sage' },
              { icon: TrendingUp, labelAr: 'التقدم', labelEn: 'Progress', value: `${avgProgress}%`, color: 'terracotta' },
              { icon: Award, labelAr: 'المعدل', labelEn: 'Avg Score', value: '85%', color: 'gold' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="bg-cream-100/10 backdrop-blur-sm rounded-2xl p-3 lg:p-4 border border-cream-100/15 text-center min-w-[70px] lg:min-w-[90px]"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                whileHover={{ y: -3 }}
              >
                <stat.icon className="text-cream-100/80 mx-auto mb-1" size={18} />
                <p className="text-cream-100 font-bold text-lg">{stat.value}</p>
                <p className="text-cream-200/50 text-[10px] font-arabic">
                  {language === 'ar' ? stat.labelAr : stat.labelEn}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Decorative leaves */}
        <motion.div
          className="absolute -bottom-4 opacity-10"
          style={{ [dir === 'rtl' ? 'left' : 'right']: -20 } as React.CSSProperties}
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        >
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <path d="M60 100 Q30 70 40 40 Q55 15 60 10 Q65 15 80 40 Q90 70 60 100" fill="#C9E0CD" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-ink-800 font-arabic flex items-center gap-2">
          <PlayCircle className="text-forest-500" size={22} />
          {t('كورساتي', 'My Courses', language)}
        </h2>
        <button
          onClick={() => setCurrentView('study')}
          className="flex items-center gap-1 text-sm font-semibold text-forest-600 hover:text-forest-700 font-arabic transition-colors"
        >
          {t('كل الدروس', 'All Lessons', language)}
          {dir === 'rtl' ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      {/* Courses grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
        <AnimatePresence>
          {courses.map((course, i) => (
            <CourseCard
              key={course.id}
              course={course}
              index={i}
              dir={dir}
              language={language}
              onBuy={() => setBuyModalCourse(course)}
              onStudy={() => setCurrentView('study')}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Buy Course Modal */}
      <BuyCourseModal
        course={buyModalCourse}
        onClose={() => setBuyModalCourse(null)}
        onPurchase={handlePurchase}
        language={language}
        dir={dir}
      />

      {/* WhatsApp Barcode Modal */}
      <WhatsappBarcodeModal
        open={whatsappModal}
        onClose={() => setWhatsappModal(false)}
        language={language}
        dir={dir}
      />
    </div>
  );
}

function CourseCard({
  course,
  index,
  dir,
  language,
  onBuy,
  onStudy,
}: {
  course: Course;
  index: number;
  dir: string;
  language: 'ar' | 'en';
  onBuy: () => void;
  onStudy: () => void;
}) {
  const colorMap: Record<string, string> = {
    forest: 'from-forest-400 to-forest-600',
    terracotta: 'from-terracotta-400 to-terracotta-600',
    sage: 'from-sage-300 to-sage-500',
    gold: 'from-gold-400 to-terracotta-500',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 200, damping: 20 }}
      whileHover={{ y: -8 }}
      className="group relative bg-cream-50 rounded-2xl overflow-hidden shadow-organic hover:shadow-organic-lg transition-shadow cursor-pointer"
      onClick={course.purchased ? onStudy : onBuy}
    >
      {/* Card header with gradient */}
      <div className={`relative h-28 bg-gradient-to-br ${colorMap[course.color]} overflow-hidden`}>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")",
        }} />
        <div className="absolute top-3 flex items-center gap-2" style={{ [dir === 'rtl' ? 'right' : 'left']: 12 } as React.CSSProperties}>
          <span className="text-3xl">{course.emoji}</span>
        </div>
        <div className="absolute top-3 flex items-center gap-1.5" style={{ [dir === 'rtl' ? 'left' : 'right']: 12 } as React.CSSProperties}>
          {course.type === 'offline' ? (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-cream-100/90 backdrop-blur-sm text-forest-700 text-[10px] font-bold font-arabic shadow-sm">
              <MapPin size={10} />
              {t('حضور أوفلاين', 'Offline', language)} 📍
            </span>
          ) : (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-cream-100/90 backdrop-blur-sm text-terracotta-700 text-[10px] font-bold font-arabic shadow-sm">
              <Monitor size={10} />
              {t('مسجل / أونلاين', 'Online', language)} 💻
            </span>
          )}
        </div>
        {/* Progress bar overlay */}
        {course.purchased && course.progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-cream-100/20">
            <motion.div
              className="h-full bg-cream-100 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${course.progress}%` }}
              transition={{ delay: index * 0.08 + 0.3, duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-4">
        <h3 className="font-bold text-ink-800 font-arabic mb-1 text-base">{course.title}</h3>
        <p className="text-xs text-ink-400 font-arabic mb-3">{course.teacher}</p>

        <div className="flex items-center gap-3 text-xs text-ink-400 font-arabic mb-4">
          <span className="flex items-center gap-1">
            <PlayCircle size={13} />
            {course.lessons} {t('درس', 'lessons', language)}
          </span>
          {course.purchased && (
            <span className="flex items-center gap-1 text-forest-600">
              <TrendingUp size={13} />
              {course.progress}%
            </span>
          )}
        </div>

        {course.purchased ? (
          <button
            onClick={(e) => { e.stopPropagation(); onStudy(); }}
            className="w-full py-2.5 rounded-xl bg-forest-50 text-forest-700 font-bold text-sm font-arabic hover:bg-forest-100 transition-colors flex items-center justify-center gap-2 border border-forest-200"
          >
            <PlayCircle size={16} />
            {t('ابدأ المذاكرة', 'Start Studying', language)}
          </button>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); onBuy(); }}
            className="w-full py-2.5 rounded-xl bg-gradient-to-br from-terracotta-500 to-terracotta-600 text-cream-100 font-bold text-sm font-arabic hover:shadow-warm transition-all flex items-center justify-center gap-2"
          >
            <ShoppingCart size={16} />
            {t('شراء الكورس', 'Buy Course', language)}
            <span className="text-xs opacity-80">{course.price} {t('ريال', 'SAR', language)}</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}

function BuyCourseModal({
  course,
  onClose,
  onPurchase,
  language,
  dir,
}: {
  course: Course | null;
  onClose: () => void;
  onPurchase: (course: Course, type: 'online' | 'offline') => void;
  language: 'ar' | 'en';
  dir: string;
}) {
  const [step, setStep] = useState<'choose' | 'payment' | 'processing'>('choose');

  const handleClose = () => {
    setStep('choose');
    onClose();
  };

  const handleChoose = (type: 'online' | 'offline') => {
    setStep('payment');
  };

  const handlePay = (type: 'online' | 'offline') => {
    setStep('processing');
    setTimeout(() => {
      if (course) onPurchase(course, type);
      setStep('choose');
    }, 1800);
  };

  return (
    <AnimatePresence>
      {course && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm" onClick={handleClose} />

          <motion.div
            className="relative bg-cream-50 rounded-3xl shadow-organic-xl max-w-md w-full overflow-hidden"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className="relative p-5 bg-gradient-to-br from-forest-500 to-forest-700">
              <button
                onClick={handleClose}
                className="absolute top-4 p-1.5 rounded-lg bg-cream-100/15 text-cream-100 hover:bg-cream-100/25"
                style={{ [dir === 'rtl' ? 'left' : 'right']: 16 } as React.CSSProperties}
              >
                <X size={18} />
              </button>
              <span className="text-3xl mb-2 block">{course.emoji}</span>
              <h3 className="text-lg font-bold text-cream-100 font-arabic">{course.title}</h3>
              <p className="text-cream-200/60 text-xs font-arabic">{course.teacher}</p>
              <p className="text-terracotta-200 text-2xl font-bold mt-2">{course.price} {t('ريال', 'SAR', language)}</p>
            </div>

            <div className="p-5">
              {step === 'choose' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                  <p className="text-sm font-bold text-ink-700 font-arabic mb-3">
                    {t('اختر نوع الاشتراك', 'Choose Subscription Type', language)}
                  </p>
                  <button
                    onClick={() => handleChoose('online')}
                    className="w-full p-4 rounded-2xl border-2 border-cream-400/60 hover:border-terracotta-400 transition-all text-start group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-terracotta-50 flex items-center justify-center">
                        <Monitor className="text-terracotta-600" size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-ink-800 font-arabic text-sm">{t('أونلاين', 'Online', language)} 💻</p>
                        <p className="text-xs text-ink-400 font-arabic">{t('وصول لفيديوهات مسجلة فوراً', 'Instant access to recorded videos', language)}</p>
                      </div>
                      {dir === 'rtl' ? <ChevronLeft className="text-ink-300 group-hover:text-terracotta-500" size={18} /> : <ChevronRight className="text-ink-300 group-hover:text-terracotta-500" size={18} />}
                    </div>
                  </button>
                  <button
                    onClick={() => handleChoose('offline')}
                    className="w-full p-4 rounded-2xl border-2 border-cream-400/60 hover:border-forest-400 transition-all text-start group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-forest-50 flex items-center justify-center">
                        <MapPin className="text-forest-600" size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-ink-800 font-arabic text-sm">{t('حضوري (أوفلاين)', 'In-Person (Offline)', language)} 📍</p>
                        <p className="text-xs text-ink-400 font-arabic">{t('احصل على باركود غياب موحد لكل الحصص', 'Get unified attendance barcode for all classes', language)}</p>
                      </div>
                      {dir === 'rtl' ? <ChevronLeft className="text-ink-300 group-hover:text-forest-500" size={18} /> : <ChevronRight className="text-ink-300 group-hover:text-forest-500" size={18} />}
                    </div>
                  </button>
                </motion.div>
              )}

              {step === 'payment' && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div className="bg-cream-100 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-arabic text-ink-500">{t('المنتج', 'Product', language)}</span>
                      <span className="text-sm font-arabic font-bold text-ink-800">{course.title}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-arabic text-ink-500">{t('السعر', 'Price', language)}</span>
                      <span className="text-sm font-arabic font-bold text-ink-800">{course.price} {t('ريال', 'SAR', language)}</span>
                    </div>
                    <div className="border-t border-cream-300 pt-2 flex items-center justify-between">
                      <span className="text-sm font-arabic font-bold text-ink-700">{t('الإجمالي', 'Total', language)}</span>
                      <span className="text-lg font-bold text-terracotta-600">{course.price} {t('ريال', 'SAR', language)}</span>
                    </div>
                  </div>

                  {/* Simulated payment method */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-ink-500 font-arabic">{t('طريقة الدفع (محاكاة)', 'Payment Method (Simulated)', language)}</p>
                    <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-forest-300 bg-forest-50">
                      <div className="w-8 h-6 rounded bg-gradient-to-br from-gold-400 to-gold-600" />
                      <span className="text-sm font-arabic text-ink-700 font-semibold">mada / Visa / Mastercard</span>
                      <CheckCircle2 className="text-forest-600 mr-auto" size={18} />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep('choose')}
                      className="px-4 py-2.5 rounded-xl bg-cream-200 text-ink-600 font-arabic font-semibold text-sm hover:bg-cream-300 transition-colors"
                    >
                      {t('رجوع', 'Back', language)}
                    </button>
                    <button
                      onClick={() => handlePay('online')}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-br from-forest-500 to-forest-700 text-cream-100 font-bold text-sm font-arabic hover:shadow-organic-lg transition-all"
                    >
                      {t('دفع والمتابعة', 'Pay & Continue', language)}
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 'processing' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center py-12"
                >
                  <motion.div
                    className="w-16 h-16 border-3 border-forest-200 border-t-forest-600 rounded-full mb-4"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  <p className="text-sm font-arabic text-ink-500 font-semibold">
                    {t('جاري معالجة الدفع...', 'Processing payment...', language)}
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function WhatsappBarcodeModal({
  open,
  onClose,
  language,
  dir,
}: {
  open: boolean;
  onClose: () => void;
  language: 'ar' | 'en';
  dir: string;
}) {
  const barcodeId = 'STD-2026-AHMED-001';
  const phoneNumber = '+966 5X XXX XXXX';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            className="relative bg-cream-50 rounded-3xl shadow-organic-xl max-w-md w-full overflow-hidden"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* WhatsApp-style header */}
            <div className="relative p-5" style={{ background: 'linear-gradient(135deg, #075E54 0%, #128C7E 100%)' }}>
              <button
                onClick={onClose}
                className="absolute top-4 p-1.5 rounded-lg bg-cream-100/15 text-cream-100 hover:bg-cream-100/25"
                style={{ [dir === 'rtl' ? 'left' : 'right']: 16 } as React.CSSProperties}
              >
                <X size={18} />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cream-100/20 flex items-center justify-center">
                  <MessageCircle className="text-cream-100" size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-cream-100 font-arabic">WhatsApp</h3>
                  <p className="text-cream-200/60 text-[11px] font-arabic">{t('إشعار تلقائي عبر n8n', 'Auto notification via n8n', language)}</p>
                </div>
              </div>
            </div>

            {/* WhatsApp chat mockup */}
            <div className="p-5" style={{ background: '#ECE5DD' }}>
              {/* Chat bubble */}
              <motion.div
                className="bg-[#DCF8C6] rounded-2xl p-4 shadow-sm mb-3"
                style={{ [dir === 'rtl' ? 'marginRight' : 'marginLeft']: 'auto', maxWidth: '85%' } as React.CSSProperties}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-sm text-ink-800 font-arabic mb-3 font-semibold">
                  {t('تم تسجيلك! إليك باركود غيابك 🎉', 'Registration successful! Here is your attendance barcode 🎉', language)}
                </p>

                {/* Barcode mock */}
                <div className="bg-white rounded-xl p-4 flex flex-col items-center gap-3">
                  <div className="flex items-end gap-0.5 h-16">
                    {[3, 1, 2, 1, 4, 1, 1, 2, 3, 1, 2, 1, 3, 2, 1, 4, 1, 2, 1, 3, 2, 1, 1, 3, 4, 1, 2, 1, 3, 1].map((w, i) => (
                      <div
                        key={i}
                        className={i % 2 === 0 ? 'bg-ink-800' : 'bg-transparent'}
                        style={{ width: `${w * 2}px`, height: '100%' }}
                      />
                    ))}
                  </div>
                  <p className="text-xs font-mono text-ink-700 font-bold tracking-wider">{barcodeId}</p>
                  <p className="text-[10px] text-ink-400 font-arabic text-center">
                    {t('هذا الباركود موحد لجميع الحصص الأوفلاين', 'This barcode is unified for all offline classes', language)}
                  </p>
                </div>

                <p className="text-[10px] text-ink-400 mt-2 font-arabic text-end">
                  {t('هل تم تسليمه؟ ✅', 'Delivered ✅', language)} • 10:42 AM
                </p>
              </motion.div>

              {/* Phone number */}
              <div className="flex items-center gap-2 text-xs text-ink-500 font-arabic">
                <MessageCircle size={14} className="text-sage-400" />
                <span>{t('تم الإرسال إلى', 'Sent to', language)}: {phoneNumber}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <button
                  className="flex-1 py-2.5 rounded-xl bg-forest-50 text-forest-700 font-bold text-xs font-arabic hover:bg-forest-100 transition-colors flex items-center justify-center gap-2 border border-forest-200"
                  onClick={() => {
                    const canvas = document.createElement('canvas');
                    canvas.width = 300;
                    canvas.height = 100;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                      ctx.fillStyle = '#fff';
                      ctx.fillRect(0, 0, 300, 100);
                      ctx.fillStyle = '#111827';
                      const bars = [3, 1, 2, 1, 4, 1, 1, 2, 3, 1, 2, 1, 3, 2, 1, 4, 1, 2, 1, 3, 2, 1, 1, 3, 4, 1, 2, 1, 3, 1];
                      let x = 10;
                      bars.forEach((w, i) => {
                        if (i % 2 === 0) {
                          ctx.fillRect(x, 10, w * 4, 60);
                        }
                        x += w * 4;
                      });
                      const link = document.createElement('a');
                      link.download = `barcode-${barcodeId}.png`;
                      link.href = canvas.toDataURL();
                      link.click();
                    }
                  }}
                >
                  <Download size={14} />
                  {t('تحميل الباركود', 'Download Barcode', language)}
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-br from-forest-500 to-forest-700 text-cream-100 font-bold text-xs font-arabic hover:shadow-organic-lg transition-all"
                >
                  {t('تم، شكراً!', 'Done, thanks!', language)}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
