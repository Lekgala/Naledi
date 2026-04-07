import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { typography, useThemeColors } from '../utils/theme';

const BrandWordmark = ({ subtitle }: { subtitle?: string }) => {
  const colors = useThemeColors();

  return (
    <View style={styles.wrap}>
      <View style={[styles.mark, { backgroundColor: colors.surface }]}>
        <View style={[styles.petalTop, { backgroundColor: colors.primary }]} />
        <View style={[styles.petalRight, { backgroundColor: colors.accent }]} />
        <View style={[styles.petalBottomRight, { backgroundColor: colors.secondary }]} />
        <View style={[styles.petalBottomLeft, { backgroundColor: colors.surfaceWarm }]} />
        <View style={[styles.petalLeft, { backgroundColor: colors.surfaceSoft, borderColor: colors.border }]} />
        <Text style={[styles.star, { color: colors.primary }]}>✦</Text>
      </View>
      <View>
        <Text style={[styles.wordmark, { color: colors.text }]}>Naledi</Text>
        {subtitle ? <Text style={[styles.subtitle, { color: colors.muted }]}>{subtitle}</Text> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  mark: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    position: 'relative',
    overflow: 'hidden'
  },
  petalTop: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    top: 4,
    left: 16
  },
  petalRight: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    right: 6,
    top: 14
  },
  petalBottomRight: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    right: 10,
    bottom: 8
  },
  petalBottomLeft: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    left: 10,
    bottom: 8
  },
  petalLeft: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    left: 6,
    top: 14,
    borderWidth: 1
  },
  star: {
    fontSize: 18,
    marginTop: -1
  },
  wordmark: {
    fontFamily: typography.display,
    fontSize: 28,
    lineHeight: 30
  },
  subtitle: {
    fontFamily: typography.body,
    fontSize: 11,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    marginTop: 2
  }
});

export default BrandWordmark;
