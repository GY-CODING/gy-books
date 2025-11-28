import { lora } from '@/utils/fonts/fonts';
import CheckIcon from '@mui/icons-material/Check';
import { Box, IconButton, TextField } from '@mui/material';
import React from 'react';

interface HallOfFameQuoteInputProps {
  quote?: string; // Optional since we're using controlled component
  editedQuote: string;
  setEditedQuote: (q: string) => void;
  isEditing: boolean;
  setIsEditing: (b: boolean) => void;
  onSave: () => void;
  disabled?: boolean;
}

export const HallOfFameQuoteInput: React.FC<HallOfFameQuoteInputProps> = ({
  quote: _quote, // Renamed to indicate it's not used
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
          <IconButton
            onMouseDown={(e) => {
              e.preventDefault(); // Prevent blur from firing
              onSave();
            }}
            aria-label="Save quote"
          >
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
          fontFamily: lora.style.fontFamily,
          fontStyle: 'italic',
          textAlign: 'center',
        },
      }}
    />
    {/* Botón de guardar solo como endAdornment */}
  </Box>
);
