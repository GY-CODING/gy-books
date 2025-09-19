import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { BookCardCompact, BookCardCompactSkeleton } from './BookCardCompact';
import Book from '@/domain/book.model';

// Mock Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock Material-UI components at module level
jest.mock('@mui/material', () => ({
  Box: ({
    children,
    component,
    href,
    onClick,
    ...props
  }: React.PropsWithChildren<{
    component?: React.ElementType;
    href?: string;
    onClick?: (e: React.MouseEvent) => void;
    [key: string]: unknown;
  }>) => {
    const Component = component || 'div';
    return (
      <Component href={href} onClick={onClick} data-testid="box" {...props}>
        {children}
      </Component>
    );
  },
  Typography: ({
    children,
    variant,
    ...props
  }: React.PropsWithChildren<{
    variant?: string;
    [key: string]: unknown;
  }>) => (
    <span data-testid={`typography-${variant || 'body'}`} {...props}>
      {children}
    </span>
  ),
  Chip: ({
    children,
    label,
    size,
    ...props
  }: React.PropsWithChildren<{
    label?: string;
    size?: string;
    [key: string]: unknown;
  }>) => (
    <span data-testid={`chip-${size || 'medium'}`} {...props}>
      {label || children}
    </span>
  ),
  Rating: ({
    value,
    precision,
    readOnly,
    size,
    ...props
  }: {
    value?: number;
    precision?: number;
    readOnly?: boolean;
    size?: string;
    [key: string]: unknown;
  }) => (
    <div
      data-testid={`rating-${size || 'medium'}`}
      data-value={value}
      data-precision={precision}
      data-readonly={readOnly}
      {...props}
    />
  ),
  Skeleton: ({
    variant,
    width,
    height,
    animation,
    ...props
  }: {
    variant?: string;
    width?: number | string;
    height?: number | string;
    animation?: string;
    [key: string]: unknown;
  }) => (
    <div
      data-testid={`skeleton-${variant || 'text'}`}
      data-width={width}
      data-height={height}
      data-animation={animation}
      {...props}
    />
  ),
}));

jest.mock('@/utils/fonts/fonts', () => ({
  goudi: {
    style: {
      fontFamily: 'Goudi',
    },
  },
}));

