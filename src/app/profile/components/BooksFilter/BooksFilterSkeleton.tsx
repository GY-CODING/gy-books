import React from 'react';
import { Paper, Skeleton } from '@mui/material';

export const BooksFilterSkeleton: React.FC = () => (
  <Paper
    elevation={0}
    sx={{
      minWidth: { xs: '100%', md: 220 },
      maxWidth: { xs: '100%', md: 260 },
      p: 3,
      borderRadius: '18px',
      background: 'rgba(35, 35, 35, 0.85)',
      border: '1px solid #FFFFFF30',
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
    }}
  >
    {[1, 2, 3].map((i) => (
      <Skeleton
        key={i}
        variant="rectangular"
        width="100%"
        height={36}
        sx={{ borderRadius: 2, mb: 1 }}
      />
    ))}
  </Paper>
);
