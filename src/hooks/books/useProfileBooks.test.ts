import { renderHook, waitFor } from '@testing-library/react';
import useProfileBooks from './useProfileBooks';

describe('useProfileBooks', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('fetches pages of 5 items and accumulates results', async () => {
    // Prepare three pages: 5, 5 and 2 items (total 12)
    const pages = [
      Array.from({ length: 5 }, (_, i) => ({ id: `b${i + 1}` })),
      Array.from({ length: 5 }, (_, i) => ({ id: `b${i + 6}` })),
      Array.from({ length: 2 }, (_, i) => ({ id: `b${i + 11}` })),
    ];

    const fetchMock = jest.spyOn(global, 'fetch').mockImplementation(
      (input: string | URL | Request, _init?: RequestInit) => {
        const url = String(input);
      const match = url.match(/page=(\d+)/);
      const pageIndex = match ? Number(match[1]) : 0;
      const body = pages[pageIndex] ?? [];
      return Promise.resolve({ ok: true, json: async () => body } as unknown as Response);
      }
    );

    const { result } = renderHook(() => useProfileBooks('user-1', 5));

    // Wait until loading finishes
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBeNull();
    expect(result.current.data.length).toBe(12);
    expect(fetchMock).toHaveBeenCalledTimes(3);

    fetchMock.mockRestore();
  });
});
