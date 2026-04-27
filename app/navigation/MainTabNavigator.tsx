/**
 * navigation/MainTabNavigator.tsx
 * Updated with themed icons for CareerLens AI
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import UploadScreen from '../screens/UploadScreen';
import ProfileScreen from '../screens/ProfileScreen';

import { Colors } from '../utils/theme';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarStyle: {
          backgroundColor: Colors.surface || '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
          height: Platform.OS === 'ios' ? 88 : 65, // Adjusted for safe areas
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          paddingTop: 10,
          elevation: 10, // Shadow for Android
          shadowColor: '#000', // Shadow for iOS
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
        },

        tabBarActiveTintColor: '#D94E28', // Branded orange
        tabBarInactiveTintColor: '#9CA3AF', // Neutral gray

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: Platform.OS === 'ios' ? 0 : 4,
        },

        tabBarIcon: ({ color, size, focused }) => {
          let iconName: any;

          if (route.name === 'Home') {
            // Dashboard style icon
            iconName = focused ? 'grid' : 'grid-outline';
          } 
          else if (route.name === 'Upload') {
            // Document/Add style icon
            iconName = focused ? 'document-text' : 'document-text-outline';
          } 
          else if (route.name === 'Profile') {
            // Professional person icon
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          }

          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ tabBarLabel: 'Dashboard' }} 
      />
      <Tab.Screen 
        name="Upload" 
        component={UploadScreen} 
        options={{ tabBarLabel: 'Analyze' }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ tabBarLabel: 'Profile' }} 
      />
    </Tab.Navigator>
  );
}