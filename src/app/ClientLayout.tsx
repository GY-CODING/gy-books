/* eslint-disable react/react-in-jsx-scope */
'use client';

import { UserProvider } from '@auth0/nextjs-auth0/client';
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
import { useUser } from '../hooks/useUser';
import { getTheme } from '@/styles/theme';
import Profile from './components/organisms/Profile';
import { ETheme } from '@/utils/constants/theme.enum';
import { useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import HomeIcon from '@mui/icons-material/Home';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user, isLoading } = useUser();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const menuItems = user
    ? [
        {
          text: 'Perfil',
          icon: <PersonIcon />,
          action: () => (window.location.href = '/profile'),
        },
        {
          text: 'Inicio',
          icon: <HomeIcon />,
          action: () => (window.location.href = '/'),
        },
        {
          text: 'Cerrar Sesión',
          icon: <LogoutIcon />,
          action: () => (window.location.href = '/api/auth/logout'),
        },
      ]
    : [
        {
          text: 'Iniciar Sesión',
          icon: <LoginIcon />,
          action: () => (window.location.href = '/api/auth/login'),
        },
      ];

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
      <Button
        variant="contained"
        onClick={() => (window.location.href = '/api/auth/login')}
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
    );
  };

  return (
    <UserProvider>
      <ThemeProvider theme={getTheme(ETheme.DARK)}>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: { xs: 'center', md: 'space-between' },
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: '#161616',
            padding: '16px 24px',
            zIndex: 1000,
            borderBottom: '1px solid rgba(147, 51, 234, 0.1)',
            height: '80px',
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
                }}
                src="/gy-logo.png"
                alt="logo"
              />
              {renderProfileOrLogin()}
            </>
          )}
        </Box>

        <Drawer
          anchor="bottom"
          open={drawerOpen}
          onClose={toggleDrawer}
          PaperProps={{
            sx: {
              backgroundColor: '#161616',
              color: 'white',
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px',
              height: 'auto',
              maxHeight: '80vh',
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            <Box
              sx={{
                width: '40px',
                height: '4px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '2px',
                margin: '0 auto 16px',
              }}
            />
            <List>
              {menuItems.map((item) => (
                <ListItem
                  key={item.text}
                  onClick={() => {
                    item.action();
                    toggleDrawer();
                  }}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                    },
                    mb: 1,
                  }}
                >
                  <ListItemIcon sx={{ color: 'white', minWidth: '40px' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        <Box sx={{ mt: '80px' }}>{children}</Box>
      </ThemeProvider>
    </UserProvider>
  );
}
