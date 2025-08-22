import React from 'react';
import {
  Paper,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  useMediaQuery,
} from '@mui/material';
import { goudi } from '@/utils/fonts/fonts';
import { EStatus } from '@/utils/constants/EStatus';
import { useTheme } from '@mui/material/styles';

interface BooksFilterProps {
  filterValue: string;
  statusOptions: { label: string; value: EStatus }[];
  statusFilter: EStatus | null;
  onChange: (status: EStatus | null) => void;
}

export const BooksFilter: React.FC<BooksFilterProps> = ({
  filterValue,
  statusOptions,
  statusFilter,
  onChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Paper
      elevation={0}
      sx={{
        minWidth: { xs: '100%', md: 220 },
        maxWidth: { xs: '100%', md: 280 },
        p: 3,
        borderRadius: '18px',
        background: 'rgba(35, 35, 35, 0.85)',
        border: '1px solid #FFFFFF30',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      {isMobile ? (
        <Select
          value={filterValue}
          onChange={(e) => {
            const v = e.target.value;
            if (v === 'all') {
              onChange(null);
            } else {
              onChange(v as EStatus);
            }
          }}
          fullWidth
          sx={{
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 16,
            fontFamily: goudi.style.fontFamily,
            background: 'rgba(35, 35, 35, 0.85)',
            borderRadius: '12px',
            '.MuiOutlinedInput-notchedOutline': { borderColor: '#FFFFFF' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#8C54FF',
            },
            '& .MuiSvgIcon-root': { color: '#fff' },
          }}
        >
          <MenuItem value="all" sx={{ color: '#8C54FF', fontWeight: 'bold' }}>
            All
          </MenuItem>
          {statusOptions.map((opt) => (
            <MenuItem
              key={opt.value}
              value={opt.value}
              sx={{ color: '#fff', fontWeight: 'bold' }}
            >
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      ) : (
        <RadioGroup
          value={filterValue}
          onChange={(_, v) => {
            if (v === 'all') {
              onChange(null);
            } else {
              onChange(v as EStatus);
            }
          }}
          sx={{ gap: 1 }}
        >
          <FormControlLabel
            value="all"
            control={
              <Radio
                sx={{ color: '#fff', '&.Mui-checked': { color: '#8C54FF' } }}
              />
            }
            label={
              <span
                style={{
                  color: statusFilter === null ? '#8C54FF' : '#fff',
                  fontWeight: 'bold',
                  fontSize: 18,
                  letterSpacing: '.05rem',
                  fontFamily: goudi.style.fontFamily,
                }}
              >
                All
              </span>
            }
            sx={{
              ml: 0,
              mr: 0,
              mb: 1,
              borderRadius: '12px',
              px: 1.5,
              py: 0.5,
              background:
                statusFilter === null ? 'rgba(140,84,255,0.10)' : 'transparent',
              '&:hover': { background: 'rgba(140,84,255,0.15)' },
            }}
          />
          {statusOptions.map((opt) => (
            <FormControlLabel
              key={opt.value}
              value={opt.value}
              control={
                <Radio
                  sx={{ color: '#fff', '&.Mui-checked': { color: '#8C54FF' } }}
                />
              }
              label={
                <span
                  style={{
                    color: statusFilter === opt.value ? '#8C54FF' : '#fff',
                    fontWeight: 'bold',
                    fontSize: 18,
                    letterSpacing: '.05rem',
                    fontFamily: goudi.style.fontFamily,
                  }}
                >
                  {opt.label}
                </span>
              }
              sx={{
                ml: 0,
                mr: 0,
                borderRadius: '12px',
                pl: 1.5,
                pr: 2.2,
                py: 0.5,
                background:
                  statusFilter === opt.value
                    ? 'rgba(140,84,255,0.10)'
                    : 'transparent',
                '&:hover': { background: 'rgba(140,84,255,0.15)' },
              }}
            />
          ))}
        </RadioGroup>
      )}
    </Paper>
  );
};
