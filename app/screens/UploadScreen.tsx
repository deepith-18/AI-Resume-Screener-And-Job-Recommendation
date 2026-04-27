/**
 * screens/UploadScreen.tsx
 * Resume upload with file picker, progress indicator, and auto-analyze flow
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import { useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';

import { useResumeUpload, useResumeAnalysis } from '../hooks/useResume';
import Button from '../components/Button';
import { Card } from '../components/Card';
import { Colors, Typography, Spacing, BorderRadius } from '../utils/theme';
import { HomeStackParamList } from '../utils/types';

type UploadNavProp = NativeStackNavigationProp<HomeStackParamList, 'HomeScreen'>;
type UploadPhase = 'idle' | 'uploading' | 'uploaded' | 'analyzing' | 'done' | 'error';

export const UploadScreen: React.FC = () => {
  const navigation = useNavigation<UploadNavProp>();
  const { isUploading, uploadProgress, uploadedResume, pickAndUpload, reset: resetUpload } = useResumeUpload();
  const { analyzeById } = useResumeAnalysis();

  const [phase, setPhase] = useState<UploadPhase>('idle');
  const [phaseMessage, setPhaseMessage] = useState('');

  const dropZoneScale = useRef(new Animated.Value(1)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;

  // Pulsing animation for idle state
  useEffect(() => {
    if (phase === 'idle') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dropZoneScale, { toValue: 1.01, duration: 1500, useNativeDriver: true }),
          Animated.timing(dropZoneScale, { toValue: 1, duration: 1500, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [phase]);

  // Progress bar animation
  useEffect(() => {
    Animated.timing(progressWidth, {
      toValue: uploadProgress,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [uploadProgress]);

  const handleReset = () => {
    resetUpload();
    setPhase('idle');
    setPhaseMessage('');
  };

  useFocusEffect(
    React.useCallback(() => {
      handleReset();
    }, [])
  );

  const handlePickAndUpload = async () => {
    try {
      setPhase('uploading');
      setPhaseMessage('Uploading your resume...');
      resetUpload();

      const uploaded = await pickAndUpload();
      console.log("UPLOAD RESULT:", uploaded);

      if (!uploaded || !uploaded._id) {
        setPhase('error');
        setPhaseMessage('Upload failed');
        return;
      }

      const resumeId = uploaded._id;
      setPhase('analyzing');
      setPhaseMessage('AI is reading your resume...');

      // Trigger analysis
      const analysis = await analyzeById(resumeId);
      console.log("ANALYSIS RESULT:", analysis);

      if (!analysis) {
        setPhase('error');
        setPhaseMessage('Analysis failed');
        return;
      }

      setPhase('done');
      setPhaseMessage('Analysis complete!');

      // Navigate to analysis immediately
      navigation.navigate('ResumeAnalysis', {
        resumeId: resumeId,
      });

      // Subtle reset to clean up for the next time user comes back
      setTimeout(() => {
        handleReset();
      }, 500);

    } catch (e) {
      console.log("UPLOAD ERROR:", e);
      setPhase('error');
      setPhaseMessage('Something went wrong during upload');
    }
  };

  const dropZoneStyle = { transform: [{ scale: dropZoneScale }] };
  const progressStyle = {
    width: progressWidth.interpolate({
      inputRange: [0, 100],
      outputRange: ['0%', '100%'],
    }),
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* STEP 1 — UPDATED HEADER */}
        <View style={styles.pageHeader}>
          <Text style={styles.stepText}>STEP 01 — RESUME ANALYSIS</Text>
          <Text style={styles.pageTitle}>
            Upload your <Text style={{ color: Colors.primary }}>resume</Text>
          </Text>
          <Text style={styles.pageSubtitle}>
            Paste or upload your resume and let AI extract skills, match roles, and build your roadmap.
          </Text>
        </View>

        {phase === 'idle' && (
          <Animated.View style={dropZoneStyle}>
            <Card variant="outlined" style={styles.dropZone} animated>
              <View style={styles.dropZoneInner}>
                <View style={styles.dropZoneIconBox}><Text style={styles.dropZoneIcon}>📄</Text></View>
                <Text style={styles.dropZoneTitle}>Select your resume</Text>
                <Text style={styles.dropZoneSubtitle}>PDF or DOCX · Maximum 10MB</Text>
                <Button 
                  label="Analyze Resume" 
                  onPress={handlePickAndUpload} 
                  style={{ marginTop: 20 }} 
                />
                <Text style={styles.dropZoneHint}>Your resume is processed securely</Text>
              </View>
            </Card>
          </Animated.View>
        )}

        {(phase === 'uploading' || phase === 'uploaded') && (
          <Card style={styles.progressCard} animated>
            <View style={styles.progressFileRow}>
              <View style={styles.progressFileIcon}><Text>📄</Text></View>
              <View style={styles.progressFileInfo}>
                <Text style={styles.progressFileName} numberOfLines={1}>{uploadedResume?.fileName || 'Uploading...'}</Text>
                <Text style={styles.progressFileSize}>{uploadedResume?.fileSize || 'Processing...'}</Text>
              </View>
              <Text style={styles.progressPercent}>{uploadProgress}%</Text>
            </View>
            <View style={styles.progressTrack}><Animated.View style={[styles.progressFill, progressStyle]} /></View>
            <Text style={styles.progressLabel}>{phaseMessage}</Text>
          </Card>
        )}

        {phase === 'analyzing' && (
          <Card style={styles.analyzingCard} animated>
            <AnalyzingIndicator />
            <Text style={styles.analyzingTitle}>Analyzing Resume</Text>
            <Text style={styles.analyzingSubtitle}>Our AI is extracting your skills and finding the best job matches</Text>
            {}
            <View style={styles.analyzingSteps}>
              {[{ label: 'Parsing document', done: true }, { label: 'Extracting skills', done: false }, { label: 'Job matching', done: false }].map((step, i) => (
                <View key={i} style={styles.analyzingStep}>
                  <Text style={styles.analyzingStepIcon}>{step.done ? '✅' : '⏳'}</Text>
                  <Text style={[styles.analyzingStepText, step.done && styles.analyzingStepDone]}>{step.label}</Text>
                </View>
              ))}
            </View>
          </Card>
        )}

        {phase === 'done' && (
          <Card style={styles.doneCard} animated>
            <Text style={styles.doneIcon}>✅</Text>
            <Text style={styles.doneTitle}>Analysis Complete!</Text>
            <Text style={styles.doneSubtitle}>Redirecting to your results...</Text>
          </Card>
        )}

        {phase === 'error' && (
          <Card style={styles.errorCard} animated>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorTitle}>Something went wrong</Text>
            <Text style={styles.errorMessage}>{phaseMessage}</Text>
            <Button label="Try Again" onPress={handleReset} variant="outline" style={{ marginTop: 16 }} />
          </Card>
        )}

        {phase === 'idle' && (
          <View style={styles.infoCards}>
            <Text style={styles.infoSectionTitle}>What you'll get</Text>
            {infoItems.map((item, index) => (
              <Card key={index} variant="flat" style={styles.infoCard} delay={index * 100 + 200} animated>
                <View style={styles.infoCardRow}>
                  <View style={styles.infoCardIconBox}><Text style={styles.infoCardIcon}>{item.icon}</Text></View>
                  <View style={styles.infoCardText}>
                    <Text style={styles.infoCardTitle}>{item.title}</Text>
                    <Text style={styles.infoCardDesc}>{item.desc}</Text>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// ——— Analyzing spinner —————————————————————————————————————————————————————————

const AnalyzingIndicator: React.FC = () => {
  const rotate = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotate, { toValue: 1, duration: 1400, easing: Easing.linear, useNativeDriver: true })
    ).start();
  }, []);
  const spin = rotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  return (
    <View style={styles.spinnerContainer}>
      <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]}>
        <LinearGradient colors={[Colors.primary, Colors.primaryLighter]} style={styles.spinnerGradient} />
      </Animated.View>
      <View style={styles.spinnerCenter}><Text style={styles.spinnerEmoji}>🤖</Text></View>
    </View>
  );
};

