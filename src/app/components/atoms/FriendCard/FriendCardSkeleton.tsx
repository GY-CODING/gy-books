import { Box, Skeleton } from '@mui/material';
import React from 'react';

export default function FriendCardSkeleton() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'left',
        gap: '1.5rem',
        backgroundColor: '#232323',
        borderRadius: '16px',
        padding: '1rem',
        width: '25%',
        height: '100px',
        minWidth: '400px',
        position: 'relative',
        textDecoration: 'none',
      }}
    >
      <Skeleton variant="circular" width={80} height={80} />
      <Box sx={{ flex: 1 }}>
        <Skeleton
          variant="text"
          width="60%"
          height={32}
          sx={{ bgcolor: '#333' }}
        />
      </Box>
    </Box>
  );
}
