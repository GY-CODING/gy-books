'use client';

import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useParams } from 'next/navigation';
import { Inter } from 'next/font/google';
import { useBook } from '@/hooks/useBook';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
});

export default function BookDetails() {
  const params = useParams();
  const { data: book, isLoading } = useBook(params.id as string);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#161616',
        }}
      >
        <CircularProgress sx={{ color: 'white' }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#161616',
        padding: '2rem',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: '2rem',
      }}
    >
      <Box
        sx={{
          width: { xs: '100%', md: '40%' },
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box
          component="img"
          src={book?.cover.url}
          alt={book?.title}
          sx={{
            width: '100%',
            maxWidth: { xs: '100%', md: '400px' },
            height: { xs: 'auto', md: '700px' },
            borderRadius: '16px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          }}
        />
      </Box>
      <Box
        sx={{
          width: { xs: '100%', md: '60%' },
          color: 'white',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: '0rem', md: '1rem' },
            alignItems: 'center',
            justifyContent: 'start',
            width: '100%',
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontFamily: inter.style.fontFamily,
              fontWeight: '800',
              marginBottom: '1rem',
            }}
          >
            {book?.title}
          </Typography>
          {book?.series && (
            <Typography
              variant="h5"
              sx={{
                color: '#FFFFFF45',
                fontStyle: 'italic',
                marginBottom: '1rem',
              }}
            >
              ({book.series.name})
            </Typography>
          )}
        </Box>
        <Typography
          variant="h6"
          sx={{
            color: '#FFFFFF31',
            marginBottom: '2rem',
            textAlign: { xs: 'center', md: 'left' },
            fontWeight: '800',
          }}
        >
          {book?.author.name}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            lineHeight: 1.6,
            marginBottom: '2rem',
          }}
          dangerouslySetInnerHTML={{ __html: book?.description ?? '' }}
        />
      </Box>
    </Box>
  );
}
