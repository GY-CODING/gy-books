import React from 'react';
import { Box, Paper, Skeleton } from '@mui/material';

export const BiographySkeleton: React.FC = () => (
  <Box sx={{ width: { xs: '100%', sm: 340, md: 400 }, maxWidth: '100%' }}>
    <Paper
      elevation={0}
      sx={{
        border: '2px solid #FFFFFF30',
        borderRadius: '12px',
        background: 'transparent',
        p: 1.5,
        mb: 1,
      }}
    >
      <Skeleton variant="text" width="60%" height={24} />
      <Skeleton variant="text" width="90%" height={32} />
    </Paper>
  </Box>
);
