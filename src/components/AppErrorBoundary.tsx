import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

type AppErrorBoundaryState = {
  error: Error | null;
};

class AppErrorBoundary extends React.Component<{ children: React.ReactNode }, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = {
    error: null
  };

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error('App render error:', error);
  }

  render() {
    if (this.state.error) {
      return (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.card}>
            <Text style={styles.title}>Something is stopping the UI from loading.</Text>
            <Text style={styles.message}>{this.state.error.message || 'Unknown error'}</Text>
          </View>
        </ScrollView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#FFF8F5'
  },
  card: {
    backgroundColor: '#FFF4F2',
    borderRadius: 24,
    padding: 24
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3D2C35',
    marginBottom: 12
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    color: '#8B6D78'
  }
});

export default AppErrorBoundary;
