/**
 * screens/ProfileScreen.tsx (FINAL - no reanimated)
 */

import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { checkHealth, listResumes } from '../services/api';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../utils/theme';
import Card from '../components/Card';

const ProfileScreen: React.FC = () => {
  const [resumeCount, setResumeCount] = useState(0);
  const [serverStatus, setServerStatus] = useState('Checking...');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    fetchData();

    // simple entry animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const fetchData = async () => {
    try {
      const resumes = await listResumes();
      setResumeCount(resumes?.length || 0);

      const health = await checkHealth();
      setServerStatus(health ? 'Online' : 'Offline');
    } catch (e) {
      setServerStatus('Error');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY }],
          }}
        >
          {/* Profile Header */}
          <Card style={styles.profileCard}>
            <Text style={styles.name}>Your Profile</Text>
            <Text style={styles.sub}>AI Resume Screener User</Text>
          </Card>

          {/* Stats */}
          <Card style={styles.card}>
            <Text style={styles.label}>Resumes Uploaded</Text>
            <Text style={styles.value}>{resumeCount}</Text>
          </Card>

          <Card style={styles.card}>
            <Text style={styles.label}>Server Status</Text>
            <Text
              style={[
                styles.value,
                {
                  color:
                    serverStatus === 'Online'
                      ? 'green'
                      : serverStatus === 'Offline'
                      ? 'red'
                      : Colors.textPrimary,
                },
              ]}
            >
              {serverStatus}
            </Text>
          </Card>

          {/* Info */}
          <Card style={styles.card}>
            <Text style={styles.info}>
              This app analyzes resumes and suggests job matches using AI.
            </Text>
          </Card>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  container: {
    padding: Spacing.base,
  },

  profileCard: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },

  name: {
    fontSize: Typography.lg,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },

  sub: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginTop: 4,
  },

  card: {
    padding: 16,
    marginBottom: 12,
  },

  label: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },

  value: {
    fontSize: Typography.lg,
    fontWeight: 'bold',
    marginTop: 4,
    color: Colors.textPrimary,
  },

  info: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});