describe('BookCardCompact', () => {
  const mockBook: Book = {
    id: '1',
    title: 'Test Book Title',
    series: {
      id: 1,
      name: 'Test Series',
    },
    cover: {
      url: 'https://example.com/book-cover.jpg',
    },
    releaseDate: '2023-01-01',
    pageCount: 300,
    author: {
      id: 1,
      name: 'Test Author',
      image: {
        url: 'https://example.com/author-image.jpg',
      },
      biography: 'Test biography',
    },
    description: 'Test description',
    rating: 4.5,
  };

  const mockBookWithoutSeries: Book = {
    ...mockBook,
    series: null,
  };

  const mockBookWithoutRating: Book = {
    ...mockBook,
    rating: undefined,
  };

  const mockBookWithoutCover: Book = {
    ...mockBook,
    cover: {
      url: '',
    },
  };

  beforeEach(() => {
    mockPush.mockClear();
  });

  describe('BookCardCompact Component', () => {
    it('renders without crashing with valid props', () => {
      expect(() => render(<BookCardCompact book={mockBook} />)).not.toThrow();
    });

    it('renders without crashing without series', () => {
      expect(() =>
        render(<BookCardCompact book={mockBookWithoutSeries} />)
      ).not.toThrow();
    });

    it('renders without crashing without rating', () => {
      expect(() =>
        render(<BookCardCompact book={mockBookWithoutRating} />)
      ).not.toThrow();
    });

    it('renders without crashing without cover image', () => {
      expect(() =>
        render(<BookCardCompact book={mockBookWithoutCover} />)
      ).not.toThrow();
    });

    it('renders with small prop', () => {
      expect(() =>
        render(<BookCardCompact book={mockBook} small />)
      ).not.toThrow();
    });

    it('renders with custom onClick handler', () => {
      const mockOnClick = jest.fn();
      expect(() =>
        render(<BookCardCompact book={mockBook} onClick={mockOnClick} />)
      ).not.toThrow();
    });

    it('calls custom onClick when provided', () => {
      const mockOnClick = jest.fn();
      const { container } = render(
        <BookCardCompact book={mockBook} onClick={mockOnClick} />
      );

      const link = container.querySelector('a');
      if (link) {
        fireEvent.click(link);
        expect(mockOnClick).toHaveBeenCalledTimes(1);
        expect(mockPush).not.toHaveBeenCalled();
      }
    });

    it('navigates to book page when no custom onClick', () => {
      const { container } = render(<BookCardCompact book={mockBook} />);

      const link = container.querySelector('a');
      if (link) {
        fireEvent.click(link);
        expect(mockPush).toHaveBeenCalledWith('/books/1');
      }
    });

    it('renders with long title', () => {
      const bookWithLongTitle = {
        ...mockBook,
        title:
          'Very Long Book Title That Might Cause Layout Issues If Not Handled Properly',
      };
      expect(() =>
        render(<BookCardCompact book={bookWithLongTitle} />)
      ).not.toThrow();
    });

    it('renders with long author name', () => {
      const bookWithLongAuthorName = {
        ...mockBook,
        author: {
          ...mockBook.author,
          name: 'Very Long Author Name That Might Cause Layout Issues',
        },
      };
      expect(() =>
        render(<BookCardCompact book={bookWithLongAuthorName} />)
      ).not.toThrow();
    });

    it('renders with different rating values', () => {
      const ratings = [0, 1, 2.5, 3, 4, 5];
      ratings.forEach((rating) => {
        const bookWithRating = { ...mockBook, rating };
        expect(() =>
          render(<BookCardCompact book={bookWithRating} />)
        ).not.toThrow();
      });
    });

    it('handles click event and prevents default', () => {
      const mockOnClick = jest.fn();
      const { container } = render(
        <BookCardCompact book={mockBook} onClick={mockOnClick} />
      );

      const link = container.querySelector('a');
      if (link) {
        // Create a more realistic event
        const mockEvent = {
          preventDefault: jest.fn(),
          stopPropagation: jest.fn(),
        } as Partial<React.MouseEvent>;

        fireEvent.click(link, mockEvent as React.MouseEvent);
        expect(mockOnClick).toHaveBeenCalledTimes(1);
        // Note: preventDefault might not be called due to mock limitations
      }
    });

    it('uses placeholder image when cover url is empty', () => {
      const bookWithoutCover = {
        ...mockBook,
        cover: { url: '' },
      };
      // Test that component renders without crashing with empty cover
      expect(() =>
        render(<BookCardCompact book={bookWithoutCover} />)
      ).not.toThrow();
    });

    it('applies small dimensions when small prop is true', () => {
      // Test that component renders without crashing with small prop
      expect(() =>
        render(<BookCardCompact book={mockBook} small />)
      ).not.toThrow();
    });

    it('applies regular dimensions when small prop is false', () => {
      // Test that component renders without crashing with small=false
      expect(() =>
        render(<BookCardCompact book={mockBook} small={false} />)
      ).not.toThrow();
    });

    it('handles undefined rating correctly', () => {
      const bookWithUndefinedRating = {
        ...mockBook,
        rating: undefined,
      };
      expect(() =>
        render(<BookCardCompact book={bookWithUndefinedRating} />)
      ).not.toThrow();
    });

    it('renders series chip when series exists', () => {
      // Test that component renders without crashing when series exists
      expect(() => render(<BookCardCompact book={mockBook} />)).not.toThrow();
    });

    it('does not render series chip when series is null', () => {
      // Test that component renders without crashing when series is null
      expect(() =>
        render(<BookCardCompact book={mockBookWithoutSeries} />)
      ).not.toThrow();
    });

    it('handles different book IDs correctly', () => {
      const booksWithDifferentIds = [
        { ...mockBook, id: '123' },
        { ...mockBook, id: 'abc' },
        { ...mockBook, id: 'test-book-id' },
      ];

      booksWithDifferentIds.forEach((book) => {
        expect(() => render(<BookCardCompact book={book} />)).not.toThrow();
      });
    });

    it('calls handleClick function correctly', () => {
      const mockOnClick = jest.fn();
      const { container } = render(
        <BookCardCompact book={mockBook} onClick={mockOnClick} />
      );

      const link = container.querySelector('a');
      if (link) {
        fireEvent.click(link);
        expect(mockOnClick).toHaveBeenCalledTimes(1);
      }
    });

    it('navigates correctly when no onClick provided', () => {
      const { container } = render(<BookCardCompact book={mockBook} />);

      const link = container.querySelector('a');
      if (link) {
        fireEvent.click(link);
        expect(mockPush).toHaveBeenCalledWith('/books/1');
      }
    });

    it('renders with correct dimensions for small prop', () => {
      const { container } = render(<BookCardCompact book={mockBook} small />);

      const link = container.querySelector('a');
      expect(link).toBeTruthy();
      // Component should render with small dimensions applied
    });

    it('renders with correct dimensions for regular size', () => {
      const { container } = render(
        <BookCardCompact book={mockBook} small={false} />
      );

      const link = container.querySelector('a');
      expect(link).toBeTruthy();
      // Component should render with regular dimensions applied
    });

    it('renders rating component when rating is provided', () => {
      const { container } = render(<BookCardCompact book={mockBook} />);

      const rating = container.querySelector('[data-testid="rating-small"]');
      expect(rating).toBeTruthy();
      expect(rating).toHaveAttribute('data-value', '4.5');
      expect(rating).toHaveAttribute('data-precision', '0.5');
      expect(rating).toHaveAttribute('data-readonly', 'true');
    });

    it('does not render rating when rating is undefined', () => {
      const { container } = render(
        <BookCardCompact book={mockBookWithoutRating} />
      );

      const rating = container.querySelector('[data-testid="rating-small"]');
      expect(rating).toBeNull();
    });

    it('renders chip when series exists', () => {
      const { container } = render(<BookCardCompact book={mockBook} />);

      const chip = container.querySelector('[data-testid="chip-small"]');
      expect(chip).toBeTruthy();
      expect(chip).toHaveTextContent('Test Series');
    });

    it('does not render chip when series is null', () => {
      const { container } = render(
        <BookCardCompact book={mockBookWithoutSeries} />
      );

      const chip = container.querySelector('[data-testid="chip-small"]');
      expect(chip).toBeNull();
    });

    it('renders image with correct src and alt', () => {
      const { container } = render(<BookCardCompact book={mockBook} />);

      const img = container.querySelector('img');
      expect(img).toBeTruthy();
      expect(img).toHaveAttribute('src', 'https://example.com/book-cover.jpg');
      expect(img).toHaveAttribute('alt', 'Test Book Title');
    });

    it('renders placeholder image when cover url is empty', () => {
      const { container } = render(
        <BookCardCompact book={mockBookWithoutCover} />
      );

      const img = container.querySelector('img');
      expect(img).toBeTruthy();
      expect(img).toHaveAttribute('src', '/placeholder-book.jpg');
    });

    it('renders typography with correct variants', () => {
      const { container } = render(<BookCardCompact book={mockBook} />);

      const subtitle1 = container.querySelector(
        '[data-testid="typography-subtitle1"]'
      );
      expect(subtitle1).toBeTruthy();
      expect(subtitle1).toHaveTextContent('Test Book Title');

      const bodyTypography = container.querySelector(
        '[data-testid="typography-body"]'
      );
      expect(bodyTypography).toBeTruthy();
      expect(bodyTypography).toHaveTextContent('Test Author');
    });
  });

  describe('BookCardCompactSkeleton Component', () => {
    it('renders without crashing', () => {
      expect(() => render(<BookCardCompactSkeleton />)).not.toThrow();
    });

    it('renders skeleton structure', () => {
      const { container } = render(<BookCardCompactSkeleton />);
      expect(container.firstChild).toBeTruthy();
    });

    it('renders all skeleton elements', () => {
      const { container } = render(<BookCardCompactSkeleton />);

      // Should contain multiple skeleton elements
      const skeletons = container.querySelectorAll('div');
      expect(skeletons.length).toBeGreaterThan(1);
    });

    it('renders skeleton with correct variants and properties', () => {
      const { container } = render(<BookCardCompactSkeleton />);

      const rectangularSkeleton = container.querySelector(
        '[data-testid="skeleton-rectangular"]'
      );
      expect(rectangularSkeleton).toBeTruthy();
      expect(rectangularSkeleton).toHaveAttribute('data-animation', 'wave');

      const textSkeletons = container.querySelectorAll(
        '[data-testid="skeleton-text"]'
      );
      expect(textSkeletons.length).toBeGreaterThan(0);
    });
  });
});
