import React from 'react';
import { Box, Skeleton } from '@mui/material';

export const BooksFilterSkeleton: React.FC = () => (
  <Box
    sx={{
      width: '100%',
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      gap: { xs: 1, sm: 2, md: 3 },
      px: { xs: 0.5, sm: 1, md: 2 },
      mb: 2,
      borderRadius: '12px',
      minHeight: 48,
      maxWidth: { xs: '100%', md: 1000 },
      mx: 'auto',
    }}
  >
    <Skeleton
      variant="rectangular"
      height={40}
      sx={{ flex: 2, borderRadius: '16px', minWidth: 110 }}
    />
    <Skeleton
      variant="rectangular"
      height={40}
      sx={{ flex: 1, borderRadius: '16px', minWidth: 110 }}
    />
    <Skeleton
      variant="rectangular"
      height={40}
      sx={{ flex: 1, borderRadius: '16px', minWidth: 110 }}
    />
    <Skeleton
      variant="rectangular"
      height={40}
      sx={{ flex: 1, borderRadius: '16px', minWidth: 110 }}
    />
    <Skeleton
      variant="rectangular"
      height={40}
      sx={{ flex: 1, borderRadius: '16px', minWidth: 110 }}
    />
  </Box>
);

export default BooksFilterSkeleton;
