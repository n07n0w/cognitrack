import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useMood } from '../context/MoodContext';
import Colors from '../constants/colors';
import { CommonStyles, Typography, Spacing, BorderRadius } from '../constants/styles';

const { width } = Dimensions.get('window');

type TimeRange = 'week' | 'month' | 'year';

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

interface StatCard {
  title: string;
  value: string;
  subtitle?: string;
  color: string;
  icon: string;
}

export default function PerformanceScreen() {
  const { state } = useMood();
  const [selectedRange, setSelectedRange] = useState<TimeRange>('week');
  const fadeAnimation = new Animated.Value(1);

  // Фильтрация записей по выбранному периоду
  const filteredEntries = useMemo(() => {
    const now = new Date();
    const cutoff = new Date();
    
    switch (selectedRange) {
      case 'week':
        cutoff.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoff.setDate(now.getDate() - 30);
        break;
      case 'year':
        cutoff.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    return state.entries.filter(entry => new Date(entry.date) >= cutoff);
  }, [state.entries, selectedRange]);

  // Вычисление статистики
  const stats = useMemo(() => {
    if (filteredEntries.length === 0) {
      return {
        averageIntensity: 0,
        totalEntries: 0,
        mostCommonEmotion: null,
        moodTrend: 'stable',
        topActivities: [],
      };
    }

    const averageIntensity = filteredEntries.reduce((sum, entry) => sum + entry.intensity, 0) / filteredEntries.length;
    
    // Подсчет эмоций
    const emotionCounts = filteredEntries.reduce((acc, entry) => {
      acc[entry.emotion] = (acc[entry.emotion] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostCommonEmotion = Object.entries(emotionCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || null;

    // Подсчет активностей
    const activityCounts = filteredEntries.reduce((acc, entry) => {
      entry.activities.forEach(activity => {
        acc[activity] = (acc[activity] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    const topActivities = Object.entries(activityCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([activity, count]) => ({ activity, count }));

    return {
      averageIntensity,
      totalEntries: filteredEntries.length,
      mostCommonEmotion,
      moodTrend: averageIntensity > 6 ? 'positive' : averageIntensity < 4 ? 'needs_attention' : 'stable',
      topActivities,
    };
  }, [filteredEntries]);

  const generateStatCards = (): StatCard[] => {
    const cards: StatCard[] = [
      {
        title: 'Записей',
        value: stats.totalEntries.toString(),
        subtitle: `за ${selectedRange === 'week' ? 'неделю' : selectedRange === 'month' ? 'месяц' : 'год'}`,
        color: Colors.primary,
        icon: 'event-note',
      },
      {
        title: 'Средняя интенсивность',
        value: stats.averageIntensity.toFixed(1),
        subtitle: 'из 10',
        color: stats.moodTrend === 'positive' ? Colors.success : stats.moodTrend === 'needs_attention' ? Colors.warning : Colors.info,
        icon: 'trending-up',
      },
    ];

    if (stats.mostCommonEmotion && EMOTIONS_MAP[stats.mostCommonEmotion]) {
      cards.push({
        title: 'Частая эмоция',
        value: EMOTIONS_MAP[stats.mostCommonEmotion].name,
        color: EMOTIONS_MAP[stats.mostCommonEmotion].color,
        icon: EMOTIONS_MAP[stats.mostCommonEmotion].icon,
      });
    }

    return cards;
  };

  const getMoodTrendMessage = () => {
    if (stats.totalEntries === 0) {
      return {
        message: 'Начните записывать свои эмоции, чтобы увидеть статистику',
        color: Colors.textSecondary,
        icon: 'psychology',
      };
    }

    switch (stats.moodTrend) {
      case 'positive':
        return {
          message: 'Вы на правильном пути! Продолжайте заботиться о себе',
          color: Colors.success,
          icon: 'sentiment-very-satisfied',
        };
      case 'needs_attention':
        return {
          message: 'Возможно, стоит обратить внимание на своё самочувствие',
          color: Colors.warning,
          icon: 'psychology',
        };
      default:
        return {
          message: 'Ваше эмоциональное состояние стабильно',
          color: Colors.info,
          icon: 'sentiment-satisfied',
        };
    }
  };

  const trendInfo = getMoodTrendMessage();
  const statCards = generateStatCards();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[Colors.gradients.calm[0], Colors.gradients.calm[1]]}
        style={styles.gradient}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Заголовок */}
          <View style={styles.header}>
            <Text style={[Typography.heading2, styles.title]}>
              Аналитика эмоций
            </Text>
            <Text style={[Typography.bodyMedium, styles.subtitle]}>
              Понять себя — первый шаг к внутренней гармонии
            </Text>
          </View>

          {/* Переключатель периода */}
          <View style={[CommonStyles.softCard, styles.rangeSelector]}>
            <Text style={[Typography.heading3, styles.sectionTitle]}>
              Период анализа
            </Text>
            <View style={styles.rangeButtons}>
              {([
                { key: 'week' as TimeRange, label: 'Неделя' },
                { key: 'month' as TimeRange, label: 'Месяц' },
                { key: 'year' as TimeRange, label: 'Год' },
              ]).map(({ key, label }) => (
                <Pressable
                  key={key}
                  style={[
                    styles.rangeButton,
                    selectedRange === key && styles.rangeButtonActive
                  ]}
                  onPress={() => setSelectedRange(key)}
                >
                  <Text style={[
                    styles.rangeButtonText,
                    selectedRange === key && styles.rangeButtonTextActive
                  ]}>
                    {label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Карточки статистики */}
          <View style={styles.statsGrid}>
            {statCards.map((card, index) => (
              <View key={index} style={[CommonStyles.softCard, styles.statCard]}>
                <View style={styles.statCardHeader}>
                  <MaterialIcons 
                    name={card.icon as any} 
                    size={24} 
                    color={card.color} 
                  />
                  <Text style={[Typography.heading3, { color: card.color }]}>
                    {card.value}
                  </Text>
                </View>
                <Text style={[Typography.bodyMedium, styles.statCardTitle]}>
                  {card.title}
                </Text>
                {card.subtitle && (
                  <Text style={[Typography.bodySmall, styles.statCardSubtitle]}>
                    {card.subtitle}
                  </Text>
                )}
              </View>
            ))}
          </View>

          {/* Анализ настроения */}
          <View style={[CommonStyles.softCard, styles.moodTrendCard]}>
            <View style={styles.moodTrendHeader}>
              <MaterialIcons 
                name={trendInfo.icon as any} 
                size={32} 
                color={trendInfo.color} 
              />
              <Text style={[Typography.heading3, styles.moodTrendTitle]}>
                Анализ вашего состояния
              </Text>
            </View>
            <Text style={[Typography.bodyLarge, { color: trendInfo.color }]}>
              {trendInfo.message}
            </Text>
          </View>

          {/* Топ активности */}
          {stats.topActivities.length > 0 && (
            <View style={[CommonStyles.softCard, styles.activitiesCard]}>
              <Text style={[Typography.heading3, styles.sectionTitle]}>
                Популярные активности
              </Text>
              <View style={styles.activitiesList}>
                {stats.topActivities.map(({ activity, count }, index) => (
                  <View key={activity} style={styles.activityItem}>
                    <View style={styles.activityRank}>
                      <Text style={styles.activityRankText}>
                        {index + 1}
                      </Text>
                    </View>
                    <View style={styles.activityInfo}>
                      <Text style={[Typography.bodyMedium, styles.activityName]}>
                        {activity}
                      </Text>
                      <Text style={[Typography.bodySmall, styles.activityCount]}>
                        {count} {count === 1 ? 'раз' : 'раза'}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Мотивирующее сообщение */}
          <View style={[CommonStyles.softCard, styles.motivationCard]}>
            <MaterialIcons name="favorite" size={24} color={Colors.secondary} />
            <Text style={[Typography.bodyMedium, styles.motivationText]}>
              Каждый день — это новая возможность позаботиться о себе. 
              Вы уже сделали важный шаг, начав отслеживать свои эмоции! 💜
            </Text>
          </View>
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
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
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
  rangeSelector: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
    color: Colors.text,
  },
  rangeButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  rangeButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.backgroundSoft,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  rangeButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  rangeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  rangeButtonTextActive: {
    color: Colors.backgroundCard,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    minWidth: (width - Spacing.lg * 2 - Spacing.md) / 2,
    alignItems: 'center',
  },
  statCardHeader: {
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statCardTitle: {
    textAlign: 'center',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  statCardSubtitle: {
    textAlign: 'center',
    color: Colors.textLight,
  },
  moodTrendCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  moodTrendHeader: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  moodTrendTitle: {
    marginTop: Spacing.sm,
    textAlign: 'center',
    color: Colors.text,
  },
  activitiesCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  activitiesList: {
    gap: Spacing.md,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  activityRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  activityRankText: {
    color: Colors.backgroundCard,
    fontSize: 14,
    fontWeight: '600',
  },
  activityInfo: {
    flex: 1,
  },
  activityName: {
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  activityCount: {
    color: Colors.textLight,
  },
  motivationCard: {
    marginHorizontal: Spacing.lg,
    alignItems: 'center',
    backgroundColor: Colors.therapy.care,
  },
  motivationText: {
    textAlign: 'center',
    color: Colors.textSecondary,
    marginTop: Spacing.md,
    lineHeight: 22,
    fontStyle: 'italic',
  },
}); 