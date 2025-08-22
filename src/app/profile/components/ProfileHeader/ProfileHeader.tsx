/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Box, Typography } from '@mui/material';
import { CustomButton } from '@/app/components/atoms/customButton';
import EditIcon from '@mui/icons-material/Edit';
import LaunchIcon from '@mui/icons-material/Launch';
import { UserImage } from '@/app/components/atoms/UserImage';
import { cinzel, goudi } from '@/utils/fonts/fonts';
import { BiographySection } from '../BiographySection/BiographySection';

interface ProfileHeaderProps {
  user: any;
  friendsCount: number;
  isLoadingFriends: boolean;
  onEditProfile: () => void;
  biography: string;
  isEditingBiography: boolean;
  isLoadingBiography: boolean;
  onBiographyChange: (bio: string) => void;
  onBiographySave: () => void;
  onBiographyCancel: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  friendsCount,
  isLoadingFriends,
  onEditProfile,
  biography,
  isEditingBiography,
  isLoadingBiography,
  onBiographyChange,
  onBiographySave,
  onBiographyCancel,
}) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      gap: { xs: 3, md: 6 },
      minHeight: { xs: 0, md: 200 },
      width: '100%',
    }}
  >
    <UserImage user={user} />
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        gap: 2,
        width: { xs: '100%', md: 'auto' },
        alignItems: { xs: 'center', md: 'flex-start' },
        textAlign: { xs: 'center', md: 'left' },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          id="profile-username"
          variant="h3"
          sx={{
            color: '#fff',
            fontWeight: 'bold',
            fontFamily: goudi.style.fontFamily,
            mb: 0,
            fontSize: { xs: 30, sm: 32, md: 40 },
          }}
        >
          {user.username}
        </Typography>
        {user?.email && (
          <Typography
            variant="body1"
            sx={{
              color: '#ffffff50',
              fontFamily: goudi.style.fontFamily,
              fontSize: { xs: 17, sm: 16, md: 22 },
              mb: 1,
              marginTop: { xs: -1, md: 0 },
              fontStyle: 'italic',
            }}
          >{`(${user?.email})`}</Typography>
        )}
      </Box>
      <Box
        component={'a'}
        href={'/users/friends'}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          marginTop: '-10px',
          textDecoration: 'none',
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: '#FFFFFF',
            fontWeight: 'bold',
            fontSize: { xs: 14, sm: 15, md: 18 },
            fontFamily: cinzel.style.fontFamily,
          }}
        >
          {isLoadingFriends ? '...' : `${friendsCount}`}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#FFFFFF',
            fontWeight: 'bold',
            fontSize: { xs: 14, sm: 15, md: 20 },
            fontFamily: goudi.style.fontFamily,
          }}
        >
          {isLoadingFriends ? '...' : 'friends'}
        </Typography>
      </Box>
      <BiographySection
        biography={biography}
        isEditing={isEditingBiography}
        isLoading={isLoadingBiography}
        onChange={onBiographyChange}
        onSave={onBiographySave}
        onCancel={onBiographyCancel}
      />
    </Box>
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'row', md: 'column' },
        gap: { xs: 2, md: 1 },
        alignItems: { xs: 'center', md: 'flex-end' },
        justifyContent: { xs: 'center', md: 'flex-end' },
        ml: { xs: 0, md: 'auto' },
        mt: { xs: 2, md: 0 },
        width: { xs: '100%', md: 'auto' },
        height: 'auto',
      }}
    >
      <CustomButton
        sx={{
          letterSpacing: '.05rem',
          minWidth: { xs: 0, md: 170 },
          width: { xs: '50%', md: '200px' },
          fontFamily: goudi.style.fontFamily,
          fontSize: { xs: 11, md: 15 },
        }}
        variant="contained"
        endIcon={<LaunchIcon />}
        variantComponent="link"
        href="https://accounts.gycoding.com"
        target="_blank"
      >
        Edit Account
      </CustomButton>
      <CustomButton
        sx={{
          letterSpacing: '.05rem',
          minWidth: { xs: 0, md: 170 },
          width: { xs: '50%', md: '200px' },
          fontFamily: goudi.style.fontFamily,
          fontSize: { xs: 11, md: 15 },
        }}
        onClick={onEditProfile}
        variant="contained"
        endIcon={<EditIcon />}
      >
        Edit Profile
      </CustomButton>
    </Box>
  </Box>
);
