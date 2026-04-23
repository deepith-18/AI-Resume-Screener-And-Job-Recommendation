import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { Colors, BorderRadius } from '../utils/theme';

// ─── Single skeleton card ─────────────────────────────

export const SkeletonCard = () => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[styles.card, { opacity }]} />
  );
};

// ─── FULL analysis skeleton (this was missing) ─────────

export const SkeletonAnalysis = () => {
  return (
    <View style={{ padding: 16 }}>
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </View>
  );
};

export default SkeletonAnalysis;

// ─── styles ───────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    height: 100,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginBottom: 12,
  },
});