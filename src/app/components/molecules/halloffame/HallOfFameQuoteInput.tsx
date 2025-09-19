import React from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { goudi } from '@/utils/fonts/fonts';

interface HallOfFameQuoteInputProps {
  quote: string;
  editedQuote: string;
  setEditedQuote: (q: string) => void;
  isEditing: boolean;
  setIsEditing: (b: boolean) => void;
  onSave: () => void;
  disabled?: boolean;
}

export const HallOfFameQuoteInput: React.FC<HallOfFameQuoteInputProps> = ({
  quote,
  editedQuote,
  setEditedQuote,
  isEditing,
  setIsEditing,
  onSave,
  disabled = false,
}) => (
  <Box
    sx={{
      width: '100%',
      maxWidth: '800px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      userSelect: 'text',
      textAlign: 'center',
    }}
  >
    <TextField
      onClick={() => setIsEditing(true)}
      onBlur={() => setIsEditing(false)}
      disabled={disabled}
      defaultValue={quote || ''}
      multiline
      value={editedQuote}
      onChange={(e) => setEditedQuote(e.target.value)}
      placeholder="Write your quote here..."
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          onSave();
        }
      }}
      InputProps={{
        endAdornment: isEditing ? (
          <IconButton onClick={onSave} aria-label="Save quote">
            <CheckIcon sx={{ fontSize: '20px', color: 'white' }} />
          </IconButton>
        ) : null,
      }}
      fullWidth
      sx={{
        backgroundColor: '#232323',
        borderRadius: '12px',
        textAlign: 'center',
        border: '2px solid #FFFFFF30',
        '& .MuiOutlinedInput-root': {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'transparent',
          },
        },
        '& .MuiInputBase-input': {
          color: 'white',
          fontSize: '20px',
          fontFamily: goudi.style.fontFamily,
          fontStyle: 'italic',
          textAlign: 'center',
        },
      }}
    />
    {/* Botón de guardar solo como endAdornment */}
  </Box>
);
