import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import PlatformSlider from '@components/PlatformSlider';
import { OnboardingData } from './OnboardingStack';
import { borderRadius, getShadowStyle, spacing, typography, useThemeColors } from '@utils/theme';

const CycleLengthScreen = ({ navigation, draftSettings, onUpdate }: { navigation: any; draftSettings: OnboardingData; onUpdate: (value: Partial<OnboardingData>) => void }) => {
  const colors = useThemeColors();
  const shadowStyle = getShadowStyle(colors);
  const cycleLength = draftSettings.avgCycleLength ?? 28;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} bounces={false}>
      <View style={[styles.heroCard, { backgroundColor: colors.surfaceWarm }]}> 
        <Text style={[styles.step, { color: colors.primary }]}>Step 2 of 3</Text>
        <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
          <View style={[styles.progressFill, styles.progressSecond, { backgroundColor: colors.primary }]} />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>How long is your cycle usually?</Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>If you're not sure, 28 days is a lovely place to start. You can always refine it later.</Text>
      </View>

      <View style={[styles.card, shadowStyle, { backgroundColor: colors.surface }]}> 
        <View style={styles.valueWrap}>
          <Text style={[styles.value, { color: colors.primary }]}>{cycleLength}</Text>
          <Text style={[styles.valueLabel, { color: colors.muted }]}>days</Text>
        </View>
        <PlatformSlider
          minimumValue={21}
          maximumValue={35}
          step={1}
          value={cycleLength}
          onValueChange={(value) => onUpdate({ avgCycleLength: value })}
          minimumTrackTintColor={colors.secondary}
          maximumTrackTintColor={colors.border}
          thumbTintColor={colors.primary}
        />
        <View style={styles.rangeLabels}>
          <Text style={[styles.rangeText, { color: colors.muted }]}>Shorter</Text>
          <Text style={[styles.rangeText, { color: colors.muted }]}>Longer</Text>
        </View>
      </View>

      <View style={[styles.tipCard, shadowStyle, { backgroundColor: colors.surfaceWarm }]}> 
        <Text style={[styles.tipTitle, { color: colors.text }]}>Typical range</Text>
        <Text style={[styles.tipText, { color: colors.muted }]}>Most cycles fall somewhere between 21 and 35 days. You can always adjust this after you've logged more data.</Text>
      </View>

      <View style={styles.buttons}>
        <Pressable style={[styles.backButton, { backgroundColor: colors.surfaceSoft, borderColor: colors.border }]} onPress={() => navigation.goBack()}>
          <Text style={[styles.backText, { color: colors.text }]}>Back</Text>
        </Pressable>
        <Pressable style={[styles.nextButton, { backgroundColor: colors.primary }]} onPress={() => navigation.navigate('PeriodLength')}>
          <Text style={styles.nextText}>Next</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flexGrow: 1, padding: spacing.lg, justifyContent: 'space-between' },
  heroCard: { marginTop: spacing.lg, borderRadius: borderRadius.xxl, padding: spacing.xl, marginBottom: spacing.lg },
  step: { fontFamily: typography.body, fontSize: 13, fontWeight: '700', marginBottom: spacing.sm },
  progressTrack: { height: 8, borderRadius: 999, marginBottom: spacing.lg, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 999 },
  progressSecond: { width: '66.66%' },
  card: { borderRadius: borderRadius.xxl, padding: spacing.xl },
  title: { fontFamily: typography.display, fontSize: 36, marginBottom: spacing.sm },
  subtitle: { fontFamily: typography.body, fontSize: 16, lineHeight: 24 },
  valueWrap: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 24 },
  value: { fontFamily: typography.display, fontSize: 54, lineHeight: 58 },
  valueLabel: { fontFamily: typography.body, fontSize: 18, marginLeft: 8, marginBottom: 8 },
  rangeLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 },
  rangeText: { fontFamily: typography.body, fontSize: 13 },
  tipCard: { borderRadius: borderRadius.xxl, padding: spacing.lg, marginTop: 16 },
  tipTitle: { fontFamily: typography.body, fontSize: 15, fontWeight: '700', marginBottom: 8 },
  tipText: { fontFamily: typography.body, fontSize: 14, lineHeight: 22 },
  buttons: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, paddingBottom: 12 },
  backButton: { borderRadius: borderRadius.xxl, paddingVertical: 14, paddingHorizontal: 24, borderWidth: 1 },
  backText: { fontFamily: typography.body, fontSize: 16 },
  nextButton: { borderRadius: borderRadius.xxl, paddingVertical: 14, paddingHorizontal: 24 },
  nextText: { color: '#FFF8F5', fontFamily: typography.body, fontSize: 16, fontWeight: '600' }
});

export default CycleLengthScreen;
