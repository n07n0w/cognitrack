import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import { StatusBar } from 'expo-status-bar';
import { BottomTabNavigator } from './src/navigation/BottomTabNavigator';
import { MoodProvider } from './src/context/MoodContext';

// Enable react-native-screens for better performance
enableScreens();

export default function App() {
  return (
    <MoodProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <BottomTabNavigator />
      </NavigationContainer>
    </MoodProvider>
  );
} 