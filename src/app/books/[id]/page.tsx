'use client';

import React, { useState } from 'react';
import { Box, Typography, IconButton, Chip, Divider } from '@mui/material';
import { useParams } from 'next/navigation';
import { useBook } from '@/hooks/useBook';
import { lora } from '@/utils/fonts/fonts';
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
import BookDetailsSkeleton from '@/app/components/molecules/BookDetailsSkeleton';
import { EditionSelector } from '@/app/components/molecules/EditionSelector/EditionSelector';
import { Edition } from '@/domain/book.model';
export default function BookDetails() {
  const params = useParams();
  const { data: book, isLoading } = useBook(params.id as string);
  const { data: user } = useUser();
  const [selectedEdition, setSelectedEdition] = useState<Edition | null>(null);
  const {
    data: hallOfFame,
    handleAddBookToHallOfFame,
    setIsLoadingToAddHallOfFame,
    setIsUpdatedAddToHallOfFame,
    setIsErrorAddToHallOfFame,
    isErrorAddToHallOfFame,
    isUpdatedAddToHallOfFame,
    handleDeleteBookToHallOfFame,
    setIsLoadingToDeleteHallOfFame,
    setIsUpdatedDeleteToHallOfFame,
    setIsErrorDeleteToHallOfFame,
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

  // Extraer todas las ediciones disponibles
  const allEditions: Edition[] = React.useMemo(() => {
    if (!book?.editions) return [];
    return book.editions;
  }, [book]);

  // Determinar la imagen y título a mostrar
  const displayImage =
    selectedEdition?.cached_image?.url ||
    book?.cover?.url ||
    DEFAULT_COVER_IMAGE;
  const displayTitle = selectedEdition?.title || book?.title;

  if (isLoading || isApiBookLoading || isApiBookLoadingPublic) {
    return <BookDetailsSkeleton />;
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

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#161616',
        padding: '2rem',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: ['0rem', '0rem', '6rem'],
        paddingX: { xs: '1rem', md: '100px' },
      }}
    >
      <Box
        sx={{
          display: ['flex', 'flex', 'none'],
          width: '100%',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontFamily: lora.style.fontFamily,
            fontWeight: '800',
            fontSize: 32,
            letterSpacing: '.1rem',
            marginBottom: '1rem',
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          {displayTitle}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: '#FFFFFF33',
            marginBottom: '1rem',
            textAlign: { xs: 'center', md: 'left' },
            fontSize: 22,
            letterSpacing: '.05rem',
            marginTop: '-1rem',
            fontFamily: lora.style.fontFamily,
          }}
        >
          {book?.author.name}
        </Typography>
      </Box>
      <Box
        sx={{
          width: { xs: '100%', md: '300px' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'start',
        }}
      >
        <Box
          component="img"
          src={displayImage}
          alt={displayTitle}
          sx={{
            width: ['250px', '250px', '300px'],
            maxWidth: { xs: '100%', md: '300px' },
            height: { xs: 'auto', md: '500px' },
            borderRadius: '16px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          }}
        />
        <Divider
          sx={{ display: ['flex', 'flex', 'none'], marginTop: '1rem' }}
          textAlign="center"
        >
          {book?.series && (
            <Chip
              sx={{
                backgroundColor: '#8C54FF20',
                color: '#8C54FF',
                letterSpacing: '.05rem',
                fontWeight: 'bold',
                border: '2px solid #8C54FF',
                fontFamily: lora.style.fontFamily,
                height: '32px',
                fontSize: '16px',
              }}
              label={book.series.name}
            />
          )}
        </Divider>
        <Box display={'flex'} flexDirection="column" alignItems="center" mt={2}>
          <Typography
            variant="body1"
            sx={{
              color: 'primary.main',
              justifySelf: { xs: 'center', md: 'left' },
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              fontFamily: lora.style.fontFamily,
              gap: '0.2rem',
              fontSize: '36px',
              textShadow: '0 0 20px rgba(140, 84, 255, 0.5)',
            }}
          >
            {apiBookPublic?.averageRating}
            <StarIcon
              sx={{
                color: 'primary.main',
                fontSize: '38px',
                marginTop: '-0.2rem',
              }}
            />
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={2}
            mt={2}
            flexDirection={'row'}
          >
            <BookRating
              apiBook={apiBook}
              bookId={book?.id || ''}
              isRatingLoading={isApiBookLoading}
              mutate={mutate}
              isLoggedIn={isLoggedIn}
              selectedEdition={selectedEdition}
            />

            {user && (
              <IconButton
                sx={{
                  color: isOnHallOfFame ? 'gold' : 'gray',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  backgroundColor: isOnHallOfFame ? '#333300' : 'transparent',
                  borderColor: isOnHallOfFame ? 'gold' : 'gray',
                  fontSize: '18px',
                  fontFamily: lora.style.fontFamily,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    backgroundColor: isOnHallOfFame ? '#333300' : '#1a1a1a',
                    borderColor: isOnHallOfFame ? 'gold' : 'white',
                    transform: 'scale(1.05)',
                  },
                }}
                onClick={handleClick}
              >
                <WorkspacePremiumIcon
                  sx={{
                    color: isOnHallOfFame ? 'gold' : 'gray',
                    fontSize: '32px',
                  }}
                />
              </IconButton>
            )}
          </Box>

          {/* Edition Selector */}
          <EditionSelector
            editions={allEditions}
            selectedEdition={selectedEdition}
            onEditionChange={setSelectedEdition}
          />
        </Box>
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
              fontFamily: lora.style.fontFamily,
              fontWeight: '800',
              display: ['none', 'none', 'block'],

              fontSize: 48,
              letterSpacing: '.1rem',
              marginBottom: '1rem',
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            {displayTitle}
          </Typography>
        </Box>
        <Typography
          variant="h6"
          sx={{
            display: ['none', 'none', 'block'],

            color: '#FFFFFF33',
            marginBottom: '1rem',
            textAlign: { xs: 'center', md: 'left' },
            fontSize: 26,
            letterSpacing: '.05rem',
            marginTop: '-1rem',
            fontFamily: lora.style.fontFamily,
          }}
        >
          {book?.author.name}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: ['column', 'column', 'row'],
            gap: ['0rem', '0rem', '1rem'],
            width: 'auto',
            justifyContent: ['center', 'center', 'start'],
            alignItems: ['center', 'center', 'start'],
          }}
        ></Box>

        <Divider
          sx={{
            display: ['none', 'none', 'block'],
          }}
          textAlign="center"
        >
          {book?.series && (
            <Chip
              sx={{
                backgroundColor: '#8C54FF20',
                color: '#8C54FF',
                letterSpacing: '.05rem',
                fontWeight: 'bold',
                border: '2px solid #8C54FF',
                fontFamily: lora.style.fontFamily,
                height: '32px',
                fontSize: '16px',
              }}
              label={book.series.name}
            />
          )}
        </Divider>
        <Divider
          variant="middle"
          sx={{
            marginTop: '2rem',
            display: ['flex', 'flex', 'none'],
            paddingX: ['1.5rem', '1.5rem', '0'],
          }}
        />
        <Typography
          variant="body1"
          sx={{
            lineHeight: 1.6,
            marginBottom: '2rem',
            paddingX: ['1.5rem', '1.5rem', '0'],
            marginTop: '2rem',
            fontSize: 18,
            color: '#CCCCCC',
            fontFamily: lora.style.fontFamily,
            letterSpacing: '.02rem',
            textAlign: 'justify',
          }}
          dangerouslySetInnerHTML={{ __html: book?.description ?? '' }}
        />
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
