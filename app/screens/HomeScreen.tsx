/**
 * screens/HomeScreen.tsx
 * Student Dashboard - FIXED React Native Components
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { listResumes, checkHealth } from '../services/api';

import Card from '../components/Card';
import Button from '../components/Button';
import ScoreRing from '../components/ScoreRing';
import { Colors } from '../utils/theme';

export default function HomeScreen() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const navigation = useNavigation<any>();

  // ✅ API Health Check Debug
  useEffect(() => {
    console.log("🛠️ Starting API Connection Test...");
    checkHealth()
      .then(res => {
        if (res) {
          console.log("✅ API STATUS: Connected Successfully!");
        } else {
          console.log("⚠️ API STATUS: Online, but returned unexpected response.");
        }
      })
      .catch(err => {
        console.log("❌ API CONNECTION ERROR:", err.message);
      });
  }, []);

  const fetchResumes = async () => {
    try {
      const res = await listResumes();
      setResumes(Array.isArray(res) ? res : []);
    } catch (err) {
      console.log("❌ Fetching Resumes Failed:", err);
      setResumes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResumes(); }, []);
  useFocusEffect(useCallback(() => { fetchResumes(); }, []));

  const totalResumes = resumes.length;
  const avgScore = totalResumes > 0 
    ? Math.round(resumes.reduce((acc, curr) => acc + (curr.overallScore || curr.analysis?.overall_score || 0), 0) / totalResumes) 
    : 0;

  const displayedResumes = showAll ? resumes : resumes.slice(0, 2);

  const handleNavigateToRoadmap = () => {
    if (resumes.length > 0 && resumes[0].analysisStatus === 'completed') {
      navigation.navigate('JobRecommendations', { analysisData: resumes[0] });
    } else {
      navigation.navigate('Upload');
    }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#D94E28" /></View>;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* BRANDING & GREETING */}
        <View style={styles.header}>
          <Text style={styles.brandText}>CareerLens AI</Text>
          <Text style={styles.welcome}>Hello, Deepith 👋</Text>
          <Text style={styles.subtitle}>Ready to level up your career today?</Text>
        </View>

        {/* PROGRESS OVERVIEW */}
        <Card style={styles.mainInsightCard}>
          <View style={styles.insightRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.insightTitle}>Overall Profile Strength</Text>
              <Text style={styles.insightSub}>Your average score across {totalResumes} iterations.</Text>
              {/* ✅ FIXED: Changed <div> to <View> */}
              <View style={styles.levelBadge}>
                <Text style={styles.levelBadgeText}>{avgScore > 70 ? 'Industry Ready' : 'Intermediate'}</Text>
              </View>
            </View>
            <ScoreRing score={avgScore} size={85} strokeWidth={8} />
          </View>
        </Card>

        {/* QUICK ACTIONS GRID */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('Upload')}>
            <View style={[styles.actionIcon, { backgroundColor: '#E0F2FE' }]}><Text style={styles.emoji}>📤</Text></View>
            <Text style={styles.actionLabel}>Upload</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionItem} 
            onPress={() => resumes.length > 0 ? navigation.navigate('JobRecommendations', { analysisData: resumes[0] }) : navigation.navigate('Upload')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#F0FDF4' }]}><Text style={styles.emoji}>💼</Text></View>
            <Text style={styles.actionLabel}>Jobs</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} onPress={handleNavigateToRoadmap}>
            <View style={[styles.actionIcon, { backgroundColor: '#FEF9C3' }]}><Text style={styles.emoji}>🗺️</Text></View>
            <Text style={styles.actionLabel}>Roadmap</Text>
          </TouchableOpacity>
        </View>

        {/* RECENT ANALYSES */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Analyses</Text>
          {totalResumes > 2 && (
            <TouchableOpacity onPress={() => setShowAll(!showAll)}>
              <Text style={styles.viewAll}>{showAll ? 'Show Less' : 'View All'}</Text>
            </TouchableOpacity>
          )}
        </View>

        {displayedResumes.map((item, index) => {
          const score = item.overallScore || item.analysis?.overall_score || 0;
          return (
            <TouchableOpacity 
              key={item._id || index} 
              onPress={() => navigation.navigate('ResumeAnalysis', { resumeId: item._id })}
            >
              <Card style={styles.resumeItem}>
                <View style={styles.itemRow}>
                  <View style={styles.fileIconBox}><Text>📄</Text></View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.fileName} numberOfLines={1}>{item.fileName}</Text>
                    <Text style={styles.fileDate}>{item.analysisStatus}</Text>
                  </View>
                  <Text style={[styles.itemScore, { color: score > 70 ? '#16A34A' : '#D94E28' }]}>{score}%</Text>
                </View>
              </Card>
            </TouchableOpacity>
          );
        })}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollContent: { 
    paddingHorizontal: 20, 
    paddingBottom: 40,
    paddingTop: Platform.OS === 'ios' ? 60 : 40 
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { marginBottom: 24 },
  brandText: { fontSize: 12, fontWeight: '800', color: '#D94E28', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 },
  welcome: { fontSize: 26, fontWeight: 'bold', color: '#111827' },
  subtitle: { fontSize: 14, color: '#6B7280', marginTop: 2 },
  mainInsightCard: { padding: 20, backgroundColor: '#FFF', borderRadius: 24, marginBottom: 24, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  insightRow: { flexDirection: 'row', alignItems: 'center' },
  insightTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  insightSub: { fontSize: 13, color: '#6B7280', marginTop: 4, marginBottom: 12 },
  levelBadge: { backgroundColor: '#F0FDF4', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start' },
  levelBadgeText: { color: '#16A34A', fontSize: 11, fontWeight: 'bold' },
  actionGrid: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  actionItem: { alignItems: 'center', width: '22%' },
  actionIcon: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  emoji: { fontSize: 22 },
  actionLabel: { fontSize: 12, fontWeight: '600', color: '#374151' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  viewAll: { color: '#D94E28', fontWeight: '700', fontSize: 13 },
  resumeItem: { padding: 14, marginBottom: 10, borderRadius: 16, backgroundColor: '#FFF' },
  itemRow: { flexDirection: 'row', alignItems: 'center' },
  fileIconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  fileName: { fontSize: 15, fontWeight: '600', color: '#111827' },
  fileDate: { fontSize: 12, color: '#9CA3AF', marginTop: 2, textTransform: 'capitalize' },
  itemScore: { fontSize: 16, fontWeight: 'bold' },
});