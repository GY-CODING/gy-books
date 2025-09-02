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
import { BooksFilterSkeleton } from '@/app/profile/components/BooksFilter/BooksFilterSkeleton';
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

  // Función para actualizar la URL cuando cambie el filtro
  const updateUrl = useCallback(
    (newStatus: EStatus | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (newStatus) {
        params.set('status', newStatus);
      } else {
        params.delete('status');
      }
      router.replace(`/users/${userId as string}?${params.toString()}`, {
        scroll: false,
      });
    },
    [searchParams, router, params.id]
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

  // Filtrar libros por status
  React.useEffect(() => {
    if (books.length > 0) {
      // Log temporal para depuración
      // eslint-disable-next-line no-console
    }
  }, [books]);

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
          <ProfileHeaderSkeleton canEdit={false} />
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
