'use client';

import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Button,
  Grid,
  TextField,
  Divider,
  Alert,
  Snackbar,
} from '@mui/material';
import { useAppStore } from '@/store/useAppStore';
import { TIME_SLOTS } from '@/lib/constants';

export default function SettingsPage() {
  const { settings, updateSettings } = useAppStore();
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');

  const [localSettings, setLocalSettings] = React.useState({
    theme: settings.theme,
    autoSave: settings.autoSave,
    syncConfirmation: settings.syncConfirmation,
    defaultTimeSlot: 'morning' as 'morning' | 'afternoon' | 'evening',
    morningTime: '07:00',
    afternoonTime: '14:00',
    eveningTime: '18:00',
    warmupDuration: 15,
    mainDuration: 60,
    cooldownDuration: 10,
  });

  const handleSave = () => {
    updateSettings({
      theme: localSettings.theme,
      autoSave: localSettings.autoSave,
      syncConfirmation: localSettings.syncConfirmation,
    });

    setSnackbarMessage('設定已儲存');
    setSnackbarOpen(true);
  };

  const handleReset = () => {
    setLocalSettings({
      theme: 'light',
      autoSave: true,
      syncConfirmation: true,
      defaultTimeSlot: 'morning',
      morningTime: '07:00',
      afternoonTime: '14:00',
      eveningTime: '18:00',
      warmupDuration: 15,
      mainDuration: 60,
      cooldownDuration: 10,
    });

    setSnackbarMessage('設定已重置');
    setSnackbarOpen(true);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        系統設定
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                外觀設定
              </Typography>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>主題</InputLabel>
                <Select
                  value={localSettings.theme}
                  label="主題"
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    theme: e.target.value as 'light' | 'dark',
                  })}
                >
                  <MenuItem value="light">淺色主題</MenuItem>
                  <MenuItem value="dark">深色主題</MenuItem>
                </Select>
              </FormControl>

              <Alert severity="info" sx={{ mt: 2 }}>
                主題變更會立即生效，無需儲存。
              </Alert>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                行為設定
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={localSettings.autoSave}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      autoSave: e.target.checked,
                    })}
                  />
                }
                label="自動儲存"
                sx={{ display: 'block', mb: 2 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={localSettings.syncConfirmation}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      syncConfirmation: e.target.checked,
                    })}
                  />
                }
                label="同步前確認"
                sx={{ display: 'block', mb: 2 }}
              />

              <Typography variant="body2" color="text.secondary">
                自動儲存：編輯訓練項目時自動儲存變更
                <br />
                同步前確認：同步到 Google Calendar 前顯示確認對話框
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                預設時間設定
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <FormControl fullWidth>
                    <InputLabel>預設時段</InputLabel>
                    <Select
                      value={localSettings.defaultTimeSlot}
                      label="預設時段"
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        defaultTimeSlot: e.target.value as 'morning' | 'afternoon' | 'evening',
                      })}
                    >
                      {TIME_SLOTS.map((slot) => (
                        <MenuItem key={slot.value} value={slot.value}>
                          {slot.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    label="早上時間"
                    type="time"
                    value={localSettings.morningTime}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      morningTime: e.target.value,
                    })}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    label="下午時間"
                    type="time"
                    value={localSettings.afternoonTime}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      afternoonTime: e.target.value,
                    })}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    label="晚上時間"
                    type="time"
                    value={localSettings.eveningTime}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      eveningTime: e.target.value,
                    })}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                訓練時長預設值 (分鐘)
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    label="暖身時長"
                    type="number"
                    value={localSettings.warmupDuration}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      warmupDuration: parseInt(e.target.value) || 0,
                    })}
                    fullWidth
                    inputProps={{ min: 0, step: 5 }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    label="主訓練時長"
                    type="number"
                    value={localSettings.mainDuration}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      mainDuration: parseInt(e.target.value) || 0,
                    })}
                    fullWidth
                    inputProps={{ min: 0, step: 5 }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    label="收操時長"
                    type="number"
                    value={localSettings.cooldownDuration}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      cooldownDuration: parseInt(e.target.value) || 0,
                    })}
                    fullWidth
                    inputProps={{ min: 0, step: 5 }}
                  />
                </Grid>
              </Grid>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                這些數值會作為新增訓練項目時的預設時長建議。
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                儲存設定
              </Typography>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleSave}
                >
                  儲存設定
                </Button>

                <Button
                  variant="outlined"
                  onClick={handleReset}
                >
                  重置為預設值
                </Button>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Alert severity="warning">
                <Typography variant="body2">
                  <strong>注意：</strong>重置設定將會恢復所有預設值，此操作無法復原。
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
}