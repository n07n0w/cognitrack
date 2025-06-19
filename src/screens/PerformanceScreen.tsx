import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMood } from '../context/MoodContext';
import { MoodEntry } from '../types/mood';

const { width } = Dimensions.get('window');

type TimeRange = 'week' | 'month' | 'year';

export const PerformanceScreen = () => {
  const { state } = useMood();
  const [selectedRange, setSelectedRange] = useState<TimeRange>('week');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => setRefreshing(false), 1000);
  };

  const filteredEntries = useMemo(() => {
    const now = new Date();
    const dateThreshold = new Date();
    
    switch (selectedRange) {
      case 'week':
        dateThreshold.setDate(now.getDate() - 7);
        break;
      case 'month':
        dateThreshold.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        dateThreshold.setFullYear(now.getFullYear() - 1);
        break;
    }

    return state.entries.filter(entry => 
      new Date(entry.timestamp) >= dateThreshold
    );
  }, [state.entries, selectedRange]);

  const analytics = useMemo(() => {
    if (filteredEntries.length === 0) {
      return {
        averageMood: 0,
        totalEntries: 0,
        streakDays: 0,
        topEmotion: null,
        topActivity: null,
        moodTrend: 'stable',
        completionRate: 0,
      };
    }

    const averageMood = filteredEntries.reduce((sum, entry) => sum + entry.intensity, 0) / filteredEntries.length;
    
    // Calculate streak (simplified)
    const streakDays = Math.min(filteredEntries.length, 7);
    
    // Find most common emotion
    const emotionCounts = filteredEntries.reduce((acc, entry) => {
      acc[entry.emotion.id] = (acc[entry.emotion.id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topEmotionId = Object.keys(emotionCounts).reduce((a, b) => 
      emotionCounts[a] > emotionCounts[b] ? a : b
    );
    const topEmotion = filteredEntries.find(entry => entry.emotion.id === topEmotionId)?.emotion;
    
    // Find most common activity
    const activityCounts = filteredEntries.reduce((acc, entry) => {
      entry.activities.forEach(activity => {
        acc[activity.id] = (acc[activity.id] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);
    
    const topActivityId = Object.keys(activityCounts).length > 0 
      ? Object.keys(activityCounts).reduce((a, b) => 
          activityCounts[a] > activityCounts[b] ? a : b
        )
      : null;
    
    const topActivity = topActivityId 
      ? filteredEntries.find(entry => 
          entry.activities.find(activity => activity.id === topActivityId)
        )?.activities.find(activity => activity.id === topActivityId)
      : null;

    // Calculate mood trend (simplified)
    const recentEntries = filteredEntries.slice(0, 3);
    const olderEntries = filteredEntries.slice(3, 6);
    
    const recentAvg = recentEntries.length > 0 
      ? recentEntries.reduce((sum, entry) => sum + entry.intensity, 0) / recentEntries.length
      : averageMood;
    
    const olderAvg = olderEntries.length > 0 
      ? olderEntries.reduce((sum, entry) => sum + entry.intensity, 0) / olderEntries.length
      : averageMood;
    
    let moodTrend = 'stable';
    if (recentAvg > olderAvg + 0.5) moodTrend = 'improving';
    else if (recentAvg < olderAvg - 0.5) moodTrend = 'declining';

    // Calculate completion rate based on expected daily entries
    const expectedEntries = selectedRange === 'week' ? 7 : selectedRange === 'month' ? 30 : 365;
    const completionRate = Math.min((filteredEntries.length / expectedEntries) * 100, 100);

    return {
      averageMood: Math.round(averageMood * 10) / 10,
      totalEntries: filteredEntries.length,
      streakDays,
      topEmotion,
      topActivity,
      moodTrend,
      completionRate: Math.round(completionRate),
    };
  }, [filteredEntries, selectedRange]);

  const TimeRangeSelector = () => (
    <View style={styles.timeRangeContainer}>
      {(['week', 'month', 'year'] as TimeRange[]).map(range => (
        <TouchableOpacity
          key={range}
          style={[
            styles.timeRangeButton,
            selectedRange === range && styles.timeRangeButtonActive
          ]}
          onPress={() => setSelectedRange(range)}
        >
          <Text style={[
            styles.timeRangeText,
            selectedRange === range && styles.timeRangeTextActive
          ]}>
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const StatCard = ({ title, value, subtitle, icon, color = '#7C4DFF' }: {
    title: string;
    value: string | number | React.ReactNode;
    subtitle?: string;
    icon: keyof typeof Ionicons.glyphMap;
    color?: string;
  }) => (
    <View style={styles.statCard}>
      <View style={styles.statHeader}>
        <Ionicons name={icon} size={24} color={color} />
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const MoodTrendIndicator = () => {
    const { moodTrend } = analytics;
    const getIcon = (): keyof typeof Ionicons.glyphMap => {
      switch (moodTrend) {
        case 'improving': return 'trending-up';
        case 'declining': return 'trending-down';
        default: return 'remove';
      }
    };
    
    const getColor = () => {
      switch (moodTrend) {
        case 'improving': return '#4CAF50';
        case 'declining': return '#F44336';
        default: return '#FF9800';
      }
    };

    return (
      <View style={styles.trendContainer}>
        <Ionicons name={getIcon()} size={20} color={getColor()} />
        <Text style={[styles.trendText, { color: getColor() }]}>
          {moodTrend.charAt(0).toUpperCase() + moodTrend.slice(1)}
        </Text>
      </View>
    );
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>Your Progress</Text>
      
      <TimeRangeSelector />
      
      <View style={styles.statsGrid}>
        <StatCard
          title="Entries"
          value={analytics.totalEntries}
          subtitle={`${analytics.completionRate}% complete`}
          icon="calendar"
        />
        
        <StatCard
          title="Avg Mood"
          value={analytics.averageMood}
          subtitle="out of 10"
          icon="happy"
          color="#4CAF50"
        />
        
        <StatCard
          title="Streak"
          value={analytics.streakDays}
          subtitle="days"
          icon="flame"
          color="#FF9800"
        />
        
        <StatCard
          title="Trend"
          value={<MoodTrendIndicator />}
          icon="analytics"
          color="#9C27B0"
        />
      </View>

      {analytics.topEmotion && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Most Common Emotion</Text>
          <View style={styles.emotionCard}>
            <Text style={styles.emotionEmoji}>{analytics.topEmotion.emoji}</Text>
            <Text style={styles.emotionLabel}>{analytics.topEmotion.label}</Text>
          </View>
        </View>
      )}

      {analytics.topActivity && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Activity</Text>
          <View style={styles.activityCard}>
            <Text style={styles.activityIcon}>{analytics.topActivity.icon}</Text>
            <Text style={styles.activityLabel}>{analytics.topActivity.name}</Text>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Insights</Text>
        {analytics.totalEntries > 0 ? (
          <>
            <View style={styles.insightCard}>
              <Ionicons name="bulb" size={20} color="#FFD700" />
              <Text style={styles.insightText}>
                {analytics.moodTrend === 'improving' 
                  ? "You're on a great streak! Keep up the good work."
                  : analytics.moodTrend === 'declining'
                  ? "Consider trying some new activities to boost your mood."
                  : "Your mood has been stable. Try tracking more activities for better insights."
                }
              </Text>
            </View>
            
            {analytics.completionRate < 50 && (
              <View style={styles.insightCard}>
                <Ionicons name="time" size={20} color="#2196F3" />
                <Text style={styles.insightText}>
                  Try to log your mood more regularly for better insights.
                </Text>
              </View>
            )}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="analytics" size={48} color="#E0E0E0" />
            <Text style={styles.emptyStateText}>No data yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Start tracking your mood to see your progress here
            </Text>
          </View>
        )}
      </View>
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
    marginBottom: 20,
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 12,
    width: '48%',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7C4DFF',
  },
  statLabel: {
    marginTop: 5,
    color: '#666',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  placeholder: {
    backgroundColor: '#f5f5f5',
    height: 200,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#666',
  },
  insightCard: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  insightText: {
    color: '#333',
    fontSize: 16,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timeRangeButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#7C4DFF',
    borderRadius: 5,
  },
  timeRangeButtonActive: {
    backgroundColor: '#7C4DFF',
  },
  timeRangeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7C4DFF',
  },
  timeRangeTextActive: {
    color: '#fff',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  statTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statSubtitle: {
    color: '#666',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  emotionCard: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  emotionEmoji: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  emotionLabel: {
    fontSize: 16,
    color: '#666',
  },
  activityCard: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  activityIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  activityLabel: {
    fontSize: 16,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptyStateSubtext: {
    color: '#666',
  },
}); 