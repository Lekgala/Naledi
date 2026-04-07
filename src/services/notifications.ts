import { Platform } from 'react-native';
import { formatISO, normalizeDate } from '@utils/dates';
import { CyclePrediction, UserSettings } from '@models/models';

let cachedNotificationsModule: any | null | undefined;

const getNotificationsModule = () => {
  if (Platform.OS === 'web') {
    return null;
  }

  if (cachedNotificationsModule !== undefined) {
    return cachedNotificationsModule;
  }

  try {
    cachedNotificationsModule = require('expo-notifications');
  } catch {
    cachedNotificationsModule = null;
  }

  return cachedNotificationsModule;
};

const notificationModule = getNotificationsModule();
if (notificationModule && typeof notificationModule.setNotificationHandler === 'function') {
  notificationModule.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false
    })
  });
}

const parseTime = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  const now = new Date();
  const date = new Date(now);
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(0);
  return date;
};

export const requestNotificationPermissions = async () => {
  const Notifications = getNotificationsModule();
  if (!Notifications) return false;

  const permission = (await Notifications.getPermissionsAsync()) as any;
  const status = permission?.status ?? (permission?.granted ? 'granted' : 'denied');
  if (status !== 'granted') {
    const result = (await Notifications.requestPermissionsAsync()) as any;
    return result?.status === 'granted' || result?.granted === true;
  }
  return true;
};

export const scheduleDailyReminder = async (time: string) => {
  const Notifications = getNotificationsModule();
  if (!Notifications) return;

  const triggerDate = parseTime(time);
  if (triggerDate <= new Date()) {
    triggerDate.setDate(triggerDate.getDate() + 1);
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Daily check-in',
      body: 'Log today’s symptoms and stay in tune with your cycle.',
      sound: 'default'
    },
    trigger: triggerDate
  });
};

const scheduleEvent = async (date: string, title: string, body: string) => {
  const Notifications = getNotificationsModule();
  if (!Notifications) return;

  const scheduled = normalizeDate(date);
  const triggerDate = new Date(scheduled);
  if (triggerDate <= new Date()) return;
  await Notifications.scheduleNotificationAsync({
    content: { title, body, sound: 'default' },
    trigger: triggerDate
  });
};

export const scheduleCycleAlerts = async (prediction: CyclePrediction) => {
  const Notifications = getNotificationsModule();
  if (!Notifications) return;

  await Notifications.cancelAllScheduledNotificationsAsync();
  const nextPeriodAlert = normalizeDate(prediction.nextPeriodStart);
  const reminderDay = new Date(nextPeriodAlert);
  reminderDay.setDate(reminderDay.getDate() - 2);
  await scheduleEvent(formatISO(reminderDay), 'Period approaching', 'Your period is due soon — check your prediction and stay prepared.');
  await scheduleEvent(prediction.ovulationDate, 'Ovulation today', 'Your body may be most fertile today.');
};

export const resetNotifications = async (settings: UserSettings, prediction: CyclePrediction) => {
  const Notifications = getNotificationsModule();
  if (!Notifications) return;

  await Notifications.cancelAllScheduledNotificationsAsync();
  if (!settings.notificationsEnabled) return;
  const granted = await requestNotificationPermissions();
  if (!granted) return;
  await scheduleDailyReminder(settings.reminderTime);
  await scheduleCycleAlerts(prediction);
};
