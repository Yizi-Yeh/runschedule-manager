'use client';

import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Alert,
  Chip,
} from '@mui/material';
import {
  DirectionsRun as RunIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useAppStore } from '@/store/useAppStore';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';

export default function Home() {
  const { currentSeason, seasons, setCurrentWeek } = useAppStore();

  const handleQuickAccess = (weekNumber: number) => {
    setCurrentWeek(weekNumber);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        儀表板
      </Typography>

      {!currentSeason ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          尚未選擇任何季度。請先到「季度管理」建立或選擇一個訓練季度。
        </Alert>
      ) : (
        <Box>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <RunIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">目前季度</Typography>
                  </Box>
                  <Typography variant="h5" gutterBottom>
                    {currentSeason.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    開始日期: {format(new Date(currentSeason.startDate), 'yyyy/MM/dd', { locale: zhTW })}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    總週數: {currentSeason.totalWeeks} 週
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CalendarIcon color="success" sx={{ mr: 1 }} />
                    <Typography variant="h6">同步狀態</Typography>
                  </Box>
                  {currentSeason.googleCalendarId ? (
                    <Box>
                      <Chip label="已連結日曆" color="success" size="small" sx={{ mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Google Calendar ID: {currentSeason.googleCalendarId}
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      <Chip label="未連結日曆" color="default" size="small" sx={{ mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        尚未設定Google Calendar同步
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TrendingUpIcon color="info" sx={{ mr: 1 }} />
                    <Typography variant="h6">訓練統計</Typography>
                  </Box>
                  <Typography variant="h5" gutterBottom>
                    {currentSeason.weeks.length} / {currentSeason.totalWeeks}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    已設定週次
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                快速存取週次
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {Array.from({ length: currentSeason.totalWeeks }, (_, i) => i + 1).map((week) => (
                  <Button
                    key={week}
                    variant="outlined"
                    size="small"
                    onClick={() => handleQuickAccess(week)}
                  >
                    W{week}
                  </Button>
                ))}
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                最近更新
              </Typography>
              <Typography variant="body2" color="text.secondary">
                最後更新時間: {format(new Date(currentSeason.updatedAt), 'yyyy/MM/dd HH:mm', { locale: zhTW })}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      )}

      {seasons.length === 0 && (
        <Alert severity="info" sx={{ mt: 3 }}>
          系統中尚無任何季度資料。建議您先建立第一個訓練季度開始使用。
        </Alert>
      )}
    </Box>
  );
}
