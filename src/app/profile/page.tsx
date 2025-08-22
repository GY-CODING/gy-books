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
  const { isLoading: isLoadingFriends, count: friendsCount } = useFriends();
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
  // Estado para paginación automática
  const [books, setBooks] = useState<Book[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const pageRef = useRef(0);

  // Obtener el status del URL al cargar la página
  const urlStatus = searchParams.get('status');
  const [statusFilter, setStatusFilter] = React.useState<EStatus | null>(
    urlStatus && Object.values(EStatus).includes(urlStatus as EStatus)
      ? (urlStatus as EStatus)
      : null
  );

  const statusOptions = [
    { label: 'Reading', value: EStatus.READING },
    { label: 'Read', value: EStatus.READ },
    { label: 'Want to read', value: EStatus.WANT_TO_READ },
  ];

  const updateUrl = useCallback(
    (newStatus: EStatus | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (newStatus) {
        params.set('status', newStatus);
      } else {
        params.delete('status');
      }
      router.replace(`/profile?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  // Función para manejar cambios en el filtro
  const handleStatusFilterChange = useCallback(
    (newStatus: EStatus | null) => {
      setStatusFilter(newStatus);
      updateUrl(newStatus);
    },
    [updateUrl]
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

  // Memoizar el valor del filtro para evitar re-renders innecesarios
  const filterValue = React.useMemo(() => {
    return statusFilter ?? 'all';
  }, [statusFilter]);

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

  // Filtrar libros por status
  const filteredBooks = React.useMemo(() => {
    if (!statusFilter) return books;
    return books.filter((book) => book.status === statusFilter);
  }, [books, statusFilter]);

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
                flexDirection: { xs: 'column', md: 'row' },
                gap: 4,
                mt: 4,
              }}
            >
              <BooksFilter
                filterValue={filterValue}
                statusOptions={statusOptions}
                statusFilter={statusFilter}
                onChange={handleStatusFilterChange}
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
