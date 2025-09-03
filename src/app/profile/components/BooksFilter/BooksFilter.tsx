import React from 'react';
import { Select, MenuItem, Box, FormControl } from '@mui/material';
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
  onStatusChange: (status: EStatus | null) => void;
  onAuthorChange: (author: string) => void;
  onSeriesChange: (series: string) => void;
  onRatingChange: (rating: number) => void;
}

export const BooksFilter: React.FC<BooksFilterProps> = ({
  statusOptions,
  statusFilter,
  authorOptions,
  seriesOptions,
  authorFilter,
  seriesFilter,
  ratingFilter,
  onStatusChange,
  onAuthorChange,
  onSeriesChange,
  onRatingChange,
}) => {
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
        borderRadius: '12px',
        minHeight: 48,
        maxWidth: { xs: '100%', md: 700 },
        mx: 'auto',
      }}
    >
      <FormControl
        sx={{
          minWidth: 110,
          flex: 1,
          width: { xs: '100%', sm: 'auto' },
          mb: { xs: 1, sm: 0 },
        }}
      >
        <Select
          value={ratingFilter}
          onChange={(e) => onRatingChange(Number(e.target.value))}
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
          {ratingFilter === 0 && (
            <MenuItem
              value={0}
              sx={{
                color: '#8C54FF',
                fontWeight: 500,
                fontFamily: goudi.style.fontFamily,
              }}
            >
              Rating
            </MenuItem>
          )}
          {ratingFilter > 0 && (
            <MenuItem
              value={0}
              sx={{
                color: '#8C54FF',
                fontWeight: 500,
                fontFamily: goudi.style.fontFamily,
              }}
            >
              <span style={{ fontFamily: goudi.style.fontFamily }}>All</span>
            </MenuItem>
          )}
          {[1, 2, 3, 4].map((star) => (
            <MenuItem
              key={star}
              value={star}
              sx={{ color: '#fff', fontWeight: 500 }}
            >
              <span style={{ fontFamily: goudi.style.fontFamily }}>
                {'★'.repeat(star)} {star}+
              </span>
            </MenuItem>
          ))}
          <MenuItem key={5} value={5} sx={{ color: '#fff', fontWeight: 500 }}>
            <span style={{ fontFamily: goudi.style.fontFamily }}>
              {'★'.repeat(5)} 5
            </span>
          </MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ minWidth: 110, flex: 1 }}>
        <Select
          value={statusFilter ?? ''}
          onChange={(e) =>
            onStatusChange(e.target.value ? (e.target.value as EStatus) : null)
          }
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
          {!statusFilter && (
            <MenuItem
              value=""
              sx={{
                color: '#8C54FF',
                fontWeight: 500,
                fontFamily: goudi.style.fontFamily,
              }}
            >
              Status
            </MenuItem>
          )}
          {statusFilter && (
            <MenuItem
              value=""
              sx={{
                color: '#8C54FF',
                fontWeight: 500,
                fontFamily: goudi.style.fontFamily,
              }}
            >
              <span style={{ fontFamily: goudi.style.fontFamily }}>All</span>
            </MenuItem>
          )}
          {statusOptions.map((opt) => (
            <MenuItem
              key={opt.value}
              value={opt.value}
              sx={{ color: '#fff', fontWeight: 500 }}
            >
              <span style={{ fontFamily: goudi.style.fontFamily }}>
                {opt.label}
              </span>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ minWidth: 110, flex: 1 }}>
        <Select
          value={authorFilter}
          onChange={(e) => onAuthorChange(e.target.value)}
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
            Author
          </MenuItem>
          {authorOptions.map((author) => (
            <MenuItem
              key={author}
              value={author}
              sx={{ color: '#fff', fontWeight: 500 }}
            >
              <span style={{ fontFamily: goudi.style.fontFamily }}>
                {author}
              </span>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ minWidth: 110, flex: 1 }}>
        <Select
          value={seriesFilter}
          onChange={(e) => onSeriesChange(e.target.value)}
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
            Series
          </MenuItem>
          {seriesOptions.map((series) => (
            <MenuItem
              key={series}
              value={series}
              sx={{ color: '#fff', fontWeight: 500 }}
            >
              <span style={{ fontFamily: goudi.style.fontFamily }}>
                {series}
              </span>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
