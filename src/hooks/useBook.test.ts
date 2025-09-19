import { renderHook, waitFor } from '@testing-library/react';
import { useBook } from './useBook';

// Mock SWR
jest.mock('swr');

// Mock the fetchBookById function
jest.mock('@/app/actions/book/fetchBookById');

import useSWR from 'swr';
import Book from '@/domain/book.model';
import { EStatus } from '@/utils/constants/EStatus';

const mockUseSWR = useSWR as jest.MockedFunction<typeof useSWR>;

describe('useBook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial state', () => {
    const mockBook: Book = {
      id: '1',
      title: 'Test Book',
      series: null,
      cover: { url: 'test.jpg' },
      releaseDate: '2023-01-01',
      pageCount: 200,
      author: {
        id: 1,
        name: 'Test Author',
        image: { url: 'author.jpg' },
        biography: 'Test biography',
      },
      description: 'Test Description',
      rating: 4.5,
      status: EStatus.READ,
    };

    mockUseSWR.mockReturnValue({
      data: mockBook,
      isLoading: false,
      error: null,
      mutate: jest.fn(),
      isValidating: false,
    });

    const { result } = renderHook(() => useBook('1'));

    expect(result.current.data).toEqual(mockBook);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should handle loading state', () => {
    mockUseSWR.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      mutate: jest.fn(),
      isValidating: false,
    });

    const { result } = renderHook(() => useBook('1'));

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(null);
  });

  it('should handle error state', () => {
    const mockError = new Error('Failed to fetch book');

    mockUseSWR.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: mockError,
      mutate: jest.fn(),
      isValidating: false,
    });

    const { result } = renderHook(() => useBook('1'));

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toEqual(mockError);
  });

  it('should call fetchBookById with correct id', () => {
    const bookId = '123';

    mockUseSWR.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      mutate: jest.fn(),
      isValidating: false,
    });

    renderHook(() => useBook(bookId));

    expect(mockUseSWR).toHaveBeenCalledWith(
      `/api/books/${bookId}`,
      expect.any(Function),
      {
        revalidateOnFocus: false,
        shouldRetryOnError: false,
      }
    );
  });

  it('should not fetch when id is empty', () => {
    mockUseSWR.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
      mutate: jest.fn(),
      isValidating: false,
    });

    renderHook(() => useBook(''));

    expect(mockUseSWR).toHaveBeenCalledWith(null, expect.any(Function), {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    });
  });

  it('should return undefined data when no book is found', () => {
    mockUseSWR.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
      mutate: jest.fn(),
      isValidating: false,
    });

    const { result } = renderHook(() => useBook('nonexistent'));

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should handle successful data fetching', async () => {
    const mockBook: Book = {
      id: '1',
      title: 'Test Book',
      series: null,
      cover: { url: 'test.jpg' },
      releaseDate: '2023-01-01',
      pageCount: 200,
      author: {
        id: 1,
        name: 'Test Author',
        image: { url: 'author.jpg' },
        biography: 'Test biography',
      },
      description: 'Test Description',
      rating: 4.5,
      status: EStatus.READ,
    };

    mockUseSWR.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      mutate: jest.fn(),
      isValidating: false,
    });

    const { result, rerender } = renderHook(() => useBook('1'));

    // Initially loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();

    // Simulate data loaded
    mockUseSWR.mockReturnValue({
      data: mockBook,
      isLoading: false,
      error: null,
      mutate: jest.fn(),
      isValidating: false,
    });

    rerender();

    await waitFor(() => {
      expect(result.current.data).toEqual(mockBook);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });
  });
});
