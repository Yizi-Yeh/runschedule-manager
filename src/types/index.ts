export interface TrainingItem {
  id: string;
  type: 'warmup' | 'main' | 'cooldown';
  title: string;
  description: string;
  distance?: number;
  duration?: number;
  pace?: string;
  sets?: number;
  rest?: number;
  notes?: string;
}

export interface DayTraining {
  id: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  date?: Date;
  isFlexible?: boolean; // for Tuesday/Wednesday flexibility
  timeSlot?: 'morning' | 'afternoon' | 'evening';
  customTime?: string;
  trainingItems: TrainingItem[];
  notes?: string;
}

export interface WeekTraining {
  id: string;
  weekNumber: number; // 1-12
  title?: string;
  days: DayTraining[];
  notes?: string;
}

export interface AuxiliaryTraining {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  duration?: number;
  category: string;
}

export interface Season {
  id: string;
  name: string;
  startDate: Date;
  totalWeeks: number;
  googleCalendarId?: string;
  weeks: WeekTraining[];
  auxiliaryTrainings: AuxiliaryTraining[];
  timePreferences: TimePreferences;
  createdAt: Date;
  updatedAt: Date;
  syncStatus?: SyncStatus;
}

export interface TimePreferences {
  defaultTimeSlot: 'morning' | 'afternoon' | 'evening';
  customTimes: {
    morning: string;
    afternoon: string;
    evening: string;
  };
  daySpecificTimes?: {
    [dayOfWeek: number]: 'morning' | 'afternoon' | 'evening' | string;
  };
  estimatedDuration: {
    warmup: number;
    main: number;
    cooldown: number;
  };
}

export interface SyncStatus {
  lastSyncDate?: Date;
  syncedWeeks: number[];
  pendingWeeks: number[];
  failedWeeks: number[];
  issyncing: boolean;
}

export interface ParsedTrainingData {
  weekNumber: number;
  weekTitle?: string;
  days: {
    dayOfWeek: number;
    date?: Date;
    trainingItems: Omit<TrainingItem, 'id'>[];
  }[];
}

export interface AppSettings {
  theme: 'light' | 'dark';
  defaultSeason?: string;
  autoSave: boolean;
  syncConfirmation: boolean;
}

export interface AppState {
  currentSeason?: Season;
  currentWeek: number;
  seasons: Season[];
  settings: AppSettings;
  loading: boolean;
  error?: string;
}

export type TrainingType = 'warmup' | 'main' | 'cooldown';
export type TimeSlot = 'morning' | 'afternoon' | 'evening';
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;