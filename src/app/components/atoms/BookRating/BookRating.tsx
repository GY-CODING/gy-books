'use client';

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { goudi } from '@/utils/fonts/fonts';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useUser } from '@/hooks/useUser';
import { useRemoveBook } from '@/hooks/useRemoveBook';
import BookRatingDrawer from './BookRatingDrawer';
import BookRatingMenu from './BookRatingMenu';
import { BookRatingProps } from './types';
import { useBookRatingState } from './hooks/useBookRatingState';
import { statusOptions } from './BookRatingOptions';
import { EStatus } from '@/utils/constants/EStatus';
export const BookRating = ({
  bookId,
  apiBook,
  isRatingLoading,
  mutate,
  isLoggedIn,
}: BookRatingProps) => {
  const { data: user, isLoading: isUserLoading } = useUser();
  const { handleDeleteBook } = useRemoveBook();
  // Local delete handler for BookRatingMenu/Drawer
  const localHandleDeleteBook = () => {
    if (isBookSaved) {
      handleDeleteBook(
        bookId,
        mutate
          ? (data, options) =>
              mutate({ ...apiBook, userData: undefined }, options)
          : undefined
      );
    }
  };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Use custom hook for all state/logic
  const { state, handlers, anchorEl, setAnchorEl, drawerOpen, setDrawerOpen } =
    useBookRatingState({
      bookId,
      apiBook,
      isRatingLoading,
      mutate,
      isLoggedIn: false,
    });

  // Local computed values
  const isBookSaved =
    apiBook && apiBook.userData && apiBook.userData.status !== EStatus.RATE;
  const isLoading = isUserLoading || isRatingLoading;
  const isSubmitting = state.isSubmitting;
  const displayStatus = state.tempStatus;
  const displayStatusOption = statusOptions.find(
    (opt) => opt.value === displayStatus
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        alignItems: { xs: 'center', sm: 'flex-start' },
        width: 'auto',
        mt: 2,
      }}
    >
      <Box sx={{ mb: 1 }}>
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          startIcon={<BookmarkIcon />}
          endIcon={<ArrowDropDownIcon />}
          disabled={!isLoggedIn}
          onClick={(e) => {
            if (isMobile) setDrawerOpen(true);
            else setAnchorEl(e.currentTarget);
          }}
          sx={{
            justifyContent: 'space-between',
            color: isBookSaved ? '#fff' : '#ccc',
            borderColor: isBookSaved ? '#8C54FF' : '#8C54FF40',
            fontWeight: 'bold',
            fontSize: 20,
            fontFamily: goudi.style.fontFamily,
            letterSpacing: '.05rem',
            borderRadius: '12px',
            background: isBookSaved ? '#8C54FF' : 'rgba(140,84,255,0.05)',
            px: 2,
            py: 1,
            textTransform: 'none',
            opacity: !user ? 0.5 : 1,
            '&:hover': {
              borderColor: isBookSaved ? '#c4b5fd' : '#8C54FF',
              background: isBookSaved ? '#8C54FF' : 'rgba(140,84,255,0.15)',
              color: '#fff',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(140,84,255,0.3)',
            },
            '&:disabled': {
              borderColor: '#666',
              color: '#666',
              background: 'rgba(102,102,102,0.1)',
            },
          }}
        >
          {displayStatusOption?.label || 'Want to read'}
        </Button>
        {!user && !isUserLoading && (
          <Typography variant="caption" sx={{ color: '#666' }}>
            Sign in to rate this book
          </Typography>
        )}
        {/* Desktop menu */}
        <BookRatingMenu
          anchorEl={anchorEl}
          open={Boolean(anchorEl) && !isMobile}
          onClose={() => setAnchorEl(null)}
          state={state}
          handlers={handlers}
          isBookSaved={!!isBookSaved}
          isLoading={isLoading}
          isSubmitting={isSubmitting}
          fontFamily={goudi.style.fontFamily}
          handleDeleteBook={localHandleDeleteBook}
        />
        <BookRatingDrawer
          open={drawerOpen && isMobile}
          onClose={() => setDrawerOpen(false)}
          state={state}
          handlers={handlers}
          isBookSaved={!!isBookSaved}
          isLoading={isLoading}
          isSubmitting={isSubmitting}
          fontFamily={goudi.style.fontFamily}
          handleDeleteBook={localHandleDeleteBook}
        />
      </Box>
    </Box>
  );
};
