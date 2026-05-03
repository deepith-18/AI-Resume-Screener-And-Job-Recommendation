import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Platform, 
  StatusBar,
  ScrollView,
  Animated,
  Dimensions,
  Easing,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Shadows } from '../utils/theme';
import Button from '../components/Button';
import { loginUser } from '../services/api'; 

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ BACKGROUND ANIMATION
  const animValue1 = useRef(new Animated.Value(0)).current;
  const animValue2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createAnimation = (value: Animated.Value, duration: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, { toValue: 1, duration, easing: Easing.inOut(Easing.linear), useNativeDriver: true }),
          Animated.timing(value, { toValue: 0, duration, easing: Easing.inOut(Easing.linear), useNativeDriver: true }),
        ])
      ).start();
    };
    createAnimation(animValue1, 15000);
    createAnimation(animValue2, 25000);
  }, []);
const handleLogin = async () => {
  if (!email || !password) {
    Alert.alert("Error", "Please enter email and password");
    return;
  }

  const cleanEmail = email.toLowerCase().trim();

  console.log("🧪 INPUT EMAIL:", email);
  console.log("📤 CLEAN EMAIL:", cleanEmail);

  setLoading(true);

  try {
    // 🔥 Wake backend (important for Render)
    await fetch("https://resume-backend-q39r.onrender.com/api/health");

    // 🔁 Try login (first attempt)
    let response;
    try {
      response = await loginUser(cleanEmail, password);
    } catch (err) {
      console.log("⚠️ Retry login...");
      response = await loginUser(cleanEmail, password); // retry once
    }

    console.log("📥 LOGIN RESPONSE:", response);

    if (response && response.user) {
      await AsyncStorage.setItem('user_id', response.user._id);
      await AsyncStorage.setItem('user_name', response.user.name);
      await AsyncStorage.setItem('user_email', cleanEmail);

      navigation.navigate('Main');
    } else {
      Alert.alert("Error", "User data not found in response");
    }

  } catch (error: any) {
    console.log("❌ LOGIN ERROR:", error);
    Alert.alert("Login Failed", error.message || "Network issue, try again");
  } finally {
    setLoading(false);
  }
};
  const translateX1 = animValue1.interpolate({ inputRange: [0, 1], outputRange: [-width * 0.2, width * 0.2] });
  const translateY1 = animValue1.interpolate({ inputRange: [0, 1], outputRange: [-height * 0.1, height * 0.1] });
  const translateX2 = animValue2.interpolate({ inputRange: [0, 1], outputRange: [width * 0.1, -width * 0.2] });

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
      {/* BACKGROUND LAYER */}
      <View style={StyleSheet.absoluteFill}>
        <Animated.View style={[styles.bokehShape, { backgroundColor: '#FFEDE9', width: width * 1.5, height: width * 1.5, top: -height * 0.4, left: -width * 0.3, opacity: 0.5, transform: [{ translateX: translateX1 }, { translateY: translateY1 }] }]} />
        <Animated.View style={[styles.bokehShape, { backgroundColor: '#E0F2FE', width: width * 1.2, height: width * 1.2, bottom: -height * 0.3, right: -width * 0.3, opacity: 0.4, transform: [{ translateX: translateX2 }] }]} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
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
              <Text style={styles.label}>PASSWORD</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            {/* ✅ ACTION BUTTON */}
            <Button 
              label={loading ? "" : "Sign In"} 
              onPress={handleLogin} 
              style={styles.loginBtn}
              disabled={loading}
            >
              {loading && <ActivityIndicator color="#FFF" />}
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollContent: { paddingBottom: 40 },
  bokehShape: { position: 'absolute', borderRadius: 1000 },
  brandContainer: { paddingTop: Platform.OS === 'ios' ? 80 : 60, paddingBottom: 40, alignItems: 'center' },
  logoIconBox: { width: 70, height: 70, borderRadius: 22, backgroundColor: '#D94E28', alignItems: 'center', justifyContent: 'center', marginBottom: 16, transform: [{ rotate: '-10deg' }] },
  brandName: { fontSize: 28, fontWeight: '900', color: '#111827', letterSpacing: -1 },
  brandAi: { color: '#D94E28' },
  brandTagline: { fontSize: 14, color: '#6B7280', marginTop: 4, fontWeight: '500' },
  cardContainer: { paddingHorizontal: 24, marginTop: 30 },
  title: { fontSize: 24, fontWeight: '800', color: '#111827' },
  subtitle: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  link: { color: '#D94E28', fontWeight: '700' },
  form: { marginTop: 30 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 11, fontWeight: '800', color: '#9CA3AF', marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' },
  input: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E5E7EB', fontSize: 16, color: '#111827', ...Shadows.sm },
  loginBtn: { marginTop: 10, backgroundColor: '#D94E28', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
});