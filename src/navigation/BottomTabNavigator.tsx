import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import EmotionEntryScreen from '../screens/EmotionEntryScreen';
import PerformanceScreen from '../screens/PerformanceScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import Colors from '../constants/colors';
import { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

export const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof MaterialIcons.glyphMap;

          if (route.name === 'Today') {
            iconName = focused ? 'edit' : 'edit';
          } else if (route.name === 'Performance') {
            iconName = focused ? 'analytics' : 'analytics';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person';
          } else {
            iconName = 'help';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          paddingTop: 5,
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen 
        name="Today" 
        component={EmotionEntryScreen}
        options={{
          tabBarLabel: 'Today',
        }}
      />
      <Tab.Screen 
        name="Performance" 
        component={PerformanceScreen}
        options={{
          tabBarLabel: 'Analytics',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}; 