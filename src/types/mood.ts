export interface Emotion {
  id: string;
  emoji: string;
  label: string;
  color: string;
}

export interface ActivityTag {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface MoodEntry {
  id: string;
  date: string;
  emotion: string;
  intensity: number;
  note: string;
  activities: string[];
  gratitude?: string;
}

export type MoodTrend = {
  date: string;
  averageMood: number;
  dominantEmotion: string;
  activityCorrelations: {
    activity: string;
    correlation: number;
  }[];
}; 