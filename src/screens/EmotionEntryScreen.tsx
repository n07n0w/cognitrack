import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';

type Emotion = {
  emoji: string;
  label: string;
};

const emotions: Emotion[] = [
  { emoji: '😃', label: 'Great' },
  { emoji: '🙂', label: 'Good' },
  { emoji: '😐', label: 'Neutral' },
  { emoji: '😞', label: 'Bad' },
  { emoji: '😫', label: 'Terrible' },
];

export const EmotionEntryScreen: React.FC = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [comment, setComment] = useState('');

  const handleSave = () => {
    if (!selectedEmotion) {
      Alert.alert('Выберите эмоцию');
      return;
    }

    const entry = {
      emotion: selectedEmotion,
      comment,
      timestamp: new Date().toISOString(),
    };

    console.log('Saved entry:', entry);
    Alert.alert('Сохранено!');
    
    // Reset form
    setSelectedEmotion(null);
    setComment('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Как ты сейчас?</Text>

      <View style={styles.emotionsContainer}>
        {emotions.map((emotion) => (
          <TouchableOpacity
            key={emotion.emoji}
            style={[
              styles.emotionButton,
              selectedEmotion === emotion.emoji && styles.selectedEmotion,
            ]}
            onPress={() => setSelectedEmotion(emotion.emoji)}
          >
            <Text style={styles.emotionEmoji}>{emotion.emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Опиши, что случилось"
        value={comment}
        onChangeText={setComment}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
      >
        <Text style={styles.saveButtonText}>Сохранить</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  emotionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  emotionButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    minWidth: 50,
    alignItems: 'center',
  },
  selectedEmotion: {
    backgroundColor: '#e3f2fd',
    borderWidth: 2,
    borderColor: '#2196f3',
  },
  emotionEmoji: {
    fontSize: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    minHeight: 100,
  },
  saveButton: {
    backgroundColor: '#2196f3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 