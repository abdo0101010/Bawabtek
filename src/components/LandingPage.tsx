import { useRef, useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  AnimatePresence,
  type MotionValue,
} from 'framer-motion';
import {
  GraduationCap,
  ArrowLeft,
  ArrowRight,
  Globe,
  Monitor,
  ScanLine,
  BarChart3,
  Sparkles,
  DoorOpen,
  BookOpen,
  Award,
  Users,
  Quote,
  Star,
} from 'lucide-react';
import { useApp, t } from '../store';

const TEACHER_IMAGE = 'https://images.pexels.com/photos/5212321/pexels-photo-5212321.jpeg?auto=compress&cs=tinysrgb&h=900&w=600';

export function LandingPage() {
  const { language, dir, toggleLanguage, setShowLanding } = useApp();
  const [doorPhase, setDoorPhase] = useState<'idle' | 'hovering' | 'opening' | 'transitioning'>('idle');
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress, scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 150]);
  const heroScale = useTransform(scrollY, [0, 600], [1, 0.92]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.3]);
  const bgY = useTransform(scrollY, [0, 800], [0, 200]);
  const featuresY = useTransform(scrollY, [400, 1200], [50, -50]);

  const handleDoorClick = () => {
    setDoorPhase('opening');
    setTimeout(() => setDoorPhase('transitioning'), 1200);
    setTimeout(() => {
      setShowLanding(false);
    }, 2800);
  };

  const isRTL = dir === 'rtl';

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-cream-100 relative overflow-x-hidden"
      style={{ direction: dir }}
    >
      {/* Language toggle */}
      <button
        onClick={toggleLanguage}
        className="fixed top-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-cream-50/90 backdrop-blur-md border border-cream-400/50 text-ink-700 hover:bg-cream-100 transition-all shadow-organic"
        style={{ [isRTL ? 'left' : 'right']: 24 } as React.CSSProperties}
      >
        <Globe size={16} />
        <span className="text-sm font-semibold">{language === 'ar' ? 'EN' : 'ع'}</span>
      </button>

      {/* ===== NAV BAR ===== */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-40 px-6 lg:px-12 py-4"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-11 h-11 rounded-2xl bg-gradient-to-br from-forest-500 to-forest-700 flex items-center justify-center shadow-organic"
              whileHover={{ scale: 1.08, rotate: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              <GraduationCap className="text-cream-100" size={22} />
            </motion.div>
            <div>
              <h1 className="text-base font-bold text-ink-800 font-arabic">
                {language === 'ar' ? 'منصة الإبداع' : 'Creative LMS'}
              </h1>
              <p className="text-[10px] text-ink-400 font-arabic">
                {language === 'ar' ? 'تعليم ذكي وحضور رقمي' : 'Smart Learning & Digital Attendance'}
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {[
              { ar: 'الرئيسية', en: 'Home', id: 'hero' },
              { ar: 'المميزات', en: 'Features', id: 'features' },
              { ar: 'البوابة', en: 'Gateway', id: 'doorway' },
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' })}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-ink-500 hover:text-forest-600 font-arabic transition-colors"
              >
                {language === 'ar' ? link.ar : link.en}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowLanding(false)}
            className="px-5 py-2 rounded-xl bg-gradient-to-br from-forest-500 to-forest-700 text-cream-100 text-sm font-bold font-arabic shadow-organic hover:shadow-organic-lg transition-all"
          >
            {t('تسجيل الدخول', 'Sign In', language)}
          </button>
        </div>
      </motion.nav>

      {/* ===== HERO SECTION ===== */}
      <section id="hero" className="relative min-h-screen flex items-center pt-20 pb-12 px-6 lg:px-12">
        {/* Parallax background elements */}
        <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
          {/* Large soft glow */}
          <div
            className="absolute top-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-30 blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(62,123,74,0.25) 0%, transparent 70%)',
              [isRTL ? 'right' : 'left']: '5%',
            } as React.CSSProperties}
          />
          <div
            className="absolute bottom-0 w-[400px] h-[400px] rounded-full opacity-20 blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(217,119,6,0.15) 0%, transparent 70%)',
              [isRTL ? 'left' : 'right']: '10%',
            } as React.CSSProperties}
          />
        </motion.div>

        {/* Floating organic shapes */}
        <FloatingShapes scrollY={scrollY} isRTL={isRTL} />

        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
          {/* Text side (right in RTL) */}
          <motion.div
            style={{ y: heroY, scale: heroScale, opacity: heroOpacity }}
            className={`order-2 lg:order-1 text-center lg:text-start ${isRTL ? 'lg:order-2' : 'lg:order-1'}`}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage-50 border border-sage-200 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Sparkles className="text-gold-500" size={14} />
              <span className="text-xs font-bold text-sage-600 font-arabic">
                {t('منصة تعليمية متكاملة', 'All-in-one Educational Platform', language)}
              </span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4 font-arabic"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7, ease: 'easeOut' }}
            >
              <span className="text-gradient-forest">
                {t('تعلم بذكاء', 'Learn Smartly', language)}
              </span>
              <br />
              <span className="text-ink-800">
                {t('مع الأستاذ', 'with the Teacher', language)}
              </span>{' '}
              <motion.span
                className="text-gradient-terracotta inline-block"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, type: 'spring', stiffness: 200, damping: 12 }}
              >
                {t('خالد', 'Khaled', language)}
              </motion.span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              className="text-base lg:text-lg text-ink-400 font-arabic mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              {t(
                'كورسات أونلاين تفاعلية، حضور بالباركود، تقارير فورية لولي الأمر — كل ما تحتاجه في مكان واحد.',
                'Interactive online courses, barcode attendance, instant parent reports — everything you need in one place.',
                language
              )}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <motion.button
                onClick={() => document.getElementById('doorway')?.scrollIntoView({ behavior: 'smooth' })}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="relative group px-8 py-4 rounded-2xl bg-gradient-to-br from-forest-500 to-forest-700 text-cream-100 font-bold font-arabic text-base shadow-organic-lg overflow-hidden"
              >
                {/* Warm glow on hover */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(217,119,6,0.4) 0%, transparent 70%)',
                  }}
                />
                <span className="relative flex items-center justify-center gap-2">
                  {t('ابدأ رحلتك', 'Start Your Journey', language)}
                  <motion.div
                    animate={{ x: isRTL ? [0, -4, 0] : [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    {isRTL ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
                  </motion.div>
                </span>
              </motion.button>

              <motion.button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="px-8 py-4 rounded-2xl bg-cream-50 border-2 border-cream-400/60 text-ink-700 font-bold font-arabic text-base hover:border-forest-300 transition-all flex items-center justify-center gap-2"
              >
                <BookOpen size={18} />
                {t('استكشف المميزات', 'Explore Features', language)}
              </motion.button>
            </motion.div>

            {/* Mini stats */}
            <motion.div
              className="flex items-center gap-6 mt-10 justify-center lg:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              {[
                { icon: Users, value: '500+', labelAr: 'طالب', labelEn: 'Students' },
                { icon: BookOpen, value: '24', labelAr: 'كورس', labelEn: 'Courses' },
                { icon: Award, value: '98%', labelAr: 'رضا', labelEn: 'Satisfaction' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: isRTL ? 15 : -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 + i * 0.1 }}
                >
                  <stat.icon className="text-forest-500" size={18} />
                  <div>
                    <p className="text-lg font-bold text-ink-800 font-arabic">{stat.value}</p>
                    <p className="text-[10px] text-ink-400 font-arabic">{language === 'ar' ? stat.labelAr : stat.labelEn}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Teacher portrait side (left in RTL) */}
          <TeacherPortrait heroY={heroY} heroScale={heroScale} isRTL={isRTL} language={language} />
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <span className="text-xs text-ink-300 font-arabic">{t('مرر للأسفل', 'Scroll down', language)}</span>
          <motion.div
            className="w-6 h-10 rounded-full border-2 border-ink-200 flex justify-center pt-2"
            animate={{ borderColor: ['rgba(15,56,35,0.2)', 'rgba(15,56,35,0.4)', 'rgba(15,56,35,0.2)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-forest-500"
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section id="features" className="relative py-24 px-6 lg:px-12" style={{ background: 'linear-gradient(180deg, #FBFBFA 0%, #F4F3EF 50%, #FBFBFA 100%)' }}>
        <motion.div style={{ y: featuresY }} className="max-w-7xl mx-auto">
          {/* Section header */}
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-terracotta-50 border border-terracotta-200 mb-4">
              <Sparkles className="text-terracotta-500" size={14} />
              <span className="text-xs font-bold text-terracotta-600 font-arabic">
                {t('لماذا نحن؟', 'Why Choose Us?', language)}
              </span>
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-ink-800 font-arabic mb-3">
              {t('كل ما يحتاجه الطالب في منصة واحدة', 'Everything a Student Needs in One Platform', language)}
            </h2>
            <p className="text-sm text-ink-400 font-arabic max-w-xl mx-auto">
              {t('مميزات متكاملة مصممة لتجربة تعليمية استثنائية', 'Integrated features designed for an exceptional learning experience', language)}
            </p>
          </motion.div>

          {/* Feature cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Monitor,
                titleAr: 'كورسات أونلاين',
                titleEn: 'Online Courses',
                descAr: 'دروس فيديو عالية الجودة، مواد قابلة للتحميل، وامتحانات تفاعلية في أي وقت.',
                descEn: 'High-quality video lessons, downloadable materials, and interactive exams anytime.',
                color: 'forest',
                emoji: '💻',
              },
              {
                icon: ScanLine,
                titleAr: 'حضور بالباركود',
                titleEn: 'Barcode Attendance',
                descAr: 'باركود موحد لكل طالب، مسح فوري عند دخول الفصل، وتأكيد لحظي للحضور.',
                descEn: 'Unified barcode per student, instant scanning at classroom entry, real-time confirmation.',
                color: 'terracotta',
                emoji: '📍',
              },
              {
                icon: BarChart3,
                titleAr: 'تقارير لولي الأمر',
                titleEn: 'Parent Reports',
                descAr: 'تنبيهات فورية عبر الواتساب للغياب، الدرجات الضعيفة، والواجبات غير المسلمة.',
                descEn: 'Instant WhatsApp alerts for absence, low grades, and missing homework.',
                color: 'sage',
                emoji: '📊',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="group relative bg-cream-50 rounded-3xl p-8 shadow-organic border border-cream-300/40 hover:shadow-organic-lg transition-all"
                initial={{ opacity: 0, y: 60, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{
                  delay: i * 0.18,
                  type: 'spring',
                  stiffness: 100,
                  damping: 15,
                }}
                whileHover={{ y: -10 }}
              >
                {/* Floating icon */}
                <motion.div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-md ${
                    feature.color === 'forest'
                      ? 'bg-gradient-to-br from-forest-400 to-forest-600'
                      : feature.color === 'terracotta'
                      ? 'bg-gradient-to-br from-terracotta-400 to-terracotta-600'
                      : 'bg-gradient-to-br from-sage-300 to-sage-500'
                  }`}
                  whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <feature.icon className="text-cream-100" size={28} />
                </motion.div>

                <span className="text-3xl mb-3 block">{feature.emoji}</span>
                <h3 className="text-xl font-bold text-ink-800 font-arabic mb-3">
                  {language === 'ar' ? feature.titleAr : feature.titleEn}
                </h3>
                <p className="text-sm text-ink-400 font-arabic leading-relaxed">
                  {language === 'ar' ? feature.descAr : feature.descEn}
                </p>

                {/* Decorative corner */}
                <motion.div
                  className={`absolute -bottom-3 -left-3 w-20 h-20 rounded-3xl opacity-5 ${
                    feature.color === 'forest'
                      ? 'bg-forest-600'
                      : feature.color === 'terracotta'
                      ? 'bg-terracotta-600'
                      : 'bg-sage-500'
                  }`}
                  whileHover={{ scale: 1.5, rotate: 20 }}
                />
              </motion.div>
            ))}
          </div>

          {/* Testimonial strip */}
          <motion.div
            className="mt-16 bg-gradient-to-br from-forest-700 to-forest-900 rounded-3xl p-8 lg:p-10 relative overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            <Quote className="absolute top-6 opacity-10 text-cream-100" size={64} style={{ [isRTL ? 'left' : 'right']: 20 } as React.CSSProperties} />
            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
                  >
                    <Star className="text-gold-400" size={20} fill="currentColor" />
                  </motion.div>
                ))}
              </div>
              <p className="text-cream-100 font-arabic text-lg lg:text-xl leading-relaxed flex-1">
                {t(
                  '"غيّبت المنصة طريقة متابعة ابني تماماً — أصبح أعرف درجاته وحضوره لحظة بلحظة عبر الواتساب."',
                  '"This platform changed how I track my son — I know his grades and attendance in real-time via WhatsApp."',
                  language
                )}
              </p>
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-terracotta-400 to-terracotta-600 flex items-center justify-center text-xl shadow-md">
                  👨‍👦
                </div>
                <div>
                  <p className="text-cream-100 font-bold font-arabic text-sm">{t('أبو أحمد', 'Ahmed\'s Father', language)}</p>
                  <p className="text-cream-200/50 text-xs font-arabic">{t('ولي أمر', 'Parent', language)}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ===== DOORWAY SECTION ===== */}
      <section id="doorway" className="relative min-h-screen flex items-center justify-center py-24 px-6 overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, #FBFBFA 0%, #E8F0EA 40%, #174B2E 100%)' }}
        />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E\")",
        }} />

        {/* Doorway content */}
        <div className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cream-100/80 backdrop-blur-sm border border-sage-200 mb-6">
              <DoorOpen className="text-forest-500" size={14} />
              <span className="text-xs font-bold text-forest-600 font-arabic">
                {t('بوابة المعرفة', 'Gateway of Knowledge', language)}
              </span>
            </span>
            <h2 className="text-3xl lg:text-5xl font-bold text-ink-800 font-arabic mb-4">
              {t('ادخل وابدأ رحلتك التعليمية', 'Enter and Begin Your Journey', language)}
            </h2>
            <p className="text-sm lg:text-base text-ink-500 font-arabic max-w-lg mx-auto mb-12">
              {t('اضغط على البوابة لتفتح وانتقل إلى تسجيل الدخول', 'Click the gateway to open and proceed to sign in', language)}
            </p>
          </motion.div>

          {/* The interactive Door */}
          <LandingDoor
            phase={doorPhase}
            isRTL={isRTL}
            language={language}
            onHover={() => doorPhase === 'idle' && setDoorPhase('hovering')}
            onLeave={() => doorPhase === 'hovering' && setDoorPhase('idle')}
            onClick={handleDoorClick}
          />
        </div>

        {/* Fullscreen transition overlay */}
        <AnimatePresence>
          {doorPhase === 'transitioning' && (
            <motion.div
              className="fixed inset-0 z-[100] flex items-center justify-center"
              style={{ background: 'linear-gradient(180deg, #0F3823 0%, #174B2E 50%, #0A2A18 100%)' }}
              initial={{ clipPath: 'circle(0% at 50% 50%)' }}
              animate={{ clipPath: 'circle(150% at 50% 50%)' }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            >
              <motion.div
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <motion.div
                  className="w-20 h-20 border-3 border-sage-300/30 border-t-sage-300 rounded-full mx-auto mb-6"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                />
                <p className="text-cream-100 font-arabic text-lg font-bold">
                  {t('جاري فتح البوابة...', 'Opening Gateway...', language)}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Footer */}
      <footer className="bg-forest-900 py-8 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sage-300 to-forest-500 flex items-center justify-center">
              <GraduationCap className="text-cream-100" size={18} />
            </div>
            <p className="text-cream-200/60 text-sm font-arabic">
              {t('منصة الإبداع التعليمية © 2026', 'Creative Learning Platform © 2026', language)}
            </p>
          </div>
          <p className="text-cream-200/40 text-xs font-arabic">
            {t('صُنع بشغف للتعليم', 'Crafted with passion for education', language)}
          </p>
        </div>
      </footer>
    </div>
  );
}

// ===== TEACHER PORTRAIT COMPONENT =====
function TeacherPortrait({
  heroY,
  heroScale,
  isRTL,
  language,
}: {
  heroY: MotionValue<number>;
  heroScale: MotionValue<number>;
  isRTL: boolean;
  language: 'ar' | 'en';
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      style={{ y: heroY, scale: heroScale }}
      className={`order-1 lg:order-2 flex justify-center ${isRTL ? 'lg:order-1' : 'lg:order-2'}`}
    >
      <div
        className="perspective-1000"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          ref={containerRef}
          className="relative"
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        >
          {/* Portrait frame */}
          <motion.div
            className="relative w-[280px] sm:w-[340px] lg:w-[400px] aspect-[3/4] rounded-3xl overflow-hidden shadow-door"
            initial={{ y: 120, opacity: 0, filter: 'blur(20px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            transition={{ delay: 0.5, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ transform: 'translateZ(40px)' }}
          >
            {/* Mask reveal overlay */}
            <motion.div
              className="absolute inset-0 z-20 bg-forest-700"
              initial={{ scaleY: 1 }}
              animate={{ scaleY: 0 }}
              transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: 'top' }}
            />

            {/* Teacher image */}
            <img
              src={TEACHER_IMAGE}
              alt="Teacher portrait"
              className="w-full h-full object-cover"
              style={{ filter: 'contrast(1.05) saturate(0.95)' }}
              loading="eager"
            />

            {/* Gradient overlay for text legibility */}
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(180deg, transparent 50%, rgba(15,56,35,0.7) 100%)' }}
            />

            {/* Name tag */}
            <motion.div
              className="absolute bottom-5 left-5 right-5 z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.6 }}
              style={{ transform: 'translateZ(60px)' }}
            >
              <p className="text-cream-100 font-bold font-arabic text-lg">
                {t('الأستاذ خالد عبدالله', 'Mr. Khaled Abdullah', language)}
              </p>
              <p className="text-cream-200/60 text-xs font-arabic">
                {t('مدرس الفيزياء والرياضيات', 'Physics & Mathematics Teacher', language)}
              </p>
            </motion.div>

            {/* Floating badge */}
            <motion.div
              className="absolute top-5 right-5 px-3 py-1.5 rounded-full bg-cream-100/90 backdrop-blur-sm shadow-lg z-10"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.8, type: 'spring', stiffness: 200, damping: 12 }}
              style={{ transform: 'translateZ(80px)' }}
            >
              <span className="text-xs font-bold text-forest-700 font-arabic flex items-center gap-1">
                <Award size={12} />
                {t('خبرة 15 سنة', '15 yrs exp', language)}
              </span>
            </motion.div>
          </motion.div>

          {/* 3D Floating decorative elements */}
          <motion.div
            className="absolute -top-6 -right-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-terracotta-400 to-terracotta-600 opacity-80 shadow-lg"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, type: 'spring', stiffness: 150, damping: 12 }}
            style={{ transform: 'translateZ(70px)' }}
            whileHover={{ scale: 1.15, rotate: 10 }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-2xl">🔭</span>
            </div>
          </motion.div>

          <motion.div
            className="absolute -bottom-4 -left-4 w-14 h-14 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 opacity-80 shadow-lg"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4, type: 'spring', stiffness: 150, damping: 12 }}
            style={{ transform: 'translateZ(50px)' }}
            whileHover={{ scale: 1.15, rotate: -10 }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-xl">📐</span>
            </div>
          </motion.div>

          {/* Glow behind portrait */}
          <motion.div
            className="absolute inset-0 rounded-3xl blur-2xl -z-10"
            style={{
              background: 'radial-gradient(circle, rgba(62,123,74,0.3) 0%, transparent 70%)',
              transform: 'translateZ(-50px) scale(1.2)',
            }}
            animate={{ opacity: [0.5, 0.8, 0.5], scale: [1.1, 1.25, 1.1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

// ===== FLOATING BACKGROUND SHAPES =====
function FloatingShapes({ scrollY, isRTL }: { scrollY: MotionValue<number>; isRTL: boolean }) {
  const y1 = useTransform(scrollY, [0, 1000], [0, -80]);
  const y2 = useTransform(scrollY, [0, 1000], [0, 120]);
  const y3 = useTransform(scrollY, [0, 1000], [0, -150]);

  const shapes = [
    { y: y1, size: 40, color: 'rgba(62,123,74,0.08)', top: '15%', side: isRTL ? 'left' : 'right', sideVal: '8%', shape: 'rounded-full', delay: 0 },
    { y: y2, size: 60, color: 'rgba(217,119,6,0.06)', top: '40%', side: isRTL ? 'right' : 'left', sideVal: '6%', shape: 'rounded-3xl', delay: 0.5 },
    { y: y3, size: 30, color: 'rgba(201,162,39,0.08)', top: '60%', side: isRTL ? 'left' : 'right', sideVal: '12%', shape: 'rounded-full', delay: 1 },
    { y: y1, size: 50, color: 'rgba(111,160,121,0.08)', top: '70%', side: isRTL ? 'right' : 'left', sideVal: '10%', shape: 'rounded-2xl', delay: 1.5 },
  ];

  return (
    <>
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{
            y: shape.y,
            width: shape.size,
            height: shape.size,
            top: shape.top,
            [shape.side]: shape.sideVal,
            background: shape.color,
            borderRadius: shape.shape === 'rounded-full' ? '9999px' : shape.shape === 'rounded-3xl' ? '24px' : '16px',
          } as React.CSSProperties}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 15, -15, 0],
          }}
          transition={{
            duration: 6 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: shape.delay,
          }}
        />
      ))}

      {/* Floating dust particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`dust-${i}`}
          className="absolute w-1 h-1 rounded-full bg-sage-300/40 pointer-events-none"
          style={{
            top: `${10 + (i * 7) % 80}%`,
            [isRTL ? 'right' : 'left']: `${5 + (i * 11) % 85}%`,
          } as React.CSSProperties}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 4 + (i % 4),
            repeat: Infinity,
            delay: i * 0.3,
            ease: 'easeOut',
          }}
        />
      ))}
    </>
  );
}

// ===== LANDING DOOR COMPONENT =====
function LandingDoor({
  phase,
  isRTL,
  language,
  onHover,
  onLeave,
  onClick,
}: {
  phase: 'idle' | 'hovering' | 'opening' | 'transitioning';
  isRTL: boolean;
  language: 'ar' | 'en';
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  const isOpen = phase === 'hovering' || phase === 'opening' || phase === 'transitioning';
  const fullyOpen = phase === 'opening' || phase === 'transitioning';
  const swingAngle = fullyOpen ? -85 : isOpen ? -15 : 0;

  return (
    <motion.div
      className="relative cursor-pointer inline-block"
      onHoverStart={onHover}
      onHoverEnd={onLeave}
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative" style={{ width: 260, height: 360 }}>
        {/* Warm light behind door */}
        <motion.div
          className="absolute inset-0 rounded-t-[130px] overflow-hidden"
          animate={{
            background: isOpen
              ? 'linear-gradient(180deg, #EFA94F 0%, #D97706 30%, #C2410C 60%, #174B2E 100%)'
              : 'linear-gradient(180deg, #174B2E 0%, #0F3823 60%, #0A2A18 100%)',
            boxShadow: isOpen
              ? '0 0 100px rgba(217,119,6,0.4)'
              : '0 0 0px rgba(217,119,6,0)',
          }}
          transition={{ duration: 0.8 }}
        >
          {/* Light rays */}
          {isOpen && (
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-full bg-gradient-to-b from-yellow-200/40 to-transparent"
                  style={{ transform: `translateX(${(i - 2) * 25}px) rotate(${(i - 2) * 12}deg)` }}
                />
              ))}
            </motion.div>
          )}

          {/* Walking silhouette when opening */}
          {fullyOpen && (
            <motion.div
              className="absolute bottom-0 left-1/2 z-5"
              initial={{ x: '-50%', y: 50, opacity: 0 }}
              animate={{ x: ['-50%', '-50%', '-50%'], y: [50, 0, -30], opacity: [0, 1, 0] }}
              transition={{ duration: 1.8, times: [0, 0.3, 1], ease: 'easeInOut' }}
            >
              <svg width="32" height="64" viewBox="0 0 32 64" fill="none">
                <ellipse cx="16" cy="9" rx="6" ry="7" fill="#0F3823" />
                <path d="M10 16 Q16 12 22 16 L21 40 Q19 49 17 53 L15 53 Q13 49 11 40 Z" fill="#0F3823" />
                <motion.g animate={{ rotate: [0, 20, -20, 0] }} transition={{ duration: 0.8, repeat: 1 }} style={{ transformOrigin: '11px 20px' }}>
                  <rect x="8" y="20" width="4" height="18" rx="2" fill="#0F3823" />
                </motion.g>
                <motion.g animate={{ rotate: [0, -20, 20, 0] }} transition={{ duration: 0.8, repeat: 1 }} style={{ transformOrigin: '24px 20px' }}>
                  <rect x="23" y="20" width="4" height="18" rx="2" fill="#0F3823" />
                </motion.g>
                <motion.g animate={{ y: [0, -10, 0] }} transition={{ duration: 0.8, repeat: 1 }}>
                  <rect x="12" y="51" width="4" height="13" rx="2" fill="#0F3823" />
                </motion.g>
                <motion.g animate={{ y: [0, 0, -10] }} transition={{ duration: 0.8, repeat: 1 }}>
                  <rect x="18" y="51" width="4" height="13" rx="2" fill="#0F3823" />
                </motion.g>
              </svg>
            </motion.div>
          )}
        </motion.div>

        {/* Ivy decorations */}
        <svg className="absolute -top-2 -left-3 pointer-events-none z-20" width="100" height="150" viewBox="0 0 100 150" fill="none">
          <motion.path d="M50 140 Q35 95 45 60 Q55 35 42 15" stroke="#3E7B4A" strokeWidth="2" fill="none" animate={{ pathLength: [0, 1] }} transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }} />
          {[
            { cx: 40, cy: 80, r: 7 },
            { cx: 50, cy: 55, r: 6 },
            { cx: 44, cy: 28, r: 8 },
          ].map((leaf, i) => (
            <motion.ellipse
              key={i}
              cx={leaf.cx}
              cy={leaf.cy}
              rx={leaf.r}
              ry={leaf.r * 0.7}
              fill={i % 2 === 0 ? '#3E7B4A' : '#6FA079'}
              animate={{ rotate: [0, 6, -6, 0], scale: [1, 1.06, 1] }}
              transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.3 }}
              style={{ transformOrigin: `${leaf.cx}px ${leaf.cy}px` }}
            />
          ))}
        </svg>

        <svg className="absolute -top-2 -right-3 pointer-events-none z-20" width="100" height="150" viewBox="0 0 100 150" fill="none" style={{ transform: 'scaleX(-1)' }}>
          <motion.path d="M50 140 Q35 95 45 60 Q55 35 42 15" stroke="#3E7B4A" strokeWidth="2" fill="none" animate={{ pathLength: [0, 1] }} transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse', delay: 1 }} />
          {[
            { cx: 40, cy: 85, r: 6 },
            { cx: 50, cy: 50, r: 7 },
          ].map((leaf, i) => (
            <motion.ellipse
              key={i}
              cx={leaf.cx}
              cy={leaf.cy}
              rx={leaf.r}
              ry={leaf.r * 0.7}
              fill={i % 2 === 0 ? '#6FA079' : '#3E7B4A'}
              animate={{ rotate: [0, -6, 6, 0], scale: [1, 1.06, 1] }}
              transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.4 }}
              style={{ transformOrigin: `${leaf.cx}px ${leaf.cy}px` }}
            />
          ))}
        </svg>

        {/* Left door panel */}
        <motion.div
          className="absolute top-0 bottom-0 rounded-tl-[130px] z-10"
          style={{
            left: 0,
            width: 130,
            height: '100%',
            transformStyle: 'preserve-3d',
            transformOrigin: 'left center',
          }}
          animate={{ rotateY: swingAngle }}
          transition={{ type: 'spring', stiffness: 40, damping: 12, mass: 1.5 }}
        >
          <div
            className="w-full h-full rounded-t-[130px] rounded-tr-none border-2 border-forest-800/30"
            style={{ background: 'linear-gradient(135deg, #1E5E3A 0%, #174B2E 50%, #0F3823 100%)', boxShadow: 'inset 0 0 25px rgba(0,0,0,0.3)' }}
          >
            <div className="absolute top-10 left-3 right-1 bottom-16 border-2 border-gold-500/20 rounded-lg flex flex-col items-center justify-center gap-2">
              <div className="w-10 h-10 rounded-full border-2 border-gold-500/30 flex items-center justify-center">
                <motion.div className="w-2.5 h-2.5 rounded-full bg-gold-400" animate={{ opacity: isOpen ? [0.4, 1, 0.4] : 0.3 }} transition={{ duration: 2, repeat: Infinity }} />
              </div>
              <div className="w-14 h-0.5 bg-gold-500/20 rounded-full" />
              <div className="w-10 h-0.5 bg-gold-500/15 rounded-full" />
            </div>
            <motion.div className="absolute top-1/2 right-2.5 w-2.5 h-9 rounded-full bg-gradient-to-b from-gold-400 to-gold-600 shadow-lg" animate={{ scale: isOpen ? [1, 1.3, 1] : 1 }} transition={{ duration: 0.6 }} />
          </div>
        </motion.div>

        {/* Right door panel */}
        <motion.div
          className="absolute top-0 bottom-0 rounded-tr-[130px] z-10"
          style={{
            right: 0,
            width: 130,
            height: '100%',
            transformStyle: 'preserve-3d',
            transformOrigin: 'right center',
          }}
          animate={{ rotateY: -swingAngle }}
          transition={{ type: 'spring', stiffness: 40, damping: 12, mass: 1.5 }}
        >
          <div
            className="w-full h-full rounded-t-[130px] rounded-tl-none border-2 border-forest-800/30"
            style={{ background: 'linear-gradient(225deg, #1E5E3A 0%, #174B2E 50%, #0F3823 100%)', boxShadow: 'inset 0 0 25px rgba(0,0,0,0.3)' }}
          >
            <div className="absolute top-10 right-3 left-1 bottom-16 border-2 border-gold-500/20 rounded-lg flex flex-col items-center justify-center gap-2">
              <div className="w-14 h-0.5 bg-gold-500/20 rounded-full" />
              <div className="w-10 h-0.5 bg-gold-500/15 rounded-full" />
              <div className="w-8 h-8 rounded-full border-2 border-gold-500/30" />
            </div>
            <motion.div className="absolute top-1/2 left-2.5 w-2.5 h-9 rounded-full bg-gradient-to-b from-gold-400 to-gold-600 shadow-lg" animate={{ scale: isOpen ? [1, 1.3, 1] : 1 }} transition={{ duration: 0.6 }} />
          </div>
        </motion.div>

        {/* Keystone */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-7 bg-gradient-to-b from-cream-300 to-cream-400 rounded-t-lg shadow-md z-20" />
      </div>

      {/* Door label */}
      <motion.p
        className="text-center mt-6 font-arabic text-sm font-bold"
        animate={{
          color: isOpen ? '#D97706' : '#5C6470',
        }}
      >
        {isOpen
          ? t('ادخل الآن...', 'Enter now...', language)
          : t('اضغط لفتح البوابة', 'Click to open gateway', language)}
      </motion.p>

      {/* Ground shadow */}
      <motion.div
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-forest-900/20 blur-md"
        animate={{ width: isOpen ? 280 : 180, opacity: isOpen ? 0.3 : 0.15 }}
        transition={{ duration: 1 }}
        style={{ height: 16 }}
      />
    </motion.div>
  );
}
