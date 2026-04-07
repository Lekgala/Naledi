import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { typography, useThemeColors } from '@utils/theme';

let NativeSlider: any = null;
if (Platform.OS !== 'web') {
  NativeSlider = require('@react-native-community/slider').default;
}

interface PlatformSliderProps {
  minimumValue: number;
  maximumValue: number;
  step: number;
  value: number;
  onValueChange: (value: number) => void;
  minimumTrackTintColor?: string;
  maximumTrackTintColor?: string;
  thumbTintColor?: string;
}

const PlatformSlider = ({
  minimumValue,
  maximumValue,
  step,
  value,
  onValueChange,
  minimumTrackTintColor,
  maximumTrackTintColor,
  thumbTintColor
}: PlatformSliderProps) => {
  const colors = useThemeColors();

  if (Platform.OS === 'web') {
    return (
      <View style={styles.webWrapper}>
        <View style={[styles.controls, { backgroundColor: colors.surfaceSoft }]}> 
          <Pressable style={[styles.controlButton, { backgroundColor: colors.primary }]} onPress={() => onValueChange(Math.max(minimumValue, value - step))}>
            <Text style={styles.controlText}>-</Text>
          </Pressable>
          <Text style={[styles.valueText, { color: colors.text }]}>{value}</Text>
          <Pressable style={[styles.controlButton, { backgroundColor: colors.primary }]} onPress={() => onValueChange(Math.min(maximumValue, value + step))}>
            <Text style={styles.controlText}>+</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <NativeSlider
      minimumValue={minimumValue}
      maximumValue={maximumValue}
      step={step}
      value={value}
      onValueChange={onValueChange}
      minimumTrackTintColor={minimumTrackTintColor}
      maximumTrackTintColor={maximumTrackTintColor}
      thumbTintColor={thumbTintColor}
    />
  );
};

const styles = StyleSheet.create({
  webWrapper: {
    marginTop: 20
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 18,
    padding: 14
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  controlText: {
    fontSize: 24,
    color: '#FFF8F5'
  },
  valueText: {
    fontFamily: typography.body,
    fontSize: 18,
    minWidth: 60,
    textAlign: 'center'
  }
});

export default PlatformSlider;
