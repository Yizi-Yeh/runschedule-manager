'use client';

import React from 'react';
import {
  Box,
  Button,
  Typography,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { useAppStore } from '@/store/useAppStore';

export default function WeekNavigator() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { currentSeason, currentWeek, setCurrentWeek } = useAppStore();

  if (!currentSeason) return null;

  const handlePreviousWeek = () => {
    if (currentWeek > 1) {
      setCurrentWeek(currentWeek - 1);
    }
  };

  const handleNextWeek = () => {
    if (currentWeek < currentSeason.totalWeeks) {
      setCurrentWeek(currentWeek + 1);
    }
  };

  const handleWeekSelect = (weekNumber: number) => {
    setCurrentWeek(weekNumber);
  };

  if (isMobile) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton
          onClick={handlePreviousWeek}
          disabled={currentWeek <= 1}
          size="small"
        >
          <ChevronLeftIcon />
        </IconButton>

        <FormControl size="small">
          <Select
            value={currentWeek}
            onChange={(e) => handleWeekSelect(e.target.value as number)}
          >
            {Array.from({ length: currentSeason.totalWeeks }, (_, i) => i + 1).map((week) => (
              <MenuItem key={week} value={week}>
                第 {week} 週
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <IconButton
          onClick={handleNextWeek}
          disabled={currentWeek >= currentSeason.totalWeeks}
          size="small"
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h2">
          週次導航
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            onClick={handlePreviousWeek}
            disabled={currentWeek <= 1}
            size="small"
          >
            <ChevronLeftIcon />
          </IconButton>
          <Typography variant="h6" sx={{ minWidth: '80px', textAlign: 'center' }}>
            第 {currentWeek} 週
          </Typography>
          <IconButton
            onClick={handleNextWeek}
            disabled={currentWeek >= currentSeason.totalWeeks}
            size="small"
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {Array.from({ length: currentSeason.totalWeeks }, (_, i) => i + 1).map((week) => (
          <Button
            key={week}
            variant={currentWeek === week ? 'contained' : 'outlined'}
            size="small"
            onClick={() => handleWeekSelect(week)}
            sx={{ minWidth: '48px' }}
          >
            W{week}
          </Button>
        ))}
      </Box>
    </Box>
  );
}