// screens/RoadmapScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Colors, Typography, BorderRadius } from '../utils/theme';
import { ROADMAPS, getDynamicLinks } from '../utils/roadmap';
import Card from '../components/Card';
import ScoreRing from '../components/ScoreRing';
import { Header } from '../components/Header';

export const RoadmapScreen: React.FC = ({ route, navigation }: any) => {
  const role = route.params?.role;
  const roleTitle = role?.title || "Software Engineer";
  
  // Get static roadmap or use a default one
  const roadmapData = ROADMAPS[roleTitle] || ROADMAPS["Software Engineer"];
  // Generate dynamic links based on the EXACT role selected
  const dynamicLinks = getDynamicLinks(roleTitle);

  return (
    <View style={styles.container}>
      <Header title="Learning Roadmap" showBack />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.stepText}>STEP 04 — CAREER ACCELERATOR</Text>
        <Text style={styles.mainTitle}>{roleTitle} Roadmap</Text>

        {/* Selected Role Summary */}
        <Card style={styles.heroCard}>
          <View style={styles.heroRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroLabel}>TARGET ROLE</Text>
              <Text style={styles.heroTitle}>{roleTitle}</Text>
              <View style={styles.gapContainer}>
                {role?.missingSkills?.slice(0, 2).map((skill: string, i: number) => (
                  <Text key={i} style={styles.gapText}>• Need to learn: {skill}</Text>
                ))}
              </View>
            </View>
            <ScoreRing score={role?.relevanceScore || 0} />
          </View>
        </Card>

        {/* Dynamic Phases/Weeks */}
        {roadmapData.weeks.map((phase: any, index: number) => (
          <View key={index} style={styles.phaseWrapper}>
            <View style={styles.timelineConnector}>
              <View style={styles.circleNumber}><Text style={styles.circleText}>{index + 1}</Text></View>
              {index !== roadmapData.weeks.length - 1 && <View style={styles.line} />}
            </View>
            
            <Card style={styles.phaseCard}>
              <View style={styles.badgeRow}>
                <View style={styles.phaseBadge}><Text style={styles.phaseBadgeText}>PHASE 0{index + 1}</Text></View>
                <View style={styles.levelBadge}><Text style={styles.levelText}>{phase.level}</Text></View>
              </View>
              <Text style={styles.weekTitle}>{phase.title}</Text>
              <Text style={styles.weekDesc}>{phase.description}</Text>
              <Text style={styles.resourceText}>📚 <Text style={{fontWeight:'600'}}>Resources:</Text> {phase.resources}</Text>
              <TouchableOpacity style={styles.finishBtn}>
                <Text style={styles.finishBtnText}>Mark as Finished</Text>
              </TouchableOpacity>
            </Card>
          </View>
        ))}

        {/* Resource Links Section */}
        <View style={styles.linksGrid}>
          <TouchableOpacity style={styles.iconLink} onPress={() => Linking.openURL(dynamicLinks.github)}>
            <Text style={styles.iconEmoji}>📂</Text>
            <Text style={styles.iconLinkText}>GitHub Projects</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconLink} onPress={() => Linking.openURL(dynamicLinks.courses)}>
            <Text style={styles.iconEmoji}>🎓</Text>
            <Text style={styles.iconLinkText}>Online Courses</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconLink} onPress={() => Linking.openURL(dynamicLinks.linkedin)}>
            <Text style={styles.iconEmoji}>💼</Text>
            <Text style={styles.iconLinkText}>LinkedIn Jobs</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Actions */}
        <View style={styles.footer}>
           <TouchableOpacity style={styles.resetBtn} onPress={() => navigation.popToTop()}>
            <Text style={styles.resetBtnText}>Reset Roadmap</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('Upload')}>
            <Text style={styles.primaryBtnText}>Analyze New Resume</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backLink}>
            <Text style={styles.backLinkText}>← Change Role</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { padding: 20, paddingBottom: 50 },
  stepText: { color: Colors.primary, fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  mainTitle: { fontSize: 24, fontWeight: '800', color: Colors.textPrimary, marginBottom: 20 },
  heroCard: { padding: 20, backgroundColor: Colors.surface, borderRadius: 20 },
  heroRow: { flexDirection: 'row', alignItems: 'center' },
  heroLabel: { fontSize: 10, color: Colors.textSecondary, fontWeight: '600' },
  heroTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.textPrimary, marginVertical: 4 },
  gapContainer: { marginTop: 8 },
  gapText: { fontSize: 12, color: '#EF4444', fontWeight: '500' },
  phaseWrapper: { flexDirection: 'row', marginBottom: 20 },
  timelineConnector: { alignItems: 'center', marginRight: 15, width: 30 },
  circleNumber: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#FFF', borderWidth: 1, borderColor: Colors.primary, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  circleText: { color: Colors.primary, fontWeight: 'bold' },
  line: { width: 2, flex: 1, backgroundColor: '#E5E7EB', position: 'absolute', top: 30, bottom: -20 },
  phaseCard: { flex: 1, padding: 16, backgroundColor: '#FFF', borderRadius: 16 },
  badgeRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  phaseBadge: { backgroundColor: '#F3F4F6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  phaseBadgeText: { fontSize: 10, fontWeight: '700', color: Colors.textSecondary },
  levelBadge: { backgroundColor: Colors.primaryLighter, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  levelText: { fontSize: 10, fontWeight: '700', color: Colors.primary },
  weekTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 8 },
  weekDesc: { fontSize: 14, color: Colors.textSecondary, lineHeight: 20, marginBottom: 12 },
  resourceText: { fontSize: 13, color: Colors.textPrimary, marginBottom: 16 },
  finishBtn: { borderWidth: 1, borderColor: Colors.border, padding: 10, borderRadius: 10, alignItems: 'center' },
  finishBtnText: { fontWeight: '700', fontSize: 14, color: Colors.textPrimary },
  linksGrid: { gap: 12, marginTop: 10 },
  iconLink: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#F3F4F6' },
  iconEmoji: { fontSize: 20, marginRight: 12 },
  iconLinkText: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  footer: { marginTop: 30, gap: 15 },
  resetBtn: { padding: 15, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, alignItems: 'center' },
  resetBtnText: { fontWeight: '600', color: Colors.textPrimary },
  primaryBtn: { backgroundColor: '#D94E28', padding: 16, borderRadius: 12, alignItems: 'center' },
  primaryBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  backLink: { alignItems: 'center' },
  backLinkText: { color: Colors.textSecondary, fontWeight: '600' }
});

export default RoadmapScreen;