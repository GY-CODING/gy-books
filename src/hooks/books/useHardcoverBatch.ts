import { useEffect, useState } from 'react';
import type HardcoverBook from '../../domain/HardcoverBook';

type Result = {
  data: HardcoverBook[] | null;
  isLoading: boolean;
  error: Error | null;
};

/**
 * useHardcoverBatch
 * - Envía un POST a /api/hardcover con { ids: string[] }
 * - Devuelve la lista de HardcoverBook mapeados por el servidor
 */
export function useHardcoverBatch(ids: string[] | undefined | null): Result {
  const [data, setData] = useState<HardcoverBook[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    const abort = new AbortController();

    const fetchBatch = async () => {
      if (!ids || ids.length === 0) {
        setData([]);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/hardcover', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids }),
          signal: abort.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as HardcoverBook[];
        if (mounted) setData(json || []);
      } catch (e) {
        if (!mounted) return;
        const err = e instanceof Error ? e : new Error(String(e));
        setError(err);
        setData([]);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchBatch();

    return () => {
      mounted = false;
      abort.abort();
    };
  }, [ids]);

  return { data, isLoading, error };
}

export default useHardcoverBatch;
