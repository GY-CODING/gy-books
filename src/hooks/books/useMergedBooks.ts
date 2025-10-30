import { useMemo } from 'react';
import useProfileBooks, { ProfileUserData } from './useProfileBooks';
import useHardcoverBatch from './useHardcoverBatch';
import type HardcoverBook from '../../domain/HardcoverBook';

type Result = {
  data: HardcoverBook[];
  isLoading: boolean;
  error: Error | null;
};

/**
 * useMergedBooks
 * - Composición: obtiene los summaries del profile, pide a /api/hardcover por ids,
 *   y mezcla userData en los HardcoverBook resultantes.
 */
export default function useMergedBooks(profileId?: string): Result {
  const { data: summaries, isLoading: loadingSummaries, error: errSummaries } = useProfileBooks(profileId);

  const ids = useMemo(() => {
    if (!summaries) return [] as string[];
    return summaries.map((s) => s.id);
  }, [summaries]);

  const { data: hardcoverData, isLoading: loadingHardcover, error: errHardcover } = useHardcoverBatch(ids);

  const error = (errSummaries || errHardcover) ?? null;
  const isLoading = loadingSummaries || loadingHardcover;

  const data: HardcoverBook[] = useMemo(() => {
    if (!hardcoverData || hardcoverData.length === 0) return [];
  const summaryById = new Map<string, ProfileUserData | undefined>();
  (summaries || []).forEach((s) => summaryById.set(s.id, s.userData));

  return (hardcoverData.map((hb) => ({ ...hb, userData: summaryById.get(hb.id) || hb.userData })) as unknown) as HardcoverBook[];
  }, [hardcoverData, summaries]);

  return { data, isLoading, error };
}
