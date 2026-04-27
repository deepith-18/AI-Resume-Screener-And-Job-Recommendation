/**
 * services/api.ts — FINAL PRODUCTION VERSION
 * Optimized for React Native & Render Backend
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  ApiResponse,
  UploadResponse,
  ResumeAnalysis,
  JobMatchResult,
} from '../utils/types';

// ─── CONFIGURATION ──────────────────────────────────

const BASE_URL = 'https://resume-backend-q39r.onrender.com';

const apiClient: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 30000, 
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── INTERCEPTORS ─────────────────────────────────

apiClient.interceptors.request.use(
  (config) => {
    if (__DEV__) {
      console.log(`🌐 API [${config.method?.toUpperCase()}] ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse<unknown>>) => {
    const message = error.response?.data?.error || error.message || 'Network Error';
    const statusCode = error.response?.status || 0;

    const cleanError = new Error(message) as Error & { statusCode: number };
    cleanError.statusCode = statusCode;

    console.error(`❌ API Error [${statusCode}]:`, message);
    return Promise.reject(cleanError);
  }
);

// ─── RESUME API ─────────────────────────────────

export const uploadResume = async (
  fileUri: string,
  fileName: string,
  mimeType: string,
  onProgress?: (progress: number) => void
): Promise<UploadResponse> => {
  const formData = new FormData();

  // @ts-ignore - Required for React Native FormData
  formData.append('resume', {
    uri: fileUri,
    name: fileName,
    type: mimeType,
  });

  const response = await apiClient.post<ApiResponse<UploadResponse>>(
    '/resume/upload',
    formData,
    {
      timeout: 120000, // Extra time for Render cold starts + File upload
      headers: {
        Accept: 'application/json',
        // Note: Content-Type is intentionally omitted for FormData
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          onProgress(progress);
        }
      },
    }
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Upload failed');
  }

  return response.data.data;
};

/**
 * ✅ FIXED getResume (Hybrid Mode)
 * Handles both {success:true, data:{}} AND raw {} responses from backend.
 */
export const getResume = async (resumeId: string): Promise<ResumeAnalysis> => {
  const response = await apiClient.get<any>(`/resume/${resumeId}`);

  if (__DEV__) {
    console.log("🔍 RAW GET_RESUME RESPONSE:", response.data);
  }

  // Check if response is wrapped in standard ApiResponse format
  if (response.data && response.data.hasOwnProperty('success')) {
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch resume');
    }
    return response.data.data;
  }

  // Fallback: If backend just returns the object directly
  return response.data as ResumeAnalysis;
};

export const listResumes = async (): Promise<ResumeAnalysis[]> => {
  const response = await apiClient.get<ApiResponse<ResumeAnalysis[]>>('/resume');

  if (!response.data.success) {
    throw new Error(response.data.error || 'Failed to fetch resumes');
  }

  return response.data.data || [];
};

export const analyzeResume = async (resumeId: string): Promise<ResumeAnalysis> => {
  const response = await apiClient.post<ApiResponse<ResumeAnalysis>>(
    `/resume/analyze/${resumeId}`
  );

  if (!response.data.success) {
    throw new Error(response.data.error || 'Analysis failed');
  }

  return response.data.data || ({} as ResumeAnalysis);
};

// ─── JOB API ─────────────────────────────────

export const getJobRecommendations = async (
  resumeId: string,
  refresh = false
): Promise<JobMatchResult> => {
  const url = `/jobs/recommend/${resumeId}${refresh ? '?refresh=true' : ''}`;
  const response = await apiClient.post<ApiResponse<JobMatchResult>>(url);

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to generate recommendations');
  }

  return response.data.data;
};

// ─── UTILS & AUTH ───────────────────────────────

export const checkHealth = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get('/health', { timeout: 10000 });
    return response.data.status === 'ok' || response.data.success === true;
  } catch {
    return false;
  }
};

export const loginUser = async (email: string, password: string) => {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data;
};

export const registerUser = async (name: string, email: string, password: string) => {
  const response = await apiClient.post('/auth/register', { name, email, password });
  return response.data;
};

export default apiClient;