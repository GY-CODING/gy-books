import { renderHook, act } from '@testing-library/react';
import { useProfileFilters } from '../useProfileFilters';
import { useSearchParams, useRouter } from 'next/navigation';
import { EStatus } from '@/utils/constants/EStatus';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(),
}));

describe('useProfileFilters', () => {
  const mockSearchParams = {
    get: jest.fn(),
    toString: jest.fn(() => ''),
  };

  const mockRouter = {
    replace: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    mockSearchParams.get.mockImplementation((key: string) => {
      const params: Record<string, string | null> = {};
      return params[key] || null;
    });
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useProfileFilters());

    expect(result.current.status).toBeNull();
    expect(result.current.author).toBe('');
    expect(result.current.series).toBe('');
    expect(result.current.rating).toBe(0);
    expect(result.current.search).toBe('');
    expect(result.current.orderBy).toBe('rating');
    expect(result.current.orderDirection).toBe('desc');
  });

  it('should handle status filter change', () => {
    const { result } = renderHook(() => useProfileFilters());

    act(() => {
      result.current.handleStatusFilterChange(EStatus.READING);
    });

    expect(mockRouter.replace).toHaveBeenCalled();
  });

  it('should handle search change', () => {
    const { result } = renderHook(() => useProfileFilters());

    act(() => {
      result.current.handleSearchChange('test book');
    });

    expect(mockRouter.replace).toHaveBeenCalled();
  });
});
