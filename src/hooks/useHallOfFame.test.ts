import { renderHook, act } from '@testing-library/react';
import { useHallOfFame } from './useHallOfFame';

// Mock SWR
jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(),
  mutate: jest.fn(),
}));

// Mock actions
jest.mock('@/app/actions/book/halloffame/fetchHallOfFame');
jest.mock('@/app/actions/book/halloffame/setHallOfFameBook');
jest.mock('@/app/actions/book/halloffame/deleteBookFromHallOfFame');

import useSWR, { mutate } from 'swr';
import setHallOfFameBook from '@/app/actions/book/halloffame/setHallOfFameBook';
import deleteBookFromHallOfFame from '@/app/actions/book/halloffame/deleteBookFromHallOfFame';

const mockUseSWR = useSWR as jest.MockedFunction<typeof useSWR>;
const mockMutate = mutate as jest.MockedFunction<typeof mutate>;
const mockSetHallOfFameBook = setHallOfFameBook as jest.MockedFunction<
  typeof setHallOfFameBook
>;
const mockDeleteBookFromHallOfFame =
  deleteBookFromHallOfFame as jest.MockedFunction<
    typeof deleteBookFromHallOfFame
  >;

// Helper function to create complete SWR mock
const createSWRMock = (
  data: unknown,
  error: Error | null = null,
  isLoading: boolean = false,
  isValidating: boolean = false
) => ({
  data,
  error,
  isLoading,
  mutate: jest.fn(),
  isValidating,
});

