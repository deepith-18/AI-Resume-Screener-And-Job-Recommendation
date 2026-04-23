/**
 * utils/theme.ts — Design system constants
 * Single source of truth for colors, spacing, typography, shadows
 */

export const Colors = {
  // Primary — clean blue
  primary: '#2563EB',
  primaryLight: '#3B82F6',
  primaryLighter: '#DBEAFE',
  primaryDark: '#1D4ED8',

  // Backgrounds
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceSecondary: '#F1F5F9',

  // Text
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textTertiary: '#94A3B8',
  textInverse: '#FFFFFF',

  // Border
  border: '#E2E8F0',
  borderLight: '#F1F5F9',

  // Semantic
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  info: '#3B82F6',
  infoLight: '#DBEAFE',

  // Score colors
  scoreHigh: '#10B981',   // 75-100
  scoreMid: '#F59E0B',    // 50-74
  scoreLow: '#EF4444',    // 0-49

  // Neutral
  neutral50: '#F8FAFC',
  neutral100: '#F1F5F9',
  neutral200: '#E2E8F0',
  neutral300: '#CBD5E1',
  neutral400: '#94A3B8',
  neutral500: '#64748B',
  neutral600: '#475569',
  neutral700: '#334155',
  neutral800: '#1E293B',
  neutral900: '#0F172A',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
} as const;

export const BorderRadius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
} as const;

export const Typography = {
  // Font sizes
  xs: 11,
  sm: 13,
  base: 15,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 34,

  // Line heights
  lineHeightTight: 1.2,
  lineHeightNormal: 1.5,
  lineHeightRelaxed: 1.7,

  // Font weights (used with style objects)
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
} as const;

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  primary: {
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
} as const;

/**
 * Returns the color for a given score value
 */
export const getScoreColor = (score: number): string => {
  if (score >= 75) return Colors.scoreHigh;
  if (score >= 50) return Colors.scoreMid;
  return Colors.scoreLow;
};

/**
 * Returns background color for score badge
 */
export const getScoreBgColor = (score: number): string => {
  if (score >= 75) return Colors.successLight;
  if (score >= 50) return Colors.warningLight;
  return Colors.errorLight;
};

export default {
  Colors,
  Spacing,
  BorderRadius,
  Typography,
  Shadows,
  getScoreColor,
  getScoreBgColor,
};
