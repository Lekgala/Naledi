import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import PlatformSlider from '@components/PlatformSlider';
import { OnboardingData } from './OnboardingStack';
import { useAppContext } from '../../hooks/AppContext';
import { borderRadius, getShadowStyle, spacing, typography, useThemeColors } from '@utils/theme';

const PeriodLengthScreen = ({ navigation, draftSettings, onUpdate }: { navigation: any; draftSettings: OnboardingData; onUpdate: (value: Partial<OnboardingData>) => void }) => {
  const colors = useThemeColors();
  const shadowStyle = getShadowStyle(colors);
  const { completeOnboarding } = useAppContext();
  const periodLength = draftSettings.avgPeriodLength ?? 5;

  const handleComplete = async () => {
    await completeOnboarding({
      name: draftSettings.name || '',
      avgCycleLength: draftSettings.avgCycleLength ?? 28,
      avgPeriodLength: draftSettings.avgPeriodLength ?? 5,
      notificationsEnabled: draftSettings.notificationsEnabled ?? true,
      reminderTime: draftSettings.reminderTime ?? '20:00',
      theme: draftSettings.theme ?? 'light',
      onboardingComplete: true,
      lastPeriodStart: draftSettings.lastPeriodStart
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} bounces={false}>
      <View style={[styles.heroCard, { backgroundColor: colors.surfaceWarm }]}> 
        <Text style={[styles.step, { color: colors.primary }]}>Step 3 of 3</Text>
        <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
          <View style={[styles.progressFill, styles.progressThird, { backgroundColor: colors.primary }]} />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>How long does your period usually last?</Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>A rough average is more than enough. Naledi uses it to make your predictions feel a little closer to your real rhythm.</Text>
      </View>

      <View style={[styles.card, shadowStyle, { backgroundColor: colors.surface }]}> 
        <View style={styles.valueWrap}>
          <Text style={[styles.value, { color: colors.primary }]}>{periodLength}</Text>
          <Text style={[styles.valueLabel, { color: colors.muted }]}>days</Text>
        </View>
        <PlatformSlider
          minimumValue={2}
          maximumValue={8}
          step={1}
          value={periodLength}
          onValueChange={(value) => onUpdate({ avgPeriodLength: value })}
          minimumTrackTintColor={colors.secondary}
          maximumTrackTintColor={colors.border}
          thumbTintColor={colors.primary}
        />
        <Text style={[styles.hint, { color: colors.muted }]}>Everything is private and stored locally on your device.</Text>
      </View>

      <View style={[styles.readyCard, shadowStyle, { backgroundColor: colors.surfaceWarm }]}> 
        <Text style={[styles.readyTitle, { color: colors.text }]}>You're ready</Text>
        <Text style={[styles.readyText, { color: colors.muted }]}>Once you finish, Naledi will light up your first cycle forecast and you can start keeping gentle daily notes whenever you like.</Text>
      </View>

      <View style={styles.buttons}>
        <Pressable style={[styles.backButton, { backgroundColor: colors.surfaceSoft, borderColor: colors.border }]} onPress={() => navigation.goBack()}>
          <Text style={[styles.backText, { color: colors.text }]}>Back</Text>
        </Pressable>
        <Pressable style={[styles.nextButton, { backgroundColor: colors.primary }]} onPress={handleComplete}>
          <Text style={styles.nextText}>Finish</Text>
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
  progressThird: { width: '100%' },
  card: { borderRadius: borderRadius.xxl, padding: spacing.xl },
  title: { fontFamily: typography.display, fontSize: 36, marginBottom: spacing.sm },
  subtitle: { fontFamily: typography.body, fontSize: 16, lineHeight: 24 },
  valueWrap: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 24 },
  value: { fontFamily: typography.display, fontSize: 54, lineHeight: 58 },
  valueLabel: { fontFamily: typography.body, fontSize: 18, marginLeft: 8, marginBottom: 8 },
  hint: { fontFamily: typography.body, marginTop: 16, lineHeight: 22 },
  readyCard: { borderRadius: borderRadius.xxl, padding: spacing.lg, marginTop: 16 },
  readyTitle: { fontFamily: typography.body, fontSize: 15, fontWeight: '700', marginBottom: 8 },
  readyText: { fontFamily: typography.body, fontSize: 14, lineHeight: 22 },
  buttons: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, paddingBottom: 12 },
  backButton: { borderRadius: borderRadius.xxl, paddingVertical: 14, paddingHorizontal: 24, borderWidth: 1 },
  backText: { fontFamily: typography.body, fontSize: 16 },
  nextButton: { borderRadius: borderRadius.xxl, paddingVertical: 14, paddingHorizontal: 24 },
  nextText: { color: '#FFF8F5', fontFamily: typography.body, fontSize: 16, fontWeight: '600' }
});

export default PeriodLengthScreen;