describe('useHallOfFame', () => {
  const userId = 'user-123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return hall of fame data when loaded successfully', () => {
    const mockHallOfFameData = {
      quote: 'Test quote',
      books: [
        { id: '1', title: 'Book 1' },
        { id: '2', title: 'Book 2' },
      ],
    };

    mockUseSWR.mockReturnValue(createSWRMock(mockHallOfFameData, null, false));

    const { result } = renderHook(() => useHallOfFame(userId));

    expect(result.current.data).toEqual(mockHallOfFameData);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.quote).toBe('Test quote');
    expect(result.current.books).toEqual(mockHallOfFameData.books);
  });

  it('should return loading state when fetching hall of fame', () => {
    mockUseSWR.mockReturnValue(createSWRMock(undefined, null, true));

    const { result } = renderHook(() => useHallOfFame(userId));

    expect(result.current.data).toBeNull();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.quote).toBe('');
    expect(result.current.books).toEqual([]);
  });

  it('should return error when fetching hall of fame fails', () => {
    const mockError = new Error('Failed to fetch hall of fame');
    mockUseSWR.mockReturnValue(createSWRMock(undefined, mockError, false));

    const { result } = renderHook(() => useHallOfFame(userId));

    expect(result.current.data).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toEqual(mockError);
    expect(result.current.quote).toBe('');
    expect(result.current.books).toEqual([]);
  });

  it('should handle empty hall of fame data', () => {
    const mockHallOfFameData = {
      quote: '',
      books: [],
    };

    mockUseSWR.mockReturnValue(createSWRMock(mockHallOfFameData, null, false));

    const { result } = renderHook(() => useHallOfFame(userId));

    expect(result.current.data).toEqual(mockHallOfFameData);
    expect(result.current.quote).toBe('');
    expect(result.current.books).toEqual([]);
  });

  it('should add book to hall of fame successfully', async () => {
    const mockHallOfFameData = {
      quote: 'Test quote',
      books: [{ id: '1', title: 'Book 1' }],
    };
    const bookIdToAdd = '2';

    mockUseSWR.mockReturnValue(createSWRMock(mockHallOfFameData, null, false));
    mockSetHallOfFameBook.mockResolvedValue(undefined);

    const { result } = renderHook(() => useHallOfFame(userId));

    await act(async () => {
      await result.current.handleAddBookToHallOfFame(bookIdToAdd);
    });

    expect(mockSetHallOfFameBook).toHaveBeenCalledWith(expect.any(FormData));
    expect(mockMutate).toHaveBeenCalledWith(
      `/api/public/accounts/halloffame/${userId}`
    );
    expect(result.current.isUpdatedAddToHallOfFame).toBe(true);
    expect(result.current.isLoadingAddToHallOfFame).toBe(false);
    expect(result.current.isErrorAddToHallOfFame).toBe(false);
  });

  it('should handle add book to hall of fame error', async () => {
    const mockHallOfFameData = {
      quote: 'Test quote',
      books: [{ id: '1', title: 'Book 1' }],
    };
    const bookIdToAdd = '2';
    const mockError = new Error('Failed to add book');

    mockUseSWR.mockReturnValue(createSWRMock(mockHallOfFameData, null, false));
    mockSetHallOfFameBook.mockRejectedValue(mockError);

    const { result } = renderHook(() => useHallOfFame(userId));

    await act(async () => {
      await result.current.handleAddBookToHallOfFame(bookIdToAdd);
    });

    expect(mockSetHallOfFameBook).toHaveBeenCalledWith(expect.any(FormData));
    expect(result.current.isUpdatedAddToHallOfFame).toBe(false);
    expect(result.current.isLoadingAddToHallOfFame).toBe(false);
    expect(result.current.isErrorAddToHallOfFame).toBe(true);
  });

  it('should delete book from hall of fame successfully', async () => {
    const mockHallOfFameData = {
      quote: 'Test quote',
      books: [
        { id: '1', title: 'Book 1' },
        { id: '2', title: 'Book 2' },
      ],
    };
    const bookIdToDelete = '1';

    mockUseSWR.mockReturnValue(createSWRMock(mockHallOfFameData, null, false));
    mockDeleteBookFromHallOfFame.mockResolvedValue(undefined);

    const { result } = renderHook(() => useHallOfFame(userId));

    await act(async () => {
      await result.current.handleDeleteBookToHallOfFame(bookIdToDelete);
    });

    expect(mockDeleteBookFromHallOfFame).toHaveBeenCalledWith(
      expect.any(FormData)
    );
    expect(mockMutate).toHaveBeenCalledWith(
      `/api/public/accounts/halloffame/${userId}`
    );
    expect(result.current.isUpdatedDeleteToHallOfFame).toBe(true);
    expect(result.current.isLoadingDeleteToHallOfFame).toBe(false);
    expect(result.current.isErrorDeleteToHallOfFame).toBe(false);
  });

  it('should handle delete book from hall of fame error', async () => {
    const mockHallOfFameData = {
      quote: 'Test quote',
      books: [
        { id: '1', title: 'Book 1' },
        { id: '2', title: 'Book 2' },
      ],
    };
    const bookIdToDelete = '1';
    const mockError = new Error('Failed to delete book');

    mockUseSWR.mockReturnValue(createSWRMock(mockHallOfFameData, null, false));
    mockDeleteBookFromHallOfFame.mockRejectedValue(mockError);

    const { result } = renderHook(() => useHallOfFame(userId));

    await act(async () => {
      await result.current.handleDeleteBookToHallOfFame(bookIdToDelete);
    });

    expect(mockDeleteBookFromHallOfFame).toHaveBeenCalledWith(
      expect.any(FormData)
    );
    expect(result.current.isUpdatedDeleteToHallOfFame).toBe(false);
    expect(result.current.isLoadingDeleteToHallOfFame).toBe(false);
    expect(result.current.isErrorDeleteToHallOfFame).toBe(true);
  });

  it('should set loading states correctly during operations', async () => {
    const mockHallOfFameData = {
      quote: 'Test quote',
      books: [{ id: '1', title: 'Book 1' }],
    };
    const bookId = '2';

    mockUseSWR.mockReturnValue(createSWRMock(mockHallOfFameData, null, false));
    mockSetHallOfFameBook.mockResolvedValue(undefined);

    const { result } = renderHook(() => useHallOfFame(userId));

    act(() => {
      result.current.handleAddBookToHallOfFame(bookId);
    });

    expect(result.current.isLoadingAddToHallOfFame).toBe(true);
    expect(result.current.isUpdatedAddToHallOfFame).toBe(false);
    expect(result.current.isErrorAddToHallOfFame).toBe(false);
  });

  it('should reset states correctly', () => {
    const mockHallOfFameData = {
      quote: 'Test quote',
      books: [{ id: '1', title: 'Book 1' }],
    };

    mockUseSWR.mockReturnValue(createSWRMock(mockHallOfFameData, null, false));

    const { result } = renderHook(() => useHallOfFame(userId));

    act(() => {
      result.current.setIsUpdatedAddToHallOfFame(true);
      result.current.setIsErrorAddToHallOfFame(true);
      result.current.setIsLoadingToAddHallOfFame(true);
      result.current.setIsUpdatedDeleteToHallOfFame(true);
      result.current.setIsErrorDeleteToHallOfFame(true);
      result.current.setIsLoadingToDeleteHallOfFame(true);
    });

    expect(result.current.isUpdatedAddToHallOfFame).toBe(true);
    expect(result.current.isErrorAddToHallOfFame).toBe(true);
    expect(result.current.isLoadingAddToHallOfFame).toBe(true);
    expect(result.current.isUpdatedDeleteToHallOfFame).toBe(true);
    expect(result.current.isErrorDeleteToHallOfFame).toBe(true);
    expect(result.current.isLoadingDeleteToHallOfFame).toBe(true);

    act(() => {
      result.current.setIsUpdatedAddToHallOfFame(false);
      result.current.setIsErrorAddToHallOfFame(false);
      result.current.setIsLoadingToAddHallOfFame(false);
      result.current.setIsUpdatedDeleteToHallOfFame(false);
      result.current.setIsErrorDeleteToHallOfFame(false);
      result.current.setIsLoadingToDeleteHallOfFame(false);
    });

    expect(result.current.isUpdatedAddToHallOfFame).toBe(false);
    expect(result.current.isErrorAddToHallOfFame).toBe(false);
    expect(result.current.isLoadingAddToHallOfFame).toBe(false);
    expect(result.current.isUpdatedDeleteToHallOfFame).toBe(false);
    expect(result.current.isErrorDeleteToHallOfFame).toBe(false);
    expect(result.current.isLoadingDeleteToHallOfFame).toBe(false);
  });
});
