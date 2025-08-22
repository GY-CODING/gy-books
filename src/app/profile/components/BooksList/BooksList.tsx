import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { BookCardCompact } from '@/app/components/atoms/BookCardCompact';
import Book from '@/domain/book.model';

interface BooksListProps {
  books: Book[];
  loading: boolean;
  hasMore: boolean;
}

export const BooksList: React.FC<BooksListProps> = ({
  books,
  loading,
  hasMore,
}) => (
  <Box
    sx={{
      flex: 1,
      display: { xs: 'grid', sm: 'grid', md: 'flex' },
      width: '100%',
      gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr', md: 'none' },
      flexWrap: { xs: 'unset', md: 'wrap' },
      gap: 2,
      overflowY: 'auto',
      maxHeight: 560,
      minHeight: 340,
      alignItems: 'center',
      justifyContent: 'center',
      py: 1,
      background: 'transparent',
      scrollbarColor: '#8C54FF #232323',
      '&::-webkit-scrollbar': { width: 10 },
      '&::-webkit-scrollbar-thumb': { background: '#FFFFFF', borderRadius: 6 },
    }}
  >
    {books.map((book) => (
      <Box
        key={book.id}
        sx={{
          minWidth: { xs: 'unset', md: 140 },
          maxWidth: { xs: 'unset', md: 220 },
          width: { xs: '100%', sm: '100%', md: 'auto' },
          boxSizing: 'border-box',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          px: { xs: 0.5, sm: 1, md: 0 },
          py: { xs: 1, md: 0 },
          height: '100%',
        }}
      >
        <BookCardCompact book={book} small={false} />
      </Box>
    ))}
    {loading && (
      <Box sx={{ width: '100%', textAlign: 'center', py: 2 }}>
        <CircularProgress />
      </Box>
    )}
    {!hasMore && books.length > 0 && (
      <Box sx={{ width: '100%', textAlign: 'center', py: 2 }}>
        <Typography variant="body2" sx={{ color: '#fff' }}>
          Todos los libros cargados
        </Typography>
      </Box>
    )}
  </Box>
);
