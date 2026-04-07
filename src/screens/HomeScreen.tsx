import { useNavigation } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import CycleCalendar from '../components/CycleCalendar';
import CycleSummaryCard from '../components/CycleSummaryCard';
import PhaseBanner from '../components/PhaseBanner';
import BrandWordmark from '../components/BrandWordmark';
import { useAppContext } from '../hooks/AppContext';
import { typography, spacing, borderRadius, getShadowStyle, useThemeColors } from '../utils/theme';
import { getDailyGuidance, getPeriodPrepChecklist, getTodaysReminders, isDateInRange } from '../utils/prediction';
import { CycleEntry, SymptomKey } from '../types/models';
import { formatISO } from '../utils/dates';

const EMOJI_SPARKLES = '\u2728';
const EMOJI_BLOSSOM = '\u{1F338}';
const EMOJI_HEART = '\u{1F497}';
const EMOJI_DIZZY = '\u{1F4AB}';
const EMOJI_BELL = '\u{1F514}';
const EMOJI_POUCH = '\u{1F45D}';
const EMOJI_SUN = '\u2600\uFE0F';
const EMOJI_DROPLET = '\u{1F4A7}';
const EMOJI_MOON = '\u{1F319}';
const EMOJI_SEEDLING = '\u{1F331}';
const EMOJI_WAVE = '\u{1F30A}';

const quickMoodChips: { key: SymptomKey; label: string }[] = [
  { key: 'happy', label: `Happy ${EMOJI_SUN}` },
  { key: 'energetic', label: `Energetic ${EMOJI_SPARKLES}` },
  { key: 'sad', label: `Low-key ${EMOJI_MOON}` },
  { key: 'anxious', label: `Anxious ${EMOJI_WAVE}` }
];

const quickSymptomChips: { key: SymptomKey; label: string }[] = [
  { key: 'cramps', label: `Cramps ${EMOJI_HEART}` },
  { key: 'bloating', label: `Bloating ${EMOJI_DROPLET}` },
  { key: 'fatigue', label: `Tired ${EMOJI_MOON}` },
  { key: 'cravings', label: `Cravings ${EMOJI_BLOSSOM}` }
];

const triggerHaptic = (strength: 'light' | 'medium') => {
  try {
    const Haptics = require('expo-haptics');
    const impact = strength === 'medium' ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light;
    Haptics.impactAsync(impact);
  } catch {
    // Keep interactions working when haptics isn't available.
  }
};

