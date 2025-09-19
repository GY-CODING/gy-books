import React from 'react';
import { Box, Typography } from '@mui/material';
import { birthStone } from '@/utils/fonts/fonts';

export const HallOfFameEmpty: React.FC = () => (
  <Box
    sx={{
      backgroundColor: '#1A1A1A',
      borderRadius: '16px',
      padding: '2rem',
      width: '100%',
      maxWidth: '900px',
      margin: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '2rem',
      userSelect: 'none',
      color: 'white',
    }}
  >
    <Typography
      variant="body1"
      sx={{
        fontStyle: 'normal',
        fontSize: '50px',
        textAlign: 'center',
        fontFamily: birthStone.style.fontFamily,
      }}
    >
      ✨ Add books to see them here! ✨
    </Typography>
  </Box>
);
