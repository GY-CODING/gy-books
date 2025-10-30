/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/react-in-jsx-scope */
'use client';

import { Auth0Provider } from '@auth0/nextjs-auth0';
import { Provider } from 'react-redux';
import { useState } from 'react';
import store from '@/store';
import {
  GyCodingUserProvider,
  useGyCodingUser,
} from '@/contexts/GyCodingUserContext';
import {
  ThemeProvider,
  CssBaseline,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Button,
  Skeleton,
  IconButton,
  Typography,
  CircularProgress,
} from '@mui/material';
import { getTheme } from '@/styles/theme';
import Profile from './components/organisms/Profile';
import { ETheme } from '@/utils/constants/theme.enum';
import { getMenuItems } from '@/utils/constants/MenuItems';
import { User } from '@/domain/user.model';
import { useRouter } from 'next/navigation';
import LogoutIcon from '@mui/icons-material/Logout';
import { lora } from '@/utils/fonts/fonts';
import InboxIcon from '@mui/icons-material/Inbox';
import CloseIcon from '@mui/icons-material/Close';
import { useFriendRequestsCount } from '@/hooks/useFriendRequestsCount';
import { useFriendRequests } from '@/hooks/useFriendRequests';
import FriendRequest from './components/atoms/FriendRequest/FriendRequest';
import AnimatedAlert from './components/atoms/Alert/Alert';
import { ESeverity } from '@/utils/constants/ESeverity';
import { UUID } from 'crypto';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import PersonIcon from '@mui/icons-material/Person';
import { CustomButton } from './components/atoms/CustomButton/customButton';
import { useStatsPreFetch } from '@/hooks/useStatsPreFetch';
import { useUser } from '@/hooks/useUser';
const ClientLayoutContent = ({ children }: { children: React.ReactNode }) => {
  // Removed isHydrated state to prevent hydration mismatch

  useUser(); // Fetch and store profile in Redux
  const { user, isLoading } = useGyCodingUser();
  // useStatsPreFetch(user?.id); // Pre-fetch stats for current user
  const { count } = useFriendRequestsCount(user?.id as UUID);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [friendRequestsOpen, setFriendRequestsOpen] = useState(false);
  const router = useRouter();

  const {
    isLoading: isLoadingRequests,
    isLoadingUsers,
    friendRequestsWithUsers,
    isLoadingManageRequest,
    errorManageRequest,
    setErrorManageRequest,
    isSuccessManageRequest,
    setIsSuccessManageRequest,
    handleManageRequest,
  } = useFriendRequests(user?.id as UUID);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const toggleFriendRequests = () => {
    setFriendRequestsOpen(!friendRequestsOpen);
  };

  const handleOpenErrorAlertClose = () => {
    setErrorManageRequest(false);
  };

  const handleOpenSuccessAlertClose = () => {
    setIsSuccessManageRequest(false);
  };

  const menuItems = getMenuItems(user as User | null);

  const renderProfileOrLogin = () => {
    if (isLoading) {
      return (
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            height: '48px',
          }}
        >
          <Skeleton
            variant="circular"
            sx={{
              width: '48px',
              height: '48px',
              bgcolor: 'rgba(255, 255, 255, 0.1)',
            }}
          />
        </Box>
      );
    }

    if (user) {
      return <Profile user={user} />;
    }

    return (
      <a href="/auth/login" style={{ textDecoration: 'none' }}>
        <CustomButton
          sx={{
            backgroundColor: 'primary.main',
            color: 'white',
            fontSize: '14px',
            letterSpacing: '0.1rem',
            height: '10px',
            py: '1.3rem',
            fontFamily: lora.style.fontFamily,
          }}
        >
          Login
        </CustomButton>
      </a>
    );
  };

  return (
    <ThemeProvider theme={getTheme(ETheme.DARK)}>
      <CssBaseline />
      <Box
        suppressHydrationWarning={true}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: '#161616',
        }}
      >
        <Box
          suppressHydrationWarning={true}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '80px',
            backgroundColor: 'rgba(22, 22, 22, 0.8)',
            backdropFilter: 'blur(10px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 3,
          }}
        >
          {isMobile ? (
            <Box
              component="img"
              onClick={toggleDrawer}
              sx={{
                width: '48px',
                height: '48px',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
              src="/gy-logo.png"
              alt="logo"
            />
          ) : (
            <Box
              suppressHydrationWarning={true}
              sx={{
                position: 'fixed',
                display: ['none', 'none', 'flex'],
                top: 0,
                left: 0,
                right: 0,
                height: '80px',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 3,
              }}
            >
              <Box
                component="img"
                sx={{
                  width: '48px',
                  height: '48px',
                  cursor: 'pointer',
                }}
                onClick={() => router.push('/')}
                src="/gy-logo.png"
                alt="logo"
              />
              <Box
                sx={{
                  display: 'flex',
                  height: '100%',
                  width: '100%',
                  justifyContent: 'end',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <CustomButton
                  variant="outlined"
                  onClick={() => router.push('/books')}
                  sx={{
                    borderColor: '#9333ea',
                    backgroundColor: 'transparent',
                    color: 'white',
                    fontSize: '14px',
                    letterSpacing: '0.1rem',
                    height: '10px',
                    py: '1.3rem',
                    fontFamily: lora.style.fontFamily,
                    '&:hover': {
                      borderColor: '#a855f7',
                      backgroundColor: 'rgba(147, 51, 234, 0.1)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                  startIcon={<LocalLibraryIcon />}
                >
                  Library
                </CustomButton>
                <CustomButton
                  variant="outlined"
                  onClick={() => router.push('/users/search')}
                  sx={{
                    borderColor: '#9333ea',
                    backgroundColor: 'transparent',
                    color: 'white',
                    fontSize: '14px',
                    letterSpacing: '0.1rem',
                    height: '10px',
                    py: '1.3rem',
                    fontFamily: lora.style.fontFamily,
                    '&:hover': {
                      borderColor: '#a855f7',
                      backgroundColor: 'rgba(147, 51, 234, 0.1)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                  startIcon={<PersonIcon />}
                >
                  Users
                </CustomButton>
                {user && (
                  <IconButton sx={{}} onClick={toggleFriendRequests}>
                    <InboxIcon
                      sx={{
                        fontSize: '28px',
                        color: isLoadingRequests ? 'gray' : '#FFF',
                        position: 'relative',
                      }}
                    />
                    {count > 0 && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          width: '20px',
                          height: '20px',
                          backgroundColor: 'primary.main',
                          color: 'white',
                          borderRadius: '50%',
                          padding: '4px',
                          fontSize: '12px',
                        }}
                      >
                        {count}
                      </Box>
                    )}
                  </IconButton>
                )}
                {renderProfileOrLogin()}
              </Box>
            </Box>
          )}
        </Box>

        {/* Overlay para cerrar la pestaña flotante */}
        {friendRequestsOpen && (
          <Box
            onClick={toggleFriendRequests}
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 998,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            }}
          />
        )}

        {/* Pestaña flotante de solicitudes de amistad */}
        {friendRequestsOpen && (
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              position: 'fixed',
              top: '80px',
              right: { xs: '10px', md: '20px' },
              left: { xs: '10px', md: 'auto' },
              width: { xs: 'auto', md: '500px' },
              maxHeight: { xs: '70vh', md: '500px' },
              zIndex: 999,
              backgroundColor: 'rgba(22, 22, 22, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: '#fff',
                  fontWeight: 'bold',
                  fontFamily: lora.style.fontFamily,
                  fontSize: { xs: 16, md: 20 },
                }}
              >
                Friend Requests
              </Typography>
              <IconButton
                onClick={toggleFriendRequests}
                sx={{ color: '#fff' }}
                size="small"
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <Box
              sx={{
                maxHeight: '600px',
                overflowY: 'auto',
                p: 2,
                '&::-webkit-scrollbar': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '3px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(255, 255, 255, 0.3)',
                  borderRadius: '3px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  background: 'rgba(255, 255, 255, 0.5)',
                },
              }}
            >
              {isLoadingRequests || isLoadingUsers ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress sx={{ color: '#fff' }} />
                </Box>
              ) : friendRequestsWithUsers &&
                friendRequestsWithUsers.length > 0 ? (
                friendRequestsWithUsers.map((requestWithUser) => (
                  <Box key={requestWithUser.id} sx={{ mb: 2, width: '100%' }}>
                    <FriendRequest
                      user={requestWithUser.user || null}
                      handleManageRequest={handleManageRequest}
                      isLoadingManageRequest={isLoadingManageRequest}
                      requestId={requestWithUser.id}
                    />
                  </Box>
                ))
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 3,
                  }}
                >
                  <Typography
                    sx={{
                      color: '#fff',
                      fontFamily: lora.style.fontFamily,
                      textAlign: 'center',
                    }}
                  >
                    No friend requests
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}

        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawer}
          sx={{
            '& .MuiDrawer-paper': {
              backgroundColor: '#161616',
              color: 'white',
              width: 280,
            },
          }}
        >
          <Box sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 3,
              }}
            >
              <Box
                component="img"
                sx={{
                  width: '48px',
                  height: '48px',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  router.push('/');
                  toggleDrawer();
                }}
                src="/gy-logo.png"
                alt="logo"
              />
              {user && (
                <IconButton
                  onClick={() => {
                    toggleFriendRequests();
                    toggleDrawer();
                  }}
                  sx={{ color: '#fff' }}
                >
                  <InboxIcon sx={{ fontSize: '24px' }} />
                  {count > 0 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '18px',
                        height: '18px',
                        backgroundColor: 'primary.main',
                        color: 'white',
                        borderRadius: '50%',
                        padding: '2px',
                        fontSize: '10px',
                      }}
                    >
                      {count}
                    </Box>
                  )}
                </IconButton>
              )}
            </Box>

            <List>
              {menuItems.map((item) => (
                <ListItem
                  key={item.text}
                  onClick={() => {
                    router.push(item.route);
                    toggleDrawer();
                  }}
                  sx={{
                    color: item.color,
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                    },
                    mb: 1,
                  }}
                >
                  <ListItemIcon
                    sx={{ color: item.color || 'white', minWidth: '40px' }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      fontWeight: 'bold',
                      fontFamily: lora.style.fontFamily,
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
          {user && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                p: 3,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <a href="/auth/logout" style={{ textDecoration: 'none' }}>
                <Button
                  variant="outlined"
                  color="error"
                  sx={(theme) => ({
                    fontSize: ['12px', '14px'],
                    transition: '0.3s',
                    '&:hover': {
                      background: 'red',
                      color: theme.palette.text.primary,
                    },
                  })}
                  startIcon={<LogoutIcon />}
                >
                  Logout
                </Button>
              </a>
            </Box>
          )}
        </Drawer>

        <Box suppressHydrationWarning={true} sx={{ mt: '80px' }}>
          {children}
        </Box>

        {/* Alertas para las solicitudes de amistad */}
        <AnimatedAlert
          open={errorManageRequest}
          onClose={handleOpenErrorAlertClose}
          severity={ESeverity.ERROR}
          message="Error managing request"
        />
        <AnimatedAlert
          open={isSuccessManageRequest}
          onClose={handleOpenSuccessAlertClose}
          severity={ESeverity.SUCCESS}
          message="Request managed successfully"
        />
      </Box>
    </ThemeProvider>
  );
};

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <Auth0Provider>
        <GyCodingUserProvider>
          <ClientLayoutContent>{children}</ClientLayoutContent>
        </GyCodingUserProvider>
      </Auth0Provider>
    </Provider>
  );
}
