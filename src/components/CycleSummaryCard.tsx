import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CyclePrediction } from '../types/models';
import { typography, spacing, getShadowStyle, useThemeColors } from '../utils/theme';

const EMOJI_MOON = '\u{1F319}';
const EMOJI_SPARKLES = '\u2728';
const EMOJI_BLOSSOM = '\u{1F33C}';
const EMOJI_HEART = '\u{1F497}';

const CycleSummaryCard = ({ prediction }: { prediction: CyclePrediction }) => {
  const colors = useThemeColors();
  const shadowStyle = getShadowStyle(colors);
  const nextPeriodCopy =
    prediction.daysUntilNextPeriod === 0
      ? 'Your period may arrive today, so go gently with yourself.'
      : prediction.daysUntilNextPeriod === 1
        ? 'Your next period is likely tomorrow.'
        : `Your next period is likely in ${prediction.daysUntilNextPeriod} days.`;

  return (
    <View style={[styles.card, shadowStyle, { backgroundColor: colors.surface }]}>
      <View style={[styles.pill, { backgroundColor: colors.surfaceSoft, borderColor: colors.border }]}>
        <Text style={[styles.pillText, { color: colors.primary }]}>{`Cycle day ${prediction.cycleDay}`}</Text>
      </View>
      <Text style={[styles.kicker, { color: colors.primary }]}>{`A little light from Naledi ${EMOJI_MOON}`}</Text>
      <Text style={[styles.label, { color: colors.muted }]}>{`A soft view of your rhythm ${EMOJI_SPARKLES}`}</Text>
      <Text style={[styles.main, { color: colors.text }]}>{nextPeriodCopy}</Text>
      <View style={styles.metaRow}>
        <View style={[styles.metaChip, { backgroundColor: colors.surfaceSoft, borderColor: colors.border }]}> 
          <Text style={[styles.metaLabel, { color: colors.muted }]}>{`Ovulation ${EMOJI_BLOSSOM}`}</Text>
          <Text style={[styles.metaValue, { color: colors.text }]}>{new Date(prediction.ovulationDate).toDateString()}</Text>
        </View>
        <View style={[styles.metaChip, { backgroundColor: colors.surfaceSoft, borderColor: colors.border }]}> 
          <Text style={[styles.metaLabel, { color: colors.muted }]}>{`Check-in ${EMOJI_HEART}`}</Text>
          <Text style={[styles.metaValue, { color: colors.text }]}>A few seconds is enough today.</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    padding: 24,
    marginTop: 18
  },
  pill: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12
  },
  pillText: {
    fontFamily: typography.body,
    fontSize: 12,
    fontWeight: '700'
  },
  kicker: {
    fontFamily: typography.body,
    marginBottom: 8,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8
  },
  label: {
    fontFamily: typography.body,
    marginBottom: 8,
    fontSize: 14
  },
  main: {
    fontFamily: typography.display,
    fontSize: 28,
    lineHeight: 34,
    marginBottom: 16
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.sm
  },
  metaChip: {
    flex: 1,
    borderRadius: 22,
    padding: 14,
    borderWidth: 1
  },
  metaLabel: {
    fontFamily: typography.body,
    fontSize: 12,
    marginBottom: 4
  },
  metaValue: {
    fontFamily: typography.body,
    fontSize: 13,
    lineHeight: 18
  }
});

export default CycleSummaryCard;


