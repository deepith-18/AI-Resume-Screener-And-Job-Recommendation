/**
 * screens/JobRecommendationsScreen.tsx (FINAL - no reanimated)
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp } from '@react-navigation/native';

import { useJobRecommendations } from '../hooks/useResume';
import JobCard from '../components/JobCard';
import { Header } from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import { SkeletonCard } from '../components/Skeleton';
import { Colors, Typography, Spacing, BorderRadius } from '../utils/theme';
import { JobRecommendation, HomeStackParamList } from '../utils/types';
import { formatExperienceLevel } from '../utils/helpers';

type JobsRouteProp = RouteProp<HomeStackParamList, 'JobRecommendations'>;

export const JobRecommendationsScreen: React.FC = () => {
  const route = useRoute<JobsRouteProp>();
  const { resumeId } = route.params;

  const { isLoading, jobMatch, jobError, fetchRecommendations } =
    useJobRecommendations();

  useEffect(() => {
    fetchRecommendations(resumeId);
  }, [resumeId]);

  const handleRefresh = () => {
    fetchRecommendations(resumeId, true);
  };

  const handleJobApply = (job: JobRecommendation) => {
    if (job.applyUrl) {
      Alert.alert('Apply', 'Open job link?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open', onPress: () => Linking.openURL(job.applyUrl!) },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Job Matches"
        subtitle={jobMatch?.candidateName}
        showBack
        rightElement={
          <TouchableOpacity onPress={handleRefresh} disabled={isLoading}>
            <Text style={[styles.refreshIcon, isLoading && styles.refreshIconDisabled]}>
              🔄
            </Text>
          </TouchableOpacity>
        }
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {jobMatch && <SummaryBanner jobMatch={jobMatch} />}

        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : jobError ? (
          <View style={styles.errorBox}>
            <Text>⚠️ Error loading jobs</Text>
            <Button label="Retry" onPress={() => fetchRecommendations(resumeId)} />
          </View>
        ) : jobMatch?.recommendations?.length ? (
          <>
            {jobMatch.recommendations.map((job, index) => (
              <FadeInJobCard
                key={index}
                job={job}
                index={index}
                onPress={handleJobApply}
              />
            ))}
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

export default JobRecommendationsScreen;


// ─── Summary Banner (FIXED) ─────────────────────────────

const SummaryBanner: React.FC<{ jobMatch: any }> = ({ jobMatch }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.summaryBanner,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <Text>Top Match: {jobMatch.recommendations?.[0]?.relevanceScore || 0}%</Text>
    </Animated.View>
  );
};


// ─── Fade Job Card (FIXED) ─────────────────────────────

const FadeInJobCard: React.FC<{
  job: JobRecommendation;
  index: number;
  onPress: (job: JobRecommendation) => void;
}> = ({ job, index, onPress }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        delay: index * 120,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        delay: index * 120,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <JobCard job={job} index={index} onPress={onPress} />
    </Animated.View>
  );
};


// ─── Styles ─────────────────────────────

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  scrollContent: { padding: Spacing.base },

  refreshIcon: { fontSize: 18 },
  refreshIconDisabled: { opacity: 0.4 },

  summaryBanner: {
    padding: 16,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    marginBottom: 16,
  },

  errorBox: {
    alignItems: 'center',
    padding: 20,
  },
});