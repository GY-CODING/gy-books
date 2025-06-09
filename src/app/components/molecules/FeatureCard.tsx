'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

interface FeatureCardProps {
  title: string;
  description: string;
  features: string[];
  icon: React.ReactElement<SvgIconComponent>;
}

export const FeatureCard = ({
  title,
  description,
  features,
  icon,
}: FeatureCardProps) => {
  return (
    <Box
      sx={{
        backgroundColor: '#232323',
        padding: '2.5rem',
        borderRadius: '24px',
        height: '100%',
        transition: 'all 0.3s ease',
        border: '1px solid rgba(147, 51, 234, 0.1)',
        '&:hover': {
          transform: 'translateY(-5px)',
          border: '1px solid rgba(147, 51, 234, 0.2)',
          boxShadow: '0 8px 32px rgba(147, 51, 234, 0.1)',
        },
      }}
    >
      <Box
        sx={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}
      >
        <Box
          sx={{
            backgroundColor: 'rgba(147, 51, 234, 0.1)',
            padding: '1rem',
            borderRadius: '16px',
            marginRight: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ color: '#9333ea', fontSize: 32 }}>{icon}</Box>
        </Box>
        <Typography
          variant="h5"
          sx={{
            color: 'white',
            fontWeight: '700',
          }}
        >
          {title}
        </Typography>
      </Box>
      <Typography
        sx={{ color: '#FFFFFF80', marginBottom: '1.5rem', lineHeight: 1.6 }}
      >
        {description}
      </Typography>
      <Box sx={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {features.map((feature, index) => (
          <Typography
            key={index}
            sx={{ color: '#FFFFFF60', fontSize: '0.9rem' }}
          >
            • {feature}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};
