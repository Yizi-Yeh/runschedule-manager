'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Chip,
  IconButton,
  List,
  ListItem,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { DayTraining, TrainingItem } from '@/types';
import { DAYS_OF_WEEK, TRAINING_TYPES } from '@/lib/constants';
import { formatDuration, formatDistance } from '@/lib/utils';

interface DayCardProps {
  day: DayTraining;
  onEdit: (day: DayTraining) => void;
  onAddTraining: (day: DayTraining) => void;
  onEditTraining: (day: DayTraining, item: TrainingItem) => void;
}

export default function DayCard({
  day,
  onEdit,
  onAddTraining,
  onEditTraining,
}: DayCardProps) {
  const dayInfo = DAYS_OF_WEEK.find(d => d.value === day.dayOfWeek);
  const hasTraining = day.trainingItems.length > 0;

  const getTrainingTypeColor = (type: TrainingItem['type']) => {
    const trainingType = TRAINING_TYPES.find(t => t.value === type);
    return trainingType?.color || '#757575';
  };

  const getTrainingTypeLabel = (type: TrainingItem['type']) => {
    const trainingType = TRAINING_TYPES.find(t => t.value === type);
    return trainingType?.label || type;
  };

  const renderTrainingItem = (item: TrainingItem) => {
    const details = [];

    if (item.distance) {
      details.push(formatDistance(item.distance));
    }

    if (item.duration) {
      details.push(formatDuration(item.duration));
    }

    if (item.pace) {
      details.push(item.pace);
    }

    if (item.sets && item.sets > 1) {
      details.push(`${item.sets}組`);
    }

    return (
      <ListItem
        key={item.id}
        sx={{
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          mb: 1,
          cursor: 'pointer',
          '&:hover': { bgcolor: 'action.hover' },
        }}
        onClick={() => onEditTraining(day, item)}
      >
        <Box sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Chip
              label={getTrainingTypeLabel(item.type)}
              size="small"
              sx={{
                bgcolor: getTrainingTypeColor(item.type),
                color: 'white',
                mr: 1,
              }}
            />
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              {item.title}
            </Typography>
          </Box>

          {item.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {item.description}
            </Typography>
          )}

          {details.length > 0 && (
            <Typography variant="caption" color="text.secondary">
              {details.join(' • ')}
            </Typography>
          )}

          {item.notes && (
            <Typography variant="caption" display="block" sx={{ mt: 0.5, fontStyle: 'italic' }}>
              備註: {item.notes}
            </Typography>
          )}
        </Box>
      </ListItem>
    );
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">
              {dayInfo?.label || `週${day.dayOfWeek}`}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {day.timeSlot && (
                <Chip
                  icon={<ScheduleIcon />}
                  label={day.customTime || day.timeSlot}
                  size="small"
                  variant="outlined"
                />
              )}
              <IconButton size="small" onClick={() => onEdit(day)}>
                <EditIcon />
              </IconButton>
            </Box>
          </Box>
        }
        sx={{ pb: 1 }}
      />

      <CardContent sx={{ flex: 1, pt: 0 }}>
        {day.isFlexible && (
          <Chip
            label="彈性日期"
            size="small"
            color="warning"
            sx={{ mb: 2 }}
          />
        )}

        {hasTraining ? (
          <Box>
            <List sx={{ p: 0 }}>
              {day.trainingItems.map(renderTrainingItem)}
            </List>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '120px',
              color: 'text.secondary',
            }}
          >
            <Typography variant="body2" sx={{ mb: 1 }}>
              尚未安排訓練
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <IconButton
            onClick={() => onAddTraining(day)}
            color="primary"
            sx={{
              bgcolor: 'action.hover',
              '&:hover': { bgcolor: 'action.selected' },
            }}
          >
            <AddIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
}