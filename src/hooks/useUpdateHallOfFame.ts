/* eslint-disable @typescript-eslint/no-unused-vars */
import updateHallOfFame from '@/app/actions/book/halloffame/updateHallOfFame';
import { hallOfFame } from '@/domain/hallOfFame.model';
import { useState } from 'react';
import { mutate } from 'swr';

interface useUpdateHallOfFameProps {
  handleUpdateHallOfFame: (
    formData: FormData
  ) => Promise<hallOfFame | undefined>;
  isLoading: boolean;
  isUpdated: boolean;
  isError: boolean;
  setIsUpdated: (isUpdated: boolean) => void;
  setIsError: (isError: boolean) => void;
}

export function useUpdateHallOfFame(userId: string): useUpdateHallOfFameProps {
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleUpdateHallOfFame = async (formData: FormData) => {
    setIsLoading(true);
    setIsError(false);
    setIsUpdated(false);
    try {
      const data = await updateHallOfFame(formData);
      setIsUpdated(true);
      // Revalidate the hall of fame data for this specific user
      await mutate(`/api/public/accounts/halloffame/${userId}`);
      return data as unknown as hallOfFame;
    } catch (error) {
      console.error('Error updating Hall of Fame quote:', error);
      setIsError(true);
      throw error; // Re-throw to allow component to handle
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleUpdateHallOfFame,
    isLoading,
    isUpdated,
    isError,
    setIsUpdated,
    setIsError,
  };
}
