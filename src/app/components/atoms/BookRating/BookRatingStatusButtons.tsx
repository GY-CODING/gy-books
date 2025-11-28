import { EBookStatus } from '@gycoding/nebula';
import { Button, Stack } from '@mui/material';
import React from 'react';
import { StatusOption, statusOptions } from './BookRatingOptions';

interface Props {
  tempStatus: EBookStatus;
  setTempStatus: (status: EBookStatus) => void;
  fontFamily: string;
}

const BookRatingStatusButtons: React.FC<Props> = ({
  tempStatus,
  setTempStatus,
  fontFamily,
}) => (
  <Stack direction="row" spacing={2} justifyContent="center" pb={2}>
    {statusOptions.map((opt: StatusOption) => (
      <Button
        key={opt.value}
        variant={tempStatus === opt.value ? 'contained' : 'outlined'}
        startIcon={React.cloneElement(opt.icon, {
          sx: { color: tempStatus === opt.value ? '#fff' : '#8C54FF' },
        })}
        onClick={() => setTempStatus(opt.value)}
        sx={{
          borderRadius: 3,
          fontWeight: 'bold',
          color: tempStatus === opt.value ? '#fff' : '#8C54FF',
          background: tempStatus === opt.value ? '#8C54FF' : 'transparent',
          borderColor: '#8C54FF',
          px: 1,
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
