/* eslint-disable @typescript-eslint/no-unused-vars */
import removeBook from '@/app/actions/book/removeBook';
import { useState } from 'react';
import { ApiBook } from '@/domain/apiBook.model';

interface useRemoveBookProps {
  isLoading: boolean;
  error: Error | null;
  isSuccess: boolean;
  handleDeleteBook: (
    id: string,
    mutate?: (
      data?: ApiBook | null,
      options?: { revalidate?: boolean }
    ) => Promise<ApiBook | null | undefined>
  ) => Promise<void>;
  setIsSuccess: (isSuccess: boolean) => void;
  setError: (error: Error | null) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export function useRemoveBook(): useRemoveBookProps {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleDeleteBook = async (
    id: string,
    mutate?: (
      data?: ApiBook | null,
      options?: { revalidate?: boolean }
    ) => Promise<ApiBook | null | undefined>
  ) => {
    setIsLoading(true);
    try {
      await removeBook(id);

      // Mutate para actualizar la UI inmediatamente
      if (mutate) {
        await mutate(null, { revalidate: false });
      }

      setIsSuccess(true);
      setError(null); // Reset error state on success
    } catch (error) {
      setError(error as Error);
      setIsSuccess(false); // Reset success state on error
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    isSuccess,
    handleDeleteBook,
    setIsSuccess,
    setError,
    setIsLoading,
  };
}
