'use client';
import fetchBookById from '@/app/actions/book/fetchBookById';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Book from '@/domain/book.model';
import { CircularProgress } from '@mui/material';
import { DEFAULT_COVER_IMAGE } from '@/utils/constants/constants';
export const BookImage: React.FC<{ bookId: string }> = ({
  bookId,
}: {
  bookId: string;
}) => {
  const [src, setSrc] = useState(DEFAULT_COVER_IMAGE);
  useEffect(() => {
    const load = async () => {
      try {
        const book = (await fetchBookById(bookId as string)) as Book;
        if (!book.cover || book.cover.toString() === '') {
          setSrc(DEFAULT_COVER_IMAGE);
          return;
        }
        setSrc(book.cover.url as unknown as string);
      } catch (error) {
        console.error('Error loading book image:', error);
        setSrc('/images/default-book-cover.png');
      }
    };
    load();
  }, [bookId]);

  if (src === '/images/default-book-cover.png') {
    return <CircularProgress />;
  }

  return (
    <Image
      style={{
        height: '100%',
        width: 'auto',
      }}
      src={src || DEFAULT_COVER_IMAGE}
      alt="Activity Icon"
      width={1080}
      height={1080}
    />
  );
};
