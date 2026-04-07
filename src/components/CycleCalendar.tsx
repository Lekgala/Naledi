import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { getMonthDays, formatDayLabel, isToday, weekdayIndex } from '@utils/dates';
import { isDateInRange } from '@utils/prediction';
import { CycleEntry, CyclePrediction } from '@models/models';
import { typography, spacing, borderRadius, getShadowStyle, useThemeColors } from '@utils/theme';

interface CycleCalendarProps {
  entries: CycleEntry[];
  prediction: CyclePrediction;
  onDayPress: (date: string) => void;
}

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CycleCalendar = ({ entries, prediction, onDayPress }: CycleCalendarProps) => {
  const colors = useThemeColors();
  const shadowStyle = getShadowStyle(colors);
  const today = new Date();
  const days = getMonthDays(today);

  const entryByDate = new Map(entries.map((item) => [item.date, item]));

  const renderDay = (date: Date) => {
    const dateString = date.toISOString().slice(0, 10);
    const entry = entryByDate.get(dateString);
    const isCurrentDay = isToday(date);
    const isOvulation = dateString === prediction.ovulationDate;
    const isFertile = isDateInRange(dateString, prediction.fertileWindowStart, prediction.fertileWindowEnd);
    const isPredicted = dateString === prediction.nextPeriodStart;

    return (
      <View key={dateString} style={styles.daySlot}>
        <Pressable
          style={[
            styles.dayCell,
            isCurrentDay && { borderWidth: 2, borderColor: colors.primary, borderRadius: borderRadius.lg }
          ]}
          onPress={() => onDayPress(dateString)}
          accessibilityLabel={`Day ${formatDayLabel(date)}, ${entry ? 'logged' : 'not logged'}`}
        >
          <View
            style={[
              styles.dayMarker,
              isOvulation && styles.ovulationMarker,
              isFertile && styles.fertileMarker,
              isPredicted && { borderWidth: 2, borderColor: colors.primary, backgroundColor: colors.predicted }
            ]}
          >
            <Text style={[styles.dayText, { color: entry ? colors.text : colors.muted }]}>{formatDayLabel(date)}</Text>
          </View>
          {entry?.isPeriod && <View style={[styles.periodDot, { backgroundColor: colors.period }]} />}
        </Pressable>
      </View>
    );
  };

  const blanks = Array.from({ length: weekdayIndex(days[0]) }, (_, index) => <View key={`blank-${index}`} style={styles.daySlot} />);

  return (
    <View style={[styles.wrapper, shadowStyle, { backgroundColor: colors.surface }]}>
      <View style={[styles.calendarHeader, { borderBottomColor: colors.border }]}>
        <Text style={[styles.calendarMonth, { color: colors.text }]}>
          {today.toLocaleString('en-US', { month: 'long' })}
        </Text>
        <Text style={[styles.calendarMeta, { color: colors.primary }]}>Your month</Text>
      </View>
      <View style={styles.weekdaysRow}>
        {weekdays.map((weekday) => (
          <Text key={weekday} style={[styles.weekdayLabel, { color: colors.muted }]}>{weekday}</Text>
        ))}
      </View>
      <View style={styles.grid}>
        {blanks}
        {days.map(renderDay)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: borderRadius.xxl,
    padding: spacing.lg,
    marginTop: spacing.lg
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing.md,
    marginBottom: spacing.sm,
    borderBottomWidth: 1
  },
  calendarMonth: {
    fontFamily: typography.display,
    fontSize: 26
  },
  calendarMeta: {
    fontFamily: typography.body,
    fontSize: 13,
    fontWeight: '700'
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md
  },
  weekdayLabel: {
    flex: 1,
    textAlign: 'center',
    fontFamily: typography.body,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  daySlot: {
    width: '14.2857%',
    alignItems: 'center',
    marginBottom: spacing.xs
  },
  dayCell: {
    width: '100%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44
  },
  dayMarker: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dayText: {
    fontFamily: typography.body,
    fontSize: 14,
    fontWeight: '600'
  },
  periodDot: {
    position: 'absolute',
    bottom: 8,
    width: 8,
    height: 8,
    borderRadius: 4
  },
  fertileMarker: {
    backgroundColor: '#FFE4EF'
  },
  ovulationMarker: {
    backgroundColor: '#FFBDD0'
  }
});

export default CycleCalendar;
