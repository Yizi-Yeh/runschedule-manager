'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useForm, Controller } from 'react-hook-form';
import { DayTraining } from '@/types';
import { TIME_SLOTS, DAYS_OF_WEEK } from '@/lib/constants';

interface DayFormData {
  timeSlot?: 'morning' | 'afternoon' | 'evening';
  customTime?: string;
  isFlexible?: boolean;
  notes?: string;
}

interface DayDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: DayFormData) => void;
  day: DayTraining;
}

export default function DayDialog({
  open,
  onClose,
  onSubmit,
  day,
}: DayDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    watch,
  } = useForm<DayFormData>({
    defaultValues: {
      timeSlot: undefined,
      customTime: '',
      isFlexible: false,
      notes: '',
    },
  });

  const watchedTimeSlot = watch('timeSlot');

  React.useEffect(() => {
    if (open) {
      reset({
        timeSlot: day.timeSlot,
        customTime: day.customTime || '',
        isFlexible: day.isFlexible || false,
        notes: day.notes || '',
      });
    }
  }, [open, day, reset]);

  const handleFormSubmit = (data: DayFormData) => {
    onSubmit(data);
    onClose();
  };

  const dayInfo = DAYS_OF_WEEK.find(d => d.value === day.dayOfWeek);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          設定 {dayInfo?.label || `週${day.dayOfWeek}`} 訓練時間
        </DialogTitle>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
              <FormControlLabel
                control={
                  <Controller
                    name="isFlexible"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                }
                label="彈性日期 (例如：週二或週三擇一)"
              />

              <Controller
                name="timeSlot"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>時段</InputLabel>
                    <Select
                      {...field}
                      label="時段"
                    >
                      <MenuItem value="">
                        <em>不指定</em>
                      </MenuItem>
                      {TIME_SLOTS.map((slot) => (
                        <MenuItem key={slot.value} value={slot.value}>
                          {slot.label} (預設 {slot.defaultTime})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />

              {watchedTimeSlot && (
                <Controller
                  name="customTime"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="自訂時間 (選填)"
                      placeholder="例如：07:30"
                      fullWidth
                      helperText="格式：HH:MM，留空使用預設時間"
                    />
                  )}
                />
              )}

              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="當日備註"
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="當日訓練注意事項、場地資訊等..."
                  />
                )}
              />

              <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1, border: 1, borderColor: 'divider' }}>
                <Typography variant="subtitle2" gutterBottom>
                  當前設定摘要
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  日期：{dayInfo?.label} {day.isFlexible && '(彈性)'}
                </Typography>
                {day.timeSlot && (
                  <Typography variant="body2" color="text.secondary">
                    時間：{TIME_SLOTS.find(s => s.value === day.timeSlot)?.label} {day.customTime || TIME_SLOTS.find(s => s.value === day.timeSlot)?.defaultTime}
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary">
                  訓練項目：{day.trainingItems.length} 個
                </Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>取消</Button>
            <Button type="submit" variant="contained">
              儲存
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </LocalizationProvider>
  );
}