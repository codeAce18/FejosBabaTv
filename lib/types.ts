// ─── Roles ───
export type Role = 'ADMIN' | 'STUDENT' | 'PREMIUM';

// ─── User ───
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  studentProfile?: StudentProfile | null;
  premiumSubscription?: PremiumSubscription | null;
}

// ─── Auth ───
export interface AuthData {
  user: User;
  token: string;
}

// ─── Premium ───
export interface PremiumSubscription {
  id: string;
  userId: string;
  plan: 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
  isActive: boolean;
}

// ─── Movie ───
export interface MovieCrew {
  writtenBy?: string;
  director?: string;
  producer?: string;
  continuity?: string;
  editor?: string;
  light?: string;
  dop?: string;
  productionManager?: string;
  sound?: string;
}

export interface Movie {
  id: string;
  title: string;
  description: string;
  genre: string;
  thumbnail: string;
  heroImage?: string | null;
  trailerUrl: string;
  fullMovieUrl?: string;
  isPremium: boolean;
  releaseYear?: number;
  cast?: string[] | null;
  crew?: MovieCrew | null;
  views: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Program Registration ───
export interface ProgramRegistration {
  id: string;
  fullName: string;
  preferredName?: string | null;
  gender: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  address: string;
  state: string;
  lga: string;
  occupation: string;
  church?: string | null;
  bornAgain: boolean;
  yearsFollowingChrist?: string | null;
  baptizedWater?: boolean | null;
  baptizedHolySpirit?: boolean | null;
  premFan: boolean;
  knownFejosDuration?: string | null;
  whyRegister: string;
  expectations: string;
  heardVia: string[];
  emergencyContact: string;
  medicalInfo?: string | null;
  accommodation?: string | null;
  mediaConsent: boolean;
  additionalInfo?: string | null;
  agreedToRules: boolean;
  createdAt: string;
}

// ─── Stream ───
export interface StreamData {
  type: 'trailer' | 'full';
  url: string;
  title: string;
}

// ─── Student ───
export interface StudentProfile {
  id: string;
  userId: string;
  admissionNumber: string;
  phone?: string;
  address?: string;
  department: string;
  level: string;
  createdAt: string;
  enrollments?: Enrollment[];
  results?: Result[];
}

// ─── Course ───
export interface Course {
  id: string;
  name: string;
  code: string;
  description?: string;
  creditUnits: number;
  semester: string;
  level: string;
  createdAt: string;
}

// ─── Enrollment ───
export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  session: string;
  semester: string;
  createdAt: string;
  course: Course;
}

// ─── Result ───
export interface Result {
  id: string;
  studentId: string;
  courseId: string;
  score: number;
  grade: string;
  session: string;
  semester: string;
  createdAt: string;
  course: Course;
}

// ─── Results with GPA ───
export interface ResultsData {
  results: Result[];
  gpa: number;
  totalCreditUnits: number;
}

// ─── Exam ───
export interface Exam {
  id: string;
  title: string;
  courseId: string;
  duration: number;
  totalMarks: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
  createdAt: string;
  course: { name: string; code: string };
  _count?: { questions: number; examAttempts: number };
}

// ─── Question (no correct answer) ───
export interface Question {
  id: string;
  examId: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
}

// ─── Exam Attempt ───
export interface ExamAttempt {
  id: string;
  userId: string;
  examId: string;
  score?: number;
  startedAt: string;
  submittedAt?: string;
  exam: {
    title: string;
    totalMarks: number;
    course: { name: string; code: string };
  };
}

// ─── Dashboard Stats ───
export interface DashboardStats {
  totalMovies: number;
  totalStudents: number;
  totalPremiumUsers: number;
  totalViews: number;
  recentMovies: Pick<Movie, 'id' | 'title' | 'views' | 'createdAt'>[];
  recentStudents: (Pick<User, 'id' | 'name' | 'email' | 'createdAt'> & {
    studentProfile: Pick<StudentProfile, 'admissionNumber' | 'department'> | null;
  })[];
}

// ─── API Response ───
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}