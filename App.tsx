import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import { StatusBar } from 'expo-status-bar';
import { BottomTabNavigator } from './src/navigation/BottomTabNavigator';
import { MoodProvider } from './src/context/MoodContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import AuthScreen from './src/screens/AuthScreen';
import LoadingScreen from './src/screens/LoadingScreen';

// Enable react-native-screens for better performance
enableScreens();

function AppContent() {
  const { state } = useAuth();

  if (state.isLoading) {
    return <LoadingScreen />;
  }

  if (!state.isAuthenticated) {
    return <AuthScreen />;
  }

  return (
    <MoodProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <BottomTabNavigator />
      </NavigationContainer>
    </MoodProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
} 