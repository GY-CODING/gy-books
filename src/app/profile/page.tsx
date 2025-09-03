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
import { BooksFilterSkeleton } from './components/BooksFilter/BooksFilterSkeleton';
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
  const user = useSelector((state: RootState) => state.user.profile);
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
      router.replace(`/profile?${params.toString()}`, { scroll: false });
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

  // Paginación automática cada 2 segundos usando setTimeout encadenado
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (hasMore && !loading && user?.id) {
      timeout = setTimeout(() => {
        loadMoreBooks();
      }, 2000);
    }
    return () => clearTimeout(timeout);
  }, [books, hasMore, loading, loadMoreBooks, user?.id]);

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

  // Filtrar libros por status, autor, saga/serie y rating
  const filteredBooks = React.useMemo(() => {
    return books.filter((book) => {
      const statusOk = !statusFilter || book.status === statusFilter;
      const authorOk =
        !authorFilter || (book.author && book.author.name === authorFilter);
      const seriesOk =
        !seriesFilter || (book.series && book.series.name === seriesFilter);
      const ratingOk =
        !ratingFilter ||
        (typeof book.rating === 'number' && book.rating >= ratingFilter);
      return statusOk && authorOk && seriesOk && ratingOk;
    });
  }, [books, statusFilter, authorFilter, seriesFilter, ratingFilter]);

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
            <BooksFilterSkeleton />
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
          friendsCount={friendsCount}
          isLoadingFriends={isLoadingFriends}
          onEditProfile={() => setIsEditingBiography(true)}
          biography={biography || user.biography || ''}
          isEditingBiography={isEditingBiography}
          isLoadingBiography={isLoadingBiography}
          onBiographyChange={setBiography}
          onBiographySave={handleBiographyChange}
          onBiographyCancel={() => setIsEditingBiography(false)}
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
                onStatusChange={handleStatusFilterChange}
                onAuthorChange={handleAuthorFilterChange}
                onSeriesChange={handleSeriesFilterChange}
                onRatingChange={handleRatingFilterChange}
              />
              <BooksList
                books={filteredBooks}
                loading={loading}
                hasMore={hasMore}
              />
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
                <HallOfFame userId={user.id} />
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
                <ActivityTab id={user?.id as UUID} />
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
