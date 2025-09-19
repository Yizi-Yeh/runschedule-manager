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
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { zhTW } from 'date-fns/locale';
import { useForm, Controller } from 'react-hook-form';
import { Season } from '@/types';

interface SeasonFormData {
  name: string;
  startDate: Date;
  totalWeeks: number;
  googleCalendarId?: string;
}

interface SeasonDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: SeasonFormData) => void;
  season?: Season;
  mode: 'create' | 'edit' | 'duplicate';
}

export default function SeasonDialog({
  open,
  onClose,
  onSubmit,
  season,
  mode,
}: SeasonDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SeasonFormData>({
    defaultValues: {
      name: '',
      startDate: new Date(),
      totalWeeks: 12,
      googleCalendarId: '',
    },
  });

  React.useEffect(() => {
    if (open) {
      if (season && (mode === 'edit' || mode === 'duplicate')) {
        reset({
          name: mode === 'duplicate' ? `${season.name} (複製)` : season.name,
          startDate: new Date(season.startDate),
          totalWeeks: season.totalWeeks,
          googleCalendarId: season.googleCalendarId || '',
        });
      } else {
        reset({
          name: '',
          startDate: new Date(),
          totalWeeks: 12,
          googleCalendarId: '',
        });
      }
    }
  }, [open, season, mode, reset]);

  const handleFormSubmit = (data: SeasonFormData) => {
    onSubmit(data);
    onClose();
  };

  const getTitle = () => {
    switch (mode) {
      case 'create':
        return '建立新季度';
      case 'edit':
        return '編輯季度';
      case 'duplicate':
        return '複製季度';
      default:
        return '季度設定';
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={zhTW}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>{getTitle()}</DialogTitle>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
              <Controller
                name="name"
                control={control}
                rules={{ required: '季度名稱為必填項目' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="季度名稱"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    placeholder="例如：2024春季馬拉松訓練"
                  />
                )}
              />

              <Controller
                name="startDate"
                control={control}
                rules={{ required: '開始日期為必填項目' }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="開始日期"
                    format="yyyy/MM/dd"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.startDate,
                        helperText: errors.startDate?.message,
                      },
                    }}
                  />
                )}
              />

              <Controller
                name="totalWeeks"
                control={control}
                rules={{
                  required: '總週數為必填項目',
                  min: { value: 1, message: '總週數至少為1週' },
                  max: { value: 52, message: '總週數不能超過52週' },
                }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.totalWeeks}>
                    <InputLabel>總週數</InputLabel>
                    <Select
                      {...field}
                      label="總週數"
                    >
                      {Array.from({ length: 20 }, (_, i) => i + 1).map((weeks) => (
                        <MenuItem key={weeks} value={weeks}>
                          {weeks} 週
                        </MenuItem>
                      ))}
                      <MenuItem value={24}>24 週</MenuItem>
                      <MenuItem value={32}>32 週</MenuItem>
                      <MenuItem value={52}>52 週</MenuItem>
                    </Select>
                    {errors.totalWeeks && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                        {errors.totalWeeks.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />

              <Controller
                name="googleCalendarId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Google Calendar ID (選填)"
                    fullWidth
                    placeholder="example@gmail.com"
                    helperText="連結Google日曆後可以同步訓練課表"
                  />
                )}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>取消</Button>
            <Button type="submit" variant="contained">
              {mode === 'create' ? '建立' : mode === 'edit' ? '儲存' : '複製'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </LocalizationProvider>
  );
}