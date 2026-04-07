export type FlowIntensity = 'none' | 'spotting' | 'light' | 'medium' | 'heavy';
export type DischargeType = 'none' | 'spotting' | 'creamy' | 'watery' | 'eggWhite';
export type ThemePreference = 'light' | 'dark';

export type SymptomKey =
  | 'cramps'
  | 'bloating'
  | 'breastTenderness'
  | 'headache'
  | 'backache'
  | 'fatigue'
  | 'happy'
  | 'sad'
  | 'anxious'
  | 'irritable'
  | 'energetic'
  | 'pms'
  | 'acne'
  | 'insomnia'
  | 'cravings';

export interface CycleEntry {
  id: string;
  date: string;
  isPeriod: boolean;
  flowIntensity: FlowIntensity;
  symptoms: SymptomKey[];
  mood: SymptomKey[];
  discharge: DischargeType;
  notes: string;
  createdAt: string;
}

export interface UserSettings {
  name: string;
  dateOfBirth?: string;
  avgCycleLength: number;
  avgPeriodLength: number;
  notificationsEnabled: boolean;
  reminderTime: string;
  theme: ThemePreference;
  onboardingComplete: boolean;
  lastPeriodStart?: string;
}

export interface CyclePrediction {
  lastPeriodStart?: string;
  nextPeriodStart: string;
  ovulationDate: string;
  fertileWindowStart: string;
  fertileWindowEnd: string;
  cycleDay: number;
  daysUntilNextPeriod: number;
  phase: 'menstrual' | 'follicular' | 'ovulation' | 'luteal';
}

export interface CalendarDay {
  date: string;
  display: string;
  isToday: boolean;
  isCurrentMonth: boolean;
  isPeriod: boolean;
  isPredicted: boolean;
  isFertile: boolean;
  isOvulation: boolean;
  flowIntensity: FlowIntensity;
}
