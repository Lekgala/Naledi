import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { typography, spacing, borderRadius, getShadowStyle, useThemeColors } from '@utils/theme';

const EMOJI_BUBBLES = '\u{1FAE7}';
const EMOJI_SPROUT = '\u{1F331}';
const EMOJI_SPARKLES = '\u2728';
const EMOJI_WHITE_HEART = '\u{1F90D}';

const phaseLabels: Record<string, { label: string; bg: string; tone: string; note: string; titleColor: string; bodyColor: string }> = {
  menstrual: {
    label: `Menstrual phase ${EMOJI_BUBBLES}`,
    bg: '#F4A0B5',
    tone: 'Soft reset',
    note: 'A slower stretch. Rest counts today.',
    titleColor: '#FFF8FB',
    bodyColor: '#6E3146'
  },
  follicular: {
    label: `Follicular phase ${EMOJI_SPROUT}`,
    bg: '#F9DEC1',
    tone: 'Fresh energy',
    note: 'Your body may feel lighter and a little more open.',
    titleColor: '#533428',
    bodyColor: '#7A5442'
  },
  ovulation: {
    label: `Ovulation day ${EMOJI_SPARKLES}`,
    bg: '#F6C28B',
    tone: 'Main character energy',
    note: 'You are glowing today, so lean into that spark.',
    titleColor: '#4F2B13',
    bodyColor: '#75492D'
  },
  luteal: {
    label: `Luteal phase ${EMOJI_WHITE_HEART}`,
    bg: '#F7D5DA',
    tone: 'Gentle grounding',
    note: 'A good time to soften your pace and check in with yourself.',
    titleColor: '#5A3140',
    bodyColor: '#7A5260'
  }
};

const PhaseBanner = ({ phase }: { phase: 'menstrual' | 'follicular' | 'ovulation' | 'luteal' }) => {
  const colors = useThemeColors();
  const shadowStyle = getShadowStyle(colors);
  const phaseStyle = phaseLabels[phase];

  return (
    <View style={[styles.banner, shadowStyle, { backgroundColor: phaseStyle.bg, borderColor: colors.surface }]}>
      <View style={[styles.orbLarge, { backgroundColor: colors.surface }]} />
      <View style={[styles.orbSmall, { backgroundColor: colors.surfaceSoft }]} />
      <View style={styles.copy}>
        <Text style={[styles.tone, { color: phaseStyle.bodyColor }]}>{phaseStyle.tone}</Text>
        <Text style={[styles.text, { color: phaseStyle.titleColor }]}>{phaseStyle.label}</Text>
        <Text style={[styles.note, { color: phaseStyle.bodyColor }]}>{phaseStyle.note}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    borderRadius: borderRadius.xxl,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    overflow: 'hidden'
  },
  orbLarge: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    right: -68,
    bottom: -86,
    opacity: 0.92
  },
  orbSmall: {
    position: 'absolute',
    width: 74,
    height: 74,
    borderRadius: 37,
    right: 48,
    top: -12,
    opacity: 0.45
  },
  copy: {
    flex: 1,
    maxWidth: '72%'
  },
  tone: {
    fontFamily: typography.body,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.8
  },
  text: {
    fontFamily: typography.body,
    fontSize: 18,
    fontWeight: '600'
  },
  note: {
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 6
  }
});

export default PhaseBanner;
