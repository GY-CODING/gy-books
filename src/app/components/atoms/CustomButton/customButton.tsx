import { SxProps } from '@mui/material';
import Button from '@mui/material/Button';
import React from 'react';

interface CustomButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'contained' | 'outlined';
  endIcon?: React.ReactNode;
  sx?: SxProps;
  variantComponent?: 'button' | 'link';
  href?: string;
  target?: string;
  isLoading?: boolean;
  disabled?: boolean;
  startIcon?: React.ReactNode;
  type?: 'ACTION' | 'CANCEL';
}

export const CustomButton = ({
  onClick,
  children,
  variant = 'contained',
  endIcon,
  startIcon,
  sx,
  disabled,
  variantComponent = 'button',
  href,
  target,
  isLoading,
  type = 'ACTION',
}: CustomButtonProps) => {
  return (
    <Button
      loading={isLoading}
      component={variantComponent === 'link' ? 'a' : 'button'}
      href={variantComponent === 'link' ? href : undefined}
      variant={variant}
      onClick={onClick}
      target={target}
      disabled={disabled}
      sx={{
        background:
          variant === 'contained'
            ? type === 'ACTION'
              ? 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)'
              : 'linear-gradient(135deg,rgb(234, 51, 51) 0%,rgb(206, 34, 34) 100%)'
            : 'transparent',
        border:
          variant === 'outlined'
            ? type === 'ACTION'
              ? '2px solid #9333ea'
              : '2px solid rgb(234, 51, 51)'
            : 'none',
        color: '#ffffff',
        fontWeight: 600,
        px: 3,
        py: 1.5,
        borderRadius: '12px',
        boxShadow:
          variant === 'contained'
            ? type === 'ACTION'
              ? '0 4px 12px rgba(147, 51, 234, 0.5)'
              : '0 4px 12px rgba(234, 51, 51, 0.21)'
            : 'none',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow:
            type === 'ACTION'
              ? '0 6px 20px rgba(147, 51, 234, 0.6)'
              : '0 6px 20px rgba(234, 51, 51, 0.6)',
          background:
            type === 'ACTION'
              ? 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)'
              : 'linear-gradient(135deg,rgb(234, 51, 51) 0%,rgb(206, 34, 34) 100%)',
        },
        '&:active': {
          transform: 'translateY(0)',
        },
        ...sx,
      }}
      endIcon={endIcon}
      startIcon={startIcon}
    >
      {children}
    </Button>
  );
};
