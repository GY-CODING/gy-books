'use client';

import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Box,
  Container,
  Typography,
  Tab,
  Tabs,
  CircularProgress,
} from '@mui/material';
import { BooksFilter } from '@/app/profile/components/BooksFilter/BooksFilter';
import { BooksList } from '@/app/profile/components/BooksList/BooksList';
import { useParams, useSearchParams } from 'next/navigation';
import { goudi } from '@/utils/fonts/fonts';
import { useAccountsUser } from '@/hooks/useAccountsUser';
import ProfileSkeleton from '@/app/components/atoms/ProfileSkeleton';
import { ProfileHeaderSkeleton } from '@/app/profile/components/ProfileHeader/ProfileHeaderSkeleton';
import { BooksListSkeleton } from '@/app/profile/components/BooksList/BooksListSkeleton';
import { getBooksWithPagination } from '@/app/actions/book/fetchApiBook';
import Book from '@/domain/book.model';
import { EStatus } from '@/utils/constants/EStatus';
import { useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import { ProfileHeader } from '@/app/profile/components/ProfileHeader/ProfileHeader';
const ActivityTab = React.lazy(
  () => import('@/app/components/molecules/activityTab')
);
const HallOfFame = React.lazy(
  () => import('@/app/components/molecules/HallOfFame')
);
const Stats = React.lazy(() => import('@/app/components/organisms/Stats'));

function ProfilePageContent() {
  const params = useParams();
  const { data: user, isLoading } = useAccountsUser(params.id as string);
  const userId = params.id as string;
  const [tab, setTab] = React.useState(0);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const pageRef = useRef(0);

  // Obtener los filtros del URL al cargar la página
  const urlStatus = searchParams.get('status');
  const urlAuthor = searchParams.get('author');
  const urlSeries = searchParams.get('series');
  const urlRating = searchParams.get('rating');
  const urlSearch = searchParams.get('search') || '';
  const urlOrderBy = searchParams.get('orderBy') || '';
  const urlOrderDirection =
    searchParams.get('orderDirection') === 'desc' ? 'desc' : 'asc';

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
  const [orderBy, setOrderBy] = useState<string>(urlOrderBy);
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>(
    urlOrderDirection
  );

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
      const paramsUrl = new URLSearchParams(searchParams.toString());
      if (filters.status) {
        paramsUrl.set('status', filters.status);
      } else {
        paramsUrl.delete('status');
      }
      if (filters.author) {
        paramsUrl.set('author', filters.author);
      } else {
        paramsUrl.delete('author');
      }
      if (filters.series) {
        paramsUrl.set('series', filters.series);
      } else {
        paramsUrl.delete('series');
      }
      if (filters.rating && filters.rating > 0) {
        paramsUrl.set('rating', String(filters.rating));
      } else {
        paramsUrl.delete('rating');
      }
      if (filters.search) {
        paramsUrl.set('search', filters.search);
      } else {
        paramsUrl.delete('search');
      }
      if (filters.orderBy) {
        paramsUrl.set('orderBy', filters.orderBy);
      } else {
        paramsUrl.delete('orderBy');
      }
      if (filters.orderDirection) {
        paramsUrl.set('orderDirection', filters.orderDirection);
      } else {
        paramsUrl.delete('orderDirection');
      }
      router.replace(`/users/${userId}?${paramsUrl.toString()}`, {
        scroll: false,
      });
    },
    [searchParams, router, userId]
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
    if (newStatus !== statusFilter) {
      setStatusFilter(newStatus);
    }
    const currentUrlAuthor = searchParams.get('author') || '';
    if (currentUrlAuthor !== authorFilter) {
      setAuthorFilter(currentUrlAuthor);
    }
    const currentUrlSeries = searchParams.get('series') || '';
    if (currentUrlSeries !== seriesFilter) {
      setSeriesFilter(currentUrlSeries);
    }
    const currentUrlRating = searchParams.get('rating');
    const newRating = currentUrlRating ? Number(currentUrlRating) : 0;
    if (newRating !== ratingFilter) {
      setRatingFilter(newRating);
    }
    const currentUrlSearch = searchParams.get('search') || '';
    if (currentUrlSearch !== search) {
      setSearch(currentUrlSearch);
    }
  }, [searchParams]);

  // Función para cargar más libros
  const loadMoreBooks = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const currentPage = pageRef.current;
    try {
      const res = await getBooksWithPagination(
        params.id as UUID,
        currentPage,
        10
      );
      if (res && Array.isArray(res.books) && res.books.length > 0) {
        setBooks((prev) => {
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
  }, [hasMore, loading]);

  // Cargar libros iniciales
  useEffect(() => {
    pageRef.current = 0;
    setBooks([]);
    setHasMore(true);
    loadMoreBooks();
  }, []);

  // Paginación automática cada 3 segundos usando setTimeout encadenado
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (hasMore && !loading) {
      timeout = setTimeout(() => {
        loadMoreBooks();
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [books, hasMore, loading, loadMoreBooks]);

  // Opciones únicas de autor y saga/serie
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

    // Solo ordenar si hay orderBy
    if (orderBy) {
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
            aValue = a.title || '';
            bValue = b.title || '';
            break;
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
    }
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
          <ProfileHeaderSkeleton canEdit={false} />
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
          <Typography>No user logged in</Typography>
        </Box>
      </Container>
    );
  }

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
        <ProfileHeader
          user={user}
          friendsCount={0}
          isLoadingFriends={false}
          onEditProfile={() => {}}
          biography={user.biography || ''}
          isEditingBiography={false}
          isLoadingBiography={false}
          onBiographyChange={() => {}}
          onBiographySave={() => {}}
          onBiographyCancel={() => {}}
          canEdit={false}
        />
        <Box sx={{ mt: 6 }}>
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
            <Tab
              sx={{
                fontSize: { xs: 15, md: 20 },
                letterSpacing: '.05rem',
                fontFamily: goudi.style.fontFamily,
              }}
              label="Books"
            />
            <Tab
              sx={{
                fontSize: { xs: 15, md: 20 },
                letterSpacing: '.05rem',
                fontFamily: goudi.style.fontFamily,
              }}
              label="Hall of Fame"
            />
            <Tab
              sx={{
                fontSize: { xs: 15, md: 20 },
                letterSpacing: '.05rem',
                fontFamily: goudi.style.fontFamily,
              }}
              label="Stats"
            />
            <Tab
              sx={{
                fontSize: { xs: 15, md: 20 },
                letterSpacing: '.05rem',
                fontFamily: goudi.style.fontFamily,
              }}
              label="Activity"
            />
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
              <Suspense fallback={<CircularProgress />}>
                {' '}
                <HallOfFame userId={user.id} />
              </Suspense>
            </Box>
          )}
          {tab === 2 && user?.id && (
            <Box
              sx={{
                mt: 4,
                color: '#FFFFFF',
                fontFamily: goudi.style.fontFamily,
                textAlign: 'center',
              }}
            >
              <Suspense fallback={<CircularProgress />}>
                {' '}
                <Stats id={user?.id as UUID} />
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
                <ActivityTab id={user?.id} />
              </Suspense>
            </Box>
          )}
        </Box>
      </Box>
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
