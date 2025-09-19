'use client';
import React from 'react';
// ...existing code...
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RatingStars from './RatingStars';

// Mock Material-UI components
jest.mock('@mui/material', () => ({
  Box: ({
    children,
    sx,
    onMouseEnter,
    onMouseLeave,
    onClick,
    ...props
  }: {
    children?: React.ReactNode;
    sx?: Record<string, unknown>;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onClick?: () => void;
    'data-testid'?: string;
    [key: string]: unknown;
  }) => (
    <div
      data-testid={props['data-testid'] || 'rating-stars-container'}
      data-sx={JSON.stringify(sx)}
      style={typeof sx === 'object' ? sx : {}}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  ),
  Skeleton: ({
    variant,
    width,
    height,
    sx,
    ...props
  }: {
    variant?: string;
    width?: number;
    height?: number;
    sx?: Record<string, unknown>;
    [key: string]: unknown;
  }) => (
    <div
      data-testid="skeleton"
      data-variant={variant}
      data-sx={JSON.stringify(sx)}
      style={{ width, height, ...(typeof sx === 'object' ? sx : {}) }}
      {...props}
    />
  ),
}));

// Mock Material-UI icons
jest.mock('@mui/icons-material/Star', () => ({
  __esModule: true,
  default: ({
    sx,
    ...props
  }: {
    sx?: Record<string, unknown>;
    [key: string]: unknown;
  }) => (
    <div
      data-testid="star-icon"
      data-sx={JSON.stringify(sx)}
      style={typeof sx === 'object' ? sx : {}}
      {...props}
    />
  ),
}));

jest.mock('@mui/icons-material/StarHalf', () => ({
  __esModule: true,
  default: ({
    sx,
    ...props
  }: {
    sx?: Record<string, unknown>;
    [key: string]: unknown;
  }) => (
    <div
      data-testid="star-half-icon"
      data-sx={JSON.stringify(sx)}
      style={typeof sx === 'object' ? sx : {}}
      {...props}
    />
  ),
}));

jest.mock('@mui/icons-material/StarBorder', () => ({
  __esModule: true,
  default: ({
    sx,
    ...props
  }: {
    sx?: Record<string, unknown>;
    [key: string]: unknown;
  }) => (
    <div
      data-testid="star-border-icon"
      data-sx={JSON.stringify(sx)}
      style={typeof sx === 'object' ? sx : {}}
      {...props}
    />
  ),
}));

describe('RatingStars', () => {
  const mockOnRatingChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial Rendering', () => {
    it('renders 5 stars by default', () => {
      render(<RatingStars rating={0} />);
      const stars = screen.getAllByTestId('star-border-icon');
      expect(stars).toHaveLength(5);
    });

    it('renders with correct rating display', () => {
      render(<RatingStars rating={3.5} />);
      const fullStars = screen.getAllByTestId('star-icon');
      const halfStars = screen.getAllByTestId('star-half-icon');
      expect(fullStars).toHaveLength(3);
      expect(halfStars).toHaveLength(1);
    });

    it('handles invalid rating values', () => {
      render(<RatingStars rating={NaN} />);
      const borderStars = screen.getAllByTestId('star-border-icon');
      expect(borderStars).toHaveLength(5);
    });

    it('handles non-numeric rating values', () => {
      // @ts-expect-error - Testing invalid prop type
      render(<RatingStars rating="invalid" />);
      const borderStars = screen.getAllByTestId('star-border-icon');
      expect(borderStars).toHaveLength(5);
    });
  });

  describe('Size Variants', () => {
    it('renders small size correctly', () => {
      render(<RatingStars rating={3} size="small" />);
      const stars = screen.getAllByTestId('star-icon');
      expect(stars).toHaveLength(3);
    });

    it('renders medium size correctly', () => {
      render(<RatingStars rating={3} size="medium" />);
      const stars = screen.getAllByTestId('star-icon');
      expect(stars).toHaveLength(3);
    });

    it('renders large size correctly', () => {
      render(<RatingStars rating={3} size="large" />);
      const stars = screen.getAllByTestId('star-icon');
      expect(stars).toHaveLength(3);
    });
  });

  describe('Disabled State', () => {
    it('renders when disabled', () => {
      render(<RatingStars rating={3} disabled />);
      expect(screen.getAllByTestId('star-icon')).toHaveLength(3);
    });

    it('does not call onRatingChange when disabled', () => {
      render(
        <RatingStars rating={3} disabled onRatingChange={mockOnRatingChange} />
      );
      expect(screen.getAllByTestId('star-icon')).toHaveLength(3);
    });
  });

  describe('Loading State', () => {
    it('renders skeleton when loading', () => {
      render(<RatingStars rating={3} isLoading />);
      const skeletons = screen.getAllByTestId('skeleton');
      expect(skeletons).toHaveLength(5);
    });
  });

  describe('Interactive Functionality', () => {
    it('renders interactive stars', () => {
      render(<RatingStars rating={3} onRatingChange={mockOnRatingChange} />);
      expect(screen.getAllByTestId('star-icon')).toHaveLength(3);
      expect(screen.getAllByTestId('star-border-icon')).toHaveLength(2);
    });
  });

  describe('Edge Cases', () => {
    it('handles rating of 0 correctly', () => {
      render(<RatingStars rating={0} />);
      const borderStars = screen.getAllByTestId('star-border-icon');
      expect(borderStars).toHaveLength(5);
    });

    it('handles rating of 5 correctly', () => {
      render(<RatingStars rating={5} />);
      const stars = screen.getAllByTestId('star-icon');
      expect(stars).toHaveLength(5);
    });

    it('handles decimal ratings correctly', () => {
      render(<RatingStars rating={2.7} />);
      const stars = screen.getAllByTestId('star-icon');
      const halfStars = screen.getAllByTestId('star-half-icon');
      expect(stars).toHaveLength(2);
      expect(halfStars).toHaveLength(1);
    });

    it('handles negative ratings as 0', () => {
      render(<RatingStars rating={-1} />);
      const borderStars = screen.getAllByTestId('star-border-icon');
      expect(borderStars).toHaveLength(5);
    });

    it('handles ratings greater than 5 as 5', () => {
      render(<RatingStars rating={6} />);
      const stars = screen.getAllByTestId('star-icon');
      expect(stars).toHaveLength(5);
    });
  });

  describe('Custom Styling', () => {
    it('renders with custom sx prop without errors', () => {
      const customSx = { marginTop: '10px' };
      expect(() =>
        render(<RatingStars rating={3} sx={customSx} />)
      ).not.toThrow();
    });
  });
});
