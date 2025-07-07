/* eslint-disable react/react-in-jsx-scope */
'use client';

import { UserProvider } from '@auth0/nextjs-auth0/client';
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
} from '@mui/material';
import { getTheme } from '@/styles/theme';
import Profile from './components/organisms/Profile';
import { ETheme } from '@/utils/constants/theme.enum';
import { useState } from 'react';
import { getMenuItems } from '@/utils/constants/MenuItems';
import { User } from '@/domain/user.model';
import { useRouter } from 'next/navigation';
import LogoutIcon from '@mui/icons-material/Logout';
import { goudi } from '@/utils/fonts/fonts';

const ClientLayoutContent = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useGyCodingUser();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
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
      <a href="/api/auth/login" style={{ textDecoration: 'none' }}>
        <Button
          id="login-button"
          variant="contained"
          onClick={() =>
            (window.location.href = '/api/auth/login?prompt=login')
          }
          sx={{
            display: { xs: 'none', md: 'flex' },
            background: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)',
            border: 'none',
            color: '#ffffff',
            fontWeight: 600,
            px: 3,
            py: 1.5,
            borderRadius: '12px',
            boxShadow: '0 4px 14px rgba(147, 51, 234, 0.4)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(147, 51, 234, 0.6)',
              background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          }}
        >
          Iniciar Sesión
        </Button>
      </a>
    );
  };

  return (
    <ThemeProvider theme={getTheme(ETheme.DARK)}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: '#161616',
        }}
      >
        <Box
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
            <>
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
              {renderProfileOrLogin()}
            </>
          )}
        </Box>

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
                      fontFamily: goudi.style.fontFamily,
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
              <a href="/api/auth/logout" style={{ textDecoration: 'none' }}>
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

        <Box sx={{ mt: '80px' }}>{children}</Box>
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
    <UserProvider>
      <GyCodingUserProvider>
        <ClientLayoutContent>{children}</ClientLayoutContent>
      </GyCodingUserProvider>
    </UserProvider>
  );
}
