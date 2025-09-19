'use client';

import React from 'react';
import { Box, Alert } from '@mui/material';
import { DayTraining, TrainingItem } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import WeekNavigator from './WeekNavigator';
import WeekGrid from './WeekGrid';
import DayDialog from './DayDialog';
import TrainingItemDialog from './TrainingItemDialog';

export default function TrainingSchedule() {
  const { currentSeason, updateDay, addTrainingItem, updateTrainingItem } = useAppStore();

  const [dayDialogOpen, setDayDialogOpen] = React.useState(false);
  const [trainingDialogOpen, setTrainingDialogOpen] = React.useState(false);
  const [selectedDay, setSelectedDay] = React.useState<DayTraining | null>(null);
  const [selectedTrainingItem, setSelectedTrainingItem] = React.useState<TrainingItem | null>(null);
  const [trainingDialogMode, setTrainingDialogMode] = React.useState<'create' | 'edit'>('create');

  if (!currentSeason) {
    return (
      <Alert severity="info">
        請先到「季度管理」建立或選擇一個訓練季度。
      </Alert>
    );
  }

  const handleEditDay = (day: DayTraining) => {
    setSelectedDay(day);
    setDayDialogOpen(true);
  };

  const handleAddTraining = (day: DayTraining) => {
    setSelectedDay(day);
    setSelectedTrainingItem(null);
    setTrainingDialogMode('create');
    setTrainingDialogOpen(true);
  };

  const handleEditTraining = (day: DayTraining, item: TrainingItem) => {
    setSelectedDay(day);
    setSelectedTrainingItem(item);
    setTrainingDialogMode('edit');
    setTrainingDialogOpen(true);
  };

  const handleDaySubmit = (data: Partial<DayTraining>) => {
    if (selectedDay) {
      const currentWeekData = currentSeason.weeks.find(w => w.weekNumber === useAppStore.getState().currentWeek);
      if (currentWeekData) {
        updateDay(currentWeekData.id, selectedDay.id, data);
      }
    }
  };

  const handleTrainingSubmit = (data: Omit<TrainingItem, 'id'>) => {
    if (selectedDay) {
      const currentWeekData = currentSeason.weeks.find(w => w.weekNumber === useAppStore.getState().currentWeek);
      if (currentWeekData) {
        if (trainingDialogMode === 'create') {
          addTrainingItem(currentWeekData.id, selectedDay.id, data);
        } else if (selectedTrainingItem) {
          updateTrainingItem(currentWeekData.id, selectedDay.id, selectedTrainingItem.id, data);
        }
      }
    }
  };

  return (
    <Box>
      <WeekNavigator />
      <WeekGrid
        onEditDay={handleEditDay}
        onAddTraining={handleAddTraining}
        onEditTraining={handleEditTraining}
      />

      {selectedDay && (
        <>
          <DayDialog
            open={dayDialogOpen}
            onClose={() => setDayDialogOpen(false)}
            onSubmit={handleDaySubmit}
            day={selectedDay}
          />

          <TrainingItemDialog
            open={trainingDialogOpen}
            onClose={() => setTrainingDialogOpen(false)}
            onSubmit={handleTrainingSubmit}
            item={selectedTrainingItem || undefined}
            day={selectedDay}
            mode={trainingDialogMode}
          />
        </>
      )}
    </Box>
  );
}