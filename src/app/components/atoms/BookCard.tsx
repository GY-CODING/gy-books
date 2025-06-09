import Book from '@/domain/book.model';
import { Box, Typography } from '@mui/material';
import React from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { Inter } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
});

export function BookCard({ book }: { book: Book }) {
  return (
    <Box
      component="a"
      href={`/books/${book.id}`}
      key={book.id}
      sx={{
        width: '100%',
        textDecoration: 'none',
        minWidth: '300px',
        maxWidth: '1000px',
        height: '250px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#232323',
        borderRadius: '32px',
        padding: '16px',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          width: '180px',
          height: '100%',
          borderRadius: '16px',
        }}
      >
        <Box
          component="img"
          sx={{
            width: { xs: '100%', md: '100%' },
            height: { xs: '100%', md: '100%' },
            objectFit: 'cover',
            borderRadius: '16px',
          }}
          src={book.cover.url}
          alt={book.title}
        />
      </Box>
      <Box
        sx={{
          width: { xs: '60%', md: '85%' },
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'start',
          alignItems: 'start',
          padding: '25px',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'start', md: 'center' },
            justifyContent: 'start',
            gap: { xs: '0px', md: '8px' },
            width: '100%',
          }}
        >
          <Typography
            sx={{
              color: 'white',
              fontSize: { xs: '18px', md: '28px' },
              fontWeight: '800',
              fontFamily: inter.style.fontFamily,
              textAlign: 'left',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: { xs: 'normal', md: 'nowrap' },
              width: '100%',
              display: '-webkit-box',
              WebkitLineClamp: { xs: 4, md: 1 },
              WebkitBoxOrient: 'vertical',
            }}
            variant="h6"
          >
            {book.title}
          </Typography>
          {book.series != null && (
            <Typography
              sx={{
                color: '#FFFFFF45',
                fontSize: { xs: '16px', md: '20px' },
                fontWeight: 'thin',
                textAlign: 'left',
                fontStyle: 'italic',
                whiteSpace: 'nowrap',
              }}
              variant="h6"
            >
              ({book.series.name})
            </Typography>
          )}
        </Box>
        <Typography
          sx={{
            color: '#FFFFFF31',
            fontSize: { xs: '14px', md: '16px' },
            fontWeight: 'bold',
            textAlign: 'left',
            marginTop: { xs: '0px', md: '-10px' },
            width: '100%',
          }}
          variant="h6"
        >
          {book.author.name}
        </Typography>
        <Typography
          sx={{
            display: { xs: 'none', md: '-webkit-box' },
            color: '#FFFFFF',
            marginTop: '10px',
            fontSize: '14px',
            fontWeight: 'thin',
            flexDirection: 'row',
            alignItems: 'start',
            justifyContent: 'start',
            whiteSpace: 'pre-wrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            lineClamp: 3,
            boxOrient: 'vertical',
            width: '100%',
            textAlign: 'left',
          }}
          dangerouslySetInnerHTML={{ __html: book.description }}
          variant="h6"
        ></Typography>
        <Typography
          sx={{
            color: '#FFFFFF50',
            fontSize: '14px',
            fontWeight: 'bold',
            textAlign: 'left',
            marginTop: '10px',
            position: 'absolute',
            fontFamily: inter.style.fontFamily,
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'start',
            gap: '5px',
            bottom: '0',
          }}
        >
          Leer Más{' '}
          <ArrowForwardIcon sx={{ fontSize: '14px', marginLeft: '5px' }} />
        </Typography>
      </Box>
    </Box>
  );
}
