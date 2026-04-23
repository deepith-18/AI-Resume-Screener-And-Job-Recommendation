/**
 * components/JobCard.tsx (FIXED - no reanimated)
 */

import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import {
  Colors,
  BorderRadius,
  Typography,
  Shadows,
  getScoreColor,
  getScoreBgColor,
} from '../utils/theme';
import { JobRecommendation } from '../utils/types';
import { formatSalary, formatJobType, truncateText } from '../utils/helpers';
import { SkillTagGroup } from './SkillTag';

interface JobCardProps {
  job: JobRecommendation;
  index: number;
  onPress?: (job: JobRecommendation) => void;
  expanded?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  index,
  onPress,
  expanded = false,
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.98,
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  const scoreColor = getScoreColor(job.relevanceScore);
  const scoreBg = getScoreBgColor(job.relevanceScore);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => onPress?.(job)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleArea}>
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>#{index + 1}</Text>
            </View>
            <View style={styles.titleBlock}>
              <Text style={styles.jobTitle} numberOfLines={2}>
                {job.title}
              </Text>
              {job.company && (
                <Text style={styles.company} numberOfLines={1}>
                  {job.company}
                </Text>
              )}
            </View>
          </View>

          <View style={[styles.scoreBadge, { backgroundColor: scoreBg }]}>
            <Text style={[styles.scoreText, { color: scoreColor }]}>
              {job.relevanceScore}%
            </Text>
          </View>
        </View>

        {/* Meta */}
        <View style={styles.metaRow}>
          {job.location && <MetaChip icon="📍" label={job.location} />}
          <MetaChip
            icon={job.remote ? '🌐' : '🏢'}
            label={job.remote ? 'Remote' : 'On-site'}
          />
          <MetaChip icon="💼" label={formatJobType(job.jobType)} />
        </View>

        {/* Salary */}
        {job.salaryRange && (
          <Text style={styles.salary}>
            💰{' '}
            {formatSalary(
              job.salaryRange.min,
              job.salaryRange.max,
              job.salaryRange.currency
            )}{' '}
            / yr
          </Text>
        )}

        <View style={styles.divider} />

        {/* Reasoning */}
        <Text style={styles.reasoning} numberOfLines={expanded ? undefined : 2}>
          {job.reasoning}
        </Text>

        {/* Skills */}
        {job.matchedSkills?.length > 0 && (
          <View style={styles.skillsSection}>
            <Text style={styles.skillsLabel}>✅ Matched Skills</Text>
            <SkillTagGroup skills={job.matchedSkills} variant="matched" maxVisible={5} />
          </View>
        )}

        {job.missingSkills?.length > 0 && (
          <View style={styles.skillsSection}>
            <Text style={styles.skillsLabel}>📚 Skills to Develop</Text>
            <SkillTagGroup skills={job.missingSkills} variant="missing" maxVisible={4} />
          </View>
        )}

        {/* Experience */}
        {job.experienceRequired && (
          <View style={styles.expRow}>
            <Text style={styles.expLabel}>Experience:</Text>
            <Text style={styles.expValue}>{job.experienceRequired}</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

// Meta chip
const MetaChip: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
  <View style={styles.metaChip}>
    <Text style={styles.metaIcon}>{icon}</Text>
    <Text style={styles.metaLabel} numberOfLines={1}>
      {truncateText(label, 20)}
    </Text>
  </View>
);

export default JobCard;

// Styles unchanged
const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius['2xl'],
    padding: 18,
    marginBottom: 14,
    ...Shadows.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleArea: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 12,
    gap: 10,
  },
  rankBadge: {
    backgroundColor: Colors.primaryLighter,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  rankText: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  titleBlock: { flex: 1 },
  jobTitle: {
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  company: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  scoreBadge: {
    borderRadius: BorderRadius.lg,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  scoreText: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  metaChip: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 9,
    paddingVertical: 4,
    gap: 4,
  },
  metaIcon: { fontSize: 11 },
  metaLabel: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
  salary: {
    fontSize: Typography.sm,
    color: Colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  reasoning: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  skillsSection: {
    marginBottom: 12,
    gap: 8,
  },
  skillsLabel: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
  expRow: {
    flexDirection: 'row',
    gap: 6,
  },
  expLabel: {
    fontSize: Typography.xs,
    color: Colors.textTertiary,
  },
  expValue: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
});