/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from 'react';
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
import { goudi } from '@/utils/fonts/fonts';
import { EStatus } from '@/utils/constants/EStatus';

interface BooksFilterProps {
  statusOptions: { label: string; value: EStatus }[];
  statusFilter: EStatus | null;
  authorOptions: string[];
  seriesOptions: string[];
  authorFilter: string;
  seriesFilter: string;
  ratingFilter: number;
  search: string;
  onStatusChange: (status: EStatus | null) => void;
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
    { label: 'Author', value: 'author' },
    { label: 'Rating', value: 'rating' },
    { label: 'Series', value: 'series' },
    { label: 'Title', value: 'title' },
  ];
  const [orderMenuAnchor, setOrderMenuAnchor] = useState<null | HTMLElement>(
    null
  );

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
          fontFamily: goudi.style.fontFamily,
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
            sx={{ fontFamily: goudi.style.fontFamily }}
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
          sx={{ fontFamily: goudi.style.fontFamily }}
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
          fontFamily: goudi.style.fontFamily,
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
            fontFamily: goudi.style.fontFamily,
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
            <span style={{ fontFamily: goudi.style.fontFamily }}>
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
            fontFamily: goudi.style.fontFamily,
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
