import React from 'react';
import { Box, Skeleton } from '@mui/material';

export const BooksListSkeleton: React.FC = () => (
  <Box sx={{ width: '100%', mb: 2 }}>
    {/* Skeleton para filtros */}
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 1, sm: 2, md: 3 },
        px: { xs: 0.5, sm: 1, md: 2 },
        mb: 2,
        borderRadius: '12px',
        minHeight: 48,
        maxWidth: { xs: '100%', md: 700 },
        mx: 'auto',
      }}
    >
      {[...Array(4)].map((_, i) => (
        <Skeleton
          key={i}
          variant="rectangular"
          sx={{ borderRadius: 2, width: '100%', height: 40, flex: 1 }}
        />
      ))}
    </Box>
    {/* Skeleton para lista de libros */}
    <Box
      sx={{
        flex: 1,
        display: { xs: 'grid', sm: 'grid', md: 'flex' },
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'none' },
        flexWrap: { xs: 'unset', md: 'wrap' },
        gap: 2,
        overflowY: 'auto',
        maxHeight: 560,
        minHeight: 340,
        alignItems: 'center',
        justifyContent: 'center',
        py: 1,
        background: 'transparent',
      }}
    >
      {[...Array(6)].map((_, i) => (
        <Skeleton
          key={i}
          variant="rectangular"
          sx={{ borderRadius: 3, width: { xs: '100%', md: 140 }, height: 220 }}
        />
      ))}
    </Box>
  </Box>
);
