/**
 * screens/ProfileScreen.tsx
 * Data-driven Profile Screen reflecting actual app usage and CareerLens analytics.
 */

import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, CommonActions } from '@react-navigation/native';

import { checkHealth, listResumes } from '../services/api';
import { Colors, Shadows, Typography } from '../utils/theme';
import Card from '../components/Card';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  
  // State for Real App Data
  const [resumeData, setResumeData] = useState<any[]>([]);
  const [serverStatus, setServerStatus] = useState('Checking...');
  const [stats, setStats] = useState({
    totalSkills: 0,
    topScore: 0,
    topRole: 'N/A'
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    fetchProfileData();

    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const fetchProfileData = async () => {
    try {
      const resumes = await listResumes();
      const formattedResumes = Array.isArray(resumes) ? resumes : [];
      setResumeData(formattedResumes);

      // --- CALCULATE REAL ANALYTICS ---
      if (formattedResumes.length > 0) {
        let allSkills = new Set();
        let highestScore = 0;
        let bestRole = 'None';

        formattedResumes.forEach(res => {
          // Count unique skills
          res.parsedData?.skills?.forEach((s: any) => allSkills.add(s.name));
          
          // Find Top Match
          const score = res.overallScore || res.analysis?.overall_score || 0;
          if (score > highestScore) {
            highestScore = score;
            bestRole = res.parsedData?.experienceLevel || 'Software Engineer';
          }
        });

        setStats({
          totalSkills: allSkills.size,
          topScore: highestScore,
          topRole: bestRole
        });
      }

      const health = await checkHealth();
      setServerStatus(health ? 'Online' : 'Offline');
    } catch (e) {
      setServerStatus('Error');
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Logout', 
        onPress: () => navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Login' }] })) 
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY }] }}>
          
          {/* 1. PROFESSIONAL IDENTITY */}
          <View style={styles.headerSection}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>DN</Text>
            </View>
            <Text style={styles.name}>Deepith N</Text>
            <Text style={styles.email}>deepithdeekshith@gmail.com</Text>
            <View style={styles.roleTag}>
              <Text style={styles.roleTagText}>{stats.topRole}</Text>
            </View>
          </View>

          {/* 2. REAL-TIME ANALYTICS GRID */}
          <Text style={styles.sectionTitle}>Career Progress</Text>
          <View style={styles.statsGrid}>
            <Card style={styles.statBox}>
              <Text style={styles.statVal}>{resumeData.length}</Text>
              <Text style={styles.statLab}>Resumes</Text>
            </Card>
            <Card style={styles.statBox}>
              <Text style={styles.statVal}>{stats.totalSkills}</Text>
              <Text style={styles.statLab}>Skills Found</Text>
            </Card>
            <Card style={styles.statBox}>
              <Text style={[styles.statVal, { color: '#16A34A' }]}>{stats.topScore}%</Text>
              <Text style={styles.statLab}>Best Score</Text>
            </Card>
          </View>

          {/* 3. SYSTEM & APP INFO */}
          <Text style={styles.sectionTitle}>Application Details</Text>
          <Card style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Account Status</Text>
              <Text style={styles.infoValue}>Verified Student</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Server Connection</Text>
              <Text style={[styles.infoValue, { color: serverStatus === 'Online' ? '#16A34A' : '#DC2626' }]}>
                {serverStatus}
              </Text>
            </View>
            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.infoLabel}>Last Sync</Text>
              <Text style={styles.infoValue}>Just now</Text>
            </View>
          </Card>

          {/* 4. ACTIONS */}
          <Text style={styles.sectionTitle}>Settings</Text>
          <Card style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem} onPress={() => Linking.openURL('mailto:support@careerlens.ai')}>
              <Text style={styles.menuText}>📩 Contact Support</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Upload')}>
              <Text style={styles.menuText}>📁 Manage Documents</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </Card>

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>CareerLens AI • Bengaluru, IN</Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8F9FA' },
  container: { padding: 20 },
  headerSection: { alignItems: 'center', marginBottom: 25 },
  avatarCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#D94E28', alignItems: 'center', justifyContent: 'center', marginBottom: 12, ...Shadows.md },
  avatarText: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  name: { fontSize: 22, fontWeight: 'bold', color: '#111827' },
  email: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  roleTag: { backgroundColor: '#FFF2F0', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginTop: 10, borderWidth: 1, borderColor: '#FFD7CF' },
  roleTagText: { color: '#D94E28', fontSize: 11, fontWeight: 'bold' },
  
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#4B5563', marginBottom: 10, marginTop: 15, textTransform: 'uppercase', letterSpacing: 0.5 },
  statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 10 },
  statBox: { flex: 1, padding: 15, alignItems: 'center', borderRadius: 16 },
  statVal: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  statLab: { fontSize: 11, color: '#6B7280', marginTop: 2 },

  infoCard: { padding: 5, borderRadius: 16 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  infoLabel: { fontSize: 14, color: '#6B7280' },
  infoValue: { fontSize: 14, fontWeight: '600', color: '#111827' },

  menuCard: { padding: 5, borderRadius: 16 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  menuText: { fontSize: 14, color: '#111827', fontWeight: '500' },
  chevron: { fontSize: 20, color: '#9CA3AF' },

  logoutBtn: { marginTop: 20, backgroundColor: '#FFF', padding: 16, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#FEE2E2' },
  logoutText: { color: '#DC2626', fontWeight: 'bold' },
  footerText: { textAlign: 'center', color: '#9CA3AF', fontSize: 11, marginTop: 25, marginBottom: 15 }
});

export default ProfileScreen;