/**
 * services/api.ts — FINAL FIXED VERSION
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  ApiResponse,
  UploadResponse,
  ResumeAnalysis,
  JobMatchResult,
} from '../utils/types';

// 🔥 FIXED BASE URL
// 👉 Use your PC IP (NO SPACE, MUST include http://)
const BASE_URL = 'http://192.168.1.179:5001';

// ─── AXIOS INSTANCE ─────────────────────────────────

const apiClient: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── INTERCEPTORS ─────────────────────────────────

apiClient.interceptors.request.use(
  (config) => {
    if (__DEV__) {
      console.log(`🌐 API [${config.method?.toUpperCase()}] ${config.baseURL}${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse<unknown>>) => {
    const message =
      error.response?.data?.error ||
      error.message ||
      'Network Error';

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

  formData.append('resume', {
    uri: fileUri,
    name: fileName,
    type: mimeType,
  } as any);

  const response = await apiClient.post<ApiResponse<UploadResponse>>(
    '/resume/upload',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000,
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
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

export const analyzeResume = async (
  resumeId: string
): Promise<ResumeAnalysis> => {
  const response = await apiClient.post<ApiResponse<ResumeAnalysis>>(
    `/resume/analyze/${resumeId}`
  );

  if (!response.data.success) {
    throw new Error(response.data.error || 'Analysis failed');
  }

  return response.data.data || ({} as ResumeAnalysis); // ✅ NEVER NULL
};

export const getResume = async (
  resumeId: string
): Promise<ResumeAnalysis> => {
  const response = await apiClient.get(`/resume/${resumeId}`);

  console.log("GET RESUME RAW:", response.data);

  // ✅ FIX: directly return data
  return response.data;
};

export const listResumes = async (): Promise<ResumeAnalysis[]> => {
  const response = await apiClient.get<ApiResponse<ResumeAnalysis[]>>(
    '/resume'
  );

  if (!response.data.success) {
    throw new Error(response.data.error || 'Failed to fetch resumes');
  }

  return response.data.data || [];
};

// ─── JOB API ─────────────────────────────────

export const getJobRecommendations = async (
  resumeId: string,
  refresh = false
): Promise<JobMatchResult> => {
  const url = `/jobs/recommend/${resumeId}${
    refresh ? '?refresh=true' : ''
  }`;

  const response = await apiClient.post<ApiResponse<JobMatchResult>>(url);

  if (!response.data.success || !response.data.data) {
    throw new Error(
      response.data.error || 'Failed to generate recommendations'
    );
  }

  return response.data.data;
};

export const getStoredRecommendations = async (
  resumeId: string
): Promise<JobMatchResult> => {
  const response = await apiClient.get<ApiResponse<JobMatchResult>>(
    `/jobs/${resumeId}`
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(
      response.data.error || 'Failed to fetch recommendations'
    );
  }

  return response.data.data;
};

export const checkHealth = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get('/health', { timeout: 5000 });
    return response.data.status === 'ok';
  } catch {
    return false;
  }
};

export default apiClient;