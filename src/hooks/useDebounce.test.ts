import { renderHook, act, waitFor } from '@testing-library/react';
import { useDebounce } from './useDebounce';

// Mock timers
jest.useFakeTimers();

describe('useDebounce', () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));

    expect(result.current).toBe('initial');
  });

  it('should return debounced value after delay', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    );

    // Initial value
    expect(result.current).toBe('initial');

    // Change value
    rerender({ value: 'updated', delay: 500 });

    // Value should still be initial (not yet debounced)
    expect(result.current).toBe('initial');

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Now should return the debounced value
    await waitFor(() => {
      expect(result.current).toBe('updated');
    });
  });

  it('should reset timer when value changes before delay expires', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'first', delay: 500 },
      }
    );

    // Change value before delay expires
    rerender({ value: 'second', delay: 500 });

    // Advance time partially
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Should still be first value
    expect(result.current).toBe('first');

    // Change value again
    rerender({ value: 'third', delay: 500 });

    // Advance time to complete the full delay from the last change
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Should return the latest value
    await waitFor(() => {
      expect(result.current).toBe('third');
    });
  });

  it('should handle different delay values', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 1000 },
      }
    );

    // Change value
    rerender({ value: 'updated', delay: 1000 });

    // Advance time by 500ms (half the delay)
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Should still be initial
    expect(result.current).toBe('initial');

    // Advance remaining time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Now should be updated
    await waitFor(() => {
      expect(result.current).toBe('updated');
    });
  });

  it('should handle zero delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 0 },
      }
    );

    // Change value
    rerender({ value: 'updated', delay: 0 });

    // Should immediately reflect the change
    expect(result.current).toBe('updated');
  });

  it('should handle different value types', async () => {
    // Test with number
    const { result: numberResult, rerender: rerenderNumber } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 42, delay: 300 },
      }
    );

    rerenderNumber({ value: 100, delay: 300 });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(numberResult.current).toBe(100);
    });

    // Test with object
    const obj1 = { name: 'John' };
    const obj2 = { name: 'Jane' };

    const { result: objectResult, rerender: rerenderObject } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: obj1, delay: 300 },
      }
    );

    rerenderObject({ value: obj2, delay: 300 });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(objectResult.current).toBe(obj2);
    });
  });

  it('should clear timeout on unmount', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

    const { unmount } = renderHook(() => useDebounce('test', 500));

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });
});
