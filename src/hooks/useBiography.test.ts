import { renderHook, act } from '@testing-library/react';
import { useBiography } from './useBiography';

// Mock the updateBiography function
jest.mock('@/app/actions/book/updateBiography');

// Mock SWR mutate
jest.mock('swr', () => ({
  mutate: jest.fn(),
}));

import updateBiography from '@/app/actions/book/updateBiography';
import { mutate } from 'swr';

const mockUpdateBiography = updateBiography as jest.MockedFunction<
  typeof updateBiography
>;
const mockMutate = mutate as jest.MockedFunction<typeof mutate>;

describe('useBiography', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => useBiography());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isUpdated).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(typeof result.current.handleUpdateBiography).toBe('function');
    expect(typeof result.current.setIsUpdated).toBe('function');
    expect(typeof result.current.setIsError).toBe('function');
  });

  it('should handle successful biography update', async () => {
    const mockBiography = 'This is my new biography';
    const formData = new FormData();
    formData.append('biography', mockBiography);

    mockUpdateBiography.mockResolvedValue(mockBiography);

    const { result } = renderHook(() => useBiography());

    let returnValue: string | undefined;
    await act(async () => {
      returnValue = await result.current.handleUpdateBiography(formData);
    });

    expect(returnValue).toBe(mockBiography);
    expect(mockUpdateBiography).toHaveBeenCalledWith(mockBiography);
    expect(mockMutate).toHaveBeenCalledWith('/api/auth/get');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isUpdated).toBe(true);
    expect(result.current.isError).toBe(false);
  });

  it('should handle biography update error', async () => {
    const mockError = new Error('Failed to update biography');
    const formData = new FormData();
    formData.append('biography', 'Test biography');

    mockUpdateBiography.mockRejectedValue(mockError);

    const { result } = renderHook(() => useBiography());

    let returnValue: string | undefined;
    await act(async () => {
      returnValue = await result.current.handleUpdateBiography(formData);
    });

    expect(returnValue).toBeUndefined();
    expect(mockUpdateBiography).toHaveBeenCalledWith('Test biography');
    expect(mockMutate).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isUpdated).toBe(false);
    expect(result.current.isError).toBe(true);
  });

  it('should set loading to true during update', async () => {
    const formData = new FormData();
    formData.append('biography', 'Test biography');

    // Mock a delayed response
    mockUpdateBiography.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve('success'), 100))
    );

    const { result } = renderHook(() => useBiography());

    // Start the async operation without awaiting immediately
    let updatePromise: Promise<string | undefined>;
    act(() => {
      updatePromise = result.current.handleUpdateBiography(formData);
    });

    // Check loading state during operation
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isUpdated).toBe(false);
    expect(result.current.isError).toBe(false);

    // Wait for completion
    await act(async () => {
      await updatePromise;
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('should handle empty biography', async () => {
    const formData = new FormData();
    formData.append('biography', '');

    mockUpdateBiography.mockResolvedValue('');

    const { result } = renderHook(() => useBiography());

    let returnValue: string | undefined;
    await act(async () => {
      returnValue = await result.current.handleUpdateBiography(formData);
    });

    expect(returnValue).toBe('');
    expect(mockUpdateBiography).toHaveBeenCalledWith('');
    expect(mockMutate).toHaveBeenCalledWith('/api/auth/get');
    expect(result.current.isUpdated).toBe(true);
  });

  it('should handle FormData without biography field', async () => {
    const formData = new FormData();
    // No biography field added

    mockUpdateBiography.mockResolvedValue('');

    const { result } = renderHook(() => useBiography());

    await act(async () => {
      const returnValue = await result.current.handleUpdateBiography(formData);
      expect(returnValue).toBe('');
    });

    expect(mockUpdateBiography).toHaveBeenCalledWith(null);
    expect(result.current.isUpdated).toBe(true);
  });

  it('should allow manual state updates', () => {
    const { result } = renderHook(() => useBiography());

    act(() => {
      result.current.setIsUpdated(true);
      result.current.setIsError(true);
    });

    expect(result.current.isUpdated).toBe(true);
    expect(result.current.isError).toBe(true);
  });

  it('should reset error state on successful update', async () => {
    const formData = new FormData();
    formData.append('biography', 'Test biography');

    mockUpdateBiography.mockResolvedValue('success');

    const { result } = renderHook(() => useBiography());

    // First set error state
    act(() => {
      result.current.setIsError(true);
    });
    expect(result.current.isError).toBe(true);

    // Then do successful update
    await act(async () => {
      await result.current.handleUpdateBiography(formData);
    });

    expect(result.current.isError).toBe(false);
    expect(result.current.isUpdated).toBe(true);
  });

  it('should call updateBiography with correct biography text', async () => {
    const biographyText = 'This is a detailed biography about the user.';
    const formData = new FormData();
    formData.append('biography', biographyText);

    mockUpdateBiography.mockResolvedValue(biographyText);

    const { result } = renderHook(() => useBiography());

    await act(async () => {
      await result.current.handleUpdateBiography(formData);
    });

    expect(mockUpdateBiography).toHaveBeenCalledTimes(1);
    expect(mockUpdateBiography).toHaveBeenCalledWith(biographyText);
  });
});
