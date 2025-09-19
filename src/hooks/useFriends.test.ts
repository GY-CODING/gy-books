import { renderHook, act } from '@testing-library/react';
import { useFriends } from './useFriends';

// Mock SWR
jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(),
  useSWRConfig: jest.fn(),
}));

// Mock actions
jest.mock('@/app/actions/accounts/user/friend/deleteFriend');

import useSWR, { useSWRConfig } from 'swr';
import deleteFriend from '@/app/actions/accounts/user/friend/deleteFriend';

const mockUseSWR = useSWR as jest.MockedFunction<typeof useSWR>;
const mockUseSWRConfig = useSWRConfig as jest.MockedFunction<
  typeof useSWRConfig
>;
const mockDeleteFriend = deleteFriend as jest.MockedFunction<
  typeof deleteFriend
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

describe('useFriends', () => {
  let mockMutate: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockMutate = jest.fn();
    mockUseSWRConfig.mockReturnValue({
      mutate: mockMutate,
      cache: new Map(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  });

  it('should return friends data when loaded successfully', () => {
    const mockFriends = [
      { id: '1', name: 'Friend 1' },
      { id: '2', name: 'Friend 2' },
    ];

    mockUseSWR.mockReturnValue(createSWRMock(mockFriends, null, false));

    const { result } = renderHook(() => useFriends());

    expect(result.current.data).toEqual(mockFriends);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.count).toBe(2);
  });

  it('should return loading state when fetching friends', () => {
    mockUseSWR.mockReturnValue(createSWRMock(undefined, null, true));

    const { result } = renderHook(() => useFriends());

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.count).toBe(0);
  });

  it('should return error when fetching friends fails', () => {
    const mockError = new Error('Failed to fetch friends');
    mockUseSWR.mockReturnValue(createSWRMock(undefined, mockError, false));

    const { result } = renderHook(() => useFriends());

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toEqual(mockError);
    expect(result.current.count).toBe(0);
  });

  it('should handle empty friends list', () => {
    mockUseSWR.mockReturnValue(createSWRMock([], null, false));

    const { result } = renderHook(() => useFriends());

    expect(result.current.data).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.count).toBe(0);
  });

  it('should delete friend successfully', async () => {
    const mockFriends = [
      { id: '1', name: 'Friend 1' },
      { id: '2', name: 'Friend 2' },
    ];
    const userIdToDelete = '1';

    mockUseSWR.mockReturnValue(createSWRMock(mockFriends, null, false));
    mockDeleteFriend.mockResolvedValue(true);

    const { result } = renderHook(() => useFriends());

    await act(async () => {
      await result.current.handleDeleteFriend(userIdToDelete);
    });

    expect(mockDeleteFriend).toHaveBeenCalledWith(userIdToDelete);
    expect(mockMutate).toHaveBeenCalledWith('/api/auth/users/accounts/friends');
    expect(result.current.isSuccessDelete).toBe(true);
    expect(result.current.isLoadingDelete).toBe(false);
    expect(result.current.errorDelete).toBe(null);
  });

  it('should handle delete friend error', async () => {
    const mockFriends = [
      { id: '1', name: 'Friend 1' },
      { id: '2', name: 'Friend 2' },
    ];
    const userIdToDelete = '1';
    const mockError = new Error('Failed to delete friend');

    mockUseSWR.mockReturnValue(createSWRMock(mockFriends, null, false));
    mockDeleteFriend.mockRejectedValue(mockError);

    const { result } = renderHook(() => useFriends());

    await act(async () => {
      await result.current.handleDeleteFriend(userIdToDelete);
    });

    expect(mockDeleteFriend).toHaveBeenCalledWith(userIdToDelete);
    expect(result.current.isSuccessDelete).toBe(false);
    expect(result.current.isLoadingDelete).toBe(false);
    expect(result.current.errorDelete).toEqual(mockError);
  });

  it('should set loading state during delete operation', async () => {
    const mockFriends = [
      { id: '1', name: 'Friend 1' },
      { id: '2', name: 'Friend 2' },
    ];
    const userIdToDelete = '1';

    mockUseSWR.mockReturnValue(createSWRMock(mockFriends, null, false));
    mockDeleteFriend.mockResolvedValue(true);

    const { result } = renderHook(() => useFriends());

    act(() => {
      result.current.handleDeleteFriend(userIdToDelete);
    });

    expect(result.current.isLoadingDelete).toBe(true);
    expect(result.current.isSuccessDelete).toBe(false);
    expect(result.current.errorDelete).toBe(null);
  });

  it('should use custom mutate function when provided', async () => {
    const mockFriends = [
      { id: '1', name: 'Friend 1' },
      { id: '2', name: 'Friend 2' },
    ];
    const userIdToDelete = '1';
    const customMutate = jest.fn();

    mockUseSWR.mockReturnValue(createSWRMock(mockFriends, null, false));
    mockDeleteFriend.mockResolvedValue(true);

    const { result } = renderHook(() => useFriends());

    await act(async () => {
      await result.current.handleDeleteFriend(userIdToDelete, customMutate);
    });

    expect(mockDeleteFriend).toHaveBeenCalledWith(userIdToDelete);
    expect(customMutate).toHaveBeenCalledWith(null, { revalidate: false });
    expect(mockMutate).not.toHaveBeenCalled();
    expect(result.current.isSuccessDelete).toBe(true);
  });

  it('should reset states correctly', () => {
    const mockFriends = [
      { id: '1', name: 'Friend 1' },
      { id: '2', name: 'Friend 2' },
    ];

    mockUseSWR.mockReturnValue(createSWRMock(mockFriends, null, false));

    const { result } = renderHook(() => useFriends());

    act(() => {
      result.current.setIsSuccessDelete(true);
      result.current.setErrorDelete(new Error('Test error'));
      result.current.setIsLoadingDelete(true);
    });

    expect(result.current.isSuccessDelete).toBe(true);
    expect(result.current.errorDelete).toEqual(new Error('Test error'));
    expect(result.current.isLoadingDelete).toBe(true);

    act(() => {
      result.current.setIsSuccessDelete(false);
      result.current.setErrorDelete(null);
      result.current.setIsLoadingDelete(false);
    });

    expect(result.current.isSuccessDelete).toBe(false);
    expect(result.current.errorDelete).toBe(null);
    expect(result.current.isLoadingDelete).toBe(false);
  });
});
