'use client';

import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Season } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import SeasonCard from './SeasonCard';
import SeasonDialog from './SeasonDialog';

interface SeasonFormData {
  name: string;
  startDate: Date;
  totalWeeks: number;
  googleCalendarId?: string;
}

export default function SeasonList() {
  const {
    seasons,
    createSeason,
    updateSeason,
    deleteSeason,
    duplicateSeason,
  } = useAppStore();

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogMode, setDialogMode] = React.useState<'create' | 'edit' | 'duplicate'>('create');
  const [selectedSeason, setSelectedSeason] = React.useState<Season | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [seasonToDelete, setSeasonToDelete] = React.useState<Season | undefined>();

  const handleCreateSeason = () => {
    setDialogMode('create');
    setSelectedSeason(undefined);
    setDialogOpen(true);
  };

  const handleEditSeason = (season: Season) => {
    setDialogMode('edit');
    setSelectedSeason(season);
    setDialogOpen(true);
  };

  const handleDuplicateSeason = (season: Season) => {
    setDialogMode('duplicate');
    setSelectedSeason(season);
    setDialogOpen(true);
  };

  const handleDeleteSeason = (season: Season) => {
    setSeasonToDelete(season);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = (data: SeasonFormData) => {
    if (dialogMode === 'create') {
      createSeason(data.name, data.startDate, data.totalWeeks);
    } else if (dialogMode === 'edit' && selectedSeason) {
      updateSeason(selectedSeason.id, {
        name: data.name,
        startDate: data.startDate,
        totalWeeks: data.totalWeeks,
        googleCalendarId: data.googleCalendarId,
      });
    } else if (dialogMode === 'duplicate' && selectedSeason) {
      duplicateSeason(selectedSeason.id, data.name);
    }
  };

  const confirmDelete = () => {
    if (seasonToDelete) {
      deleteSeason(seasonToDelete.id);
      setDeleteDialogOpen(false);
      setSeasonToDelete(undefined);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          季度管理
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateSeason}
        >
          建立新季度
        </Button>
      </Box>

      {seasons.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          尚未建立任何季度課表。點擊「建立新季度」開始設定您的訓練計畫。
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {seasons.map((season) => (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={season.id}>
              <SeasonCard
                season={season}
                onEdit={handleEditSeason}
                onDelete={handleDeleteSeason}
                onDuplicate={handleDuplicateSeason}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <SeasonDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleFormSubmit}
        season={selectedSeason}
        mode={dialogMode}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>確認刪除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            您確定要刪除季度「{seasonToDelete?.name}」嗎？
            <br />
            此動作將永久刪除所有相關的訓練資料，且無法復原。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>取消</Button>
          <Button onClick={confirmDelete} color="error" autoFocus>
            刪除
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}