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
 * HELPER FUNCTION: Extracts projects from raw text if AI structured data is missing
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
  
  // Receive initial data from route
  const { resumeId, skills: routeSkills } = route.params;

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
          // Debugging logs to verify backend output
          console.log("🔥 API FULL DATA:", res);
          console.log("🔥 EXTRACTED SKILLS:", res.parsedData?.skills);
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

  // ✅ FINAL CONSOLIDATED LOGIC
  // Prioritize API data (pd), then fallback to routeSkills if API returns empty
  const pd = analysis?.parsedData || {};
  const displaySkills = (pd.skills && pd.skills.length > 0) ? pd.skills : (routeSkills || []);

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Resume Analysis" showBack />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        
        {/* HERO CARD */}
        <Card style={styles.heroCard}>
          <View style={styles.heroRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroName}>{pd?.name || 'Candidate'}</Text>
              <Text style={styles.heroSub}>
                {pd?.experienceLevel || 'Software Engineer'}
              </Text>
              <Text style={styles.heroDesc}>
                Profile analyzed. {displaySkills.length} key attributes identified.
              </Text>
            </View>

            <ScoreRing score={analysis.overallScore || 0} />
          </View>
        </Card>

        {/* STATS GRID */}
        <View style={styles.statsGrid}>
          <Card style={styles.statBox}>
            <Text style={styles.statNumber}>{displaySkills.length}</Text>
            <Text style={styles.statLabel}>Total Skills</Text>
          </Card>

          <Card style={styles.statBox}>
            <Text style={styles.statNumber}>
              {displaySkills.filter((s: any) => {
                const category = s.category?.toLowerCase() || s.type?.toLowerCase();
                return category === 'technical' || !category;
              }).length}
            </Text>
            <Text style={styles.statLabel}>Technical</Text>
          </Card>

          <Card style={styles.statBox}>
            <Text style={styles.statNumber}>
              {displaySkills.filter((s: any) => (s.category === 'tool' || s.type === 'tool')).length}
            </Text>
            <Text style={styles.statLabel}>Tools</Text>
          </Card>

          <Card style={styles.statBox}>
            <Text style={styles.statNumber}>
              {displaySkills.filter((s: any) => (s.category === 'soft' || s.type === 'soft')).length}
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

        {/* Tab Content: Skills */}
        {activeTab === 'skills' && (
          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Key Skills</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {displaySkills.length > 0 ? (
                displaySkills.map((skill: any, index: number) => (
                  <View key={index} style={styles.skillChip}>
                    <Text style={styles.skillChipText}>
                        {typeof skill === 'string' ? skill : skill.name}
                    </Text>
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
    onPress={() => {
      // ✅ Transform skill objects into a clean array of strings
      const skillNamesOnly = displaySkills.map((s: any) => 
        typeof s === 'string' ? s : s.name
      );

      console.log("🚀 Navigating with skills:", skillNamesOnly);

      navigation.navigate('JobRecommendations', { 
        resumeId, 
        skills: skillNamesOnly // ✅ Now passing ['java', 'python', ...]
      });
    }}
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
    color: Colors.textPrimary,
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