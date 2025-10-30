/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useState } from 'react';
import type { User } from '@/domain/user.model';

type UseProfileBiographyReturn = {
  biography: string | null;
  isEditingBiography: boolean;
  isLoadingBiography: boolean;
  isUpdatedBiography: boolean;
  isErrorBiography: boolean;
  handleBiographyChange: (v: string) => void;
  handleBiographySave: () => Promise<void>;
  handleEditBiography: () => void;
  handleCancelBiography: () => void;
  setIsUpdatedBiography: (v: boolean) => void;
  setIsErrorBiography: (v: boolean) => void;
};

export function useProfileBiography(user: User | null): UseProfileBiographyReturn {
  const [biography, setBiography] = useState<string | null>(user?.biography ?? null);
  const [isEditingBiography, setIsEditingBiography] = useState(false);
  const [isLoadingBiography, setIsLoadingBiography] = useState(false);
  const [isUpdatedBiography, setIsUpdatedBiography] = useState(false);
  const [isErrorBiography, setIsErrorBiography] = useState(false);

  const handleBiographyChange = useCallback((v: string) => setBiography(v), []);

  const handleEditBiography = useCallback(() => setIsEditingBiography(true), []);
  const handleCancelBiography = useCallback(() => {
    setIsEditingBiography(false);
    setBiography(user?.biography ?? null);
  }, [user]);

  const handleBiographySave = useCallback(async () => {
    setIsLoadingBiography(true);
    setIsErrorBiography(false);
    try {
      // Placeholder: actual save should call a server action to persist
      await new Promise((res) => setTimeout(res, 200));
      setIsUpdatedBiography(true);
      setIsEditingBiography(false);
    } catch (e) {
      setIsErrorBiography(true);
    } finally {
      setIsLoadingBiography(false);
    }
  }, []);

  return {
    biography,
    isEditingBiography,
    isLoadingBiography,
    isUpdatedBiography,
    isErrorBiography,
    handleBiographyChange,
    handleBiographySave,
    handleEditBiography,
    handleCancelBiography,
    setIsUpdatedBiography,
    setIsErrorBiography,
  } as UseProfileBiographyReturn;
}

export default useProfileBiography;
