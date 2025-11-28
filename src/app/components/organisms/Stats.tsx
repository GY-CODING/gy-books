import React from 'react';
import { UUID } from 'crypto';
import { useStats } from '@/hooks/useStats';
import { useStatsFromBooks } from '@/hooks/useStatsFromBooks';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import AuthorsBarChart from '../molecules/AuthorsBarChart';
import { Box, Typography } from '@mui/material';
import DonutChart from '../molecules/DonutChart';
import PageCountKPI from '../molecules/PageCountKPI';
import RatingStats from '../molecules/RatingStats';
import { lora } from '@/utils/fonts/fonts';
import StatsSkeleton from '../molecules/StatsSkeleton';
import type HardcoverBook from '@/domain/HardcoverBook';

interface StatsComponentProps {
  id: UUID;
  books?: HardcoverBook[];
  booksLoading?: boolean;
}

/**
 * Componente de estadísticas optimizado.
 *
 * Calcula stats de dos formas (en orden de prioridad):
 * 1. Si recibe `books` como prop, calcula stats en memoria (rápido)
 * 2. Si no, usa el hook `useStats` tradicional (fetch al backend)
 *
 * También integra Redux para cachear stats del usuario actual.
 */
export default function StatsComponent({
  id,
  books,
  booksLoading = false,
}: StatsComponentProps) {
  const storedStats = useSelector((state: RootState) => state.stats);
  const isCurrentUser = storedStats.userId === id.toString();

  // Hook de stats desde libros (si están disponibles)
  const statsFromBooks = useStatsFromBooks(books, booksLoading);

  // Hook de stats desde API (fallback) - SOLO si no hay books
  // Pasamos null para que SWR no ejecute el fetch
  const shouldFetchFromAPI = !books || books.length === 0;
  const statsFromAPI = useStats(shouldFetchFromAPI ? id : null);

  // Decidir qué fuente usar (prioridad: Redux > books > API)
  const data =
    isCurrentUser && storedStats.data
      ? storedStats.data
      : books && books.length > 0
        ? statsFromBooks.data
        : statsFromAPI.data;

  const isLoading =
    isCurrentUser && storedStats.data
      ? storedStats.isLoading
      : books && books.length > 0
        ? statsFromBooks.isLoading
        : statsFromAPI.isLoading;

  const error =
    isCurrentUser && storedStats.data
      ? storedStats.error
        ? new Error(storedStats.error)
        : null
      : books && books.length > 0
        ? statsFromBooks.error
        : statsFromAPI.error;
  if (isLoading) return <StatsSkeleton />;

  if (error) return <div>Error: {error.message}</div>;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row ',
        gap: 2,
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          width: '500px',
          height: '400px',
          backgroundColor: '#121212',
          borderRadius: '10px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 2,
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Typography
          sx={{ color: 'white', fontFamily: lora.style.fontFamily }}
          variant="h4"
        >
          Authors read
        </Typography>
        <AuthorsBarChart authors={data?.authors} />
      </Box>
      <Box
        sx={{
          width: '500px',
          height: '400px',
          backgroundColor: '#121212',
          borderRadius: '10px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 2,
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Typography
          sx={{ color: 'white', fontFamily: lora.style.fontFamily }}
          variant="h4"
        >
          Book status
        </Typography>
        <DonutChart bookStatus={data?.bookStatus} />
      </Box>
      <Box
        sx={{
          width: '500px',
          height: '400px',
          backgroundColor: '#121212',
          borderRadius: '10px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 2,
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Typography
          sx={{ color: 'white', fontFamily: lora.style.fontFamily }}
          variant="h4"
        >
          Page Count
        </Typography>
        <PageCountKPI
          totalPages={data?.totalPages || 0}
          wantToReadPages={data?.wantToReadPages || 0}
          bookStatus={data?.bookStatus || {}}
          fontFamily={lora.style.fontFamily}
        />
      </Box>
      <Box
        sx={{
          width: '500px',
          height: '400px',
          backgroundColor: '#121212',
          borderRadius: '10px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 2,
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Typography
          sx={{ color: 'white', fontFamily: lora.style.fontFamily }}
          variant="h4"
        >
          Rating Stats
        </Typography>
        <RatingStats
          ratings={
            data?.ratings || {
              distribution: {},
              averageRating: 0,
              totalRatedBooks: 0,
            }
          }
          fontFamily={lora.style.fontFamily}
        />
      </Box>
    </Box>
  );
}
