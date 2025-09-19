import React from 'react';
import { render } from '@testing-library/react';
import { BookCard } from './BookCard';
import Book from '@/domain/book.model';

// Mock Material-UI components at module level
jest.mock('@mui/material', () => ({
  Box: 'div',
  Typography: 'span',
}));

jest.mock('@mui/icons-material', () => ({
  ArrowForwardIcon: 'span',
}));

jest.mock('@/utils/fonts/fonts', () => ({
  goudi: {
    style: {
      fontFamily: 'Goudi',
    },
  },
}));

describe('BookCard', () => {
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
    description: 'This is a test book description with some content.',
  };

  const mockBookWithoutSeries: Book = {
    ...mockBook,
    series: null,
  };

  const mockBookWithoutCover: Book = {
    ...mockBook,
    cover: {
      url: '',
    },
  };

  const mockBookWithoutDescription: Book = {
    ...mockBook,
    description: '',
  };

  it('renders without crashing with valid props', () => {
    expect(() => render(<BookCard book={mockBook} />)).not.toThrow();
  });

  it('renders without crashing without series', () => {
    expect(() =>
      render(<BookCard book={mockBookWithoutSeries} />)
    ).not.toThrow();
  });

  it('renders without crashing without cover image', () => {
    expect(() =>
      render(<BookCard book={mockBookWithoutCover} />)
    ).not.toThrow();
  });

  it('renders without crashing without description', () => {
    expect(() =>
      render(<BookCard book={mockBookWithoutDescription} />)
    ).not.toThrow();
  });

  it('renders with long title', () => {
    const bookWithLongTitle = {
      ...mockBook,
      title:
        'Very Long Book Title That Might Cause Layout Issues If Not Handled Properly In The Component',
    };
    expect(() => render(<BookCard book={bookWithLongTitle} />)).not.toThrow();
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
      render(<BookCard book={bookWithLongAuthorName} />)
    ).not.toThrow();
  });

  it('renders with long description', () => {
    const bookWithLongDescription = {
      ...mockBook,
      description:
        'This is a very long description that contains a lot of text and might cause layout issues if not handled properly by the component. It should still render without crashing and handle the overflow appropriately.',
    };
    expect(() =>
      render(<BookCard book={bookWithLongDescription} />)
    ).not.toThrow();
  });

  it('renders with different book data', () => {
    const differentBook = {
      ...mockBook,
      id: '2',
      title: 'Different Book',
      author: {
        ...mockBook.author,
        id: 2,
        name: 'Different Author',
      },
    };
    expect(() => render(<BookCard book={differentBook} />)).not.toThrow();
  });
});
