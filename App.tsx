import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppErrorBoundary from '@components/AppErrorBoundary';
import { AppProvider } from '@hooks/AppContext';
import AppNavigator from '@navigation/AppNavigator';

export default function App() {
  return (
    <View style={styles.container}>
      <SafeAreaProvider>
        <AppProvider>
          <AppErrorBoundary>
            <AppNavigator />
          </AppErrorBoundary>
          <StatusBar style="dark" />
        </AppProvider>
      </SafeAreaProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F5'
  }
});
