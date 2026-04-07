import { averageCycleLength, averagePeriodLength, buildCyclePrediction, getCycleStarts, predictNextPeriodStart } from '@utils/prediction';
import { CycleEntry, UserSettings } from '@models/models';

describe('cycle prediction utils', () => {
  const entries: CycleEntry[] = [
    { id: '1', date: '2026-02-01', isPeriod: true, flowIntensity: 'medium', symptoms: [], mood: [], discharge: 'creamy', notes: '', createdAt: '2026-02-01T08:00:00.000Z' },
    { id: '2', date: '2026-03-01', isPeriod: true, flowIntensity: 'light', symptoms: [], mood: [], discharge: 'watery', notes: '', createdAt: '2026-03-01T08:00:00.000Z' },
    { id: '3', date: '2026-03-28', isPeriod: true, flowIntensity: 'heavy', symptoms: [], mood: [], discharge: 'spotting', notes: '', createdAt: '2026-03-28T08:00:00.000Z' }
  ];

  const settings: UserSettings = {
    name: 'Ava',
    avgCycleLength: 28,
    avgPeriodLength: 5,
    notificationsEnabled: true,
    reminderTime: '20:00',
    theme: 'light',
    onboardingComplete: true,
    lastPeriodStart: '2026-03-28'
  };

  it('calculates average cycle length from past period starts', () => {
    expect(averageCycleLength(entries, 28)).toBe(28);
  });

  it('uses manual override when there is not enough history', () => {
    expect(averageCycleLength(entries.slice(0, 1), 30)).toBe(30);
  });

  it('calculates average period length fallback', () => {
    expect(averagePeriodLength(entries, 6)).toBe(6);
  });

  it('predicts the next period start correctly', () => {
    expect(predictNextPeriodStart('2026-03-28', 28)).toBe('2026-04-25');
  });

  it('builds a valid cycle prediction object', () => {
    const prediction = buildCyclePrediction(settings, entries);
    expect(prediction.nextPeriodStart).toBe('2026-04-25');
    expect(prediction.ovulationDate).toBe('2026-04-11');
    expect(prediction.phase).toBeDefined();
    expect(getCycleStarts(entries)).toContain('2026-03-28');
  });
});
