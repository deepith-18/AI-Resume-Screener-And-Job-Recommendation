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
  Easing,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator // Added for loading state
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Ensure this is installed
import { Ionicons } from '@expo/vector-icons';
import { Shadows } from '../utils/theme';
import Button from '../components/Button';

import { registerUser } from '../services/api';

const { width } = Dimensions.get('window');

export default function SignupScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isFocused, setIsFocused] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Added loading state

  // ✅ NEW: HANDLE SIGNUP LOGIC
const handleSignup = async () => {
  if (!name || !email || !password) {
    Alert.alert("Error", "Please fill in all fields");
    return;
  }

  const cleanEmail = email.toLowerCase().trim();

  console.log("🧪 SIGNUP EMAIL:", cleanEmail);

  setLoading(true);

  try {
    // Wake backend (important for Render)
    await fetch("https://resume-backend-q39r.onrender.com/api/health");

    const response = await registerUser(name, cleanEmail, password);

    console.log("📥 SIGNUP RESPONSE:", response);

    if (response && response.user) {
      await AsyncStorage.setItem('user_id', response.user._id);
      await AsyncStorage.setItem('user_name', response.user.name);
      await AsyncStorage.setItem('user_email', cleanEmail);

      navigation.navigate('Main');
    } else {
      Alert.alert("Error", "Signup failed");
    }

  } catch (error: any) {
    console.log("❌ SIGNUP ERROR:", error);
    Alert.alert("Signup Failed", error.message || "Try again");
  } finally {
    setLoading(false);
  }
};

  // --- ANIMATION LOGIC (Keep as is) ---
  const bgAnim1 = useRef(new Animated.Value(0)).current;
  const bgAnim2 = useRef(new Animated.Value(0)).current;
  const contentFade = useRef(new Animated.Value(0)).current;
  const contentMove = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    const loop = (val: Animated.Value, duration: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(val, { toValue: 1, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(val, { toValue: 0, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ])
      ).start();
    };
    loop(bgAnim1, 20000);
    loop(bgAnim2, 28000);

    Animated.parallel([
      Animated.timing(contentFade, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(contentMove, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true })
    ]).start();
  }, []);

  const bX1 = bgAnim1.interpolate({ inputRange: [0, 1], outputRange: [-20, 40] });
  const bY1 = bgAnim1.interpolate({ inputRange: [0, 1], outputRange: [0, 60] });
  const bX2 = bgAnim2.interpolate({ inputRange: [0, 1], outputRange: [30, -30] });

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.safeArea}
    >
      <StatusBar barStyle="dark-content" />

      {/* DYNAMIC BACKGROUND */}
      <View style={StyleSheet.absoluteFill}>
        <Animated.View style={[styles.bokeh, { 
          backgroundColor: '#FFE5E0', 
          width: width * 1.4, height: width * 1.4, top: -100, right: -150,
          transform: [{ translateX: bX1 }, { translateY: bY1 }] 
        }]} />
        <Animated.View style={[styles.bokeh, { 
          backgroundColor: '#E0F2FE', 
          width: width * 1.2, height: width * 1.2, bottom: -100, left: -100,
          transform: [{ translateX: bX2 }] 
        }]} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: contentFade, transform: [{ translateY: contentMove }] }}>
          
          <View style={styles.brandHeader}>
            <View style={styles.miniLogo}>
              <Ionicons name="rocket" size={18} color="#FFF" />
            </View>
            <Text style={styles.miniBrandText}>CareerLens <Text style={{color: '#111827'}}>AI</Text></Text>
          </View>

          <View style={styles.textSection}>
            <Text style={styles.title}>Start your journey</Text>
            <Text style={styles.subtitle}>
              Join <Text style={styles.highlight}>12,000+</Text> students using AI to land jobs.
            </Text>
          </View>

          <View style={styles.formContainer}>
            {/* Input 1: Name */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>FULL NAME</Text>
              <View style={[styles.inputBox, isFocused === 'name' && styles.inputBoxFocused]}>
                <Ionicons name="person-outline" size={20} color={isFocused === 'name' ? '#D94E28' : '#9CA3AF'} />
                <TextInput 
                  style={styles.textInput}
                  placeholder="John Doe"
                  placeholderTextColor="#9CA3AF"
                  onFocus={() => setIsFocused('name')}
                  onBlur={() => setIsFocused(null)}
                  onChangeText={setName}
                  value={name}
                />
              </View>
            </View>

            {/* Input 2: Email */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
              <View style={[styles.inputBox, isFocused === 'email' && styles.inputBoxFocused]}>
                <Ionicons name="mail-outline" size={20} color={isFocused === 'email' ? '#D94E28' : '#9CA3AF'} />
                <TextInput 
                  style={styles.textInput}
                  placeholder="you@example.com"
                  placeholderTextColor="#9CA3AF"
                  onFocus={() => setIsFocused('email')}
                  onBlur={() => setIsFocused(null)}
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            {/* Input 3: Password */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>CHOOSE PASSWORD</Text>
              <View style={[styles.inputBox, isFocused === 'pass' && styles.inputBoxFocused]}>
                <Ionicons name="lock-closed-outline" size={20} color={isFocused === 'pass' ? '#D94E28' : '#9CA3AF'} />
                <TextInput 
                  style={styles.textInput}
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  onFocus={() => setIsFocused('pass')}
                  onBlur={() => setIsFocused(null)}
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
            </View>

            {/* ✅ UPDATED BUTTON: Calls handleSignup and shows spinner */}
            <Button 
              label={loading ? "" : "Create Account"} 
              onPress={handleSignup} 
              style={styles.mainBtn}
              disabled={loading}
            >
              {loading && <ActivityIndicator color="#FFF" />}
            </Button>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerLink}>
              Already have an account? <Text style={styles.linkText}>Sign In</Text>
            </Text>
          </TouchableOpacity>

        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ... styles remain the same ...
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollContent: { padding: 24, paddingTop: Platform.OS === 'ios' ? 60 : 40 },
  bokeh: { position: 'absolute', borderRadius: 1000, opacity: 0.4 },
  brandHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  miniLogo: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#D94E28', alignItems: 'center', justifyContent: 'center', marginRight: 12, transform: [{ rotate: '-8deg' }] },
  miniBrandText: { fontSize: 18, fontWeight: '800', color: '#D94E28' },
  textSection: { marginBottom: 32 },
  title: { fontSize: 34, fontWeight: '900', color: '#111827', letterSpacing: -1 },
  subtitle: { fontSize: 16, color: '#6B7280', marginTop: 6, lineHeight: 22 },
  highlight: { color: '#D94E28', fontWeight: 'bold' },
  formContainer: { gap: 20 },
  inputWrapper: { gap: 8 },
  inputLabel: { fontSize: 11, fontWeight: '800', color: '#9CA3AF', letterSpacing: 1 },
  inputBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFF', 
    borderRadius: 18, 
    paddingHorizontal: 16, 
    height: 60,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    ...Shadows.sm
  },
  inputBoxFocused: { borderColor: '#D94E28', backgroundColor: '#FFF' },
  textInput: { flex: 1, marginLeft: 12, fontSize: 16, color: '#111827', fontWeight: '500' },
  mainBtn: { height: 62, borderRadius: 20, backgroundColor: '#111827', marginTop: 10, justifyContent: 'center', alignItems: 'center' },
  footerLink: { textAlign: 'center', marginTop: 30, color: '#6B7280', fontSize: 15 },
  linkText: { color: '#D94E28', fontWeight: 'bold' }
});