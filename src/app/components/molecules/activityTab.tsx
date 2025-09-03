import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { goudi } from '@/utils/fonts/fonts';
import { Activity } from '@/domain/activity.model';
import { BookImage } from '../atoms/BookImage';
import { UUID } from 'crypto';
import { useActivities } from '@/hooks/useActivities';

interface ActivityTabProps {
  id: UUID;
}

export default function ActivityTab({ id }: ActivityTabProps) {
  const { data: activities, isLoading } = useActivities(id);

  return (
    <Box
      sx={{
        mt: 4,
        color: '#FFFFFF',
        fontFamily: goudi.style.fontFamily,
        textAlign: 'center',
      }}
    >
      {isLoading ? (
        <CircularProgress sx={{ color: '#fff', mt: 4 }} />
      ) : activities && activities.length > 0 ? (
        <Box sx={{ maxHeight: 500, overflowY: 'auto' }}>
          {activities.map((activity: Activity, index: number) => (
            <Box
              component={'a'}
              href={`/books/${activity.bookId}`}
              key={index}
              sx={{
                p: 2,
                mb: 2,
                height: '100px',
                background: 'rgba(35, 35, 35, 0.85)',
                borderRadius: '12px',
                border: '1px solid #FFFFFF30',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                textDecoration: 'none',
              }}
            >
              <BookImage bookId={activity.bookId as string} />
              <Typography
                variant="body1"
                sx={{ color: '#fff', fontFamily: goudi.style.fontFamily }}
              >
                {activity.message}
              </Typography>
            </Box>
          ))}
        </Box>
      ) : (
        <Typography
          variant="body1"
          sx={{ color: '#fff', fontFamily: goudi.style.fontFamily }}
        >
          No hay actividades disponibles.
        </Typography>
      )}
    </Box>
  );
}
