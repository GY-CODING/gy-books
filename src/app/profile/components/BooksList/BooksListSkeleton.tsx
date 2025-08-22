import React from 'react';
import { Box, Skeleton } from '@mui/material';

export const BooksListSkeleton: React.FC = () => (
  <Box
    sx={{
      flex: 1,
      display: { xs: 'grid', sm: 'grid', md: 'flex' },
      gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr', md: 'none' },
      flexWrap: { xs: 'unset', md: 'wrap' },
      gap: 2,
      overflowY: 'auto',
      maxHeight: 560,
      minHeight: 340,
      alignItems: 'center',
      justifyContent: 'center',
      py: 1,
      background: 'transparent',
    }}
  >
    {[...Array(6)].map((_, i) => (
      <Skeleton
        key={i}
        variant="rectangular"
        sx={{ borderRadius: 3, width: { xs: '100%', md: 140 }, height: 220 }}
      />
    ))}
  </Box>
);
