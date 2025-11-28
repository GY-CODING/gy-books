import { useState, useCallback, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { EStatus } from '@/utils/constants/EStatus';
import { ProfileFilters, ProfileFiltersActions } from '../utils/profileTypes';
import { ProfileURLHelpers } from '../utils/urlHelpers';

export function useProfileFilters(): ProfileFilters & ProfileFiltersActions {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Inicializar filtros desde URL
  const initialFilters = ProfileURLHelpers.parseFiltersFromURL(searchParams);

  const [statusFilter, setStatusFilter] = useState<EStatus | null>(
    initialFilters.status || null
  );
  const [authorFilter, setAuthorFilter] = useState(initialFilters.author || '');
  const [seriesFilter, setSeriesFilter] = useState(initialFilters.series || '');
  const [ratingFilter, setRatingFilter] = useState(initialFilters.rating || 0);
  const [search, setSearch] = useState(initialFilters.search || '');
  const [orderBy, setOrderBy] = useState(initialFilters.orderBy || 'rating');
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>(
    initialFilters.orderDirection || 'desc'
  );

  // Función para actualizar URL
  const updateUrl = useCallback(
    (filters: Partial<ProfileFilters>) => {
      const urlParams = ProfileURLHelpers.buildURLFromFilters(
        filters,
        searchParams
      );
      router.replace(`/profile?${urlParams}`, { scroll: false });
    },
    [searchParams, router]
  );

  // Handlers para cada filtro
  const handleStatusFilterChange = useCallback(
    (newStatus: EStatus | null) => {
      setStatusFilter(newStatus);
      updateUrl({
        status: newStatus,
        author: authorFilter,
        series: seriesFilter,
        rating: ratingFilter,
        search,
        orderBy,
        orderDirection,
      });
    },
    [
      authorFilter,
      seriesFilter,
      ratingFilter,
      search,
      orderBy,
      orderDirection,
      updateUrl,
    ]
  );

  const handleAuthorFilterChange = useCallback(
    (newAuthor: string) => {
      setAuthorFilter(newAuthor);
      updateUrl({
        status: statusFilter,
        author: newAuthor,
        series: seriesFilter,
        rating: ratingFilter,
        search,
        orderBy,
        orderDirection,
      });
    },
    [
      statusFilter,
      seriesFilter,
      ratingFilter,
      search,
      orderBy,
      orderDirection,
      updateUrl,
    ]
  );

  const handleSeriesFilterChange = useCallback(
    (newSeries: string) => {
      setSeriesFilter(newSeries);
      updateUrl({
        status: statusFilter,
        author: authorFilter,
        series: newSeries,
        rating: ratingFilter,
        search,
        orderBy,
        orderDirection,
      });
    },
    [
      statusFilter,
      authorFilter,
      ratingFilter,
      search,
      orderBy,
      orderDirection,
      updateUrl,
    ]
  );

  const handleRatingFilterChange = useCallback(
    (newRating: number) => {
      setRatingFilter(newRating);
      updateUrl({
        status: statusFilter,
        author: authorFilter,
        series: seriesFilter,
        rating: newRating,
        search,
        orderBy,
        orderDirection,
      });
    },
    [
      statusFilter,
      authorFilter,
      seriesFilter,
      search,
      orderBy,
      orderDirection,
      updateUrl,
    ]
  );

  const handleSearchChange = useCallback(
    (newSearch: string) => {
      setSearch(newSearch);
      updateUrl({
        status: statusFilter,
        author: authorFilter,
        series: seriesFilter,
        rating: ratingFilter,
        search: newSearch,
        orderBy,
        orderDirection,
      });
    },
    [
      statusFilter,
      authorFilter,
      seriesFilter,
      ratingFilter,
      orderBy,
      orderDirection,
      updateUrl,
    ]
  );

  const handleOrderByChange = useCallback(
    (newOrderBy: string) => {
      setOrderBy(newOrderBy);
      updateUrl({
        status: statusFilter,
        author: authorFilter,
        series: seriesFilter,
        rating: ratingFilter,
        search,
        orderBy: newOrderBy,
        orderDirection,
      });
    },
    [
      statusFilter,
      authorFilter,
      seriesFilter,
      ratingFilter,
      search,
      orderDirection,
      updateUrl,
    ]
  );

  const handleOrderDirectionChange = useCallback(
    (newDirection: 'asc' | 'desc') => {
      setOrderDirection(newDirection);
      updateUrl({
        status: statusFilter,
        author: authorFilter,
        series: seriesFilter,
        rating: ratingFilter,
        search,
        orderBy,
        orderDirection: newDirection,
      });
    },
    [
      statusFilter,
      authorFilter,
      seriesFilter,
      ratingFilter,
      search,
      orderBy,
      updateUrl,
    ]
  );

  // Sincronizar con cambios en URL (navegación del navegador)
  useEffect(() => {
    const currentUrlStatus = searchParams.get('status');
    const newStatus =
      currentUrlStatus &&
      Object.values(EStatus).includes(currentUrlStatus as EStatus)
        ? (currentUrlStatus as EStatus)
        : null;

    if (newStatus !== statusFilter) {
      setStatusFilter(newStatus);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); // Intencionalmente omitimos statusFilter para evitar loops infinitos

  return {
    status: statusFilter,
    author: authorFilter,
    series: seriesFilter,
    rating: ratingFilter,
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
