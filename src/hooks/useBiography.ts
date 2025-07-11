/* eslint-disable @typescript-eslint/no-unused-vars */
import updateBiography from '@/app/actions/books/updateBiography';
import { useState } from 'react';
import { mutate } from 'swr';

interface useBiographyProps {
  handleUpdateBiography: (formData: FormData) => Promise<string | undefined>;
  isLoading: boolean;
  isUpdated: boolean;
  isError: boolean;
  setIsUpdated: (isUpdated: boolean) => void;
  setIsError: (isError: boolean) => void;
}

export function useBiography(): useBiographyProps {
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleUpdateBiography = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const biography = await updateBiography(
        formData.get('biography') as string
      );
      setIsUpdated(true);
      mutate('/api/auth/get');
      return biography;
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleUpdateBiography,
    isLoading,
    isUpdated,
    isError,
    setIsUpdated,
    setIsError,
  };
}
