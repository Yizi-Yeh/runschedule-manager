'use client';

import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  TextFields as TextFieldsIcon,
  Upload as UploadIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';
import { useAppStore } from '@/store/useAppStore';
import TextImportDialog from './TextImportDialog';
import { generateId } from '@/lib/utils';
import { TrainingItem } from '@/types';

interface ParsedWeekData {
  weekNumber: number;
  days: {
    dayOfWeek: number;
    trainingItems: Omit<TrainingItem, 'id'>[];
  }[];
}

export default function ImportPage() {
  const { currentSeason, updateSeason } = useAppStore();
  const [textImportOpen, setTextImportOpen] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');

  if (!currentSeason) {
    return (
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          資料匯入
        </Typography>
        <Alert severity="info">
          請先到「季度管理」建立或選擇一個訓練季度。
        </Alert>
      </Box>
    );
  }

  const handleTextImport = (parsedData: ParsedWeekData[]) => {
    try {
      const updatedWeeks = [...currentSeason.weeks];

      parsedData.forEach(({ weekNumber, days }) => {
        const weekIndex = updatedWeeks.findIndex(w => w.weekNumber === weekNumber);
        if (weekIndex !== -1) {
          // Update existing week
          const week = updatedWeeks[weekIndex];
          days.forEach(({ dayOfWeek, trainingItems }) => {
            const dayIndex = week.days.findIndex(d => d.dayOfWeek === dayOfWeek);
            if (dayIndex !== -1) {
              week.days[dayIndex].trainingItems = trainingItems.map(item => ({
                ...item,
                id: generateId(),
              }));
            }
          });
        }
      });

      updateSeason(currentSeason.id, { weeks: updatedWeeks });
      setSnackbarMessage(`成功匯入 ${parsedData.length} 週的訓練資料`);
      setSnackbarOpen(true);
    } catch {
      setSnackbarMessage('匯入失敗，請稍後再試');
      setSnackbarOpen(true);
    }
  };

  const handleFileImport = () => {
    // TODO: Implement file import (JSON/CSV)
    setSnackbarMessage('檔案匯入功能開發中');
    setSnackbarOpen(true);
  };

  const handleCloudImport = () => {
    // TODO: Implement cloud import (Google Sheets, etc.)
    setSnackbarMessage('雲端匯入功能開發中');
    setSnackbarOpen(true);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        資料匯入
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        目前季度：{currentSeason.name}
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <TextFieldsIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                文字匯入
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                貼上大段文字自動解析成訓練課表。支援週次、日期、訓練內容的智能識別。
              </Typography>
              <Button
                variant="contained"
                onClick={() => setTextImportOpen(true)}
                fullWidth
              >
                開始文字匯入
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <UploadIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                檔案匯入
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                上傳 JSON 或 CSV 格式的訓練資料檔案。支援從其他系統匯出的標準格式。
              </Typography>
              <Button
                variant="outlined"
                onClick={handleFileImport}
                fullWidth
                disabled
              >
                選擇檔案
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <CloudUploadIcon sx={{ fontSize: 48, color: 'info.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                雲端匯入
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                從 Google Sheets、Excel Online 等雲端試算表直接匯入訓練計畫。
              </Typography>
              <Button
                variant="outlined"
                onClick={handleCloudImport}
                fullWidth
                disabled
              >
                連結雲端
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            匯入說明
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            • 文字匯入：支援自然語言描述的訓練內容，系統會自動識別週次、日期、距離、配速等資訊
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            • 檔案匯入：支援 JSON 和 CSV 格式，可以從其他訓練管理系統匯出資料後匯入
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            • 雲端匯入：直接從雲端試算表同步資料，適合團隊協作或大量資料管理
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            匯入操作將會覆蓋對應週次的現有訓練資料，請務必先備份重要資料。
          </Alert>
        </CardContent>
      </Card>

      <TextImportDialog
        open={textImportOpen}
        onClose={() => setTextImportOpen(false)}
        onConfirm={handleTextImport}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
}