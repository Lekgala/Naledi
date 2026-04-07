import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FlowIntensity } from '../types/models';
import { typography, spacing, useThemeColors } from '../utils/theme';

const triggerHaptic = () => {
  try {
    const Haptics = require('expo-haptics');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {
    // Keep selection working even when haptics isn't available.
  }
};

const flowOptions: { value: FlowIntensity; label: string; description: string }[] = [
  { value: 'none', label: 'None', description: 'No bleeding today' },
  { value: 'spotting', label: 'Spotting', description: 'Very light' },
  { value: 'light', label: 'Light', description: 'Easy flow' },
  { value: 'medium', label: 'Medium', description: 'Noticeable flow' },
  { value: 'heavy', label: 'Heavy', description: 'A heavier day' }
];

const FlowSelector = ({ value, onChange }: { value: FlowIntensity; onChange: (value: FlowIntensity) => void }) => {
  const colors = useThemeColors();

  return (
    <View style={styles.row}>
      {flowOptions.map((option) => {
        const isSelected = value === option.value;
        return (
          <Pressable
            key={option.value}
            style={[
              styles.option,
              { backgroundColor: colors.surfaceSoft, borderColor: colors.border },
              isSelected && { backgroundColor: colors.surfaceWarm, borderColor: colors.primary }
            ]}
            onPress={() => { triggerHaptic(); onChange(option.value); }}
          >
            <Text style={[styles.label, { color: colors.text }]}>{option.label}</Text>
            <Text style={[styles.description, { color: isSelected ? colors.primary : colors.muted }]}>{option.description}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  option: {
    width: '48%',
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginBottom: 12,
    alignItems: 'flex-start',
    borderWidth: 1
  },
  label: {
    fontFamily: typography.body,
    fontSize: 15,
    fontWeight: '700'
  },
  description: {
    fontFamily: typography.body,
    fontSize: 12,
    marginTop: spacing.xs
  }
});

export default FlowSelector;
