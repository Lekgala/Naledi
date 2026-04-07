import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { useAppContext } from '../hooks/AppContext';
import { borderRadius, darkPalette, getShadowStyle, lightPalette, spacing, typography } from '../utils/theme';
import BrandWordmark from '../components/BrandWordmark';

const EMOJI_SPARKLES = '\u2728';
const EMOJI_HANDS = '\u{1FAF6}';
const EMOJI_BUST = '\u{1F464}';
const EMOJI_MOON = '\u{1F319}';
const EMOJI_BELL = '\u{1F514}';
const EMOJI_PALETTE = '\u{1F3A8}';
const EMOJI_BROOM = '\u{1F9F9}';
const EMOJI_SCROLL = '\u{1F4DC}';

const triggerHaptic = (kind: 'light' | 'success' | 'heavy') => {
  try {
    const Haptics = require('expo-haptics');
    if (kind === 'success') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      return;
    }

    const impact = kind === 'heavy' ? Haptics.ImpactFeedbackStyle.Heavy : Haptics.ImpactFeedbackStyle.Light;
    Haptics.impactAsync(impact);
  } catch {
    // Keep interactions working when haptics isn't available.
  }
};

const SettingsScreen = () => {
  const navigation = useNavigation<any>();
  const { settings, saveSettings, clearAllData } = useAppContext();
  const tabBarHeight = useBottomTabBarHeight();
  const [name, setName] = useState(settings.name);
  const [dob, setDob] = useState(settings.dateOfBirth ?? '');
  const [avgCycleLength, setAvgCycleLength] = useState(settings.avgCycleLength.toString());
  const [avgPeriodLength, setAvgPeriodLength] = useState(settings.avgPeriodLength.toString());
  const [notificationsEnabled, setNotificationsEnabled] = useState(settings.notificationsEnabled);
  const [theme, setTheme] = useState(settings.theme);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [confirmingClear, setConfirmingClear] = useState(false);

  const colors = theme === 'dark' ? darkPalette : lightPalette;
  const shadowStyle = getShadowStyle(colors);

  const handleSave = async () => {
    triggerHaptic('success');
    const updated = {
      ...settings,
      name,
      dateOfBirth: dob || undefined,
      avgCycleLength: Number(avgCycleLength) || 28,
      avgPeriodLength: Number(avgPeriodLength) || 5,
      notificationsEnabled,
      theme: theme as 'light' | 'dark'
    };
    await saveSettings(updated);
    setConfirmingClear(false);
    setFeedbackMessage(`Your settings have been updated ${EMOJI_SPARKLES}`);
    if (Platform.OS !== 'web') {
      Alert.alert('Saved', `Your settings have been updated ${EMOJI_SPARKLES}`);
    }
  };

  const confirmClear = () => {
    triggerHaptic('heavy');

    if (Platform.OS === 'web') {
      setFeedbackMessage('');
      setConfirmingClear(true);
      return;
    }

    Alert.alert('Clear all data', 'This will remove all entries and reset your profile.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          await clearAllData();
          setConfirmingClear(false);
          setFeedbackMessage('All data has been cleared.');
          Alert.alert('Reset', 'All data has been cleared.');
        }
      }
    ]);
  };

  const handleClearConfirmed = async () => {
    triggerHaptic('heavy');
    await clearAllData();
    setConfirmingClear(false);
    setFeedbackMessage('All data has been cleared.');
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
            <BrandWordmark subtitle="Your details, softly held" />
          </View>
          <Text style={[styles.kicker, { color: colors.primary }]}>{`Your space ${EMOJI_HANDS}`}</Text>
          <Text style={[styles.title, { color: colors.text }]}>Make Naledi feel like home</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>Shape the little details here so Naledi feels warm, familiar, and easy to return to.</Text>
        </View>
        {!!feedbackMessage && (
          <View style={[styles.feedbackCard, { backgroundColor: colors.surfaceSoft, borderColor: colors.border }]}> 
            <Text style={[styles.feedbackText, { color: colors.text }]}>{feedbackMessage}</Text>
          </View>
        )}
        <View style={[styles.card, shadowStyle, { backgroundColor: colors.surface }]}> 
          <Text style={[styles.cardTitle, { color: colors.text }]}>{`Profile ${EMOJI_BUST}`}</Text>
          <TextInput style={[styles.input, { backgroundColor: colors.surfaceSoft, borderColor: colors.border, color: colors.text }]} placeholder="Name" value={name} onChangeText={setName} placeholderTextColor={colors.muted} accessibilityLabel="Name input" />
          <TextInput style={[styles.input, { backgroundColor: colors.surfaceSoft, borderColor: colors.border, color: colors.text }]} placeholder="Date of birth (YYYY-MM-DD)" value={dob} onChangeText={setDob} placeholderTextColor={colors.muted} accessibilityLabel="Date of birth input" />
        </View>
        <View style={[styles.card, shadowStyle, { backgroundColor: colors.surface }]}> 
          <Text style={[styles.cardTitle, { color: colors.text }]}>{`Cycle preferences ${EMOJI_MOON}`}</Text>
          <TextInput style={[styles.input, { backgroundColor: colors.surfaceSoft, borderColor: colors.border, color: colors.text }]} placeholder="Average cycle length" keyboardType="number-pad" value={avgCycleLength} onChangeText={setAvgCycleLength} placeholderTextColor={colors.muted} accessibilityLabel="Cycle length input" />
          <TextInput style={[styles.input, { backgroundColor: colors.surfaceSoft, borderColor: colors.border, color: colors.text }]} placeholder="Average period length" keyboardType="number-pad" value={avgPeriodLength} onChangeText={setAvgPeriodLength} placeholderTextColor={colors.muted} accessibilityLabel="Period length input" />
        </View>
        <View style={[styles.card, shadowStyle, { backgroundColor: colors.surface }]}> 
          <Text style={[styles.cardTitle, { color: colors.text }]}>{`Notifications ${EMOJI_BELL}`}</Text>
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.text }]}>Daily reminder</Text>
            <Switch value={notificationsEnabled} onValueChange={(value) => {
              triggerHaptic('light');
              setNotificationsEnabled(value);
            }} thumbColor={notificationsEnabled ? colors.primary : colors.muted} trackColor={{ false: colors.border, true: colors.secondary }} />
          </View>
          <Text style={[styles.subtle, { color: colors.muted }]}>Set your reminder time in the onboarding screen.</Text>
        </View>
        <View style={[styles.card, shadowStyle, { backgroundColor: colors.surface }]}> 
          <Text style={[styles.cardTitle, { color: colors.text }]}>{`Appearance ${EMOJI_PALETTE}`}</Text>
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.text }]}>Dark mode</Text>
            <Switch value={theme === 'dark'} onValueChange={(value) => {
              triggerHaptic('light');
              setTheme(value ? 'dark' : 'light');
            }} thumbColor={theme === 'dark' ? colors.accent : colors.primary} trackColor={{ false: colors.border, true: colors.secondary }} />
          </View>
        </View>
        <View style={[styles.card, shadowStyle, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>{`Legal ${EMOJI_SCROLL}`}</Text>
          <Pressable
            style={[styles.linkRow, { borderColor: colors.border, backgroundColor: colors.surfaceSoft }]}
            onPress={() => navigation.navigate('LegalDocument', { document: 'privacy' })}
          >
            <Text style={[styles.linkTitle, { color: colors.text }]}>Privacy Policy</Text>
            <Text style={[styles.linkMeta, { color: colors.primary }]}>Open</Text>
          </Pressable>
          <Pressable
            style={[styles.linkRow, { borderColor: colors.border, backgroundColor: colors.surfaceSoft }]}
            onPress={() => navigation.navigate('LegalDocument', { document: 'terms' })}
          >
            <Text style={[styles.linkTitle, { color: colors.text }]}>Terms of Use</Text>
            <Text style={[styles.linkMeta, { color: colors.primary }]}>Open</Text>
          </Pressable>
          <Text style={[styles.subtle, { color: colors.muted }]}>Review these before publishing, then replace placeholder legal contact details with your real support information.</Text>
        </View>
        <Pressable style={[styles.saveButton, shadowStyle, { backgroundColor: colors.primary }]} onPress={handleSave}>
          <Text style={styles.saveText}>{`Save settings ${EMOJI_SPARKLES}`}</Text>
        </Pressable>
        {confirmingClear ? (
          <View style={styles.confirmRow}>
            <Pressable style={[styles.cancelButton, { backgroundColor: colors.surfaceSoft, borderColor: colors.border }]} onPress={() => setConfirmingClear(false)}>
              <Text style={[styles.cancelText, { color: colors.text }]}>Cancel</Text>
            </Pressable>
            <Pressable style={[styles.clearButton, shadowStyle, styles.confirmButton, { backgroundColor: colors.error }]} onPress={handleClearConfirmed}>
              <Text style={styles.clearText}>{`Confirm clear ${EMOJI_BROOM}`}</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable style={[styles.clearButton, shadowStyle, { backgroundColor: colors.error }]} onPress={confirmClear}>
            <Text style={styles.clearText}>{`Clear all data ${EMOJI_BROOM}`}</Text>
          </Pressable>
        )}
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
    marginBottom: spacing.lg
  },
  cardTitle: {
    fontFamily: typography.body,
    fontSize: 18,
    marginBottom: spacing.md,
    fontWeight: '600'
  },
  input: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    fontFamily: typography.body,
    borderWidth: 1
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  label: {
    fontFamily: typography.body,
    fontSize: 16
  },
  subtle: {
    fontFamily: typography.body,
    marginTop: spacing.sm,
    fontSize: 14
  },
  linkRow: {
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  linkTitle: {
    fontFamily: typography.body,
    fontSize: 15,
    fontWeight: '600'
  },
  linkMeta: {
    fontFamily: typography.body,
    fontSize: 13,
    fontWeight: '700'
  },
  saveButton: {
    borderRadius: borderRadius.xxl,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md
  },
  saveText: {
    color: '#FFF8F5',
    fontFamily: typography.body,
    fontSize: 16,
    fontWeight: '600'
  },
  clearButton: {
    borderRadius: borderRadius.xxl,
    paddingVertical: spacing.lg,
    alignItems: 'center'
  },
  confirmRow: {
    flexDirection: 'row',
    gap: spacing.sm
  },
  cancelButton: {
    flex: 1,
    borderRadius: borderRadius.xxl,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    borderWidth: 1
  },
  cancelText: {
    fontFamily: typography.body,
    fontSize: 16,
    fontWeight: '600'
  },
  confirmButton: {
    flex: 1
  },
  clearText: {
    color: '#FFF8F5',
    fontFamily: typography.body,
    fontSize: 16,
    fontWeight: '600'
  }
});

export default SettingsScreen;



