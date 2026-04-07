import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import HomeScreen from '@screens/HomeScreen';
import InsightsScreen from '@screens/InsightsScreen';
import LogScreen from '@screens/LogScreen';
import SettingsScreen from '@screens/SettingsScreen';
import { borderRadius, getShadowStyle, typography, useThemeColors } from '@utils/theme';

const Tab = createBottomTabNavigator();
type TabKind = 'default' | 'primary';

const BottomTabs = () => {
  const colors = useThemeColors();
  const shellShadow = getShadowStyle(colors);

  const renderTab = (icon: keyof typeof Ionicons.glyphMap, label: string, kind: TabKind = 'default') => ({ focused }: { focused: boolean }) => {
    const isPrimary = kind === 'primary';

    return (
      <View style={styles.tabItem}>
        {focused && !isPrimary ? <View style={[styles.activeDot, { backgroundColor: colors.primary }]} /> : <View style={styles.dotSpacer} />}
        <View
          style={[
            styles.iconWrap,
            isPrimary
              ? [styles.primaryWrap, { backgroundColor: focused ? colors.primary : colors.accent }]
              : [
                  styles.defaultWrap,
                  { backgroundColor: focused ? colors.surfaceWarm : colors.surfaceSoft, borderColor: focused ? colors.primary : colors.border }
                ]
          ]}
        >
          <Ionicons
            name={icon}
            size={isPrimary ? 22 : 18}
            color={isPrimary ? colors.surface : focused ? colors.primary : colors.muted}
          />
        </View>
        <Text
          style={[
            styles.tabText,
            { color: isPrimary ? colors.text : focused ? colors.text : colors.muted },
            isPrimary && styles.primaryTabText
          ]}
        >
          {label}
        </Text>
      </View>
    );
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: [
          styles.tabBar,
          shellShadow,
          {
            backgroundColor: colors.surface,
            borderTopColor: colors.border
          }
        ]
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: renderTab('home', 'Home') }} />
      <Tab.Screen name="Insights" component={InsightsScreen} options={{ tabBarIcon: renderTab('analytics', 'Insights') }} />
      <Tab.Screen name="Log" component={LogScreen} options={{ tabBarIcon: renderTab('add', 'Check-in', 'primary') }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarIcon: renderTab('person', 'You') }} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 14,
    height: 82,
    borderTopWidth: 0,
    borderRadius: 30,
    paddingTop: 8,
    paddingBottom: 10
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 68
  },
  dotSpacer: {
    height: 8,
    marginBottom: 2
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginBottom: 4
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6
  },
  defaultWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1
  },
  primaryWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginTop: -12
  },
  tabText: {
    fontFamily: typography.body,
    fontSize: 11,
    fontWeight: '600'
  },
  primaryTabText: {
    fontSize: 12
  }
});

export default BottomTabs;
