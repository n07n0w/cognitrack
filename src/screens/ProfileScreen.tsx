import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMood } from '../context/MoodContext';

type ProfileTab = 'auth' | 'settings' | 'data';

export const ProfileScreen = () => {
  const { state } = useMood();
  const [activeTab, setActiveTab] = useState<ProfileTab>('auth');
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  
  // Settings
  const [notifications, setNotifications] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [dataSync, setDataSync] = useState(false);

  const handleAuth = () => {
    if (!email || !password) {
      Alert.alert('Missing Information', 'Please fill in all fields');
      return;
    }
    
    // Simulate authentication
    setIsLoggedIn(true);
    setUserName(email.split('@')[0]);
    Alert.alert('Success', isLogin ? 'Logged in successfully!' : 'Account created successfully!');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            setIsLoggedIn(false);
            setUserName('');
            setEmail('');
            setPassword('');
          }
        }
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      `You have ${state.entries.length} mood entries. Export as JSON?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Export', 
          onPress: () => {
            console.log('Exporting data:', state.entries);
            Alert.alert('Success', 'Data exported successfully!');
          }
        }
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your mood entries. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete All', 
          style: 'destructive',
          onPress: () => {
            // Here you would clear the data from context
            Alert.alert('Success', 'All data cleared successfully!');
          }
        }
      ]
    );
  };

  const TabButton = ({ tab, title, icon }: { 
    tab: ProfileTab; 
    title: string; 
    icon: keyof typeof Ionicons.glyphMap;
  }) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
      onPress={() => setActiveTab(tab)}
    >
      <Ionicons 
        name={icon} 
        size={20} 
        color={activeTab === tab ? '#7C4DFF' : '#666'} 
      />
      <Text style={[
        styles.tabButtonText,
        activeTab === tab && styles.tabButtonTextActive
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const SettingItem = ({ 
    title, 
    subtitle, 
    icon, 
    value, 
    onToggle, 
    type = 'switch' 
  }: {
    title: string;
    subtitle?: string;
    icon: keyof typeof Ionicons.glyphMap;
    value?: boolean;
    onToggle?: (value: boolean) => void;
    type?: 'switch' | 'button';
  }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={24} color="#7C4DFF" />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {type === 'switch' && value !== undefined && onToggle && (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: '#E0E0E0', true: '#7C4DFF' }}
          thumbColor={value ? '#fff' : '#f4f3f4'}
        />
      )}
    </View>
  );

  const renderAuthContent = () => (
    <View style={styles.tabContent}>
      {isLoggedIn ? (
        <View style={styles.userInfo}>
          <View style={styles.userAvatar}>
            <Ionicons name="person" size={48} color="#7C4DFF" />
          </View>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userEmail}>{email}</Text>
          
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <Text style={styles.authTitle}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.authButton} onPress={handleAuth}>
            <Text style={styles.authButtonText}>
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchAuthButton}
            onPress={() => setIsLogin(!isLogin)}
          >
            <Text style={styles.switchAuthButtonText}>
              {isLogin ? 'Need an account? Sign Up' : 'Have an account? Sign In'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderSettingsContent = () => (
    <View style={styles.tabContent}>
      <SettingItem
        title="Push Notifications"
        subtitle="Get notified about mood tracking reminders"
        icon="notifications"
        value={notifications}
        onToggle={setNotifications}
      />
      
      <SettingItem
        title="Daily Reminders"
        subtitle="Remind me to track my mood daily"
        icon="time"
        value={reminders}
        onToggle={setReminders}
      />
      
      <SettingItem
        title="Dark Mode"
        subtitle="Use dark theme"
        icon="moon"
        value={darkMode}
        onToggle={setDarkMode}
      />
      
      <SettingItem
        title="Cloud Sync"
        subtitle="Sync data across devices"
        icon="cloud"
        value={dataSync}
        onToggle={setDataSync}
      />
    </View>
  );

  const renderDataContent = () => (
    <View style={styles.tabContent}>
      <View style={styles.dataStats}>
        <Text style={styles.dataStatsTitle}>Your Data</Text>
        <Text style={styles.dataStatsText}>
          Total Entries: {state.entries.length}
        </Text>
        <Text style={styles.dataStatsText}>
          Storage Used: {(state.entries.length * 0.5).toFixed(1)} KB
        </Text>
      </View>

      <TouchableOpacity style={styles.dataButton} onPress={handleExportData}>
        <Ionicons name="download" size={20} color="#7C4DFF" />
        <Text style={styles.dataButtonText}>Export Data</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.dataButton, styles.dangerButton]} 
        onPress={handleClearData}
      >
        <Ionicons name="trash" size={20} color="#F44336" />
        <Text style={[styles.dataButtonText, styles.dangerButtonText]}>
          Clear All Data
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.tabBar}>
        <TabButton tab="auth" title="Account" icon="person" />
        <TabButton tab="settings" title="Settings" icon="settings" />
        <TabButton tab="data" title="Data" icon="folder" />
      </View>

      {activeTab === 'auth' && renderAuthContent()}
      {activeTab === 'settings' && renderSettingsContent()}
      {activeTab === 'data' && renderDataContent()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#7C4DFF',
  },
  tabButtonText: {
    color: '#666',
    fontSize: 14,
  },
  tabButtonTextActive: {
    color: '#fff',
  },
  tabContent: {
    padding: 20,
  },
  userInfo: {
    alignItems: 'center',
  },
  userAvatar: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userEmail: {
    color: '#666',
  },
  logoutButton: {
    backgroundColor: '#7C4DFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  authButton: {
    backgroundColor: '#7C4DFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  authButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchAuthButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  switchAuthButtonText: {
    color: '#7C4DFF',
    fontSize: 14,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 10,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingSubtitle: {
    color: '#666',
  },
  dataStats: {
    alignItems: 'center',
    marginBottom: 20,
  },
  dataStatsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dataStatsText: {
    color: '#666',
  },
  dataButton: {
    backgroundColor: '#7C4DFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
  },
  dataButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  dangerButton: {
    backgroundColor: '#F44336',
  },
  dangerButtonText: {
    color: '#fff',
  },
}); 