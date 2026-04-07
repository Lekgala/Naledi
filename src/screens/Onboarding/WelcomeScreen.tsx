import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { borderRadius, getShadowStyle, spacing, typography, useThemeColors } from '@utils/theme';
import BrandWordmark from '@components/BrandWordmark';

const E = {
  moon: '\u{1F319}',
  sparkles: '\u2728',
  heart: '\u{1F497}',
  dizzy: '\u{1F4AB}',
  tulip: '\u{1F337}',
  blossom: '\u{1F338}',
  lock: '\u{1F512}',
  cloud: '\u2601\uFE0F',
  seedling: '\u{1F331}',
  heartHands: '\u{1FAF6}',
  sunrise: '\u{1F305}',
  rainbow: '\u{1F308}',
  revolvingHearts: '\u{1F49E}',
  hibiscus: '\u{1F33A}',
  herb: '\u{1F33F}',
  sun: '\u2600\uFE0F',
  whiteHeart: '\u{1F90D}',
  keyLock: '\u{1F510}',
  bubbles: '\u{1FAE7}',
  star: '\u2B50'
};

const triggerHaptic = () => {
  try {
    const Haptics = require('expo-haptics');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch {
    // Keep navigation working even when haptics isn't available.
  }
};

const welcomePool = [
  {
    badge: `A little light for your rhythm ${E.star}`,
    eyebrow: 'Soft cycle care, made with warmth',
    heading: `Welcome to Naledi ${E.sparkles}`,
    body: `Naledi brings a little light to your cycle, helping you notice what your body is saying and make space for softer care every day ${E.heart}`,
    cardTitle: `We’ll shape this around your rhythm ${E.dizzy}`,
    cardBody: 'Start with just a few details, then Naledi will turn them into a warm, beautifully simple cycle home you will actually want to return to.',
    cta: `Begin with me ${E.tulip}`,
    footer: 'A tiny setup for a steadier, gentler routine',
    metricA: `to feel settled in ${E.blossom}`,
    metricB: `just for you ${E.lock}`
  },
  {
    badge: `A gentle place to land ${E.cloud}`,
    eyebrow: 'Small moments of care can change a day',
    heading: `Your rhythm belongs here ${E.blossom}`,
    body: 'A soft check-in can help you spot patterns, feel more prepared, and stay a little closer to yourself.',
    cardTitle: `Built to feel calm, not clinical ${E.heartHands}`,
    cardBody: 'We’ll start simple, keep it private, and give you a space that feels supportive from the very first tap.',
    cta: `Let’s begin ${E.blossom}`,
    footer: 'Just a minute to make this yours',
    metricA: `to get started ${E.seedling}`,
    metricB: `kept private ${E.whiteHeart}`
  },
  {
    badge: `Made for softer mornings ${E.sunrise}`,
    eyebrow: 'A calmer way to stay in tune',
    heading: `A lovely place to check in ${E.moon}`,
    body: 'Track the shifts, notice the patterns, and let Naledi hold the details so you do not have to.',
    cardTitle: `Your rhythm, your pace ${E.rainbow}`,
    cardBody: 'No pressure, no noise, just a warm little space to understand what your body has been telling you.',
    cta: `Start softly ${E.tulip}`,
    footer: 'A little ritual you might actually keep',
    metricA: `to settle in ${E.sparkles}`,
    metricB: `for your eyes only ${E.keyLock}`
  },
  {
    badge: `A quiet space for your cycle ${E.blossom}`,
    eyebrow: 'Gentle support, one day at a time',
    heading: `You and your rhythm, together ${E.revolvingHearts}`,
    body: 'Naledi turns small daily notes into gentle clarity, helping you see how you feel, what shifts, and what may be coming next.',
    cardTitle: `Simple enough to come back to ${E.moon}`,
    cardBody: 'The best routine is the one that feels easy, warm, and welcoming every time you open it.',
    cta: `Take me in ${E.blossom}`,
    footer: 'A calm beginning for the days ahead',
    metricA: `to feel at home ${E.bubbles}`,
    metricB: `designed for you ${E.tulip}`
  },
  {
    badge: `Care, but make it beautiful ${E.sparkles}`,
    eyebrow: 'A more loving way to keep track',
    heading: `Let’s make this feel like yours ${E.hibiscus}`,
    body: 'Naledi brings your cycle a little softness, with space to notice what matters without feeling overwhelmed.',
    cardTitle: `A warmer start to self-tracking ${E.whiteHeart}`,
    cardBody: 'We’ll begin with a few details, then turn them into thoughtful guidance and a rhythm you can return to.',
    cta: `Create my space ${E.blossom}`,
    footer: 'A sweet setup in under a minute',
    metricA: `to settle in ${E.herb}`,
    metricB: `private and gentle ${E.lock}`
  },
  {
    badge: `Your body has a rhythm ${E.moon}`,
    eyebrow: 'This is a soft place to notice it',
    heading: `Welcome to your new little ritual ${E.sparkles}`,
    body: 'Check in, breathe, and let Naledi help you keep the patterns that are easy to miss in everyday life.',
    cardTitle: `A simple start with a caring feel ${E.heart}`,
    cardBody: 'The goal is not more admin. It is a more intuitive sense of where you are and what you need.',
    cta: `Open my ritual ${E.tulip}`,
    footer: 'A gentle start you can build on',
    metricA: `to feel grounded ${E.blossom}`,
    metricB: `all yours ${E.whiteHeart}`
  },
  {
    badge: `Soft tracking for real life ${E.cloud}`,
    eyebrow: 'Less pressure, more understanding',
    heading: `A softer kind of cycle app ${E.blossom}`,
    body: 'Naledi helps you hold onto the details of your cycle in a way that feels clear, calm, and beautifully simple.',
    cardTitle: `The little things matter here ${E.herb}`,
    cardBody: 'A few taps today can become reassuring patterns later, especially on the days when you want answers fast.',
    cta: `Start with ease ${E.sparkles}`,
    footer: 'A small step toward feeling more in sync',
    metricA: `to get comfortable ${E.blossom}`,
    metricB: `thoughtfully private ${E.keyLock}`
  },
  {
    badge: `A little more softness, please ${E.tulip}`,
    eyebrow: 'Cycle care can feel warm and easy',
    heading: `You deserve a gentler start ${E.dizzy}`,
    body: 'This space is here to help you feel more prepared, more connected, and a little more cared for every day.',
    cardTitle: `Thoughtful by design ${E.whiteHeart}`,
    cardBody: 'From predictions to check-ins, everything is shaped to feel supportive instead of overwhelming.',
    cta: `Begin gently ${E.moon}`,
    footer: 'A tiny setup with a lovely payoff',
    metricA: `to feel ready ${E.herb}`,
    metricB: `held privately ${E.lock}`
  },
  {
    badge: `A bloom-by-bloom rhythm ${E.blossom}`,
    eyebrow: 'Notice more without doing more',
    heading: `A beautiful way to stay in tune ${E.sparkles}`,
    body: 'Naledi brings together your days, symptoms, moods, and patterns in one place that feels calm to return to.',
    cardTitle: `Made to feel easy on busy days ${E.sun}`,
    cardBody: 'You do not need a perfect routine. You just need something simple enough to open again tomorrow.',
    cta: `Start blooming ${E.blossom}`,
    footer: 'Settle in and let the rhythm unfold',
    metricA: `to feel settled ${E.tulip}`,
    metricB: `private by default ${E.whiteHeart}`
  },
  {
    badge: `Held with softness and light ${E.sparkles}`,
    eyebrow: 'A calmer relationship with your cycle',
    heading: `A little sanctuary for your rhythm ${E.blossom}`,
    body: 'Naledi is here to help you feel informed without feeling overwhelmed, with a gentle rhythm and a little more light in your day.',
    cardTitle: `Gentle does not mean basic ${E.moon}`,
    cardBody: 'Under the softness is a smart little system that helps turn your daily check-ins into clarity.',
    cta: `Make it mine ${E.dizzy}`,
    footer: 'A thoughtful start in one quiet minute',
    metricA: `to feel cozy ${E.blossom}`,
    metricB: `just for you ${E.whiteHeart}`
  },
  {
    badge: `A fresh page for your cycle ${E.seedling}`,
    eyebrow: 'Let today be a softer beginning',
    heading: `Start with a little care ${E.tulip}`,
    body: 'This is your space to check in, feel supported, and build a clearer picture of your cycle one day at a time.',
    cardTitle: `A beautiful habit in the making ${E.sparkles}`,
    cardBody: 'We’ll begin with the basics, then let Naledi grow into a companion that feels more personal with every check-in.',
    cta: `Begin today ${E.moon}`,
    footer: 'A small start with a gentle rhythm',
    metricA: `to get settled ${E.blossom}`,
    metricB: `kept close ${E.lock}`
  }
];

const getDailyWelcomeContent = () => {
  const today = new Date();
  const key = Number(`${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`);
  return welcomePool[key % welcomePool.length];
};

const WelcomeScreen = ({ navigation }: { navigation: any; onUpdate: (value: { name?: string }) => void }) => {
  const colors = useThemeColors();
  const shadowStyle = getShadowStyle(colors);
  const content = getDailyWelcomeContent();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} bounces={false}>
      <View style={[styles.glowLarge, { backgroundColor: colors.gradientEnd }]} />
      <View style={[styles.glowSmall, { backgroundColor: colors.secondary }]} />

      <View style={[styles.heroCard, { backgroundColor: colors.surfaceWarm }]}> 
        <View style={styles.brandWrap}>
          <BrandWordmark subtitle="A little light for your rhythm" />
        </View>
        <View style={[styles.badge, { backgroundColor: colors.surfaceSoft, borderColor: colors.border }]}> 
          <Text style={[styles.badgeText, { color: colors.primary }]}>{content.badge}</Text>
        </View>
        <Text style={[styles.eyebrow, { color: colors.muted }]}>{content.eyebrow}</Text>
        <Text style={[styles.heading, { color: colors.text }]}>{content.heading}</Text>
        <Text style={[styles.body, { color: colors.muted }]}>{content.body}</Text>

        <View style={styles.metricsRow}>
          <View style={[styles.metricCard, shadowStyle, { backgroundColor: colors.surface }]}> 
            <Text style={[styles.metricValue, { color: colors.text }]}>1 minute</Text>
            <Text style={[styles.metricLabel, { color: colors.muted }]}>{content.metricA}</Text>
          </View>
          <View style={[styles.metricCard, shadowStyle, { backgroundColor: colors.surface }]}> 
            <Text style={[styles.metricValue, { color: colors.text }]}>Private</Text>
            <Text style={[styles.metricLabel, { color: colors.muted }]}>{content.metricB}</Text>
          </View>
        </View>
      </View>

      <View style={[styles.card, shadowStyle, { backgroundColor: colors.surface }]}> 
        <View style={[styles.cardAccent, { backgroundColor: colors.surfaceWarm }]} />
        <Text style={[styles.cardTitle, { color: colors.text }]}>{content.cardTitle}</Text>
        <Text style={[styles.cardBody, { color: colors.muted }]}>{content.cardBody}</Text>
      </View>

      <View style={styles.footer}>
        <Pressable style={[styles.button, shadowStyle, { backgroundColor: colors.primary }]} onPress={() => { triggerHaptic(); navigation.navigate('LastPeriod'); }}>
          <Text style={styles.buttonText}>{content.cta}</Text>
        </Pressable>
        <Text style={[styles.footerText, { color: colors.muted }]}>{content.footer}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flexGrow: 1,
    padding: spacing.lg,
    justifyContent: 'space-between',
    overflow: 'hidden'
  },
  glowLarge: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    top: -48,
    right: -72,
    opacity: 0.45
  },
  glowSmall: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    bottom: 160,
    left: -54,
    opacity: 0.24
  },
  heroCard: {
    marginTop: spacing.lg,
    borderRadius: borderRadius.xxl,
    padding: spacing.xl
  },
  brandWrap: {
    marginBottom: spacing.lg
  },
  badge: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    marginBottom: spacing.lg
  },
  badgeText: {
    fontFamily: typography.body,
    fontSize: 13,
    fontWeight: '700'
  },
  eyebrow: {
    fontFamily: typography.body,
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: spacing.sm
  },
  heading: {
    fontFamily: typography.display,
    fontSize: 44,
    marginBottom: spacing.md
  },
  body: {
    fontFamily: typography.body,
    fontSize: 17,
    lineHeight: 28,
    maxWidth: '94%'
  },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl
  },
  metricCard: {
    flex: 1,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md
  },
  metricValue: {
    fontFamily: typography.display,
    fontSize: 24,
    marginBottom: spacing.xs
  },
  metricLabel: {
    fontFamily: typography.body,
    fontSize: 13
  },
  card: {
    borderRadius: borderRadius.xxl,
    padding: spacing.xl,
    position: 'relative',
    overflow: 'hidden'
  },
  cardAccent: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    top: -30,
    right: -20,
    opacity: 0.9
  },
  cardTitle: {
    fontFamily: typography.body,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: spacing.md,
    maxWidth: '80%'
  },
  cardBody: {
    fontFamily: typography.body,
    fontSize: 15,
    lineHeight: 24,
    maxWidth: '88%'
  },
  footer: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg
  },
  button: {
    borderRadius: borderRadius.xxl,
    paddingVertical: spacing.lg,
    alignItems: 'center'
  },
  buttonText: {
    color: '#FFF8F5',
    fontFamily: typography.body,
    fontSize: 16,
    fontWeight: '600'
  },
  footerText: {
    marginTop: spacing.md,
    textAlign: 'center',
    fontFamily: typography.body,
    fontSize: 14
  }
});

export default WelcomeScreen;
