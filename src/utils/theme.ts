import { ColorValue, Platform } from 'react-native';
import { useAppContext } from '@hooks/AppContext';

export const lightPalette = {
  primary: '#F35D8D',
  secondary: '#FFC8DA',
  accent: '#FF8CAF',
  background: '#FFF4F7',
  surface: '#FFFFFF',
  text: '#4D2D38',
  muted: '#A17C89',
  period: '#FB8FAF',
  predicted: '#FFE3EC',
  border: '#F8DCE5',
  shadow: '#F3D7E0',
  success: '#A8DADC',
  warning: '#F4A261',
  error: '#E76F51',
  gradientStart: '#FFDDE8',
  gradientEnd: '#FFC3D8',
  surfaceSoft: '#FFF7FA',
  surfaceWarm: '#FFF0F5'
};

export const darkPalette = {
  primary: '#FF86AB',
  secondary: '#6B4654',
  accent: '#FFA0C0',
  background: '#1A1418',
  surface: '#241C21',
  text: '#F8EDEF',
  muted: '#D0BAC2',
  period: '#E67F9D',
  predicted: '#39262F',
  border: '#413139',
  shadow: '#050405',
  success: '#8EC7C2',
  warning: '#D6945A',
  error: '#E07A68',
  gradientStart: '#35252C',
  gradientEnd: '#241A1F',
  surfaceSoft: '#2C2228',
  surfaceWarm: '#33262D'
};

export const palette = lightPalette;

export const typography = {
  display: Platform.select({
    ios: 'Georgia',
    android: 'serif',
    web: 'Georgia'
  }) as string,
  body: Platform.select({
    ios: 'Avenir Next',
    android: 'sans-serif',
    web: 'Trebuchet MS'
  }) as string,
  mono: 'Courier New'
};

export const shadowStyle: { shadowColor: ColorValue; shadowOffset: { width: number; height: number }; shadowOpacity: number; shadowRadius: number; elevation: number } = {
  shadowColor: lightPalette.text,
  shadowOffset: { width: 0, height: 14 },
  shadowOpacity: 0.08,
  shadowRadius: 28,
  elevation: 6
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 20,
  xl: 26,
  xxl: 34
};

export const useThemeColors = () => {
  const { settings } = useAppContext();
  return settings.theme === 'dark' ? darkPalette : lightPalette;
};

export const getShadowStyle = (colors: typeof lightPalette): { shadowColor: ColorValue; shadowOffset: { width: number; height: number }; shadowOpacity: number; shadowRadius: number; elevation: number } => ({
  shadowColor: colors.text,
  shadowOffset: { width: 0, height: 14 },
  shadowOpacity: 0.08,
  shadowRadius: 28,
  elevation: 6
});
