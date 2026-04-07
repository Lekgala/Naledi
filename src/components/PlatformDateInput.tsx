import React, { useEffect, useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { addMonths, endOfMonth, isAfter, isSameDay, subMonths } from 'date-fns';
import { formatDayLabel, formatMonthYear, getMonthDays, normalizeDate, weekdayIndex } from '@utils/dates';

const NativeDateTimePicker = Platform.OS !== 'web' ? require('@react-native-community/datetimepicker').default : null;
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface PlatformDateInputProps {
  value: Date;
  onChange: (event: any, date?: Date) => void;
  maximumDate?: Date;
}

const PlatformDateInput = ({ value, onChange, maximumDate }: PlatformDateInputProps) => {
  const [visibleMonth, setVisibleMonth] = useState(normalizeDate(value));

  useEffect(() => {
    setVisibleMonth(normalizeDate(value));
  }, [value]);

  const monthDays = useMemo(() => getMonthDays(visibleMonth), [visibleMonth]);
  const maxDate = maximumDate ? normalizeDate(maximumDate) : undefined;

  if (Platform.OS === 'web') {
    const blankDays = Array.from({ length: weekdayIndex(monthDays[0]) }, (_, index) => (
      <View key={`blank-${index}`} style={styles.daySlot} />
    ));

    return (
      <View style={styles.webInputWrapper}>
        <View style={styles.header}>
          <Text style={styles.selectedLabel}>Pick a date</Text>
          <Text style={styles.selectedValue}>{value.toDateString()}</Text>
        </View>

        <View style={styles.monthBar}>
          <Pressable
            style={styles.monthButton}
            onPress={() => setVisibleMonth((current) => subMonths(current, 1))}
            accessibilityLabel="Previous month"
          >
            <Text style={styles.monthButtonText}>Back</Text>
          </Pressable>
          <Text style={styles.monthTitle}>{formatMonthYear(visibleMonth)}</Text>
          <Pressable
            style={styles.monthButton}
            onPress={() => {
              const nextMonth = addMonths(visibleMonth, 1);
              if (maxDate && isAfter(nextMonth, endOfMonth(maxDate))) return;
              setVisibleMonth(nextMonth);
            }}
            accessibilityLabel="Next month"
          >
            <Text style={styles.monthButtonText}>Next</Text>
          </Pressable>
        </View>

        <View style={styles.weekdaysRow}>
          {weekdays.map((day) => (
            <Text key={day} style={styles.weekdayLabel}>{day}</Text>
          ))}
        </View>

        <View style={styles.grid}>
          {blankDays}
          {monthDays.map((day) => {
            const normalizedDay = normalizeDate(day);
            const selected = isSameDay(normalizedDay, value);
            const disabled = maxDate ? isAfter(normalizedDay, maxDate) : false;

            return (
              <View key={normalizedDay.toISOString()} style={styles.daySlot}>
                <Pressable
                  style={[styles.dayButton, selected && styles.dayButtonSelected, disabled && styles.dayButtonDisabled]}
                  disabled={disabled}
                  onPress={() => onChange({}, normalizedDay)}
                  accessibilityLabel={`Select ${normalizedDay.toDateString()}`}
                >
                  <Text style={[styles.dayText, selected && styles.dayTextSelected, disabled && styles.dayTextDisabled]}>
                    {formatDayLabel(normalizedDay)}
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      </View>
    );
  }

  return (
    <NativeDateTimePicker
      value={value}
      mode="date"
      display="spinner"
      onChange={onChange}
      maximumDate={maximumDate}
    />
  );
};

const styles = StyleSheet.create({
  webInputWrapper: {
    marginTop: 12,
    backgroundColor: '#FFFDFC',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1D7DE'
  },
  header: {
    marginBottom: 16
  },
  selectedLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8B6D78',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4
  },
  selectedValue: {
    fontSize: 18,
    color: '#3D2C35',
    fontWeight: '600'
  },
  monthBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14
  },
  monthButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: '#FFF0F3'
  },
  monthButtonText: {
    color: '#E8789A',
    fontSize: 13,
    fontWeight: '700'
  },
  monthTitle: {
    fontSize: 16,
    color: '#3D2C35',
    fontWeight: '700'
  },
  weekdaysRow: {
    flexDirection: 'row',
    marginBottom: 8
  },
  weekdayLabel: {
    flex: 1,
    textAlign: 'center',
    color: '#8B6D78',
    fontSize: 12
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  daySlot: {
    width: '14.2857%',
    alignItems: 'center',
    marginBottom: 8
  },
  dayButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dayButtonSelected: {
    backgroundColor: '#E8789A'
  },
  dayButtonDisabled: {
    opacity: 0.35
  },
  dayText: {
    fontSize: 14,
    color: '#3D2C35'
  },
  dayTextSelected: {
    color: '#FFF8F5',
    fontWeight: '700'
  },
  dayTextDisabled: {
    color: '#BDA8B0'
  }
});

export default PlatformDateInput;
