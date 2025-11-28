/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import HardcoverBook from '@/domain/HardcoverBook';
import { EStatus } from '@/utils/constants/EStatus';
import { EActivity } from '@/utils/constants/formatActivity';
import { Book } from '@gycoding/nebula';
import { cookies, headers } from 'next/headers';
import { setActivity } from './activities/setActivity';
import fetchBookById from './fetchBookById';

export default async function rateBook(
  formData: FormData,
  username: string,
  oldUserData?: Book['userData'] // los datos antiguos
) {
  try {
    const bookId = formData.get('bookId') as string;
    const rating = formData.get('rating') as string;
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;
    const status = formData.get('status') as string;
    const progress = formData.get('progress') as string;
    const review = formData.get('review') as string;
    const editionId = formData.get('editionId') as string;

    if (!bookId) {
      throw new Error('Book ID is required');
    }

    const ratingNumber = parseFloat(rating);
    if (isNaN(ratingNumber) || ratingNumber < 0 || ratingNumber > 5) {
      throw new Error('Rating must be a number between 0 and 5');
    }

    // Validar que solo se envíe editionId si el libro está en un estado válido
    // RELAJADO: Confiamos en que el frontend o el backend manejen la lógica de negocio.
    // Si llega un editionId, lo enviamos.

    // Construir solo los campos que han cambiado
    const newUserData: Record<string, any> = {};

    // Solo agregar campos que realmente tienen valor o han cambiado
    if (status && status !== oldUserData?.status) {
      newUserData.status = status;
    }

    if (ratingNumber !== undefined && ratingNumber !== oldUserData?.rating) {
      newUserData.rating = ratingNumber;
    }

    if (startDate && startDate !== oldUserData?.startDate) {
      newUserData.startDate = startDate;
    }

    if (endDate && endDate !== oldUserData?.endDate) {
      newUserData.endDate = endDate;
    }

    if (review && review !== oldUserData?.review) {
      newUserData.review = review;
    }

    if (editionId && editionId !== oldUserData?.editionId) {
      newUserData.editionId = editionId;
    }

    // Progress: solo enviar si cambió y tiene sentido según el status
    const progressNumber = progress ? parseFloat(progress) : undefined;
    if (
      progressNumber !== undefined &&
      progressNumber !== oldUserData?.progress
    ) {
      // Si el status es WANT_TO_READ, progress debe ser 0
      if (
        status === EStatus.WANT_TO_READ ||
        newUserData.status === EStatus.WANT_TO_READ
      ) {
        newUserData.progress = 0;
      } else {
        newUserData.progress = progressNumber;
      }
    }

    if (Object.keys(newUserData).length === 0) {
      throw new Error('No changes to update');
    }

    // Definir protocol, host y cookieHeader si no existen
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
        body: JSON.stringify({ userData: newUserData }),
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

    const book: HardcoverBook | null = await fetchBookById(bookId);
    const updatedUserData = data.bookRatingData.userData;

    // Detectar cambios y setear actividad adecuada
    if (book && username && updatedUserData) {
      const oldStatus = oldUserData?.status;
      const newStatus = updatedUserData.status;

      const oldProgress = oldUserData?.progress;
      const newProgress = updatedUserData.progress;

      const oldRating = oldUserData?.rating;
      const newRating = updatedUserData.rating;

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
