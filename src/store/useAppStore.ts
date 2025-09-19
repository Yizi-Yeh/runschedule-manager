import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Season, AppSettings, TrainingItem, WeekTraining, DayTraining } from '@/types';
import { createEmptySeason, generateId } from '@/lib/utils';
import { STORAGE_KEYS } from '@/lib/constants';

interface AppStore {
  // State
  seasons: Season[];
  currentSeason: Season | null;
  currentWeek: number;
  settings: AppSettings;
  loading: boolean;
  error: string | null;

  // Season Actions
  createSeason: (name: string, startDate: Date, totalWeeks?: number) => Season;
  updateSeason: (seasonId: string, updates: Partial<Season>) => void;
  deleteSeason: (seasonId: string) => void;
  duplicateSeason: (seasonId: string, newName: string) => Season;
  setCurrentSeason: (seasonId: string | null) => void;

  // Week Actions
  setCurrentWeek: (weekNumber: number) => void;
  updateWeek: (weekId: string, updates: Partial<WeekTraining>) => void;
  duplicateWeek: (seasonId: string, sourceWeekNumber: number, targetWeekNumber: number) => void;

  // Day Actions
  updateDay: (weekId: string, dayId: string, updates: Partial<DayTraining>) => void;
  addTrainingItem: (weekId: string, dayId: string, trainingItem: Omit<TrainingItem, 'id'>) => void;
  updateTrainingItem: (weekId: string, dayId: string, itemId: string, updates: Partial<TrainingItem>) => void;
  deleteTrainingItem: (weekId: string, dayId: string, itemId: string) => void;
  reorderTrainingItems: (weekId: string, dayId: string, itemIds: string[]) => void;

  // Settings Actions
  updateSettings: (updates: Partial<AppSettings>) => void;

  // Utility Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Data Management
  exportData: () => string;
  importData: (data: string) => boolean;
  clearAllData: () => void;
}

