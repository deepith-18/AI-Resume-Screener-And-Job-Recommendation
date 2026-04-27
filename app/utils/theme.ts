/**
 * utils/theme.ts — Design system constants
 */

export const Colors = {
  // 🎨 BRAND (from your UI)
  primary: '#C84E2F',
  primaryLight: '#E06A4B',
  primaryLighter: '#FDE8E3',
  primaryDark: '#A63E24',

  accent: '#C84E2F',
  accentSoft: '#FDE8E3',

  // 🧱 BACKGROUND
  background: '#F8F5F2',
  surface: '#FFFFFF',
  surfaceSecondary: '#F3F0ED',

  // 📝 TEXT
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  textInverse: '#FFFFFF',

  // 🔲 BORDER
  border: '#E7E5E4',
  borderLight: '#F1EEEB',

  // ✅ SEMANTIC
  success: '#10B981',
  successLight: '#E6F4EA',

  warning: '#F59E0B',
  warningLight: '#FEF3C7',

  error: '#EF4444',
  errorLight: '#FEE2E2',

  // 🎯 SCORE COLORS
  scoreHigh: '#10B981',
  scoreMid: '#F59E0B',
  scoreLow: '#EF4444',

  // 🏷️ CHIP COLORS (used in UI)
  chipGreen: '#E6F4EA',
  chipGreenText: '#166534',

  chipRed: '#FEE2E2',
  chipRedText: '#991B1B',

  chipBlue: '#E0E7FF',
  chipBlueText: '#3730A3',
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
  xs: 11,
  sm: 13,
  base: 15,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 34,

  lineHeightTight: 1.2,
  lineHeightNormal: 1.5,
  lineHeightRelaxed: 1.7,

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
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  primary: {
    shadowColor: '#C84E2F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
} as const;

/**
 * 🎯 Score Color Helpers
 */
export const getScoreColor = (score: number): string => {
  if (score >= 75) return Colors.scoreHigh;
  if (score >= 50) return Colors.scoreMid;
  return Colors.scoreLow;
};

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