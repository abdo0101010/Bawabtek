export type Language = 'ar' | 'en';
export type Direction = 'rtl' | 'ltr';
export type Role = 'student' | 'teacher';
export type ViewKey = 'dashboard' | 'study' | 'assignments' | 'attendance' | 'reports';

export interface User {
  id: string;
  name: string;
  role: Role;
  grade: string;
  avatar: string;
}

export interface Course {
  id: string;
  title: string;
  titleEn: string;
  teacher: string;
  type: 'online' | 'offline';
  price: number;
  progress: number;
  lessons: number;
  color: string;
  purchased: boolean;
  emoji: string;
}

export interface VideoLesson {
  id: string;
  courseId: string;
  title: string;
  duration: string;
  watched: boolean;
  thumbnail: string;
}

export interface Assignment {
  id: string;
  title: string;
  courseTitle: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  grade?: number;
  fileName?: string;
  submittedDate?: string;
}

export interface AttendanceRecord {
  id: string;
  studentName: string;
  avatar: string;
  barcode: string;
  status: 'present' | 'absent' | 'late';
  time: string;
  courseTitle: string;
  enrolled: boolean;
}

export interface GradeEntry {
  month: string;
  monthAr: string;
  score: number;
  attendance: number;
  homework: number;
}

export interface AlertItem {
  id: string;
  type: 'absent' | 'low-grade' | 'missing-homework';
  title: string;
  message: string;
  date: string;
  severity: 'high' | 'medium' | 'low';
}

export interface ScannedStudent {
  name: string;
  avatar: string;
  barcode: string;
  enrolled: boolean;
}