const defaultSettings: AppSettings = {
  theme: 'light',
  autoSave: true,
  syncConfirmation: true,
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial State
      seasons: [],
      currentSeason: null,
      currentWeek: 1,
      settings: defaultSettings,
      loading: false,
      error: null,

      // Season Actions
      createSeason: (name: string, startDate: Date, totalWeeks = 12) => {
        const newSeason = createEmptySeason(name, startDate, totalWeeks);

        set((state) => ({
          seasons: [...state.seasons, newSeason],
          currentSeason: newSeason,
        }));

        return newSeason;
      },

      updateSeason: (seasonId: string, updates: Partial<Season>) => {
        set((state) => ({
          seasons: state.seasons.map((season) =>
            season.id === seasonId
              ? { ...season, ...updates, updatedAt: new Date() }
              : season
          ),
          currentSeason:
            state.currentSeason?.id === seasonId
              ? { ...state.currentSeason, ...updates, updatedAt: new Date() }
              : state.currentSeason,
        }));
      },

      deleteSeason: (seasonId: string) => {
        set((state) => ({
          seasons: state.seasons.filter((season) => season.id !== seasonId),
          currentSeason:
            state.currentSeason?.id === seasonId ? null : state.currentSeason,
        }));
      },

      duplicateSeason: (seasonId: string, newName: string) => {
        const sourceSeason = get().seasons.find((s) => s.id === seasonId);
        if (!sourceSeason) throw new Error('Season not found');

        const duplicatedSeason: Season = {
          ...sourceSeason,
          id: generateId(),
          name: newName,
          weeks: sourceSeason.weeks.map((week) => ({
            ...week,
            id: generateId(),
            days: week.days.map((day) => ({
              ...day,
              id: generateId(),
              trainingItems: day.trainingItems.map((item) => ({
                ...item,
                id: generateId(),
              })),
            })),
          })),
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          seasons: [...state.seasons, duplicatedSeason],
        }));

        return duplicatedSeason;
      },

      setCurrentSeason: (seasonId: string | null) => {
        const season = seasonId ? get().seasons.find((s) => s.id === seasonId) : null;
        set({ currentSeason: season });
      },

      // Week Actions
      setCurrentWeek: (weekNumber: number) => {
        set({ currentWeek: weekNumber });
      },

      updateWeek: (weekId: string, updates: Partial<WeekTraining>) => {
        set((state) => {
          if (!state.currentSeason) return state;

          const updatedWeeks = state.currentSeason.weeks.map((week) =>
            week.id === weekId ? { ...week, ...updates } : week
          );

          const updatedSeason = {
            ...state.currentSeason,
            weeks: updatedWeeks,
            updatedAt: new Date(),
          };

          return {
            currentSeason: updatedSeason,
            seasons: state.seasons.map((season) =>
              season.id === updatedSeason.id ? updatedSeason : season
            ),
          };
        });
      },

      duplicateWeek: (seasonId: string, sourceWeekNumber: number, targetWeekNumber: number) => {
        const season = get().seasons.find((s) => s.id === seasonId);
        if (!season) return;

        const sourceWeek = season.weeks.find((w) => w.weekNumber === sourceWeekNumber);
        if (!sourceWeek) return;

        const targetWeek = season.weeks.find((w) => w.weekNumber === targetWeekNumber);
        if (!targetWeek) return;

        const duplicatedWeek: WeekTraining = {
          ...targetWeek,
          title: sourceWeek.title,
          notes: sourceWeek.notes,
          days: sourceWeek.days.map((day) => ({
            ...day,
            id: generateId(),
            trainingItems: day.trainingItems.map((item) => ({
              ...item,
              id: generateId(),
            })),
          })),
        };

        get().updateSeason(seasonId, {
          weeks: season.weeks.map((week) =>
            week.weekNumber === targetWeekNumber ? duplicatedWeek : week
          ),
        });
      },

      // Day Actions
      updateDay: (weekId: string, dayId: string, updates: Partial<DayTraining>) => {
        set((state) => {
          if (!state.currentSeason) return state;

          const updatedWeeks = state.currentSeason.weeks.map((week) =>
            week.id === weekId
              ? {
                  ...week,
                  days: week.days.map((day) =>
                    day.id === dayId ? { ...day, ...updates } : day
                  ),
                }
              : week
          );

          const updatedSeason = {
            ...state.currentSeason,
            weeks: updatedWeeks,
            updatedAt: new Date(),
          };

          return {
            currentSeason: updatedSeason,
            seasons: state.seasons.map((season) =>
              season.id === updatedSeason.id ? updatedSeason : season
            ),
          };
        });
      },

      addTrainingItem: (weekId: string, dayId: string, trainingItem: Omit<TrainingItem, 'id'>) => {
        const newItem: TrainingItem = {
          ...trainingItem,
          id: generateId(),
        };

        set((state) => {
          if (!state.currentSeason) return state;

          const updatedWeeks = state.currentSeason.weeks.map((week) =>
            week.id === weekId
              ? {
                  ...week,
                  days: week.days.map((day) =>
                    day.id === dayId
                      ? {
                          ...day,
                          trainingItems: [...day.trainingItems, newItem],
                        }
                      : day
                  ),
                }
              : week
          );

          const updatedSeason = {
            ...state.currentSeason,
            weeks: updatedWeeks,
            updatedAt: new Date(),
          };

          return {
            currentSeason: updatedSeason,
            seasons: state.seasons.map((season) =>
              season.id === updatedSeason.id ? updatedSeason : season
            ),
          };
        });
      },

      updateTrainingItem: (weekId: string, dayId: string, itemId: string, updates: Partial<TrainingItem>) => {
        set((state) => {
          if (!state.currentSeason) return state;

          const updatedWeeks = state.currentSeason.weeks.map((week) =>
            week.id === weekId
              ? {
                  ...week,
                  days: week.days.map((day) =>
                    day.id === dayId
                      ? {
                          ...day,
                          trainingItems: day.trainingItems.map((item) =>
                            item.id === itemId ? { ...item, ...updates } : item
                          ),
                        }
                      : day
                  ),
                }
              : week
          );

          const updatedSeason = {
            ...state.currentSeason,
            weeks: updatedWeeks,
            updatedAt: new Date(),
          };

          return {
            currentSeason: updatedSeason,
            seasons: state.seasons.map((season) =>
              season.id === updatedSeason.id ? updatedSeason : season
            ),
          };
        });
      },

      deleteTrainingItem: (weekId: string, dayId: string, itemId: string) => {
        set((state) => {
          if (!state.currentSeason) return state;

          const updatedWeeks = state.currentSeason.weeks.map((week) =>
            week.id === weekId
              ? {
                  ...week,
                  days: week.days.map((day) =>
                    day.id === dayId
                      ? {
                          ...day,
                          trainingItems: day.trainingItems.filter((item) => item.id !== itemId),
                        }
                      : day
                  ),
                }
              : week
          );

          const updatedSeason = {
            ...state.currentSeason,
            weeks: updatedWeeks,
            updatedAt: new Date(),
          };

          return {
            currentSeason: updatedSeason,
            seasons: state.seasons.map((season) =>
              season.id === updatedSeason.id ? updatedSeason : season
            ),
          };
        });
      },

      reorderTrainingItems: (weekId: string, dayId: string, itemIds: string[]) => {
        set((state) => {
          if (!state.currentSeason) return state;

          const updatedWeeks = state.currentSeason.weeks.map((week) =>
            week.id === weekId
              ? {
                  ...week,
                  days: week.days.map((day) =>
                    day.id === dayId
                      ? {
                          ...day,
                          trainingItems: itemIds
                            .map((id) => day.trainingItems.find((item) => item.id === id))
                            .filter(Boolean) as TrainingItem[],
                        }
                      : day
                  ),
                }
              : week
          );

          const updatedSeason = {
            ...state.currentSeason,
            weeks: updatedWeeks,
            updatedAt: new Date(),
          };

          return {
            currentSeason: updatedSeason,
            seasons: state.seasons.map((season) =>
              season.id === updatedSeason.id ? updatedSeason : season
            ),
          };
        });
      },

      // Settings Actions
      updateSettings: (updates: Partial<AppSettings>) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }));
      },

      // Utility Actions
      setLoading: (loading: boolean) => set({ loading }),
      setError: (error: string | null) => set({ error }),
      clearError: () => set({ error: null }),

      // Data Management
      exportData: () => {
        const state = get();
        return JSON.stringify({
          seasons: state.seasons,
          settings: state.settings,
          exportDate: new Date().toISOString(),
        }, null, 2);
      },

      importData: (data: string) => {
        try {
          const parsedData = JSON.parse(data);

          if (parsedData.seasons && Array.isArray(parsedData.seasons)) {
            set({
              seasons: parsedData.seasons,
              settings: parsedData.settings || defaultSettings,
              currentSeason: null,
            });
            return true;
          }

          return false;
        } catch {
          return false;
        }
      },

      clearAllData: () => {
        set({
          seasons: [],
          currentSeason: null,
          currentWeek: 1,
          settings: defaultSettings,
          loading: false,
          error: null,
        });
      },
    }),
    {
      name: STORAGE_KEYS.SEASONS,
      partialize: (state) => ({
        seasons: state.seasons,
        settings: state.settings,
        currentWeek: state.currentWeek,
      }),
    }
  )
);