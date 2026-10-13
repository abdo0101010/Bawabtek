import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ScanLine,
  CheckCircle2,
  XCircle,
  UserCheck,
  Clock,
  Lock,
  Unlock,
  Bell,
  Zap,
  Users,
  Search,
  Send,
} from 'lucide-react';
import { useApp, t } from '../store';
import { MOCK_STUDENTS } from '../mockData';
import type { AttendanceRecord, ScannedStudent } from '../types';

export function AttendanceScanner() {
  const { language, dir } = useApp();
  const [sessionOpen, setSessionOpen] = useState(true);
  const [scanResult, setScanResult] = useState<ScannedStudent | null>(null);
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [manualInput, setManualInput] = useState('');
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [showClosePrompt, setShowClosePrompt] = useState(false);
  const [absentSent, setAbsentSent] = useState(false);

  const triggerScan = (barcode: string) => {
    setScanStatus('scanning');
    setScanResult(null);

    setTimeout(() => {
      const student = MOCK_STUDENTS.find((s) => s.barcode === barcode);
      if (student) {
        setScanResult(student);
        setScanStatus(student.enrolled ? 'success' : 'error');
        if (student.enrolled) {
          const record: AttendanceRecord = {
            id: `att-${Date.now()}`,
            studentName: student.name,
            avatar: student.avatar,
            barcode: student.barcode,
            status: 'present',
            time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
            courseTitle: language === 'ar' ? 'الفيزياء المتقدمة' : 'Advanced Physics',
            enrolled: true,
          };
          setRecords((prev) => [record, ...prev]);
        }
      } else {
        setScanResult({ name: 'غير معروف', avatar: '❓', barcode, enrolled: false });
        setScanStatus('error');
      }
    }, 1200);
  };

  const handleManualScan = () => {
    if (manualInput.trim()) {
      triggerScan(manualInput.trim().toUpperCase());
      setManualInput('');
    }
  };

  const handleQuickScan = (barcode: string) => {
    triggerScan(barcode);
  };

  const handleCloseSession = () => {
    setShowClosePrompt(true);
  };

  const confirmCloseSession = () => {
    setSessionOpen(false);
    setShowClosePrompt(false);
    setAbsentSent(true);
    setTimeout(() => setAbsentSent(false), 5000);
  };

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink-800 font-arabic flex items-center gap-2 mb-1">
          <ScanLine className="text-forest-500" size={26} />
          {t('الحضور والباركود', 'Attendance & QR Scanner', language)}
        </h1>
        <p className="text-sm text-ink-400 font-arabic">
          {t('امسح باركود الطالب لتسجيل الحضور', 'Scan student barcode to record attendance', language)}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Scanner */}
        <div className="lg:col-span-2">
          {/* Session status toggle */}
          <motion.div
            className={`rounded-2xl p-4 mb-5 shadow-organic border ${
              sessionOpen
                ? 'bg-forest-50 border-forest-200'
                : 'bg-terracotta-50 border-terracotta-200'
            }`}
            layout
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <motion.div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                    sessionOpen ? 'bg-forest-100' : 'bg-terracotta-100'
                  }`}
                  animate={sessionOpen ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {sessionOpen ? (
                    <Unlock className="text-forest-600" size={22} />
                  ) : (
                    <Lock className="text-terracotta-600" size={22} />
                  )}
                </motion.div>
                <div>
                  <p className="font-bold text-ink-800 font-arabic text-sm">
                    {sessionOpen
                      ? t('الحصة مفتوحة', 'Session Open', language)
                      : t('الحصة مغلقة', 'Session Closed', language)}
                  </p>
                  <p className="text-xs text-ink-400 font-arabic">
                    {t('الفيزياء المتقدمة — الحصة 12', 'Advanced Physics — Lesson 12', language)}
                  </p>
                </div>
              </div>

              <button
                onClick={sessionOpen ? handleCloseSession : () => setSessionOpen(true)}
                className={`px-4 py-2.5 rounded-xl font-bold text-sm font-arabic transition-all ${
                  sessionOpen
                    ? 'bg-terracotta-500 text-cream-100 hover:shadow-warm'
                    : 'bg-forest-500 text-cream-100 hover:shadow-organic-lg'
                }`}
              >
                {sessionOpen
                  ? t('إغلاق الحصة', 'Close Session', language)
                  : t('فتح الحصة', 'Open Session', language)}
              </button>
            </div>
          </motion.div>

          {/* Scanner viewport */}
          <div className="bg-ink-900 rounded-2xl overflow-hidden shadow-organic-lg relative" style={{ aspectRatio: '4/3' }}>
            <div className="absolute inset-0" style={{
              background: 'radial-gradient(circle at 50% 50%, #174B2E 0%, #0A2A18 70%, #061D10 100%)',
            }} />

            {/* Scanner frame */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-64 h-48">
                {/* Corner brackets */}
                {[
                  'top-0 left-0 border-t-4 border-l-4 rounded-tl-xl',
                  'top-0 right-0 border-t-4 border-r-4 rounded-tr-xl',
                  'bottom-0 left-0 border-b-4 border-l-4 rounded-bl-xl',
                  'bottom-0 right-0 border-b-4 border-r-4 rounded-br-xl',
                ].map((pos, i) => (
                  <div
                    key={i}
                    className={`absolute w-10 h-10 border-sage-300 ${pos}`}
                  />
                ))}

                {/* Scan line animation */}
                {scanStatus === 'scanning' && (
                  <motion.div
                    className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-sage-300 to-transparent shadow-[0_0_12px_rgba(111,160,121,0.8)]"
                    initial={{ top: '10%' }}
                    animate={{ top: ['10%', '90%', '10%'] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}

                {/* Scan result overlay */}
                <AnimatePresence>
                  {scanStatus === 'success' && scanResult && (
                    <motion.div
                      className="absolute inset-0 flex flex-col items-center justify-center bg-forest-500/90 backdrop-blur-sm rounded-xl"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
                        className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center mb-3"
                      >
                        <CheckCircle2 className="text-forest-600" size={36} />
                      </motion.div>
                      <span className="text-4xl mb-2">{scanResult.avatar}</span>
                      <p className="text-cream-100 font-bold font-arabic text-lg">{scanResult.name}</p>
                      <p className="text-cream-200/80 font-arabic text-sm mt-1">
                        {t('✓ تَمَّ تسجيل الحضور بنجاح', '✓ Attendance recorded successfully', language)}
                      </p>
                    </motion.div>
                  )}

                  {scanStatus === 'error' && scanResult && (
                    <motion.div
                      className="absolute inset-0 flex flex-col items-center justify-center bg-terracotta-600/90 backdrop-blur-sm rounded-xl"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
                        className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center mb-3"
                      >
                        <XCircle className="text-terracotta-600" size={36} />
                      </motion.div>
                      <span className="text-4xl mb-2">{scanResult.avatar}</span>
                      {scanResult.name !== 'غير معروف' && (
                        <p className="text-cream-100 font-bold font-arabic text-lg">{scanResult.name}</p>
                      )}
                      <p className="text-cream-200/90 font-arabic text-sm mt-1 text-center px-4">
                        {scanResult.name === 'غير معروف'
                          ? t('⚠ الباركود غير معروف!', '⚠ Unknown barcode!', language)
                          : t('⚠ الطالب غير مشترك في هذه الحصة!', '⚠ Student not enrolled in this session!', language)}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Idle state */}
                {scanStatus === 'idle' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <ScanLine className="text-sage-300/60 mx-auto mb-2" size={48} />
                      <p className="text-cream-200/40 font-arabic text-sm">
                        {t('في انتظار المسح...', 'Waiting for scan...', language)}
                      </p>
                    </motion.div>
                  </div>
                )}
              </div>
            </div>

            {/* Pulse ring when scanning */}
            {scanStatus === 'scanning' && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <motion.div
                  className="w-32 h-32 rounded-full border-2 border-sage-300/50"
                  animate={{ scale: [1, 2], opacity: [1, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
              </div>
            )}
          </div>

          {/* Manual input */}
          <div className="mt-4 flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute top-1/2 -translate-y-1/2 text-ink-300" size={16} style={{ [dir === 'rtl' ? 'right' : 'left']: 12 } as React.CSSProperties} />
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleManualScan()}
                placeholder={t('أدخل الباركود يدوياً (مثال: STD-2026-001)', 'Enter barcode manually (e.g. STD-2026-001)', language)}
                className="w-full py-3 rounded-xl bg-cream-50 border-2 border-cream-400/60 text-ink-800 placeholder:text-ink-300 font-mono text-sm focus:border-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-200 transition-all"
                style={{ paddingLeft: dir === 'rtl' ? 16 : 36, paddingRight: dir === 'rtl' ? 36 : 16 }}
              />
            </div>
            <button
              onClick={handleManualScan}
              disabled={sessionOpen === false}
              className="px-5 py-3 rounded-xl bg-gradient-to-br from-forest-500 to-forest-700 text-cream-100 font-bold text-sm font-arabic hover:shadow-organic-lg transition-all disabled:opacity-40"
            >
              {t('امسح', 'Scan', language)}
            </button>
          </div>

          {/* Quick scan buttons */}
          <div className="mt-3">
            <p className="text-xs text-ink-400 font-arabic mb-2">{t('مسح سريع (محاكاة):', 'Quick scan (simulation):', language)}</p>
            <div className="flex flex-wrap gap-2">
              {MOCK_STUDENTS.slice(0, 4).map((s) => (
                <button
                  key={s.barcode}
                  onClick={() => handleQuickScan(s.barcode)}
                  disabled={!sessionOpen}
                  className="px-3 py-1.5 rounded-lg bg-cream-100 border border-cream-300 text-xs font-mono text-ink-600 hover:border-forest-300 hover:bg-forest-50 transition-all disabled:opacity-40 font-arabic"
                >
                  {s.barcode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Attendance log */}
        <div className="lg:col-span-1">
          <div className="bg-cream-50 rounded-2xl shadow-organic overflow-hidden">
            <div className="p-4 border-b border-cream-300">
              <h3 className="font-bold text-ink-800 font-arabic flex items-center gap-2">
                <UserCheck className="text-forest-500" size={18} />
                {t('سجل الحضور', 'Attendance Log', language)}
              </h3>
              <div className="flex items-center gap-3 mt-2 text-xs">
                <span className="flex items-center gap-1 text-forest-600 font-arabic">
                  <Users size={12} />
                  {records.length} {t('حاضر', 'present', language)}
                </span>
                <span className="flex items-center gap-1 text-ink-400 font-arabic">
                  <Clock size={12} />
                  {language === 'ar' ? 'آخر تحديث' : 'Last update'}: {new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            <div className="max-h-[500px] overflow-y-auto scrollbar-thin">
              {records.length === 0 ? (
                <div className="p-8 text-center">
                  <UserCheck className="text-ink-200 mx-auto mb-2" size={32} />
                  <p className="text-sm text-ink-400 font-arabic">
                    {t('لا يوجد سجلات بعد', 'No records yet', language)}
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  {records.map((record) => (
                    <motion.div
                      key={record.id}
                      layout
                      initial={{ opacity: 0, x: dir === 'rtl' ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-3 p-3 border-b border-cream-200/60 hover:bg-cream-100 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sage-300 to-forest-500 flex items-center justify-center text-base shadow-sm">
                        {record.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-arabic font-semibold text-ink-800 truncate">{record.studentName}</p>
                        <p className="text-xs text-ink-400 font-mono">{record.barcode}</p>
                      </div>
                      <div className="text-end shrink-0">
                        <CheckCircle2 className="text-forest-500" size={16} />
                        <p className="text-[10px] text-ink-400 font-mono mt-0.5">{record.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Close session prompt */}
      <AnimatePresence>
        {showClosePrompt && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm" onClick={() => setShowClosePrompt(false)} />
            <motion.div
              className="relative bg-cream-50 rounded-3xl shadow-organic-xl max-w-sm w-full p-6 text-center"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <div className="w-14 h-14 rounded-full bg-terracotta-100 flex items-center justify-center mx-auto mb-4">
                <Bell className="text-terracotta-600" size={28} />
              </div>
              <h3 className="font-bold text-ink-800 font-arabic mb-2">
                {t('تأكيد إغلاق الحصة', 'Confirm Session Close', language)}
              </h3>
              <p className="text-sm text-ink-400 font-arabic mb-5 leading-relaxed">
                {t('عند الإغلاق، سيتم إرسال إنذار غياب فوراً للغائبين عبر الواتساب', 'Upon closing, absence alerts will be sent immediately to absentees via WhatsApp', language)}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowClosePrompt(false)}
                  className="flex-1 py-2.5 rounded-xl bg-cream-200 text-ink-600 font-bold text-sm font-arabic hover:bg-cream-300 transition-colors"
                >
                  {t('إلغاء', 'Cancel', language)}
                </button>
                <button
                  onClick={confirmCloseSession}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-br from-terracotta-500 to-terracotta-600 text-cream-100 font-bold text-sm font-arabic hover:shadow-warm transition-all"
                >
                  {t('إغلاق وإرسال', 'Close & Send', language)}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Absent sent notification */}
      <AnimatePresence>
        {absentSent && (
          <motion.div
            className="fixed bottom-6 z-50"
            style={{ [dir === 'rtl' ? 'left' : 'right']: 24 } as React.CSSProperties}
            initial={{ opacity: 0, y: 20, x: dir === 'rtl' ? -20 : 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="bg-cream-50 rounded-2xl shadow-organic-lg p-4 flex items-center gap-3 border border-sage-200 max-w-sm">
              <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center shrink-0">
                <Send className="text-sage-500" size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-ink-800 font-arabic">
                  {t('تم إرسال إنذارات الغياب', 'Absence alerts sent', language)}
                </p>
                <p className="text-xs text-ink-400 font-arabic">
                  {t('تم إرسال رسائل واتساب لـ 3 غائبين', 'WhatsApp messages sent to 3 absentees', language)}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
