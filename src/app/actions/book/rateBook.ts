/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { headers } from 'next/headers';
import { cookies } from 'next/headers';
import fetchBookById from './fetchBookById';
import Book from '@/domain/book.model';
import { setActivity } from './activities/setActivity';
import { EActivity } from '@/utils/constants/formatActivity';
import { ApiBook } from '@/domain/apiBook.model';
import { EStatus } from '@/utils/constants/EStatus';

export default async function rateBook(
  formData: FormData,
  username: string,
  oldUserData?: ApiBook['userData'] // los datos antiguos
) {
  try {
    const bookId = formData.get('bookId') as string;
    const rating = formData.get('rating') as string;
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;
    const status = formData.get('status') as string;
    const progress = formData.get('progress') as string;
    const editionId = formData.get('editionId') as string;

    if (!bookId) {
      throw new Error('Book ID is required');
    }

    const ratingNumber = parseFloat(rating);
    if (isNaN(ratingNumber) || ratingNumber < 0 || ratingNumber > 5) {
      throw new Error('Rating must be a number between 0 and 5');
    }

    // Validar que solo se envíe editionId si el libro está en un estado válido
    const validStatuses = [EStatus.WANT_TO_READ, EStatus.READING, EStatus.READ];
    const finalEditionId = validStatuses.includes(status as EStatus)
      ? editionId
      : null;

    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch(
      `${protocol}://${host}/api/auth/books/${bookId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookieHeader,
        },
        body: JSON.stringify({
          rating: ratingNumber,
          startDate: startDate || '',
          endDate: endDate || '',
          status: status,
          progress: progress,
          editionId: finalEditionId || undefined,
        }),
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    if (!data.bookRatingData) {
      throw new Error('No ApiBook data received from server');
    }

    const book: Book = await fetchBookById(bookId);
    const newUserData = data.bookRatingData.userData;

    // Detectar cambios y setear actividad adecuada
    if (book && username && newUserData) {
      const oldStatus = oldUserData?.status;
      const newStatus = newUserData.status;

      const oldProgress = oldUserData?.progress;
      const newProgress = newUserData.progress;

      const oldRating = oldUserData?.rating;
      const newRating = newUserData.rating;

      // Status actualizado
      if (oldStatus !== newStatus) {
        if (newStatus === EStatus.WANT_TO_READ) {
          await setActivity(EActivity.BOOK_WANT_TO_READ, username, book);
        } else if (newStatus === EStatus.READING) {
          await setActivity(EActivity.BOOK_STARED_READING, username, book);
        } else if (newStatus === EStatus.READ) {
          await setActivity(EActivity.BOOK_READ, username, book);
        }
      }

      // Progreso actualizado
      const progressChanged =
        typeof newProgress === 'number' &&
        newProgress !== undefined &&
        newProgress !== oldProgress &&
        newStatus === EStatus.READING;

      if (progressChanged) {
        await setActivity(EActivity.BOOK_PROGRESS, username, book, newProgress);
      }

      // Rating actualizado
      const ratingChanged =
        typeof newRating === 'number' &&
        newRating > 0 &&
        newRating !== oldRating;

      if (ratingChanged) {
        await setActivity(
          EActivity.BOOK_RATED,
          username,
          book,
          undefined,
          newRating
        );
      }
    }

    return data.bookRatingData;
  } catch (error: any) {
    throw new Error(`Failed to rate book: ${error.message}`);
  }
}
