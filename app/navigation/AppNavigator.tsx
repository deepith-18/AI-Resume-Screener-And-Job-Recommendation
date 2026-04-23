/**
 * navigation/AppNavigator.tsx
 */

import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import UploadScreen from '../screens/UploadScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ResumeAnalysisScreen from '../screens/ResumeAnalysisScreen';
import JobRecommendationsScreen from '../screens/JobRecommendationsScreen';

import { Colors, BorderRadius, Shadows } from '../utils/theme';
import {
  RootStackParamList,
  MainTabParamList,
  HomeStackParamList,
} from '../utils/types';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();

// Home Stack
const HomeStackNavigator = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
    <HomeStack.Screen name="ResumeAnalysis" component={ResumeAnalysisScreen} />
    <HomeStack.Screen name="JobRecommendations" component={JobRecommendationsScreen} />
  </HomeStack.Navigator>
);

// Tab Icon
const TabIcon = ({ emoji, label, focused }: any) => (
  <View style={[styles.iconContainer, focused && styles.iconActive]}>
    <Text>{emoji}</Text>
    <Text style={[styles.label, focused && styles.labelActive]}>
      {label}
    </Text>
  </View>
);

// Tabs
const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: styles.tabBar,
      tabBarShowLabel: false,
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeStackNavigator}
      options={{
        tabBarIcon: ({ focused }) => (
          <TabIcon emoji="🏠" label="Home" focused={focused} />
        ),
      }}
    />
    <Tab.Screen
      name="Upload"
      component={UploadScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <TabIcon emoji="📤" label="Upload" focused={focused} />
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <TabIcon emoji="👤" label="Profile" focused={focused} />
        ),
      }}
    />
  </Tab.Navigator>
);

// Root Navigator
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Splash" component={SplashScreen} />
        <RootStack.Screen name="Main" component={MainTabNavigator} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

// Styles
const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 24,
    right: 24,
    borderRadius: BorderRadius['3xl'],
    backgroundColor: Colors.surface,
    height: 64,
    ...Shadows.lg,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  iconActive: {
    backgroundColor: Colors.primaryLighter,
    borderRadius: 10,
  },
  label: {
    fontSize: 10,
    color: Colors.textTertiary,
  },
  labelActive: {
    color: Colors.primary,
  },
});