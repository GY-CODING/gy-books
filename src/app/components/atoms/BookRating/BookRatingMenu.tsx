import React from 'react';
import {
  Menu,
  Stack,
  Box,
  Typography,
  Divider,
  Button,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RatingStars from '../RatingStars/RatingStars';
import BookRatingStatusButtons from './BookRatingStatusButtons';
import BookRatingProgressInput from './BookRatingProgressInput';
import { BookRatingState, BookRatingHandlers } from './types';

interface Props {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  state: BookRatingState;
  handlers: BookRatingHandlers;
  isBookSaved: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  fontFamily?: string;
  handleDeleteBook?: () => void;
}

const BookRatingMenu: React.FC<Props> = ({
  open,
  anchorEl,
  onClose,
  state,
  handlers,
  isBookSaved,
  isLoading,
  isSubmitting,
  fontFamily = 'inherit',
  handleDeleteBook,
}) => (
  <Menu
    anchorEl={anchorEl}
    open={open}
    onClose={onClose}
    PaperProps={{
      sx: {
        borderRadius: 4,
        minWidth: 340,
        p: 3,
        background: '#232323',
        boxShadow: '0 8px 32px rgba(140,84,255,0.15)',
      },
    }}
  >
    <Stack spacing={2} alignItems="stretch" position="relative">
      {isBookSaved && handleDeleteBook && (
        <IconButton
          sx={{
            position: 'absolute',
            top: 10,
            padding: '10px',
            background: 'rgba(255, 83, 83, 0.1)',
            borderRadius: '16px',
            right: 0,
          }}
          onClick={handleDeleteBook}
        >
          <DeleteIcon sx={{ color: '#ff5353' }} />
        </IconButton>
      )}
      <Box>
        <Typography
          sx={{
            color: '#fff',
            fontWeight: 'bold',
            mb: 0.5,
            fontSize: 20,
            fontFamily,
            letterSpacing: '.05rem',
          }}
        >
          Rating
        </Typography>
        <RatingStars
          rating={state.tempRating}
          onRatingChange={handlers.setTempRating}
          disabled={isLoading || isSubmitting}
          isLoading={isLoading}
        />
      </Box>
      <Divider sx={{ borderColor: '#8C54FF30' }} />
      <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
        <Typography
          sx={{
            color: '#fff',
            fontWeight: 'bold',
            mb: 1,
            fontSize: 20,
            fontFamily,
            letterSpacing: '.05rem',
          }}
        >
          Status
        </Typography>
        <BookRatingStatusButtons
          tempStatus={state.tempStatus}
          setTempStatus={handlers.setTempStatus}
          fontFamily={fontFamily}
        />
        <BookRatingProgressInput
          tempProgress={state.tempProgress}
          setTempProgress={handlers.setTempProgress}
          isProgressPercent={state.isProgressPercent}
          setIsProgressPercent={handlers.setIsProgressPercent}
          fontFamily={fontFamily}
        />
      </Box>
      <Divider sx={{ borderColor: '#8C54FF30' }} />
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Typography sx={{ color: '#fff', fontWeight: 'bold', mb: 0.5 }}>
          Dates
        </Typography>
        <Stack direction="row" gap={2}>
          <input
            type="date"
            value={state.tempStartDate}
            onChange={(e) => handlers.setTempStartDate(e.target.value)}
          />
          <input
            type="date"
            value={state.tempEndDate}
            onChange={(e) => handlers.setTempEndDate(e.target.value)}
          />
        </Stack>
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handlers.handleApply}
        disabled={isSubmitting}
        sx={{
          borderRadius: 3,
          fontWeight: 'bold',
          fontSize: 18,
          fontFamily,
          letterSpacing: '.05rem',
          mt: 2,
          textTransform: 'none',
        }}
      >
        Apply
      </Button>
    </Stack>
  </Menu>
);

export default BookRatingMenu;
