'use client';

import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useGyCodingUser } from '@/contexts/GyCodingUserContext';
import { goudi } from '@/utils/fonts/fonts';

export const CTASection = () => {
  const router = useRouter();
  const { user } = useGyCodingUser();

  return (
    <Container
      maxWidth="md"
      sx={{ textAlign: 'center', marginTop: '2rem', position: 'relative' }}
    >
      <Box
        sx={{
          position: 'absolute',
          bottom: '-50%',
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
        variant="h4"
        sx={{
          color: 'white',
          marginBottom: '2rem',
          fontWeight: '700',
          position: 'relative',
          fontSize: 40,
          zIndex: 1,
          fontFamily: goudi.style.fontFamily,
          letterSpacing: '.05rem',
        }}
      >
        {user ? 'Conecta con Otros Lectores' : 'Únete a la Comunidad'}
      </Typography>
      <Typography
        sx={{
          color: '#FFFFFF80',
          marginBottom: '2.5rem',
          fontSize: '1.4rem',
          lineHeight: 1.6,
          position: 'relative',
          fontFamily: goudi.style.fontFamily,
          letterSpacing: '.05rem',
          zIndex: 1,
        }}
      >
        {user
          ? 'Descubre lectores con gustos similares y comparte tus experiencias literarias.'
          : 'Conecta con otros lectores, comparte tus experiencias y descubre tu próxima lectura favorita.'}
      </Typography>
      <Button
        id={user ? 'search-friends-button' : 'create-account-button'}
        variant="outlined"
        size="large"
        onClick={() => router.push(user ? '/friends' : '/api/auth/login')}
        sx={{
          borderColor: '#9333ea',
          color: 'white',
          padding: '1.2rem 2.5rem',
          fontSize: '1.2rem',
          fontFamily: goudi.style.fontFamily,
          fontWeight: 'bold',
          letterSpacing: '.3rem',
          borderRadius: '12px',
          transition: 'all 0.3s ease',
          position: 'relative',
          zIndex: 1,
          '&:hover': {
            borderColor: '#a855f7',
            backgroundColor: 'rgba(147, 51, 234, 0.1)',
            transform: 'translateY(-2px)',
          },
        }}
      >
        {user ? 'Buscar Amigos' : 'Crear Cuenta'}
      </Button>
    </Container>
  );
};
