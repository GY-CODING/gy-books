import React from 'react';
import { render } from '@testing-library/react';
import { BookImage } from './BookImage';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: 'Image',
}));

// Mock Material-UI CircularProgress
jest.mock('@mui/material', () => ({
  CircularProgress: 'CircularProgress',
}));

// Mock fetchBookById
jest.mock('@/app/actions/book/fetchBookById', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock constants
jest.mock('@/utils/constants/constants', () => ({
  DEFAULT_COVER_IMAGE: '/default-cover.jpg',
}));

describe('BookImage', () => {
  it('renders without crashing with valid props', () => {
    expect(() => render(<BookImage bookId="1" />)).not.toThrow();
  });

  it('renders without crashing with different bookId', () => {
    expect(() => render(<BookImage bookId="123" />)).not.toThrow();
  });

  it('renders without crashing with empty bookId', () => {
    expect(() => render(<BookImage bookId="" />)).not.toThrow();
  });

  it('renders without crashing with numeric bookId', () => {
    expect(() => render(<BookImage bookId="999" />)).not.toThrow();
  });

  it('renders without crashing with long bookId', () => {
    expect(() =>
      render(<BookImage bookId="very-long-book-id-string" />)
    ).not.toThrow();
  });

  it('renders without crashing with special characters in bookId', () => {
    expect(() => render(<BookImage bookId="book-123_test" />)).not.toThrow();
  });
});
