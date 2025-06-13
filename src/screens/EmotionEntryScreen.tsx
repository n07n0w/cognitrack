import React, { useState } from 'react';
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
} from 'react-native';
import Slider from '@react-native-community/slider';
import { EMOTIONS, ACTIVITIES } from '../constants/moodData';
import { Emotion, ActivityTag, MoodEntry } from '../types/mood';
import { Ionicons } from '@expo/vector-icons';

export const EmotionEntryScreen = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [intensity, setIntensity] = useState(5);
  const [journalText, setJournalText] = useState('');
  const [selectedActivities, setSelectedActivities] = useState<ActivityTag[]>([]);
  const [gratitude, setGratitude] = useState<string[]>(['']);
  const [isPrivate, setIsPrivate] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleActivityToggle = (activity: ActivityTag) => {
    setSelectedActivities(prev =>
      prev.find(a => a.id === activity.id)
        ? prev.filter(a => a.id !== activity.id)
        : [...prev, activity]
    );
  };

  const handleGratitudeChange = (text: string, index: number) => {
    const newGratitude = [...gratitude];
    newGratitude[index] = text;
    setGratitude(newGratitude);
  };

  const addGratitudeField = () => {
    setGratitude([...gratitude, '']);
  };

  const handleSave = () => {
    if (!selectedEmotion) {
      Alert.alert('Please select an emotion');
      return;
    }

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

    console.log('Saved entry:', entry);
    Alert.alert('Entry saved successfully!');
    
    // Reset form
    setSelectedEmotion(null);
    setIntensity(5);
    setJournalText('');
    setSelectedActivities([]);
    setGratitude(['']);
    setIsPrivate(false);
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>How are you feeling?</Text>

        <View style={styles.emotionsContainer}>
          {EMOTIONS.map(emotion => (
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
            >
              <Text style={styles.emotionEmoji}>{emotion.emoji}</Text>
              <Text style={styles.emotionLabel}>{emotion.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedEmotion && (
          <View style={styles.intensityContainer}>
            <Text style={styles.sectionTitle}>Intensity</Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={10}
              value={intensity}
              onValueChange={setIntensity}
              minimumTrackTintColor={selectedEmotion.color}
              maximumTrackTintColor="#E0E0E0"
              thumbTintColor={selectedEmotion.color}
            />
            <Text style={styles.intensityValue}>{intensity}/10</Text>
          </View>
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
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activities</Text>
          <View style={styles.activitiesContainer}>
            {ACTIVITIES.map(activity => (
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
              >
                <Text style={styles.activityIcon}>{activity.icon}</Text>
                <Text style={styles.activityName}>{activity.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gratitude</Text>
          {gratitude.map((item, index) => (
            <TextInput
              key={index}
              style={styles.gratitudeInput}
              placeholder={`I'm grateful for...`}
              value={item}
              onChangeText={text => handleGratitudeChange(text, index)}
            />
          ))}
          <TouchableOpacity
            style={styles.addGratitudeButton}
            onPress={addGratitudeField}
          >
            <Ionicons name="add-circle-outline" size={24} color="#7C4DFF" />
            <Text style={styles.addGratitudeText}>Add more</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.privacyContainer}>
          <Text style={styles.privacyText}>Private Entry</Text>
          <Switch
            value={isPrivate}
            onValueChange={setIsPrivate}
            trackColor={{ false: '#E0E0E0', true: '#7C4DFF' }}
            thumbColor={isPrivate ? '#fff' : '#f4f3f4'}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Entry</Text>
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
  intensityValue: {
    textAlign: 'center',
    color: '#666',
    marginTop: 5,
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
  gratitudeInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    fontSize: 16,
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
  privacyText: {
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#7C4DFF',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 