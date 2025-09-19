'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Menu,
  Drawer,
  useMediaQuery,
  TextField,
  IconButton,
  Divider,
  Stack,
} from '@mui/material';
import rateBook from '@/app/actions/book/rateBook';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CloseIcon from '@mui/icons-material/Close';
import { EStatus } from '@/utils/constants/EStatus';
import { useTheme } from '@mui/material/styles';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { ApiBook } from '@/domain/apiBook.model';
import { goudi } from '@/utils/fonts/fonts';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRemoveBook } from '@/hooks/useRemoveBook';
import { useUser } from '@/hooks/useUser';
import BookIcon from '@mui/icons-material/Book';
import PercentIcon from '@mui/icons-material/Percent';
import { formatPercent, formatProgress } from '@/domain/userData.model';
import RatingStars from '../RatingStars/RatingStars';

interface BookRatingProps {
  bookId: string;
  apiBook: ApiBook | null;
  isRatingLoading: boolean;
  mutate?: (
    data?: ApiBook | null,
    options?: { revalidate?: boolean }
  ) => Promise<ApiBook | null | undefined>;
  isLoggedIn: boolean;
}

const statusOptions = [
  {
    label: 'Want to read',
    value: EStatus.WANT_TO_READ,
    icon: <BookmarkIcon />,
  },
  {
    label: 'Reading',
    value: EStatus.READING,
    icon: <RemoveRedEyeIcon />,
  },
  { label: 'Read', value: EStatus.READ, icon: <CheckCircleIcon /> },
];

