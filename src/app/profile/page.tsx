/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-expressions */
'use client';

import React, { Suspense } from 'react';
import { ProfileHeader } from './components/ProfileHeader/ProfileHeader';
import { ProfilePageSkeleton } from './components/ProfilePageSkeleton';
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
import ProfileSkeleton from '../components/atoms/ProfileSkeleton/ProfileSkeleton';
import { lora } from '@/utils/fonts/fonts';
import { useFriends } from '@/hooks/useFriends';
import AnimatedAlert from '../components/atoms/Alert/Alert';
import { ESeverity } from '@/utils/constants/ESeverity';
import { UUID } from 'crypto';

// Hooks del perfil
import { useProfileBiography } from './hooks/useProfileBiography';
import useMergedBooksIncremental from '@/hooks/books/useMergedBooksIncremental';

// Helpers
import { ProfileBookHelpers } from './utils/profileHelpers';

// Lazy components
// const Stats = React.lazy(() => import('../components/organisms/Stats'));
const HallOfFame = React.lazy(
  () => import('../components/molecules/HallOfFame')
);
const ActivityTab = React.lazy(
  () => import('../components/molecules/activityTab')
);
// import StatsSkeleton from '../components/molecules/StatsSkeleton';
import { HallOfFameSkeleton } from '../components/molecules/HallOfFameSkeleton';
import useProfileFilters from './hooks/useProfileFilters';
import { EBookStatus } from '@gycoding/nebula';

function ProfilePageContent() {
  const user = useSelector(
    (state: RootState) => state.user.profile
  ) as User | null;
  const isLoading = !user;
  const [tab, setTab] = React.useState(0);

  const { count: friendsCount, isLoading: isLoadingFriends } = useFriends();

  // Hooks personalizados para el perfil
  const filters = useProfileFilters();
  const { data: books = [], isLoading: loading, error: booksError, isDone } =
    useMergedBooksIncremental(user?.id as UUID, 25);
  const hasMore = !isDone;
  const {
    biography,
    isEditingBiography,
    isLoadingBiography,
    isUpdatedBiography,
    isErrorBiography,
    handleBiographyChange,
    handleBiographySave,
    handleEditBiography,
    handleCancelBiography,
    setIsUpdatedBiography,
    setIsErrorBiography,
  } = useProfileBiography(user);

  // incremental hook handles loading; no sentinel required

  // Generar opciones de filtros desde los libros
  const filterOptions = React.useMemo(() => {
    return ProfileBookHelpers.generateFilterOptions(books);
  }, [books]);

  // Filtrar y ordenar libros
  const filteredBooks = React.useMemo(() => {
    const filtered = ProfileBookHelpers.filterBooks(books, filters);
    return ProfileBookHelpers.sortBooks(
      filtered,
      filters.orderBy,
      filters.orderDirection
    );
  }, [books, filters]);

  if (isLoading) {
    return <ProfilePageSkeleton />;
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

  return (
    <Container
      maxWidth="xl"
      sx={{
        mt: { xs: 0, md: 0 },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: '70vh',
        height: '100%',
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
          onEditProfile={handleEditBiography}
          biography={biography || user?.biography || ''}
          isEditingBiography={isEditingBiography}
          isLoadingBiography={isLoadingBiography}
          onBiographyChange={handleBiographyChange}
          onBiographySave={handleBiographySave}
          onBiographyCancel={handleCancelBiography}
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
                fontFamily: lora.style.fontFamily,
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
                statusOptions={filterOptions.statusOptions as { label: string; value: EBookStatus }[]}
                statusFilter={filters.status}
                authorOptions={filterOptions.authorOptions}
                seriesOptions={filterOptions.seriesOptions}
                authorFilter={filters.author}
                seriesFilter={filters.series}
                ratingFilter={filters.rating}
                search={filters.search}
                onStatusChange={filters.handleStatusFilterChange}
                onAuthorChange={filters.handleAuthorFilterChange}
                onSeriesChange={filters.handleSeriesFilterChange}
                onRatingChange={filters.handleRatingFilterChange}
                onSearchChange={filters.handleSearchChange}
                orderBy={filters.orderBy}
                orderDirection={filters.orderDirection}
                onOrderByChange={filters.handleOrderByChange}
                onOrderDirectionChange={filters.handleOrderDirectionChange}
              />

              {loading && books.length === 0 ? (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: 60,
                    width: '100%',
                  }}
                >
                  <BooksListSkeleton />
                </Box>
              ) : books.length === 0 ? (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: 200,
                    width: '100%',
                  }}
                >
                  <Typography
                    sx={{ font: lora.style.fontFamily }}
                    color="white"
                    variant="h6"
                  >
                    You don&apos;t have any books in your library yet
                  </Typography>
                </Box>
              ) : (
                <BooksList books={filteredBooks} hasMore={hasMore} />
              )}

              {booksError && (
                <Box sx={{ mt: 2 }}>
                  <Typography color="error">Error loading books: {booksError.message}</Typography>
                </Box>
              )}
            </Box>
          )}
          {tab === 1 && (
            <Box
              sx={{
                mt: 4,
                color: '#fff',
                fontFamily: lora.style.fontFamily,
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
                fontFamily: lora.style.fontFamily,
                textAlign: 'center',
              }}
            >
              {/* <Suspense fallback={<StatsSkeleton />}>
                {user && <Stats id={user.id} />}
              </Suspense> */}
            </Box>
          )}
          {tab === 3 && (
            <Box
              sx={{
                mt: 4,
                color: '#FFFFFF',
                fontFamily: lora.style.fontFamily,
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