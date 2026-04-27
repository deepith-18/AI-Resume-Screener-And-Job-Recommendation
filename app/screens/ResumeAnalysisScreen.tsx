/**
 * screens/ResumeAnalysisScreen.tsx
 * Comprehensive resume analysis results with tabs and stats
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { getResume } from '../services/api';
import ScoreRing from '../components/ScoreRing';
import Card from '../components/Card';
import Button from '../components/Button';
import { Header } from '../components/Header';

import { Colors, Typography, Spacing, BorderRadius } from '../utils/theme';
import { HomeStackParamList } from '../utils/types';

type AnalysisRouteProp = RouteProp<HomeStackParamList, 'ResumeAnalysis'>;
type AnalysisNavProp = NativeStackNavigationProp<HomeStackParamList, 'ResumeAnalysis'>;

type TabType = 'overview' | 'skills' | 'experience';

/**
 * HELPER FUNCTION
 */
const extractProjects = (text: string = '') => {
  if (!text) return [];

  const sections = text.split('\n');
  const projects: { title: string; description: string }[] = [];

  for (let i = 0; i < sections.length; i++) {
    const line = sections[i].trim();

    if (
      line.toLowerCase().includes('project') ||
      line.includes('–') ||
      line.includes('-')
    ) {
      const description = sections[i + 1] || '';

      projects.push({
        title: line,
        description: description.trim(),
      });
    }
  }

  return projects.slice(0, 5);
};

export const ResumeAnalysisScreen: React.FC = () => {
  const route = useRoute<AnalysisRouteProp>();
  const navigation = useNavigation<AnalysisNavProp>();
  const { resumeId } = route.params;

  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await getResume(resumeId);
        
        if (isMounted) {
          setAnalysis(res);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        if (isMounted) {
          setError("Failed to load analysis data.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();
    return () => { isMounted = false; };
  }, [resumeId]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Analyzing Resume...</Text>
      </View>
    );
  }

  if (error || !analysis) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || "No data found"}</Text>
        <Button label="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const pd = analysis?.parsedData || {};

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Resume Analysis" showBack />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        
        {/* STEP 2 — UPDATED HERO CARD */}
        <Card style={styles.heroCard}>
          <View style={styles.heroRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroName}>{pd?.name || 'Candidate'}</Text>
              <Text style={styles.heroSub}>
                {pd?.experienceLevel || 'Software Engineer'}
              </Text>
              <Text style={styles.heroDesc}>
                Profile analyzed. {pd?.skills?.length || 0} key attributes identified.
              </Text>
            </View>

            <ScoreRing score={analysis.overallScore || 0} />
          </View>
        </Card>

        {/* STEP 3 — STATS GRID */}
        <View style={styles.statsGrid}>
          <Card style={styles.statBox}>
            <Text style={styles.statNumber}>{pd.skills?.length || 0}</Text>
            <Text style={styles.statLabel}>Total Skills</Text>
          </Card>

          <Card style={styles.statBox}>
            <Text style={styles.statNumber}>
              {pd.skills?.filter((s:any)=>s.category==='technical').length || 0}
            </Text>
            <Text style={styles.statLabel}>Technical</Text>
          </Card>

          <Card style={styles.statBox}>
            <Text style={styles.statNumber}>
              {pd.skills?.filter((s:any)=>s.category==='tool').length || 0}
            </Text>
            <Text style={styles.statLabel}>Tools</Text>
          </Card>

          <Card style={styles.statBox}>
            <Text style={styles.statNumber}>
              {pd.skills?.filter((s:any)=>s.category==='soft').length || 0}
            </Text>
            <Text style={styles.statLabel}>Soft Skills</Text>
          </Card>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabs}>
          {(['overview', 'skills', 'experience'] as TabType[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && styles.tabActive,
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive
              ]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content: Overview */}
        {activeTab === 'overview' && (
          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.text}>
              {analysis.aiSummary || 'No summary available'}
            </Text>

            <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Experience Level</Text>
            <Text style={styles.text}>
              {pd.experienceLevel || 'Not specified'}
            </Text>

            <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Match Score</Text>
            <Text style={styles.text}>
              {analysis.overallScore}/100
            </Text>
          </Card>
        )}

        {/* Tab Content: Skills — STEP 4 UPDATED */}
        {activeTab === 'skills' && (
          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Technical Skills</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {pd.skills && pd.skills.length > 0 ? (
                pd.skills.map((skill: any, index: number) => (
                  <View key={index} style={styles.skillChip}>
                    <Text style={styles.skillChipText}>{skill.name}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.text}>No skills identified.</Text>
              )}
            </View>
          </Card>
        )}

        {/* Tab Content: Experience */}
        {activeTab === 'experience' && (
          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Experience / Projects</Text>

            {pd.experience && pd.experience.length > 0 ? (
              pd.experience.map((exp: any, index: number) => (
                <View key={index} style={styles.expItem}>
                  <Text style={styles.expRole}>
                    {exp.role || 'Experience'}
                  </Text>
                  <Text style={styles.expCompany}>
                    {exp.company || ''}
                  </Text>
                  <Text style={styles.text}>
                    {exp.description || ''}
                  </Text>
                </View>
              ))
            ) : (
              extractProjects(analysis.rawText).length > 0 ? (
                extractProjects(analysis.rawText).map((proj, index) => (
                  <View key={index} style={styles.expItem}>
                    <Text style={styles.expRole}>🚀 {proj.title}</Text>
                    <Text style={styles.text}>{proj.description}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.text}>No experience or projects found</Text>
              )
            )}
          </Card>
        )}

        {/* Action Button */}
        <View style={{ marginBottom: 30, marginTop: 10 }}>
          <Button
            label="Find Recommended Jobs"
            onPress={() => navigation.navigate('JobRecommendations', { resumeId })}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1, padding: 16 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  
  // HERO & STATS (STEP 5 STYLES)
  heroCard: {
    padding: 20,
    marginBottom: 16,
    borderRadius: BorderRadius.lg,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heroName: {
    fontSize: Typography.lg,
    fontWeight: 'bold',
    color: Colors.textPrimary, // STEP 1 FIX
  },
  heroSub: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  heroDesc: {
    fontSize: Typography.xs,
    color: Colors.textTertiary,
    marginTop: 6,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  statBox: {
    width: '48%',
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: Typography['2xl'],
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },

  // TABS (STEP 6 FIX)
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: BorderRadius.md,
    marginBottom: 16,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  tabTextActive: {
    color: '#fff',
  },

  // CARD CONTENT
  card: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: Colors.primary,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: '#444',
  },

  // SKILL CHIPS (STEP 4/5)
  skillChip: {
    backgroundColor: Colors.primaryLighter,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  skillChipText: {
    fontSize: Typography.xs,
    color: Colors.primaryDark,
    fontWeight: '500',
  },

  expItem: {
    marginBottom: 16,
    borderLeftWidth: 2,
    borderLeftColor: Colors.primary,
    paddingLeft: 12,
  },
  expRole: { fontWeight: 'bold', fontSize: 15 },
  expCompany: { fontSize: 13, color: '#666', marginBottom: 4 },
  
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
  errorText: { color: 'red', marginBottom: 20, textAlign: 'center' },
});

export default ResumeAnalysisScreen;