import { addDays, differenceInCalendarDays, endOfMonth, format, getDate, getDay, isSameDay, parseISO, startOfMonth, startOfToday } from 'date-fns';

export const normalizeDate = (value: Date | string) => {
  const date = typeof value === 'string' ? parseISO(value) : value;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export const formatISO = (date: Date | string) => {
  const normalized = normalizeDate(date);
  return format(normalized, 'yyyy-MM-dd');
};

export const formatDayLabel = (date: Date | string) => format(normalizeDate(date), 'd');
export const formatMonthYear = (date: Date | string) => format(normalizeDate(date), 'MMMM yyyy');
export const formatFriendlyDate = (date: Date | string) => format(normalizeDate(date), 'MMM d');
export const formatLongDate = (date: Date | string) => format(normalizeDate(date), 'MMMM d, yyyy');

export const getMonthDays = (date: Date | string) => {
  const start = startOfMonth(typeof date === 'string' ? parseISO(date) : date);
  const end = endOfMonth(start);
  const days: Date[] = [];
  let current = start;

  while (current <= end) {
    days.push(current);
    current = addDays(current, 1);
  }

  return days;
};

export const isToday = (date: Date | string) => isSameDay(normalizeDate(date), startOfToday());
export const daysBetween = (from: Date | string, to: Date | string) => differenceInCalendarDays(normalizeDate(to), normalizeDate(from));
export const weekdayIndex = (date: Date | string) => getDay(normalizeDate(date));
export const dateFromISO = (date: string) => normalizeDate(date);
export const getDayOfMonth = (date: Date | string) => getDate(normalizeDate(date));
