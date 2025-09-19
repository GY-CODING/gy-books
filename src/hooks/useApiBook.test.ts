import { renderHook } from '@testing-library/react';
import { useApiBook } from './useApiBook';
import * as swr from 'swr';

// Mock SWR
jest.mock('swr');

// Mock the fetch function
jest.mock('@/app/actions/book/fetchApiBook');

const mockUseSWR = swr.default as jest.MockedFunction<typeof swr.default>;

describe('useApiBook', () => {
  const mockApiBook = {
    id: 'book-123',
    title: 'Test Book',
    author: 'Test Author',
    description: 'A test book description',
    publishedDate: '2024-01-01',
    pageCount: 300,
    categories: ['Fiction'],
    averageRating: 4.5,
    ratingsCount: 100,
    imageLinks: {
      thumbnail: 'https://example.com/thumbnail.jpg',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return loading state initially', () => {
    mockUseSWR.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: undefined,
      mutate: jest.fn(),
      isValidating: false,
    });

    const { result } = renderHook(() => useApiBook('book-123'));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeUndefined();
    expect(typeof result.current.mutate).toBe('function');
  });

  it('should return api book data when fetch is successful', () => {
    const mockMutate = jest.fn();
    mockUseSWR.mockReturnValue({
      data: mockApiBook,
      isLoading: false,
      error: undefined,
      mutate: mockMutate,
      isValidating: false,
    });

    const { result } = renderHook(() => useApiBook('book-123'));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(mockApiBook);
    expect(result.current.error).toBeUndefined();
    expect(result.current.mutate).toBe(mockMutate);
  });

  it('should return error when fetch fails', () => {
    const mockError = new Error('Failed to fetch book');
    const mockMutate = jest.fn();
    mockUseSWR.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: mockError,
      mutate: mockMutate,
      isValidating: false,
    });

    const { result } = renderHook(() => useApiBook('book-123'));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toEqual(mockError);
    expect(result.current.mutate).toBe(mockMutate);
  });

  it('should not fetch when id is empty', () => {
    mockUseSWR.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: undefined,
      mutate: jest.fn(),
      isValidating: false,
    });

    const { result } = renderHook(() => useApiBook(''));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeUndefined();
    expect(mockUseSWR).toHaveBeenCalledWith(
      null,
      expect.any(Function),
      expect.any(Object)
    );
  });

  it('should call getApiBook with correct id', () => {
    const mockMutate = jest.fn();
    mockUseSWR.mockReturnValue({
      data: mockApiBook,
      isLoading: false,
      error: undefined,
      mutate: mockMutate,
      isValidating: false,
    });

    renderHook(() => useApiBook('book-123'));

    expect(mockUseSWR).toHaveBeenCalledWith('book-123', expect.any(Function), {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    });
  });

  it('should handle undefined data', () => {
    const mockMutate = jest.fn();
    mockUseSWR.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: undefined,
      mutate: mockMutate,
      isValidating: false,
    });

    const { result } = renderHook(() => useApiBook('book-123'));

    expect(result.current.data).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it('should expose mutate function correctly', () => {
    const mockMutate = jest.fn().mockResolvedValue(mockApiBook);
    mockUseSWR.mockReturnValue({
      data: mockApiBook,
      isLoading: false,
      error: undefined,
      mutate: mockMutate,
      isValidating: false,
    });

    const { result } = renderHook(() => useApiBook('book-123'));

    // Test that mutate function is exposed
    expect(typeof result.current.mutate).toBe('function');

    // Test calling mutate
    result.current.mutate();
    expect(mockMutate).toHaveBeenCalled();
  });

  it('should handle mutate with data and options', async () => {
    const mockMutate = jest.fn().mockResolvedValue(mockApiBook);
    mockUseSWR.mockReturnValue({
      data: mockApiBook,
      isLoading: false,
      error: undefined,
      mutate: mockMutate,
      isValidating: false,
    });

    const { result } = renderHook(() => useApiBook('book-123'));

    // Test mutate with data and options
    await result.current.mutate(mockApiBook, { revalidate: true });

    expect(mockMutate).toHaveBeenCalledWith(mockApiBook, { revalidate: true });
  });
});
