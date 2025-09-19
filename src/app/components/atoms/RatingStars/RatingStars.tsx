'use client';

import React, { useState } from 'react';
import { Box, Skeleton, SxProps } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';

interface RatingStarsProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  isLoading?: boolean;
  sx?: SxProps;
}

const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  onRatingChange,
  size = 'medium',
  disabled = false,
  isLoading,
  sx,
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  // Asegurar que rating siempre sea un número válido
  const validRating = typeof rating === 'number' && !isNaN(rating) ? rating : 0;

  const handleMouseEnter = (value: number, event: React.MouseEvent) => {
    if (!disabled && onRatingChange) {
      const starElement = event.currentTarget as HTMLElement;
      const rect = starElement.getBoundingClientRect();
      const isLeftHalf = event.clientX - rect.left < rect.width / 2;
      setHoverRating(isLeftHalf ? value - 0.5 : value);
    }
  };

  const handleMouseLeave = () => {
    if (!disabled && onRatingChange) {
      setHoverRating(null);
    }
  };

  const handleClick = (value: number, event: React.MouseEvent) => {
    if (!disabled && onRatingChange) {
      const starElement = event.currentTarget as HTMLElement;
      const rect = starElement.getBoundingClientRect();
      const isLeftHalf = event.clientX - rect.left < rect.width / 2;
      const newRating = isLeftHalf ? value - 0.5 : value;
      onRatingChange(newRating);
    }
  };

  const getStarSize = () => {
    switch (size) {
      case 'small':
        return { width: 20, height: 20 };
      case 'large':
        return { width: 32, height: 32 };
      default:
        return { width: 24, height: 24 };
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {[...Array(5)].map((_, index) => (
          <Skeleton
            key={index}
            variant="rounded"
            {...getStarSize()}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
            }}
          />
        ))}
      </Box>
    );
  }

  const displayRating = hoverRating !== null ? hoverRating : validRating;
  const starSize = getStarSize();

  return (
    <Box sx={{ display: 'flex', gap: 0.5, ...sx }}>
      {[1, 2, 3, 4, 5].map((value) => {
        const isHalfStar =
          displayRating >= value - 0.5 && displayRating < value;
        const isFullStar = displayRating >= value;

        return (
          <Box
            key={value}
            onMouseEnter={(e) => handleMouseEnter(value, e)}
            onMouseLeave={handleMouseLeave}
            onClick={(e) => handleClick(value, e)}
            sx={{
              cursor: disabled ? 'default' : 'pointer',
            }}
          >
            {isHalfStar ? (
              <StarHalfIcon
                sx={{
                  ...starSize,
                  color: disabled ? 'grey.400' : 'primary.main',
                }}
              />
            ) : isFullStar ? (
              <StarIcon
                sx={{
                  ...starSize,
                  color: disabled ? 'grey.400' : 'primary.main',
                }}
              />
            ) : (
              <StarBorderIcon
                sx={{
                  ...starSize,
                  color: disabled ? 'grey.400' : 'grey.400',
                }}
              />
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default RatingStars;
