import type HardcoverBook from '@/domain/HardcoverBook';
import { useBookDisplay } from '@/hooks/useBookDisplay';
import { lora } from '@/utils/fonts/fonts';
import { Box, Tooltip, Typography } from '@mui/material';

interface BookCardProps {
  book: HardcoverBook;
  compact?: boolean;
}

export function BookCard({ book, compact = false }: BookCardProps) {
  const { title, coverUrl } = useBookDisplay(book);
  return (
    <Box
      component="a"
      href={`/books/${book.id}`}
      key={book.id}
      sx={{
        width: '45%',
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'row',
        gap: compact ? { xs: '10px', md: '12px' } : { xs: '12px', md: '16px' },
        padding: compact
          ? { xs: '10px', md: '12px' }
          : { xs: '12px', md: '16px' },
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: compact
          ? { xs: '14px', md: '16px' }
          : { xs: '16px', md: '20px' },
        border: '1px solid rgba(255, 255, 255, 0.06)',
        overflow: 'hidden',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-2px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(255, 255, 255, 0.04)',
        },
      }}
    >
      <Box
        sx={{
          width: compact
            ? { xs: '65px', sm: '75px', md: '95px' }
            : { xs: '85px', sm: '105px', md: '130px' },
          flexShrink: 0,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box
          component="img"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: { xs: '10px', md: '12px' },
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.02)',
            },
          }}
          src={coverUrl}
          alt={title}
        />
      </Box>
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: compact ? { xs: '4px', md: '6px' } : { xs: '6px', md: '8px' },
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box>
          <Tooltip title={title} arrow placement="top">
            <Typography
              sx={{
                color: '#fff',
                fontSize: compact
                  ? { xs: '14px', sm: '15px', md: '17px' }
                  : { xs: '17px', sm: '19px', md: '22px' },
                fontWeight: '700',
                fontFamily: lora.style.fontFamily,
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                lineHeight: 1.2,
                letterSpacing: '0.01em',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              }}
            >
              {title}
            </Typography>
          </Tooltip>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              mt: 0.5,
              flexWrap: 'wrap',
            }}
          >
            <Typography
              sx={{
                color: 'rgba(168, 85, 247, 0.9)',
                fontSize: compact
                  ? { xs: '12px', sm: '13px', md: '14px' }
                  : { xs: '14px', sm: '15px', md: '16px' },
                fontWeight: '500',
                fontFamily: lora.style.fontFamily,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {book.author.name}
            </Typography>
            {book.series && book.series.length > 0 && book.series[0]?.name && (
              <>
                <Box
                  sx={{
                    width: '3px',
                    height: '3px',
                    borderRadius: '50%',
                    background: 'rgba(147, 51, 234, 0.5)',
                    flexShrink: 0,
                  }}
                />
                <Typography
                  sx={{
                    color: 'rgba(147, 51, 234, 0.7)',
                    fontSize: compact
                      ? { xs: '11px', sm: '12px', md: '13px' }
                      : { xs: '13px', sm: '14px', md: '15px' },
                    fontWeight: '400',
                    fontFamily: lora.style.fontFamily,
                    fontStyle: 'italic',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  {book.series[0].name}
                </Typography>
              </>
            )}
          </Box>
        </Box>

        {book.description && !compact && (
          <Typography
            sx={{
              display: { xs: 'none', md: '-webkit-box' },
              color: 'rgba(255, 255, 255, 0.65)',
              fontSize: '13px',
              fontFamily: lora.style.fontFamily,
              fontWeight: '300',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.5,
            }}
            dangerouslySetInnerHTML={{ __html: book.description }}
          />
        )}
      </Box>
    </Box>
  );
}
