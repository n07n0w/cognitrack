import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { useMood } from '../context/MoodContext';
import { MoodEntry } from '../types/mood';
import Colors from '../constants/colors';
import { CommonStyles, Typography, Spacing, BorderRadius } from '../constants/styles';

const { width } = Dimensions.get('window');

interface EmotionData {
  id: string;
  name: string;
  color: string;
  icon: string;
}

const EMOTIONS: EmotionData[] = [
  { id: 'joy', name: 'Радость', color: Colors.emotions.joy, icon: 'sentiment-very-satisfied' },
  { id: 'gratitude', name: 'Благодарность', color: Colors.emotions.gratitude, icon: 'favorite' },
  { id: 'peace', name: 'Спокойствие', color: Colors.emotions.peace, icon: 'spa' },
  { id: 'love', name: 'Любовь', color: Colors.emotions.love, icon: 'favorite-border' },
  { id: 'hope', name: 'Надежда', color: Colors.emotions.hope, icon: 'lightbulb-outline' },
  { id: 'anxiety', name: 'Тревога', color: Colors.emotions.anxiety, icon: 'psychology' },
  { id: 'sadness', name: 'Грусть', color: Colors.emotions.sadness, icon: 'sentiment-dissatisfied' },
  { id: 'anger', name: 'Гнев', color: Colors.emotions.anger, icon: 'sentiment-very-dissatisfied' },
  { id: 'fear', name: 'Страх', color: Colors.emotions.fear, icon: 'warning' },
];

const ACTIVITIES = [
  'Работа', 'Семья', 'Друзья', 'Спорт', 'Творчество',
  'Учеба', 'Медитация', 'Прогулка', 'Музыка', 'Чтение',
];

