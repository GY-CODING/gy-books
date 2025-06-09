'use client';

import React from 'react';
import { Box, Container } from '@mui/material';
import { Hero } from './components/organisms/Hero';
import { FeaturesSection } from './components/organisms/FeaturesSection';
import { CTASection } from './components/organisms/CTASection';
import { Footer } from './components/organisms/Footer';

export default function Home() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#161616',
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'radial-gradient(circle at center, rgba(147, 51, 234, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 1,
          px: { xs: 2, sm: 3, md: 4 },
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 4, sm: 6, md: 8 },
          py: { xs: 4, sm: 6, md: 8 },
        }}
      >
        <Hero />
        <FeaturesSection />
        <CTASection />
      </Container>
      <Box sx={{ mt: 'auto' }}>
        <Footer />
      </Box>
    </Box>
  );
}
