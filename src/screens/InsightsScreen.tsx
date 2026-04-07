import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAppContext } from '../hooks/AppContext';
import { typography, spacing, borderRadius, getShadowStyle, useThemeColors } from '../utils/theme';
import InsightChart from '../components/InsightChart';
import BrandWordmark from '../components/BrandWordmark';
import { averageCycleLength, averagePeriodLength, getCycleStarts, getDailyGuidance, getEntryInsights, getPhasePatternInsight, getRecentTimeline } from '../utils/prediction';

const EMOJI_FLOWER = '\u{1F33C}';
const EMOJI_DIZZY = '\u{1F4AB}';
const EMOJI_SPROUT = '\u{1F331}';
const EMOJI_CLOUD = '\u2601\uFE0F';
const EMOJI_FIRE = '\u{1F525}';
const EMOJI_CHART = '\u{1F4CA}';
const EMOJI_SPIRAL = '\u{1F9F5}';

const InsightsScreen = () => {
  const colors = useThemeColors();
  const shadowStyle = getShadowStyle(colors);
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation<any>();
  const { entries, settings, prediction } = useAppContext();
  const cycleStarts = useMemo(() => getCycleStarts(entries), [entries]);
  const cycleLengths = useMemo(() => {
    const lengths: { label: string; value: number }[] = [];
    cycleStarts.slice(-6).forEach((start, index) => {
      if (index < cycleStarts.length - 1) {
        const next = cycleStarts[index + 1];
        const interval = Math.round((new Date(next).getTime() - new Date(start).getTime()) / 86400000);
        lengths.push({ label: `#${index + 1}`, value: Math.max(21, Math.min(35, interval)) });
      }
    });
    return lengths;
  }, [cycleStarts]);

  const averageCycles = averageCycleLength(entries, settings.avgCycleLength);
  const averagePeriods = averagePeriodLength(entries, settings.avgPeriodLength);
  const insights = useMemo(() => getEntryInsights(entries), [entries]);
  const guidance = useMemo(() => getDailyGuidance(entries, prediction), [entries, prediction]);
  const phasePattern = useMemo(() => getPhasePatternInsight(entries, prediction), [entries, prediction]);
  const timeline = useMemo(() => getRecentTimeline(entries), [entries]);
  const symptomSummary = insights.topSymptoms.length > 0
    ? insights.topSymptoms.map((item) => `${item.label} (${item.count})`).join(', ')
    : `Start logging symptoms and Naledi will gently bring forward the ones that show up most often ${EMOJI_FLOWER}`;
  const moodSummary = insights.topMoods.length > 0
    ? insights.topMoods.map((item) => `${item.label} (${item.count})`).join(', ')
    : `Once you log a few moods, this space will reflect your emotional patterns ${EMOJI_DIZZY}`;

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
            <BrandWordmark subtitle="Patterns, softly revealed" />
          </View>
          <Text style={[styles.kicker, { color: colors.primary }]}>{`Your patterns ${EMOJI_CHART}`}</Text>
          <Text style={[styles.title, { color: colors.text }]}>Insights</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>A refined snapshot of your cycle patterns, moods, and recurring symptoms so you can notice what matters a little faster.</Text>
        </View>
        <View style={[styles.highlightRow, styles.cardRow]}>
          <View style={[styles.highlightCard, shadowStyle, { backgroundColor: colors.surface }]}>
            <Text style={[styles.highlightValue, { color: colors.primary }]}>{averageCycles}</Text>
            <Text style={[styles.highlightLabel, { color: colors.text }]}>day cycle</Text>
          </View>
          <View style={[styles.highlightCard, shadowStyle, { backgroundColor: colors.surface }]}>
            <Text style={[styles.highlightValue, { color: colors.primary }]}>{insights.totalLogs}</Text>
            <Text style={[styles.highlightLabel, { color: colors.text }]}>check-ins</Text>
          </View>
        </View>
        <View style={[styles.card, shadowStyle, { backgroundColor: colors.surface }]}> 
          <Text style={[styles.cardTitle, { color: colors.text }]}>{`A little light from Naledi ${EMOJI_DIZZY}`}</Text>
          <Text style={[styles.subtle, { color: colors.muted }]}>{guidance.message}</Text>
        </View>
        <View style={[styles.card, shadowStyle, { backgroundColor: colors.surface }]}> 
          <Text style={[styles.cardTitle, { color: colors.text }]}>{`Phase-based patterns ${EMOJI_FLOWER}`}</Text>
          <Text style={[styles.subtle, { color: colors.muted }]}>{phasePattern.summary}</Text>
        </View>
        <View style={[styles.card, shadowStyle, { backgroundColor: colors.surface }]}> 
          <Text style={[styles.cardTitle, { color: colors.text }]}>{`Recent timeline ${EMOJI_SPIRAL}`}</Text>
          {timeline.length > 0 ? (
            timeline.map((item, index) => (
              <Pressable
                key={item.id}
                style={[styles.timelineItem, { borderTopColor: colors.border }, index === 0 && styles.timelineItemFirst]}
                onPress={() => navigation.navigate('DayDetailModal', { date: item.date })}
              >
                <Text style={[styles.timelineDate, { color: colors.primary }]}>{item.dateLabel}</Text>
                <Text style={[styles.timelineTitle, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.subtle, { color: colors.muted }]}>{item.detail}</Text>
              </Pressable>
            ))
          ) : (
            <Text style={[styles.subtle, { color: colors.muted }]}>As you keep logging, your recent check-ins will appear here like a gentle timeline.</Text>
          )}
        </View>
        <View style={[styles.card, shadowStyle, { backgroundColor: colors.surface }]}> 
          <Text style={[styles.cardTitle, { color: colors.text }]}>Cycle average</Text>
          <Text style={[styles.metric, { color: colors.primary }]}>{averageCycles} days</Text>
          <Text style={[styles.subtle, { color: colors.muted }]}>Based on your last entries and preferences.</Text>
        </View>
        <View style={[styles.card, shadowStyle, { backgroundColor: colors.surface }]}> 
          <Text style={[styles.cardTitle, { color: colors.text }]}>Period duration</Text>
          <Text style={[styles.metric, { color: colors.primary }]}>{averagePeriods} days</Text>
          <Text style={[styles.subtle, { color: colors.muted }]}>How long your period usually lasts.</Text>
        </View>
        <View>
          <InsightChart data={cycleLengths} title="Cycle lengths" />
        </View>
        <View style={[styles.card, shadowStyle, { backgroundColor: colors.surface }]}> 
          <Text style={[styles.cardTitle, { color: colors.text }]}>{`Most logged symptoms ${EMOJI_SPROUT}`}</Text>
          <Text style={[styles.subtle, { color: colors.muted }]}>{symptomSummary}</Text>
        </View>
        <View style={[styles.card, shadowStyle, { backgroundColor: colors.surface }]}> 
          <Text style={[styles.cardTitle, { color: colors.text }]}>{`Mood patterns ${EMOJI_CLOUD}`}</Text>
          <Text style={[styles.subtle, { color: colors.muted }]}>{moodSummary}</Text>
        </View>
        <View style={[styles.card, shadowStyle, { backgroundColor: colors.surface }]}> 
          <Text style={[styles.cardTitle, { color: colors.text }]}>{`Logging streak ${EMOJI_FIRE}`}</Text>
          <Text style={[styles.metric, { color: colors.primary }]}>{insights.totalLogs}</Text>
          <Text style={[styles.subtle, { color: colors.muted }]}>{insights.totalLogs === 1 ? 'You have 1 check-in so far.' : `You have ${insights.totalLogs} check-ins so far.`}</Text>
        </View>
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
  cardRow: {
    flexDirection: 'row',
    gap: spacing.md
  },
  highlightRow: {
    marginBottom: spacing.lg
  },
  highlightCard: {
    flex: 1,
    borderRadius: borderRadius.xxl,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg
  },
  highlightValue: {
    fontFamily: typography.display,
    fontSize: 30,
    marginBottom: spacing.xs
  },
  highlightLabel: {
    fontFamily: typography.body,
    fontSize: 14,
    fontWeight: '600'
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
  timelineItem: {
    borderTopWidth: 1,
    paddingTop: spacing.md,
    marginTop: spacing.md
  },
  timelineItemFirst: {
    borderTopWidth: 0,
    paddingTop: 0,
    marginTop: 0
  },
  timelineDate: {
    fontFamily: typography.body,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.8
  },
  timelineTitle: {
    fontFamily: typography.body,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.xs
  },
  metric: {
    fontFamily: typography.display,
    fontSize: 36,
    marginBottom: spacing.sm
  },
  subtle: {
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 20
  }
});

export default InsightsScreen;



