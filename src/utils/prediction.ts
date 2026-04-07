import { addDays, differenceInCalendarDays, parseISO } from 'date-fns';
import { CycleEntry, CyclePrediction, UserSettings } from '@models/models';
import { formatFriendlyDate, formatISO, normalizeDate } from './dates';

export const DEFAULT_CYCLE_LENGTH = 28;
export const DEFAULT_PERIOD_LENGTH = 5;

export interface DailyGuidance {
  title: string;
  message: string;
  focus: string;
}

export interface ReminderItem {
  title: string;
  detail: string;
}

export interface PhasePatternInsight {
  phase: CyclePrediction['phase'];
  title: string;
  summary: string;
}

export interface TimelineItem {
  id: string;
  date: string;
  dateLabel: string;
  title: string;
  detail: string;
}

export interface PrepChecklist {
  title: string;
  intro: string;
  items: string[];
}

const symptomLabels: Record<string, string> = {
  cramps: 'Cramps',
  bloating: 'Bloating',
  breastTenderness: 'Breast tenderness',
  headache: 'Headache',
  backache: 'Backache',
  fatigue: 'Fatigue',
  happy: 'Happy',
  sad: 'Sad',
  anxious: 'Anxious',
  irritable: 'Irritable',
  energetic: 'Energetic',
  pms: 'PMS',
  acne: 'Acne',
  insomnia: 'Insomnia',
  cravings: 'Cravings'
};

export const getCycleEntriesSorted = (entries: CycleEntry[]) =>
  [...entries].sort((a, b) => (a.date < b.date ? 1 : -1));

export const getLastPeriodStart = (entries: CycleEntry[]): string | undefined => {
  const periodEntry = getCycleEntriesSorted(entries).find((entry) => entry.isPeriod && entry.flowIntensity !== 'none');
  return periodEntry?.date;
};

export const getCycleStarts = (entries: CycleEntry[]): string[] => {
  const starts: string[] = [];
  const sorted = [...entries].sort((a, b) => (a.date < b.date ? -1 : 1));

  for (const entry of sorted) {
    if (entry.isPeriod && entry.flowIntensity !== 'none') {
      const last = starts[starts.length - 1];
      if (!last || differenceInCalendarDays(parseISO(entry.date), parseISO(last)) > 10) {
        starts.push(entry.date);
      }
    }
  }

  return starts;
};

export const averageCycleLength = (entries: CycleEntry[], manualOverride: number) => {
  const starts = getCycleStarts(entries);
  if (starts.length < 2) {
    return manualOverride || DEFAULT_CYCLE_LENGTH;
  }

  const intervals = starts.slice(1).map((date, index) => differenceInCalendarDays(parseISO(date), parseISO(starts[index])));
  const average = Math.round(intervals.reduce((sum, value) => sum + value, 0) / intervals.length);
  return average || manualOverride || DEFAULT_CYCLE_LENGTH;
};

export const averagePeriodLength = (entries: CycleEntry[], manualOverride: number) => {
  if (entries.length === 0) return manualOverride || DEFAULT_PERIOD_LENGTH;
  const periodEntries = entries.filter((entry) => entry.isPeriod && entry.flowIntensity !== 'none');
  if (periodEntries.length === 0) return manualOverride || DEFAULT_PERIOD_LENGTH;

  const uniqueDates = Array.from(new Set(periodEntries.map((entry) => entry.date)));
  const average = Math.max(2, Math.round(uniqueDates.length / Math.max(1, Math.ceil(uniqueDates.length / manualOverride))));
  return manualOverride || average;
};

export const predictNextPeriodStart = (lastPeriodStart: string, avgCycleLength: number) =>
  formatISO(addDays(parseISO(lastPeriodStart), avgCycleLength));

export const getOvulationDate = (predictedPeriodStart: string) =>
  formatISO(addDays(parseISO(predictedPeriodStart), -14));

export const getFertileWindow = (lastPeriodStart: string) => {
  const start = formatISO(addDays(parseISO(lastPeriodStart), 9));
  const end = formatISO(addDays(parseISO(lastPeriodStart), 16));
  return { start, end };
};

export const getCycleDay = (lastPeriodStart: string, date: Date | string = new Date()) =>
  Math.max(1, differenceInCalendarDays(parseISO(lastPeriodStart), normalizeDate(date)) <= 0 ? differenceInCalendarDays(normalizeDate(date), parseISO(lastPeriodStart)) + 1 : 1);

const getPhase = (cycleDay: number) => {
  if (cycleDay <= 5) return 'menstrual';
  if (cycleDay <= 13) return 'follicular';
  if (cycleDay === 14) return 'ovulation';
  return 'luteal';
};

