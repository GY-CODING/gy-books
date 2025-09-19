import { renderHook } from '@testing-library/react';
import { useUser } from './useUser';

// Mock SWR
jest.mock('swr');

// Mock Redux
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

// Mock actions
jest.mock('@/app/actions/accounts/fetchUser');

import useSWR from 'swr';
import { useDispatch } from 'react-redux';

const mockUseSWR = useSWR as jest.MockedFunction<typeof useSWR>;
const mockUseDispatch = useDispatch as jest.MockedFunction<typeof useDispatch>;

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

describe('useUser', () => {
  let mockDispatch: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDispatch = jest.fn();
    mockUseDispatch.mockReturnValue(mockDispatch);
  });

  it('should return user data when loaded successfully', () => {
    const mockUser = {
      id: 'user-123',
      name: 'John Doe',
      email: 'john@example.com',
    };

    mockUseSWR.mockReturnValue(createSWRMock(mockUser, null, false));

    const { result } = renderHook(() => useUser());

    expect(result.current.data).toEqual(mockUser);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'user/setProfile',
      payload: mockUser,
    });
  });

  it('should return loading state when fetching user', () => {
    mockUseSWR.mockReturnValue(createSWRMock(undefined, null, true));

    const { result } = renderHook(() => useUser());

    expect(result.current.data).toBeNull();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('should return error when fetching user fails', () => {
    const mockError = new Error('Failed to fetch user');
    mockUseSWR.mockReturnValue(createSWRMock(undefined, mockError, false));

    const { result } = renderHook(() => useUser());

    expect(result.current.data).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toEqual(mockError);
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('should dispatch setProfile when user data is received', () => {
    const mockUser = {
      id: 'user-456',
      name: 'Jane Smith',
      email: 'jane@example.com',
      avatar: 'avatar.jpg',
    };

    mockUseSWR.mockReturnValue(createSWRMock(mockUser, null, false));

    renderHook(() => useUser());

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'user/setProfile',
      payload: mockUser,
    });
  });

  it('should handle empty user data', () => {
    const mockUser = null;
    mockUseSWR.mockReturnValue(createSWRMock(mockUser, null, false));

    const { result } = renderHook(() => useUser());

    expect(result.current.data).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('should handle user data with minimal fields', () => {
    const mockUser = {
      id: 'user-789',
      name: 'Minimal User',
    };

    mockUseSWR.mockReturnValue(createSWRMock(mockUser, null, false));

    const { result } = renderHook(() => useUser());

    expect(result.current.data).toEqual(mockUser);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'user/setProfile',
      payload: mockUser,
    });
  });

  it('should handle user data with all fields', () => {
    const mockUser = {
      id: 'user-999',
      name: 'Complete User',
      email: 'complete@example.com',
      avatar: 'avatar.png',
      bio: 'Software developer',
      location: 'New York',
      website: 'https://example.com',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-12-01T00:00:00Z',
    };

    mockUseSWR.mockReturnValue(createSWRMock(mockUser, null, false));

    const { result } = renderHook(() => useUser());

    expect(result.current.data).toEqual(mockUser);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'user/setProfile',
      payload: mockUser,
    });
  });

  it('should configure SWR with correct options', () => {
    mockUseSWR.mockReturnValue(createSWRMock(null, null, false));

    renderHook(() => useUser());

    expect(mockUseSWR).toHaveBeenCalledWith(
      '/api/auth/get',
      expect.any(Function),
      {
        revalidateOnFocus: false,
        shouldRetryOnError: false,
        dedupingInterval: 30000,
        revalidateOnReconnect: false,
        revalidateIfStale: false,
        focusThrottleInterval: 30000,
        keepPreviousData: true,
      }
    );
  });

  it('should not dispatch when data is null', () => {
    mockUseSWR.mockReturnValue(createSWRMock(null, null, false));

    renderHook(() => useUser());

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('should not dispatch when data is undefined', () => {
    mockUseSWR.mockReturnValue(createSWRMock(undefined, null, false));

    renderHook(() => useUser());

    expect(mockDispatch).not.toHaveBeenCalled();
  });
});
