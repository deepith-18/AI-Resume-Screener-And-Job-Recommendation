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
import { formatJobType, truncateText } from '../utils/helpers';
import { SkillTagGroup } from './SkillTag';

interface JobCardProps {
  job: any; 
  index: number;
  onPress?: (job: any) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, index, onPress }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.98, useNativeDriver: true, friction: 5 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 5 }).start();
  };

  const scoreColor = getScoreColor(job.relevanceScore);
  const scoreBg = getScoreBgColor(job.relevanceScore);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => onPress?.(job)} // ✅ This triggers the navigation
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
              <Text style={styles.company} numberOfLines={1}>
                Recommended Role
              </Text>
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
          <MetaChip icon="💼" label={formatJobType('full-time')} />
          <MetaChip icon="🌐" label="Remote/Hybrid" />
        </View>

        <View style={styles.divider} />

        {/* Reasoning */}
        <Text style={styles.reasoning} numberOfLines={2}>
          {job.reasoning}
        </Text>

        {/* Skills */}
        <View style={styles.skillsSection}>
          <Text style={styles.skillsLabel}>📚 Skills to Develop</Text>
          <SkillTagGroup skills={job.missingSkills} variant="missing" maxVisible={4} />
        </View>

        {/* Action Button - Visually a button, but click is handled by parent card */}
        <View style={{ marginTop: 10 }}>
          <View style={styles.selectBtn}>
            <Text style={styles.selectBtnText}>Select Role</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const MetaChip: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
  <View style={styles.metaChip}>
    <Text style={styles.metaIcon}>{icon}</Text>
    <Text style={styles.metaLabel} numberOfLines={1}>
      {truncateText(label, 20)}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius['2xl'],
    padding: 18,
    marginBottom: 14,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight || '#F3F4F6',
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  titleArea: { flexDirection: 'row', flex: 1, marginRight: 12, gap: 10 },
  rankBadge: {
    backgroundColor: Colors.primaryLighter,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  rankText: { fontSize: Typography.xs, fontWeight: 'bold', color: Colors.primary },
  titleBlock: { flex: 1 },
  jobTitle: { fontSize: Typography.md, fontWeight: 'bold', color: Colors.textPrimary },
  company: { fontSize: Typography.sm, color: Colors.textSecondary },
  scoreBadge: { borderRadius: BorderRadius.full, width: 56, height: 56, alignItems: 'center', justifyContent: 'center' },
  scoreText: { fontSize: Typography.lg, fontWeight: 'bold' },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  metaChip: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 9,
    paddingVertical: 4,
    gap: 4,
  },
  metaIcon: { fontSize: 11 },
  metaLabel: { fontSize: Typography.xs, color: Colors.textSecondary },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 12 },
  reasoning: { fontSize: Typography.sm, color: Colors.textSecondary, marginBottom: 10 },
  skillsSection: { marginBottom: 12, gap: 8 },
  skillsLabel: { fontSize: Typography.xs, fontWeight: 'semibold', color: Colors.textPrimary },
  selectBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginTop: 6,
  },
  selectBtnText: { color: '#fff', fontWeight: 'bold', fontSize: Typography.sm },
});

export default JobCard;