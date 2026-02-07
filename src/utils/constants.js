// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent',
};

// Gender Options
export const GENDER_OPTIONS = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
];

// Attendance Status
export const ATTENDANCE_STATUS = {
  PRESENT: 'Present',
  ABSENT: 'Absent',
  LATE: 'Late',
  EXCUSED: 'Excused',
};

export const ATTENDANCE_OPTIONS = [
  { value: 'Present', label: 'Present', color: 'bg-green-500' },
  { value: 'Absent', label: 'Absent', color: 'bg-red-500' },
  { value: 'Late', label: 'Late', color: 'bg-yellow-500' },
  { value: 'Excused', label: 'Excused', color: 'bg-blue-500' },
];

// Exam Types
export const EXAM_TYPES = [
  { value: 'midterm', label: 'Midterm Exam' },
  { value: 'final', label: 'Final Exam' },
  { value: 'quiz', label: 'Quiz' },
  { value: 'assignment', label: 'Assignment' },
  { value: 'test', label: 'Class Test' },
];

// Grade Levels
export const GRADE_LEVELS = [
  { value: 'A+', label: 'A+', min: 90, max: 100 },
  { value: 'A', label: 'A', min: 85, max: 89 },
  { value: 'B+', label: 'B+', min: 80, max: 84 },
  { value: 'B', label: 'B', min: 75, max: 79 },
  { value: 'C+', label: 'C+', min: 70, max: 74 },
  { value: 'C', label: 'C', min: 65, max: 69 },
  { value: 'D', label: 'D', min: 50, max: 64 },
  { value: 'F', label: 'F', min: 0, max: 49 },
];

// Days of the Week
export const DAYS_OF_WEEK = [
  { value: 'Monday', label: 'Monday', short: 'Mon' },
  { value: 'Tuesday', label: 'Tuesday', short: 'Tue' },
  { value: 'Wednesday', label: 'Wednesday', short: 'Wed' },
  { value: 'Thursday', label: 'Thursday', short: 'Thu' },
  { value: 'Friday', label: 'Friday', short: 'Fri' },
  { value: 'Saturday', label: 'Saturday', short: 'Sat' },
  { value: 'Sunday', label: 'Sunday', short: 'Sun' },
];

// Blood Groups
export const BLOOD_GROUPS = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
];

// Months
export const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

// Academic Sessions
export const ACADEMIC_SESSIONS = [
  { value: '2023-2024', label: '2023-2024' },
  { value: '2024-2025', label: '2024-2025' },
  { value: '2025-2026', label: '2025-2026' },
  { value: '2026-2027', label: '2026-2027' },
];

// Fee Status
export const FEE_STATUS = {
  PAID: 'Paid',
  PENDING: 'Pending',
  OVERDUE: 'Overdue',
  PARTIAL: 'Partial',
};

// Pagination
export const ITEMS_PER_PAGE = 10;
export const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50, 100];

// App Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  ADMIN_DASHBOARD: '/dashboards/admin',
  STUDENTS: '/dashboards/admin/students',
  CLASSES: '/dashboards/admin/classes',
  TEACHERS: '/dashboards/admin/teachers',
  SUBJECTS: '/dashboards/admin/subjects',
  EXAMS: '/dashboards/admin/exams',
  ATTENDANCE: '/dashboards/admin/attendance',
};