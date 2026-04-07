import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { DischargeType, SymptomKey } from '@models/models';
import { typography, useThemeColors } from '@utils/theme';

const triggerHaptic = () => {
  try {
    const Haptics = require('expo-haptics');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {
    // Keep selection working even when haptics isn't available.
  }
};

const symptoms: { key: SymptomKey; label: string }[] = [
  { key: 'cramps', label: 'Cramps' },
  { key: 'bloating', label: 'Bloating' },
  { key: 'breastTenderness', label: 'Breast tenderness' },
  { key: 'headache', label: 'Headache' },
  { key: 'backache', label: 'Backache' },
  { key: 'fatigue', label: 'Fatigue' }
];

const moods: { key: SymptomKey; label: string }[] = [
  { key: 'happy', label: 'Happy' },
  { key: 'sad', label: 'Sad' },
  { key: 'anxious', label: 'Anxious' },
  { key: 'irritable', label: 'Irritable' },
  { key: 'energetic', label: 'Energetic' },
  { key: 'pms', label: 'PMS' }
];

const dischargeOptions: { key: DischargeType; label: string }[] = [
  { key: 'none', label: 'None' },
  { key: 'spotting', label: 'Spotting' },
  { key: 'creamy', label: 'Creamy' },
  { key: 'watery', label: 'Watery' },
  { key: 'eggWhite', label: 'Egg white' }
];

interface SymptomGridProps {
  selected: Array<SymptomKey | DischargeType>;
  onToggle: (key: SymptomKey | DischargeType) => void;
  moodMode?: boolean;
  dischargeMode?: boolean;
}

const SymptomGrid = ({ selected, onToggle, moodMode, dischargeMode }: SymptomGridProps) => {
  const colors = useThemeColors();
  const choices = dischargeMode ? dischargeOptions : moodMode ? moods : symptoms;

  return (
    <View style={styles.grid}>
      {choices.map((item) => {
        const active = selected.includes(item.key);
        return (
          <Pressable
            key={item.key}
            style={[
              styles.chip,
              active
                ? { backgroundColor: colors.surfaceWarm, borderColor: colors.primary }
                : { backgroundColor: colors.surfaceSoft, borderColor: colors.border }
            ]}
            onPress={() => { triggerHaptic(); onToggle(item.key); }}
          >
            <Text style={[styles.label, { color: active ? colors.primary : colors.text }]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6
  },
  chip: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 999,
    marginBottom: 10,
    marginHorizontal: 6,
    borderWidth: 1,
    minWidth: '28%'
  },
  label: {
    fontFamily: typography.body,
    textAlign: 'center'
  }
});

export default SymptomGrid;
