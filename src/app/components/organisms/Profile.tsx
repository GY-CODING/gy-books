import {
  Avatar,
  Box,
  Popper,
  Paper,
  Grow,
  ClickAwayListener,
} from '@mui/material';
import * as React from 'react';
import { User } from '@/domain/user.model';
import { inter } from '../atoms/BookCard';
import Image from 'next/image';
import Link from 'next/link';

interface ProfileProps {
  user?: User;
}

export default function Profile({ user }: ProfileProps): JSX.Element {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setOpen(false);
  };

  return (
    <Box
      sx={{
        display: { xs: 'none', md: 'flex' },
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        height: '48px',
      }}
    >
      <Box
        ref={anchorRef}
        onClick={handleToggle}
        sx={{
          cursor: 'pointer',
          padding: '4px',
          borderRadius: '50%',
          transition: 'background-color 0.3s ease',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        <Avatar
          src={user?.picture}
          sx={{
            width: '48px',
            height: '48px',
            border: '2px solid rgba(147, 51, 234, 0.3)',
            transition: 'border-color 0.3s ease',
            '&:hover': {
              border: '2px solid #9333ea',
            },
          }}
        />
      </Box>

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-end"
        transition
        sx={{
          zIndex: 1000,
        }}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper
              sx={{
                backgroundColor: '#232323',
                color: 'white',
                borderRadius: '16px',
                marginTop: '8px',
                width: '233px',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
                border: '1px solid rgba(147, 51, 234, 0.1)',
                overflow: 'hidden',
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    padding: '8px',
                  }}
                >
                  <Box
                    sx={{
                      fontWeight: 'bold',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingX: '20px',
                      fontFamily: inter.style.fontFamily,
                      borderRadius: '8px',
                      transition: 'background-color 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(147, 51, 234, 0.1)',
                      },
                    }}
                  >
                    <Link
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        textDecoration: 'none',
                        color: 'white',
                        fontWeight: 'bold',
                        fontFamily: inter.style.fontFamily,
                      }}
                      href={'/profile'}
                    >
                      Perfil
                      <Image
                        src="/logout.svg"
                        alt="profile"
                        width={20}
                        height={20}
                      />
                    </Link>
                  </Box>

                  <Box
                    sx={{
                      fontWeight: 'bold',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingX: '20px',
                      fontFamily: inter.style.fontFamily,
                      borderRadius: '8px',
                      transition: 'background-color 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 82, 82, 0.1)',
                      },
                    }}
                  >
                    <Link
                      style={{
                        textDecoration: 'none',
                        color: '#FF5252',
                        fontWeight: 'bold',
                        fontFamily: inter.style.fontFamily,
                        display: 'flex',
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                      href={'/api/auth/logout'}
                    >
                      Cerrar Sesión
                      <Image
                        src="/logout-red.svg"
                        alt="logout"
                        width={20}
                        height={20}
                      />
                    </Link>
                  </Box>
                </Box>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  );
}
