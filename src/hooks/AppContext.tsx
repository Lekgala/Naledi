import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { buildCyclePrediction, averageCycleLength, averagePeriodLength } from '@utils/prediction';
import { clearAllData as clearStorage, loadEntries, loadSettings, saveEntries, saveSettings } from '@services/storage';
import { resetNotifications } from '@services/notifications';
import { CycleEntry, CyclePrediction, UserSettings, ThemePreference } from '../types/models';

interface AppContextValue {
  entries: CycleEntry[];
  settings: UserSettings;
  prediction: CyclePrediction;
  loading: boolean;
  addEntry: (entry: CycleEntry) => Promise<void>;
  updateEntry: (entry: CycleEntry) => Promise<void>;
  saveSettings: (settings: UserSettings) => Promise<void>;
  completeOnboarding: (settings: UserSettings) => Promise<void>;
  clearAllData: () => Promise<void>;
}

const defaultValue: AppContextValue = {
  entries: [],
  settings: {
    name: '',
    avgCycleLength: 28,
    avgPeriodLength: 5,
    notificationsEnabled: true,
    reminderTime: '20:00',
    theme: 'light' as ThemePreference,
    onboardingComplete: false
  },
  prediction: {
    lastPeriodStart: undefined,
    nextPeriodStart: new Date().toISOString(),
    ovulationDate: new Date().toISOString(),
    fertileWindowStart: new Date().toISOString(),
    fertileWindowEnd: new Date().toISOString(),
    cycleDay: 1,
    daysUntilNextPeriod: 0,
    phase: 'menstrual'
  },
  loading: true,
  addEntry: async () => {},
  updateEntry: async () => {},
  saveSettings: async () => {},
  completeOnboarding: async () => {},
  clearAllData: async () => {}
};

const AppContext = createContext<AppContextValue>(defaultValue);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [entries, setEntries] = useState<CycleEntry[]>([]);
  const [settings, setSettingsState] = useState<UserSettings>(defaultValue.settings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAppData = async () => {
      try {
        const [storedEntries, storedSettings] = await Promise.all([loadEntries(), loadSettings()]);
        setEntries(storedEntries);
        setSettingsState(storedSettings);
      } catch {
        setEntries([]);
        setSettingsState(defaultValue.settings);
      } finally {
        setLoading(false);
      }
    };
    loadAppData();
  }, []);

  const prediction = useMemo(() => buildCyclePrediction(settings, entries), [settings, entries]);

  useEffect(() => {
    if (!loading) {
      resetNotifications(settings, prediction).catch(() => null);
    }
  }, [loading, settings, prediction]);

  const persistEntries = async (updatedEntries: CycleEntry[]) => {
    await saveEntries(updatedEntries);
    setEntries(updatedEntries);
  };

  const addEntry = async (entry: CycleEntry) => {
    const updated = [entry, ...entries.filter((item) => item.id !== entry.id)];
    await persistEntries(updated);
  };

  const updateEntry = async (entry: CycleEntry) => {
    const updated = entries.map((item) => (item.id === entry.id ? entry : item));
    await persistEntries(updated);
  };

  const saveSettingsHandler = async (newSettings: UserSettings) => {
    await saveSettings(newSettings);
    setSettingsState(newSettings);
  };

  const completeOnboarding = async (newSettings: UserSettings) => {
    const result = { ...newSettings, onboardingComplete: true };
    await saveSettings(result);
    setSettingsState(result);
  };

  const clearAllData = async () => {
    await clearStorage();
    setEntries([]);
    setSettingsState(defaultValue.settings);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF8F5' }}>
        <ActivityIndicator size="large" color="#E8789A" />
      </View>
    );
  }

  return (
    <AppContext.Provider value={{ entries, settings, prediction, loading, addEntry, updateEntry, saveSettings: saveSettingsHandler, completeOnboarding, clearAllData }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
