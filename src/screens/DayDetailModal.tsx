import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import PlatformDateInput from '../components/PlatformDateInput';
import { useAppContext } from '../hooks/AppContext';
import FlowSelector from '../components/FlowSelector';
import SymptomGrid from '../components/SymptomGrid';
import { formatISO } from '../utils/dates';
import { borderRadius, getShadowStyle, spacing, typography, useThemeColors } from '../utils/theme';
import { CycleEntry, DischargeType, FlowIntensity, SymptomKey } from '../types/models';

const DayDetailModal = () => {
  const colors = useThemeColors();
  const shadowStyle = getShadowStyle(colors);
  const route = useRoute();
  const navigation = useNavigation<any>();
  const { entries, addEntry, updateEntry } = useAppContext();
  const dateParam = (route.params as any)?.date ?? formatISO(new Date());
  const selectedDate = formatISO(new Date(dateParam));

  const existingEntry = useMemo(() => entries.find((entry) => entry.date === selectedDate), [entries, selectedDate]);
  const [flowIntensity, setFlowIntensity] = useState<FlowIntensity>(existingEntry?.flowIntensity ?? 'none');
  const [symptoms, setSymptoms] = useState<SymptomKey[]>(existingEntry?.symptoms ?? []);
  const [mood, setMood] = useState<SymptomKey[]>(existingEntry?.mood ?? []);
  const [discharge, setDischarge] = useState<DischargeType>(existingEntry?.discharge ?? 'none');
  const [notes, setNotes] = useState(existingEntry?.notes ?? '');
  const [date, setDate] = useState(new Date(selectedDate));

  useEffect(() => {
    if (existingEntry) {
      setFlowIntensity(existingEntry.flowIntensity);
      setSymptoms(existingEntry.symptoms);
      setMood(existingEntry.mood);
      setDischarge(existingEntry.discharge);
      setNotes(existingEntry.notes);
    }
  }, [existingEntry]);

  const saveEntry = async () => {
    const entry: CycleEntry = {
      id: existingEntry?.id ?? `${selectedDate}-${Date.now()}`,
      date: formatISO(date),
      isPeriod: flowIntensity !== 'none',
      flowIntensity,
      symptoms,
      mood,
      discharge,
      notes,
      createdAt: existingEntry?.createdAt ?? new Date().toISOString()
    };

    if (existingEntry) await updateEntry(entry);
    else await addEntry(entry);
    Alert.alert('Saved', 'Daily details are stored locally.');
    navigation.goBack();
  };

  const handleDateChange = (_: any, selectedDateValue?: Date) => {
    const current = selectedDateValue || date;
    setDate(current);
  };

  return (
    <Modal animationType="slide" visible onRequestClose={() => navigation.goBack()}>
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Day details</Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>{date.toDateString()}</Text>
        <View style={[styles.dateInput, { backgroundColor: colors.surfaceWarm, borderColor: colors.border }]}> 
          <Text style={[styles.dateText, { color: colors.text }]}>Change date</Text>
          <PlatformDateInput value={date} onChange={handleDateChange} maximumDate={new Date()} />
        </View>
        <Text style={[styles.sectionLabel, { color: colors.text }]}>Flow intensity</Text>
        <FlowSelector value={flowIntensity} onChange={setFlowIntensity} />
        <Text style={[styles.sectionLabel, { color: colors.text }]}>Symptoms</Text>
        <SymptomGrid selected={symptoms} onToggle={(key) => setSymptoms((prev) => (prev.includes(key as SymptomKey) ? prev.filter((item) => item !== (key as SymptomKey)) : [...prev, key as SymptomKey]))} />
        <Text style={[styles.sectionLabel, { color: colors.text }]}>Mood</Text>
        <SymptomGrid selected={mood} onToggle={(key) => setMood((prev) => (prev.includes(key as SymptomKey) ? prev.filter((item) => item !== (key as SymptomKey)) : [...prev, key as SymptomKey]))} moodMode />
        <Text style={[styles.sectionLabel, { color: colors.text }]}>Discharge</Text>
        <SymptomGrid selected={[discharge]} onToggle={(key) => setDischarge(key as DischargeType)} dischargeMode />
        <Text style={[styles.sectionLabel, { color: colors.text }]}>Notes</Text>
        <TextInput
          style={[styles.textArea, shadowStyle, { backgroundColor: colors.surfaceSoft, color: colors.text }]}
          placeholder="Add a reflection for this day"
          placeholderTextColor={colors.muted}
          multiline
          value={notes}
          onChangeText={setNotes}
        />
        <Pressable style={[styles.saveButton, shadowStyle, { backgroundColor: colors.primary }]} onPress={saveEntry}>
          <Text style={styles.saveText}>Save details</Text>
        </Pressable>
        <Pressable style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Text style={[styles.closeText, { color: colors.muted }]}>Close</Text>
        </Pressable>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 40
  },
  title: {
    fontFamily: typography.display,
    fontSize: 28,
    marginBottom: 8
  },
  subtitle: {
    fontFamily: typography.body,
    fontSize: 16,
    marginBottom: 18
  },
  dateInput: {
    borderRadius: borderRadius.xl,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1
  },
  dateText: {
    fontFamily: typography.body
  },
  sectionLabel: {
    fontFamily: typography.body,
    fontSize: 16,
    marginBottom: 12,
    marginTop: 18
  },
  textArea: {
    borderRadius: 20,
    minHeight: 120,
    padding: 18,
    textAlignVertical: 'top'
  },
  saveButton: {
    marginTop: 24,
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center'
  },
  saveText: {
    color: '#FFF8F5',
    fontFamily: typography.body,
    fontSize: 16,
    fontWeight: '600'
  },
  closeButton: {
    marginTop: 12,
    alignItems: 'center'
  },
  closeText: {
    fontFamily: typography.body,
    fontSize: 16
  }
});

export default DayDetailModal;