export default function EmotionEntryScreen() {
  const { state, dispatch } = useMood();
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [intensity, setIntensity] = useState<number>(5);
  const [note, setNote] = useState<string>('');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [gratitudeNote, setGratitudeNote] = useState<string>('');
  
  // Анимации
  const fadeAnimation = new Animated.Value(0);
  const scaleAnimation = new Animated.Value(0.95);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnimation, {
        toValue: 1,
        tension: 30,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Reset form when screen focuses
      setSelectedEmotion(null);
      setIntensity(5);
      setNote('');
      setSelectedActivities([]);
      setGratitudeNote('');
    }, [])
  );

  const handleEmotionSelect = (emotionId: string) => {
    setSelectedEmotion(emotionId);
  };

  const handleActivityToggle = (activity: string) => {
    setSelectedActivities(prev => 
      prev.includes(activity)
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const handleSave = useCallback(() => {
    if (!selectedEmotion) {
      Alert.alert('Внимание', 'Пожалуйста, выберите эмоцию', [
        { text: 'Понятно', style: 'default' }
      ]);
      return;
    }

    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      emotion: selectedEmotion,
      intensity,
      note: note.trim(),
      activities: selectedActivities,
      gratitude: gratitudeNote.trim() || undefined,
    };

    dispatch({ type: 'ADD_ENTRY', payload: newEntry });
    
    Alert.alert(
      'Запись сохранена! 💜', 
      'Спасибо за то, что делитесь своими эмоциями. Это важный шаг к пониманию себя.',
      [
        { 
          text: 'Продолжить', 
          style: 'default',
          onPress: () => {
            setSelectedEmotion(null);
            setIntensity(5);
            setNote('');
            setSelectedActivities([]);
            setGratitudeNote('');
          }
        }
      ]
    );
  }, [selectedEmotion, intensity, note, selectedActivities, gratitudeNote, dispatch]);

  const selectedEmotionData = EMOTIONS.find(e => e.id === selectedEmotion);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[Colors.gradients.soft[0], Colors.gradients.soft[1]]}
        style={styles.gradient}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnimation,
                transform: [{ scale: scaleAnimation }],
              },
            ]}
          >
            {/* Заголовок */}
            <View style={styles.header}>
              <Text style={[Typography.heading2, styles.title]}>
                Как вы себя чувствуете?
              </Text>
              <Text style={[Typography.bodyMedium, styles.subtitle]}>
                Каждая эмоция важна и имеет право быть услышанной
              </Text>
            </View>

            {/* Выбор эмоции */}
            <View style={[CommonStyles.softCard, styles.emotionSection]}>
              <Text style={[Typography.heading3, styles.sectionTitle]}>
                Выберите эмоцию
              </Text>
              <View style={styles.emotionsGrid}>
                {EMOTIONS.map((emotion) => (
                  <Pressable
                    key={emotion.id}
                    style={[
                      styles.emotionButton,
                      { borderColor: emotion.color },
                      selectedEmotion === emotion.id && [
                        styles.emotionButtonSelected,
                        { backgroundColor: emotion.color }
                      ]
                    ]}
                    onPress={() => handleEmotionSelect(emotion.id)}
                  >
                    <MaterialIcons
                      name={emotion.icon as any}
                      size={24}
                      color={selectedEmotion === emotion.id ? Colors.backgroundCard : emotion.color}
                    />
                    <Text style={[
                      styles.emotionText,
                      { color: selectedEmotion === emotion.id ? Colors.backgroundCard : Colors.text }
                    ]}>
                      {emotion.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Интенсивность */}
            {selectedEmotion && (
              <Animated.View style={[CommonStyles.softCard, styles.intensitySection]}>
                <Text style={[Typography.heading3, styles.sectionTitle]}>
                  Насколько сильно? ({intensity}/10)
                </Text>
                <View style={styles.intensityContainer}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                    <Pressable
                      key={value}
                      style={[
                        styles.intensityButton,
                        {
                          backgroundColor: intensity >= value 
                            ? selectedEmotionData?.color || Colors.primary
                            : Colors.backgroundSoft
                        }
                      ]}
                      onPress={() => setIntensity(value)}
                    >
                      <Text style={[
                        styles.intensityText,
                        { 
                          color: intensity >= value 
                            ? Colors.backgroundCard 
                            : Colors.textSecondary 
                        }
                      ]}>
                        {value}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </Animated.View>
            )}

            {/* Активности */}
            <View style={[CommonStyles.softCard, styles.activitiesSection]}>
              <Text style={[Typography.heading3, styles.sectionTitle]}>
                Что происходило?
              </Text>
              <Text style={[Typography.bodySmall, styles.sectionSubtitle]}>
                Выберите активности (необязательно)
              </Text>
              <View style={styles.activitiesGrid}>
                {ACTIVITIES.map((activity) => (
                  <Pressable
                    key={activity}
                    style={[
                      styles.activityTag,
                      selectedActivities.includes(activity) && styles.activityTagSelected
                    ]}
                    onPress={() => handleActivityToggle(activity)}
                  >
                    <Text style={[
                      styles.activityText,
                      selectedActivities.includes(activity) && styles.activityTextSelected
                    ]}>
                      {activity}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Заметка */}
            <View style={[CommonStyles.softCard, styles.noteSection]}>
              <Text style={[Typography.heading3, styles.sectionTitle]}>
                Ваши мысли
              </Text>
              <Text style={[Typography.bodySmall, styles.sectionSubtitle]}>
                Поделитесь тем, что у вас на сердце
              </Text>
              <TextInput
                style={styles.noteInput}
                multiline
                numberOfLines={4}
                placeholder="Что вы чувствуете? Что хотели бы запомнить об этом моменте?"
                placeholderTextColor={Colors.textLight}
                value={note}
                onChangeText={setNote}
                maxLength={500}
              />
              <Text style={styles.characterCount}>
                {note.length}/500
              </Text>
            </View>

            {/* Благодарность */}
            <View style={[CommonStyles.softCard, styles.gratitudeSection]}>
              <Text style={[Typography.heading3, styles.sectionTitle]}>
                За что вы благодарны сегодня?
              </Text>
              <Text style={[Typography.bodySmall, styles.sectionSubtitle]}>
                Даже маленькие радости имеют значение
              </Text>
              <TextInput
                style={styles.gratitudeInput}
                multiline
                numberOfLines={3}
                placeholder="Солнечный день, улыбка друга, вкусный кофе..."
                placeholderTextColor={Colors.textLight}
                value={gratitudeNote}
                onChangeText={setGratitudeNote}
                maxLength={300}
              />
              <Text style={styles.characterCount}>
                {gratitudeNote.length}/300
              </Text>
            </View>

            {/* Кнопка сохранения */}
            <Pressable
              style={[
                styles.saveButton,
                !selectedEmotion && styles.saveButtonDisabled
              ]}
              onPress={handleSave}
              disabled={!selectedEmotion}
            >
              <LinearGradient
                colors={selectedEmotion 
                  ? [Colors.primary, Colors.primaryDark] 
                  : [Colors.textLight, Colors.textLight]
                }
                style={styles.saveButtonGradient}
              >
                <MaterialIcons 
                  name="favorite" 
                  size={20} 
                  color={Colors.backgroundCard} 
                  style={styles.saveButtonIcon}
                />
                <Text style={[Typography.buttonText, styles.saveButtonText]}>
                  Сохранить с заботой
                </Text>
              </LinearGradient>
            </Pressable>

            {/* Мотивирующий текст */}
            <Text style={[Typography.bodySmall, styles.motivationText]}>
              Каждая запись — это шаг к лучшему пониманию себя. 
              Вы молодец, что заботитесь о своём эмоциональном здоровье! 💜
            </Text>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    padding: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.sm,
    color: Colors.text,
  },
  subtitle: {
    textAlign: 'center',
    color: Colors.textSecondary,
    paddingHorizontal: Spacing.md,
  },
  emotionSection: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
    color: Colors.text,
  },
  sectionSubtitle: {
    marginBottom: Spacing.md,
    color: Colors.textLight,
  },
  emotionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  emotionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    backgroundColor: Colors.backgroundCard,
    minWidth: (width - Spacing.lg * 2 - Spacing.xxl * 2 - Spacing.md * 2) / 3,
    justifyContent: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emotionButtonSelected: {
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  emotionText: {
    marginLeft: Spacing.xs,
    fontSize: 14,
    fontWeight: '500',
  },
  intensitySection: {
    marginBottom: Spacing.lg,
  },
  intensityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  intensityButton: {
    width: (width - Spacing.lg * 2 - Spacing.xxl * 2 - Spacing.sm * 9) / 10,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  intensityText: {
    fontSize: 16,
    fontWeight: '600',
  },
  activitiesSection: {
    marginBottom: Spacing.lg,
  },
  activitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  activityTag: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.backgroundSoft,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activityTagSelected: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  activityText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  activityTextSelected: {
    color: Colors.text,
    fontWeight: '600',
  },
  noteSection: {
    marginBottom: Spacing.lg,
  },
  noteInput: {
    backgroundColor: Colors.inputBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  gratitudeSection: {
    marginBottom: Spacing.xl,
  },
  gratitudeInput: {
    backgroundColor: Colors.inputBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  characterCount: {
    textAlign: 'right',
    marginTop: Spacing.xs,
    fontSize: 12,
    color: Colors.textLight,
  },
  saveButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  saveButtonDisabled: {
    shadowOpacity: 0.1,
    elevation: 2,
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },
  saveButtonIcon: {
    marginRight: Spacing.sm,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  motivationText: {
    textAlign: 'center',
    color: Colors.textLight,
    lineHeight: 22,
    paddingHorizontal: Spacing.md,
    fontStyle: 'italic',
  },
}); 