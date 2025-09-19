import React from 'react';
import { Box, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { goudi } from '@/utils/fonts/fonts';
import { Author } from '@/domain/book.model';

export default function AuthorCard({ author }: { author: Author }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '100%',
        height: '290px',
        backgroundColor: 'rgba(42, 42, 42, 0.7)',
        backdropFilter: 'blur(10px)',
        padding: '16px',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'all 0.3s ease',
        '&:hover': {
          backgroundColor: 'rgba(42, 42, 42, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: '0rem', md: '1rem' },
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            width: { xs: '100%', md: '200px' },
            height: { xs: '100px', md: '100%' },
            position: 'relative',
            borderRadius: { xs: '20px', md: '16px' },
            overflow: 'hidden',
            display: 'flex',
            flexDirection: { xs: 'row', md: 'column' },
            alignItems: 'center',
            gap: { xs: '1rem', md: '0' },
            justifyContent: 'start',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          }}
        >
          <Box
            component="img"
            src={author.image?.url || ''}
            alt={author.name}
            sx={{
              width: { xs: '100px', md: '100%' },
              height: '100%',
              objectFit: 'cover',
              borderRadius: '16px',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          />
          <Typography
            variant="h2"
            sx={{
              fontWeight: '800',
              fontFamily: goudi.style.fontFamily,
              display: { xs: 'block', md: 'none' },
              fontSize: { xs: '20px', md: '30px' },
            }}
          >
            {author.name}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontSize: 28,
              letterSpacing: '.05rem',
              fontWeight: '800',
              fontFamily: goudi.style.fontFamily,
              display: { xs: 'none', md: 'block' },
            }}
          >
            {author.name}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontWeight: '400',
              fontFamily: goudi.style.fontFamily,
              fontSize: { sx: 12, md: 17 },
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 5,
              WebkitBoxOrient: 'vertical',
              marginBottom: { xs: '0px', md: '12px' },
            }}
          >
            {author.biography}
          </Typography>
          <Typography
            sx={{
              color: '#FFFFFF50',
              fontSize: '16px',
              fontWeight: 'bold',
              textAlign: 'left',
              position: 'absolute',
              fontFamily: goudi.style.fontFamily,
              letterSpacing: '.05rem',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'start',
              gap: '5px',
              bottom: '0',
              transition: 'all 0.3s ease',
              '&:hover': {
                color: '#FFFFFF',
                transform: 'translateX(5px)',
              },
            }}
          >
            Leer Más{' '}
            <ArrowForwardIcon sx={{ fontSize: '14px', marginLeft: '5px' }} />
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
