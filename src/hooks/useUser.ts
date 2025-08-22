/* eslint-disable @typescript-eslint/no-unused-vars */
import useSWR from 'swr';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { User } from '@/domain/user.model';
import fetchUser from '@/app/actions/accounts/fetchUser';
import { setProfile } from '@/store/userSlice';
interface useUserProps {
  data: User | null;
  isLoading: boolean;
  error: Error | null;
}
export function useUser(): useUserProps {
  const dispatch = useDispatch();
  const { data, isLoading, error } = useSWR('/api/auth/get', fetchUser, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    dedupingInterval: 5000,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
    focusThrottleInterval: 5000,
    keepPreviousData: true,
  });

  useEffect(() => {
    if (data) {
      dispatch(setProfile(data));
    }
  }, [data, dispatch]);

  return {
    data: data || null,
    isLoading,
    error,
  };
}
