'use client';

import React from 'react';
import { Box, Typography, CircularProgress, IconButton } from '@mui/material';
import { useParams } from 'next/navigation';
import { useBook } from '@/hooks/useBook';
import { goudi, cinzel } from '@/utils/fonts/fonts';
import AuthorCard from '@/app/components/atoms/AuthorCard/AuthorCard';
import { Author } from '@/domain/book.model';
import { BookRating } from '@/app/components/atoms/BookRating/BookRating';
import StarIcon from '@mui/icons-material/Star';
import { useApiBook } from '@/hooks/useApiBook';
import { useUser } from '@/hooks/useUser';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { useHallOfFame } from '@/hooks/useHallOfFame';
import AnimatedAlert from '@/app/components/atoms/Alert/Alert';
import { ESeverity } from '@/utils/constants/ESeverity';
import { useApiBookPublic } from '@/hooks/useApiBookPublic';
import { DEFAULT_COVER_IMAGE } from '@/utils/constants/constants';
export default function BookDetails() {
  const params = useParams();
  const { data: book, isLoading } = useBook(params.id as string);
  const { data: user } = useUser();
  const {
    data: hallOfFame,
    handleAddBookToHallOfFame,
    setIsLoadingToAddHallOfFame,
    setIsUpdatedAddToHallOfFame,
    setIsErrorAddToHallOfFame,
    isErrorAddToHallOfFame,
    isLoadingAddToHallOfFame,
    isUpdatedAddToHallOfFame,
    handleDeleteBookToHallOfFame,
    setIsLoadingToDeleteHallOfFame,
    setIsUpdatedDeleteToHallOfFame,
    setIsErrorDeleteToHallOfFame,
    isLoadingDeleteToHallOfFame,
    isUpdatedDeleteToHallOfFame,
    isErrorDeleteToHallOfFame,
  } = useHallOfFame(user?.id || '');
  const isOnHallOfFame = hallOfFame?.books.some((b) => b.id === book?.id);
  const isLoggedIn = !!user;
  const {
    data: apiBook,
    isLoading: isApiBookLoading,
    mutate,
  } = useApiBook(params.id as string);
  const { data: apiBookPublic, isLoading: isApiBookLoadingPublic } =
    useApiBookPublic(params.id as string);
  if (isLoading || isApiBookLoading || isApiBookLoadingPublic) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#161616',
        }}
      >
        <CircularProgress sx={{ color: 'white' }} />
      </Box>
    );
  }

  const handleClick = () => {
    if (isOnHallOfFame) {
      setIsLoadingToDeleteHallOfFame(true);
      setIsUpdatedDeleteToHallOfFame(false);
      setIsErrorDeleteToHallOfFame(false);
      handleDeleteBookToHallOfFame(book?.id || '');
      setIsLoadingToAddHallOfFame(false);
      setIsUpdatedAddToHallOfFame(false);
      setIsErrorAddToHallOfFame(false);
    } else if (!isOnHallOfFame) {
      setIsLoadingToAddHallOfFame(false);
      setIsUpdatedAddToHallOfFame(false);
      setIsErrorAddToHallOfFame(false);
      handleAddBookToHallOfFame(book?.id || '');
    }
  };

  const bookHasCover = book?.cover.url && book.cover.url !== '';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#161616',
        padding: '2rem',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: '2rem',
      }}
    >
      <Box
        sx={{
          width: { xs: '100%', md: '40%' },
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box
          component="img"
          src={bookHasCover ? book?.cover.url : DEFAULT_COVER_IMAGE}
          alt={book?.title}
          sx={{
            width: '100%',
            maxWidth: { xs: '100%', md: '400px' },
            height: { xs: 'auto', md: '700px' },
            borderRadius: '16px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          }}
        />
      </Box>
      <Box
        sx={{
          width: { xs: '100%', md: '60%' },
          color: 'white',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: '0rem', md: '1rem' },
            alignItems: 'center',
            justifyContent: 'start',
            width: '100%',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontFamily: goudi.style.fontFamily,
              fontWeight: '800',
              fontSize: 48,
              letterSpacing: '.1rem',
              marginBottom: '1rem',
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            {book?.title}
          </Typography>
          {book?.series && (
            <Typography
              variant="h5"
              sx={{
                color: '#FFFFFF45',
                fontFamily: goudi.style.fontFamily,
                fontStyle: 'italic',
                marginBottom: '1rem',
                textAlign: { xs: 'center', md: 'left' },
              }}
            >
              ({book.series.name})
            </Typography>
          )}
        </Box>
        <Typography
          variant="h6"
          sx={{
            color: '#FFFFFF33',
            marginBottom: '1rem',
            textAlign: { xs: 'center', md: 'left' },
            fontSize: 26,
            letterSpacing: '.05rem',
            marginTop: '-1rem',
            fontFamily: goudi.style.fontFamily,
          }}
        >
          {book?.author.name}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: 'primary.main',
            justifySelf: { xs: 'center', md: 'left' },
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            fontFamily: cinzel.style.fontFamily,
            gap: '0.2rem',
            fontSize: '24px',
          }}
        >
          {apiBookPublic?.averageRating}
          <StarIcon
            sx={{
              color: 'primary.main',
              fontSize: '30px',
              marginTop: '-0.2rem',
            }}
          />
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: ['column', 'column', 'row'],
            gap: ['0rem', '0rem', '1rem'],
            width: '100%',
            justifyContent: ['center', 'center', 'start'],
            alignItems: ['center', 'center', 'start'],
          }}
        >
          <BookRating
            apiBook={apiBook}
            bookId={book?.id || ''}
            isRatingLoading={isApiBookLoading}
            mutate={mutate}
            isLoggedIn={isLoggedIn}
          />

          {user && (
            <IconButton
              loading={isLoadingAddToHallOfFame || isLoadingDeleteToHallOfFame}
              sx={{ marginTop: '1rem' }}
            >
              <WorkspacePremiumIcon
                sx={{
                  color: isOnHallOfFame ? 'gold' : 'gray',
                  fontSize: '32px',
                }}
                onClick={handleClick}
              />
            </IconButton>
          )}
        </Box>

        <Typography
          variant="body1"
          sx={{
            lineHeight: 1.6,
            marginBottom: '2rem',
            marginTop: '2rem',
            fontSize: 18,
            fontFamily: goudi.style.fontFamily,
          }}
          dangerouslySetInnerHTML={{ __html: book?.description ?? '' }}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <AuthorCard author={book?.author as Author} />
        </Box>
      </Box>
      <AnimatedAlert
        open={isUpdatedAddToHallOfFame}
        onClose={() => setIsUpdatedAddToHallOfFame(false)}
        message="Book added to Hall of Fame successfully!"
        severity={ESeverity.SUCCESS}
      />
      <AnimatedAlert
        open={isErrorAddToHallOfFame}
        onClose={() => setIsErrorAddToHallOfFame(false)}
        message="Error adding book to Hall of Fame."
        severity={ESeverity.ERROR}
      />
      <AnimatedAlert
        open={isUpdatedDeleteToHallOfFame}
        onClose={() => setIsUpdatedAddToHallOfFame(false)}
        message="Book deleted from Hall of Fame!"
        severity={ESeverity.SUCCESS}
      />
      <AnimatedAlert
        open={isErrorDeleteToHallOfFame}
        onClose={() => setIsErrorDeleteToHallOfFame(false)}
        message="Error deleting book from Hall of Fame."
        severity={ESeverity.ERROR}
      />
    </Box>
  );
}
