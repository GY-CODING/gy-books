/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState, Suspense } from 'react';
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearchParams, useRouter } from 'next/navigation';
import { birthStone, goudi } from '@/utils/fonts/fonts';
import { User } from '@/domain/friend.model';
import queryUsers from '@/app/actions/accounts/user/fetchUsers';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import addFriend from '@/app/actions/accounts/user/friend/addFriend';
import AnimatedAlert from '@/app/components/atoms/Alert';
import { ESeverity } from '@/utils/constants/ESeverity';
import Image from 'next/image';
import CustomTitle from '@/app/components/atoms/CustomTitle';

function BooksContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [userSearched, setUserSearched] = useState(searchParams.get('q') || '');
  const [users, setUsers] = useState<User[]>([]);
  const debouncedUsername = useDebounce(userSearched, 250);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fetchUsers = async () => {
      if (debouncedUsername) {
        const formData = new FormData();
        formData.append('username', debouncedUsername);
        const result = await queryUsers(formData);
        setUsers(result);
      } else {
        setUsers([]);
      }
    };

    fetchUsers();
  }, [debouncedUsername]);

  const handleAddFriend = async (userId: string) => {
    try {
      const formData = new FormData();
      formData.append('userId', userId);
      await addFriend(formData);
      setOpen(true);
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedUsername) {
      params.set('q', debouncedUsername);
    } else {
      params.delete('q');
    }
    router.push(`/users/search?${params.toString()}`);
  }, [debouncedUsername, router, searchParams]);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
        }}
      >
        <CustomTitle
          text="Search Users"
          size="6rem"
          fontFamily={birthStone.style.fontFamily}
          sx={{
            color: 'white',
          }}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '10%',
            gap: '1rem',
            paddingTop: '10px',
          }}
        >
          <TextField
            placeholder="Search for a user..."
            value={userSearched}
            onChange={(e) => setUserSearched(e.target.value)}
            variant="outlined"
            sx={{
              mb: '8px',
              width: ['60%', '60%', '60%'],
              backgroundColor: '#232323',
              borderRadius: '16px',
              fontFamily: goudi.style.fontFamily,
              '& .MuiOutlinedInput-root': {
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'transparent',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                  borderRadius: '16px',
                  borderWidth: '1px',
                },
                '&.MuiFormLabel-root': {
                  color: 'transparent',
                  fontFamily: goudi.style.fontFamily,
                },
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'transparent',
              },
              '& .MuiInputBase-input': {
                color: 'white',
                fontFamily: goudi.style.fontFamily,
              },
              '& .MuiInputLabel-root': {
                color: 'white',
                fontFamily: goudi.style.fontFamily,
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'white',
                fontSize: '22px',
                fontFamily: goudi.style.fontFamily,
              },
            }}
            slotProps={{
              htmlInput: {
                style: {
                  width: '100%',
                  color: 'white',
                  fontFamily: goudi.style.fontFamily,
                  fontSize: '20px',

                  fieldSet: {
                    borderColor: 'white',
                    fontFamily: goudi.style.fontFamily,
                  },
                },
              },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      sx={{
                        color: 'white',
                      }}
                    />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            overflowX: 'auto',
            gap: '1rem',
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'start',
            padding: '25px',
            scrollbarColor: ' #8C54FF transparent',
          }}
        >
          {users.map((user) => (
            <Box
              component="a"
              href={`/users/${user.id}`}
              key={user.username}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'left',
                gap: '1.5rem',
                backgroundColor: '#232323',
                borderRadius: '16px',
                padding: '1rem',
                width: { xs: '90%', md: '25%' },
                height: '100px',
                minWidth: { xs: '200px', md: '400px' },
                position: 'relative',
                textDecoration: 'none',
              }}
            >
              <Image
                src={user.picture}
                style={{
                  width: 'auto',
                  height: '100%',
                  aspectRatio: '1/1',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
                alt={user.username}
                width={100}
                height={100}
              />
              <Typography
                sx={{
                  fontSize: '22px',
                  letterSpacing: '0.1rem',
                  fontWeight: 'bold',
                  color: 'white',
                  fontFamily: goudi.style.fontFamily,
                }}
              >
                {user.username}
              </Typography>
              {!user.isFriend && (
                <IconButton
                  onClick={(event) => {
                    event.stopPropagation();
                    event.preventDefault();
                    handleAddFriend(user.id);
                  }}
                  sx={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '16px',
                    fontFamily: goudi.style.fontFamily,
                    fontSize: '16px',
                    letterSpacing: '0.1rem',
                    position: 'absolute',
                    right: '1rem',
                    zIndex: 1000,
                  }}
                >
                  <PersonAddIcon />
                </IconButton>
              )}
            </Box>
          ))}
        </Box>
      </Box>
      <AnimatedAlert
        open={open}
        message={'Request sent'}
        onClose={() => setOpen(false)}
        severity={ESeverity.SUCCESS}
      />
    </>
  );
}

export default function BooksPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <BooksContent />
    </Suspense>
  );
}
