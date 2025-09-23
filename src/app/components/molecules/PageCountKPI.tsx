import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

interface PageCountKPIProps {
  totalPages: number;
  wantToReadPages: number;
  bookStatus: Record<string, number>;
  fontFamily: string;
}

const PageCountKPI: React.FC<PageCountKPIProps> = ({
  totalPages,
  wantToReadPages,
  fontFamily,
}) => {
  const [currentCount, setCurrentCount] = useState(0);
  const [percentage, setPercentage] = useState(0);

  // Target values for animation
  const targetPages = totalPages || 0;
  // Goal es las páginas leídas + las páginas de want to read
  const goalPages = targetPages + (wantToReadPages || 0);

  useEffect(() => {
    if (targetPages === 0) return;

    const duration = 2000; // 2 seconds animation
    const steps = 60; // 60 frames
    const increment = targetPages / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newCount = Math.min(
        Math.floor(increment * currentStep),
        targetPages
      );
      setCurrentCount(newCount);
      setPercentage((newCount / goalPages) * 100);

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [targetPages, goalPages]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
      }}
    >
      {/* Main Count Display */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography
          sx={{
            color: '#8C54FF',
            fontFamily: fontFamily,
            fontSize: '3.5rem',
            fontWeight: 'bold',
            lineHeight: 1,
            textShadow: '0 0 20px rgba(140, 84, 255, 0.5)',
          }}
        >
          {currentCount.toLocaleString()}
        </Typography>
        <Typography
          sx={{
            color: 'white',
            fontFamily: fontFamily,
            fontSize: '1.2rem',
            opacity: 0.8,
            mt: 1,
          }}
        >
          Pages Read
        </Typography>
      </Box>

      {/* Progress Bar */}
      <Box
        sx={{
          width: '80%',
          height: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            width: `${Math.min(percentage, 100)}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #8C54FF 0%, #A855F7 100%)',
            borderRadius: '4px',
            transition: 'width 0.1s ease-out',
            boxShadow: '0 0 10px rgba(140, 84, 255, 0.6)',
          }}
        />
      </Box>

      {/* Progress Percentage & Goal */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography
          sx={{
            color: '#8C54FF',
            fontFamily: fontFamily,
            fontSize: '1.5rem',
            fontWeight: 'bold',
          }}
        >
          {percentage.toFixed(1)}%
        </Typography>
        <Typography
          sx={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontFamily: fontFamily,
            fontSize: '0.9rem',
          }}
        >
          Goal: {goalPages.toLocaleString()} pages
        </Typography>
        <Typography
          sx={{
            color: 'rgba(255, 255, 255, 0.25)',
            fontFamily: fontFamily,
            fontSize: '0.8rem',
            fontStyle: 'italic',
            mt: 0.5,
            maxWidth: '300px',
            textAlign: 'center',
          }}
        >
          The total goal value is an addition of read pages and want to read
          pages
        </Typography>
      </Box>
    </Box>
  );
};

export default PageCountKPI;
