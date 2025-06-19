import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { EMOTIONS, ACTIVITIES } from '../constants/moodData';
import { Emotion, ActivityTag, MoodEntry } from '../types/mood';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useMood } from '../context/MoodContext';
import { MoodEntryCard } from '../components/MoodEntryCard';

const { width } = Dimensions.get('window');

export const EmotionEntryScreen = () => {
  const { addEntry, state } = useMood();
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [intensity, setIntensity] = useState(5);
  const [journalText, setJournalText] = useState('');
  const [selectedActivities, setSelectedActivities] = useState<ActivityTag[]>([]);
  const [gratitude, setGratitude] = useState<string[]>(['']);
  const [isPrivate, setIsPrivate] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [isLoading, setIsLoading] = useState(false);

  const animateIn = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useFocusEffect(
    useCallback(() => {
      animateIn();
    }, [animateIn])
  );

  const handleActivityToggle = useCallback((activity: ActivityTag) => {
    setSelectedActivities(prev =>
      prev.find(a => a.id === activity.id)
        ? prev.filter(a => a.id !== activity.id)
        : [...prev, activity]
    );
  }, []);

  const handleGratitudeChange = useCallback((text: string, index: number) => {
    setGratitude(prev => {
      const newGratitude = [...prev];
      newGratitude[index] = text;
      return newGratitude;
    });
  }, []);

  const addGratitudeField = useCallback(() => {
    setGratitude(prev => [...prev, '']);
  }, []);

  const removeGratitudeField = useCallback((index: number) => {
    if (gratitude.length > 1) {
      setGratitude(prev => prev.filter((_, i) => i !== index));
    }
  }, [gratitude.length]);

  const handleSave = useCallback(async () => {
    if (!selectedEmotion) {
      Alert.alert('Missing Information', 'Please select an emotion to continue.');
      return;
    }

    setIsLoading(true);

    try {
      const entry: MoodEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        emotion: selectedEmotion,
        intensity,
        journalText,
        activities: selectedActivities,
        gratitude: gratitude.filter(g => g.trim() !== ''),
        isPrivate,
      };

      // Save to context
      addEntry(entry);
      console.log('Saved entry:', entry);
      
      Alert.alert(
        'Success!', 
        'Your mood entry has been saved successfully.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setSelectedEmotion(null);
              setIntensity(5);
              setJournalText('');
              setSelectedActivities([]);
              setGratitude(['']);
              setIsPrivate(false);
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save your entry. Please try again.');
      console.error('Save error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedEmotion, intensity, journalText, selectedActivities, gratitude, isPrivate]);

  const emotionButtons = useMemo(() => 
    EMOTIONS.map(emotion => (
      <TouchableOpacity
        key={emotion.id}
        style={[
          styles.emotionButton,
          selectedEmotion?.id === emotion.id && {
            backgroundColor: emotion.color + '20',
            borderColor: emotion.color,
          },
        ]}
        onPress={() => setSelectedEmotion(emotion)}
        activeOpacity={0.7}
      >
        <Text style={styles.emotionEmoji}>{emotion.emoji}</Text>
        <Text style={styles.emotionLabel}>{emotion.label}</Text>
      </TouchableOpacity>
    )), [selectedEmotion]
  );

  const activityButtons = useMemo(() =>
    ACTIVITIES.map(activity => (
      <TouchableOpacity
        key={activity.id}
        style={[
          styles.activityButton,
          selectedActivities.find(a => a.id === activity.id) && {
            backgroundColor: activity.color + '20',
            borderColor: activity.color,
          },
        ]}
        onPress={() => handleActivityToggle(activity)}
        activeOpacity={0.7}
      >
        <Text style={styles.activityIcon}>{activity.icon}</Text>
        <Text style={styles.activityName}>{activity.name}</Text>
      </TouchableOpacity>
    )), [selectedActivities, handleActivityToggle]
  );

  const gratitudeInputs = useMemo(() =>
    gratitude.map((item, index) => (
      <View key={index} style={styles.gratitudeInputContainer}>
        <TextInput
          style={styles.gratitudeInput}
          placeholder={`I'm grateful for...`}
          value={item}
          onChangeText={text => handleGratitudeChange(text, index)}
          multiline
        />
        {gratitude.length > 1 && (
          <TouchableOpacity
            style={styles.removeGratitudeButton}
            onPress={() => removeGratitudeField(index)}
          >
            <Ionicons name="close-circle" size={20} color="#FF5722" />
          </TouchableOpacity>
        )}
      </View>
    )), [gratitude, handleGratitudeChange, removeGratitudeField]
  );

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>How are you feeling?</Text>

        <View style={styles.emotionsContainer}>
          {emotionButtons}
        </View>

        {selectedEmotion && (
          <Animated.View style={styles.intensityContainer}>
            <Text style={styles.sectionTitle}>
              Intensity ({Math.round(intensity)}/10)
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={10}
              value={intensity}
              onValueChange={setIntensity}
              step={1}
              minimumTrackTintColor={selectedEmotion.color}
              maximumTrackTintColor="#E0E0E0"
              thumbTintColor={selectedEmotion.color}
            />
            <View style={styles.intensityLabels}>
              <Text style={styles.intensityLabel}>Low</Text>
              <Text style={styles.intensityLabel}>High</Text>
            </View>
          </Animated.View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Journal Entry</Text>
          <TextInput
            style={styles.journalInput}
            placeholder="How was your day? What's on your mind?"
            value={journalText}
            onChangeText={setJournalText}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={500}
          />
          <Text style={styles.characterCount}>
            {journalText.length}/500
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activities</Text>
          <View style={styles.activitiesContainer}>
            {activityButtons}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gratitude</Text>
          {gratitudeInputs}
          <TouchableOpacity
            style={styles.addGratitudeButton}
            onPress={addGratitudeField}
            disabled={gratitude.length >= 5}
          >
            <Ionicons name="add-circle-outline" size={24} color="#7C4DFF" />
            <Text style={styles.addGratitudeText}>
              Add more {gratitude.length >= 5 ? '(Max 5)' : ''}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.privacyContainer}>
          <View style={styles.privacyInfo}>
            <Text style={styles.privacyText}>Private Entry</Text>
            <Text style={styles.privacySubtext}>
              Only visible to you
            </Text>
          </View>
          <Switch
            value={isPrivate}
            onValueChange={setIsPrivate}
            trackColor={{ false: '#E0E0E0', true: '#7C4DFF' }}
            thumbColor={isPrivate ? '#fff' : '#f4f3f4'}
          />
        </View>

        {state.entries.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Entries</Text>
            {state.entries.slice(0, 3).map(entry => (
              <MoodEntryCard 
                key={entry.id} 
                entry={entry} 
                showDate={true}
              />
            ))}
            {state.entries.length > 3 && (
              <Text style={styles.moreEntriesText}>
                +{state.entries.length - 3} more entries in Analytics
              </Text>
            )}
          </View>
        )}

        <TouchableOpacity 
          style={[
            styles.saveButton,
            (!selectedEmotion || isLoading) && styles.saveButtonDisabled
          ]} 
          onPress={handleSave}
          disabled={!selectedEmotion || isLoading}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.saveButtonText,
            (!selectedEmotion || isLoading) && styles.saveButtonTextDisabled
          ]}>
            {isLoading ? 'Saving...' : 'Save Entry'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  emotionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  emotionButton: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emotionEmoji: {
    fontSize: 24,
    marginBottom: 5,
  },
  emotionLabel: {
    fontSize: 12,
    color: '#666',
  },
  intensityContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  intensityLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  intensityLabel: {
    color: '#666',
  },
  section: {
    marginBottom: 20,
  },
  journalInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 15,
    minHeight: 100,
    fontSize: 16,
  },
  activitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  activityButton: {
    width: '30%',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activityIcon: {
    fontSize: 20,
    marginBottom: 5,
  },
  activityName: {
    fontSize: 12,
    color: '#666',
  },
  gratitudeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  gratitudeInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 15,
    flex: 1,
    fontSize: 16,
  },
  removeGratitudeButton: {
    padding: 5,
  },
  addGratitudeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  addGratitudeText: {
    color: '#7C4DFF',
    marginLeft: 5,
    fontSize: 16,
  },
  privacyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  privacyInfo: {
    flexDirection: 'column',
  },
  privacyText: {
    fontSize: 16,
    color: '#333',
  },
  privacySubtext: {
    fontSize: 12,
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#7C4DFF',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButtonTextDisabled: {
    color: '#999',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  characterCount: {
    textAlign: 'right',
    color: '#666',
    marginTop: 5,
  },
  moreEntriesText: {
    textAlign: 'center',
    color: '#7C4DFF',
    fontStyle: 'italic',
    marginTop: 10,
  },
}); 