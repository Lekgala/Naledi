import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { typography, useThemeColors } from '@utils/theme';

interface InsightChartProps {
  data: { label: string; value: number }[];
  title: string;
}

const InsightChart = ({ data, title }: InsightChartProps) => {
  const colors = useThemeColors();

  if (data.length === 0) {
    return (
      <View style={[styles.chartCard, { backgroundColor: colors.surfaceWarm }]}> 
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.emptyState, { color: colors.muted }]}>Add more cycle data to unlock your trend view.</Text>
      </View>
    );
  }

  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <View style={[styles.chartCard, { backgroundColor: colors.surfaceWarm }]}> 
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <View style={styles.chart}>
        {data.map((item) => (
          <View key={item.label} style={styles.barGroup}>
            <Text style={[styles.barValue, { color: colors.muted }]}>{item.value}</Text>
            <View style={[styles.barTrack, { backgroundColor: colors.surfaceSoft }]}> 
              <View style={[styles.barFill, { backgroundColor: colors.secondary, height: `${Math.max(18, (item.value / maxValue) * 100)}%` }]} />
            </View>
            <Text style={[styles.barLabel, { color: colors.text }]}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartCard: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 18
  },
  title: {
    fontFamily: typography.body,
    fontSize: 16,
    marginBottom: 12
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minHeight: 220,
    paddingTop: 12
  },
  barGroup: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4
  },
  barTrack: {
    width: '100%',
    maxWidth: 32,
    height: 150,
    borderRadius: 16,
    justifyContent: 'flex-end',
    overflow: 'hidden'
  },
  barFill: {
    width: '100%',
    borderRadius: 16
  },
  barValue: {
    fontFamily: typography.body,
    fontSize: 12,
    marginBottom: 8
  },
  barLabel: {
    fontFamily: typography.body,
    fontSize: 12,
    marginTop: 10
  },
  emptyState: {
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 20
  }
});

export default InsightChart;
