import { useState } from 'react';
import { useBiography } from '@/hooks/useBiography';
import { User } from '@/domain/user.model';

interface UseProfileBiographyReturn {
  biography: string;
  isEditingBiography: boolean;
  isLoadingBiography: boolean;
  isUpdatedBiography: boolean;
  isErrorBiography: boolean;
  handleBiographyChange: (newBiography: string) => void;
  handleBiographySave: () => Promise<void>;
  handleEditBiography: () => void;
  handleCancelBiography: () => void;
  setIsUpdatedBiography: (value: boolean) => void;
  setIsErrorBiography: (value: boolean) => void;
}

export function useProfileBiography(
  user: User | null
): UseProfileBiographyReturn {
  const {
    handleUpdateBiography,
    setIsUpdated: setIsUpdatedBiography,
    isLoading: isLoadingBiography,
    isUpdated: isUpdatedBiography,
    isError: isErrorBiography,
    setIsError: setIsErrorBiography,
  } = useBiography();

  const [isEditingBiography, setIsEditingBiography] = useState(false);
  const [biography, setBiography] = useState(user?.biography || '');

  const handleBiographyChange = (newBiography: string) => {
    setBiography(newBiography);
  };

  const handleBiographySave = async () => {
    const formData = new FormData();
    formData.append('biography', biography || '');
    const biographyUpdated = await handleUpdateBiography(formData);
    setBiography(biographyUpdated);
    setIsEditingBiography(false);
    setIsUpdatedBiography(true);
  };

  const handleEditBiography = () => {
    setIsEditingBiography(true);
  };

  const handleCancelBiography = () => {
    setBiography(user?.biography || '');
    setIsEditingBiography(false);
  };

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
  };
}
