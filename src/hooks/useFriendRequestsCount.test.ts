import { renderHook } from '@testing-library/react';
import { useFriendRequestsCount } from './useFriendRequestsCount';
import { FriendRequest } from '@/domain/friend.model';

// Mock Next.js headers and cookies
jest.mock('next/headers', () => ({
  headers: jest.fn(() => ({
    get: jest.fn((key: string) => {
      if (key === 'host') return 'localhost:3000';
      return null;
    }),
  })),
  cookies: jest.fn(() => ({
    toString: jest.fn(() => 'mock-cookie'),
  })),
}));

// Mock getFriendRequests function
jest.mock('@/app/actions/accounts/user/friend/fetchFriendRequest', () => ({
  __esModule: true,
  default: jest.fn(),
}));

import getFriendRequests from '@/app/actions/accounts/user/friend/fetchFriendRequest';

// Mock SWR
jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(),
}));

import useSWR from 'swr';
import { UUID } from 'crypto';

const mockGetFriendRequests = getFriendRequests as jest.MockedFunction<
  typeof getFriendRequests
>;
const mockUseSWR = useSWR as jest.MockedFunction<typeof useSWR>;

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

describe('useFriendRequestsCount', () => {
  const profileId = '550e8400-e29b-41d4-a716-446655440000';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return friend requests count when loaded successfully', () => {
    const mockFriendRequests = [
      { id: '1', from: 'user-1', to: 'user-2' },
      { id: '2', from: 'user-3', to: 'user-2' },
      { id: '3', from: 'user-4', to: 'user-2' },
    ];

    mockUseSWR.mockReturnValue(createSWRMock(mockFriendRequests, null, false));

    const { result } = renderHook(() => useFriendRequestsCount(profileId));

    expect(result.current.count).toBe(3);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.mutate).toBe('function');
  });

  it('should return loading state when fetching friend requests', () => {
    mockUseSWR.mockReturnValue(createSWRMock(undefined, null, true));

    const { result } = renderHook(() => useFriendRequestsCount(profileId));

    expect(result.current.count).toBe(0);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(null);
  });

  it('should return error when fetching friend requests fails', () => {
    const mockError = new Error('Failed to fetch friend requests');
    mockUseSWR.mockReturnValue(createSWRMock(undefined, mockError, false));

    const { result } = renderHook(() => useFriendRequestsCount(profileId));

    expect(result.current.count).toBe(0);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toEqual(mockError);
  });

  it('should handle empty friend requests list', () => {
    mockUseSWR.mockReturnValue(createSWRMock([], null, false));

    const { result } = renderHook(() => useFriendRequestsCount(profileId));

    expect(result.current.count).toBe(0);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should handle null data', () => {
    mockUseSWR.mockReturnValue(createSWRMock(null, null, false));

    const { result } = renderHook(() => useFriendRequestsCount(profileId));

    expect(result.current.count).toBe(0);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should not fetch when profileId is undefined', () => {
    mockUseSWR.mockReturnValue(createSWRMock(null, null, false));

    renderHook(() => useFriendRequestsCount(undefined as unknown as UUID));

    expect(mockUseSWR).toHaveBeenCalledWith(null, expect.any(Function), {
      refreshInterval: 5000,
    });
  });

  it('should call getFriendRequests with correct profileId', () => {
    const mockFriendRequests = [{ id: '1', from: 'user-1', to: 'user-2' }];

    mockGetFriendRequests.mockResolvedValue(
      mockFriendRequests as FriendRequest[]
    );
    mockUseSWR.mockReturnValue(createSWRMock(mockFriendRequests, null, false));

    renderHook(() => useFriendRequestsCount(profileId));

    expect(mockUseSWR).toHaveBeenCalledWith(
      ['friendRequests', profileId],
      expect.any(Function),
      { refreshInterval: 5000 }
    );
  });

  it('should return mutate function', () => {
    mockUseSWR.mockReturnValue(createSWRMock([], null, false, false));

    const { result } = renderHook(() => useFriendRequestsCount(profileId));

    expect(typeof result.current.mutate).toBe('function');
  });
});
