import { renderHook, act } from '@testing-library/react';
import { useUpdateHallOfFame } from './useUpdateHallOfFame';

// Mock SWR
jest.mock('swr', () => ({
  __esModule: true,
  mutate: jest.fn(),
}));

// Mock actions
jest.mock('@/app/actions/book/halloffame/updateHallOfFame');

import { mutate } from 'swr';
import updateHallOfFame from '@/app/actions/book/halloffame/updateHallOfFame';

const mockMutate = mutate as jest.MockedFunction<typeof mutate>;
const mockUpdateHallOfFame = updateHallOfFame as jest.MockedFunction<
  typeof updateHallOfFame
>;

describe('useUpdateHallOfFame', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update hall of fame successfully', async () => {
    const mockFormData = new FormData();
    mockFormData.append('quote', 'Updated quote');

    mockUpdateHallOfFame.mockResolvedValue('Updated successfully');

    const { result } = renderHook(() => useUpdateHallOfFame());

    let updateResult;
    await act(async () => {
      updateResult = await result.current.handleUpdateHallOfFame(mockFormData);
    });

    expect(mockUpdateHallOfFame).toHaveBeenCalledWith(mockFormData);
    expect(mockMutate).toHaveBeenCalledWith('/api/public/accounts/halloffame');
    expect(updateResult).toBe('Updated successfully');
    expect(result.current.isUpdated).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('should handle update hall of fame error', async () => {
    const mockFormData = new FormData();
    mockFormData.append('quote', 'Updated quote');

    const mockError = new Error('Failed to update hall of fame');
    mockUpdateHallOfFame.mockRejectedValue(mockError);

    const { result } = renderHook(() => useUpdateHallOfFame());

    let updateResult;
    await act(async () => {
      updateResult = await result.current.handleUpdateHallOfFame(mockFormData);
    });

    expect(mockUpdateHallOfFame).toHaveBeenCalledWith(mockFormData);
    expect(updateResult).toBeUndefined();
    expect(result.current.isUpdated).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(true);
  });

  it('should set loading state during update operation', async () => {
    const mockFormData = new FormData();
    mockFormData.append('quote', 'Updated quote');

    mockUpdateHallOfFame.mockResolvedValue('Updated successfully');

    const { result } = renderHook(() => useUpdateHallOfFame());

    act(() => {
      result.current.handleUpdateHallOfFame(mockFormData);
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isUpdated).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('should reset states correctly', () => {
    const { result } = renderHook(() => useUpdateHallOfFame());

    act(() => {
      result.current.setIsUpdated(true);
      result.current.setIsError(true);
    });

    expect(result.current.isUpdated).toBe(true);
    expect(result.current.isError).toBe(true);

    act(() => {
      result.current.setIsUpdated(false);
      result.current.setIsError(false);
    });

    expect(result.current.isUpdated).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('should handle empty form data', async () => {
    const mockFormData = new FormData();

    mockUpdateHallOfFame.mockResolvedValue('Updated successfully');

    const { result } = renderHook(() => useUpdateHallOfFame());

    let updateResult;
    await act(async () => {
      updateResult = await result.current.handleUpdateHallOfFame(mockFormData);
    });

    expect(mockUpdateHallOfFame).toHaveBeenCalledWith(mockFormData);
    expect(updateResult).toBe('Updated successfully');
    expect(result.current.isUpdated).toBe(true);
  });

  it('should handle complex form data with multiple fields', async () => {
    const mockFormData = new FormData();
    mockFormData.append('quote', 'New inspirational quote');
    mockFormData.append('description', 'Updated description');
    mockFormData.append('visibility', 'public');

    mockUpdateHallOfFame.mockResolvedValue('Updated successfully');

    const { result } = renderHook(() => useUpdateHallOfFame());

    let updateResult;
    await act(async () => {
      updateResult = await result.current.handleUpdateHallOfFame(mockFormData);
    });

    expect(mockUpdateHallOfFame).toHaveBeenCalledWith(mockFormData);
    expect(updateResult).toBe('Updated successfully');
    expect(result.current.isUpdated).toBe(true);
  });

  it('should handle network timeout error', async () => {
    const mockFormData = new FormData();
    mockFormData.append('quote', 'Updated quote');

    const mockError = new Error('Network timeout');
    mockUpdateHallOfFame.mockRejectedValue(mockError);

    const { result } = renderHook(() => useUpdateHallOfFame());

    await act(async () => {
      await result.current.handleUpdateHallOfFame(mockFormData);
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.isUpdated).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle validation error from server', async () => {
    const mockFormData = new FormData();
    mockFormData.append('quote', 'Invalid quote content');

    const mockError = new Error('Validation failed: Quote too long');
    mockUpdateHallOfFame.mockRejectedValue(mockError);

    const { result } = renderHook(() => useUpdateHallOfFame());

    await act(async () => {
      await result.current.handleUpdateHallOfFame(mockFormData);
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.isUpdated).toBe(false);
  });
});
