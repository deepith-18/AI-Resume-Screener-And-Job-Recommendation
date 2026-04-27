import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import MainTabNavigator from './MainTabNavigator';
import { ResumeAnalysisScreen } from '../screens/ResumeAnalysisScreen';
import { JobRecommendationsScreen } from '../screens/JobRecommendationsScreen'; 
import RoadmapScreen from '../screens/RoadmapScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Main" component={MainTabNavigator} />
        <Stack.Screen name="Roadmap" component={RoadmapScreen} />

        {/* ✅ RESUME ANALYSIS SCREEN */}
        <Stack.Screen name="ResumeAnalysis" component={ResumeAnalysisScreen} />

        {/* 🔥 STEP 2: ADDED JOB RECOMMENDATIONS SCREEN */}
        <Stack.Screen 
          name="JobRecommendations" 
          component={JobRecommendationsScreen} 
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}