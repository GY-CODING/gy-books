/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/display-name */
import {
  Activity,
  ActivityType,
  cleanMessage,
  extractProgress,
  extractRating,
  getActivityColor,
  getActivityType,
} from '@/domain/activity.model';
import type HardcoverBook from '@/domain/HardcoverBook';
import { useHardcoverBatch } from '@/hooks/books/useHardcoverBatch';
import { useActivities } from '@/hooks/useActivities';
import { lora } from '@/utils/fonts/fonts';
import BarChartIcon from '@mui/icons-material/BarChart';
import BookIcon from '@mui/icons-material/Book';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircleIcon from '@mui/icons-material/Circle';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import StarIcon from '@mui/icons-material/Star';
import { Box, Skeleton, Typography } from '@mui/material';
import { UUID } from 'crypto';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useMemo, useState } from 'react';

const MotionBox = motion(Box);

interface ActivityTabProps {
  id: UUID;
}

// Helper function to get icon component
const getActivityIconComponent = (type: ActivityType) => {
  switch (type) {
    case ActivityType.STARTED:
      return BookIcon;
    case ActivityType.FINISHED:
      return CheckCircleIcon;
    case ActivityType.RATED:
      return StarIcon;
    case ActivityType.PROGRESS:
      return BarChartIcon;
    case ActivityType.WANT_TO_READ:
      return BookmarkIcon;
    case ActivityType.OTHER:
      return CircleIcon;
    default:
      return CircleIcon;
  }
};

// Progress Badge Component
const ProgressBadge: React.FC<{ progress: number }> = React.memo(
  ({ progress }) => (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        px: 1,
        py: 0.5,
        borderRadius: '8px',
        background: 'rgba(147, 51, 234, 0.15)',
        border: '1px solid rgba(147, 51, 234, 0.2)',
        color: '#c084fc',
      }}
    >
      <BarChartIcon sx={{ fontSize: 14 }} />
      <Typography
        sx={{
          fontSize: 12,
          fontWeight: 600,
          fontFamily: lora.style.fontFamily,
        }}
      >
        {progress}%
      </Typography>
    </Box>
  )
);

// Rating Badge Component
const RatingBadge: React.FC<{ rating: number }> = React.memo(({ rating }) => (
  <Box
    sx={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 0.5,
      px: 1,
      py: 0.5,
      borderRadius: '6px',
      background: 'rgba(147, 51, 234, 0.15)',
      color: '#c084fc',
    }}
  >
    <StarIcon sx={{ fontSize: 14 }} />
    <Typography
      sx={{
        fontSize: 12,
        fontWeight: 600,
        fontFamily: lora.style.fontFamily,
      }}
    >
      {rating.toFixed(1)}
    </Typography>
  </Box>
));

// Book Cover Component with lazy loading
const BookCover: React.FC<{
  imageUrl: string | null;
  bookId: string;
  onLoad: () => void;
}> = React.memo(({ imageUrl, onLoad }) => {
  const [loaded, setLoaded] = useState(false);

  const handleLoad = () => {
    setLoaded(true);
    onLoad();
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: 70,
        height: 100,
        flexShrink: 0,
        borderRadius: 1,
        overflow: 'hidden',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
      }}
    >
      {imageUrl && (
        <Box
          component="img"
          src={imageUrl}
          alt="Book cover"
          onLoad={handleLoad}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
          }}
        />
      )}
    </Box>
  );
});

// Activity Item Component
const ActivityItem: React.FC<{
  activity: Activity & { likes?: string[] };
  index: number;
  bookImage: string | null;
  onImageLoad: () => void;
}> = React.memo(({ activity, index, bookImage, onImageLoad }) => {
  const activityType = getActivityType(activity.message);
  const ActivityIconComponent = getActivityIconComponent(activityType);
  const activityColor = getActivityColor(activityType);
  const progress = extractProgress(activity.message);
  const rating = extractRating(activity.message);
  const displayMessage = cleanMessage(activity.message);
  const likesCount = activity.likes?.length ?? 0;

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.4, 0, 0.2, 1],
      }}
      component="a"
      href={`/books/${activity.bookId}`}
      role="link"
      aria-label={`Go to book ${activity.bookId}`}
      sx={{
        p: 1.5,
        mb: 2,
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(16px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        textDecoration: 'none',
        transition: 'all 0.2s',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        '&:hover': {
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(147, 51, 234, 0.15)',
        },
      }}
      tabIndex={0}
    >
      <BookCover
        imageUrl={bookImage}
        bookId={activity.bookId || ''}
        onLoad={onImageLoad}
      />

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          alignItems: 'flex-start',
          textAlign: 'left',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            gap: 0.75,
          }}
        >
          <ActivityIconComponent
            sx={{
              fontSize: 14,
              color: activityColor,
            }}
          />
          {activity.formattedDate && (
            <Typography
              variant="body2"
              sx={{
                color: '#AAAAAA',
                fontFamily: lora.style.fontFamily,
                fontSize: 12,
              }}
            >
              {activity.formattedDate}
            </Typography>
          )}
        </Box>

        <Typography
          variant="body1"
          sx={{
            color: '#fff',
            fontFamily: lora.style.fontFamily,
            fontSize: 14,
            lineHeight: 1.5,
          }}
        >
          {displayMessage}
        </Typography>

        {/* Badges y likes en una fila */}
        {(progress !== null || rating !== null || likesCount > 0) && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              mt: 1,
            }}
          >
            {progress !== null && <ProgressBadge progress={progress} />}
            {rating !== null && <RatingBadge rating={rating} />}
            {likesCount > 0 && (
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                aria-hidden
              >
                <FavoriteRoundedIcon sx={{ fontSize: 16, color: '#e74c6f' }} />
                <Typography
                  sx={{
                    fontSize: 13,
                    color: '#e74c6f',
                    fontWeight: 600,
                    fontFamily: lora.style.fontFamily,
                  }}
                >
                  {likesCount}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </MotionBox>
  );
});

