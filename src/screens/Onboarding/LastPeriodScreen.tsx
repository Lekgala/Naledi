import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import PlatformDateInput from '@components/PlatformDateInput';
import { OnboardingData } from './OnboardingStack';
import { borderRadius, getShadowStyle, spacing, typography, useThemeColors } from '@utils/theme';

const LastPeriodScreen = ({ navigation, draftSettings, onUpdate }: { navigation: any; draftSettings: OnboardingData; onUpdate: (value: Partial<OnboardingData>) => void }) => {
  const colors = useThemeColors();
  const shadowStyle = getShadowStyle(colors);
  const [date, setDate] = useState<Date>(draftSettings.lastPeriodStart ? new Date(draftSettings.lastPeriodStart) : new Date());

  const handleChange = (_: any, selectedDate?: Date) => {
    const current = selectedDate || date;
    setDate(current);
    onUpdate({ lastPeriodStart: current.toISOString().slice(0, 10) });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} bounces={false}>
      <View style={[styles.heroCard, { backgroundColor: colors.surfaceWarm }]}> 
        <Text style={[styles.step, { color: colors.primary }]}>Step 1 of 3</Text>
        <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
          <View style={[styles.progressFill, styles.progressFirst, { backgroundColor: colors.primary }]} />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>When did your last period start?</Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>This helps Naledi find a good starting point for your cycle story and the predictions that follow.</Text>
      </View>

      <View style={[styles.card, shadowStyle, { backgroundColor: colors.surface }]}> 
        <View style={styles.labelRow}>
          <Text style={[styles.label, { color: colors.text }]}>Selected date</Text>
          <Text style={[styles.helper, { color: colors.muted }]}>You can edit this later</Text>
        </View>
        <View style={[styles.input, { backgroundColor: colors.surfaceSoft, borderColor: colors.border }]}> 
          <Text style={[styles.inputText, { color: colors.text }]}>{date.toDateString()}</Text>
          <PlatformDateInput value={date} onChange={handleChange} maximumDate={new Date()} />
        </View>
      </View>

      <View style={[styles.noteCard, shadowStyle, { backgroundColor: colors.surfaceWarm }]}> 
        <Text style={[styles.noteTitle, { color: colors.text }]}>Why this matters</Text>
        <Text style={[styles.noteText, { color: colors.muted }]}>Your next predicted period and ovulation window will be based on this date plus your average cycle length.</Text>
      </View>

      <View style={styles.buttons}>
        <Pressable style={[styles.backButton, { backgroundColor: colors.surfaceSoft, borderColor: colors.border }]} onPress={() => navigation.goBack()}>
          <Text style={[styles.backText, { color: colors.text }]}>Back</Text>
        </Pressable>
        <Pressable style={[styles.nextButton, { backgroundColor: colors.primary }]} onPress={() => navigation.navigate('CycleLength')}>
          <Text style={styles.nextText}>Next</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flexGrow: 1, padding: spacing.lg, justifyContent: 'space-between' },
  heroCard: {
    marginTop: spacing.lg,
    borderRadius: borderRadius.xxl,
    padding: spacing.xl,
    marginBottom: spacing.lg
  },
  step: { fontFamily: typography.body, fontSize: 13, fontWeight: '700', marginBottom: spacing.sm },
  progressTrack: { height: 8, borderRadius: 999, marginBottom: spacing.lg, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 999 },
  progressFirst: { width: '33.33%' },
  card: { borderRadius: borderRadius.xxl, padding: spacing.xl },
  title: { fontFamily: typography.display, fontSize: 36, marginBottom: spacing.sm },
  subtitle: { fontFamily: typography.body, fontSize: 16, lineHeight: 24 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  label: { fontFamily: typography.body, fontSize: 15, fontWeight: '700' },
  helper: { fontFamily: typography.body, fontSize: 13 },
  input: { borderRadius: borderRadius.xl, padding: spacing.lg, borderWidth: 1 },
  inputText: { fontFamily: typography.body, fontSize: 18, marginBottom: 8 },
  noteCard: { borderRadius: borderRadius.xxl, padding: spacing.lg, marginTop: 16 },
  noteTitle: { fontFamily: typography.body, fontSize: 15, fontWeight: '700', marginBottom: 8 },
  noteText: { fontFamily: typography.body, fontSize: 14, lineHeight: 22 },
  buttons: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, paddingBottom: 12 },
  backButton: { borderRadius: borderRadius.xxl, paddingVertical: 14, paddingHorizontal: 24, borderWidth: 1 },
  backText: { fontFamily: typography.body, fontSize: 16 },
  nextButton: { borderRadius: borderRadius.xxl, paddingVertical: 14, paddingHorizontal: 24 },
  nextText: { color: '#FFF8F5', fontFamily: typography.body, fontSize: 16, fontWeight: '600' }
});

export default LastPeriodScreen;


