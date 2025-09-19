import React from 'react';
import { UUID } from 'crypto';
import { useStats } from '@/hooks/useStats';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import AuthorsBarChart from '../molecules/AuthorsBarChart';
import { Box, Typography } from '@mui/material';
import DonutChart from '../molecules/DonutChart';
import { goudi } from '@/utils/fonts/fonts';
import StatsSkeleton from '../molecules/StatsSkeleton';

export default function StatsComponent({ id }: { id: UUID }) {
  const storedStats = useSelector((state: RootState) => state.stats);
  const isCurrentUser = storedStats.userId === id.toString();

  // Always call useStats, but prefer Redux data if available
  const {
    data: hookData,
    isLoading: hookLoading,
    error: hookError,
  } = useStats(id);

  const data = isCurrentUser && storedStats.data ? storedStats.data : hookData;
  const isLoading =
    isCurrentUser && storedStats.data ? storedStats.isLoading : hookLoading;
  const error =
    isCurrentUser && storedStats.data
      ? storedStats.error
        ? new Error(storedStats.error)
        : null
      : hookError;
  if (isLoading) return <StatsSkeleton />;

  if (error) return <div>Error: {error.message}</div>;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row ',
        gap: 2,
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          width: '500px',
          height: '400px',
          backgroundColor: '#121212',
          borderRadius: '10px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 2,
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Typography
          sx={{ color: 'white', fontFamily: goudi.style.fontFamily }}
          variant="h4"
        >
          Authors read
        </Typography>
        <AuthorsBarChart authors={data?.authors} />
      </Box>
      <Box
        sx={{
          width: '500px',
          height: '400px',
          backgroundColor: '#121212',
          borderRadius: '10px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 2,
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Typography
          sx={{ color: 'white', fontFamily: goudi.style.fontFamily }}
          variant="h4"
        >
          Book status
        </Typography>
        <DonutChart bookStatus={data?.bookStatus} />
      </Box>
    </Box>
  );
}
