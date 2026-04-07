import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useAppContext } from '../hooks/AppContext';
import { darkPalette, lightPalette } from '../utils/theme';
import BottomTabs from './BottomTabs';
import DayDetailModal from '@screens/DayDetailModal';
import OnboardingStack from '@screens/Onboarding/OnboardingStack';
import LegalDocumentScreen from '@screens/LegalDocumentScreen';

export type RootStackParamList = {
  Main: undefined;
  Onboarding: undefined;
  DayDetailModal: { date: string } | undefined;
  LegalDocument: { document: 'privacy' | 'terms' };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { settings } = useAppContext();
  const theme = settings.theme === 'dark' ? DarkTheme : DefaultTheme;
  const colors = settings.theme === 'dark' ? darkPalette : lightPalette;

  return (
    <NavigationContainer
      theme={{
        ...theme,
        colors: {
          ...theme.colors,
          background: colors.background,
          card: colors.surface,
          text: colors.text,
          border: colors.border,
          primary: colors.primary
        }
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {settings.onboardingComplete ? (
          <Stack.Screen name="Main" component={BottomTabs} />
        ) : (
          <Stack.Screen name="Onboarding" component={OnboardingStack} />
        )}
        <Stack.Group screenOptions={{ presentation: 'modal', contentStyle: { backgroundColor: 'transparent' } }}>
          <Stack.Screen name="DayDetailModal" component={DayDetailModal} />
        </Stack.Group>
        <Stack.Screen name="LegalDocument" component={LegalDocumentScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
