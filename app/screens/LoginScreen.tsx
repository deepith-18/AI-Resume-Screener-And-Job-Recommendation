/**
 * screens/LoginScreen.tsx
 * Dynamic AI Gradient Background for a premium brand experience.
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Platform, 
  StatusBar,
  ScrollView,
  Animated,
  Dimensions,
  Easing
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Shadows } from '../utils/theme';
import Button from '../components/Button';

// Get screen size for full-screen background
const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ✅ BACKGROUND ANIMATION LOGIC
  const animValue1 = useRef(new Animated.Value(0)).current;
  const animValue2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Defines a slow, infinite animation path for the shapes
    const createAnimation = (value: Animated.Value, duration: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, {
            toValue: 1,
            duration: duration,
            easing: Easing.inOut(Easing.linear),
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: duration,
            easing: Easing.inOut(Easing.linear),
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    createAnimation(animValue1, 15000); // 15 seconds for one cycle
    createAnimation(animValue2, 25000); // 25 seconds for the second cycle (avoids synchronization)
  }, []);

  // Calculate moving positions based on screen size
  const translateX1 = animValue1.interpolate({
    inputRange: [0, 1],
    outputRange: [-width * 0.2, width * 0.2],
  });
  
  const translateY1 = animValue1.interpolate({
    inputRange: [0, 1],
    outputRange: [-height * 0.1, height * 0.1],
  });

  const translateX2 = animValue2.interpolate({
    inputRange: [0, 1],
    outputRange: [width * 0.1, -width * 0.2],
  });

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
      {/* ✅ 1. ANIMATED BACKGROUND LAYER */}
      <View style={StyleSheet.absoluteFill}>
        {/* Soft Peach Circle */}
        <Animated.View style={[
          styles.bokehShape,
          { 
            backgroundColor: '#FFEDE9', 
            width: width * 1.5,
            height: width * 1.5,
            top: -height * 0.4,
            left: -width * 0.3,
            opacity: 0.5,
            transform: [{ translateX: translateX1 }, { translateY: translateY1 }] 
          }
        ]} />
        
        {/* Lighter Sky Blue Circle */}
        <Animated.View style={[
          styles.bokehShape,
          { 
            backgroundColor: '#E0F2FE', 
            width: width * 1.2,
            height: width * 1.2,
            bottom: -height * 0.3,
            right: -width * 0.3,
            opacity: 0.4,
            transform: [{ translateX: translateX2 }] 
          }
        ]} />
      </View>

      {/* ✅ 2. UI LAYER (using transparent background) */}
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        
        {/* HERO BRAND SECTION */}
        <View style={styles.brandContainer}>
          <View style={styles.logoIconBox}>
            <Ionicons name="scan-outline" size={32} color="#FFF" />
          </View>
          <Text style={styles.brandName}>CareerLens <Text style={styles.brandAi}>AI</Text></Text>
          <Text style={styles.brandTagline}>Your future, clearly focused.</Text>
        </View>

        <View style={styles.cardContainer}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>
            New here? 
            <Text style={styles.link} onPress={() => navigation.navigate('Signup')}> Create account</Text>
          </Text>

          {/* FORM */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>EMAIL ADDRESS</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>PASSWORD</Text>
                <TouchableOpacity><Text style={styles.forgotText}>Forgot?</Text></TouchableOpacity>
              </View>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <Button 
              label="Sign In" 
              onPress={() => navigation.navigate('Main')} 
              style={styles.loginBtn}
            />
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' }, // Soft off-white base
  scrollContent: { paddingBottom: 40 },
  
  // New: Background Shapes
  bokehShape: {
    position: 'absolute',
    borderRadius: 1000, // Make them circles
  },

  brandContainer: {
    paddingTop: Platform.OS === 'ios' ? 80 : 60,
    paddingBottom: 40,
    alignItems: 'center',
    backgroundColor: 'transparent', // Modified to show background
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    // Shadows removed here so it looks integrated with the new background
  },
  logoIconBox: {
    width: 70,
    height: 70,
    borderRadius: 22,
    backgroundColor: '#D94E28',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    transform: [{ rotate: '-10deg' }]
  },
  brandName: { fontSize: 28, fontWeight: '900', color: '#111827', letterSpacing: -1 },
  brandAi: { color: '#D94E28' },
  brandTagline: { fontSize: 14, color: '#6B7280', marginTop: 4, fontWeight: '500' },
  
  cardContainer: { paddingHorizontal: 24, marginTop: 30 },
  title: { fontSize: 24, fontWeight: '800', color: '#111827' },
  subtitle: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  link: { color: '#D94E28', fontWeight: '700' },
  
  form: { marginTop: 30 },
  inputGroup: { marginBottom: 20 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontSize: 11, fontWeight: '800', color: '#9CA3AF', marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' },
  forgotText: { fontSize: 12, color: '#D94E28', fontWeight: '700' },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 16,
    color: '#111827',
    ...Shadows.sm, // Added subtle shadow back here for input separation
  },
  loginBtn: { marginTop: 10, backgroundColor: '#D94E28', height: 56, borderRadius: 16 },
});