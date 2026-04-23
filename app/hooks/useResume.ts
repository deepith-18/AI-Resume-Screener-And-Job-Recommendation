/**
 * hooks/useResume.ts — Custom hooks for resume operations
 */

import { useState, useCallback } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import {
  uploadResume,
  analyzeResume,
  getResume,
  getJobRecommendations,
} from '../services/api';
import {
  UploadResponse,
  ResumeAnalysis,
  JobMatchResult,
} from '../utils/types';
import { isValidResumeFile } from '../utils/helpers';

// ─── useResumeUpload ───────────────────────────────────────────────────────────

interface UseResumeUploadReturn {
  isUploading: boolean;
  uploadProgress: number;
  uploadError: string | null;
  uploadedResume: UploadResponse | null;
  pickAndUpload: () => Promise<UploadResponse | null>;
  reset: () => void;
}

export const useResumeUpload = (): UseResumeUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedResume, setUploadedResume] = useState<UploadResponse | null>(null);

  const pickAndUpload = useCallback(async (): Promise<UploadResponse | null> => {
    setUploadError(null);
    setUploadProgress(0);

    try {
      // Open document picker
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/msword',
        ],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return null; // User cancelled
      }

      const file = result.assets[0];

      // Validate file
      if (!isValidResumeFile(file.name)) {
        setUploadError('Only PDF and DOCX files are supported.');
        return null;
      }

      if (file.size && file.size > 10 * 1024 * 1024) {
        setUploadError('File must be under 10MB.');
        return null;
      }

      setIsUploading(true);

      // Determine MIME type
      const mimeType =
        file.mimeType ||
        (file.name.endsWith('.pdf') ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');

      // Upload file
      const uploaded = await uploadResume(
        file.uri,
        file.name,
        mimeType,
        (progress) => setUploadProgress(progress)
      );

      setUploadedResume(uploaded);
      setUploadProgress(100);
      return uploaded;

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Upload failed. Please try again.';
      setUploadError(message);
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsUploading(false);
    setUploadProgress(0);
    setUploadError(null);
    setUploadedResume(null);
  }, []);

  return { isUploading, uploadProgress, uploadError, uploadedResume, pickAndUpload, reset };
};

// ─── useResumeAnalysis ─────────────────────────────────────────────────────────

interface UseResumeAnalysisReturn {
  isAnalyzing: boolean;
  analysis: ResumeAnalysis | null;
  analysisError: string | null;
  analyzeById: (resumeId: string) => Promise<ResumeAnalysis | null>;
  fetchAnalysis: (resumeId: string) => Promise<ResumeAnalysis | null>;
  reset: () => void;
}

export const useResumeAnalysis = (): UseResumeAnalysisReturn => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const analyzeById = useCallback(async (resumeId: string): Promise<ResumeAnalysis | null> => {
    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const result = await analyzeResume(resumeId);
      setAnalysis(result);
      return result;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Analysis failed. Please try again.';
      setAnalysisError(message);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const fetchAnalysis = useCallback(async (resumeId: string): Promise<ResumeAnalysis | null> => {
    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const result = await getResume(resumeId);
      setAnalysis(result);
      return result;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch analysis.';
      setAnalysisError(message);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsAnalyzing(false);
    setAnalysis(null);
    setAnalysisError(null);
  }, []);

  return { isAnalyzing, analysis, analysisError, analyzeById, fetchAnalysis, reset };
};

// ─── useJobRecommendations ─────────────────────────────────────────────────────

interface UseJobRecommendationsReturn {
  isLoading: boolean;
  jobMatch: JobMatchResult | null;
  jobError: string | null;
  fetchRecommendations: (resumeId: string, refresh?: boolean) => Promise<JobMatchResult | null>;
  reset: () => void;
}

export const useJobRecommendations = (): UseJobRecommendationsReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [jobMatch, setJobMatch] = useState<JobMatchResult | null>(null);
  const [jobError, setJobError] = useState<string | null>(null);

  const fetchRecommendations = useCallback(
    async (resumeId: string, refresh = false): Promise<JobMatchResult | null> => {
      setIsLoading(true);
      setJobError(null);

      try {
        const result = await getJobRecommendations(resumeId, refresh);
        setJobMatch(result);
        return result;
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to get job recommendations.';
        setJobError(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setJobMatch(null);
    setJobError(null);
  }, []);

  return { isLoading, jobMatch, jobError, fetchRecommendations, reset };
};
