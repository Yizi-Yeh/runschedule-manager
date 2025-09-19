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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon,
  Restore as RestoreIcon,
} from '@mui/icons-material';
import { useAppStore } from '@/store/useAppStore';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';

export default function DataManagementPage() {
  const {
    seasons,
    exportData,
    importData,
    clearAllData,
  } = useAppStore();

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [clearDialogOpen, setClearDialogOpen] = React.useState(false);
  const [importDialogOpen, setImportDialogOpen] = React.useState(false);
  const [importText, setImportText] = React.useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleExportData = () => {
    try {
      const data = exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `runschedule-backup-${format(new Date(), 'yyyy-MM-dd-HHmm')}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSnackbarMessage('資料匯出成功');
      setSnackbarOpen(true);
    } catch {
      setSnackbarMessage('匯出失敗，請稍後再試');
      setSnackbarOpen(true);
    }
  };

  const handleImportFromFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        if (importData(content)) {
          setSnackbarMessage('資料匯入成功');
          setSnackbarOpen(true);
        } else {
          setSnackbarMessage('檔案格式無效，匯入失敗');
          setSnackbarOpen(true);
        }
      } catch {
        setSnackbarMessage('匯入失敗，請檢查檔案格式');
        setSnackbarOpen(true);
      }
    };
    reader.readAsText(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImportFromText = () => {
    try {
      if (importData(importText)) {
        setSnackbarMessage('資料匯入成功');
        setSnackbarOpen(true);
        setImportDialogOpen(false);
        setImportText('');
      } else {
        setSnackbarMessage('資料格式無效，匯入失敗');
        setSnackbarOpen(true);
      }
    } catch {
      setSnackbarMessage('匯入失敗，請檢查資料格式');
      setSnackbarOpen(true);
    }
  };

  const handleClearAllData = () => {
    clearAllData();
    setClearDialogOpen(false);
    setSnackbarMessage('所有資料已清除');
    setSnackbarOpen(true);
  };

  const getDataSummary = () => {
    const totalWeeks = seasons.reduce((sum, season) => sum + season.weeks.length, 0);
    const totalTrainingItems = seasons.reduce((sum, season) => {
      return sum + season.weeks.reduce((weekSum, week) => {
        return weekSum + week.days.reduce((daySum, day) => {
          return daySum + day.trainingItems.length;
        }, 0);
      }, 0);
    }, 0);

    return {
      seasons: seasons.length,
      weeks: totalWeeks,
      trainingItems: totalTrainingItems,
    };
  };

  const summary = getDataSummary();

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        資料管理
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="primary.main">
                {summary.seasons}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                個季度
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="secondary.main">
                {summary.weeks}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                週課表
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="success.main">
                {summary.trainingItems}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                個訓練項目
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                資料備份
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                匯出所有資料到 JSON 檔案，包含季度、週次、訓練項目及設定。
              </Typography>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={handleExportData}
                fullWidth
                sx={{ mb: 2 }}
              >
                匯出備份檔案
              </Button>
              <Alert severity="info" sx={{ mt: 2 }}>
                建議定期備份資料，避免資料遺失。
              </Alert>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                資料還原
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                從備份檔案或文字格式還原資料。支援 JSON 格式的完整備份。
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<UploadIcon />}
                  onClick={handleImportFromFile}
                  fullWidth
                >
                  從檔案匯入
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<RestoreIcon />}
                  onClick={() => setImportDialogOpen(true)}
                  fullWidth
                >
                  從文字匯入
                </Button>
              </Box>
              <Alert severity="warning">
                匯入操作將覆蓋現有資料，請先備份。
              </Alert>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                季度列表
              </Typography>
              {seasons.length > 0 ? (
                <List>
                  {seasons.map((season) => (
                    <ListItem key={season.id}>
                      <ListItemText
                        primary={season.name}
                        secondary={
                          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                            <Chip
                              label={`${season.totalWeeks} 週`}
                              size="small"
                              variant="outlined"
                            />
                            <Chip
                              label={format(new Date(season.startDate), 'yyyy/MM/dd', { locale: zhTW })}
                              size="small"
                              variant="outlined"
                            />
                            {season.googleCalendarId && (
                              <Chip
                                label="已連結日曆"
                                size="small"
                                color="success"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Alert severity="info">
                  尚未建立任何季度資料。
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="error">
                危險操作
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                清除所有資料將永久刪除所有季度、週次、訓練項目及設定。此操作無法復原。
              </Typography>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setClearDialogOpen(true)}
                disabled={seasons.length === 0}
              >
                清除所有資料
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".json"
        onChange={handleFileChange}
      />

      <Dialog
        open={clearDialogOpen}
        onClose={() => setClearDialogOpen(false)}
      >
        <DialogTitle color="error">確認清除所有資料</DialogTitle>
        <DialogContent>
          <DialogContentText>
            您確定要清除所有資料嗎？這將刪除：
            <br />• {summary.seasons} 個季度
            <br />• {summary.weeks} 週課表
            <br />• {summary.trainingItems} 個訓練項目
            <br />• 所有設定
            <br /><br />
            此操作無法復原，建議先匯出備份。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearDialogOpen(false)}>取消</Button>
          <Button onClick={handleClearAllData} color="error" autoFocus>
            確認清除
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>從文字匯入資料</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            請貼上從「匯出備份檔案」獲得的 JSON 格式資料：
          </DialogContentText>
          <TextField
            multiline
            rows={10}
            fullWidth
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="請貼上 JSON 格式的備份資料..."
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportDialogOpen(false)}>取消</Button>
          <Button
            onClick={handleImportFromText}
            variant="contained"
            disabled={!importText.trim()}
          >
            匯入
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
}