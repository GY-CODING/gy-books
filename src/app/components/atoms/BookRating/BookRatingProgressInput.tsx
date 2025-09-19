import React from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import PercentIcon from '@mui/icons-material/Percent';
import BookIcon from '@mui/icons-material/Book';

interface Props {
  tempProgress: number;
  setTempProgress: (progress: number) => void;
  isProgressPercent: boolean;
  setIsProgressPercent: (isPercent: boolean) => void;
  fontFamily: string;
}

const BookRatingProgressInput: React.FC<Props> = ({
  tempProgress,
  setTempProgress,
  isProgressPercent,
  setIsProgressPercent,
  fontFamily,
}) => (
  <Box
    sx={{ position: 'relative', display: 'flex', gap: 2, alignItems: 'center' }}
  >
    <TextField
      sx={{ width: '100px' }}
      value={tempProgress}
      label="Progress"
      type="text"
      onChange={(e) => setTempProgress(Number(e.target.value))}
    />
    <Typography
      sx={{
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        fontFamily,
        letterSpacing: '.05rem',
      }}
    >
      {isProgressPercent ? '%' : 'pages.'}
    </Typography>
    <Box sx={{ display: 'flex', gap: 1, position: 'absolute', right: 0 }}>
      <Button
        variant={isProgressPercent ? 'contained' : 'outlined'}
        onClick={() => setIsProgressPercent(true)}
        sx={{
          borderRadius: 3,
          fontWeight: 'bold',
          color: isProgressPercent ? '#fff' : 'white',
          background: isProgressPercent ? '#8C54FF' : 'transparent',
          borderColor: '#8C54FF',
          px: 2,
          py: 1,
          minWidth: 0,
          textTransform: 'none',
          fontSize: 18,
          fontFamily,
          letterSpacing: '.05rem',
          '&:hover': {
            background: '#8C54FF',
            color: '#fff',
          },
        }}
      >
        <PercentIcon />
      </Button>
      <Button
        variant={!isProgressPercent ? 'contained' : 'outlined'}
        onClick={() => setIsProgressPercent(false)}
        sx={{
          borderRadius: 3,
          fontWeight: 'bold',
          color: !isProgressPercent ? '#fff' : 'white',
          background: !isProgressPercent ? '#8C54FF' : 'transparent',
          borderColor: '#8C54FF',
          px: 2,
          py: 1,
          minWidth: 0,
          textTransform: 'none',
          fontSize: 18,
          fontFamily,
          letterSpacing: '.05rem',
          '&:hover': {
            background: '#8C54FF',
            color: '#fff',
          },
        }}
      >
        <BookIcon />
      </Button>
    </Box>
  </Box>
);

export default BookRatingProgressInput;
