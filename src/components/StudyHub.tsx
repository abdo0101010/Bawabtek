import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlayCircle,
  Download,
  FileText,
  CheckCircle2,
  Clock,
  Play,
  Pause,
  Volume2,
  Maximize,
  SkipForward,
  SkipBack,
  Award,
  PenTool,
} from 'lucide-react';
import { useApp, t } from '../store';
import { MOCK_COURSES, MOCK_VIDEO_LESSONS } from '../mockData';
import type { VideoLesson } from '../types';

export function StudyHub() {
  const { language, dir, setCurrentView } = useApp();
  const purchasedCourses = MOCK_COURSES.filter((c) => c.purchased);
  const [selectedCourseId, setSelectedCourseId] = useState(purchasedCourses[0]?.id || 'c1');
  const [selectedLesson, setSelectedLesson] = useState<VideoLesson | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const lessons = MOCK_VIDEO_LESSONS.filter((l) => l.courseId === selectedCourseId);
  const selectedCourse = MOCK_COURSES.find((c) => c.id === selectedCourseId);

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink-800 font-arabic flex items-center gap-2 mb-1">
          <PlayCircle className="text-forest-500" size={26} />
          {t('المشاهدة والمذاكرة', 'Study Hub', language)}
        </h1>
        <p className="text-sm text-ink-400 font-arabic">
          {t('شاهد الدروس، حمّل المواد، واختبر معلوماتك', 'Watch lessons, download materials, and test your knowledge', language)}
        </p>
      </div>

      {/* Course selector tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-thin pb-2">
        {purchasedCourses.map((course) => (
          <button
            key={course.id}
            onClick={() => {
              setSelectedCourseId(course.id);
              setSelectedLesson(null);
              setIsPlaying(false);
            }}
            className={`px-4 py-2 rounded-xl whitespace-nowrap text-sm font-semibold font-arabic transition-all flex items-center gap-2 ${
              selectedCourseId === course.id
                ? 'bg-gradient-to-br from-forest-500 to-forest-700 text-cream-100 shadow-organic'
                : 'bg-cream-50 text-ink-500 border border-cream-400/60 hover:border-forest-300'
            }`}
          >
            <span>{course.emoji}</span>
            {course.title}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Video player */}
        <div className="lg:col-span-2">
          <div className="bg-ink-900 rounded-2xl overflow-hidden shadow-organic-lg relative aspect-video">
            {selectedLesson ? (
              <>
                {/* Simulated video area */}
                <div className="absolute inset-0 flex items-center justify-center" style={{
                  background: `linear-gradient(135deg, #0F3823 0%, #174B2E 50%, #0A2A18 100%)`,
                }}>
                  <motion.div
                    animate={{ scale: isPlaying ? [1, 1.05, 1] : 1 }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-center"
                  >
                    <span className="text-6xl mb-3 block">{selectedCourse?.emoji}</span>
                    <p className="text-cream-100 font-arabic font-bold text-lg mb-1">{selectedLesson.title}</p>
                    <p className="text-cream-200/50 text-sm font-arabic">{selectedLesson.duration}</p>
                  </motion.div>
                </div>

                {/* Play/pause overlay */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="absolute inset-0 flex items-center justify-center group"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-16 h-16 rounded-full bg-cream-100/15 backdrop-blur-sm border-2 border-cream-100/30 flex items-center justify-center group-hover:bg-cream-100/25 transition-all"
                  >
                    {isPlaying ? (
                      <Pause className="text-cream-100" size={24} fill="currentColor" />
                    ) : (
                      <Play className="text-cream-100" size={24} fill="currentColor" style={{ marginLeft: 3 }} />
                    )}
                  </motion.div>
                </button>

                {/* Video controls bar */}
                <div className="absolute bottom-0 left-0 right-0 p-4" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.6))' }}>
                  {/* Progress bar */}
                  <div className="h-1.5 bg-cream-100/20 rounded-full mb-3 cursor-pointer">
                    <motion.div
                      className="h-full bg-sage-300 rounded-full relative"
                      initial={{ width: '0%' }}
                      animate={{ width: isPlaying ? '45%' : '15%' }}
                      transition={{ duration: isPlaying ? 8 : 0.5 }}
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-sage-200 rounded-full shadow-md" />
                    </motion.div>
                  </div>
                  <div className="flex items-center gap-3 text-cream-100">
                    <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-sage-200 transition-colors">
                      {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                    </button>
                    <button className="hover:text-sage-200"><SkipBack size={18} /></button>
                    <button className="hover:text-sage-200"><SkipForward size={18} /></button>
                    <span className="text-xs font-mono">{isPlaying ? '18:30' : '05:20'} / {selectedLesson.duration}</span>
                    <div className="mr-auto flex items-center gap-3">
                      <Volume2 size={18} className="hover:text-sage-200 cursor-pointer" />
                      <Maximize size={18} className="hover:text-sage-200 cursor-pointer" />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <PlayCircle className="text-cream-200/30 mb-3" size={64} />
                <p className="text-cream-200/50 font-arabic">
                  {t('اختر درساً للبدء', 'Select a lesson to start', language)}
                </p>
              </div>
            )}
          </div>

          {/* Download materials & exam */}
          {selectedLesson && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 grid grid-cols-2 gap-3"
            >
              <button className="flex items-center gap-3 p-4 rounded-xl bg-cream-50 border border-cream-400/60 hover:border-forest-300 transition-all text-start group">
                <div className="w-10 h-10 rounded-xl bg-forest-50 flex items-center justify-center">
                  <Download className="text-forest-600" size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-ink-800 font-arabic">{t('تحميل المادة', 'Download Material', language)}</p>
                  <p className="text-xs text-ink-400 font-arabic">PDF • 2.4 MB</p>
                </div>
              </button>
              <button
                onClick={() => setCurrentView('assignments')}
                className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-terracotta-50 to-terracotta-100 border border-terracotta-300/60 hover:border-terracotta-400 transition-all text-start group"
              >
                <div className="w-10 h-10 rounded-xl bg-terracotta-100 flex items-center justify-center">
                  <PenTool className="text-terracotta-600" size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-ink-800 font-arabic">{t('اختبر نفسك', 'Take Exam', language)}</p>
                  <p className="text-xs text-terracotta-600 font-arabic">{t('10 أسئلة', '10 questions', language)}</p>
                </div>
              </button>
            </motion.div>
          )}
        </div>

        {/* Lesson list sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-cream-50 rounded-2xl shadow-organic overflow-hidden">
            <div className="p-4 border-b border-cream-300">
              <h3 className="font-bold text-ink-800 font-arabic flex items-center gap-2">
                <FileText className="text-forest-500" size={18} />
                {t('قائمة الدروس', 'Lesson List', language)}
              </h3>
              <p className="text-xs text-ink-400 font-arabic mt-1">
                {lessons.filter((l) => l.watched).length} / {lessons.length} {t('مكتمل', 'completed', language)}
              </p>
              {/* Course progress */}
              <div className="h-1.5 bg-cream-300 rounded-full mt-2">
                <motion.div
                  className="h-full bg-gradient-to-br from-forest-400 to-forest-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(lessons.filter((l) => l.watched).length / lessons.length) * 100}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
            </div>

            <div className="max-h-[500px] overflow-y-auto scrollbar-thin">
              {lessons.map((lesson, i) => (
                <button
                  key={lesson.id}
                  onClick={() => {
                    setSelectedLesson(lesson);
                    setIsPlaying(false);
                  }}
                  className={`w-full flex items-center gap-3 p-3 text-start transition-all border-b border-cream-200/60 ${
                    selectedLesson?.id === lesson.id
                      ? 'bg-forest-50 border-r-4 border-forest-500'
                      : 'hover:bg-cream-100'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    lesson.watched ? 'bg-forest-100' : selectedLesson?.id === lesson.id ? 'bg-forest-100' : 'bg-cream-200'
                  }`}>
                    {lesson.watched ? (
                      <CheckCircle2 className="text-forest-600" size={18} />
                    ) : (
                      <PlayCircle className={selectedLesson?.id === lesson.id ? 'text-forest-600' : 'text-ink-400'} size={18} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-arabic font-semibold truncate ${selectedLesson?.id === lesson.id ? 'text-forest-700' : 'text-ink-700'}`}>
                      {i + 1}. {lesson.title}
                    </p>
                    <p className="text-xs text-ink-400 flex items-center gap-1 font-arabic">
                      <Clock size={11} />
                      {lesson.duration}
                    </p>
                  </div>
                  {lesson.watched && (
                    <Award className="text-gold-500" size={16} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
