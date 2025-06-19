import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MoodEntry } from '../types/mood';

interface MoodEntryCardProps {
  entry: MoodEntry;
  onPress?: () => void;
  showDate?: boolean;
}

export const MoodEntryCard: React.FC<MoodEntryCardProps> = ({ 
  entry, 
  onPress,
  showDate = true 
}) => {
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        { borderLeftColor: entry.emotion.color }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.emotionContainer}>
          <Text style={styles.emotionEmoji}>{entry.emotion.emoji}</Text>
          <Text style={styles.emotionLabel}>{entry.emotion.label}</Text>
        </View>
        
        <View style={styles.metaContainer}>
          {showDate && (
            <Text style={styles.dateText}>{formatDate(entry.timestamp)}</Text>
          )}
          <View style={styles.intensityContainer}>
            <Text style={styles.intensityText}>{entry.intensity}/10</Text>
            <View style={styles.intensityBar}>
              <View 
                style={[
                  styles.intensityFill,
                  { 
                    width: `${(entry.intensity / 10) * 100}%`,
                    backgroundColor: entry.emotion.color 
                  }
                ]} 
              />
            </View>
          </View>
        </View>
      </View>

      {entry.journalText ? (
        <Text style={styles.journalText} numberOfLines={2}>
          {entry.journalText}
        </Text>
      ) : null}

      {entry.activities.length > 0 && (
        <View style={styles.activitiesContainer}>
          {entry.activities.slice(0, 3).map(activity => (
            <View key={activity.id} style={styles.activityTag}>
              <Text style={styles.activityIcon}>{activity.icon}</Text>
              <Text style={styles.activityName}>{activity.name}</Text>
            </View>
          ))}
          {entry.activities.length > 3 && (
            <Text style={styles.moreActivities}>
              +{entry.activities.length - 3} more
            </Text>
          )}
        </View>
      )}

      {entry.gratitude.length > 0 && (
        <View style={styles.gratitudeContainer}>
          <Ionicons name="heart" size={12} color="#E91E63" />
          <Text style={styles.gratitudeText}>
            {entry.gratitude.length} gratitude{entry.gratitude.length !== 1 ? 's' : ''}
          </Text>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.timeText}>{formatTime(entry.timestamp)}</Text>
        {entry.isPrivate && (
          <View style={styles.privateIndicator}>
            <Ionicons name="lock-closed" size={12} color="#666" />
            <Text style={styles.privateText}>Private</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  emotionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emotionEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  emotionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  metaContainer: {
    alignItems: 'flex-end',
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  intensityContainer: {
    alignItems: 'flex-end',
  },
  intensityText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  intensityBar: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
  },
  intensityFill: {
    height: '100%',
    borderRadius: 2,
  },
  journalText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  activitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  activityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  activityIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  activityName: {
    fontSize: 12,
    color: '#666',
  },
  moreActivities: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  gratitudeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  gratitudeText: {
    fontSize: 12,
    color: '#E91E63',
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: '#999',
  },
  privateIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  privateText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
}); 