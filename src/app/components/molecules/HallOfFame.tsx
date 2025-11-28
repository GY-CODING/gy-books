/* eslint-disable no-constant-binary-expression */
'use client';

import { useGyCodingUser } from '@/contexts/GyCodingUserContext';
import { useHallOfFame } from '@/hooks/useHallOfFame';
import { useUpdateHallOfFame } from '@/hooks/useUpdateHallOfFame';
import { Box, Typography } from '@mui/material';
import React, { useState } from 'react';
import { HallOfFameSkeleton } from './HallOfFameSkeleton';
import { HallOfFameCarousel } from './halloffame/HallOfFameCarousel';
import { HallOfFameEmpty } from './halloffame/HallOfFameEmpty';
import { HallOfFameQuoteInput } from './halloffame/HallOfFameQuoteInput';

export default function HallOfFame({ userId }: { userId: string }) {
  const { user } = useGyCodingUser();
  const { isLoading, error, quote, books } = useHallOfFame(userId);
  const { handleUpdateHallOfFame } = useUpdateHallOfFame(userId);

  const [editedQuote, setEditedQuote] = useState(quote);
  const [isEditing, setIsEditing] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);

  React.useEffect(() => {
    setEditedQuote(quote || '');
  }, [quote]);

  if (isLoading) return <HallOfFameSkeleton />;

  if (error) {
    return (
      <Box sx={{ color: 'white', textAlign: 'center', p: 4 }}>
        <Typography variant="h6" color="white">
          Error loading Hall of Fame.
        </Typography>
      </Box>
    );
  }

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('quote', editedQuote);
      await handleUpdateHallOfFame(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update quote:', error);
      // The error state is already set in the hook
    }
  };

  // Si books es undefined o array vacío
  if (!books || books.length === 0) {
    return (
      <>
        <HallOfFameEmpty />
        <HallOfFameQuoteInput
          quote={quote || ''}
          editedQuote={editedQuote}
          setEditedQuote={setEditedQuote}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          onSave={handleUpdate}
          disabled={userId !== user?.id}
        />
      </>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: '#1A1A1A',
        borderRadius: '16px',
        padding: '2rem',
        width: '100%',
        maxWidth: '900px',
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
        userSelect: 'none',
      }}
    >
      <HallOfFameCarousel
        books={books}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
      <HallOfFameQuoteInput
        quote={quote || ''}
        editedQuote={editedQuote}
        setEditedQuote={setEditedQuote}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        onSave={handleUpdate}
        disabled={userId !== user?.id}
      />
    </Box>
  );
}
