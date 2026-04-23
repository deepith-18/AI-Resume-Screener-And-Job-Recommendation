/**
 * components/Card.tsx (FIXED - no reanimated)
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { Colors, BorderRadius, Shadows } from '../utils/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  delay?: number;
  animated?: boolean;
  variant?: 'default' | 'elevated' | 'flat' | 'outlined';
  padding?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  delay = 0,
  animated = true,
  variant = 'default',
  padding = 16,
}) => {
  const opacity = useRef(new Animated.Value(animated ? 0 : 1)).current;
  const translateY = useRef(new Animated.Value(animated ? 16 : 0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (animated) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          delay,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 400,
          delay,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, []);

  const animatedStyle = {
    opacity,
    transform: [{ translateY }],
  };

  const pressStyle = {
    transform: [{ scale }],
  };

  const handlePressIn = () => {
    if (onPress) {
      Animated.spring(scale, {
        toValue: 0.98,
        useNativeDriver: true,
        friction: 5,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 5,
      }).start();
    }
  };

  const cardStyle = [
    styles.base,
    styles[`variant_${variant}`],
    { padding },
    style,
  ];

  if (onPress) {
    return (
      <Animated.View style={animatedStyle}>
        <Animated.View style={pressStyle}>
          <TouchableOpacity
            style={cardStyle}
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.9}
          >
            {children}
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[animatedStyle, cardStyle]}>
      {children}
    </Animated.View>
  );
};

export default Card;

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.surface,
  },
  variant_default: {
    ...Shadows.md,
  },
  variant_elevated: {
    ...Shadows.lg,
  },
  variant_flat: {
    backgroundColor: Colors.surfaceSecondary,
  },
  variant_outlined: {
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
});