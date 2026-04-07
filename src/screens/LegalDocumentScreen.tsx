import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { privacyPolicy, termsOfUse } from '../content/legal';
import { borderRadius, getShadowStyle, spacing, typography, useThemeColors } from '../utils/theme';

const documents = {
  privacy: privacyPolicy,
  terms: termsOfUse
} as const;

const LegalDocumentScreen = () => {
  const colors = useThemeColors();
  const shadowStyle = getShadowStyle(colors);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const documentKey = route.params?.document === 'terms' ? 'terms' : 'privacy';
  const document = documents[documentKey];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <View style={[styles.heroCard, { backgroundColor: colors.surfaceWarm }]}>
        <Text style={[styles.kicker, { color: colors.primary }]}>Legal</Text>
        <Text style={[styles.title, { color: colors.text }]}>{document.title}</Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>{`Last updated ${document.updatedAt}`}</Text>
      </View>

      <View style={[styles.card, shadowStyle, { backgroundColor: colors.surface }]}>
        <Text style={[styles.intro, { color: colors.text }]}>{document.intro}</Text>
        {document.sections.map((section) => (
          <View key={section.heading} style={[styles.section, { borderTopColor: colors.border }]}>
            <Text style={[styles.sectionHeading, { color: colors.text }]}>{section.heading}</Text>
            <Text style={[styles.sectionBody, { color: colors.muted }]}>{section.body}</Text>
          </View>
        ))}
      </View>

      <Pressable style={[styles.button, shadowStyle, { backgroundColor: colors.primary }]} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Back to settings</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl
  },
  heroCard: {
    borderRadius: borderRadius.xxl,
    padding: spacing.xl,
    marginBottom: spacing.lg
  },
  kicker: {
    fontFamily: typography.body,
    fontSize: 13,
    marginBottom: spacing.sm,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8
  },
  title: {
    fontFamily: typography.display,
    fontSize: 34,
    marginBottom: spacing.sm
  },
  subtitle: {
    fontFamily: typography.body,
    fontSize: 15
  },
  card: {
    borderRadius: borderRadius.xxl,
    padding: spacing.lg,
    marginBottom: spacing.lg
  },
  intro: {
    fontFamily: typography.body,
    fontSize: 16,
    lineHeight: 25
  },
  section: {
    borderTopWidth: 1,
    marginTop: spacing.lg,
    paddingTop: spacing.lg
  },
  sectionHeading: {
    fontFamily: typography.body,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: spacing.sm
  },
  sectionBody: {
    fontFamily: typography.body,
    fontSize: 15,
    lineHeight: 24
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
  }
});

export default LegalDocumentScreen;
