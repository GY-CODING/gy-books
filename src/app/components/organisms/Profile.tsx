import { Box, Popper, Paper, Grow, ClickAwayListener } from '@mui/material';
import * as React from 'react';
import { User } from '@/domain/user.model';
import Image from 'next/image';
import Link from 'next/link';
import { goudi } from '@/utils/fonts/fonts';
import GroupIcon from '@mui/icons-material/Group';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
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
        }}
      >
        <Image
          src={user?.picture || ''}
          className="rounded-full"
          style={{
            width: '48px',
            height: '48px',
            aspectRatio: '1/1',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid #8C54FF',
            transition: 'border-color 0.3s ease',
            zIndex: 1000,
          }}
          alt={user?.username || ''}
          width={100}
          height={100}
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
                    id="profile-menu-item"
                    sx={{
                      fontWeight: 'bold',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingX: '20px',
                      fontFamily: goudi.style.fontFamily,
                      fontSize: '18px',
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
                        fontFamily: goudi.style.fontFamily,
                      }}
                      href={'/profile'}
                      onClick={() => {
                        handleClose(new Event('click'));
                      }}
                    >
                      Profile
                      <AccountCircleIcon
                        sx={{ fontSize: '24px', color: '#FFF' }}
                      />
                    </Link>
                  </Box>

                  <Box
                    id="friends-menu-item"
                    sx={{
                      fontWeight: 'bold',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingX: '20px',
                      fontFamily: goudi.style.fontFamily,
                      borderRadius: '8px',
                      transition: 'background-color 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(147, 51, 234, 0.1)',
                      },
                    }}
                  >
                    <a
                      style={{
                        textDecoration: 'none',
                        color: '#FFF',
                        fontWeight: 'bold',
                        fontFamily: goudi.style.fontFamily,
                        fontSize: '18px',
                        display: 'flex',
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                      href={'/users/friends'}
                      onClick={() => {
                        handleClose(new Event('click'));
                      }}
                    >
                      Friends
                      <GroupIcon sx={{ fontSize: '24px', color: '#FFF' }} />
                    </a>
                  </Box>

                  <Box
                    id="logout-menu-item"
                    sx={{
                      fontWeight: 'bold',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingX: '20px',
                      fontFamily: goudi.style.fontFamily,
                      borderRadius: '8px',
                      transition: 'background-color 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 82, 82, 0.1)',
                      },
                    }}
                  >
                    <a
                      style={{
                        textDecoration: 'none',
                        color: '#FF5252',
                        fontWeight: 'bold',
                        fontFamily: goudi.style.fontFamily,
                        fontSize: '18px',
                        display: 'flex',
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                      href={'/auth/logout?federated=true'}
                      onClick={() => {
                        handleClose(new Event('click'));
                      }}
                    >
                      Logout
                      <Image
                        src="/logout-red.svg"
                        alt="logout"
                        width={20}
                        height={20}
                      />
                    </a>
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
