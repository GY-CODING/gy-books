/* eslint-disable @typescript-eslint/no-unused-vars */
import { lora } from '@/utils/fonts/fonts';
import { Box, Tab, Tabs, Badge } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ExploreIcon from '@mui/icons-material/Explore';
import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface TabNavigationProps {
  tab: number;
  friendsCount?: number;
  onTabChange: (tab: number) => void;
}

export function TabNavigation({
  tab,
  friendsCount,
  onTabChange,
}: TabNavigationProps) {
  const router = useRouter();

  const prefetch = useCallback(
    (href: string) => {
      try {
        router.prefetch(href);
      } catch (e) {
        // ignore
      }
    },
    [router]
  );
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        mb: 3,
      }}
    >
      <Tabs
        value={tab}
        onChange={(_, v) => onTabChange(v)}
        textColor="primary"
        indicatorColor="primary"
        variant="standard"
        sx={{
          '& .MuiTabs-indicator': {
            height: '3px',
            borderRadius: '3px 3px 0 0',
            background: 'linear-gradient(135deg, #9333ea 0%, #a855f7 100%)',
          },
          '& .MuiTab-root': {
            color: 'rgba(255, 255, 255, 0.6)',
            fontWeight: 'bold',
            fontFamily: lora.style.fontFamily,
            fontSize: { xs: '16px', md: '18px' },
            textTransform: 'none',
            minWidth: { xs: '120px', md: '160px' },
            padding: '16px 24px',
            transition: 'all 0.3s ease',
            '&:hover': {
              color: 'rgba(255, 255, 255, 0.9)',
              background: 'rgba(147, 51, 234, 0.1)',
            },
          },
          '& .Mui-selected': {
            color: '#FFFFFF !important',
          },
        }}
      >
        <Tab
          icon={<ExploreIcon />}
          iconPosition="start"
          label="Discover"
          onMouseEnter={() => prefetch('/users/community')}
          onFocus={() => prefetch('/users/community')}
          onTouchStart={() => prefetch('/users/community')}
        />
        <Tab
          icon={<PeopleIcon />}
          iconPosition="start"
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              Friends
              {friendsCount !== undefined && (
                <Badge
                  badgeContent={friendsCount}
                  sx={{
                    marginLeft: '4px',
                    '& .MuiBadge-badge': {
                      backgroundColor: 'rgba(147, 51, 234, 0.8)',
                      color: 'white',
                      fontFamily: lora.style.fontFamily,
                      fontSize: '11px',
                      fontWeight: 'bold',
                      minWidth: '20px',
                      height: '20px',
                      borderRadius: '10px',
                    },
                  }}
                />
              )}
            </Box>
          }
          onMouseEnter={() => prefetch('/users/community?tab=1')}
          onFocus={() => prefetch('/users/community?tab=1')}
          onTouchStart={() => prefetch('/users/community?tab=1')}
        />
      </Tabs>
    </Box>
  );
}
