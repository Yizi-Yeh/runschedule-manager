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
  Typography,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
} from '@mui/material';
import { parseTrainingText } from '@/lib/utils';
import { DAYS_OF_WEEK, TRAINING_TYPES } from '@/lib/constants';
import { TrainingItem } from '@/types';

interface ParsedWeekData {
  weekNumber: number;
  days: {
    dayOfWeek: number;
    trainingItems: Omit<TrainingItem, 'id'>[];
  }[];
}

interface TextImportDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (parsedData: ParsedWeekData[]) => void;
}

const steps = ['貼上文字', '預覽解析結果', '確認匯入'];

export default function TextImportDialog({
  open,
  onClose,
  onConfirm,
}: TextImportDialogProps) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [inputText, setInputText] = React.useState('');
  const [parsedData, setParsedData] = React.useState<Record<string, Record<string, Omit<TrainingItem, 'id'>[]>> | null>(null);
  const [error, setError] = React.useState<string>('');

  React.useEffect(() => {
    if (open) {
      setActiveStep(0);
      setInputText('');
      setParsedData(null);
      setError('');
    }
  }, [open]);

  const handleNext = () => {
    if (activeStep === 0) {
      // Parse text
      try {
        const result = parseTrainingText(inputText);
        if (Object.keys(result).length === 0) {
          setError('無法解析文字內容，請檢查格式是否正確');
          return;
        }
        setParsedData(result);
        setError('');
        setActiveStep(1);
      } catch {
        setError('解析過程發生錯誤，請檢查文字格式');
      }
    } else if (activeStep === 1) {
      setActiveStep(2);
    } else if (activeStep === 2) {
      // Convert to format expected by parent
      const formattedData: ParsedWeekData[] = Object.entries(parsedData || {}).map(([weekStr, weekData]: [string, Record<string, Omit<TrainingItem, 'id'>[]>]) => ({
        weekNumber: parseInt(weekStr),
        days: Object.entries(weekData).map(([dayStr, dayItems]: [string, Omit<TrainingItem, 'id'>[]]) => ({
          dayOfWeek: parseInt(dayStr),
          trainingItems: dayItems || [],
        })),
      }));
      onConfirm(formattedData);
      onClose();
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="body1" gutterBottom>
              請將訓練文字貼上到下方文字框中。支援的格式包括：
            </Typography>
            <Box sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-line' }}>
{`範例格式：

W1 或 第1週
週一 或 星期一
5公里輕鬆跑 E配速
30分鐘慢跑

週二
休息

週三
間歇訓練
6趟 400公尺 I配速 休息90秒`}
              </Typography>
            </Box>
            <TextField
              multiline
              rows={12}
              fullWidth
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="請在此貼上訓練文字..."
              variant="outlined"
            />
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              解析結果預覽
            </Typography>
            {parsedData && Object.keys(parsedData).length > 0 ? (
              <Box>
                {Object.entries(parsedData || {}).map(([weekStr, weekData]: [string, Record<string, Omit<TrainingItem, 'id'>[]>]) => (
                  <Paper key={weekStr} sx={{ p: 2, mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      第 {weekStr} 週
                    </Typography>
                    {Object.entries(weekData).map(([dayStr, dayItems]: [string, Omit<TrainingItem, 'id'>[]]) => {
                      const dayInfo = DAYS_OF_WEEK.find(d => d.value === parseInt(dayStr));
                      return (
                        <Box key={dayStr} sx={{ mb: 2 }}>
                          <Typography variant="subtitle1" gutterBottom>
                            {dayInfo?.label || `週${dayStr}`}
                          </Typography>
                          {Array.isArray(dayItems) && dayItems.length > 0 ? (
                            <List dense>
                              {dayItems.map((item: Omit<TrainingItem, 'id'>, index: number) => (
                                <ListItem key={index} sx={{ pl: 0 }}>
                                  <ListItemText
                                    primary={
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Chip
                                          label={TRAINING_TYPES.find(t => t.value === item.type)?.label || item.type}
                                          size="small"
                                          sx={{
                                            bgcolor: TRAINING_TYPES.find(t => t.value === item.type)?.color || '#757575',
                                            color: 'white',
                                          }}
                                        />
                                        <Typography variant="body2">
                                          {item.title}
                                        </Typography>
                                      </Box>
                                    }
                                    secondary={
                                      <Box>
                                        <Typography variant="body2" color="text.secondary">
                                          {item.description}
                                        </Typography>
                                        {(item.distance || item.duration || item.pace || item.sets) && (
                                          <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                            {item.distance && (
                                              <Chip label={`${item.distance}km`} size="small" variant="outlined" />
                                            )}
                                            {item.duration && (
                                              <Chip label={`${item.duration}分鐘`} size="small" variant="outlined" />
                                            )}
                                            {item.pace && (
                                              <Chip label={item.pace} size="small" variant="outlined" />
                                            )}
                                            {item.sets && (
                                              <Chip label={`${item.sets}組`} size="small" variant="outlined" />
                                            )}
                                          </Box>
                                        )}
                                      </Box>
                                    }
                                  />
                                </ListItem>
                              ))}
                            </List>
                          ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ pl: 2 }}>
                              休息日
                            </Typography>
                          )}
                          <Divider />
                        </Box>
                      );
                    })}
                  </Paper>
                ))}
              </Box>
            ) : (
              <Alert severity="warning">
                沒有解析到任何訓練資料，請檢查輸入格式。
              </Alert>
            )}
          </Box>
        );

      case 2:
        return (
          <Box>
            <Alert severity="info" sx={{ mb: 2 }}>
              即將匯入解析的訓練資料到當前季度。這將會覆蓋對應週次的現有資料。
            </Alert>
            <Typography variant="body1">
              確認要匯入 {parsedData ? Object.keys(parsedData).length : 0} 週的訓練資料嗎？
            </Typography>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>匯入訓練文字</DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {getStepContent(activeStep)}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          上一步
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={
            (activeStep === 0 && !inputText.trim()) ||
            (activeStep === 1 && (!parsedData || Object.keys(parsedData).length === 0))
          }
        >
          {activeStep === steps.length - 1 ? '確認匯入' : '下一步'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}