export const buildCyclePrediction = (settings: UserSettings, entries: CycleEntry[]): CyclePrediction => {
  const lastPeriodStart = settings.lastPeriodStart || getLastPeriodStart(entries);
  const effectiveCycleLength = averageCycleLength(entries, settings.avgCycleLength);
  const currentDate = formatISO(new Date());

  if (!lastPeriodStart) {
    const fallbackStart = formatISO(new Date());
    const predictedPeriodStart = predictNextPeriodStart(fallbackStart, effectiveCycleLength);
    const ovulationDate = getOvulationDate(predictedPeriodStart);
    const fertile = getFertileWindow(fallbackStart);
    return {
      lastPeriodStart: fallbackStart,
      nextPeriodStart: predictedPeriodStart,
      ovulationDate,
      fertileWindowStart: fertile.start,
      fertileWindowEnd: fertile.end,
      cycleDay: 1,
      daysUntilNextPeriod: Math.max(0, differenceInCalendarDays(parseISO(predictedPeriodStart), parseISO(currentDate))),
      phase: 'menstrual'
    };
  }

  const predictedPeriodStart = predictNextPeriodStart(lastPeriodStart, effectiveCycleLength);
  const ovulationDate = getOvulationDate(predictedPeriodStart);
  const fertile = getFertileWindow(lastPeriodStart);
  const cycleDay = getCycleDay(lastPeriodStart, currentDate);
  const daysUntilNextPeriod = Math.max(0, differenceInCalendarDays(parseISO(predictedPeriodStart), parseISO(currentDate)));

  return {
    lastPeriodStart,
    nextPeriodStart: predictedPeriodStart,
    ovulationDate,
    fertileWindowStart: fertile.start,
    fertileWindowEnd: fertile.end,
    cycleDay,
    daysUntilNextPeriod,
    phase: getPhase(cycleDay)
  };
};

export const isDateInRange = (date: string, start: string, end: string) => {
  const current = parseISO(date);
  return current >= parseISO(start) && current <= parseISO(end);
};

export const getDayLabel = (value: number) => {
  switch (value) {
    case 0:
      return 'None';
    case 1:
      return 'Spotting';
    case 2:
      return 'Light';
    case 3:
      return 'Medium';
    case 4:
      return 'Heavy';
    default:
      return 'None';
  }
};

export const getTopTrackedItems = (items: string[], limit = 3) => {
  const counts = new Map<string, number>();

  for (const item of items) {
    counts.set(item, (counts.get(item) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key, count]) => ({
      key,
      label: symptomLabels[key] ?? key,
      count
    }));
};

export const getEntryInsights = (entries: CycleEntry[]) => {
  const symptomPool = entries.flatMap((entry) => entry.symptoms);
  const moodPool = entries.flatMap((entry) => entry.mood);
  const periodDays = entries.filter((entry) => entry.isPeriod && entry.flowIntensity !== 'none').length;

  return {
    totalLogs: entries.length,
    periodDays,
    topSymptoms: getTopTrackedItems(symptomPool),
    topMoods: getTopTrackedItems(moodPool)
  };
};

const guidanceByPhase: Record<CyclePrediction['phase'], DailyGuidance> = {
  menstrual: {
    title: 'Take it softer today',
    message: 'Your body may be asking for more rest, warmth, and gentleness. Keep expectations light and check in with what feels soothing.',
    focus: 'Rest and comfort'
  },
  follicular: {
    title: 'Energy may start to lift',
    message: 'This part of your cycle can feel a little clearer and lighter. It can be a nice time to ease back into plans or routines.',
    focus: 'Fresh momentum'
  },
  ovulation: {
    title: 'You may feel more open today',
    message: 'Confidence, connection, or energy can feel a little brighter around ovulation. Follow what feels expressive and easy.',
    focus: 'Confidence and connection'
  },
  luteal: {
    title: 'Choose a gentler pace',
    message: 'The luteal phase can bring more sensitivity or lower energy. Fewer demands and a little more structure can help you feel steadier.',
    focus: 'Grounding and balance'
  }
};

export const getDailyGuidance = (entries: CycleEntry[], prediction: CyclePrediction): DailyGuidance => {
  const recentEntries = getCycleEntriesSorted(entries).slice(0, 7);
  const recentSymptoms = getTopTrackedItems(recentEntries.flatMap((entry) => entry.symptoms), 1);
  const recentMoods = getTopTrackedItems(recentEntries.flatMap((entry) => entry.mood), 1);
  const base = guidanceByPhase[prediction.phase];

  if (recentSymptoms.length > 0) {
    return {
      title: base.title,
      message: `${base.message} Naledi has gently noticed ${recentSymptoms[0].label.toLowerCase()} showing up recently, so a little extra care could go a long way.`,
      focus: `Watch for ${recentSymptoms[0].label.toLowerCase()}`
    };
  }

  if (recentMoods.length > 0) {
    return {
      title: base.title,
      message: `${base.message} Your recent check-ins have also leaned toward ${recentMoods[0].label.toLowerCase()}, which can be useful to notice as this phase unfolds.`,
      focus: `Mood: ${recentMoods[0].label}`
    };
  }

  if (prediction.daysUntilNextPeriod <= 2) {
    return {
      title: 'A softer few days ahead',
      message: 'Your next period may be close, so this can be a good moment to simplify plans and keep comfort nearby.',
      focus: 'Period prep'
    };
  }

  return base;
};

