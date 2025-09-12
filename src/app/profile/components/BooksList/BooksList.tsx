import React from 'react';
import { Box, Typography } from '@mui/material';
import { BookCardCompact } from '@/app/components/atoms/BookCardCompact';
import Book from '@/domain/book.model';

interface BooksListProps {
  books: Book[];
  hasMore: boolean;
}

export const BooksList: React.FC<BooksListProps> = ({ books, hasMore }) => (
  <Box
    sx={{
      flex: 1,
      display: {
        xs: 'grid',
        sm: 'grid',
        md: 'flex',
      },
      gridTemplateColumns: {
        xs: '1fr 1fr',
        sm: '1fr 1fr',
        md: 'none',
      },
      flexDirection: { xs: 'unset', md: 'unset' },
      width: '100%',
      flexWrap: { xs: 'unset', md: 'wrap' },
      gap: { xs: 1, sm: 2 },
      overflowY: 'auto',
      maxHeight: { xs: 'calc(100vh - 180px)', md: 560 },
      minHeight: 240,
      alignItems: { xs: 'stretch', md: 'center' },
      justifyContent: { xs: 'flex-start', md: 'center' },
      py: { md: 1 },
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
          justifyContent: { xs: 'center', md: 'center' },
          alignItems: { xs: 'stretch', md: 'center' },
          px: { xs: 0, sm: 1, md: 0 },
          py: { xs: 0.5, md: 0 },
          height: { xs: 'auto', md: '100%' },
        }}
      >
        <BookCardCompact book={book} small={true} />
      </Box>
    ))}
    {!hasMore && books.length > 0 && (
      <Box sx={{ width: '100%', textAlign: 'center', py: 2 }}>
        <Typography variant="body2" sx={{ color: '#fff' }}>
          Todos los libros cargados
        </Typography>
      </Box>
    )}
  </Box>
);
