/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BooksList } from './BooksList';
import { EBookStatus } from '@gycoding/nebula';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));

// Mock Material-UI components that might be used
jest.mock('@mui/material', () => ({
  Box: ({
    children,
    ...props
  }: React.PropsWithChildren<Record<string, unknown>>) => (
    <div {...props}>{children}</div>
  ),
  Typography: ({
    children,
    ...props
  }: React.PropsWithChildren<Record<string, unknown>>) => (
    <div {...props}>{children}</div>
  ),
  Chip: ({
    children,
    ...props
  }: React.PropsWithChildren<Record<string, unknown>>) => (
    <div {...props}>{children}</div>
  ),
  Rating: (props: Record<string, unknown>) => <div {...props} />,
  Skeleton: (props: Record<string, unknown>) => <div {...props} />,
}));

// Mock the BookCardCompact component
jest.mock('@/app/components/atoms/BookCardCompact/BookCardCompact', () => ({
  BookCardCompact: ({ book }: { book: Record<string, unknown> }) => (
    <div data-testid="book-card">{book.title as string}</div>
  ),
}));

const mockBooks: Book[] = [
  {
    id: '1',
    title: 'Book One',
    series: null,
    cover: { url: '/book1.jpg' },
    releaseDate: '2023-01-01',
    pageCount: 200,
    author: {
      id: 1,
      name: 'Author One',
      image: { url: '/author1.jpg' },
      biography: 'Biography',
    },
    description: 'Description',
    rating: 4.5,
  status: EBookStatus.READ,
  } as Book,
  {
    id: '2',
    title: 'Book Two',
    series: null,
    cover: { url: '/book2.jpg' },
    releaseDate: '2023-02-01',
    pageCount: 250,
    author: {
      id: 2,
      name: 'Author Two',
      image: { url: '/author2.jpg' },
      biography: 'Biography',
    },
    description: 'Description',
    rating: 3.5,
  status: EBookStatus.READING,
  } as Book,
];

describe('BooksList', () => {
  it('renders book cards for each book', () => {
    render(<BooksList books={mockBooks} hasMore={true} />);
    expect(screen.getAllByTestId('book-card')).toHaveLength(mockBooks.length);
    expect(screen.queryByText('All books loaded')).not.toBeInTheDocument();
  });

  it('shows "All books loaded" when hasMore is false and books exist', () => {
    render(<BooksList books={mockBooks} hasMore={false} />);
    expect(screen.getByText('All books loaded')).toBeInTheDocument();
  });

  it('does not show "All books loaded" when hasMore is true', () => {
    render(<BooksList books={mockBooks} hasMore={true} />);
    expect(screen.queryByText('All books loaded')).not.toBeInTheDocument();
  });

  it('does not show "All books loaded" when books list is empty', () => {
    render(<BooksList books={[]} hasMore={false} />);
    expect(screen.queryByText('All books loaded')).not.toBeInTheDocument();
  });
});
