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
  Grid,
  Divider,
  Chip,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { TrainingItem, DayTraining } from '@/types';
import { TRAINING_TYPES, PACE_ZONES, COMMON_TRAINING_TEMPLATES } from '@/lib/constants';

interface TrainingItemFormData {
  type: TrainingItem['type'];
  title: string;
  description: string;
  distance?: number;
  duration?: number;
  pace?: string;
  sets?: number;
  rest?: number;
  notes?: string;
}

interface TrainingItemDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TrainingItemFormData) => void;
  item?: TrainingItem;
  day: DayTraining;
  mode: 'create' | 'edit';
}

export default function TrainingItemDialog({
  open,
  onClose,
  onSubmit,
  item,
  day,
  mode,
}: TrainingItemDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TrainingItemFormData>({
    defaultValues: {
      type: 'main',
      title: '',
      description: '',
      distance: undefined,
      duration: undefined,
      pace: '',
      sets: undefined,
      rest: undefined,
      notes: '',
    },
  });

  const watchedType = watch('type');

  React.useEffect(() => {
    if (open) {
      if (item && mode === 'edit') {
        reset({
          type: item.type,
          title: item.title,
          description: item.description,
          distance: item.distance,
          duration: item.duration,
          pace: item.pace || '',
          sets: item.sets,
          rest: item.rest,
          notes: item.notes || '',
        });
      } else {
        reset({
          type: 'main',
          title: '',
          description: '',
          distance: undefined,
          duration: undefined,
          pace: '',
          sets: undefined,
          rest: undefined,
          notes: '',
        });
      }
    }
  }, [open, item, mode, reset]);

  const handleFormSubmit = (data: TrainingItemFormData) => {
    onSubmit(data);
    onClose();
  };

  const handleTemplateSelect = (template: typeof COMMON_TRAINING_TEMPLATES[0]) => {
    setValue('type', template.type as 'warmup' | 'main' | 'cooldown');
    setValue('title', template.title);
    setValue('description', template.description);
    if (template.distance) setValue('distance', template.distance);
    if (template.duration) setValue('duration', template.duration);
    if (template.pace) setValue('pace', template.pace);
    if (template.sets) setValue('sets', template.sets);
    if (template.rest) setValue('rest', template.rest);
  };

  const getTitle = () => {
    const dayName = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'][day.dayOfWeek];
    return mode === 'create' ? `新增訓練項目 - ${dayName}` : `編輯訓練項目 - ${dayName}`;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{getTitle()}</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            {mode === 'create' && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  常用範本
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {COMMON_TRAINING_TEMPLATES.map((template, index) => (
                    <Chip
                      key={index}
                      label={template.title}
                      onClick={() => handleTemplateSelect(template)}
                      clickable
                      variant="outlined"
                    />
                  ))}
                </Box>
                <Divider sx={{ mb: 2 }} />
              </Box>
            )}

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="type"
                  control={control}
                  rules={{ required: '訓練類型為必填項目' }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.type}>
                      <InputLabel>訓練類型</InputLabel>
                      <Select {...field} label="訓練類型">
                        {TRAINING_TYPES.map((type) => (
                          <MenuItem key={type.value} value={type.value}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box
                                sx={{
                                  width: 12,
                                  height: 12,
                                  bgcolor: type.color,
                                  borderRadius: '50%',
                                  mr: 1,
                                }}
                              />
                              {type.label}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.type && (
                        <Typography variant="caption" color="error">
                          {errors.type.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="title"
                  control={control}
                  rules={{ required: '訓練標題為必填項目' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="訓練標題"
                      fullWidth
                      error={!!errors.title}
                      helperText={errors.title?.message}
                      placeholder="例如：輕鬆跑、間歇訓練"
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="訓練描述"
                      fullWidth
                      multiline
                      rows={2}
                      placeholder="詳細描述訓練內容..."
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="distance"
                  control={control}
                  render={({ field: { onChange, value, ...field } }) => (
                    <TextField
                      {...field}
                      value={value || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        onChange(val === '' ? undefined : parseFloat(val));
                      }}
                      label="距離 (公里)"
                      type="number"
                      fullWidth
                      inputProps={{ step: 0.1, min: 0 }}
                      placeholder="例如：5.0"
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="duration"
                  control={control}
                  render={({ field: { onChange, value, ...field } }) => (
                    <TextField
                      {...field}
                      value={value || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        onChange(val === '' ? undefined : parseInt(val));
                      }}
                      label="時間 (分鐘)"
                      type="number"
                      fullWidth
                      inputProps={{ step: 1, min: 0 }}
                      placeholder="例如：30"
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="pace"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>配速</InputLabel>
                      <Select
                        {...field}
                        label="配速"
                      >
                        <MenuItem value="">
                          <em>不指定</em>
                        </MenuItem>
                        {PACE_ZONES.map((zone) => (
                          <MenuItem key={zone.name} value={zone.name}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box
                                sx={{
                                  width: 12,
                                  height: 12,
                                  bgcolor: zone.color,
                                  borderRadius: '50%',
                                  mr: 1,
                                }}
                              />
                              {zone.name} - {zone.description}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              {watchedType === 'main' && (
                <>
                  <Grid size={{ xs: 12, sm: 3 }}>
                    <Controller
                      name="sets"
                      control={control}
                      render={({ field: { onChange, value, ...field } }) => (
                        <TextField
                          {...field}
                          value={value || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            onChange(val === '' ? undefined : parseInt(val));
                          }}
                          label="組數"
                          type="number"
                          fullWidth
                          inputProps={{ step: 1, min: 1 }}
                          placeholder="例如：6"
                        />
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 3 }}>
                    <Controller
                      name="rest"
                      control={control}
                      render={({ field: { onChange, value, ...field } }) => (
                        <TextField
                          {...field}
                          value={value || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            onChange(val === '' ? undefined : parseInt(val));
                          }}
                          label="休息 (秒)"
                          type="number"
                          fullWidth
                          inputProps={{ step: 1, min: 0 }}
                          placeholder="例如：90"
                        />
                      )}
                    />
                  </Grid>
                </>
              )}

              <Grid size={{ xs: 12 }}>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="備註"
                      fullWidth
                      multiline
                      rows={2}
                      placeholder="訓練注意事項、目標等..."
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>取消</Button>
          <Button type="submit" variant="contained">
            {mode === 'create' ? '新增' : '儲存'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}