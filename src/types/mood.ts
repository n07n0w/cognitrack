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
  timestamp: string;
  emotion: Emotion;
  intensity: number;
  journalText: string;
  activities: ActivityTag[];
  gratitude: string[];
  isPrivate: boolean;
}

export type MoodTrend = {
  date: string;
  averageMood: number;
  dominantEmotion: Emotion;
  activityCorrelations: {
    activity: ActivityTag;
    correlation: number;
  }[];
}; 