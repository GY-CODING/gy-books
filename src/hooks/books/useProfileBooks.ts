import { useEffect, useState } from 'react';

export type ProfileUserData = {
  editionId?: string;
  status?: string;
  rating?: number;
  review?: string;
  progress?: number;
  startedAt?: string;
  finishedAt?: string;
  [key: string]: unknown;
};

export type ProfileBookSummary = {
  id: string;
  averageRating?: number;
  userData?: ProfileUserData;
};

type Result = {
  data: ProfileBookSummary[];
  isLoading: boolean;
  error: Error | null;
};

/**
 * useProfileBooks
 * - Recupera todos los items (paginated) de la API de Spring para un perfil
 * - Llama a `/api/public/accounts/${profileId}/books?page=${page}&size=${size}`
 * - Acumula páginas hasta que la página devuelta sea menor al tamaño
 */
export function useProfileBooks(profileId?: string, pageSize = 50): Result {
  const [data, setData] = useState<ProfileBookSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    const abort = new AbortController();

    const fetchAll = async () => {
      if (!profileId) {
        setData([]);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const accumulated: ProfileBookSummary[] = [];
        let page = 0;
        while (mounted) {
          const url = `/api/public/books?profileId=${profileId}&page=${page}&size=${pageSize}`;
          const res = await fetch(url, { signal: abort.signal });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const pageData = (await res.json()) as ProfileBookSummary[];
          if (!Array.isArray(pageData) || pageData.length === 0) break;
          accumulated.push(...pageData);
          if (pageData.length < pageSize) break;
          page += 1;
        }
        if (mounted) setData(accumulated);
      } catch (e) {
        if (!mounted) return;
        const err = e instanceof Error ? e : new Error(String(e));
        setError(err);
        setData([]);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchAll();

    return () => {
      mounted = false;
      abort.abort();
    };
  }, [profileId, pageSize]);

  return { data, isLoading, error };
}

export default useProfileBooks;