export const getTodaysReminders = (settings: UserSettings, entries: CycleEntry[], prediction: CyclePrediction): ReminderItem[] => {
  const reminders: ReminderItem[] = [];
  const today = formatISO(new Date());
  const hasTodayLog = entries.some((entry) => entry.date === today);

  if (!hasTodayLog) {
    reminders.push({
      title: 'Check in today',
      detail: `A quick note now helps Naledi learn your rhythm more personally. Your reminder time is ${settings.reminderTime}.`
    });
  }

  if (prediction.daysUntilNextPeriod <= 2) {
    reminders.push({
      title: 'Keep comfort nearby',
      detail: 'Your next period may be close, so this is a good day to keep a few comforting essentials within reach.'
    });
  }

  if (prediction.phase === 'ovulation') {
    reminders.push({
      title: 'Notice what feels bright',
      detail: 'Energy and connection can feel a little lighter around ovulation, so it is a lovely time to check in with your mood.'
    });
  }

  if (prediction.phase === 'luteal') {
    reminders.push({
      title: 'Choose the gentler version',
      detail: 'A little more rest, structure, or quiet can make the luteal phase feel easier to move through.'
    });
  }

  if (reminders.length === 0) {
    reminders.push({
      title: 'You are already in sync',
      detail: 'Today can stay simple. A tiny check-in and a little self-kindness are enough.'
    });
  }

  return reminders.slice(0, 2);
};

export const getPhasePatternInsight = (entries: CycleEntry[], prediction: CyclePrediction): PhasePatternInsight => {
  const relevantEntries = entries.filter((entry) => {
    if (!entry.isPeriod && entry.flowIntensity === 'none' && entry.symptoms.length === 0 && entry.mood.length === 0) {
      return false;
    }
    return true;
  });

  const symptomPool = relevantEntries.flatMap((entry) => entry.symptoms);
  const topSymptoms = getTopTrackedItems(symptomPool, 2);

  if (topSymptoms.length > 0) {
    const joined = topSymptoms.map((item) => item.label.toLowerCase()).join(' and ');
    return {
      phase: prediction.phase,
      title: 'Patterns in this phase',
      summary: `During your ${prediction.phase} phase, ${joined} have shown up most often in your recent logs.`
    };
  }

  return {
    phase: prediction.phase,
    title: 'Patterns in this phase',
    summary: `As you keep logging through your ${prediction.phase} phase, Naledi will start bringing a little more clarity to the symptoms and moods that appear most often here.`
  };
};

export const getRecentTimeline = (entries: CycleEntry[], limit = 5): TimelineItem[] => {
  return getCycleEntriesSorted(entries)
    .slice(0, limit)
    .map((entry) => {
      const symptom = getTopTrackedItems(entry.symptoms, 1)[0]?.label;
      const mood = getTopTrackedItems(entry.mood, 1)[0]?.label;
      const flow = entry.isPeriod ? getDayLabel(['none', 'spotting', 'light', 'medium', 'heavy'].indexOf(entry.flowIntensity)) : undefined;

      const title = entry.isPeriod && flow && flow !== 'None'
        ? `${flow} flow day`
        : mood
          ? `${mood} check-in`
          : symptom
            ? `${symptom} noted`
            : 'Daily check-in';

      const detailParts = [symptom, mood, entry.notes ? 'Notes added' : undefined].filter(Boolean) as string[];

      return {
        id: entry.id,
        date: entry.date,
        dateLabel: formatFriendlyDate(entry.date),
        title,
        detail: detailParts.length > 0 ? detailParts.join(' • ') : 'A small update saved for this day.'
      };
    });
};

export const getPeriodPrepChecklist = (prediction: CyclePrediction): PrepChecklist | null => {
  if (prediction.daysUntilNextPeriod > 5 && prediction.phase !== 'luteal') {
    return null;
  }

  if (prediction.daysUntilNextPeriod <= 1) {
    return {
      title: 'A little period prep',
      intro: 'Your period may be very close, so keeping a few comforting basics nearby could make the next day feel easier.',
      items: [
        'Keep period products within reach',
        'Choose comfort-first plans where you can',
        'Have water, warmth, or a small snack nearby'
      ]
    };
  }

  if (prediction.daysUntilNextPeriod <= 3) {
    return {
      title: 'A softer few days ahead',
      intro: 'This is a nice moment to make the next few days feel gentler and easier on yourself.',
      items: [
        'Restock anything you usually reach for',
        'Leave extra room in your schedule if you can',
        'Notice cravings, energy, or tenderness early'
      ]
    };
  }

  return {
    title: 'Luteal phase prep',
    intro: 'Your body may appreciate a little extra steadiness right now, even before your period is close.',
    items: [
      'Pick the gentler version of your routine',
      'Keep snacks, water, and rest easy to reach',
      'Check in with your mood before the day gets busy'
    ]
  };
};





