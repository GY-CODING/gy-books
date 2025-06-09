/* eslint-disable @typescript-eslint/no-unused-vars */
import type { User } from '../domain/user.model';
import useSWR from 'swr';
import { getUser } from '../service/user.service';
interface useUserProps {
  data: User | undefined;
  isLoading: boolean;
  error: Error | null;
}
export function useUser(): useUserProps {
  const { data, isLoading, error } = useSWR('/api/auth/get', getUser);

  return {
    data,
    isLoading,
    error,
  };
}
