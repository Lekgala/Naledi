import AsyncStorage from '@react-native-async-storage/async-storage';
import { CycleEntry, UserSettings } from '@models/models';

const ENTRIES_KEY = '@cycle_entries_v1';
const SETTINGS_KEY = '@user_settings_v1';

const defaultSettings: UserSettings = {
  name: '',
  avgCycleLength: 28,
  avgPeriodLength: 5,
  notificationsEnabled: true,
  reminderTime: '20:00',
  theme: 'light',
  onboardingComplete: false
};

export const loadEntries = async (): Promise<CycleEntry[]> => {
  const value = await AsyncStorage.getItem(ENTRIES_KEY);
  if (!value) return [];
  try {
    return JSON.parse(value) as CycleEntry[];
  } catch {
    return [];
  }
};

export const saveEntries = async (entries: CycleEntry[]) => {
  await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
};

export const loadSettings = async (): Promise<UserSettings> => {
  const value = await AsyncStorage.getItem(SETTINGS_KEY);
  if (!value) return defaultSettings;
  try {
    return { ...defaultSettings, ...(JSON.parse(value) as Partial<UserSettings>) };
  } catch {
    return defaultSettings;
  }
};

export const saveSettings = async (settings: UserSettings) => {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const clearAllData = async () => {
  await AsyncStorage.multiRemove([ENTRIES_KEY, SETTINGS_KEY]);
};
