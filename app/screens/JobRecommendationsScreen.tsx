/**
 * screens/JobRecommendationsScreen.tsx
 * Updated to support navigation to the Roadmap screen upon role selection.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';

import JobCard from '../components/JobCard';
import { Header } from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import { SkeletonCard } from '../components/Skeleton';
import { Colors, Typography, Spacing, BorderRadius } from '../utils/theme';
import { generateRoleMatches } from '../utils/matcher';

export const JobRecommendationsScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  
  const { analysisData } = route.params;
  
  const [isLoading, setIsLoading] = useState(true);
  const [jobMatch, setJobMatch] = useState<any>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const userSkills = analysisData?.parsedData?.skills || [];
      const matches = generateRoleMatches(userSkills);
      
      setJobMatch({
        candidateName: analysisData?.parsedData?.name || 'Candidate',
        recommendations: matches
      });
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [analysisData]);

  // ✅ FIXED: Correct navigation to Roadmap screen
  const handleJobSelect = (job: any) => {
    navigation.navigate('Roadmap', { role: job });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Job Matches"
        subtitle={jobMatch?.candidateName}
        showBack
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.sectionHeader}>
          <Text style={styles.stepText}>STEP 03 — CAREER ROLE MATCHES</Text>
          <Text style={styles.mainTitle}>Your matched roles</Text>
          <Text style={styles.subText}>
            Click any role to generate your personalized learning roadmap.
          </Text>
        </View>

        {!isLoading && jobMatch && <SummaryBanner jobMatch={jobMatch} />}

        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : jobMatch?.recommendations?.length ? (
          <>
            {jobMatch.recommendations.map((job: any, index: number) => (
              <FadeInJobCard
                key={index}
                job={{
                  ...job,
                  relevanceScore: job.match_score,
                  reasoning: job.reason,
                  matchedSkills: job.matched_skills,
                  missingSkills: job.missing_skills
                }}
                index={index}
                onPress={handleJobSelect} // ✅ Passing function
              />
            ))}
          </>
        ) : (
          <View style={styles.errorBox}>
            <Text style={{ marginBottom: 12 }}>No matching roles found.</Text>
            <Button label="Go Back" onPress={() => navigation.goBack()} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// Summary Banner Logic
const SummaryBanner: React.FC<{ jobMatch: any }> = ({ jobMatch }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const topMatch = jobMatch.recommendations?.[0];

  return (
    <Animated.View style={[styles.summaryBanner, { opacity, transform: [{ translateY }] }]}>
      <View style={styles.summaryContent}>
        <Text style={styles.summaryTitle}>Bridge the gap for {topMatch?.title}</Text>
        <View style={styles.chipRow}>
          {topMatch?.missing_skills?.length > 0 ? (
            topMatch.missing_skills.map((skill: string, i: number) => (
              <View key={i} style={styles.redChip}>
                <Text style={styles.redChipText}>{skill}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.subText}>You have all required skills for this role! 🚀</Text>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

// Animation Wrapper
const FadeInJobCard: React.FC<{ job: any, index: number, onPress: (job: any) => void }> = ({ job, index, onPress }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, delay: index * 100, duration: 400, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, delay: index * 100, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <Card style={styles.jobCardWrapper}>
        <JobCard job={job} index={index} onPress={onPress} />
      </Card>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  scrollContent: { padding: 16 },
  sectionHeader: { marginBottom: 16 },
  stepText: { fontSize: 12, color: Colors.primary, fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  mainTitle: { fontSize: 24, fontWeight: 'bold', color: Colors.textPrimary },
  subText: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
  summaryBanner: { backgroundColor: Colors.surface, borderRadius: BorderRadius.xl, marginBottom: 16, borderWidth: 1, borderColor: Colors.neutral100 },
  summaryContent: { padding: 16 },
  summaryTitle: { fontSize: 14, fontWeight: '600', marginBottom: 10, color: Colors.textPrimary },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  redChip: { backgroundColor: '#FEE2E2', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  redChipText: { color: '#991B1B', fontSize: 12, fontWeight: '500' },
  jobCardWrapper: { marginBottom: 16, padding: 0, overflow: 'hidden' },
  errorBox: { alignItems: 'center', padding: 40 },
});

export default JobRecommendationsScreen;