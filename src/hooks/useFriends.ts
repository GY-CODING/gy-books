import { Friend } from '@/domain/friend.model';
import getFriends from '@/app/actions/accounts/user/friend/friends';
import useSWR, { useSWRConfig } from 'swr';
import deleteFriend from '@/app/actions/accounts/user/friend/deleteFriend';
import { useState } from 'react';

interface useFriendsProps {
  data: Friend[] | undefined;
  isLoading: boolean;
  error: Error | null;
  count: number;
  isLoadingDelete: boolean;
  errorDelete: Error | null;
  isSuccessDelete: boolean;
  handleDeleteFriend: (
    userId: string,
    mutate?: (
      data?: Friend[] | null,
      options?: { revalidate?: boolean }
    ) => Promise<Friend[] | null | undefined>
  ) => Promise<void>;
  setIsSuccessDelete: (isSuccess: boolean) => void;
  setErrorDelete: (error: Error | null) => void;
  setIsLoadingDelete: (isLoading: boolean) => void;
}

export function useFriends(): useFriendsProps {
  const { data, isLoading, error } = useSWR(
    '/api/auth/users/accounts/friends',
    getFriends,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
      onError: (err) => {
        console.error('Error loading friends:', err);
      },
    }
  );
  const { mutate } = useSWRConfig();

  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [errorDelete, setErrorDelete] = useState<Error | null>(null);
  const [isSuccessDelete, setIsSuccessDelete] = useState(false);

  const handleDeleteFriend = async (
    userId: string,
    mutateFn?: (
      data?: Friend[] | null,
      options?: { revalidate?: boolean }
    ) => Promise<Friend[] | null | undefined>
  ) => {
    setIsLoadingDelete(true);
    try {
      await deleteFriend(userId);
      if (mutateFn) {
        await mutateFn(null, { revalidate: false });
      } else {
        await mutate('/api/auth/users/accounts/friends');
      }
      setIsSuccessDelete(true);
    } catch (error) {
      setErrorDelete(error as Error);
    } finally {
      setIsLoadingDelete(false);
    }
  };

  const count = data?.length;
  return {
    data,
    isLoading,
    error,
    count: count || 0,
    isLoadingDelete,
    errorDelete,
    isSuccessDelete,
    handleDeleteFriend,
    setIsSuccessDelete,
    setErrorDelete,
    setIsLoadingDelete,
  };
}