export const BookRating = ({
  bookId,
  apiBook,
  isRatingLoading,
  mutate,
  isLoggedIn,
}: BookRatingProps) => {
  const { data: user, isLoading: isUserLoading } = useUser();
  const { handleDeleteBook, isLoading: isDeleteLoading } = useRemoveBook();
  // Estado temporal único para todos los campos
  const [tempRating, setTempRating] = useState<number>(0);
  const [tempStatus, setTempStatus] = useState<EStatus>(EStatus.WANT_TO_READ);
  const [tempStartDate, setTempStartDate] = useState<string>('');
  const [tempEndDate, setTempEndDate] = useState<string>('');
  const [tempProgress, setTempProgress] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isProgressPercent, setIsProgressPercent] = useState(true);

  // Sincronizar estado temporal con apiBook
  useEffect(() => {
    if (apiBook && apiBook.userData) {
      setTempRating(apiBook.userData.rating || 0);
      setTempStatus(apiBook.userData.status ?? EStatus.WANT_TO_READ);
      setTempStartDate(apiBook.userData.startDate || '');
      setTempEndDate(apiBook.userData.endDate || '');
      setTempProgress(
        formatProgress(apiBook.userData.progress || 0) as unknown as number
      );
      setIsProgressPercent(
        apiBook.userData.progress !== undefined &&
          apiBook.userData.progress <= 1
      );
    } else {
      setTempRating(0);
      setTempStatus(EStatus.RATE); // Usar RATE para indicar que no está guardado
      setTempStartDate('');
      setTempEndDate('');
    }

    if (apiBook?.userData?.status === EStatus.READ) {
      apiBook.userData.progress = 1;
      setIsProgressPercent(true);
    }
  }, [apiBook]);

  const handleApply = async () => {
    if (!user || isSubmitting) return;
    setIsSubmitting(true);
    try {
      // Validar progreso
      let progressValue = tempProgress as unknown as number;
      if (isProgressPercent) {
        progressValue = formatPercent(progressValue);
      }

      const formData = new FormData();
      formData.append('bookId', bookId);
      formData.append('rating', tempRating.toString());
      formData.append('startDate', tempStartDate);
      formData.append('endDate', tempEndDate);
      formData.append('progress', progressValue as unknown as string);

      // Si el libro no está guardado, usar WANT_TO_READ como estado inicial
      const statusToSave = tempStatus;
      formData.append('status', statusToSave.toString());
      const updatedApiBook = await rateBook(
        formData,
        user.username,
        apiBook?.userData
      );

      // Actualizar los temporales con la respuesta
      if (updatedApiBook && updatedApiBook.userData) {
        setTempRating(updatedApiBook.userData.rating || 0);
        setTempStatus(updatedApiBook.userData.status ?? EStatus.WANT_TO_READ);
        setTempStartDate(updatedApiBook.userData.startDate || '');
        setTempEndDate(updatedApiBook.userData.endDate || '');
        setTempProgress(
          formatProgress(
            updatedApiBook.userData.progress || 0
          ) as unknown as number
        );
      }

      // Mutate para actualizar la UI inmediatamente
      if (mutate) {
        await mutate(updatedApiBook, { revalidate: false });
      }

      setAnchorEl(null);
      setDrawerOpen(false);
    } catch (error) {
      console.error('Error applying changes:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isUserLoading || isRatingLoading;

  // Determinar si el libro está realmente guardado en la base de datos
  const isBookSaved =
    apiBook && apiBook.userData && apiBook.userData.status !== EStatus.RATE;

  // Obtener el status a mostrar (si no está guardado, mostrar WANT_TO_READ pero con estilo diferente)
  const displayStatus = tempStatus;
  const displayStatusOption = statusOptions.find(
    (opt) => opt.value === displayStatus
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        alignItems: { xs: 'center', sm: 'flex-start' },
        width: 'auto',
        mt: 2,
      }}
    >
      <Box sx={{ mb: 1 }}>
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          startIcon={<BookmarkIcon />}
          endIcon={<ArrowDropDownIcon />}
          disabled={!isLoggedIn}
          onClick={(e) => {
            if (isMobile) setDrawerOpen(true);
            else setAnchorEl(e.currentTarget);
          }}
          sx={{
            justifyContent: 'space-between',
            color: isBookSaved ? '#fff' : '#ccc',
            borderColor: isBookSaved ? '#8C54FF' : '#8C54FF40',
            fontWeight: 'bold',
            fontSize: 20,
            fontFamily: goudi.style.fontFamily,
            letterSpacing: '.05rem',
            borderRadius: '12px',
            background: isBookSaved ? '#8C54FF' : 'rgba(140,84,255,0.05)',
            px: 2,
            py: 1,
            textTransform: 'none',
            opacity: !user ? 0.5 : 1,
            '&:hover': {
              borderColor: isBookSaved ? '#c4b5fd' : '#8C54FF',
              background: isBookSaved ? '#8C54FF' : 'rgba(140,84,255,0.15)',
              color: '#fff',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(140,84,255,0.3)',
            },
            '&:disabled': {
              borderColor: '#666',
              color: '#666',
              background: 'rgba(102,102,102,0.1)',
            },
          }}
        >
          {displayStatusOption?.label || 'Want to read'}
        </Button>
        {/* Mensaje solo si NO hay usuario y NO está cargando */}
        {!user && !isUserLoading && (
          <Typography variant="caption" sx={{ color: '#666' }}>
            Sign in to rate this book
          </Typography>
        )}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl) && !isMobile}
          onClose={() => setAnchorEl(null)}
          PaperProps={{
            sx: {
              borderRadius: 4,
              minWidth: 340,
              p: 3,
              background: '#232323',
              boxShadow: '0 8px 32px rgba(140,84,255,0.15)',
            },
          }}
        >
          <Stack spacing={2} alignItems="stretch" position="relative">
            {isBookSaved && (
              <IconButton
                loading={isDeleteLoading}
                sx={{
                  position: 'absolute',
                  top: 10,
                  padding: '10px',
                  background: 'rgba(255, 83, 83, 0.1)',
                  borderRadius: '16px',
                  right: 0,
                }}
                onClick={() =>
                  handleDeleteBook(
                    bookId,
                    mutate
                      ? (data, options) =>
                          mutate({ ...apiBook, userData: undefined }, options)
                      : undefined
                  )
                }
              >
                <DeleteIcon
                  sx={{
                    color: '#ff5353',
                  }}
                />
              </IconButton>
            )}
            <Box>
              <Typography
                sx={{
                  color: '#fff',
                  fontWeight: 'bold',
                  mb: 0.5,
                  fontSize: 20,
                  fontFamily: goudi.style.fontFamily,
                  letterSpacing: '.05rem',
                }}
              >
                Rating
              </Typography>
              <RatingStars
                rating={tempRating}
                onRatingChange={setTempRating}
                disabled={!user || isSubmitting}
                isLoading={isLoading}
              />
            </Box>
            <Divider sx={{ borderColor: '#8C54FF30' }} />
            <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
              <Typography
                sx={{
                  color: '#fff',
                  fontWeight: 'bold',
                  mb: 1,
                  fontSize: 20,
                  fontFamily: goudi.style.fontFamily,
                  letterSpacing: '.05rem',
                }}
              >
                Status
              </Typography>
              <Stack
                direction="row"
                flexWrap="wrap"
                spacing={2}
                justifyContent="center"
              >
                {statusOptions.map((opt) => (
                  <Button
                    key={opt.value}
                    variant={
                      tempStatus === opt.value ? 'contained' : 'outlined'
                    }
                    startIcon={React.cloneElement(opt.icon, {
                      sx: { color: tempStatus === opt.value ? '#fff' : '#fff' },
                    })}
                    onClick={() => setTempStatus(opt.value)}
                    sx={{
                      borderRadius: 3,
                      fontWeight: 'bold',
                      color: tempStatus === opt.value ? '#fff' : 'white',
                      background:
                        tempStatus === opt.value ? '#8C54FF' : 'transparent',
                      borderColor: '#8C54FF',
                      px: 2,
                      py: 1,
                      minWidth: 0,
                      textTransform: 'none',
                      fontSize: 18,
                      fontFamily: goudi.style.fontFamily,
                      letterSpacing: '.05rem',
                      '&:hover': {
                        background: '#8C54FF',
                        color: '#fff',
                      },
                    }}
                  >
                    {opt.label}
                  </Button>
                ))}
              </Stack>
              <Box
                sx={{
                  position: 'relative',
                  display: 'flex',
                  gap: 2,
                  alignItems: 'center',
                }}
              >
                <TextField
                  sx={{ width: '100px' }}
                  value={tempProgress}
                  label="Progress"
                  type="text"
                  onChange={(e) =>
                    setTempProgress(e.target.value as unknown as number)
                  }
                />
                <Typography
                  sx={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: '#fff',
                    fontFamily: goudi.style.fontFamily,
                    letterSpacing: '.05rem',
                  }}
                >
                  {isProgressPercent ? '%' : 'pages.'}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    position: 'absolute',
                    right: 0,
                  }}
                >
                  <Button
                    variant={isProgressPercent ? 'contained' : 'outlined'}
                    onClick={() => setIsProgressPercent(true)}
                    sx={{
                      borderRadius: 3,
                      fontWeight: 'bold',
                      color: isProgressPercent ? '#fff' : 'white',
                      background: isProgressPercent ? '#8C54FF' : 'transparent',
                      borderColor: '#8C54FF',
                      px: 2,
                      py: 1,
                      minWidth: 0,
                      textTransform: 'none',
                      fontSize: 18,
                      fontFamily: goudi.style.fontFamily,
                      letterSpacing: '.05rem',
                      '&:hover': {
                        background: '#8C54FF',
                        color: '#fff',
                      },
                    }}
                  >
                    <PercentIcon />
                  </Button>
                  <Button
                    variant={!isProgressPercent ? 'contained' : 'outlined'}
                    onClick={() => setIsProgressPercent(false)}
                    sx={{
                      borderRadius: 3,
                      fontWeight: 'bold',
                      color: !isProgressPercent ? '#fff' : 'white',
                      background: !isProgressPercent
                        ? '#8C54FF'
                        : 'transparent',
                      borderColor: '#8C54FF',
                      px: 2,
                      py: 1,
                      minWidth: 0,
                      textTransform: 'none',
                      fontSize: 18,
                      fontFamily: goudi.style.fontFamily,
                      letterSpacing: '.05rem',
                      '&:hover': {
                        background: '#8C54FF',
                        color: '#fff',
                      },
                    }}
                  >
                    <BookIcon />
                  </Button>
                </Box>
              </Box>
            </Box>
            <Divider sx={{ borderColor: '#8C54FF30' }} />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Start date"
                type="date"
                value={tempStartDate || ''}
                onChange={(e) => setTempStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  flex: 1,
                  background: '#232323',
                  borderRadius: 2,
                  input: { color: '#fff' },
                  '& .MuiSvgIcon-root': {
                    color: '#bdbdbd',
                  },
                  '& fieldset': {
                    borderColor: '#bdbdbd',
                  },
                  '& label': {
                    color: '#bdbdbd',
                  },
                  '& label.Mui-focused': {
                    color: '#8C54FF',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#bdbdbd',
                    },
                    '&:hover fieldset': {
                      borderColor: '#8C54FF',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#8C54FF',
                    },
                  },
                }}
              />
              <TextField
                label="End date"
                type="date"
                value={tempEndDate || ''}
                onChange={(e) => setTempEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  flex: 1,
                  background: '#232323',
                  borderRadius: 2,
                  input: { color: '#fff' },
                  '& .MuiSvgIcon-root': {
                    color: '#bdbdbd',
                  },
                  '& fieldset': {
                    borderColor: '#bdbdbd',
                  },
                  '& label': {
                    color: '#bdbdbd',
                  },
                  '& label.Mui-focused': {
                    color: '#8C54FF',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#bdbdbd',
                    },
                    '&:hover fieldset': {
                      borderColor: '#8C54FF',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#8C54FF',
                    },
                  },
                }}
              />
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleApply}
              disabled={isSubmitting}
              sx={{
                borderRadius: 3,
                fontWeight: 'bold',
                fontSize: 18,
                fontFamily: goudi.style.fontFamily,
                letterSpacing: '.05rem',
                mt: 20,
                textTransform: 'none',
              }}
            >
              Apply
            </Button>
          </Stack>
        </Menu>
        <Drawer
          anchor="bottom"
          open={drawerOpen && isMobile}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{
            sx: {
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              pb: 2,
              background: '#232323',
              minHeight: 380,
            },
          }}
        >
          <Box sx={{ p: 3, position: 'relative' }}>
            <IconButton
              onClick={() => setDrawerOpen(false)}
              sx={{ position: 'absolute', top: 8, right: 8, color: '#fff' }}
            >
              <CloseIcon />
            </IconButton>
            <Stack spacing={2} alignItems="stretch" sx={{ mt: 2 }}>
              <Box>
                <Typography sx={{ color: '#fff', fontWeight: 'bold', mb: 0.5 }}>
                  Calificación
                </Typography>
                <RatingStars
                  rating={tempRating}
                  onRatingChange={setTempRating}
                  disabled={!user || isSubmitting}
                  isLoading={isLoading}
                />
                {isBookSaved && (
                  <IconButton
                    loading={isDeleteLoading}
                    sx={{
                      position: 'absolute',
                      top: 55,
                      padding: '10px',
                      background: 'rgba(255, 83, 83, 0.1)',
                      borderRadius: '16px',
                      right: 10,
                    }}
                    onClick={() =>
                      handleDeleteBook(
                        bookId,
                        mutate
                          ? (data, options) =>
                              mutate(
                                { ...apiBook, userData: undefined },
                                options
                              )
                          : undefined
                      )
                    }
                  >
                    <DeleteIcon
                      sx={{
                        color: '#ff5353',
                      }}
                    />
                  </IconButton>
                )}
              </Box>
              <Divider sx={{ borderColor: '#8C54FF30' }} />
              <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                <Typography sx={{ color: '#fff', fontWeight: 'bold', mb: 0.5 }}>
                  Estado
                </Typography>
                <Stack direction="row" spacing={2} justifyContent="center">
                  {statusOptions.map((opt) => (
                    <Button
                      key={opt.value}
                      variant={
                        tempStatus === opt.value ? 'contained' : 'outlined'
                      }
                      startIcon={React.cloneElement(opt.icon, {
                        sx: {
                          color: tempStatus === opt.value ? '#fff' : '#fff',
                        },
                      })}
                      onClick={() => setTempStatus(opt.value)}
                      sx={{
                        borderRadius: 3,
                        fontWeight: 'bold',
                        color: tempStatus === opt.value ? '#fff' : 'white',
                        background:
                          tempStatus === opt.value ? '#8C54FF' : 'transparent',
                        borderColor: '#8C54FF',
                        px: 2,
                        py: 1,
                        minWidth: 0,
                        textTransform: 'none',
                        fontSize: 16,
                        '&:hover': {
                          background: '#8C54FF',
                          color: '#fff',
                        },
                      }}
                    >
                      {opt.label}
                    </Button>
                  ))}
                </Stack>
                <Box
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    gap: 2,
                    alignItems: 'center',
                  }}
                >
                  <TextField
                    sx={{ width: '100px' }}
                    value={tempProgress}
                    label="Progress"
                    type="text"
                    onChange={(e) =>
                      setTempProgress(e.target.value as unknown as number)
                    }
                  />
                  <Typography
                    sx={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: '#fff',
                      fontFamily: goudi.style.fontFamily,
                      letterSpacing: '.05rem',
                    }}
                  >
                    {isProgressPercent ? '%' : 'pages.'}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1,
                      position: 'absolute',
                      right: 0,
                    }}
                  >
                    <Button
                      variant={isProgressPercent ? 'contained' : 'outlined'}
                      onClick={() => setIsProgressPercent(true)}
                      sx={{
                        borderRadius: 3,
                        fontWeight: 'bold',
                        color: isProgressPercent ? '#fff' : 'white',
                        background: isProgressPercent
                          ? '#8C54FF'
                          : 'transparent',
                        borderColor: '#8C54FF',
                        px: 2,
                        py: 1,
                        minWidth: 0,
                        textTransform: 'none',
                        fontSize: 18,
                        fontFamily: goudi.style.fontFamily,
                        letterSpacing: '.05rem',
                        '&:hover': {
                          background: '#8C54FF',
                          color: '#fff',
                        },
                      }}
                    >
                      <PercentIcon />
                    </Button>
                    <Button
                      variant={!isProgressPercent ? 'contained' : 'outlined'}
                      onClick={() => setIsProgressPercent(false)}
                      sx={{
                        borderRadius: 3,
                        fontWeight: 'bold',
                        color: !isProgressPercent ? '#fff' : 'white',
                        background: !isProgressPercent
                          ? '#8C54FF'
                          : 'transparent',
                        borderColor: '#8C54FF',
                        px: 2,
                        py: 1,
                        minWidth: 0,
                        textTransform: 'none',
                        fontSize: 18,
                        fontFamily: goudi.style.fontFamily,
                        letterSpacing: '.05rem',
                        '&:hover': {
                          background: '#8C54FF',
                          color: '#fff',
                        },
                      }}
                    >
                      <BookIcon />
                    </Button>
                  </Box>
                </Box>
              </Box>
              <Divider sx={{ borderColor: '#8C54FF30' }} />
              <Box sx={{ display: 'flex', gap: 2, mb: '10px' }}>
                <TextField
                  label="Fecha inicio"
                  type="date"
                  value={tempStartDate || ''}
                  onChange={(e) => setTempStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    flex: 1,
                    background: '#232323',
                    borderRadius: 2,
                    input: { color: '#fff' },
                    '& .MuiSvgIcon-root': {
                      color: '#bdbdbd',
                    },
                    '& fieldset': {
                      borderColor: '#bdbdbd',
                    },
                    '& label': {
                      color: '#bdbdbd',
                    },
                    '& label.Mui-focused': {
                      color: '#8C54FF',
                    },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#bdbdbd',
                      },
                      '&:hover fieldset': {
                        borderColor: '#8C54FF',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#8C54FF',
                      },
                    },
                  }}
                />
                <TextField
                  label="Fecha fin"
                  type="date"
                  value={tempEndDate || ''}
                  onChange={(e) => setTempEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    flex: 1,
                    background: '#232323',
                    borderRadius: 2,
                    input: { color: '#fff' },
                    '& .MuiSvgIcon-root': {
                      color: '#bdbdbd',
                    },
                    '& fieldset': {
                      borderColor: '#bdbdbd',
                    },
                    '& label': {
                      color: '#bdbdbd',
                    },
                    '& label.Mui-focused': {
                      color: '#8C54FF',
                    },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#bdbdbd',
                      },
                      '&:hover fieldset': {
                        borderColor: '#8C54FF',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#8C54FF',
                      },
                    },
                  }}
                />
              </Box>
              <Button
                variant="contained"
                color="primary"
                onClick={handleApply}
                disabled={isSubmitting}
                sx={{
                  borderRadius: 3,
                  fontWeight: 'bold',
                  fontSize: 18,
                  mt: 20,
                  textTransform: 'none',
                }}
              >
                Aplicar
              </Button>
            </Stack>
          </Box>
        </Drawer>
      </Box>
    </Box>
  );
};
