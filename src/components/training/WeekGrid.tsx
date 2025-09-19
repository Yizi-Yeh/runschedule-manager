'use client';

import React from 'react';
import {
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import { DayTraining, TrainingItem } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import DayCard from './DayCard';

interface WeekGridProps {
  onEditDay: (day: DayTraining) => void;
  onAddTraining: (day: DayTraining) => void;
  onEditTraining: (day: DayTraining, item: TrainingItem) => void;
}

export default function WeekGrid({
  onEditDay,
  onAddTraining,
  onEditTraining,
}: WeekGridProps) {
  const { currentSeason, currentWeek, updateWeek } = useAppStore();
  const [weekTitle, setWeekTitle] = React.useState('');
  const [weekNotes, setWeekNotes] = React.useState('');

  const currentWeekData = currentSeason?.weeks.find(w => w.weekNumber === currentWeek);

  React.useEffect(() => {
    if (currentWeekData) {
      setWeekTitle(currentWeekData.title || '');
      setWeekNotes(currentWeekData.notes || '');
    }
  }, [currentWeekData]);

  if (!currentSeason || !currentWeekData) {
    return (
      <Alert severity="info">
        請先選擇一個季度並確保週次資料已載入。
      </Alert>
    );
  }

  const handleWeekInfoUpdate = () => {
    updateWeek(currentWeekData.id, {
      title: weekTitle,
      notes: weekNotes,
    });
  };

  const sortedDays = [...currentWeekData.days].sort((a, b) => {
    // 週一到週日的排序 (1-7, 0)
    const orderA = a.dayOfWeek === 0 ? 7 : a.dayOfWeek;
    const orderB = b.dayOfWeek === 0 ? 7 : b.dayOfWeek;
    return orderA - orderB;
  });

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            第 {currentWeek} 週設定
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="週次標題"
              value={weekTitle}
              onChange={(e) => setWeekTitle(e.target.value)}
              placeholder={`第 ${currentWeek} 週訓練`}
              size="small"
              sx={{ flex: 1 }}
            />
            <Button
              variant="outlined"
              onClick={handleWeekInfoUpdate}
              size="small"
            >
              儲存
            </Button>
          </Box>

          <TextField
            label="週次備註"
            value={weekNotes}
            onChange={(e) => setWeekNotes(e.target.value)}
            placeholder="本週訓練重點、注意事項等..."
            multiline
            rows={2}
            fullWidth
            size="small"
            onBlur={handleWeekInfoUpdate}
          />
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        {sortedDays.map((day) => (
          <Grid size={{ xs: 12, sm: 6, lg: 4, xl: 3 }} key={day.id}>
            <DayCard
              day={day}
              onEdit={onEditDay}
              onAddTraining={onAddTraining}
              onEditTraining={onEditTraining}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}