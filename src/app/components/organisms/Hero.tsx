'use client';

import { goudi, birthStone } from '@/utils/fonts/fonts';
import {
  Box,
  Typography,
  Button,
  Container,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import LottieAnimation from '@/app/components/atoms/LottieAnimation/LottieAnimation';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export const Hero = () => {
  const router = useRouter();
  const [animationData, setAnimationData] = useState<object | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const animationWidth = isMobile ? '300px' : isTablet ? '400px' : '500px';

  useEffect(() => {
    fetch('/lottie/hero.json')
      .then((res) => res.json())
      .then((data) => setAnimationData(data));
  }, []);

  return (
    <Container
      maxWidth="lg"
      sx={{ position: 'relative', py: { xs: 6, md: 10 } }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '-30%',
          left: '60%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '600px',
          background:
            'radial-gradient(circle, rgba(147, 51, 234, 0.1) 0%, rgba(147, 51, 234, 0) 70%)',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
          <Typography
            variant="h1"
            sx={{
              color: 'white',
              fontSize: { xs: '3rem', md: '7rem' },
              fontWeight: '800',
              fontFamily: birthStone.style.fontFamily,
              marginBottom: '1.5rem',
              position: 'relative',
              zIndex: 1,
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            WingWords
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: '#FFFFFF80',
              marginBottom: '2.5rem',
              lineHeight: 1.6,
              position: 'relative',
              fontFamily: goudi.style.fontFamily,
              zIndex: 1,
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            Discover, share, and connect with other readers.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => router.push('/books')}
            sx={{
              background: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)',
              color: 'white',
              padding: '1.2rem 2.5rem',
              fontSize: '1.2rem',
              fontFamily: goudi.style.fontFamily,
              fontWeight: 'bold',
              letterSpacing: '.3rem',
              borderRadius: '12px',
              boxShadow: '0 4px 14px rgba(147, 51, 234, 0.4)',
              transition: 'all 0.3s ease',
              position: 'relative',
              zIndex: 1,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(147, 51, 234, 0.6)',
                background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
              },
            }}
          >
            Explore Library
          </Button>
        </Box>
        <Box
          sx={{
            flex: 1,
            display: ['none', 'flex'],
            justifyContent: 'center',
            alignItems: 'center',
            mt: { xs: 4, md: 0 },
          }}
        >
          {animationData && (
            <LottieAnimation
              loop
              animationData={animationData}
              style={{ width: animationWidth, height: '80%', maxWidth: '100%' }}
            />
          )}
        </Box>
      </Box>
    </Container>
  );
};
