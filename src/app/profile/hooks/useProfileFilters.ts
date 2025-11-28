import { useCallback, useState, useEffect } from 'react';
import { EBookStatus } from '@gycoding/nebula';
import { useSearchParams, useRouter } from 'next/navigation';

export type ProfileFilters = {
  status: EBookStatus | null;
  author: string;
  series: string;
  rating: number;
  search: string;
  orderBy: string;
  orderDirection: 'asc' | 'desc';
};

export type ProfileFiltersActions = {
  handleStatusFilterChange: (s: EBookStatus | null) => void;
  handleAuthorFilterChange: (a: string) => void;
  handleSeriesFilterChange: (s: string) => void;
  handleRatingFilterChange: (r: number) => void;
  handleSearchChange: (q: string) => void;
  handleOrderByChange: (o: string) => void;
  handleOrderDirectionChange: (d: 'asc' | 'desc') => void;
};

export function useProfileFilters(): ProfileFilters & ProfileFiltersActions {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Inicializar desde query params
  const [status, setStatus] = useState<EBookStatus | null>(
    (searchParams.get('status') as EBookStatus) || null
  );
  const [author, setAuthor] = useState(searchParams.get('author') || '');
  const [series, setSeries] = useState(searchParams.get('series') || '');
  const [rating, setRating] = useState(Number(searchParams.get('rating')) || 0);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [orderBy, setOrderBy] = useState(
    searchParams.get('orderBy') || 'rating'
  );
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>(
    (searchParams.get('orderDirection') as 'asc' | 'desc') || 'desc'
  );

  // Actualizar URL cuando cambien los filtros
  useEffect(() => {
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (author) params.set('author', author);
    if (series) params.set('series', series);
    if (rating > 0) params.set('rating', String(rating));
    if (search) params.set('search', search);
    if (orderBy !== 'rating') params.set('orderBy', orderBy);
    if (orderDirection !== 'desc') params.set('orderDirection', orderDirection);

    const newUrl = params.toString() ? `?${params.toString()}` : '/profile';
    router.replace(newUrl, { scroll: false });
  }, [status, author, series, rating, search, orderBy, orderDirection, router]);

  const handleStatusFilterChange = useCallback(
    (s: EBookStatus | null) => setStatus(s),
    []
  );
  const handleAuthorFilterChange = useCallback((a: string) => setAuthor(a), []);
  const handleSeriesFilterChange = useCallback((s: string) => setSeries(s), []);
  const handleRatingFilterChange = useCallback((r: number) => setRating(r), []);
  const handleSearchChange = useCallback((q: string) => setSearch(q), []);
  const handleOrderByChange = useCallback((o: string) => setOrderBy(o), []);
  const handleOrderDirectionChange = useCallback(
    (d: 'asc' | 'desc') => setOrderDirection(d),
    []
  );

  return {
    status,
    author,
    series,
    rating,
    search,
    orderBy,
    orderDirection,
    handleStatusFilterChange,
    handleAuthorFilterChange,
    handleSeriesFilterChange,
    handleRatingFilterChange,
    handleSearchChange,
    handleOrderByChange,
    handleOrderDirectionChange,
  };
}

export default useProfileFilters;
