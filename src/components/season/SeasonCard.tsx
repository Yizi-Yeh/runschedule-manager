'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  LinearProgress,
  Chip,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FileCopy as CopyIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { Season } from '@/types';
import { useAppStore } from '@/store/useAppStore';

interface SeasonCardProps {
  season: Season;
  onEdit: (season: Season) => void;
  onDelete: (season: Season) => void;
  onDuplicate: (season: Season) => void;
}

export default function SeasonCard({
  season,
  onEdit,
  onDelete,
  onDuplicate,
}: SeasonCardProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { setCurrentSeason, currentSeason } = useAppStore();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = () => {
    setCurrentSeason(season.id);
  };

  const progress = calculateProgress();
  const isSelected = currentSeason?.id === season.id;

  function calculateProgress(): number {
    const today = new Date();
    const startDate = new Date(season.startDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + season.totalWeeks * 7);

    if (today < startDate) return 0;
    if (today > endDate) return 100;

    const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    const passedDays = (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

    return Math.round((passedDays / totalDays) * 100);
  }

  function getStatusChip() {
    if (progress === 0) {
      return <Chip label="未開始" size="small" color="default" />;
    } else if (progress === 100) {
      return <Chip label="已完成" size="small" color="success" />;
    } else {
      return <Chip label="進行中" size="small" color="primary" />;
    }
  }

  return (
    <Card
      sx={{
        height: '100%',
        border: isSelected ? 2 : 0,
        borderColor: 'primary.main',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 4,
        },
      }}
      onClick={handleSelect}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" component="h2" noWrap>
            {season.name}
          </Typography>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleMenuOpen(e);
            }}
          >
            <MoreVertIcon />
          </IconButton>
        </Box>

        <Box sx={{ mb: 2 }}>
          {getStatusChip()}
          {season.googleCalendarId && (
            <Chip
              icon={<CalendarIcon />}
              label="已連結日曆"
              size="small"
              color="info"
              sx={{ ml: 1 }}
            />
          )}
        </Box>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          開始日期: {format(new Date(season.startDate), 'yyyy/MM/dd', { locale: zhTW })}
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          總週數: {season.totalWeeks} 週
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          最後更新: {format(new Date(season.updatedAt), 'MM/dd HH:mm', { locale: zhTW })}
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              進度
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {progress}%
            </Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
      </CardContent>

      <CardActions>
        <Button size="small" onClick={(e) => { e.stopPropagation(); handleSelect(); }}>
          {isSelected ? '已選擇' : '選擇'}
        </Button>
      </CardActions>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem
          onClick={() => {
            handleMenuClose();
            onEdit(season);
          }}
        >
          <EditIcon sx={{ mr: 1 }} />
          編輯
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            onDuplicate(season);
          }}
        >
          <CopyIcon sx={{ mr: 1 }} />
          複製
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            onDelete(season);
          }}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon sx={{ mr: 1 }} />
          刪除
        </MenuItem>
      </Menu>
    </Card>
  );
}