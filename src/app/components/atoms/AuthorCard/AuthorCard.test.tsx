import React from 'react';
import { render } from '@testing-library/react';
import AuthorCard from './AuthorCard';
import { Author } from '@/domain/book.model';

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

describe('AuthorCard', () => {
  const mockAuthor: Author = {
    id: 1,
    name: 'Test Author',
    biography: 'This is a test biography for the author.',
    image: {
      url: 'https://example.com/author-image.jpg',
    },
  };

  it('renders without crashing with valid props', () => {
    expect(() => render(<AuthorCard author={mockAuthor} />)).not.toThrow();
  });

  it('renders with author without image', () => {
    const authorWithoutImage = {
      ...mockAuthor,
      image: { url: '' },
    };
    expect(() =>
      render(<AuthorCard author={authorWithoutImage} />)
    ).not.toThrow();
  });

  it('renders with empty biography', () => {
    const authorWithEmptyBio = {
      ...mockAuthor,
      biography: '',
    };
    expect(() =>
      render(<AuthorCard author={authorWithEmptyBio} />)
    ).not.toThrow();
  });

  it('renders with long author name', () => {
    const authorWithLongName = {
      ...mockAuthor,
      name: 'Very Long Author Name That Might Cause Layout Issues',
    };
    expect(() =>
      render(<AuthorCard author={authorWithLongName} />)
    ).not.toThrow();
  });

  it('renders with different author data', () => {
    const differentAuthor = {
      id: 2,
      name: 'Different Author',
      biography: 'Different biography content.',
      image: {
        url: 'https://example.com/different-image.jpg',
      },
    };
    expect(() => render(<AuthorCard author={differentAuthor} />)).not.toThrow();
  });
});
