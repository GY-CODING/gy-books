/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import queryBooks from '@/app/actions/book/queryBooks';
import HardcoverBook from '@/domain/HardcoverBook';
import { useDebounce } from '@/hooks/useDebounce';
import { birthStone, lora } from '@/utils/fonts/fonts';
import SearchIcon from '@mui/icons-material/Search';
import { Box, InputAdornment, TextField } from '@mui/material';
import Head from 'next/head';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { BookCard } from '../components/atoms/BookCard/BookCard';
import CustomTitle from '../components/atoms/BookTitle/CustomTitle';
import LottieAnimation from '../components/atoms/LottieAnimation/LottieAnimation';

function BooksContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [title, setTitle] = useState(searchParams.get('q') || '');
  const [books, setBooks] = useState<HardcoverBook[]>([]);

  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    fetch('/lottie/book_searcher.json')
      .then((res) => res.json())
      .then((data) => setAnimationData(data));
  }, []);

  const debouncedTitle = useDebounce(title, 250);

  useEffect(() => {
    const fetchBooks = async () => {
      if (debouncedTitle) {
        const formData = new FormData();
        formData.append('title', debouncedTitle);
        const result = await queryBooks(formData);
        setBooks(result as HardcoverBook[]);
      } else {
        setBooks([]);
      }
    };

    fetchBooks();
  }, [debouncedTitle]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedTitle) {
      params.set('q', debouncedTitle);
    } else {
      params.delete('q');
    }
    router.push(`/books?${params.toString()}`);
  }, [debouncedTitle, router, searchParams]);

  return (
    <>
      <Head>
        <title>
          {debouncedTitle
            ? `Buscando: ${debouncedTitle} - WingWords`
            : '- Tu biblioteca personal'}
        </title>
        <meta
          name="description"
          content={
            debouncedTitle
              ? `Resultados de búsqueda para: ${debouncedTitle}`
              : 'Tu biblioteca personal de libros'
          }
        />
      </Head>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
        }}
      >
        <CustomTitle
          text="Library"
          size="6rem"
          fontFamily={birthStone.style.fontFamily}
          sx={{
            color: 'white',
          }}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
          justifyContent: 'start',
          height: '100%',
          gap: '1rem',
          backgroundColor: '#161616',
          paddingBottom: '100px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            justifyContent: 'center',
            width: '100%',
            gap: { xs: '0.5rem', sm: '1rem' },
            paddingTop: { xs: '8px', sm: '10px' },
            px: { xs: 2, sm: 0 },
          }}
        >
          <TextField
            placeholder="Look for a book..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="outlined"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'white' }} />
                </InputAdornment>
              ),
              style: {
                color: 'white',
                fontFamily: lora.style.fontFamily,
                fontSize: '18px',
                backgroundColor: '#232323',
                borderRadius: '16px',
                minHeight: '48px',
              },
            }}
            InputLabelProps={{
              style: {
                color: 'white',
                fontFamily: lora.style.fontFamily,
                fontSize: '20px',
              },
            }}
            sx={{
              mb: { xs: 1, sm: 2 },
              width: { xs: '90%', sm: '60%', md: '60%' },
              alignSelf: 'center',
              maxWidth: { xs: '100%', sm: '500px' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'transparent',
                  borderRadius: '16px',
                },
                '&:hover fieldset': {
                  borderColor: 'white',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#8C54FF',
                  borderWidth: 2,
                },
              },
            }}
          />
        </Box>

        <Box
          sx={{
            width: '100%',
            height: '70vh',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'start',
            padding: '25px',
            overflow: 'auto',
            scrollbarColor: ' #8C54FF transparent',
          }}
        >
          {books.length > 0
            ? books.map((book: any) => <BookCard key={book.id} book={book} />)
            : animationData && (
                <LottieAnimation
                  loop
                  animationData={animationData}
                  style={{ width: '500px', height: '80%', maxWidth: '100%' }}
                />
              )}
        </Box>
      </Box>
    </>
  );
}

export default function BooksPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <BooksContent />
    </Suspense>
  );
}
