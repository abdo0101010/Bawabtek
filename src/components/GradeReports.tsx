import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Bell,
  BellRing,
  MessageCircle,
  Send,
  Settings,
  Zap,
  Clock,
  X,
  ChevronDown,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useApp, t } from '../store';
import { MOCK_GRADES, MOCK_ALERTS } from '../mockData';
import type { AlertItem } from '../types';

export function GradeReports() {
  const { language, dir, gradeThreshold, setGradeThreshold } = useApp();
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  const [showThresholdModal, setShowThresholdModal] = useState(false);
  const [showWhatsAppLog, setShowWhatsAppLog] = useState<AlertItem | null>(null);
  const [whatsappSent, setWhatsappSent] = useState(false);

  const maxScore = 100;
  const chartWidth = 600;
  const chartHeight = 200;
  const padding = 30;
  const plotWidth = chartWidth - padding * 2;
  const plotHeight = chartHeight - padding * 2;

  const points = MOCK_GRADES.map((g, i) => ({
    x: padding + (i / (MOCK_GRADES.length - 1)) * plotWidth,
    y: padding + plotHeight - (g.score / maxScore) * plotHeight,
    ...g,
  }));

  const linePath = points
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(' ');

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding + plotHeight} L ${points[0].x} ${padding + plotHeight} Z`;

  const avgScore = Math.round(MOCK_GRADES.reduce((s, g) => s + g.score, 0) / MOCK_GRADES.length);
  const avgAttendance = Math.round(MOCK_GRADES.reduce((s, g) => s + g.attendance, 0) / MOCK_GRADES.length);
  const avgHomework = Math.round(MOCK_GRADES.reduce((s, g) => s + g.homework, 0) / MOCK_GRADES.length);

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const sendWhatsApp = (alert: AlertItem) => {
    setShowWhatsAppLog(alert);
    setWhatsappSent(false);
    setTimeout(() => setWhatsappSent(true), 1500);
  };

  const severityConfig = {
    high: { bg: 'bg-terracotta-50', border: 'border-terracotta-200', icon: 'text-terracotta-600', badge: 'bg-terracotta-500' },
    medium: { bg: 'bg-gold-400/10', border: 'border-gold-400/30', icon: 'text-gold-600', badge: 'bg-gold-500' },
    low: { bg: 'bg-sage-50', border: 'border-sage-200', icon: 'text-sage-500', badge: 'bg-sage-400' },
  };

  const alertTypeConfig = {
    absent: { icon: AlertTriangle, labelAr: 'إنذار غياب', labelEn: 'Absent Warning', emoji: '🚨' },
    'low-grade': { icon: TrendingDown, labelAr: 'إنذار درجات ضعيفة', labelEn: 'Low Grade Alarm', emoji: '⚠️' },
    'missing-homework': { icon: Clock, labelAr: 'واجب غير مُسلَّم', labelEn: 'Missing Homework', emoji: '📋' },
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink-800 font-arabic flex items-center gap-2 mb-1">
            <BarChart3 className="text-forest-500" size={26} />
            {t('التقارير والتنبيهات', 'Reports & Alerts', language)}
          </h1>
          <p className="text-sm text-ink-400 font-arabic">
            {t('تتبع التقدم الأكاديمي والتنبيهات الفورية', 'Track academic progress and instant alerts', language)}
          </p>
        </div>
        <button
          onClick={() => setShowThresholdModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-400/60 text-ink-600 font-semibold text-sm font-arabic hover:border-forest-300 hover:bg-forest-50 transition-all"
        >
          <Settings size={16} />
          {t('حد التنبيه', 'Alert Threshold', language)}
          <span className="px-2 py-0.5 rounded-lg bg-terracotta-100 text-terracotta-700 text-xs font-bold">{gradeThreshold}%</span>
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { labelAr: 'متوسط الدرجات', labelEn: 'Avg Score', value: `${avgScore}%`, icon: TrendingUp, color: avgScore >= gradeThreshold ? 'forest' : 'terracotta' },
          { labelAr: 'نسبة الحضور', labelEn: 'Attendance', value: `${avgAttendance}%`, icon: CheckCircle2, color: 'sage' },
          { labelAr: 'إنجاز الواجبات', labelEn: 'Homework', value: `${avgHomework}%`, icon: Clock, color: 'gold' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            className="bg-cream-50 rounded-2xl p-4 shadow-organic border border-cream-300/40"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -3 }}
          >
            <stat.icon className={`mb-2 ${stat.color === 'forest' ? 'text-forest-600' : stat.color === 'terracotta' ? 'text-terracotta-500' : stat.color === 'sage' ? 'text-sage-500' : 'text-gold-500'}`} size={20} />
            <p className="text-2xl font-bold text-ink-800">{stat.value}</p>
            <p className="text-xs text-ink-400 font-arabic">{language === 'ar' ? stat.labelAr : stat.labelEn}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Progress chart */}
        <div className="lg:col-span-2">
          <div className="bg-cream-50 rounded-2xl shadow-organic p-5 border border-cream-300/40">
            <h2 className="font-bold text-ink-800 font-arabic mb-1 flex items-center gap-2">
              <TrendingUp className="text-forest-500" size={18} />
              {t('تقرير التقدم الشهري', 'Monthly Progress Report', language)}
            </h2>
            <p className="text-xs text-ink-400 font-arabic mb-4">
              {t('الدرجات، الحضور، والواجبات خلال 6 أشهر', 'Scores, attendance & homework over 6 months', language)}
            </p>

            {/* SVG Chart */}
            <div className="w-full overflow-x-auto scrollbar-thin">
              <svg width={chartWidth} height={chartHeight} className="mx-auto" style={{ direction: 'ltr' }}>
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map((val) => {
                  const y = padding + plotHeight - (val / maxScore) * plotHeight;
                  return (
                    <g key={val}>
                      <line x1={padding} y1={y} x2={chartWidth - padding} y2={y} stroke="#E8E5DA" strokeWidth={1} strokeDasharray={val === 0 ? '0' : '4 4'} />
                      <text x={padding - 8} y={y + 4} textAnchor="end" fontSize={10} fill="#8B929D" fontFamily="Inter">
                        {val}
                      </text>
                    </g>
                  );
                })}

                {/* Threshold line */}
                <line
                  x1={padding}
                  y1={padding + plotHeight - (gradeThreshold / maxScore) * plotHeight}
                  x2={chartWidth - padding}
                  y2={padding + plotHeight - (gradeThreshold / maxScore) * plotHeight}
                  stroke="#D97706"
                  strokeWidth={1.5}
                  strokeDasharray="6 4"
                />
                <text
                  x={chartWidth - padding}
                  y={padding + plotHeight - (gradeThreshold / maxScore) * plotHeight - 6}
                  textAnchor="end"
                  fontSize={9}
                  fill="#D97706"
                  fontFamily="Inter"
                  fontWeight="bold"
                >
                  {language === 'ar' ? `حد ${gradeThreshold}%` : `Threshold ${gradeThreshold}%`}
                </text>

                {/* Area fill */}
                <motion.path
                  d={areaPath}
                  fill="url(#areaGradient)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3E7B4A" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#3E7B4A" stopOpacity={0} />
                  </linearGradient>
                </defs>

                {/* Line */}
                <motion.path
                  d={linePath}
                  fill="none"
                  stroke="#1E5E3A"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: 'easeInOut' }}
                />

                {/* Data points */}
                {points.map((p, i) => (
                  <motion.g
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8 + i * 0.1, type: 'spring', stiffness: 200 }}
                    style={{ transformOrigin: `${p.x}px ${p.y}px` }}
                  >
                    <circle cx={p.x} cy={p.y} r={5} fill={p.score < gradeThreshold ? '#D97706' : '#1E5E3A'} stroke="#FBFBFA" strokeWidth={2} />
                    <text x={p.x} y={padding + plotHeight + 18} textAnchor="middle" fontSize={10} fill="#5C6470" fontFamily="Cairo">
                      {language === 'ar' ? p.monthAr : p.month}
                    </text>
                    <text x={p.x} y={p.y - 12} textAnchor="middle" fontSize={10} fill="#1C222C" fontWeight="bold" fontFamily="Inter">
                      {p.score}
                    </text>
                  </motion.g>
                ))}
              </svg>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-3 justify-center text-xs font-arabic">
              <span className="flex items-center gap-1.5 text-ink-500">
                <div className="w-3 h-3 rounded-full bg-forest-600" />
                {t('الدرجات', 'Scores', language)}
              </span>
              <span className="flex items-center gap-1.5 text-terracotta-600">
                <div className="w-3 h-0.5 bg-terracotta-500" style={{ borderTop: '2px dashed #D97706' }} />
                {t('حد التنبيه', 'Threshold', language)}
              </span>
            </div>
          </div>

          {/* n8n WhatsApp integration mockup */}
          <div className="bg-cream-50 rounded-2xl shadow-organic p-5 border border-cream-300/40 mt-5">
            <h2 className="font-bold text-ink-800 font-arabic mb-1 flex items-center gap-2">
              <Zap className="text-gold-500" size={18} />
              {t('تكامل الواتساب (n8n)', 'WhatsApp Integration (n8n)', language)}
            </h2>
            <p className="text-xs text-ink-400 font-arabic mb-4">
              {t('محاكاة سير عمل إرسال التنبيهات تلقائياً', 'Simulated workflow of automatic alert sending', language)}
            </p>

            {/* n8n-style flow */}
            <div className="flex items-center gap-2 flex-wrap" style={{ direction: 'ltr' }}>
              {[
                { label: 'Trigger', sub: 'Grade < 70%', color: 'bg-terracotta-100 text-terracotta-700 border-terracotta-200', icon: AlertTriangle },
                { label: 'n8n', sub: 'Workflow', color: 'bg-gold-400/15 text-gold-600 border-gold-400/30', icon: Zap },
                { label: 'WhatsApp API', sub: 'Send', color: 'bg-sage-100 text-sage-500 border-sage-200', icon: Send },
                { label: 'Parent', sub: 'Receive', color: 'bg-forest-100 text-forest-700 border-forest-200', icon: MessageCircle },
              ].map((node, i) => (
                <div key={i} className="flex items-center gap-2">
                  <motion.div
                    className={`px-3 py-2 rounded-xl border ${node.color} text-center min-w-[80px]`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.15 }}
                  >
                    <node.icon size={16} className="mx-auto mb-1" />
                    <p className="text-xs font-bold">{node.label}</p>
                    <p className="text-[10px] opacity-60">{node.sub}</p>
                  </motion.div>
                  {i < 3 && (
                    <motion.div
                      className="flex items-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.15 + 0.1 }}
                    >
                      <div className="w-6 h-0.5 bg-ink-200" />
                      <ChevronDown className="text-ink-200 -rotate-90" size={14} />
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alert center */}
        <div className="lg:col-span-1">
          <div className="bg-cream-50 rounded-2xl shadow-organic overflow-hidden border border-cream-300/40">
            <div className="p-4 border-b border-cream-300">
              <h3 className="font-bold text-ink-800 font-arabic flex items-center gap-2">
                <BellRing className="text-terracotta-500" size={18} />
                {t('مركز التنبيهات', 'Alert Center', language)}
              </h3>
              <p className="text-xs text-ink-400 font-arabic mt-1">
                {alerts.length} {t('تنبيه نشط', 'active alerts', language)}
              </p>
            </div>

            <div className="max-h-[600px] overflow-y-auto scrollbar-thin p-3 space-y-3">
              <AnimatePresence>
                {alerts.map((alert) => {
                  const sev = severityConfig[alert.severity];
                  const typeCfg = alertTypeConfig[alert.type];
                  return (
                    <motion.div
                      key={alert.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: dir === 'rtl' ? -30 : 30 }}
                      className={`relative rounded-xl p-3 border ${sev.bg} ${sev.border}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${sev.badge} bg-opacity-15`}>
                          <typeCfg.icon className={sev.icon} size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs">{typeCfg.emoji}</span>
                            <p className={`text-sm font-bold font-arabic ${sev.icon}`}>
                              {language === 'ar' ? typeCfg.labelAr : typeCfg.labelEn}
                            </p>
                          </div>
                          <p className="text-xs text-ink-500 font-arabic leading-relaxed mb-2">{alert.message}</p>
                          <p className="text-[10px] text-ink-300 font-mono mb-2">{alert.date}</p>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => sendWhatsApp(alert)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sage-100 text-sage-600 text-xs font-bold font-arabic hover:bg-sage-200 transition-colors"
                            >
                              <Send size={11} />
                              {t('إرسال واتساب', 'Send WhatsApp', language)}
                            </button>
                            <button
                              onClick={() => dismissAlert(alert.id)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cream-200 text-ink-400 text-xs font-bold font-arabic hover:bg-cream-300 transition-colors"
                            >
                              <X size={11} />
                              {t('تجاهل', 'Dismiss', language)}
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {alerts.length === 0 && (
                <div className="p-8 text-center">
                  <CheckCircle2 className="text-forest-300 mx-auto mb-2" size={32} />
                  <p className="text-sm text-ink-400 font-arabic">
                    {t('لا توجد تنبيهات نشطة', 'No active alerts', language)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Threshold modal */}
      <AnimatePresence>
        {showThresholdModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm" onClick={() => setShowThresholdModal(false)} />
            <motion.div
              className="relative bg-cream-50 rounded-3xl shadow-organic-xl max-w-sm w-full p-6"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <button
                onClick={() => setShowThresholdModal(false)}
                className="absolute top-4 p-1.5 rounded-lg bg-cream-200 text-ink-400 hover:bg-cream-300"
                style={{ [dir === 'rtl' ? 'left' : 'right']: 16 } as React.CSSProperties}
              >
                <X size={18} />
              </button>

              <div className="w-12 h-12 rounded-xl bg-terracotta-100 flex items-center justify-center mb-4">
                <Settings className="text-terracotta-600" size={24} />
              </div>
              <h3 className="font-bold text-ink-800 font-arabic mb-1">
                {t('حد تنبيه الدرجات', 'Grade Alert Threshold', language)}
              </h3>
              <p className="text-xs text-ink-400 font-arabic mb-5">
                {t('سيتم إرسال تنبيه إذا حصل الطالب على أقل من هذه النسبة', 'Alert will be sent if student scores below this percentage', language)}
              </p>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-arabic text-ink-500">{t('الحد الأدنى', 'Minimum', language)}</span>
                  <span className="text-2xl font-bold text-terracotta-600">{gradeThreshold}%</span>
                </div>
                <input
                  type="range"
                  min={40}
                  max={95}
                  step={5}
                  value={gradeThreshold}
                  onChange={(e) => setGradeThreshold(Number(e.target.value))}
                  className="w-full accent-terracotta-500"
                />
                <div className="flex justify-between text-[10px] text-ink-300 mt-1 font-mono">
                  <span>40%</span>
                  <span>95%</span>
                </div>
              </div>

              <button
                onClick={() => setShowThresholdModal(false)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-br from-terracotta-500 to-terracotta-600 text-cream-100 font-bold text-sm font-arabic hover:shadow-warm transition-all"
              >
                {t('حفظ الإعدادات', 'Save Settings', language)}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WhatsApp log modal */}
      <AnimatePresence>
        {showWhatsAppLog && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm" onClick={() => setShowWhatsAppLog(null)} />
            <motion.div
              className="relative bg-cream-50 rounded-3xl shadow-organic-xl max-w-sm w-full overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              {/* WhatsApp header */}
              <div className="relative p-4" style={{ background: 'linear-gradient(135deg, #075E54 0%, #128C7E 100%)' }}>
                <button
                  onClick={() => setShowWhatsAppLog(null)}
                  className="absolute top-4 p-1.5 rounded-lg bg-cream-100/15 text-cream-100 hover:bg-cream-100/25"
                  style={{ [dir === 'rtl' ? 'left' : 'right']: 12 } as React.CSSProperties}
                >
                  <X size={18} />
                </button>
                <div className="flex items-center gap-2">
                  <MessageCircle className="text-cream-100" size={20} />
                  <div>
                    <h3 className="text-sm font-bold text-cream-100 font-arabic">WhatsApp API Log</h3>
                    <p className="text-cream-200/60 text-[10px] font-arabic">{t('محاكاة إرسال عبر n8n', 'Simulated send via n8n', language)}</p>
                  </div>
                </div>
              </div>

              {/* Chat mockup */}
              <div className="p-4" style={{ background: '#ECE5DD' }}>
                <div className="bg-[#DCF8C6] rounded-2xl p-3 shadow-sm mb-2" style={{ [dir === 'rtl' ? 'marginRight' : 'marginLeft']: 'auto', maxWidth: '85%' } as React.CSSProperties}>
                  <p className="text-xs text-ink-800 font-arabic leading-relaxed">
                    {showWhatsAppLog.type === 'absent' && t('تنبيه لولي الأمر: تغيب الطالب أحمد عن حصة الفيزياء يوم 12 أكتوبر. يرجى المتابعة.', 'Parent alert: Student Ahmed was absent from Physics class on October 12. Please follow up.', language)}
                    {showWhatsAppLog.type === 'low-grade' && t('تنبيه لولي الأمر: انخفضت درجة الطالب إلى 68% (أقل من الحد 70%). يرجى المتابعة.', 'Parent alert: Student score dropped to 68% (below 70% threshold). Please follow up.', language)}
                    {showWhatsAppLog.type === 'missing-homework' && t('تنبيه لولي الأمر: لم يقم الطالب بتسليم واجب الرياضيات المستحق في 20 أكتوبر.', 'Parent alert: Student has not submitted Math homework due October 20.', language)}
                  </p>
                  <p className="text-[9px] text-ink-400 mt-1 text-end font-mono">
                    {whatsappSent ? '✓✓ Delivered' : '⏳ Sending...'} • 10:42 AM
                  </p>
                </div>

                {/* API log */}
                <div className="bg-ink-800 rounded-xl p-3 mt-3 font-mono text-[10px] text-sage-300">
                  <p className="text-cream-200/50 mb-1">{'>'} POST /messages/send</p>
                  <p className="text-cream-200/70">{'{'}"to": "+9665X...",</p>
                  <p className="text-cream-200/70"> "type": "alert",</p>
                  <p className="text-cream-200/70"> "priority": "{showWhatsAppLog.severity}"{'}'}</p>
                  <motion.p
                    className={whatsappSent ? 'text-sage-300' : 'text-terracotta-300'}
                    animate={whatsappSent ? {} : { opacity: [1, 0.3, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >
                    {whatsappSent ? '< 200 OK • Message sent' : '< 202 Accepted • Processing...'}
                  </motion.p>
                </div>

                {whatsappSent && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 mt-3 text-xs text-forest-600 font-arabic"
                  >
                    <CheckCircle2 size={14} />
                    {t('تم إرسال التنبيه بنجاح', 'Alert sent successfully', language)}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
