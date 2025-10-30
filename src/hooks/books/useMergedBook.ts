/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR from 'swr';
import getApiBook from '@/app/actions/book/fetchApiBook';
import fetchBookById from '@/app/actions/book/fetchBookById';
import type HardcoverBook from '@/domain/HardcoverBook';

type Result = {
  data: HardcoverBook | null;
  isLoading: boolean;
  error: Error | null;
  mutate: (data?: HardcoverBook | null, options?: { revalidate?: boolean }) => Promise<HardcoverBook | null | undefined>;
};

export function useMergedBook(id?: string): Result {
  const fetcher = async (bookId: string) => {
    if (!bookId) return null;

    // call both sources in parallel and allow one to fail
    const [apiResult, hardcoverResult] = await Promise.all([
      getApiBook(bookId).catch(() => null),
      fetchBookById(bookId).catch(() => null),
    ]);

    // If we have a HardcoverBook, prefer it and augment with api data
    if (hardcoverResult) {
      const merged: any = { ...(hardcoverResult as any) };
      if (apiResult) {
        // apiResult may provide averageRating and userData
        if ((apiResult as any).averageRating !== undefined) merged.averageRating = (apiResult as any).averageRating;
        if ((apiResult as any).userData !== undefined) merged.userData = (apiResult as any).userData;
      }
      return merged as HardcoverBook;
    }

    // Fallback: return apiResult casted to HardcoverBook when hardcover missing
    if (apiResult) {
      return apiResult as unknown as HardcoverBook;
    }

    return null;
  };

  const { data, error, isLoading, mutate } = useSWR(id ? id : null, fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  return {
    data: (data as HardcoverBook) || null,
    isLoading,
    error: error ?? null,
    mutate,
  };
}

export default useMergedBook;
