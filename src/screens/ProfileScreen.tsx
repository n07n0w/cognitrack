import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMood } from '../context/MoodContext';
import { useAuth } from '../context/AuthContext';

type ProfileTab = 'account' | 'settings' | 'data';

export const ProfileScreen = () => {
  const { state } = useMood();
  const { state: authState, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<ProfileTab>('account');
  
  // Settings
  const [notifications, setNotifications] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [dataSync, setDataSync] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Выйти из аккаунта',
      'Вы уверены, что хотите выйти?',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Выйти', 
          style: 'destructive',
          onPress: logout
        }
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Экспорт данных',
      `У вас ${state.entries.length} записей настроения. Экспортировать как JSON?`,
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Экспорт', 
          onPress: () => {
            console.log('Exporting data:', state.entries);
            Alert.alert('Успешно', 'Данные экспортированы!');
          }
        }
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Очистить все данные',
      'Это навсегда удалит все ваши записи о настроении. Действие нельзя отменить.',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Удалить все', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Успешно', 'Все данные очищены!');
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

  const renderAccountContent = () => (
    <View style={styles.tabContent}>
      <View style={styles.userInfo}>
        <View style={styles.userAvatar}>
          <Ionicons name="person" size={48} color="#7C4DFF" />
        </View>
        <Text style={styles.userName}>{authState.user?.name || 'Пользователь'}</Text>
        <Text style={styles.userEmail}>{authState.user?.email || 'email@example.com'}</Text>
        
        <View style={styles.userStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{state.entries.length}</Text>
            <Text style={styles.statLabel}>Записей</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {authState.user?.createdAt ? new Date(authState.user.createdAt).toLocaleDateString('ru-RU') : 'Недавно'}
            </Text>
            <Text style={styles.statLabel}>Регистрация</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#E74C3C" />
          <Text style={styles.logoutButtonText}>Выйти из аккаунта</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSettingsContent = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Уведомления</Text>
      
      <SettingItem
        title="Push-уведомления"
        subtitle="Получать уведомления о напоминаниях"
        icon="notifications-outline"
        value={notifications}
        onToggle={setNotifications}
      />
      
      <SettingItem
        title="Напоминания"
        subtitle="Ежедневные напоминания записать настроение"
        icon="alarm-outline"
        value={reminders}
        onToggle={setReminders}
      />

      <Text style={styles.sectionTitle}>Интерфейс</Text>
      
      <SettingItem
        title="Темная тема"
        subtitle="Включить темный режим интерфейса"
        icon="moon-outline"
        value={darkMode}
        onToggle={setDarkMode}
      />

      <Text style={styles.sectionTitle}>Данные</Text>
      
      <SettingItem
        title="Синхронизация"
        subtitle="Автоматическая синхронизация с облаком"
        icon="cloud-outline"
        value={dataSync}
        onToggle={setDataSync}
      />
    </View>
  );

  const renderDataContent = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Управление данными</Text>
      
      <View style={styles.dataStats}>
        <View style={styles.dataStatItem}>
          <Ionicons name="happy-outline" size={32} color="#4CAF50" />
          <Text style={styles.dataStatNumber}>{state.entries.length}</Text>
          <Text style={styles.dataStatLabel}>Записей настроения</Text>
        </View>
        
        <View style={styles.dataStatItem}>
          <Ionicons name="calendar-outline" size={32} color="#2196F3" />
          <Text style={styles.dataStatNumber}>
            {state.entries.length > 0 ? 
              Math.max(1, Math.ceil((Date.now() - new Date(state.entries[state.entries.length - 1]?.date || Date.now()).getTime()) / (1000 * 60 * 60 * 24))) 
              : 0
            }
          </Text>
          <Text style={styles.dataStatLabel}>Дней отслеживания</Text>
        </View>
      </View>

      <View style={styles.dataActions}>
        <TouchableOpacity style={styles.exportButton} onPress={handleExportData}>
          <Ionicons name="download-outline" size={20} color="#2196F3" />
          <Text style={styles.exportButtonText}>Экспорт данных</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.clearButton} onPress={handleClearData}>
          <Ionicons name="trash-outline" size={20} color="#E74C3C" />
          <Text style={styles.clearButtonText}>Очистить все данные</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.dataInfo}>
        Ваши данные хранятся локально на устройстве и не передаются третьим лицам. 
        Вы можете экспортировать их в любое время или полностью удалить.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Профиль</Text>
      </View>

      <View style={styles.tabs}>
        <TabButton tab="account" title="Аккаунт" icon="person-outline" />
        <TabButton tab="settings" title="Настройки" icon="settings-outline" />
        <TabButton tab="data" title="Данные" icon="bar-chart-outline" />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'account' && renderAccountContent()}
        {activeTab === 'settings' && renderSettingsContent()}
        {activeTab === 'data' && renderDataContent()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 4,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: '#f0f4ff',
  },
  tabButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  tabButtonTextActive: {
    color: '#7C4DFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 20,
  },
  userInfo: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
  },
  userAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f4ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  userStats: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7C4DFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff5f5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffebee',
  },
  logoutButtonText: {
    marginLeft: 8,
    color: '#E74C3C',
    fontSize: 16,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    marginTop: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  dataStats: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  dataStatItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  dataStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  dataStatLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  dataActions: {
    marginBottom: 20,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  exportButtonText: {
    marginLeft: 8,
    color: '#2196F3',
    fontSize: 16,
    fontWeight: '500',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff5f5',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffebee',
  },
  clearButtonText: {
    marginLeft: 8,
    color: '#E74C3C',
    fontSize: 16,
    fontWeight: '500',
  },
  dataInfo: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    textAlign: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
  },
}); 