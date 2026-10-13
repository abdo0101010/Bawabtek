import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AppProvider, useApp } from './store';
import { LandingPage } from './components/LandingPage';
import { AuthScreen } from './components/AuthScreen';
import { DashboardLayout } from './components/DashboardLayout';
import { StudentDashboard } from './components/StudentDashboard';
import { StudyHub } from './components/StudyHub';
import { Assignments } from './components/Assignments';
import { AttendanceScanner } from './components/AttendanceScanner';
import { GradeReports } from './components/GradeReports';

function AppContent() {
  const { isAuthed, showLanding, currentView, role, dir, language } = useApp();

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [dir, language]);

  if (!isAuthed && showLanding) {
    return <LandingPage />;
  }

  if (!isAuthed) {
    return <AuthScreen />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <StudentDashboard />;
      case 'study':
        return role === 'student' ? <StudyHub /> : <AttendanceScanner />;
      case 'assignments':
        return role === 'student' ? <Assignments /> : <AttendanceScanner />;
      case 'attendance':
        return <AttendanceScanner />;
      case 'reports':
        return <GradeReports />;
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <DashboardLayout>
      <AnimatePresence mode="wait">
        {renderView()}
      </AnimatePresence>
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
