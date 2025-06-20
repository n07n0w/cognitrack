import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { MoodEntry } from '../types/mood';
import Colors from '../constants/colors';
import { Typography, Spacing, BorderRadius } from '../constants/styles';

interface MoodEntryCardProps {
  entry: MoodEntry;
  showDate?: boolean;
}

const EMOTIONS_MAP = {
  joy: { name: 'Радость', color: Colors.emotions.joy, icon: 'sentiment-very-satisfied' },
  gratitude: { name: 'Благодарность', color: Colors.emotions.gratitude, icon: 'favorite' },
  peace: { name: 'Спокойствие', color: Colors.emotions.peace, icon: 'spa' },
  love: { name: 'Любовь', color: Colors.emotions.love, icon: 'favorite-border' },
  hope: { name: 'Надежда', color: Colors.emotions.hope, icon: 'lightbulb-outline' },
  anxiety: { name: 'Тревога', color: Colors.emotions.anxiety, icon: 'psychology' },
  sadness: { name: 'Грусть', color: Colors.emotions.sadness, icon: 'sentiment-dissatisfied' },
  anger: { name: 'Гнев', color: Colors.emotions.anger, icon: 'sentiment-very-dissatisfied' },
  fear: { name: 'Страх', color: Colors.emotions.fear, icon: 'warning' },
};

export function MoodEntryCard({ entry, showDate = false }: MoodEntryCardProps) {
  const emotion = EMOTIONS_MAP[entry.emotion] || { 
    name: entry.emotion, 
    color: Colors.primary, 
    icon: 'sentiment-neutral' 
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Сегодня';
    if (diffDays === 2) return 'Вчера';
    if (diffDays <= 7) return `${diffDays} дня назад`;
    
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <View style={styles.container}>
      {/* Заголовок карточки */}
      <View style={styles.header}>
        <View style={styles.emotionSection}>
          <View style={[styles.emotionIcon, { backgroundColor: emotion.color + '20' }]}>
            <MaterialIcons 
              name={emotion.icon as any} 
              size={20} 
              color={emotion.color} 
            />
          </View>
          <View style={styles.emotionInfo}>
            <Text style={[Typography.bodyMedium, styles.emotionName]}>
              {emotion.name}
            </Text>
            <Text style={[Typography.bodySmall, styles.intensity]}>
              Интенсивность: {entry.intensity}/10
            </Text>
          </View>
        </View>
        
        {showDate && (
          <Text style={[Typography.bodySmall, styles.date]}>
            {formatDate(entry.date)}
          </Text>
        )}
      </View>

      {/* Заметка */}
      {entry.note && (
        <Text style={[Typography.bodyMedium, styles.note]} numberOfLines={3}>
          {entry.note}
        </Text>
      )}

      {/* Активности */}
      {entry.activities.length > 0 && (
        <View style={styles.activitiesSection}>
          <Text style={[Typography.bodySmall, styles.activitiesLabel]}>
            Активности:
          </Text>
          <View style={styles.activitiesList}>
            {entry.activities.map((activity, index) => (
              <View key={index} style={styles.activityTag}>
                <Text style={styles.activityText}>{activity}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Благодарность */}
      {entry.gratitude && (
        <View style={styles.gratitudeSection}>
          <MaterialIcons name="favorite" size={16} color={Colors.emotions.gratitude} />
          <Text style={[Typography.bodyMedium, styles.gratitudeText]} numberOfLines={2}>
            {entry.gratitude}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  emotionSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emotionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  emotionInfo: {
    flex: 1,
  },
  emotionName: {
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  intensity: {
    color: Colors.textSecondary,
  },
  date: {
    color: Colors.textLight,
    marginLeft: Spacing.md,
  },
  note: {
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  activitiesSection: {
    marginBottom: Spacing.md,
  },
  activitiesLabel: {
    color: Colors.textLight,
    marginBottom: Spacing.xs,
  },
  activitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  activityTag: {
    backgroundColor: Colors.backgroundSoft,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  activityText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  gratitudeSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.therapy.care,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  gratitudeText: {
    flex: 1,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 18,
  },
}); 