import Image from 'next/image';
import { useMediaQuery, useTheme } from '@mui/material';
import { User } from '@/domain/user.model';
import React from 'react';

export const UserImage = ({ user }: { user: User }) => {
  const theme = useTheme();

  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMd = useMediaQuery(theme.breakpoints.up('md'));

  let size = 100;
  if (isSm) size = 120;
  if (isMd) size = 160;

  return (
    <Image
      src={user?.picture || ''}
      alt={user?.username || ''}
      width={size}
      height={size}
      style={{
        borderRadius: '50%',
        border: '3px solid #8C54FF',
        backgroundColor: '#232323',
        marginLeft: isMd ? '16px' : '0',
        marginBottom: isMd ? '0' : '16px',
        alignSelf: isMd ? 'flex-start' : 'center',
        aspectRatio: '1/1',
        objectFit: 'cover',
      }}
    />
  );
};
