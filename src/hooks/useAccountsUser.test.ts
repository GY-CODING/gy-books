import { renderHook } from '@testing-library/react';
import { useAccountsUser } from './useAccountsUser';
import * as swr from 'swr';

// Mock SWR
jest.mock('swr');

// Mock the fetch function
jest.mock('@/app/actions/accounts/user/fetchAccountsUser');

const mockUseSWR = swr.default as jest.MockedFunction<typeof swr.default>;

describe('useAccountsUser', () => {
  const mockUser = {
    id: '123',
    name: 'Test User',
    email: 'test@example.com',
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

    const { result } = renderHook(() => useAccountsUser('123'));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeUndefined();
  });

  it('should return user data when fetch is successful', () => {
    mockUseSWR.mockReturnValue({
      data: mockUser,
      isLoading: false,
      error: undefined,
      mutate: jest.fn(),
      isValidating: false,
    });

    const { result } = renderHook(() => useAccountsUser('123'));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(mockUser);
    expect(result.current.error).toBeUndefined();
  });

  it('should return error when fetch fails', () => {
    const mockError = new Error('Failed to fetch user');
    mockUseSWR.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: mockError,
      mutate: jest.fn(),
      isValidating: false,
    });

    const { result } = renderHook(() => useAccountsUser('123'));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toEqual(mockError);
  });

  it('should not fetch when id is empty', () => {
    mockUseSWR.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: undefined,
      mutate: jest.fn(),
      isValidating: false,
    });

    const { result } = renderHook(() => useAccountsUser(''));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeUndefined();
    expect(mockUseSWR).toHaveBeenCalledWith(
      null,
      expect.any(Function),
      expect.any(Object)
    );
  });

  it('should call getAccountsUser with correct id', () => {
    mockUseSWR.mockReturnValue({
      data: mockUser,
      isLoading: false,
      error: undefined,
      mutate: jest.fn(),
      isValidating: false,
    });

    renderHook(() => useAccountsUser('123'));

    expect(mockUseSWR).toHaveBeenCalledWith(
      '/api/accounts/users/123',
      expect.any(Function),
      {
        revalidateOnFocus: false,
        shouldRetryOnError: false,
      }
    );
  });

  it('should handle undefined id', () => {
    mockUseSWR.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: undefined,
      mutate: jest.fn(),
      isValidating: false,
    });

    const { result } = renderHook(() => useAccountsUser(''));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeUndefined();
    expect(mockUseSWR).toHaveBeenCalledWith(
      null,
      expect.any(Function),
      expect.any(Object)
    );
  });
});
