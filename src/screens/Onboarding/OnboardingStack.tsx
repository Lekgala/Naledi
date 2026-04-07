import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import WelcomeScreen from './WelcomeScreen';
import LastPeriodScreen from './LastPeriodScreen';
import CycleLengthScreen from './CycleLengthScreen';
import PeriodLengthScreen from './PeriodLengthScreen';
import { UserSettings } from '@models/models';

export type OnboardingData = Partial<UserSettings>;

export type OnboardingStackParamList = {
  Welcome: undefined;
  LastPeriod: undefined;
  CycleLength: undefined;
  PeriodLength: undefined;
};

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

const OnboardingStack = () => {
  const [draftSettings, setDraftSettings] = useState<OnboardingData>({ avgCycleLength: 28, avgPeriodLength: 5, reminderTime: '20:00', notificationsEnabled: true, theme: 'light' });

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Welcome"
        children={(props) => (
          <WelcomeScreen {...props} onUpdate={(values) => setDraftSettings((prev) => ({ ...prev, ...values }))} />
        )}
      />
      <Stack.Screen
        name="LastPeriod"
        children={(props) => (
          <LastPeriodScreen {...props} draftSettings={draftSettings} onUpdate={(values) => setDraftSettings((prev) => ({ ...prev, ...values }))} />
        )}
      />
      <Stack.Screen
        name="CycleLength"
        children={(props) => (
          <CycleLengthScreen {...props} draftSettings={draftSettings} onUpdate={(values) => setDraftSettings((prev) => ({ ...prev, ...values }))} />
        )}
      />
      <Stack.Screen
        name="PeriodLength"
        children={(props) => <PeriodLengthScreen {...props} draftSettings={draftSettings} onUpdate={(values) => setDraftSettings((prev) => ({ ...prev, ...values }))} />}
      />
    </Stack.Navigator>
  );
};

export default OnboardingStack;