// Skeleton Loading Component
const SkeletonActivityItem: React.FC = React.memo(() => (
  <Box
    sx={{
      p: 1.5,
      mb: 2,
      background: 'rgba(255, 255, 255, 0.02)',
      backdropFilter: 'blur(16px)',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.04)',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 1.5,
    }}
  >
    <Skeleton
      variant="rectangular"
      width={70}
      height={100}
      sx={{ borderRadius: 1, flexShrink: 0 }}
    />
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <Skeleton variant="circular" width={14} height={14} />
        <Skeleton variant="text" width={80} height={12} />
      </Box>
      <Skeleton variant="text" width="100%" height={14} />
      <Skeleton variant="text" width="80%" height={14} />
      <Skeleton
        variant="rectangular"
        width={60}
        height={24}
        sx={{ borderRadius: '6px' }}
      />
    </Box>
  </Box>
));

// Empty State Component
const EmptyState: React.FC = React.memo(() => (
  <Box
    sx={{
      mt: 6,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 2,
    }}
  >
    <Box
      sx={{
        fontSize: 80,
        background: 'linear-gradient(135deg, #9333ea, #c084fc)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      🕐
    </Box>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Typography
        variant="h5"
        sx={{
          color: '#fff',
          fontFamily: lora.style.fontFamily,
          fontWeight: 700,
        }}
      >
        No Activity Yet
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: '#AAAAAA',
          fontFamily: lora.style.fontFamily,
        }}
      >
        Your reading activities will appear here
      </Typography>
    </Box>
  </Box>
));

// Main Component
const ActivityTab: React.FC<ActivityTabProps> = ({ id }) => {
  const { data: activities, isLoading } = useActivities(id);
  console.log(activities?.map((a) => a.likes.length));
  const { data: books } = useHardcoverBatch(
    (activities?.map((a) => a.bookId).filter(Boolean) as string[]) || []
  );
  const [loadedCount, setLoadedCount] = useState(0);

  // Crear un mapa de bookId -> imagen para acceso rápido
  const booksMap = useMemo(() => {
    if (!books) return new Map<string, string>();
    return new Map(
      books.map((book: HardcoverBook) => [
        String(book.id),
        book.cover?.url || '/placeholder-book.png',
      ])
    );
  }, [books]);

  const handleImageLoad = () => {
    setLoadedCount((prev) => prev + 1);
  };

  // Show skeleton only while initial loading
  const showSkeleton = isLoading;

  return (
    <Box
      sx={{
        mt: 4,
        color: '#FFFFFF',
        fontFamily: lora.style.fontFamily,
        textAlign: 'center',
      }}
    >
      <AnimatePresence mode="wait">
        {showSkeleton ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Box sx={{ maxWidth: '100%', mx: 'auto' }}>
              {[...Array(5)].map((_, i) => (
                <SkeletonActivityItem key={i} />
              ))}
            </Box>
          </motion.div>
        ) : activities && activities.length > 0 ? (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Box
              sx={{
                maxHeight: '70vh',
                overflowY: 'auto',
                px: 1,
                scrollbarColor: '#9333ea transparent',
                '&::-webkit-scrollbar': { width: 8 },
                '&::-webkit-scrollbar-track': {
                  background: 'rgba(147, 51, 234, 0.1)',
                },
                '&::-webkit-scrollbar-thumb': {
                  background:
                    'linear-gradient(135deg, #9333ea 0%, #a855f7 100%)',
                  borderRadius: 4,
                },
              }}
            >
              {activities.map((activity: Activity, index: number) => (
                <ActivityItem
                  key={`${activity.bookId || 'activity'}-${index}-${activity.date ? new Date(activity.date).getTime() : Date.now()}`}
                  activity={activity}
                  index={index}
                  bookImage={
                    activity.bookId
                      ? booksMap.get(activity.bookId) || null
                      : null
                  }
                  onImageLoad={handleImageLoad}
                />
              ))}
            </Box>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <EmptyState />
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default ActivityTab;
