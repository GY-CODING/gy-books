import React from 'react';
import { render, screen } from '@testing-library/react';
import { BooksList } from './BooksList';
import Book from '@/domain/book.model';

jest.mock('@/app/components/atoms/BookCardCompact', () => ({
  BookCardCompact: ({ book }: { book: Book }) => (
    <div data-testid="book-card">{book.title}</div>
  ),
}));

const mockBooks: Book[] = [
  { id: '1', title: 'Book One' } as Book,
  { id: '2', title: 'Book Two' } as Book,
];

describe('BooksList', () => {
  it('renders book cards for each book', () => {
    render(<BooksList books={mockBooks} loading={false} hasMore={true} />);
    expect(screen.getAllByTestId('book-card')).toHaveLength(mockBooks.length);
    expect(
      screen.queryByText('Todos los libros cargados')
    ).not.toBeInTheDocument();
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('shows loading spinner when loading is true', () => {
    render(<BooksList books={mockBooks} loading={true} hasMore={true} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows "Todos los libros cargados" when hasMore is false and books exist', () => {
    render(<BooksList books={mockBooks} loading={false} hasMore={false} />);
    expect(screen.getByText('Todos los libros cargados')).toBeInTheDocument();
  });

  it('does not show "Todos los libros cargados" when hasMore is true', () => {
    render(<BooksList books={mockBooks} loading={false} hasMore={true} />);
    expect(
      screen.queryByText('Todos los libros cargados')
    ).not.toBeInTheDocument();
  });

  it('does not show "Todos los libros cargados" when books list is empty', () => {
    render(<BooksList books={[]} loading={false} hasMore={false} />);
    expect(
      screen.queryByText('Todos los libros cargados')
    ).not.toBeInTheDocument();
  });
});
