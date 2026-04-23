/**
 * components/SkillTag.tsx
 * Displays a skill name as a compact pill/chip
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, BorderRadius, Typography } from '../utils/theme';

type TagVariant = 'default' | 'matched' | 'missing' | 'category';

interface SkillTagProps {
  label: string;
  variant?: TagVariant;
  style?: ViewStyle;
}

export const SkillTag: React.FC<SkillTagProps> = ({
  label,
  variant = 'default',
  style,
}) => {
  return (
    <View style={[styles.tag, styles[`tag_${variant}`], style]}>
      {variant === 'matched' && <View style={styles.dot} />}
      <Text style={[styles.label, styles[`label_${variant}`]]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
};

// ─── Tag Group — renders a list of tags with wrapping ─────────────────────────

interface SkillTagGroupProps {
  skills: string[];
  variant?: TagVariant;
  maxVisible?: number;
  style?: ViewStyle;
}

export const SkillTagGroup: React.FC<SkillTagGroupProps> = ({
  skills,
  variant = 'default',
  maxVisible,
  style,
}) => {
  const visibleSkills = maxVisible ? skills.slice(0, maxVisible) : skills;
  const remaining = maxVisible && skills.length > maxVisible ? skills.length - maxVisible : 0;

  return (
    <View style={[styles.group, style]}>
      {visibleSkills.map((skill, index) => (
        <SkillTag key={`${skill}-${index}`} label={skill} variant={variant} />
      ))}
      {remaining > 0 && (
        <View style={[styles.tag, styles.tag_more]}>
          <Text style={styles.label_more}>+{remaining}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  group: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
  },

  // Variants
  tag_default: {
    backgroundColor: Colors.neutral100,
  },
  tag_matched: {
    backgroundColor: Colors.successLight,
  },
  tag_missing: {
    backgroundColor: Colors.errorLight,
  },
  tag_category: {
    backgroundColor: Colors.primaryLighter,
  },
  tag_more: {
    backgroundColor: Colors.neutral200,
  },

  // Labels
  label: {
    fontSize: Typography.xs,
    fontWeight: Typography.medium,
    letterSpacing: 0.2,
  },
  label_default: {
    color: Colors.textSecondary,
  },
  label_matched: {
    color: '#065F46', // deep green
  },
  label_missing: {
    color: '#991B1B', // deep red
  },
  label_category: {
    color: Colors.primary,
  },
  label_more: {
    fontSize: Typography.xs,
    fontWeight: Typography.medium,
    color: Colors.textTertiary,
  },
});

export default SkillTag;
