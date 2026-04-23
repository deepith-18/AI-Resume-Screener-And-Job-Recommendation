import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useFocusEffect,
  useNavigation,
  CommonActions,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { listResumes } from '../services/api';
import { ResumeAnalysis, HomeStackParamList } from '../utils/types';
import { Colors, Typography, Spacing } from '../utils/theme';
import { SkeletonCard } from '../components/Skeleton';
import Button from '../components/Button';

type HomeNavProp = NativeStackNavigationProp<HomeStackParamList, 'HomeScreen'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeNavProp>();

  // State
  const [resumes, setResumes] = useState<ResumeAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Animation Refs
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslate = useRef(new Animated.Value(-10)).current;

  const fetchResumes = async () => {
    try {
      const data = await listResumes();
      setResumes(data || []);
    } catch (e) {
      console.error('Error loading resumes:', e);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Initial Load & Animation
  useEffect(() => {
    fetchResumes();

    Animated.parallel([
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(headerTranslate, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [headerOpacity, headerTranslate]);

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchResumes();
    }, [])
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchResumes();
  };

  const handleResumePress = (resume: ResumeAnalysis) => {
    if (resume.analysisStatus === 'completed') {
      navigation.navigate('ResumeAnalysis', {
        resumeId: resume.resumeId,
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary} // Optional: Matches your theme
          />
        }
      >
        {/* HEADER */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: headerOpacity,
              transform: [{ translateY: headerTranslate }],
            },
          ]}
        >
          <Text style={styles.greeting}>Good day 👋</Text>
          <Text style={styles.title}>Resume Screener</Text>
          <Text style={styles.subtitle}>
            Upload a resume and let AI find jobs
          </Text>
        </Animated.View>

        {/* CTA CARD */}
        <View style={styles.ctaCard}>
          <View>
            <Text style={styles.ctaTitle}>Analyze Resume</Text>
            <Text style={styles.ctaSubtitle}>PDF or DOCX</Text>
          </View>

          <Button
            label="Upload"
            size="sm"
            onPress={() =>
              navigation.dispatch(
                CommonActions.navigate({ name: 'Upload' })
              )
            }
          />
        </View>

        {/* RESUME LIST */}
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : resumes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No resumes found</Text>
          </View>
        ) : (
          resumes.map((resume) => (
            <TouchableOpacity
              key={resume._id}
              style={styles.item}
              activeOpacity={0.7}
              onPress={() => handleResumePress(resume)}
            >
              <Text style={styles.itemText} numberOfLines={1}>
                {resume.fileName}
              </Text>
              <Text style={styles.statusText}>
                {resume.analysisStatus}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: Colors.background 
  },
  scroll: { 
    flex: 1 
  },
  scrollContent: { 
    padding: Spacing.base 
  },
  header: { 
    marginBottom: 24 
  },
  greeting: { 
    fontSize: 14, 
    color: Colors.textTertiary,
    marginBottom: 4
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  subtitle: { 
    fontSize: 16, 
    color: Colors.textSecondary,
    marginTop: 4
  },
  ctaCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    // Add a slight shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  ctaTitle: { 
    color: '#fff', 
    fontSize: 18,
    fontWeight: 'bold' 
  },
  ctaSubtitle: { 
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2
  },
  item: {
    padding: 18,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  statusText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textTransform: 'capitalize',
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: Colors.textTertiary,
  },
});