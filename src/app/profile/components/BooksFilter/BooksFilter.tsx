/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { BooksFilterMobileDrawer } from './BooksFilterMobileDrawer';
import FilterListIcon from '@mui/icons-material/FilterList';
import {
  Select,
  MenuItem,
  Box,
  FormControl,
  TextField,
  InputAdornment,
  Button,
  Menu,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { lora } from '@/utils/fonts/fonts';
import { EBookStatus } from '@gycoding/nebula';

interface BooksFilterProps {
  statusOptions: { label: string; value: EBookStatus }[];
  statusFilter: EBookStatus | null;
  authorOptions: string[];
  seriesOptions: string[];
  authorFilter: string;
  seriesFilter: string;
  ratingFilter: number;
  search: string;
  onStatusChange: (status: EBookStatus | null) => void;
  onAuthorChange: (author: string) => void;
  onSeriesChange: (series: string) => void;
  onRatingChange: (rating: number) => void;
  onSearchChange: (search: string) => void;
  orderBy: string;
  orderDirection: 'asc' | 'desc';
  onOrderByChange: (orderBy: string) => void;
  onOrderDirectionChange: (direction: 'asc' | 'desc') => void;
}

export const BooksFilter: React.FC<BooksFilterProps> = ({
  statusOptions,
  statusFilter,
  authorOptions,
  seriesOptions,
  authorFilter,
  seriesFilter,
  ratingFilter,
  search,
  onStatusChange,
  onAuthorChange,
  onSeriesChange,
  onRatingChange,
  onSearchChange,
  orderBy,
  orderDirection,
  onOrderByChange,
  onOrderDirectionChange,
}) => {
  // Opciones de ordenamiento
  const orderOptions = [
    { label: 'Original', value: '' },
    { label: 'Author', value: 'author' },
    { label: 'Rating', value: 'rating' },
    { label: 'Series', value: 'series' },
    { label: 'Title', value: 'title' },
  ];
  const [orderMenuAnchor, setOrderMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  // Mobile Drawer state
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Render helpers
  const renderOrderButton = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', height: 40 }}>
      <Button
        variant="outlined"
        size="small"
        sx={{
          minWidth: 55,
          height: 55,
          borderRadius: '10px',
          px: 0,
          color: '#fff',
          background: 'rgba(45,45,45,0.95)',
          fontFamily: lora.style.fontFamily,
          fontWeight: 500,
          fontSize: 15,
          boxShadow: 'none',
          textTransform: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.5,
        }}
        onClick={(e) => setOrderMenuAnchor(e.currentTarget)}
      >
        <FilterListIcon sx={{ fontSize: 24, color: 'white' }} />
      </Button>
      <Menu
        anchorEl={orderMenuAnchor}
        open={Boolean(orderMenuAnchor)}
        onClose={() => setOrderMenuAnchor(null)}
      >
        {orderOptions.map((opt) => (
          <MenuItem
            key={opt.value}
            selected={orderBy === opt.value}
            onClick={() => {
              onOrderByChange(opt.value);
              setOrderMenuAnchor(null);
            }}
            sx={{ fontFamily: lora.style.fontFamily }}
          >
            {opt.label}
          </MenuItem>
        ))}
        <MenuItem divider />
        <MenuItem
          onClick={() => {
            onOrderDirectionChange(orderDirection === 'asc' ? 'desc' : 'asc');
            setOrderMenuAnchor(null);
          }}
          sx={{ fontFamily: lora.style.fontFamily }}
        >
          {orderDirection === 'asc' ? 'Asc' : 'Desc'}{' '}
          {orderDirection === 'asc' ? (
            <ArrowUpwardIcon fontSize="small" />
          ) : (
            <ArrowDownwardIcon fontSize="small" />
          )}
        </MenuItem>
      </Menu>
    </Box>
  );

  const renderSelect = (
    value: any,
    onChange: (v: any) => void,
    options: any[],
    placeholder: string
  ) => (
    <FormControl sx={{ minWidth: 110, flex: 1 }}>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        displayEmpty
        sx={{
          color: '#fff',
          fontWeight: 500,
          fontSize: 15,
          fontFamily: lora.style.fontFamily,
          background: 'rgba(45,45,45,0.95)',
          borderRadius: '10px',
          boxShadow: 'none',
          minHeight: 40,
          '.MuiOutlinedInput-notchedOutline': { border: 0 },
          '& .MuiSvgIcon-root': { color: '#8C54FF' },
        }}
      >
        <MenuItem
          value=""
          sx={{
            color: '#8C54FF',
            fontWeight: 500,
            fontFamily: lora.style.fontFamily,
          }}
        >
          {placeholder}
        </MenuItem>
        {options.map((opt: any) => (
          <MenuItem
            key={opt.value ?? opt}
            value={opt.value ?? opt}
            sx={{ color: '#fff', fontWeight: 500 }}
          >
            <span style={{ fontFamily: lora.style.fontFamily }}>
              {opt.label ?? opt}
            </span>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  // Rating options
  const ratingOptions = [
    { label: 'All', value: 0 },
    ...[1, 2, 3, 4, 5].map((star) => ({
      label: `${'★'.repeat(star)} ${star}${star < 5 ? '+' : ''}`,
      value: star,
    })),
  ];

  if (isMobile) {
    return (
      <>
        {!drawerOpen && (
          <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1201 }}>
            <Button
              variant="contained"
              color="primary"
              sx={{
                minWidth: 0,
                width: 56,
                height: 56,
                borderRadius: '50%',
                boxShadow: '0 4px 16px rgba(140,84,255,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 0,
              }}
              onClick={() => setDrawerOpen(true)}
            >
              <FilterListIcon sx={{ fontSize: 32, color: '#fff' }} />
            </Button>
          </Box>
        )}
        {/* El botón flotante desaparece cuando el drawer está abierto */}
        <BooksFilterMobileDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          statusOptions={statusOptions}
          statusFilter={statusFilter}
          authorOptions={authorOptions}
          seriesOptions={seriesOptions}
          authorFilter={authorFilter}
          seriesFilter={seriesFilter}
          ratingFilter={ratingFilter}
          search={search}
          onStatusChange={onStatusChange}
          onAuthorChange={onAuthorChange}
          onSeriesChange={onSeriesChange}
          onRatingChange={onRatingChange}
          onSearchChange={onSearchChange}
          orderBy={orderBy}
          orderDirection={orderDirection}
          onOrderByChange={onOrderByChange}
          onOrderDirectionChange={onOrderDirectionChange}
        />
      </>
    );
  }
  // Desktop view (unchanged)
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' },
        justifyContent: 'flex-start',
        gap: { xs: 1, sm: 2, md: 3 },
        px: { xs: 0.5, sm: 1, md: 2 },
        mb: 2,
        borderRadius: '10px',
        minHeight: 48,
        maxWidth: { xs: '100%', md: 1000 },
        mx: 'auto',
      }}
    >
      <TextField
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search books..."
        variant="outlined"
        size="small"
        sx={{
          background: 'rgba(45,45,45,0.95)',
          borderRadius: '10px',
          minWidth: 110,
          flex: 2,
          mb: { xs: 1, sm: 0 },
          input: {
            color: '#fff',
            fontFamily: lora.style.fontFamily,
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'transparent',
              borderRadius: '16px',
            },
            '&:hover fieldset': {
              borderColor: 'white',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#8C54FF',
              borderWidth: 2,
            },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: '#8C54FF' }} />
            </InputAdornment>
          ),
        }}
      />
      {renderSelect(ratingFilter, onRatingChange, ratingOptions, 'Rating')}
      {renderSelect(
        statusFilter ?? '',
        onStatusChange,
        statusOptions,
        'Status'
      )}
      {renderSelect(authorFilter, onAuthorChange, authorOptions, 'Author')}
      {renderSelect(seriesFilter, onSeriesChange, seriesOptions, 'Series')}
      {renderOrderButton()}
    </Box>
  );
};
