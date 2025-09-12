/* eslint-disable @typescript-eslint/no-unused-expressions */
'use client';

import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  Suspense,
} from 'react';
import { ProfileHeader } from './components/ProfileHeader/ProfileHeader';
import { ProfileHeaderSkeleton } from './components/ProfileHeader/ProfileHeaderSkeleton';
import { BooksFilter } from './components/BooksFilter/BooksFilter';
import { BooksList } from './components/BooksList/BooksList';
import { BooksListSkeleton } from './components/BooksList/BooksListSkeleton';
import {
  Box,
  Container,
  Typography,
  Tab,
  Tabs,
  CircularProgress,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { User } from '@/domain/user.model';
import { EStatus } from '@/utils/constants/EStatus';
import ProfileSkeleton from '../components/atoms/ProfileSkeleton';
import { getBooksWithPagination } from '../actions/book/fetchApiBook';
import Book from '@/domain/book.model';
import { useSearchParams, useRouter } from 'next/navigation';
import { goudi } from '@/utils/fonts/fonts';
import { useFriends } from '@/hooks/useFriends';
import { useBiography } from '@/hooks/useBiography';
import AnimatedAlert from '../components/atoms/Alert';
import { ESeverity } from '@/utils/constants/ESeverity';
import { UUID } from 'crypto';
const Stats = React.lazy(() => import('../components/organisms/Stats'));
const HallOfFame = React.lazy(
  () => import('../components/molecules/HallOfFame')
);
const ActivityTab = React.lazy(
  () => import('../components/molecules/activityTab')
);
import StatsSkeleton from '../components/molecules/StatsSkeleton';
import { HallOfFameSkeleton } from '../components/molecules/HallOfFameSkeleton';

function ProfilePageContent() {
  const user = useSelector(
    (state: RootState) => state.user.profile
  ) as User | null;
  const isLoading = !user;
  const [tab, setTab] = React.useState(0);
  const searchParams = useSearchParams();
  const router = useRouter();

  const { count: friendsCount, isLoading: isLoadingFriends } = useFriends();
  // Obtener los filtros del URL al cargar la página
  const urlStatus = searchParams.get('status');
  const urlAuthor = searchParams.get('author');
  const urlSeries = searchParams.get('series');
  const urlRating = searchParams.get('rating');
  const urlSearch = searchParams.get('search') || '';

  const [statusFilter, setStatusFilter] = React.useState<EStatus | null>(
    urlStatus && Object.values(EStatus).includes(urlStatus as EStatus)
      ? (urlStatus as EStatus)
      : null
  );
  const [authorFilter, setAuthorFilter] = useState(urlAuthor || '');
  const [seriesFilter, setSeriesFilter] = useState(urlSeries || '');
  const [ratingFilter, setRatingFilter] = useState(
    urlRating ? Number(urlRating) : 0
  );
  const [search, setSearch] = useState(urlSearch);
  // Estado para ordenamiento
  const urlOrderBy = searchParams.get('orderBy') || 'rating';
  const urlOrderDirection = searchParams.get('orderDirection') || 'desc';
  const [orderBy, setOrderBy] = useState<string>(urlOrderBy);
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>(
    urlOrderDirection as 'asc' | 'desc'
  );

  const {
    handleUpdateBiography,
    setIsUpdated: setIsUpdatedBiography,
    isLoading: isLoadingBiography,
    isUpdated: isUpdatedBiography,
    isError: isErrorBiography,
    setIsError: setIsErrorBiography,
  } = useBiography();
  const [isEditingBiography, setIsEditingBiography] = useState(false);
  const [biography, setBiography] = useState(user?.biography);
  // Estado para paginación automática y filtros
  const [books, setBooks] = useState<Book[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const pageRef = useRef(0);
  // Sentinel ref para IntersectionObserver
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const statusOptions = [
    { label: 'Reading', value: EStatus.READING },
    { label: 'Read', value: EStatus.READ },
    { label: 'Want to read', value: EStatus.WANT_TO_READ },
  ];

  // Actualizar todos los filtros en la URL
  const updateUrl = useCallback(
    (filters: {
      status?: EStatus | null;
      author?: string;
      series?: string;
      rating?: number;
      search?: string;
      orderBy?: string;
      orderDirection?: 'asc' | 'desc';
    }) => {
      const params = new URLSearchParams(searchParams.toString());
      if (filters.status) {
        params.set('status', filters.status);
      } else {
        params.delete('status');
      }
      if (filters.author) {
        params.set('author', filters.author);
      } else {
        params.delete('author');
      }
      if (filters.series) {
        params.set('series', filters.series);
      } else {
        params.delete('series');
      }
      if (filters.rating && filters.rating > 0) {
        params.set('rating', String(filters.rating));
      } else {
        params.delete('rating');
      }
      if (filters.search) {
        params.set('search', filters.search);
      } else {
        params.delete('search');
      }
      if (filters.orderBy) {
        params.set('orderBy', filters.orderBy);
      } else {
        params.delete('orderBy');
      }
      if (filters.orderDirection) {
        params.set('orderDirection', filters.orderDirection);
      } else {
        params.delete('orderDirection');
      }
      router.replace(`/profile?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );
  // Handlers para ordenamiento
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
  // Handler para el buscador
  const handleSearchChange = useCallback(
    (newSearch: string) => {
      setSearch(newSearch);
      updateUrl({
        status: statusFilter,
        author: authorFilter,
        series: seriesFilter,
        rating: ratingFilter,
        search: newSearch,
      });
    },
    [statusFilter, authorFilter, seriesFilter, ratingFilter, updateUrl]
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
      });
    },
    [authorFilter, seriesFilter, ratingFilter, updateUrl]
  );
  const handleAuthorFilterChange = useCallback(
    (newAuthor: string) => {
      setAuthorFilter(newAuthor);
      updateUrl({
        status: statusFilter,
        author: newAuthor,
        series: seriesFilter,
        rating: ratingFilter,
      });
    },
    [statusFilter, seriesFilter, ratingFilter, updateUrl]
  );
  const handleSeriesFilterChange = useCallback(
    (newSeries: string) => {
      setSeriesFilter(newSeries);
      updateUrl({
        status: statusFilter,
        author: authorFilter,
        series: newSeries,
        rating: ratingFilter,
      });
    },
    [statusFilter, authorFilter, ratingFilter, updateUrl]
  );
  const handleRatingFilterChange = useCallback(
    (newRating: number) => {
      setRatingFilter(newRating);
      updateUrl({
        status: statusFilter,
        author: authorFilter,
        series: seriesFilter,
        rating: newRating,
      });
    },
    [statusFilter, authorFilter, seriesFilter, updateUrl]
  );

  // Sincronizar el estado con los search params cuando cambien (solo para navegación del navegador)
  useEffect(() => {
    const currentUrlStatus = searchParams.get('status');
    const newStatus =
      currentUrlStatus &&
      Object.values(EStatus).includes(currentUrlStatus as EStatus)
        ? (currentUrlStatus as EStatus)
        : null;

    // Solo actualizar si es diferente y no es el mismo valor que ya tenemos
    if (newStatus !== statusFilter) {
      setStatusFilter(newStatus);
    }
  }, [searchParams]); // Removido statusFilter de las dependencias para evitar loops

  // Función para cargar más libros
  const loadMoreBooks = useCallback(async () => {
    if (loading || !hasMore || !user?.id) return;

    setLoading(true);
    const currentPage = pageRef.current;
    try {
      const res = await getBooksWithPagination(
        user?.id as UUID,
        currentPage,
        5
      );
      if (res && Array.isArray(res.books) && res.books.length > 0) {
        setBooks((prev) => {
          // Evitar duplicados por id
          const allBooks = [...prev, ...res.books];
          const uniqueBooks = allBooks.filter(
            (book, idx, arr) => arr.findIndex((b) => b.id === book.id) === idx
          );
          return uniqueBooks;
        });
        pageRef.current = currentPage + 1;
        setHasMore(!!res.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading books:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [hasMore, loading, user?.id]);

  // Cargar libros iniciales SOLO cuando user.id cambie
  useEffect(() => {
    if (!user?.id) return;
    pageRef.current = 0;
    setBooks([]);
    setHasMore(true);
    setLoading(false);
    loadMoreBooks();
  }, [user?.id]);

  // Paginación automática con IntersectionObserver
  useEffect(() => {
    if (!hasMore || loading) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreBooks();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(sentinel);

    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [hasMore, loading, loadMoreBooks, books]);

  // Opciones únicas de autor y saga/serie
  // Opciones únicas de autor y saga/serie (evitar nulos/vacíos)
  // Opciones únicas de autor y saga/serie (usando .name)
  const authorOptions = React.useMemo(() => {
    const set = new Set<string>();
    books.forEach((b) => {
      if (b.author && b.author.name && b.author.name.trim() !== '')
        set.add(b.author.name);
    });
    return Array.from(set).sort();
  }, [books]);
  const seriesOptions = React.useMemo(() => {
    const set = new Set<string>();
    books.forEach((b) => {
      if (b.series && b.series.name && b.series.name.trim() !== '')
        set.add(b.series.name);
    });
    return Array.from(set).sort();
  }, [books]);

  // Filtrar y ordenar libros
  const filteredBooks = React.useMemo(() => {
    let result = books.filter((book) => {
      const statusOk = !statusFilter || book.status === statusFilter;
      const authorOk =
        !authorFilter || (book.author && book.author.name === authorFilter);
      const seriesOk =
        !seriesFilter || (book.series && book.series.name === seriesFilter);
      const ratingOk =
        !ratingFilter ||
        (typeof book.rating === 'number' && book.rating >= ratingFilter);
      const searchOk =
        !search ||
        (book.title &&
          book.title.toLowerCase().includes(search.toLowerCase())) ||
        (book.author &&
          book.author.name &&
          book.author.name.toLowerCase().includes(search.toLowerCase())) ||
        (book.series &&
          book.series.name &&
          book.series.name.toLowerCase().includes(search.toLowerCase()));
      return statusOk && authorOk && seriesOk && ratingOk && searchOk;
    });

    // Ordenar por orderBy y orderDirection
    result = result.sort((a, b) => {
      let aValue: string | number = '';
      let bValue: string | number = '';
      switch (orderBy) {
        case 'author':
          aValue = a.author?.name || '';
          bValue = b.author?.name || '';
          break;
        case 'series':
          aValue = a.series?.name || '';
          bValue = b.series?.name || '';
          break;
        case 'rating':
          aValue = typeof a.rating === 'number' ? a.rating : 0;
          bValue = typeof b.rating === 'number' ? b.rating : 0;
          break;
        case 'title':
        default:
          aValue = a.title || '';
          bValue = b.title || '';
      }
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        if (orderDirection === 'asc') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      } else {
        if (orderDirection === 'asc') {
          return (aValue as number) - (bValue as number);
        } else {
          return (bValue as number) - (aValue as number);
        }
      }
    });
    return result;
  }, [
    books,
    statusFilter,
    authorFilter,
    seriesFilter,
    ratingFilter,
    search,
    orderBy,
    orderDirection,
  ]);

  if (isLoading) {
    return (
      <Container
        maxWidth="xl"
        sx={{
          mt: { xs: 0, md: 6 },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          minHeight: '70vh',
          borderRadius: 0,
          boxShadow: 'none',
        }}
      >
        <Box
          sx={{
            width: { xs: '100%', md: '100%' },
            maxWidth: 1200,
            mx: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
          }}
        >
          <ProfileHeaderSkeleton />
          <Box
            sx={{
              mt: 6,
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 4,
            }}
          >
            <BooksListSkeleton />
          </Box>
        </Box>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="xl" sx={{ mt: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography>No hay usuario logueado</Typography>
        </Box>
      </Container>
    );
  }

  const handleBiographyChange = async () => {
    const formData = new FormData();
    formData.append('biography', biography || '');
    const biographyUpdated = await handleUpdateBiography(formData);
    setBiography(biographyUpdated);
    setIsEditingBiography(false);
    setIsUpdatedBiography(true);
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        mt: { xs: 0, md: 0 },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: '70vh',
        borderRadius: 0,
        boxShadow: 'none',
      }}
    >
      <Box
        sx={{
          width: { xs: '100%', md: '100%' },
          maxWidth: 1200,
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        }}
      >
        <ProfileHeader
          user={user}
          friendsCount={friendsCount}
          isLoadingFriends={isLoadingFriends}
          onEditProfile={() => setIsEditingBiography(true)}
          biography={biography || user?.biography || ''}
          isEditingBiography={isEditingBiography}
          isLoadingBiography={isLoadingBiography}
          onBiographyChange={setBiography}
          onBiographySave={handleBiographyChange}
          onBiographyCancel={() => setIsEditingBiography(false)}
        />
        <Box sx={{ mt: 0 }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            textColor="primary"
            indicatorColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              borderBottom: '1px solid #FFFFFF30',
              background: 'transparent',
              '.MuiTab-root': {
                color: '#fff',
                fontWeight: 'bold',
                fontFamily: goudi.style.fontFamily,
                fontSize: 20,
                textTransform: 'none',
                minWidth: 120,
              },
              '.Mui-selected': { color: '#FFFFFF' },
              '& .MuiTabs-scrollButtons': {
                color: '#fff',
              },
            }}
          >
            <Tab label="Books" />
            <Tab label="Hall of Fame" />
            <Tab label="Stats" />
            <Tab label="Activity" />
          </Tabs>
          {tab === 0 && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                mt: 4,
                width: '100%',
              }}
            >
              <BooksFilter
                statusOptions={statusOptions}
                statusFilter={statusFilter}
                authorOptions={authorOptions}
                seriesOptions={seriesOptions}
                authorFilter={authorFilter}
                seriesFilter={seriesFilter}
                ratingFilter={ratingFilter}
                search={search}
                onStatusChange={handleStatusFilterChange}
                onAuthorChange={handleAuthorFilterChange}
                onSeriesChange={handleSeriesFilterChange}
                onRatingChange={handleRatingFilterChange}
                onSearchChange={handleSearchChange}
                orderBy={orderBy}
                orderDirection={orderDirection}
                onOrderByChange={handleOrderByChange}
                onOrderDirectionChange={handleOrderDirectionChange}
              />
              <BooksList books={filteredBooks} hasMore={hasMore} />
              {/* Loader y sentinel para paginación infinita */}
              <Box
                ref={sentinelRef}
                sx={{
                  display: hasMore ? 'flex' : 'none',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: 60,
                  width: '100%',
                }}
              >
                {loading && <CircularProgress size={28} />}
              </Box>
            </Box>
          )}
          {tab === 1 && (
            <Box
              sx={{
                mt: 4,
                color: '#fff',
                fontFamily: goudi.style.fontFamily,
                textAlign: 'center',
              }}
            >
              <Suspense fallback={<HallOfFameSkeleton />}>
                {user && <HallOfFame userId={user.id} />}
              </Suspense>
            </Box>
          )}
          {tab === 2 && (
            <Box
              sx={{
                mt: 4,
                color: '#FFFFFF',
                fontFamily: goudi.style.fontFamily,
                textAlign: 'center',
              }}
            >
              <Suspense fallback={<StatsSkeleton />}>
                {user && <Stats id={user.id} />}
              </Suspense>
            </Box>
          )}
          {tab === 3 && (
            <Box
              sx={{
                mt: 4,
                color: '#FFFFFF',
                fontFamily: goudi.style.fontFamily,
                textAlign: 'center',
              }}
            >
              <Suspense fallback={<CircularProgress />}>
                {user && <ActivityTab id={user.id} />}
              </Suspense>
            </Box>
          )}
        </Box>
      </Box>
      <AnimatedAlert
        open={isUpdatedBiography}
        onClose={() => setIsUpdatedBiography(false)}
        message="Biography updated successfully"
        severity={ESeverity.SUCCESS}
      />
      <AnimatedAlert
        open={isErrorBiography}
        onClose={() => setIsErrorBiography(false)}
        message="Error updating biography"
        severity={ESeverity.ERROR}
      />
    </Container>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfilePageContent />
    </Suspense>
  );
}
