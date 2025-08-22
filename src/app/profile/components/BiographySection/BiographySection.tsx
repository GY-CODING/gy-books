import React from 'react';
import { Box, Paper, Typography, TextField } from '@mui/material';
import { CustomButton } from '@/app/components/atoms/customButton';
import { goudi } from '@/utils/fonts/fonts';

interface BiographySectionProps {
  biography: string;
  isEditing: boolean;
  isLoading: boolean;
  onChange: (bio: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const BiographySection: React.FC<BiographySectionProps> = ({
  biography,
  isEditing,
  isLoading,
  onChange,
  onSave,
  onCancel,
}) => (
  <Box sx={{ width: { xs: '100%', sm: 340, md: 400 }, maxWidth: '100%' }}>
    {isEditing ? (
      <TextField
        value={biography}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write your biography here..."
        sx={{
          mb: '8px',
          width: '100%',
          backgroundColor: '#232323',
          borderRadius: '12px',
          border: '2px solid #FFFFFF30',
          fontFamily: goudi.style.fontFamily,
          '& .MuiOutlinedInput-root': {
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderRadius: '12px',
            },
            '&.MuiFormLabel-root': {
              color: 'transparent',
              fontFamily: goudi.style.fontFamily,
            },
          },
          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
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
            fontSize: '18px',
            fontFamily: goudi.style.fontFamily,
          },
        }}
        fullWidth
        multiline
        rows={4}
      />
    ) : (
      <Paper
        elevation={0}
        sx={{
          border: '2px solid #FFFFFF30',
          width: '100%',
          borderRadius: '12px',
          background: 'rgba(35, 35, 35, 0.85)',
          p: 1.5,
          height: '100%',
          mb: 1,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: '#fff',
            fontFamily: goudi.style.fontFamily,
            fontSize: 18,
            minHeight: 32,
            fontStyle: 'italic',
          }}
        >
          {biography || 'Aquí irá la biografía del usuario.'}
        </Typography>
      </Paper>
    )}
    {isEditing && (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 2,
          alignItems: 'start',
          justifyContent: 'start',
          mt: 2,
        }}
      >
        <CustomButton
          isLoading={isLoading}
          sx={{
            letterSpacing: '.05rem',
            minWidth: { xs: 0, md: 'auto' },
            width: { xs: '50%', md: 'auto' },
            fontSize: { xs: 11, md: 15 },
            height: '44px',
            paddingTop: '14px',
            textAlign: 'center',
            fontFamily: goudi.style.fontFamily,
          }}
          onClick={onSave}
          variant="outlined"
        >
          Save
        </CustomButton>
        <CustomButton
          type="CANCEL"
          sx={{
            letterSpacing: '.05rem',
            minWidth: { xs: 0, md: 'auto' },
            width: { xs: '50%', md: 'auto' },
            fontFamily: goudi.style.fontFamily,
            background: 'rgba(255, 0, 0, 0.43)',
            boxShadow: '0 4px 14px rgba(255, 0, 0, 0.4)',
            paddingTop: '14px',
            height: '44px',
            textAlign: 'center',
            fontSize: { xs: 11, md: 15 },
            '&:hover': {
              background: 'rgba(255, 0, 0, 0.65)',
              transform: 'translateY(-2px)',
            },
          }}
          onClick={onCancel}
          variant="outlined"
        >
          Cancel
        </CustomButton>
      </Box>
    )}
  </Box>
);
