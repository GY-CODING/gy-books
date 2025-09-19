import React from 'react';
import {
  Drawer,
  Box,
  IconButton,
  Stack,
  Typography,
  Divider,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import RatingStars from '../RatingStars/RatingStars';
import BookRatingStatusButtons from './BookRatingStatusButtons';
import BookRatingProgressInput from './BookRatingProgressInput';
import { BookRatingState, BookRatingHandlers } from './types';

interface Props {
  open: boolean;
  onClose: () => void;
  state: BookRatingState;
  handlers: BookRatingHandlers;
  isBookSaved: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  fontFamily?: string;
  handleDeleteBook?: () => void;
}

const BookRatingDrawer: React.FC<Props> = ({
  open,
  onClose,
  state,
  handlers,
  isBookSaved,
  isLoading,
  isSubmitting,
  fontFamily = 'inherit',
  handleDeleteBook,
}) => (
  <Drawer
    anchor="bottom"
    open={open}
    onClose={onClose}
    PaperProps={{
      sx: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        pb: 2,
        background: '#232323',
        minHeight: 380,
      },
    }}
  >
    <Box sx={{ p: 3, position: 'relative' }}>
      <IconButton
        onClick={onClose}
        sx={{ position: 'absolute', top: 8, right: 8, color: '#fff' }}
      >
        <CloseIcon />
      </IconButton>
      <Stack spacing={2} alignItems="stretch" sx={{ mt: 2 }}>
        <Box>
          <Typography sx={{ color: '#fff', fontWeight: 'bold', mb: 0.5 }}>
            Calificación
          </Typography>
          <RatingStars
            rating={state.tempRating}
            onRatingChange={handlers.setTempRating}
            disabled={isLoading || isSubmitting}
            isLoading={isLoading}
          />
          {isBookSaved && handleDeleteBook && (
            <IconButton
              sx={{
                position: 'absolute',
                top: 55,
                padding: '10px',
                background: 'rgba(255, 83, 83, 0.1)',
                borderRadius: '16px',
                right: 10,
              }}
              onClick={handleDeleteBook}
            >
              <DeleteIcon sx={{ color: '#ff5353' }} />
            </IconButton>
          )}
        </Box>
        <Divider sx={{ borderColor: '#8C54FF30' }} />
        <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
          <Typography sx={{ color: '#fff', fontWeight: 'bold', mb: 0.5 }}>
            Estado
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
        <Box sx={{ display: 'flex', gap: 2, mb: '10px' }}>
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
            mt: 2,
            textTransform: 'none',
          }}
        >
          Aplicar
        </Button>
      </Stack>
    </Box>
  </Drawer>
);

export default BookRatingDrawer;
