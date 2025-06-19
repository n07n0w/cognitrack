import AsyncStorage from '@react-native-async-storage/async-storage';
import { MoodEntry } from '../types/mood';

const MOOD_ENTRIES_KEY = '@mood_entries';

export const StorageService = {
  async saveMoodEntry(entry: MoodEntry): Promise<void> {
    try {
      const existingEntries = await this.getAllMoodEntries();
      const updatedEntries = [entry, ...existingEntries];
      await AsyncStorage.setItem(MOOD_ENTRIES_KEY, JSON.stringify(updatedEntries));
    } catch (error) {
      console.error('Error saving mood entry:', error);
      throw new Error('Failed to save mood entry');
    }
  },

  async getAllMoodEntries(): Promise<MoodEntry[]> {
    try {
      const entries = await AsyncStorage.getItem(MOOD_ENTRIES_KEY);
      return entries ? JSON.parse(entries) : [];
    } catch (error) {
      console.error('Error loading mood entries:', error);
      return [];
    }
  },

  async deleteMoodEntry(id: string): Promise<void> {
    try {
      const existingEntries = await this.getAllMoodEntries();
      const filteredEntries = existingEntries.filter(entry => entry.id !== id);
      await AsyncStorage.setItem(MOOD_ENTRIES_KEY, JSON.stringify(filteredEntries));
    } catch (error) {
      console.error('Error deleting mood entry:', error);
      throw new Error('Failed to delete mood entry');
    }
  },

  async clearAllEntries(): Promise<void> {
    try {
      await AsyncStorage.removeItem(MOOD_ENTRIES_KEY);
    } catch (error) {
      console.error('Error clearing mood entries:', error);
      throw new Error('Failed to clear mood entries');
    }
  },

  async getMoodEntriesByDateRange(startDate: Date, endDate: Date): Promise<MoodEntry[]> {
    try {
      const allEntries = await this.getAllMoodEntries();
      return allEntries.filter(entry => {
        const entryDate = new Date(entry.timestamp);
        return entryDate >= startDate && entryDate <= endDate;
      });
    } catch (error) {
      console.error('Error filtering mood entries by date:', error);
      return [];
    }
  },
}; 