const infoItems = [
  { icon: '🧠', title: 'AI Skill Extraction', desc: 'Identifies technical and soft skills automatically' },
  { icon: '📊', title: 'Resume Score', desc: 'Get a quality score and actionable improvements' },
  { icon: '💼', title: 'Job Recommendations', desc: '6 tailored roles with relevance scores' },
];

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { padding: Spacing.base, paddingBottom: 100 },
  pageHeader: { marginBottom: 24, paddingTop: Spacing.sm },
  stepText: {
    fontSize: Typography.xs,
    color: Colors.primary,
    fontWeight: Typography.semibold,
    letterSpacing: 1,
    marginBottom: 6,
  },
  pageTitle: { fontSize: Typography['3xl'], fontWeight: Typography.bold, color: Colors.textPrimary, letterSpacing: -0.8, marginBottom: 8 },
  pageSubtitle: { fontSize: Typography.sm, color: Colors.textSecondary, lineHeight: 20 },
  
  dropZone: {
    marginBottom: 24,
    borderStyle: 'dashed',
    borderColor: Colors.primaryLight,
    borderWidth: 1.5,
    backgroundColor: Colors.surface,
  },
  dropZoneInner: { alignItems: 'center', paddingVertical: 28 },
  dropZoneIconBox: { width: 72, height: 72, borderRadius: 20, backgroundColor: Colors.primaryLighter, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  dropZoneIcon: { fontSize: 36 },
  dropZoneTitle: { fontSize: Typography.xl, fontWeight: Typography.bold, color: Colors.textPrimary, marginBottom: 6 },
  dropZoneSubtitle: { fontSize: Typography.sm, color: Colors.textTertiary, marginBottom: 4 },
  dropZoneHint: { fontSize: Typography.xs, color: Colors.textTertiary, marginTop: 12 },
  
  progressCard: { marginBottom: 24, padding: 20 },
  progressFileRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 12 },
  progressFileIcon: { width: 42, height: 42, borderRadius: 10, backgroundColor: Colors.primaryLighter, alignItems: 'center', justifyContent: 'center' },
  progressFileInfo: { flex: 1 },
  progressFileName: { fontSize: Typography.sm, fontWeight: Typography.semibold, color: Colors.textPrimary },
  progressFileSize: { fontSize: Typography.xs, color: Colors.textTertiary, marginTop: 2 },
  progressPercent: { fontSize: Typography.sm, fontWeight: Typography.bold, color: Colors.primary },
  progressTrack: { height: 6, backgroundColor: Colors.neutral100, borderRadius: 3, overflow: 'hidden', marginBottom: 10 },
  progressFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 3 },
  progressLabel: { fontSize: Typography.xs, color: Colors.textTertiary, textAlign: 'center' },
  
  analyzingCard: { alignItems: 'center', padding: 28, marginBottom: 24 },
  spinnerContainer: { width: 72, height: 72, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  spinner: { width: 72, height: 72, borderRadius: 36, position: 'absolute' },
  spinnerGradient: { width: 72, height: 72, borderRadius: 36, borderWidth: 4, borderColor: 'transparent' },
  spinnerCenter: { width: 54, height: 54, borderRadius: 27, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  spinnerEmoji: { fontSize: 26 },
  analyzingTitle: { fontSize: Typography.xl, fontWeight: Typography.bold, color: Colors.textPrimary, marginBottom: 8 },
  analyzingSubtitle: { fontSize: Typography.sm, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  analyzingSteps: { width: '100%', gap: 12 },
  analyzingStep: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.neutral50, borderRadius: BorderRadius.lg, padding: 12 },
  analyzingStepIcon: { fontSize: 16 },
  analyzingStepText: { fontSize: Typography.sm, color: Colors.textTertiary },
  analyzingStepDone: { color: Colors.textPrimary, fontWeight: Typography.medium },
  
  doneCard: { alignItems: 'center', padding: 32, marginBottom: 24 },
  doneIcon: { fontSize: 48, marginBottom: 14 },
  doneTitle: { fontSize: Typography.xl, fontWeight: Typography.bold, color: Colors.success, marginBottom: 6 },
  doneSubtitle: { fontSize: Typography.sm, color: Colors.textTertiary },
  errorCard: { alignItems: 'center', padding: 28, marginBottom: 24 },
  errorIcon: { fontSize: 40, marginBottom: 14 },
  errorTitle: { fontSize: Typography.lg, fontWeight: Typography.bold, color: Colors.error, marginBottom: 8 },
  errorMessage: { fontSize: Typography.sm, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20 },
  
  infoCards: { 
    marginTop: 10,
    gap: 14, 
  },
  infoSectionTitle: { fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.textPrimary, marginBottom: 4, letterSpacing: -0.2 },
  infoCard: { 
    padding: 16,
    borderRadius: BorderRadius.xl,
  },
  infoCardRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  infoCardIconBox: { 
    width: 48, 
    height: 48, 
    borderRadius: 14, 
    backgroundColor: Colors.primaryLighter, 
    alignItems: 'center', 
    justifyContent: 'center', 
  },
  infoCardIcon: { fontSize: 20 },
  infoCardText: { flex: 1 },
  infoCardTitle: { fontSize: Typography.sm, fontWeight: Typography.semibold, color: Colors.textPrimary, marginBottom: 2 },
  infoCardDesc: { fontSize: Typography.xs, color: Colors.textTertiary, lineHeight: 17 },
});

export default UploadScreen;