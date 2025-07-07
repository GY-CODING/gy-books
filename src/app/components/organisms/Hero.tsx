'use client';

import { goudi, birthStone } from '@/utils/fonts/fonts';
import { Box, Typography, Button, Container } from '@mui/material';
import { useRouter } from 'next/navigation';
import React from 'react';

export const Hero = () => {
  const router = useRouter();

  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative' }}>
      <Box
        sx={{
          position: 'absolute',
          top: '-50%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '600px',
          background:
            'radial-gradient(circle, rgba(147, 51, 234, 0.1) 0%, rgba(147, 51, 234, 0) 70%)',
          zIndex: 0,
        }}
      />
      <Typography
        variant="h1"
        sx={{
          color: 'white',
          fontSize: { xs: '3rem', md: '10rem' },
          fontWeight: '800',
          fontFamily: birthStone.style.fontFamily,
          marginBottom: '1.5rem',
          position: 'relative',
          zIndex: 1,
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
        }}
      >
        Descubre, comparte y conecta con otros lectores.
      </Typography>
      <Button
        variant="contained"
        size="large"
        id="explorar-biblioteca-button"
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
        Explorar Biblioteca
      </Button>
    </Container>
  );
};
