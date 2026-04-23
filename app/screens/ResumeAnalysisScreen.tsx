/**
 * screens/ResumeAnalysisScreen.tsx (FIXED - no reanimated)
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { getResume } from '../services/api';
import ScoreRing from '../components/ScoreRing';
import { SkillTagGroup } from '../components/SkillTag';
import Card from '../components/Card';
import Button from '../components/Button';
import { Header } from '../components/Header';

import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../utils/theme';
import {
  formatExperienceLevel,
  groupSkillsByCategory,
  getSkillCategoryEmoji,
} from '../utils/helpers';
import { HomeStackParamList, ParsedResumeData } from '../utils/types';

type AnalysisRouteProp = RouteProp<HomeStackParamList, 'ResumeAnalysis'>;
type AnalysisNavProp = NativeStackNavigationProp<HomeStackParamList, 'ResumeAnalysis'>;

export const ResumeAnalysisScreen: React.FC = () => {
  const route = useRoute<AnalysisRouteProp>();
  const navigation = useNavigation<AnalysisNavProp>();
  const { resumeId } = route.params;

  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] =
    useState<'overview' | 'skills' | 'experience'>('overview');

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError('');

        const res = await getResume(resumeId);

        console.log("FINAL DATA:", res);

        // Prevent race condition
        if (isMounted) {
          setAnalysis(res);
        }

      } catch (err) {
        console.log("ERROR:", err);

        if (isMounted) {
          setError("Failed to load");
        }

      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [resumeId]);

  if (loading) {
    return <Text style={{ textAlign: 'center', marginTop: 50 }}>Loading...</Text>;
  }

  if (error && !analysis) {
    return <Text style={{ textAlign: 'center', marginTop: 50 }}>{error}</Text>;
  }

  console.log("ANALYSIS SCREEN DATA:", analysis);

  const pd = analysis?.parsedData || {};

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Resume Analysis" showBack />

      <ScrollView style={styles.scroll}>
        <Card style={styles.heroCard}>
          <ScoreRing score={analysis.overallScore || 0} />
          <Text style={styles.heroName}>{pd?.name || 'Candidate'}</Text>
        </Card>

        {/* Tabs */}
        <View style={styles.tabs}>
          {['overview', 'skills', 'experience'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && styles.tabActive,
              ]}
              onPress={() => setActiveTab(tab as any)}
            >
              <Text>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'overview' && (
          <Card style={styles.card}>
            <Text>Overview content</Text>
          </Card>
        )}

        {activeTab === 'skills' && (
          <Card style={styles.card}>
            <Text>Skills content</Text>
          </Card>
        )}

        {activeTab === 'experience' && (
          <Card style={styles.card}>
            <Text>Experience content</Text>
          </Card>
        )}

        <Card style={styles.card}>
          <Button
            label="Find Jobs"
            onPress={() =>
              navigation.navigate('JobRecommendations', { resumeId })
            }
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ResumeAnalysisScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1, padding: 16 },

  heroCard: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
  },

  heroName: {
    fontSize: Typography.lg,
    fontWeight: 'bold',
    marginTop: 10,
  },

  tabs: {
    flexDirection: 'row',
    marginBottom: 12,
  },

  tab: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },

  tabActive: {
    backgroundColor: Colors.primary,
  },

  card: {
    padding: 16,
    marginBottom: 12,
  },

  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  errorIcon: { fontSize: 40 },
  errorTitle: { fontSize: 18, fontWeight: 'bold' },
  errorText: { fontSize: 14 },
});