import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { DEFAULT_COVER_IMAGE } from '@/utils/constants/constants';

interface Book {
  id: string;
  title: string;
  cover?: { url?: string };
}

interface HallOfFameCarouselProps {
  books: Book[];
  currentIndex: number;
  setCurrentIndex: (i: number) => void;
}

export const HallOfFameCarousel: React.FC<HallOfFameCarouselProps> = ({
  books,
  currentIndex,
  setCurrentIndex,
}) => {
  const router = useRouter();
  const total = books.length;
  // Navegación cíclica
  const prev = () =>
    setCurrentIndex(currentIndex === 0 ? total - 1 : currentIndex - 1);
  const next = () => setCurrentIndex((currentIndex + 1) % total);
  // Visible books
  const visibleCount = Math.min(5, total);
  const getVisibleBooks = () =>
    Array.from(
      { length: visibleCount },
      (_, i) =>
        books[(currentIndex - Math.floor(visibleCount / 2) + i + total) % total]
    );
  // Animación
  const variants = {
    offLeft: { opacity: 0, scale: 0.7, x: -250, pointerEvents: 'none' },
    left: { opacity: 0.6, scale: 0.85, x: -125, pointerEvents: 'auto' },
    center: { opacity: 1, scale: 1, x: 0, pointerEvents: 'auto' },
    right: { opacity: 0.6, scale: 0.85, x: 125, pointerEvents: 'auto' },
    offRight: { opacity: 0, scale: 0.7, x: 250, pointerEvents: 'none' },
  };
  const positionMaps = [
    ['center'],
    ['left', 'center'],
    ['left', 'center', 'right'],
    ['offLeft', 'left', 'center', 'right'],
    ['offLeft', 'left', 'center', 'right', 'offRight'],
  ];
  const positionMap = positionMaps[visibleCount - 1] || positionMaps[4];

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: 320,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        px: 4,
      }}
    >
      {total > 1 && (
        <>
          <IconButton
            onClick={prev}
            aria-label="Previous book"
            sx={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              bgcolor: '#333',
              color: 'white',
              '&:hover': { bgcolor: '#555' },
              width: 40,
              height: 40,
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
          <IconButton
            onClick={next}
            aria-label="Next book"
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              bgcolor: '#333',
              color: 'white',
              '&:hover': { bgcolor: '#555' },
              width: 40,
              height: 40,
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        </>
      )}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <AnimatePresence initial={false}>
          {getVisibleBooks().map((book, i) => {
            const noCover = !book.cover?.url || book.cover.url === '';
            const pos = positionMap[i] as keyof typeof variants;
            const isCenter = pos === 'center';
            return (
              <motion.div
                key={`${book.id}-${i}`}
                initial={{ opacity: 0, scale: 0.7, x: 0 }}
                animate={variants[pos]}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{
                  position: 'absolute',
                  cursor: isCenter ? 'pointer' : 'default',
                  width: isCenter ? 180 : 130,
                  height: isCenter ? 260 : 190,
                  borderRadius: 12,
                  zIndex: isCenter ? 1 : 0,
                  boxShadow: isCenter
                    ? '0 12px 25px rgba(0,0,0,0.6)'
                    : '0 6px 12px rgba(0,0,0,0.3)',
                  overflow: 'hidden',
                  backgroundColor: '#222',
                  userSelect: 'none',
                }}
                onClick={() => {
                  if (isCenter) router.push(`/books/${book.id}`);
                }}
                whileHover={
                  isCenter
                    ? {
                        scale: 1.05,
                        boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
                      }
                    : {}
                }
              >
                <img
                  src={noCover ? DEFAULT_COVER_IMAGE : book.cover?.url}
                  alt={book.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    userSelect: 'none',
                    pointerEvents: 'none',
                  }}
                  draggable={false}
                />
                <Typography
                  variant="body2"
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    width: '100%',
                    color: 'white',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    padding: '4px 8px',
                    borderRadius: '0 0 12px 12px',
                    userSelect: 'text',
                  }}
                >
                  {book.title}
                </Typography>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </Box>
    </Box>
  );
};
