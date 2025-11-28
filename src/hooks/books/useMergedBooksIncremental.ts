import { useEffect, useRef, useState } from 'react';
import type HardcoverBook from '../../domain/HardcoverBook';

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
  data: HardcoverBook[];
  isLoading: boolean;
  error: Error | null;
  isDone: boolean;
};

/**
 * useMergedBooksIncremental
 * - Fetch summaries page-by-page (pageSize, default 5)
 * - For each page, POST ids to /api/hardcover and merge userData into returned HardcoverBook[]
 * - Append results and continue automatically until all pages fetched
 */
export default function useMergedBooksIncremental(
  profileId?: string,
  pageSize = 5
): Result {
  const [data, setData] = useState<HardcoverBook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isDone, setIsDone] = useState(false);

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!profileId) {
      setData([]);
      setIsDone(true);
      return;
    }

    let cancelled = false;

    const run = async () => {
      setIsLoading(true);
      setError(null);
      setIsDone(false);
      setData([]);

      try {
        let page = 0;
        while (!cancelled && mountedRef.current) {
          const url = `/api/public/books?profileId=${profileId}&page=${page}&size=${pageSize}`;
          const res = await fetch(url);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const pageData = (await res.json()) as ProfileBookSummary[];
          if (!Array.isArray(pageData) || pageData.length === 0) {
            break;
          }

          // obtain ids and ask hardcover for this page
          const ids = pageData.map((p) => p.id).filter(Boolean);
          let hardcoverArr: HardcoverBook[] = [];
          if (ids.length > 0) {
            const hRes = await fetch('/api/hardcover', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ids }),
            });
            if (!hRes.ok) throw new Error(`Hardcover HTTP ${hRes.status}`);
            hardcoverArr = (await hRes.json()) as HardcoverBook[];
          }

          // merge userData into hardcover results by id
          const summaryById = new Map<string, ProfileUserData | undefined>();
          pageData.forEach((s) => summaryById.set(s.id, s.userData));

          const merged = hardcoverArr.map((hb) => ({
            ...hb,
            userData: summaryById.get(hb.id) || hb.userData,
          }));

          // append to state
          if (!cancelled && mountedRef.current) {
            setData((prev) => [...prev, ...(merged as HardcoverBook[])]);
          }

          // if the page returned less than pageSize, we've reached the end
          if (pageData.length < pageSize) break;
          page += 1;
        }

        if (!cancelled && mountedRef.current) {
          setIsDone(true);
        }
      } catch (e) {
        if (!cancelled && mountedRef.current) {
          const err = e instanceof Error ? e : new Error(String(e));
          setError(err);
        }
      } finally {
        if (!cancelled && mountedRef.current) setIsLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [profileId, pageSize]);

  return { data, isLoading, error, isDone };
}
