import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { MoodEntry } from '../types/mood';

interface MoodState {
  entries: MoodEntry[];
  isLoading: boolean;
  error: string | null;
}

type MoodAction =
  | { type: 'ADD_ENTRY'; payload: MoodEntry }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_ENTRIES'; payload: MoodEntry[] };

interface MoodContextType {
  state: MoodState;
  addEntry: (entry: MoodEntry) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  loadEntries: (entries: MoodEntry[]) => void;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

const initialState: MoodState = {
  entries: [],
  isLoading: false,
  error: null,
};

function moodReducer(state: MoodState, action: MoodAction): MoodState {
  switch (action.type) {
    case 'ADD_ENTRY':
      return {
        ...state,
        entries: [action.payload, ...state.entries],
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case 'LOAD_ENTRIES':
      return {
        ...state,
        entries: action.payload,
        isLoading: false,
        error: null,
      };
    default:
      return state;
  }
}

export function MoodProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(moodReducer, initialState);

  const addEntry = (entry: MoodEntry) => {
    dispatch({ type: 'ADD_ENTRY', payload: entry });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const loadEntries = (entries: MoodEntry[]) => {
    dispatch({ type: 'LOAD_ENTRIES', payload: entries });
  };

  const value: MoodContextType = {
    state,
    addEntry,
    setLoading,
    setError,
    loadEntries,
  };

  return <MoodContext.Provider value={value}>{children}</MoodContext.Provider>;
}

export function useMood() {
  const context = useContext(MoodContext);
  if (context === undefined) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
} 