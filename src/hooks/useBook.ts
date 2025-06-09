/* eslint-disable @typescript-eslint/no-unused-vars */
import useSWR from 'swr';
import { getUser } from '../service/user.service';
import Book from '@/domain/book.model';
import getBookById from '@/service/book.service';

interface useBookProps {
  data: Book | undefined;
  isLoading: boolean;
  error: Error | null;
}

export function useBook(id: string): useBookProps {
  const { data, isLoading, error } = useSWR(
    id ? `/api/books/${id}` : null,
    getBookById,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  return {
    data,
    isLoading,
    error,
  };
}
