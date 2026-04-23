/**
 * utils/helpers.ts — Utility functions used throughout the app
 */

import { ExperienceLevel, SkillProficiency, JobType } from './types';

/**
 * Format salary range for display
 */
export const formatSalary = (min: number, max: number, currency = 'USD'): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  });
  return `${formatter.format(min)} – ${formatter.format(max)}`;
};

/**
 * Human-readable experience level label
 */
export const formatExperienceLevel = (level?: ExperienceLevel): string => {
  const map: Record<ExperienceLevel, string> = {
    entry: 'Entry Level',
    junior: 'Junior',
    mid: 'Mid Level',
    senior: 'Senior',
    lead: 'Lead',
    executive: 'Executive',
  };
  return level ? map[level] : 'Not specified';
};

/**
 * Human-readable proficiency label
 */
export const formatProficiency = (proficiency?: SkillProficiency): string => {
  const map: Record<SkillProficiency, string> = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    expert: 'Expert',
  };
  return proficiency ? map[proficiency] : '';
};

/**
 * Human-readable job type label
 */
export const formatJobType = (type?: JobType): string => {
  const map: Record<JobType, string> = {
    'full-time': 'Full Time',
    'part-time': 'Part Time',
    contract: 'Contract',
    freelance: 'Freelance',
    internship: 'Internship',
  };
  return type ? map[type] : 'Full Time';
};

/**
 * Returns emoji for skill category
 */
export const getSkillCategoryEmoji = (category: string): string => {
  const map: Record<string, string> = {
    technical: '💻',
    soft: '🤝',
    language: '🌐',
    tool: '🔧',
    framework: '⚡',
    other: '✨',
  };
  return map[category] || '•';
};

/**
 * Returns color for experience level badge
 */
export const getExperienceLevelColor = (level?: ExperienceLevel): string => {
  const map: Record<ExperienceLevel, string> = {
    entry: '#8B5CF6',
    junior: '#3B82F6',
    mid: '#10B981',
    senior: '#F59E0B',
    lead: '#EF4444',
    executive: '#EC4899',
  };
  return level ? map[level] : '#64748B';
};

/**
 * Truncates long text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};

/**
 * Formats a date string to a readable format
 */
export const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
};

/**
 * Returns a score label (Excellent / Good / Fair / Poor)
 */
export const getScoreLabel = (score: number): string => {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Fair';
  return 'Needs Work';
};

/**
 * Groups skills by category
 */
export const groupSkillsByCategory = (skills: { name: string; category: string }[]) => {
  return skills.reduce((acc, skill) => {
    const cat = skill.category || 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill.name);
    return acc;
  }, {} as Record<string, string[]>);
};

/**
 * Validates file extension for resume upload
 */
export const isValidResumeFile = (fileName: string): boolean => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  return ext === 'pdf' || ext === 'docx' || ext === 'doc';
};

/**
 * Returns file type icon name based on extension
 */
export const getFileTypeLabel = (fileName: string): string => {
  const ext = fileName.split('.').pop()?.toUpperCase();
  return ext || 'FILE';
};
