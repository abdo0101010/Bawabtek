import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  Award,
  X,
  FileCheck,
  AlertCircle,
  Calendar,
  CloudUpload,
} from 'lucide-react';
import { useApp, t } from '../store';
import { MOCK_ASSIGNMENTS } from '../mockData';
import type { Assignment } from '../types';

export function Assignments() {
  const { language, dir } = useApp();
  const [assignments, setAssignments] = useState(MOCK_ASSIGNMENTS);
  const [uploadTarget, setUploadTarget] = useState<Assignment | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const pending = assignments.filter((a) => a.status === 'pending');
  const submitted = assignments.filter((a) => a.status === 'submitted');
  const graded = assignments.filter((a) => a.status === 'graded');

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    startUpload();
  };

  const startUpload = () => {
    setUploading(true);
    setUploaded(false);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          setUploaded(true);
          confetti({
            particleCount: 60,
            spread: 60,
            origin: { y: 0.5 },
            colors: ['#3E7B4A', '#D97706', '#C9A227'],
          });
          if (uploadTarget) {
            setAssignments((prev) =>
              prev.map((a) =>
                a.id === uploadTarget.id
                  ? { ...a, status: 'submitted', fileName: `${a.title}.pdf`, submittedDate: new Date().toISOString().slice(0, 10) }
                  : a
              )
            );
          }
          return 100;
        }
        return prev + 8;
      });
    }, 80);
  };

  const handleCloseModal = () => {
    setUploadTarget(null);
    setDragging(false);
    setUploading(false);
    setUploaded(false);
    setUploadProgress(0);
  };

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink-800 font-arabic flex items-center gap-2 mb-1">
          <FileText className="text-forest-500" size={26} />
          {t('الواجبات', 'Assignments', language)}
        </h1>
        <p className="text-sm text-ink-400 font-arabic">
          {t('سلّم واجباتك وتابع درجاتك', 'Submit your assignments and track your grades', language)}
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { labelAr: 'منتظر', labelEn: 'Pending', value: pending.length, icon: Clock, color: 'terracotta' },
          { labelAr: 'مُسلَّم', labelEn: 'Submitted', value: submitted.length, icon: FileCheck, color: 'sage' },
          { labelAr: 'مصحح', labelEn: 'Graded', value: graded.length, icon: Award, color: 'gold' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            className="bg-cream-50 rounded-2xl p-4 shadow-organic border border-cream-300/40"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -3 }}
          >
            <stat.icon className={`mb-2 ${stat.color === 'terracotta' ? 'text-terracotta-500' : stat.color === 'sage' ? 'text-sage-500' : 'text-gold-500'}`} size={20} />
            <p className="text-2xl font-bold text-ink-800">{stat.value}</p>
            <p className="text-xs text-ink-400 font-arabic">{language === 'ar' ? stat.labelAr : stat.labelEn}</p>
          </motion.div>
        ))}
      </div>

      {/* Assignment lists */}
      <div className="space-y-6">
        {/* Pending */}
        {pending.length > 0 && (
          <AssignmentSection
            title={t('واجبات منتظرة', 'Pending Assignments', language)}
            icon={Clock}
            color="terracotta"
            assignments={pending}
            language={language}
            dir={dir}
            onUpload={(a) => setUploadTarget(a)}
          />
        )}

        {/* Submitted */}
        {submitted.length > 0 && (
          <AssignmentSection
            title={t('واجبات مُسلَّمة', 'Submitted Assignments', language)}
            icon={FileCheck}
            color="sage"
            assignments={submitted}
            language={language}
            dir={dir}
          />
        )}

        {/* Graded */}
        {graded.length > 0 && (
          <AssignmentSection
            title={t('واجبات مصححة', 'Graded Assignments', language)}
            icon={Award}
            color="gold"
            assignments={graded}
            language={language}
            dir={dir}
          />
        )}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {uploadTarget && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm" onClick={handleCloseModal} />

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
                  onClick={handleCloseModal}
                  className="absolute top-4 p-1.5 rounded-lg bg-cream-100/15 text-cream-100 hover:bg-cream-100/25"
                  style={{ [dir === 'rtl' ? 'left' : 'right']: 16 } as React.CSSProperties}
                >
                  <X size={18} />
                </button>
                <h3 className="text-lg font-bold text-cream-100 font-arabic">{uploadTarget.title}</h3>
                <p className="text-cream-200/60 text-xs font-arabic">{uploadTarget.courseTitle}</p>
              </div>

              <div className="p-5">
                {!uploading && !uploaded && (
                  <motion.div
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    onClick={startUpload}
                    className={`relative border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-all overflow-hidden ${
                      dragging ? 'border-forest-500 bg-forest-50 scale-[1.02]' : 'border-cream-400/80 bg-cream-100 hover:border-forest-300 hover:bg-cream-50'
                    }`}
                  >
                    <motion.div
                      animate={dragging ? { y: [0, -8, 0] } : { y: 0 }}
                      transition={{ duration: 0.8, repeat: dragging ? Infinity : 0 }}
                      className="flex flex-col items-center gap-3"
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                        dragging ? 'bg-forest-100' : 'bg-cream-200'
                      }`}>
                        <CloudUpload className={dragging ? 'text-forest-600' : 'text-ink-400'} size={28} />
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-ink-700 font-arabic text-sm">
                          {t('اسحب الملف هنا أو اضغط للرفع', 'Drag file here or click to upload', language)}
                        </p>
                        <p className="text-xs text-ink-400 font-arabic mt-1">
                          {t('PDF, DOCX, PNG — حتى 10MB', 'PDF, DOCX, PNG — up to 10MB', language)}
                        </p>
                      </div>
                    </motion.div>

                    {dragging && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-forest-400/10 to-sage-400/10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      />
                    )}
                  </motion.div>
                )}

                {uploading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center py-8"
                  >
                    <motion.div
                      className="w-14 h-14 rounded-2xl bg-forest-100 flex items-center justify-center mb-4"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Upload className="text-forest-600" size={28} />
                    </motion.div>
                    <div className="w-full max-w-[200px] h-2.5 bg-cream-300 rounded-full overflow-hidden mb-3">
                      <motion.div
                        className="h-full bg-gradient-to-br from-forest-400 to-forest-600 rounded-full"
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ ease: 'linear' }}
                      />
                    </div>
                    <p className="text-sm font-arabic text-ink-500 font-semibold">
                      {t('جاري الرفع...', 'Uploading...', language)} {uploadProgress}%
                    </p>
                  </motion.div>
                )}

                {uploaded && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center py-8 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                      className="w-14 h-14 rounded-full bg-forest-100 flex items-center justify-center mb-3"
                    >
                      <CheckCircle2 className="text-forest-600" size={32} />
                    </motion.div>
                    <p className="font-bold text-ink-800 font-arabic mb-1">
                      {t('تم التسليم بنجاح! 🎉', 'Submitted successfully! 🎉', language)}
                    </p>
                    <p className="text-xs text-ink-400 font-arabic">
                      {t('سيتم تصحيح الواجب قريباً', 'Your assignment will be graded soon', language)}
                    </p>
                    <button
                      onClick={handleCloseModal}
                      className="mt-4 px-6 py-2 rounded-xl bg-gradient-to-br from-forest-500 to-forest-700 text-cream-100 font-bold text-sm font-arabic hover:shadow-organic-lg transition-all"
                    >
                      {t('تم', 'Done', language)}
                    </button>
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

function AssignmentSection({
  title,
  icon: Icon,
  color,
  assignments,
  language,
  dir,
  onUpload,
}: {
  title: string;
  icon: typeof Clock;
  color: string;
  assignments: Assignment[];
  language: 'ar' | 'en';
  dir: string;
  onUpload?: (a: Assignment) => void;
}) {
  const colorClass = color === 'terracotta' ? 'text-terracotta-500' : color === 'sage' ? 'text-sage-500' : 'text-gold-500';
  const bgClass = color === 'terracotta' ? 'bg-terracotta-50' : color === 'sage' ? 'bg-sage-50' : 'bg-cream-100';

  return (
    <div>
      <h2 className="text-sm font-bold text-ink-700 font-arabic mb-3 flex items-center gap-2">
        <Icon className={colorClass} size={18} />
        {title}
        <span className="text-xs text-ink-400 font-normal">({assignments.length})</span>
      </h2>
      <div className="space-y-3">
        {assignments.map((assignment, i) => (
          <motion.div
            key={assignment.id}
            className={`bg-cream-50 rounded-2xl p-4 shadow-organic border border-cream-300/40 flex items-center gap-4`}
            initial={{ opacity: 0, x: dir === 'rtl' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -2, boxShadow: '0 8px 32px -6px rgba(15,56,35,0.15)' }}
          >
            <div className={`w-11 h-11 rounded-xl ${bgClass} flex items-center justify-center shrink-0`}>
              <Icon className={colorClass} size={20} />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-ink-800 font-arabic text-sm truncate">{assignment.title}</h3>
              <p className="text-xs text-ink-400 font-arabic">{assignment.courseTitle}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1 text-xs text-ink-400 font-arabic">
                  <Calendar size={11} />
                  {assignment.dueDate}
                </span>
                {assignment.fileName && (
                  <span className="flex items-center gap-1 text-xs text-sage-600 font-arabic">
                    <FileCheck size={11} />
                    {assignment.fileName}
                  </span>
                )}
              </div>
            </div>

            {assignment.status === 'graded' && assignment.grade !== undefined && (
              <div className="flex flex-col items-center shrink-0">
                <div className={`px-3 py-1.5 rounded-xl font-bold text-sm ${
                  assignment.grade >= 90 ? 'bg-forest-100 text-forest-700' :
                  assignment.grade >= 70 ? 'bg-gold-400/15 text-gold-600' :
                  'bg-terracotta-100 text-terracotta-700'
                }`}>
                  {assignment.grade}%
                </div>
              </div>
            )}

            {assignment.status === 'pending' && onUpload && (
              <button
                onClick={() => onUpload(assignment)}
                className="px-4 py-2 rounded-xl bg-gradient-to-br from-forest-500 to-forest-700 text-cream-100 font-bold text-xs font-arabic hover:shadow-organic-lg transition-all flex items-center gap-1.5 shrink-0"
              >
                <Upload size={14} />
                {t('تسليم', 'Submit', language)}
              </button>
            )}

            {assignment.status === 'submitted' && (
              <div className="flex items-center gap-1 text-xs text-sage-600 font-arabic shrink-0">
                <CheckCircle2 size={14} />
                {t('بانتظار التصحيح', 'Awaiting grading', language)}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
