import { birthStone } from '@/utils/fonts/fonts';
import { SxProps, Typography } from '@mui/material';
import React from 'react';

interface CustomTitleProps {
  text?: string;
  size?: string;
  fontFamily?: string;
  sx?: SxProps;
  [key: string]: unknown;
}
export default function CustomTitle({
  text,
  size,
  fontFamily,
  sx,
  ...props
}: CustomTitleProps) {
  return (
    <Typography
      variant="h1"
      sx={{
        fontSize: size || { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
        fontWeight: 'bold',
        color: 'white',
        fontFamily: fontFamily || birthStone.style.fontFamily,
        ...sx,
      }}
      {...props}
    >
      {text}
    </Typography>
  );
}
