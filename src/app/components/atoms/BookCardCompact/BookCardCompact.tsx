import React from 'react';
import { Box, Typography, Chip, Rating, Skeleton } from '@mui/material';
import Book from '@/domain/book.model';
import { useRouter } from 'next/navigation';
import { Library } from '@/domain/library.model';
import { goudi } from '@/utils/fonts/fonts';

interface BookCardCompactProps {
  book: Book;
  library?: Library;
  onClick?: () => void;
  small?: boolean;
}

export const BookCardCompactSkeleton = () => {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        backgroundColor: '#232323',
        borderRadius: '16px',
        overflow: 'hidden',
      }}
    >
      {/* Skeleton de la imagen */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          paddingTop: '150%', // Aspect ratio 2:3
          overflow: 'hidden',
        }}
      >
        <Skeleton
          variant="rectangular"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'rgba(255, 255, 255, 0.1)',
          }}
          animation="wave"
        />
      </Box>

      {/* Skeleton del contenido */}
      <Box
        sx={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {/* Skeleton del título */}
        <Skeleton
          variant="text"
          width="80%"
          height={24}
          sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }}
        />

        {/* Skeleton del rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Skeleton
            variant="text"
            width={100}
            height={20}
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }}
          />
        </Box>

        {/* Skeleton de las estadísticas */}
        <Box
          sx={{ display: 'flex', flexDirection: 'column', gap: '4px', mt: 0.5 }}
        >
          <Skeleton
            variant="text"
            width={120}
            height={16}
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }}
          />
          <Skeleton
            variant="text"
            width={100}
            height={16}
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }}
          />
        </Box>

        {/* Skeleton del autor */}
        <Skeleton
          variant="text"
          width="60%"
          height={20}
          sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }}
        />

        {/* Skeleton del chip de serie */}
        <Skeleton
          variant="rectangular"
          width={80}
          height={24}
          sx={{
            borderRadius: '12px',
            bgcolor: 'rgba(255, 255, 255, 0.1)',
          }}
        />
      </Box>
    </Box>
  );
};

export const BookCardCompact = ({
  book,
  onClick,
  small = false,
}: BookCardCompactProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(`/books/${book.id}`);
    }
  };

  return (
    <Box
      component="a"
      href={`/books/${book.id}`}
      onClick={(e) => {
        e.preventDefault();
        handleClick();
      }}
      sx={{
        width: small ? '160px' : '220px',
        minWidth: small ? '160px' : '220px',
        maxWidth: small ? '160px' : '220px',
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        position: 'relative',
        backgroundColor: '#232323',
        borderRadius: '16px',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          backgroundColor: '#2a2a2a',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
        },
      }}
    >
      {/* Imagen del libro */}
      <Box
        sx={{
          position: 'relative',
          width: small ? '160px' : '220px',
          height: small ? '210px' : '330px',
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={book.cover.url || '/placeholder-book.jpg'}
          alt={book.title}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            display: 'block',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        />
      </Box>

      {/* Contenido */}
      <Box
        sx={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {/* Título y Rating */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Typography
            variant="subtitle1"
            sx={{
              color: '#FFFFFF',
              fontWeight: '800',
              fontSize: '1.1rem',
              fontFamily: goudi.style.fontFamily,
              letterSpacing: '.05rem',
              lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {book.title}
          </Typography>
          <Typography
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '1rem',
              fontFamily: goudi.style.fontFamily,
              letterSpacing: '.05rem',
              fontWeight: '500',
            }}
          >
            {book.author.name}
          </Typography>
          {book.rating !== undefined && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Rating
                value={book.rating}
                precision={0.5}
                readOnly
                size="small"
                sx={{
                  '& .MuiRating-iconFilled': {
                    color: 'primary.main',
                  },
                  '& .MuiRating-iconEmpty': {
                    color: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              />
            </Box>
          )}
        </Box>

        {/* Autor */}

        {/* Series */}
        {book.series && (
          <Chip
            label={book.series.name}
            size="small"
            sx={{
              alignSelf: 'flex-start',
              backgroundColor: 'rgba(147, 51, 234, 0.1)',
              color: 'primary.main',
              fontSize: '.85rem',
              fontFamily: goudi.style.fontFamily,
              letterSpacing: '.05rem',
              fontWeight: '800',
              height: '24px',
              borderRadius: '12px',
              border: '1px solid rgba(147, 51, 234, 0.2)',
              '&:hover': {
                backgroundColor: 'rgba(147, 51, 234, 0.15)',
              },
            }}
          />
        )}
      </Box>
    </Box>
  );
};
