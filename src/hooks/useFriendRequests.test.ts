import { renderHook, act } from '@testing-library/react';
import { useFriendRequests } from './useFriendRequests';

// Mock SWR
jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock manageRequest
jest.mock('@/app/actions/accounts/user/friend/handleRequest', () => ({
  __esModule: true,
  default: jest.fn(),
}));

import useSWR from 'swr';
import manageRequest from '@/app/actions/accounts/user/friend/handleRequest';
import { ECommands } from '@/utils/constants/ECommands';
import { UUID } from 'crypto';

const mockUseSWR = useSWR as jest.MockedFunction<typeof useSWR>;
const mockManageRequest = manageRequest as jest.MockedFunction<
  typeof manageRequest
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

describe('useFriendRequests', () => {
  const profileId = '550e8400-e29b-41d4-a716-446655440000';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return all required properties', () => {
    mockUseSWR.mockReturnValue(createSWRMock([], null, false));

    const { result } = renderHook(() => useFriendRequests(profileId));

    expect(result.current).toHaveProperty('data');
    expect(result.current).toHaveProperty('isLoading');
    expect(result.current).toHaveProperty('error');
    expect(result.current).toHaveProperty('profilesID');
    expect(result.current).toHaveProperty('users');
    expect(result.current).toHaveProperty('isLoadingUsers');
    expect(result.current).toHaveProperty('friendRequestsWithUsers');
    expect(result.current).toHaveProperty('count');
    expect(result.current).toHaveProperty('handleManageRequest');
    expect(result.current).toHaveProperty('isLoadingManageRequest');
    expect(result.current).toHaveProperty('errorManageRequest');
    expect(result.current).toHaveProperty('setErrorManageRequest');
    expect(result.current).toHaveProperty('setIsLoadingManageRequest');
    expect(result.current).toHaveProperty('isSuccessManageRequest');
    expect(result.current).toHaveProperty('setIsSuccessManageRequest');
  });

  it('should return friend requests data when loaded successfully', () => {
    const mockFriendRequests = [
      { id: '1', from: 'user-1', to: 'user-2' },
      { id: '2', from: 'user-3', to: 'user-2' },
    ];
    const mockUsers = [
      { id: 'user-1', name: 'User 1' },
      { id: 'user-3', name: 'User 3' },
    ];

    mockUseSWR
      .mockReturnValueOnce(createSWRMock(mockFriendRequests, null, false))
      .mockReturnValueOnce(createSWRMock(mockUsers, null, false));

    const { result } = renderHook(() => useFriendRequests(profileId));

    expect(result.current.data).toEqual(mockFriendRequests);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.count).toBe(2);
    expect(result.current.profilesID).toEqual(['user-1', 'user-3']);
    expect(result.current.users).toEqual(mockUsers);
    expect(result.current.isLoadingUsers).toBe(false);
  });

  it('should return loading state when fetching friend requests', () => {
    mockUseSWR
      .mockReturnValueOnce(createSWRMock(undefined, null, true))
      .mockReturnValueOnce(createSWRMock(undefined, null, false));

    const { result } = renderHook(() => useFriendRequests(profileId));

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.count).toBe(0);
  });

  it('should return error when fetching friend requests fails', () => {
    const mockError = new Error('Failed to fetch friend requests');
    mockUseSWR
      .mockReturnValueOnce(createSWRMock(undefined, mockError, false))
      .mockReturnValueOnce(createSWRMock(undefined, null, false));

    const { result } = renderHook(() => useFriendRequests(profileId));

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toEqual(mockError);
    expect(result.current.count).toBe(0);
  });

  it('should handle empty friend requests list', () => {
    mockUseSWR
      .mockReturnValueOnce(createSWRMock([], null, false))
      .mockReturnValueOnce(createSWRMock(undefined, null, false));

    const { result } = renderHook(() => useFriendRequests(profileId));

    expect(result.current.data).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.count).toBe(0);
    expect(result.current.friendRequestsWithUsers).toBeUndefined();
  });

  it('should combine friend requests with user data', () => {
    const mockFriendRequests = [
      { id: '1', from: 'user-1', to: 'user-2' },
      { id: '2', from: 'user-3', to: 'user-2' },
    ];
    const mockUsers = [
      { id: 'user-1', name: 'User 1' },
      { id: 'user-3', name: 'User 3' },
    ];

    mockUseSWR
      .mockReturnValueOnce(createSWRMock(mockFriendRequests, null, false))
      .mockReturnValueOnce(createSWRMock(mockUsers, null, false));

    const { result } = renderHook(() => useFriendRequests(profileId));

    expect(result.current.friendRequestsWithUsers).toEqual([
      {
        id: '1',
        from: 'user-1',
        to: 'user-2',
        user: { id: 'user-1', name: 'User 1' },
      },
      {
        id: '2',
        from: 'user-3',
        to: 'user-2',
        user: { id: 'user-3', name: 'User 3' },
      },
    ]);
  });

  it('should manage friend request successfully', async () => {
    const mockFriendRequests = [{ id: '1', from: 'user-1', to: 'user-2' }];
    const mockUsers = [{ id: 'user-1', name: 'User 1' }];

    mockUseSWR
      .mockReturnValueOnce(createSWRMock(mockFriendRequests, null, false))
      .mockReturnValueOnce(createSWRMock(mockUsers, null, false));

    mockManageRequest.mockResolvedValue(true);

    const { result } = renderHook(() => useFriendRequests(profileId));

    await act(async () => {
      await result.current.handleManageRequest('1', ECommands.ACCEPT);
    });

    expect(mockManageRequest).toHaveBeenCalledWith(expect.any(FormData));
    expect(result.current.isSuccessManageRequest).toBe(true);
    expect(result.current.errorManageRequest).toBe(false);
  });

  it('should handle manage friend request error', async () => {
    const mockFriendRequests = [{ id: '1', from: 'user-1', to: 'user-2' }];
    const mockUsers = [{ id: 'user-1', name: 'User 1' }];

    mockUseSWR
      .mockReturnValueOnce(createSWRMock(mockFriendRequests, null, false))
      .mockReturnValueOnce(createSWRMock(mockUsers, null, false));

    const mockError = new Error('Failed to manage request');
    mockManageRequest.mockRejectedValue(mockError);

    const { result } = renderHook(() => useFriendRequests(profileId));

    await act(async () => {
      await result.current.handleManageRequest('1', ECommands.DENY);
    });

    expect(mockManageRequest).toHaveBeenCalledWith(expect.any(FormData));
    expect(result.current.isSuccessManageRequest).toBe(false);
    expect(result.current.errorManageRequest).toBe(true);
  });

  it('should track loading state for specific request', async () => {
    const mockFriendRequests = [{ id: '1', from: 'user-1', to: 'user-2' }];
    const mockUsers = [{ id: 'user-1', name: 'User 1' }];

    mockUseSWR
      .mockReturnValueOnce(createSWRMock(mockFriendRequests, null, false))
      .mockReturnValueOnce(createSWRMock(mockUsers, null, false));

    mockManageRequest.mockResolvedValue(true);

    const { result } = renderHook(() => useFriendRequests(profileId));

    act(() => {
      result.current.handleManageRequest('1', ECommands.ACCEPT);
    });

    expect(result.current.isLoadingManageRequest('1')).toBe(true);
    expect(result.current.isLoadingManageRequest('2')).toBe(false);
  });

  it('should reset states correctly', () => {
    const mockFriendRequests = [{ id: '1', from: 'user-1', to: 'user-2' }];
    const mockUsers = [{ id: 'user-1', name: 'User 1' }];

    mockUseSWR
      .mockReturnValueOnce(createSWRMock(mockFriendRequests, null, false))
      .mockReturnValueOnce(createSWRMock(mockUsers, null, false));

    const { result } = renderHook(() => useFriendRequests(profileId));

    act(() => {
      result.current.setIsSuccessManageRequest(true);
      result.current.setErrorManageRequest(true);
    });

    expect(result.current.isSuccessManageRequest).toBe(true);
    expect(result.current.errorManageRequest).toBe(true);

    act(() => {
      result.current.setIsSuccessManageRequest(false);
      result.current.setErrorManageRequest(false);
    });

    expect(result.current.isSuccessManageRequest).toBe(false);
    expect(result.current.errorManageRequest).toBe(false);
  });

  it('should not fetch when profileId is undefined', () => {
    mockUseSWR.mockReturnValue(createSWRMock(null, null, false));

    renderHook(() => useFriendRequests(undefined as unknown as UUID));

    expect(mockUseSWR).toHaveBeenCalledWith(null, expect.any(Function));
    expect(mockUseSWR).toHaveBeenCalledWith(null, expect.any(Function));
  });
});
