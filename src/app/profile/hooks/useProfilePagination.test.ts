import { renderHook, act, waitFor } from '@testing-library/react';
import { useProfilePagination } from './useProfilePagination';
import { getBooksWithPagination } from '../../actions/book/fetchApiBook';
import { UUID } from 'crypto';

// Mock the server action
jest.mock('../../actions/book/fetchApiBook', () => ({
  getBooksWithPagination: jest.fn(),
}));

const mockUserId = '550e8400-e29b-41d4-a716-446655440000' as UUID;

describe('useProfilePagination', () => {
  const mockGetBooksWithPagination =
    getBooksWithPagination as jest.MockedFunction<
      typeof getBooksWithPagination
    >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useProfilePagination(undefined));

    expect(result.current.books).toEqual([]);
    expect(result.current.hasMore).toBe(true);
    expect(result.current.loading).toBe(false);
    expect(result.current.page).toBe(0);
  });

  it('should load books when userId is provided', async () => {
    const mockBooks = [
      { id: '1', title: 'Book 1' },
      { id: '2', title: 'Book 2' },
    ];

    mockGetBooksWithPagination.mockResolvedValue({
      books: mockBooks,
      hasMore: false,
    });

    const { result } = renderHook(() => useProfilePagination(mockUserId));

    await waitFor(() => {
      expect(result.current.books).toEqual(mockBooks);
      expect(result.current.hasMore).toBe(false);
      expect(result.current.loading).toBe(false);
    });

    expect(mockGetBooksWithPagination).toHaveBeenCalledWith(mockUserId, 0, 50);
  });

  it('should handle loadMoreBooks correctly', async () => {
    const initialBooks = [{ id: '1', title: 'Book 1' }];
    const newBooks = [{ id: '2', title: 'Book 2' }];

    mockGetBooksWithPagination
      .mockResolvedValueOnce({
        books: initialBooks,
        hasMore: true,
      })
      .mockResolvedValueOnce({
        books: newBooks,
        hasMore: false,
      });

    const { result } = renderHook(() => useProfilePagination(mockUserId));

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.books).toEqual(initialBooks);
    });

    // Load more books
    await act(async () => {
      await result.current.loadMoreBooks();
    });

    await waitFor(() => {
      expect(result.current.books).toEqual([...initialBooks, ...newBooks]);
      expect(result.current.hasMore).toBe(false);
    });
  });
});
