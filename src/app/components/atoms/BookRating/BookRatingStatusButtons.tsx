import React from 'react';
import { Button, Stack } from '@mui/material';
import { EStatus } from '@/utils/constants/EStatus';
import { statusOptions, StatusOption } from './BookRatingOptions';

interface Props {
  tempStatus: EStatus;
  setTempStatus: (status: EStatus) => void;
  fontFamily: string;
}

const BookRatingStatusButtons: React.FC<Props> = ({
  tempStatus,
  setTempStatus,
  fontFamily,
}) => (
  <Stack direction="row" flexWrap="wrap" spacing={2} justifyContent="center">
    {statusOptions.map((opt: StatusOption) => (
      <Button
        key={opt.value}
        variant={tempStatus === opt.value ? 'contained' : 'outlined'}
        startIcon={React.cloneElement(opt.icon, {
          sx: { color: tempStatus === opt.value ? '#fff' : '#fff' },
        })}
        onClick={() => setTempStatus(opt.value)}
        sx={{
          borderRadius: 3,
          fontWeight: 'bold',
          color: tempStatus === opt.value ? '#fff' : 'white',
          background: tempStatus === opt.value ? '#8C54FF' : 'transparent',
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
        {opt.label}
      </Button>
    ))}
  </Stack>
);

export default BookRatingStatusButtons;
