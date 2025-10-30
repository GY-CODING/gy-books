/* eslint-disable @typescript-eslint/no-unused-vars */
import useSWR from 'swr';
import fetchBookById from '@/app/actions/book/fetchBookById';
import HardcoverBook from '@/domain/HardcoverBook';

interface useBookProps {
  data: HardcoverBook;
  isLoading: boolean;
  error: Error | null;
}

export function useBook(id: string): useBookProps {
  const { data, isLoading, error } = useSWR(
    id ? `/api/books/${id}` : null,
    () => fetchBookById(id),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  return {
    data: data as HardcoverBook,
    isLoading,
    error,
  };
}
