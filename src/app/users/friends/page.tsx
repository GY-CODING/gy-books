'use client';
import React, { useState, useMemo } from 'react';
import { Friend } from '@/domain/friend.model';
import FriendCard from '@/app/components/atoms/FriendCard';
import FriendCardSkeleton from '@/app/components/atoms/FriendCardSkeleton';
import { useFriends } from '@/hooks/useFriends';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { birthStone, goudi } from '@/utils/fonts/fonts';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useRouter } from 'next/navigation';
import AnimatedAlert from '@/app/components/atoms/Alert';
import { ESeverity } from '@/utils/constants/ESeverity';
import CustomTitle from '@/app/components/atoms/CustomTitle';

export default function FriendsPage() {
  const {
    data,
    isLoading,
    handleDeleteFriend,
    isLoadingDelete,
    setErrorDelete,
    errorDelete,
    isSuccessDelete,
    setIsSuccessDelete,
  } = useFriends();
  const [search, setSearch] = useState('');
  const router = useRouter();
  // Filtra amigos por nombre de usuario (case-insensitive)
  const filteredFriends = useMemo(() => {
    if (!data) return [];
    return data.filter((friend) =>
      friend.username.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

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
          text="Friends"
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
            gap: '1rem',
          }}
        >
          <TextField
            placeholder="Search for a friend..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
          <IconButton
            onClick={() => {
              router.push('/users/search');
            }}
            sx={{
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              marginTop: '-5px',
              '&:hover': {
                backgroundColor: '#232323',
              },
            }}
          >
            <PersonAddIcon sx={{ fontSize: '32px', color: 'white' }} />
          </IconButton>
        </Box>

        {isLoading || !data ? (
          Array.from({ length: 3 }).map((_, i) => (
            <FriendCardSkeleton key={i} />
          ))
        ) : filteredFriends.length === 0 ? (
          <Typography
            sx={{
              fontFamily: goudi.style.fontFamily,
              color: 'white',
              fontSize: '1.5rem',
              mt: 2,
            }}
          >
            No friends found.
          </Typography>
        ) : (
          filteredFriends.map((friend: Friend) => (
            <FriendCard
              key={friend.id}
              friend={friend as Friend}
              isDeleteLoading={isLoadingDelete}
              handleDeleteFriend={handleDeleteFriend}
            />
          ))
        )}
        <AnimatedAlert
          open={isSuccessDelete}
          onClose={() => setIsSuccessDelete(false)}
          severity={ESeverity.SUCCESS}
          message="Friend deleted successfully."
        />
        <AnimatedAlert
          open={!!errorDelete}
          onClose={() => setErrorDelete(null)}
          severity={ESeverity.ERROR}
          message="Error deleting friend."
        />
      </Box>
    </>
  );
}
