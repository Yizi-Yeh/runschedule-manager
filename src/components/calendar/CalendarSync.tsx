'use client';

import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  Grid,
  List,
  ListItem,
  ListItemText,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  Sync as SyncIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  CloudOff as CloudOffIcon,
} from '@mui/icons-material';
import { useAppStore } from '@/store/useAppStore';

export default function CalendarSync() {
  const { currentSeason, updateSeason } = useAppStore();
  const [, setIsConnected] = React.useState(false);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [syncProgress, setSyncProgress] = React.useState(0);

  if (!currentSeason) {
    return (
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Google Calendar 同步
        </Typography>
        <Alert severity="info">
          請先到「季度管理」建立或選擇一個訓練季度。
        </Alert>
      </Box>
    );
  }

  const handleConnect = async () => {
    // TODO: Implement Google OAuth flow
    setIsConnected(true);
    // Simulate updating season with calendar ID
    updateSeason(currentSeason.id, {
      googleCalendarId: 'example@gmail.com',
    });
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    updateSeason(currentSeason.id, {
      googleCalendarId: undefined,
    });
  };

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncProgress(0);

    // Simulate sync progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setSyncProgress(i);
    }

    setIsSyncing(false);
    setSyncProgress(0);
  };

  const getSyncStatus = (): {
    connected: boolean;
    syncedWeeks: number[];
    pendingWeeks: number[];
    failedWeeks: number[];
  } => {
    if (currentSeason.googleCalendarId) {
      return {
        connected: true,
        syncedWeeks: [1, 2, 3, 4, 5],
        pendingWeeks: [6, 7],
        failedWeeks: [] as number[],
      };
    }
    return {
      connected: false,
      syncedWeeks: [] as number[],
      pendingWeeks: [] as number[],
      failedWeeks: [] as number[],
    };
  };

  const status = getSyncStatus();

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Google Calendar 同步
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        目前季度：{currentSeason.name}
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                連線狀態
              </Typography>

              {status.connected ? (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                    <Typography variant="body1">已連接到 Google Calendar</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    日曆 ID: {currentSeason.googleCalendarId}
                  </Typography>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleDisconnect}
                  >
                    中斷連線
                  </Button>
                </Box>
              ) : (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CloudOffIcon color="disabled" sx={{ mr: 1 }} />
                    <Typography variant="body1">尚未連接 Google Calendar</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    連接後可以將訓練課表同步到 Google Calendar
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={handleConnect}
                    startIcon={<SyncIcon />}
                  >
                    連接 Google Calendar
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                同步操作
              </Typography>

              {status.connected ? (
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    將當前季度的訓練課表同步到 Google Calendar
                  </Typography>

                  {isSyncing ? (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        同步中... {syncProgress}%
                      </Typography>
                      <LinearProgress variant="determinate" value={syncProgress} />
                    </Box>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleSync}
                      startIcon={<SyncIcon />}
                      disabled={isSyncing}
                      fullWidth
                    >
                      開始同步
                    </Button>
                  )}
                </Box>
              ) : (
                <Alert severity="info">
                  請先連接 Google Calendar 才能進行同步操作。
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {status.connected && (
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  同步狀態
                </Typography>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid size={{ xs: 4 }}>
                    <Card variant="outlined">
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="success.main">
                          {status.syncedWeeks.length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          已同步週次
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid size={{ xs: 4 }}>
                    <Card variant="outlined">
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="warning.main">
                          {status.pendingWeeks.length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          待同步週次
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid size={{ xs: 4 }}>
                    <Card variant="outlined">
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="error.main">
                          {status.failedWeeks.length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          同步失敗週次
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                <Typography variant="subtitle1" gutterBottom>
                  週次詳細狀態
                </Typography>

                <List>
                  {Array.from({ length: currentSeason.totalWeeks }, (_, i) => i + 1).map((week) => {
                    let status: 'synced' | 'pending' | 'failed' = 'pending';
                    let icon = <SyncIcon color="disabled" />;

                    if (getSyncStatus().syncedWeeks.includes(week)) {
                      status = 'synced';
                      icon = <CheckCircleIcon color="success" />;
                    } else if (getSyncStatus().failedWeeks.includes(week)) {
                      status = 'failed';
                      icon = <ErrorIcon color="error" />;
                    }

                    return (
                      <ListItem key={week} secondaryAction={icon}>
                        <ListItemText
                          primary={`第 ${week} 週`}
                          secondary={
                            <Chip
                              label={
                                status === 'synced' ? '已同步' :
                                status === 'failed' ? '同步失敗' : '待同步'
                              }
                              size="small"
                              color={
                                status === 'synced' ? 'success' :
                                status === 'failed' ? 'error' : 'default'
                              }
                              variant="outlined"
                            />
                          }
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>注意事項：</strong>
          <br />• 同步操作會在您的 Google Calendar 中創建新的事件
          <br />• 重複同步會更新現有事件，不會重複創建
          <br />• 刪除季度不會自動刪除 Google Calendar 中的事件
          <br />• 請確保您有足夠的 Google Calendar 空間
        </Typography>
      </Alert>
    </Box>
  );
}