const HomeScreen = () => {
  const colors = useThemeColors();
  const shadowStyle = getShadowStyle(colors);
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation<any>();
  const { prediction, entries, settings, addEntry } = useAppContext();
  const firstName = settings.name?.trim().split(/\s+/)[0];
  const greeting = firstName ? `Welcome home, ${firstName} ${EMOJI_SPARKLES}` : `Welcome home ${EMOJI_SPARKLES}`;
  const guidance = getDailyGuidance(entries, prediction);
  const reminders = getTodaysReminders(settings, entries, prediction);
  const prepChecklist = getPeriodPrepChecklist(prediction);
  const today = formatISO(new Date());
  const todayEntry = useMemo(() => entries.find((entry) => entry.date === today), [entries, today]);
  const [quickFeedback, setQuickFeedback] = useState('');

  const cycleStrip = useMemo(
    () =>
      Array.from({ length: 8 }, (_, index) => {
        const date = new Date();
        date.setDate(date.getDate() + index);
        const iso = formatISO(date);
        const label = date.toLocaleString('en-US', { weekday: 'short' }).slice(0, 2);
        const status = iso === prediction.nextPeriodStart
          ? 'period'
          : iso === prediction.ovulationDate
            ? 'ovulation'
            : isDateInRange(iso, prediction.fertileWindowStart, prediction.fertileWindowEnd)
              ? 'fertile'
              : 'default';

        return {
          iso,
          day: date.getDate(),
          label,
          isToday: iso === today,
          status
        };
      }),
    [prediction.fertileWindowEnd, prediction.fertileWindowStart, prediction.nextPeriodStart, prediction.ovulationDate, today]
  );

  const todayMessage =
    prediction.phase === 'menstrual'
      ? 'A softer rhythm is enough today.'
      : prediction.phase === 'follicular'
        ? 'Energy may be returning in lovely little waves.'
        : prediction.phase === 'ovulation'
          ? 'You might feel a little brighter today.'
          : 'Gentle structure can carry you well today.';

  const handleDayPress = (date: string) => {
    triggerHaptic('light');
    navigation.navigate('DayDetailModal', { date });
  };

  const handleQuickLog = () => {
    triggerHaptic('medium');
    navigation.navigate('DayDetailModal', { date: today });
  };

  const saveQuickChip = async (type: 'mood' | 'symptom', key: SymptomKey) => {
    triggerHaptic('light');

    const nextMood = type === 'mood'
      ? todayEntry?.mood.includes(key)
        ? todayEntry.mood.filter((item) => item !== key)
        : [...(todayEntry?.mood ?? []), key]
      : todayEntry?.mood ?? [];

    const nextSymptoms = type === 'symptom'
      ? todayEntry?.symptoms.includes(key)
        ? todayEntry.symptoms.filter((item) => item !== key)
        : [...(todayEntry?.symptoms ?? []), key]
      : todayEntry?.symptoms ?? [];

    const entry: CycleEntry = {
      id: todayEntry?.id ?? `${today}-${Date.now()}`,
      date: today,
      isPeriod: (todayEntry?.flowIntensity ?? 'none') !== 'none',
      flowIntensity: todayEntry?.flowIntensity ?? 'none',
      symptoms: nextSymptoms,
      mood: nextMood,
      discharge: todayEntry?.discharge ?? 'none',
      notes: todayEntry?.notes ?? '',
      createdAt: todayEntry?.createdAt ?? new Date().toISOString()
    };

    await addEntry(entry);
    setQuickFeedback(`${type === 'mood' ? 'Mood' : 'Symptom'} updated for today ${EMOJI_SPARKLES}`);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingBottom: tabBarHeight + spacing.xl + 28 }]}
    >
      <View>
        <View style={[styles.heroCard, { backgroundColor: colors.surfaceWarm }]}>
          <View style={[styles.heroGlowLarge, { backgroundColor: colors.gradientEnd }]} />
          <View style={[styles.heroGlowSmall, { backgroundColor: colors.surface }]} />
          <View style={styles.brandWrap}>
            <BrandWordmark subtitle="A little light for your rhythm" />
          </View>
          <View style={[styles.heroBadge, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.heroBadgeText, { color: colors.primary }]}>{greeting}</Text>
          </View>
          <Text style={[styles.title, { color: colors.text }]}>{`A softer rhythm, lit by Naledi ${EMOJI_BLOSSOM}`}</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>A warm, easy space to see where you are in your cycle, what may be coming next, and what kind of care might help today feel lighter.</Text>
        </View>

        <View style={[styles.todayCard, shadowStyle, { backgroundColor: colors.primary }]}>
          <Text style={[styles.todayKicker, { color: colors.surface }]}>{`Today ${EMOJI_SPARKLES}`}</Text>
          <View style={styles.todayContent}>
            <View style={[styles.todayCircle, { backgroundColor: colors.surface }]}>
              <Text style={[styles.todayCircleLabel, { color: colors.muted }]}>Cycle day</Text>
              <Text style={[styles.todayCircleValue, { color: colors.primary }]}>{prediction.cycleDay}</Text>
            </View>
            <View style={styles.todayCopy}>
              <Text style={[styles.todayPhase, { color: colors.surface }]}>{prediction.phase.charAt(0).toUpperCase() + prediction.phase.slice(1)} phase</Text>
              <Text style={[styles.todayBody, { color: colors.surface }]}>{todayMessage}</Text>
              <Text style={[styles.todayMeta, { color: colors.surface }]}>{prediction.daysUntilNextPeriod === 0 ? 'Your period may arrive today.' : `${prediction.daysUntilNextPeriod} day${prediction.daysUntilNextPeriod === 1 ? '' : 's'} until your next period.`}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.stripCard, shadowStyle, { backgroundColor: colors.surface }]}>
          <Text style={[styles.guidanceKicker, { color: colors.primary }]}>{`Coming up ${EMOJI_SEEDLING}`}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stripRow}>
            {cycleStrip.map((item) => {
              const bubbleStyle =
                item.status === 'period'
                  ? { backgroundColor: colors.primary }
                  : item.status === 'ovulation'
                    ? { backgroundColor: colors.accent }
                    : item.status === 'fertile'
                      ? { backgroundColor: colors.secondary }
                      : { backgroundColor: item.isToday ? colors.surfaceWarm : colors.surfaceSoft };
              const textColor = item.status === 'period' || item.status === 'ovulation' ? colors.surface : colors.text;

              return (
                <Pressable key={item.iso} style={styles.stripItem} onPress={() => handleDayPress(item.iso)}>
                  <Text style={[styles.stripLabel, { color: item.isToday ? colors.primary : colors.muted }]}>{item.label}</Text>
                  <View style={[styles.stripBubble, bubbleStyle]}>
                    <Text style={[styles.stripDay, { color: textColor }]}>{item.day}</Text>
                  </View>
                  <Text style={[styles.stripMeta, { color: colors.muted }]}>
                    {item.status === 'period' ? 'Period' : item.status === 'ovulation' ? 'Ovu' : item.status === 'fertile' ? 'Fertile' : item.isToday ? 'Today' : ''}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View style={[styles.guidanceCard, shadowStyle, { backgroundColor: colors.surface }]}>
          <Text style={[styles.guidanceKicker, { color: colors.primary }]}>{`A little light from Naledi ${EMOJI_DIZZY}`}</Text>
          <Text style={[styles.guidanceTitle, { color: colors.text }]}>{guidance.title}</Text>
          <Text style={[styles.guidanceBody, { color: colors.muted }]}>{guidance.message}</Text>
          <View style={[styles.guidanceChip, { backgroundColor: colors.surfaceSoft, borderColor: colors.border }]}>
            <Text style={[styles.guidanceChipText, { color: colors.text }]}>{guidance.focus}</Text>
          </View>
        </View>

        <View style={[styles.quickCheckCard, shadowStyle, { backgroundColor: colors.surface }]}>
          <Text style={[styles.guidanceKicker, { color: colors.primary }]}>{`Quick check-in ${EMOJI_HEART}`}</Text>
          <Text style={[styles.quickTitle, { color: colors.text }]}>Log how today feels in one or two taps.</Text>
          <Text style={[styles.quickLabel, { color: colors.muted }]}>Mood</Text>
          <View style={styles.quickChipRow}>
            {quickMoodChips.map((chip) => {
              const selected = todayEntry?.mood.includes(chip.key) ?? false;
              return (
                <Pressable
                  key={chip.key}
                  style={[
                    styles.quickChip,
                    {
                      backgroundColor: selected ? colors.primary : colors.surfaceSoft,
                      borderColor: selected ? colors.primary : colors.border
                    }
                  ]}
                  onPress={() => saveQuickChip('mood', chip.key)}
                >
                  <Text style={[styles.quickChipText, { color: selected ? colors.surface : colors.text }]}>{chip.label}</Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={[styles.quickLabel, { color: colors.muted }]}>Symptoms</Text>
          <View style={styles.quickChipRow}>
            {quickSymptomChips.map((chip) => {
              const selected = todayEntry?.symptoms.includes(chip.key) ?? false;
              return (
                <Pressable
                  key={chip.key}
                  style={[
                    styles.quickChip,
                    {
                      backgroundColor: selected ? colors.accent : colors.surfaceSoft,
                      borderColor: selected ? colors.accent : colors.border
                    }
                  ]}
                  onPress={() => saveQuickChip('symptom', chip.key)}
                >
                  <Text style={[styles.quickChipText, { color: selected ? colors.surface : colors.text }]}>{chip.label}</Text>
                </Pressable>
              );
            })}
          </View>
          {!!quickFeedback && <Text style={[styles.quickFeedback, { color: colors.primary }]}>{quickFeedback}</Text>}
        </View>

        <View style={[styles.reminderCard, shadowStyle, { backgroundColor: colors.surface }]}>
          <Text style={[styles.guidanceKicker, { color: colors.primary }]}>{`Today's reminders ${EMOJI_BELL}`}</Text>
          {reminders.map((reminder) => (
            <View key={reminder.title} style={[styles.reminderItem, { borderColor: colors.border }]}>
              <Text style={[styles.reminderTitle, { color: colors.text }]}>{reminder.title}</Text>
              <Text style={[styles.reminderBody, { color: colors.muted }]}>{reminder.detail}</Text>
            </View>
          ))}
        </View>

        {prepChecklist ? (
          <View style={[styles.reminderCard, shadowStyle, { backgroundColor: colors.surface }]}>
            <Text style={[styles.guidanceKicker, { color: colors.primary }]}>{`Period prep ${EMOJI_POUCH}`}</Text>
            <Text style={[styles.reminderTitle, { color: colors.text }]}>{prepChecklist.title}</Text>
            <Text style={[styles.reminderBody, { color: colors.muted }]}>{prepChecklist.intro}</Text>
            {prepChecklist.items.map((item) => (
              <View key={item} style={styles.checklistRow}>
                <Text style={[styles.checkBullet, { color: colors.primary }]}>•</Text>
                <Text style={[styles.checkText, { color: colors.text }]}>{item}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <PhaseBanner phase={prediction.phase} />
        <CycleSummaryCard prediction={prediction} />
        <CycleCalendar entries={entries} prediction={prediction} onDayPress={handleDayPress} />
        <Pressable style={[styles.quickButton, shadowStyle, { backgroundColor: colors.primary }]} onPress={handleQuickLog}>
          <Text style={styles.quickText}>{`Open full check-in ${EMOJI_HEART}`}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    padding: spacing.lg
  },
  heroCard: {
    borderRadius: borderRadius.xxl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    minHeight: 208,
    justifyContent: 'flex-end'
  },
  heroGlowLarge: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    right: -80,
    top: -70,
    opacity: 0.9
  },
  heroGlowSmall: {
    position: 'absolute',
    width: 108,
    height: 108,
    borderRadius: 54,
    right: 40,
    bottom: -26,
    opacity: 0.75
  },
  heroBadge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md
  },
  brandWrap: {
    marginBottom: spacing.md
  },
  heroBadgeText: {
    fontFamily: typography.body,
    fontSize: 12,
    fontWeight: '700'
  },
  title: {
    fontFamily: typography.display,
    fontSize: 36,
    marginBottom: spacing.sm,
    maxWidth: '72%'
  },
  subtitle: {
    fontFamily: typography.body,
    fontSize: 15,
    lineHeight: 23,
    marginBottom: spacing.sm,
    maxWidth: '74%'
  },
  todayCard: {
    borderRadius: borderRadius.xxl,
    padding: spacing.xl,
    marginBottom: spacing.lg
  },
  todayKicker: {
    fontFamily: typography.body,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.8
  },
  todayContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg
  },
  todayCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md
  },
  todayCircleLabel: {
    fontFamily: typography.body,
    fontSize: 13,
    marginBottom: spacing.xs
  },
  todayCircleValue: {
    fontFamily: typography.display,
    fontSize: 44
  },
  todayCopy: {
    flex: 1
  },
  todayPhase: {
    fontFamily: typography.display,
    fontSize: 28,
    marginBottom: spacing.sm
  },
  todayBody: {
    fontFamily: typography.body,
    fontSize: 15,
    lineHeight: 23,
    marginBottom: spacing.sm
  },
  todayMeta: {
    fontFamily: typography.body,
    fontSize: 13,
    lineHeight: 20,
    opacity: 0.92
  },
  stripCard: {
    borderRadius: borderRadius.xxl,
    padding: spacing.lg,
    marginBottom: spacing.lg
  },
  stripRow: {
    paddingRight: spacing.sm
  },
  stripItem: {
    alignItems: 'center',
    marginRight: spacing.md
  },
  stripLabel: {
    fontFamily: typography.body,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: spacing.sm
  },
  stripBubble: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs
  },
  stripDay: {
    fontFamily: typography.body,
    fontSize: 16,
    fontWeight: '700'
  },
  stripMeta: {
    fontFamily: typography.body,
    fontSize: 11
  },
  guidanceCard: {
    borderRadius: borderRadius.xxl,
    padding: spacing.lg,
    marginBottom: spacing.lg
  },
  guidanceKicker: {
    fontFamily: typography.body,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.8
  },
  guidanceTitle: {
    fontFamily: typography.display,
    fontSize: 28,
    marginBottom: spacing.sm
  },
  guidanceBody: {
    fontFamily: typography.body,
    fontSize: 15,
    lineHeight: 23,
    marginBottom: spacing.md
  },
  guidanceChip: {
    alignSelf: 'flex-start',
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1
  },
  guidanceChipText: {
    fontFamily: typography.body,
    fontSize: 13,
    fontWeight: '600'
  },
  quickCheckCard: {
    borderRadius: borderRadius.xxl,
    padding: spacing.lg,
    marginBottom: spacing.lg
  },
  quickTitle: {
    fontFamily: typography.display,
    fontSize: 26,
    marginBottom: spacing.md
  },
  quickLabel: {
    fontFamily: typography.body,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.8
  },
  quickChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md
  },
  quickChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  quickChipText: {
    fontFamily: typography.body,
    fontSize: 13,
    fontWeight: '600'
  },
  quickFeedback: {
    fontFamily: typography.body,
    fontSize: 13,
    fontWeight: '700',
    marginTop: spacing.xs
  },
  reminderCard: {
    borderRadius: borderRadius.xxl,
    padding: spacing.lg,
    marginBottom: spacing.lg
  },
  reminderItem: {
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    borderTopWidth: 1
  },
  reminderTitle: {
    fontFamily: typography.body,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.xs
  },
  reminderBody: {
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 21
  },
  checklistRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: spacing.sm
  },
  checkBullet: {
    fontSize: 16,
    lineHeight: 22,
    marginRight: spacing.sm
  },
  checkText: {
    flex: 1,
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 22
  },
  quickButton: {
    marginTop: spacing.xl,
    borderRadius: borderRadius.xxl,
    paddingVertical: spacing.lg,
    alignItems: 'center'
  },
  quickText: {
    color: '#FFF8F5',
    fontFamily: typography.body,
    fontSize: 18,
    fontWeight: '600'
  }
});

export default HomeScreen;






