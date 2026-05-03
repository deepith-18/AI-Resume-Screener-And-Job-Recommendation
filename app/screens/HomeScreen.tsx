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
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { listResumes, checkHealth, deleteResume } from '../services/api';

import Card from '../components/Card';
import ScoreRing from '../components/ScoreRing';
import { Shadows } from '../utils/theme';

export default function HomeScreen() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [userName, setUserName] = useState('Student'); 
  const navigation = useNavigation<any>();

  /**
   * ✅ THE "READ" LOGIC
   * Pulls the name from AsyncStorage to keep the UI in sync
   */
  const loadUserData = async () => {
    try {
      const storedName = await AsyncStorage.getItem('user_name');
      if (storedName) {
        setUserName(storedName);
      }
    } catch (e) {
      console.log("❌ Error loading user name from storage", e);
    }
  };

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

  const handleDeleteResume = (resumeId: string) => {
    Alert.alert(
      'Delete resume',
      'This will permanently remove the uploaded resume and its analysis. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteResume(resumeId);
              setResumes((current) => current.filter((resume) => resume._id !== resumeId));
            } catch (error: any) {
              Alert.alert('Delete failed', error.message || 'Could not delete resume');
            }
          },
        },
      ]
    );
  };

  // ✅ Triggered every time the user navigates TO this screen
  useFocusEffect(
    useCallback(() => {
      loadUserData();
      fetchResumes();
    }, [])
  );

  // Initial Health Check only
  useEffect(() => {
    checkHealth().catch(err => console.log("API Offline"));
  }, []);

  const totalResumes = resumes.length;
  const avgScore = totalResumes > 0 
    ? Math.round(resumes.reduce((acc, curr) => acc + (curr.overallScore || curr.analysis?.overall_score || 0), 0) / totalResumes) 
    : 0;

  const displayedResumes = showAll ? resumes : resumes.slice(0, 2);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#D94E28" /></View>;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* BRANDING & GREETING */}
        <View style={styles.header}>
          <Text style={styles.brandText}>CareerLens AI</Text>
          {/* ✅ The name will now update instantly if changed in Settings/Signup */}
          <Text style={styles.welcome}>Hello, {userName} 👋</Text>
          <Text style={styles.subtitle}>Ready to level up your career today?</Text>
        </View>

        {/* PROGRESS OVERVIEW */}
        <Card style={styles.mainInsightCard}>
          <View style={styles.insightRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.insightTitle}>Overall Profile Strength</Text>
              <Text style={styles.insightSub}>Your average score across {totalResumes} iterations.</Text>
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

        {resumes.length === 0 ? (
          <Text style={styles.emptyText}>No resumes analyzed yet. Upload one to get started!</Text>
        ) : (
          displayedResumes.map((item, index) => {
            const score = item.overallScore || item.analysis?.overall_score || 0;
            return (
              <View 
                key={item._id || index} 
                style={styles.resumeCardWrap}
              >
                <TouchableOpacity
                  activeOpacity={0.85}
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

                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteResume(item._id)}>
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            );
          })
        )}

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
  mainInsightCard: { padding: 20, backgroundColor: '#FFF', borderRadius: 24, marginBottom: 24, ...Shadows.sm },
  insightRow: { flexDirection: 'row', alignItems: 'center' },
  insightTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  insightSub: { fontSize: 13, color: '#6B7280', marginTop: 4, marginBottom: 12 },
  levelBadge: { backgroundColor: '#F0FDF4', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start' },
  levelBadgeText: { color: '#16A34A', fontSize: 11, fontWeight: 'bold' },
  actionGrid: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  actionItem: { alignItems: 'center', width: 92 },
  actionIcon: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  emoji: { fontSize: 22 },
  actionLabel: { fontSize: 12, fontWeight: '600', color: '#374151' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  viewAll: { color: '#D94E28', fontWeight: '700', fontSize: 13 },
  resumeCardWrap: { marginBottom: 10 },
  resumeItem: { padding: 14, marginBottom: 10, borderRadius: 16, backgroundColor: '#FFF' },
  itemRow: { flexDirection: 'row', alignItems: 'center' },
  fileIconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  fileName: { fontSize: 15, fontWeight: '600', color: '#111827' },
  fileDate: { fontSize: 12, color: '#9CA3AF', marginTop: 2, textTransform: 'capitalize' },
  itemScore: { fontSize: 16, fontWeight: 'bold' },
  deleteButton: { alignSelf: 'flex-end', marginTop: -2, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: '#FEE2E2' },
  deleteButtonText: { fontSize: 12, fontWeight: '700', color: '#B91C1C' },
  emptyText: { textAlign: 'center', color: '#9CA3AF', marginTop: 20, fontSize: 14 },
});