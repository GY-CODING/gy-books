/* eslint-disable react/display-name */
import { Activity } from '@/domain/activity.model';
import type HardcoverBook from '@/domain/HardcoverBook';
import { useHardcoverBatch } from '@/hooks/books/useHardcoverBatch';
import { useActivities } from '@/hooks/useActivities';
import { lora } from '@/utils/fonts/fonts';
import { Box, Skeleton, Typography } from '@mui/material';
import { UUID } from 'crypto';
import Image from 'next/image';
import React, { useMemo } from 'react';

interface ActivityTabProps {
  id: UUID;
}

const ActivityTab: React.FC<ActivityTabProps> = ({ id }) => {
  const { data: activities, isLoading, uniqueBookIds } = useActivities(id);
  const { data: books, isLoading: booksLoading } =
    useHardcoverBatch(uniqueBookIds);

  // Crear un mapa de bookId -> imagen para acceso rápido
  const booksMap = useMemo(() => {
    if (!books) return new Map<string, string>();
    return new Map(
      books.map((book: HardcoverBook) => {
        const imageUrl = book.cover?.url || '/placeholder-book.png';
        return [String(book.id), imageUrl];
      })
    );
  }, [books]);

  const ActivityItem = React.memo(({ activity }: { activity: Activity }) => {
    const bookImage = activity.bookId ? booksMap.get(activity.bookId) : null;

    return (
      <Box
        component="a"
        href={`/books/${activity.bookId}`}
        key={activity.bookId}
        role="link"
        aria-label={`Go to book ${activity.bookId}`}
        sx={{
          p: 2,
          mb: 2,
          height: '100px',
          background: 'rgba(35, 35, 35, 0.85)',
          borderRadius: '12px',
          border: '1px solid #FFFFFF30',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          textDecoration: 'none',
          transition: 'background 0.2s',
          '&:hover': { background: 'rgba(60, 60, 60, 0.95)' },
        }}
        tabIndex={0}
      >
        {booksLoading || !bookImage ? (
          <Skeleton
            variant="rectangular"
            width={60}
            height={80}
            sx={{ borderRadius: 1, flexShrink: 0 }}
          />
        ) : (
          <Box
            sx={{
              position: 'relative',
              width: 60,
              height: 80,
              flexShrink: 0,
              borderRadius: 1,
              overflow: 'hidden',
            }}
          >
            <Image
              src={bookImage}
              alt="Book cover"
              fill
              sizes="60px"
              style={{ objectFit: 'cover' }}
            />
          </Box>
        )}
        <Typography
          variant="body1"
          sx={{
            color: '#fff',
            fontFamily: lora.style.fontFamily,
            fontSize: ['12px', '14px'],
          }}
        >
          {activity.message}
        </Typography>
        {activity.formattedDate && (
          <Typography
            variant="body2"
            sx={{
              color: '#AAAAAA',
              fontFamily: lora.style.fontFamily,
              marginLeft: 'auto',
            }}
          >
            {activity.formattedDate}
          </Typography>
        )}
      </Box>
    );
  });

  const SkeletonActivityItem = React.memo(() => (
    <Box
      sx={{
        p: 2,
        mb: 2,
        height: '100px',
        background: 'rgba(35, 35, 35, 0.85)',
        borderRadius: '12px',
        border: '1px solid #FFFFFF30',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Skeleton
        variant="rectangular"
        width={60}
        height={80}
        sx={{ borderRadius: 2 }}
      />
      <Skeleton
        variant="text"
        width="70%"
        height={24}
        sx={{ fontFamily: lora.style.fontFamily }}
      />
    </Box>
  ));

  return (
    <Box
      sx={{
        mt: 4,
        color: '#FFFFFF',
        fontFamily: lora.style.fontFamily,
        textAlign: 'center',
      }}
    >
      {isLoading ? (
        <Box sx={{ maxWidth: '100%', mx: 'auto' }}>
          {[...Array(5)].map((_, i) => (
            <SkeletonActivityItem key={i} />
          ))}
        </Box>
      ) : activities && activities.length > 0 ? (
        <Box
          sx={{
            maxHeight: '70vh',
            overflowY: 'auto',
            px: 1,
            scrollbarColor: ' #8C54FF transparent',
          }}
        >
          {activities.map((activity: Activity, index: number) => (
            <ActivityItem
              activity={activity}
              key={`${activity.bookId || 'activity'}-${index}-${activity.date ? new Date(activity.date).getTime() : Date.now()}`}
            />
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            mt: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography
            variant="body1"
            sx={{ color: '#fff', fontFamily: lora.style.fontFamily }}
          >
            No hay actividades disponibles.
          </Typography>
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.07)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              color: '#fff',
              opacity: 0.5,
            }}
          >
            💤
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ActivityTab;
