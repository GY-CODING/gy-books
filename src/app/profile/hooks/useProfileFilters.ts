import { useCallback, useState } from 'react';
import { EStatus } from '@/utils/constants/EStatus';

export type ProfileFilters = {
  status: EStatus | null;
  author: string;
  series: string;
  rating: number;
  search: string;
  orderBy: string;
  orderDirection: 'asc' | 'desc';
};

export type ProfileFiltersActions = {
  handleStatusFilterChange: (s: EStatus | null) => void;
  handleAuthorFilterChange: (a: string) => void;
  handleSeriesFilterChange: (s: string) => void;
  handleRatingFilterChange: (r: number) => void;
  handleSearchChange: (q: string) => void;
  handleOrderByChange: (o: string) => void;
  handleOrderDirectionChange: (d: 'asc' | 'desc') => void;
};

export function useProfileFilters(): ProfileFilters & ProfileFiltersActions {
  const [status, setStatus] = useState<EStatus | null>(null);
  const [author, setAuthor] = useState('');
  const [series, setSeries] = useState('');
  const [rating, setRating] = useState(0);
  const [search, setSearch] = useState('');
  const [orderBy, setOrderBy] = useState('rating');
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('desc');

  const handleStatusFilterChange = useCallback((s: EStatus | null) => setStatus(s), []);
  const handleAuthorFilterChange = useCallback((a: string) => setAuthor(a), []);
  const handleSeriesFilterChange = useCallback((s: string) => setSeries(s), []);
  const handleRatingFilterChange = useCallback((r: number) => setRating(r), []);
  const handleSearchChange = useCallback((q: string) => setSearch(q), []);
  const handleOrderByChange = useCallback((o: string) => setOrderBy(o), []);
  const handleOrderDirectionChange = useCallback((d: 'asc' | 'desc') => setOrderDirection(d), []);

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
