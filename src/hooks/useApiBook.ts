/* eslint-disable @typescript-eslint/no-unused-vars */
import useSWR from 'swr';
import getApiBook from '@/app/actions/book/fetchApiBook';
import { Book } from '@gycoding/nebula';

interface useApiBookProps {
  data: Book | null;
  isLoading: boolean;
  error: Error | null;
  mutate: (
    data?: Book | null,
    options?: { revalidate?: boolean }
  ) => Promise<Book | null | undefined>;
}

export function useApiBook(id: string): useApiBookProps {
  const { data, isLoading, error, mutate } = useSWR(
    id ? id : null,
    getApiBook,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  return {
    data: data || null,
    isLoading,
    error,
    mutate,
  };
}
