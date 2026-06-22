import axios from 'axios';
import type { ApiResponse } from './types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// ─── Axios instance ───
const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// ─── Request interceptor — attach token ───
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('fejos_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ─── Response interceptor — handle 401 ───
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('fejos_token');
        localStorage.removeItem('fejos_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ─── Helper to extract error message ───
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || 'Something went wrong';
  }
  return 'Something went wrong';
};

// ─────────────────────────────────────
// AUTH
// ─────────────────────────────────────

export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse>('/api/auth/login', data),

  registerPremium: (data: {
    name: string; email: string; password: string; plan: string;
  }) => api.post<ApiResponse>('/api/auth/register/premium', data),

  registerStudent: (data: {
    name: string; email: string; password: string;
    admissionNumber: string; department: string; level: string;
    phone?: string; address?: string;
  }) => api.post<ApiResponse>('/api/auth/register/student', data),

  getMe: () => api.get<ApiResponse>('/api/auth/me'),
  
};



// ─────────────────────────────────────
// PAYMENT (Paystack — two-step verified flow)
// ─────────────────────────────────────
 
export const paymentApi = {
  // Step 1: call BEFORE opening the Paystack popup.
  // Returns { reference, amount } — does NOT create an account yet.
  initialize: (data: { name: string; email: string; password: string; plan: string }) =>
    api.post<ApiResponse>('/api/payment/initialize', data),
 
  // Step 2: call AFTER the Paystack popup callback fires.
  // This independently re-verifies with Paystack and only then creates
  // the account. Returns { user, token } on success.
  verify: (reference: string) =>
    api.post<ApiResponse>(`/api/payment/verify/${reference}`),
};
 

// ─────────────────────────────────────
// MOVIES
// ─────────────────────────────────────

export const moviesApi = {
  getAll: () => api.get<ApiResponse>('/api/movies'),
  getById: (id: string) => api.get<ApiResponse>(`/api/movies/${id}`),
  getStreamUrl: (id: string) => api.get<ApiResponse>(`/api/movies/${id}/stream`),
  trackView: (id: string) => api.post<ApiResponse>(`/api/movies/${id}/view`),
  create: (data: object) => api.post<ApiResponse>('/api/movies', data),
  update: (id: string, data: object) => api.patch<ApiResponse>(`/api/movies/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse>(`/api/movies/${id}`),
};

// ─────────────────────────────────────
// ADMIN
// ─────────────────────────────────────

export const adminApi = {
  getDashboard: () => api.get<ApiResponse>('/api/admin/dashboard'),

  // Students
  getStudents: () => api.get<ApiResponse>('/api/admin/students'),
  getStudentById: (id: string) => api.get<ApiResponse>(`/api/admin/students/${id}`),
  createStudent: (data: object) => api.post<ApiResponse>('/api/admin/students', data),
  deleteStudent: (id: string) => api.delete<ApiResponse>(`/api/admin/students/${id}`),

  // Courses
  getCourses: () => api.get<ApiResponse>('/api/admin/courses'),
  createCourse: (data: object) => api.post<ApiResponse>('/api/admin/courses', data),
  updateCourse: (id: string, data: object) => api.patch<ApiResponse>(`/api/admin/courses/${id}`, data),
  deleteCourse: (id: string) => api.delete<ApiResponse>(`/api/admin/courses/${id}`),

  // Results
  uploadResult: (data: object) => api.post<ApiResponse>('/api/admin/results', data),

  // Premium
  getPremiumUsers: () => api.get<ApiResponse>('/api/admin/premium'),
  revokePremium: (id: string) => api.patch<ApiResponse>(`/api/admin/premium/${id}/revoke`),

  // Exams
  getExams: () => api.get<ApiResponse>('/api/admin/exams'),
  createExam: (data: object) => api.post<ApiResponse>('/api/admin/exams', data),
  addQuestions: (examId: string, data: object) => api.post<ApiResponse>(`/api/admin/exams/${examId}/questions`, data),
  toggleExam: (examId: string) => api.patch<ApiResponse>(`/api/admin/exams/${examId}/toggle`),
  deleteExam: (examId: string) => api.delete<ApiResponse>(`/api/admin/exams/${examId}`),
  getExamResults: (examId: string) => api.get<ApiResponse>(`/api/admin/exams/${examId}/results`),
};

// ─────────────────────────────────────
// STUDENT
// ─────────────────────────────────────

export const studentApi = {
  getProfile: () => api.get<ApiResponse>('/api/student/profile'),
  updateProfile: (data: object) => api.patch<ApiResponse>('/api/student/profile', data),
  getCourses: () => api.get<ApiResponse>('/api/student/courses'),
  registerCourses: (data: object) => api.post<ApiResponse>('/api/student/courses/register', data),
  getEnrollments: () => api.get<ApiResponse>('/api/student/courses/enrolled'),
  getResults: (session?: string) => api.get<ApiResponse>(`/api/student/results${session ? `?session=${session}` : ''}`),
  getExams: () => api.get<ApiResponse>('/api/student/exams'),
  getExamHistory: () => api.get<ApiResponse>('/api/student/exams/history'),
  startExam: (examId: string) => api.post<ApiResponse>(`/api/student/exams/${examId}/start`),
  submitExam: (examId: string, data: object) => api.post<ApiResponse>(`/api/student/exams/${examId}/submit`, data),
};

export default api;