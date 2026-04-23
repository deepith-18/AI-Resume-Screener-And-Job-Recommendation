/**
 * components/ScoreRing.tsx (FIXED - no reanimated)
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors, Typography, getScoreColor } from '../utils/theme';
import { getScoreLabel } from '../utils/helpers';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  delay?: number;
  showLabel?: boolean;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  size = 120,
  strokeWidth = 8,
  delay = 300,
  showLabel = true,
}) => {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: score / 100,
      duration: 1200,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false, // required for SVG
    }).start();
  }, [score]);

  // Interpolate strokeDashoffset
  const strokeDashoffset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  const scoreColor = getScoreColor(score);
  const scoreLabel = getScoreLabel(score);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Track */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={Colors.neutral100}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Animated Progress */}
        <AnimatedCircle
          cx={center}
          cy={center}
          r={radius}
          stroke={scoreColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90, ${center}, ${center})`}
        />
      </Svg>

      {/* Center Text */}
      <View style={styles.centerContent}>
        <Text style={[styles.scoreText, { color: scoreColor }]}>
          {score}
        </Text>
        {showLabel && (
          <Text style={styles.labelText}>{scoreLabel}</Text>
        )}
      </View>
    </View>
  );
};

// 🔥 Required wrapper for SVG animation
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default ScoreRing;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: Typography['3xl'],
    fontWeight: Typography.bold,
    lineHeight: 36,
  },
  labelText: {
    fontSize: Typography.xs,
    color: Colors.textTertiary,
    fontWeight: Typography.medium,
    marginTop: 2,
    letterSpacing: 0.3,
  },
});