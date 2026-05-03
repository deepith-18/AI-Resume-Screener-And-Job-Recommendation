import * as FileSystem from 'expo-file-system';
import axios, { AxiosInstance, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  timeout: 120000,
  headers: {
    'Accept': 'application/json',
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

// ✅ FIXED UPLOAD (CRITICAL APK VERSION)
export const uploadResume = async (
  fileUri: string,
  fileName: string,
  mimeType: string,
  onProgress?: (progress: number) => void
): Promise<UploadResponse> => {
  const formData = new FormData();
  const userId = await AsyncStorage.getItem('user_id');

  let finalUri = fileUri;

  // 1. APK-safe path: copy content:// URIs into cache
  if (fileUri.startsWith('content://')) {
    // ✅ Use (FileSystem as any) to bypass the property error from your screenshot
    const cacheDir = (FileSystem as any).cacheDirectory;
    const newPath = cacheDir + (fileName || 'resume.pdf');

    await FileSystem.copyAsync({
      from: fileUri,
      to: newPath,
    });

    const fileInfo = await FileSystem.getInfoAsync(newPath);
    if (!fileInfo.exists) {
      throw new Error('Local file cache failed');
    }

    finalUri = newPath;
  }

  // 2. Setup File Object
  const fileToUpload = {
    uri: finalUri,
    name: fileName || 'resume.pdf',
    type: mimeType || 'application/pdf',
  };

  formData.append('resume', fileToUpload as any);
  if (userId) formData.append('userId', userId);

  try {
    // 3. Prevent Render Cold Start
    await checkHealth();

    const response = await apiClient.post<ApiResponse<UploadResponse>>(
      '/resume/upload',
      formData,
      {
        timeout: 120000,
        headers: {
          // ✅ CRITICAL: Force headers for APK multipart stability
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
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

  } catch (error: any) {
    console.error("❌ APK UPLOAD ERROR:", error.message);
    throw error;
  }
};

// ─── REMAINING FUNCTIONS ───────────────────────────

export const getResume = async (resumeId: string): Promise<ResumeAnalysis> => {
  const response = await apiClient.get<any>(`/resume/${resumeId}`);
  if (response.data && response.data.hasOwnProperty('success')) {
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch resume');
    }
    return response.data.data;
  }
  return response.data as ResumeAnalysis;
};

export const listResumes = async () => {
  const userId = await AsyncStorage.getItem('user_id');
  const response = await apiClient.get('/resume', { params: { userId } });
  return response.data.data;
};

export const deleteResume = async (resumeId: string) => {
  const userId = await AsyncStorage.getItem('user_id');
  await checkHealth();

  let response;
  try {
    response = await apiClient.delete(`/resume/${resumeId}`, {
      params: { userId },
    });
  } catch (error) {
    await checkHealth();
    response = await apiClient.delete(`/resume/${resumeId}`, {
      params: { userId },
    });
  }

  if (!response.data?.success) {
    throw new Error(response.data?.error || 'Failed to delete resume');
  }

  return response.data;
};

export const analyzeResume = async (resumeId: string): Promise<ResumeAnalysis> => {
  const response = await apiClient.post<ApiResponse<ResumeAnalysis>>(`/resume/analyze/${resumeId}`);
  if (!response.data.success) throw new Error(response.data.error || 'Analysis failed');
  return response.data.data || ({} as ResumeAnalysis);
};

export const getJobRecommendations = async (resumeId: string, refresh = false): Promise<JobMatchResult> => {
  const url = `/jobs/recommend/${resumeId}${refresh ? '?refresh=true' : ''}`;
  const response = await apiClient.post<ApiResponse<JobMatchResult>>(url);
  if (!response.data.success || !response.data.data) throw new Error(response.data.error || 'Failed to generate recommendations');
  return response.data.data;
};

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
  const res = await apiClient.post('/auth/register', { name, email, password });
  return res.data;
};

export default apiClient;