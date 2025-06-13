-- Create emotions table
CREATE TABLE IF NOT EXISTS emotions (
    id VARCHAR(50) PRIMARY KEY,
    emoji VARCHAR(10) NOT NULL,
    label VARCHAR(50) NOT NULL,
    color VARCHAR(7) NOT NULL
);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    icon VARCHAR(10) NOT NULL,
    color VARCHAR(7) NOT NULL
);

-- Create mood_entries table
CREATE TABLE IF NOT EXISTS mood_entries (
    id VARCHAR(50) PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    emotion_id VARCHAR(50) NOT NULL REFERENCES emotions(id),
    intensity INTEGER NOT NULL CHECK (intensity >= 1 AND intensity <= 10),
    journal_text TEXT,
    is_private BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create mood_entry_activities junction table
CREATE TABLE IF NOT EXISTS mood_entry_activities (
    mood_entry_id VARCHAR(50) REFERENCES mood_entries(id) ON DELETE CASCADE,
    activity_id VARCHAR(50) REFERENCES activities(id) ON DELETE CASCADE,
    PRIMARY KEY (mood_entry_id, activity_id)
);

-- Create gratitude_entries table
CREATE TABLE IF NOT EXISTS gratitude_entries (
    id SERIAL PRIMARY KEY,
    mood_entry_id VARCHAR(50) REFERENCES mood_entries(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_mood_entries_timestamp ON mood_entries(timestamp);
CREATE INDEX IF NOT EXISTS idx_mood_entries_emotion_id ON mood_entries(emotion_id);
CREATE INDEX IF NOT EXISTS idx_gratitude_entries_mood_entry_id ON gratitude_entries(mood_entry_id); 