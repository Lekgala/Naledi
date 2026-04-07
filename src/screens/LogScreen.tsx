import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View, Platform } from 'react-native';
import { useAppContext } from '../hooks/AppContext';
import FlowSelector from '../components/FlowSelector';
import SymptomGrid from '../components/SymptomGrid';
import { typography, spacing, borderRadius, getShadowStyle, useThemeColors } from '../utils/theme';
import { formatISO } from '../utils/dates';
import { CycleEntry, DischargeType, FlowIntensity, SymptomKey } from '../types/models';
import BrandWordmark from '../components/BrandWordmark';

const EMOJI_SAVE = '\u{1F49E}';
const EMOJI_SUN = '\u2600\uFE0F';
const EMOJI_DROP = '\u{1FA78}';
const EMOJI_SPROUT = '\u{1F331}';
const EMOJI_RAINBOW = '\u{1F308}';
const EMOJI_WATER = '\u{1F4A7}';
const EMOJI_NOTE = '\u{1F4DD}';
const EMOJI_HEART = '\u{1F497}';

const triggerHaptic = (kind: 'light' | 'success') => {
  try {
    const Haptics = require('expo-haptics');
    if (kind === 'success') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {
    // Keep interactions working when haptics isn't available.
  }
};

const LogScreen = () => {
  const colors = useThemeColors();
  const shadowStyle = getShadowStyle(colors);
  const tabBarHeight = useBottomTabBarHeight();
  const { entries, addEntry } = useAppContext();
  const today = formatISO(new Date());
  const existingEntry = useMemo(() => entries.find((entry) => entry.date === today), [entries, today]);
  const [flowIntensity, setFlowIntensity] = useState<FlowIntensity>(existingEntry?.flowIntensity ?? 'none');
  const [symptoms, setSymptoms] = useState<SymptomKey[]>(existingEntry?.symptoms ?? []);
  const [mood, setMood] = useState<SymptomKey[]>(existingEntry?.mood ?? []);
  const [discharge, setDischarge] = useState<DischargeType>(existingEntry?.discharge ?? 'none');
  const [notes, setNotes] = useState(existingEntry?.notes ?? '');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleSubmit = async () => {
    try {
      triggerHaptic('success');
      const entry: CycleEntry = {
        id: existingEntry?.id ?? `${today}-${Date.now()}`,
        date: today,
        isPeriod: flowIntensity !== 'none',
        flowIntensity,
        symptoms,
        mood,
        discharge,
        notes,
        createdAt: new Date().toISOString()
      };
      await addEntry(entry);
      setFeedbackMessage(`Today's check-in has been saved ${EMOJI_SAVE}`);
      if (Platform.OS !== 'web') {
        Alert.alert('Saved', `Your check-in has been updated ${EMOJI_SAVE}`);
      }
    } catch {
      setFeedbackMessage('Something went wrong while saving. Please try again.');
      if (Platform.OS !== 'web') {
        Alert.alert('Unable to save', 'Something went wrong while saving. Please try again.');
      }
    }
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
            <BrandWordmark subtitle="A gentle daily check-in" />
          </View>
          <Text style={[styles.kicker, { color: colors.primary }]}>{`Daily check-in ${EMOJI_SUN}`}</Text>
          <Text style={[styles.title, { color: colors.text }]}>How are you feeling today?</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>A beautifully simple check-in designed to take less than a minute and still capture what matters most.</Text>
        </View>
        {!!feedbackMessage && (
          <View style={[styles.feedbackCard, { backgroundColor: colors.surfaceSoft, borderColor: colors.border }]}> 
            <Text style={[styles.feedbackText, { color: colors.text }]}>{feedbackMessage}</Text>
          </View>
        )}

        <View style={[styles.card, shadowStyle, { backgroundColor: colors.surface }]}> 
          <Text style={[styles.sectionLabel, { color: colors.text }]}>{`Flow ${EMOJI_DROP}`}</Text>
          <FlowSelector value={flowIntensity} onChange={setFlowIntensity} />
        </View>

        <View style={[styles.card, shadowStyle, { backgroundColor: colors.surface }]}> 
          <Text style={[styles.sectionLabel, { color: colors.text }]}>{`Symptoms ${EMOJI_SPROUT}`}</Text>
          <SymptomGrid selected={symptoms} onToggle={(key) => {
            triggerHaptic('light');
            setSymptoms((prev) => prev.includes(key as SymptomKey) ? prev.filter((item) => item !== (key as SymptomKey)) : [...prev, key as SymptomKey]);
          }} />
        </View>

        <View style={[styles.card, shadowStyle, { backgroundColor: colors.surface }]}> 
          <Text style={[styles.sectionLabel, { color: colors.text }]}>{`Mood ${EMOJI_RAINBOW}`}</Text>
          <SymptomGrid selected={mood} onToggle={(key) => {
            triggerHaptic('light');
            setMood((prev) => prev.includes(key as SymptomKey) ? prev.filter((item) => item !== (key as SymptomKey)) : [...prev, key as SymptomKey]);
          }} moodMode />
        </View>

        <View style={[styles.card, shadowStyle, { backgroundColor: colors.surface }]}> 
          <Text style={[styles.sectionLabel, { color: colors.text }]}>{`Discharge ${EMOJI_WATER}`}</Text>
          <SymptomGrid selected={[discharge]} onToggle={(key) => {
            triggerHaptic('light');
            setDischarge(key as DischargeType);
          }} dischargeMode />
        </View>

        <View style={[styles.card, shadowStyle, { backgroundColor: colors.surface }]}> 
          <Text style={[styles.sectionLabel, { color: colors.text }]}>{`Notes ${EMOJI_NOTE}`}</Text>
          <TextInput
            style={[styles.textArea, { backgroundColor: colors.surfaceSoft, borderColor: colors.border, color: colors.text }]}
            placeholder="Anything you want to remember about today?"
            placeholderTextColor={colors.muted}
            multiline
            value={notes}
            onChangeText={setNotes}
            accessibilityLabel="Notes input"
          />
        </View>

        <Pressable style={[styles.saveButton, shadowStyle, { backgroundColor: colors.primary }]} onPress={handleSubmit}>
          <Text style={styles.saveText}>{`Save today's check-in ${EMOJI_HEART}`}</Text>
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
    overflow: 'hidden'
  },
  heroGlowLarge: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    top: -70,
    right: -60,
    opacity: 0.75
  },
  heroGlowSmall: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 48,
    right: 42,
    bottom: -20,
    opacity: 0.8
  },
  brandWrap: {
    marginBottom: spacing.md
  },
  kicker: {
    fontFamily: typography.body,
    fontSize: 13,
    marginBottom: spacing.sm,
    textAlign: 'center',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8
  },
  title: {
    fontFamily: typography.display,
    fontSize: 38,
    marginBottom: spacing.sm,
    textAlign: 'center'
  },
  subtitle: {
    fontFamily: typography.body,
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
    marginBottom: spacing.lg
  },
  feedbackCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1
  },
  feedbackText: {
    fontFamily: typography.body,
    fontSize: 14,
    textAlign: 'center'
  },
  card: {
    borderRadius: borderRadius.xxl,
    padding: spacing.lg,
    marginBottom: spacing.md
  },
  sectionLabel: {
    fontFamily: typography.body,
    fontSize: 16,
    marginBottom: spacing.md,
    fontWeight: '600'
  },
  textArea: {
    borderRadius: borderRadius.lg,
    minHeight: 120,
    padding: spacing.lg,
    textAlignVertical: 'top',
    fontFamily: typography.body,
    borderWidth: 1
  },
  saveButton: {
    marginTop: spacing.xl,
    borderRadius: borderRadius.xxl,
    paddingVertical: spacing.lg,
    alignItems: 'center'
  },
  saveText: {
    color: '#FFF8F5',
    fontFamily: typography.body,
    fontSize: 18,
    fontWeight: '600'
  }
});

export default LogScreen;
