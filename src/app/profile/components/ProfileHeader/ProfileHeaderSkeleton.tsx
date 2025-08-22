import React from 'react';
import { Box, Skeleton } from '@mui/material';

export const ProfileHeaderSkeleton: React.FC = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      gap: { xs: 2, md: 6 },
      minHeight: 20,
    }}
  >
    <Skeleton
      variant="circular"
      width={160}
      height={160}
      sx={{ ml: 2, mb: { xs: 2, md: 0 } }}
    />
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        alignItems: { xs: 'center', md: 'flex-start' },
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'row',
          gap: 2,
          alignItems: { xs: 'center', md: 'center' },
        }}
      >
        <Skeleton variant="text" width={220} height={48} /> {/* username */}
        <Skeleton variant="text" width={180} height={28} /> {/* email */}
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'start',
          justifyContent: 'center',
          gap: 1,
          width: '10%',
        }}
      >
        <Skeleton variant="text" width={100} height={24} />{' '}
        {/* friends count */}
      </Box>
      <Box sx={{ width: 400, maxWidth: '100%' }}>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={60}
          sx={{ borderRadius: 2, mb: 1 }}
        />{' '}
        {/* biography skeleton */}
      </Box>
    </Box>
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'row', md: 'column' },
        gap: 1,
        alignItems: { xs: 'center', md: 'flex-end' },
        ml: 'auto',
        mt: { xs: 2, md: 0 },
      }}
    >
      <Skeleton
        variant="rectangular"
        width={160}
        height={60}
        sx={{ borderRadius: 2 }}
      />
      <Skeleton
        variant="rectangular"
        width={160}
        height={60}
        sx={{ borderRadius: 2 }}
      />
    </Box>
  </Box>
);
