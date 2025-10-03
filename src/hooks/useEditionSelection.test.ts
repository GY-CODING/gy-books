import { renderHook, act } from '@testing-library/react';
import { useEditionSelection } from './useEditionSelection';
import { Edition } from '@/domain/book.model';
import { ApiBook } from '@/domain/apiBook.model';
import { EStatus } from '@/utils/constants/EStatus';
import rateBook from '@/app/actions/book/rateBook';

// Mock de los hooks y funciones
jest.mock('@/hooks/useUser', () => ({
  useUser: jest.fn(),
}));

jest.mock('@/app/actions/book/rateBook', () => jest.fn());

jest.mock('@/utils/bookEditionHelpers', () => ({
  findEditionById: jest.fn((editions, id) => {
    if (!editions || !id) return null;
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    return (
      editions.find((edition: Edition) => edition.id === numericId) || null
    );
  }),
  getDisplayDataFromEdition: jest.fn(
    (edition, fallbackTitle, fallbackImageUrl) => ({
      title: edition?.title || fallbackTitle,
      imageUrl: edition?.cached_image?.url || fallbackImageUrl,
    })
  ),
}));

import { useUser } from '@/hooks/useUser';
const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;
const mockRateBook = rateBook as jest.MockedFunction<typeof rateBook>;

describe('useEditionSelection', () => {
  const mockUser = {
    id: 'user1',
    username: 'testuser',
  };

  const mockEditions: Edition[] = [
    {
      id: 1,
      book_id: 1,
      title: 'Spanish Edition',
      pages: 300,
      cached_image: {
        id: 1,
        url: 'https://example.com/spanish-cover.jpg',
        color: '#FF0000',
        width: 300,
        height: 450,
        color_name: 'red',
      },
      language: {
        language: 'Spanish',
        id: 1,
      },
    },
    {
      id: 2,
      book_id: 1,
      title: 'English Edition',
      pages: 280,
      cached_image: {
        id: 2,
        url: 'https://example.com/english-cover.jpg',
        color: '#0000FF',
        width: 300,
        height: 450,
        color_name: 'blue',
      },
      language: {
        language: 'English',
        id: 2,
      },
    },
  ];

  const mockApiBookWithUserData: ApiBook = {
    id: '1',
    averageRating: 4.5,
    userData: {
      userId: 'user1',
      status: EStatus.READING,
      rating: 4,
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      progress: 50,
      editionId: '1',
    },
  };

  const mockApiBookWithoutUserData: ApiBook = {
    id: '1',
    averageRating: 4.5,
  };

  const defaultProps = {
    editions: mockEditions,
    apiBook: undefined,
    defaultCoverUrl: 'https://example.com/default-cover.jpg',
    defaultTitle: 'Default Book Title',
    onEditionSaved: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseUser.mockReturnValue({ data: mockUser });
    mockRateBook.mockResolvedValue({});
  });

  it('should initialize with no selected edition when no userData is provided', () => {
    const { result } = renderHook(() =>
      useEditionSelection({
        ...defaultProps,
        apiBook: mockApiBookWithoutUserData,
      })
    );

    expect(result.current.selectedEdition).toBeNull();
    expect(result.current.hasUserSelectedEdition).toBe(false);
    expect(result.current.displayTitle).toBe('Default Book Title');
    expect(result.current.displayImage).toBe(
      'https://example.com/default-cover.jpg'
    );
    expect(result.current.isSaving).toBe(false);
  });

  it('should initialize with selected edition when userData has editionId', () => {
    const { result } = renderHook(() =>
      useEditionSelection({
        ...defaultProps,
        apiBook: mockApiBookWithUserData,
      })
    );

    expect(result.current.selectedEdition).toEqual(mockEditions[0]);
    expect(result.current.hasUserSelectedEdition).toBe(true);
    expect(result.current.displayTitle).toBe('Spanish Edition');
    expect(result.current.displayImage).toBe(
      'https://example.com/spanish-cover.jpg'
    );
  });

  it('should save book with edition when user selects edition and has no userData', async () => {
    const onEditionSaved = jest.fn();
    const { result } = renderHook(() =>
      useEditionSelection({
        ...defaultProps,
        apiBook: mockApiBookWithoutUserData,
        onEditionSaved,
      })
    );

    await act(async () => {
      await result.current.setSelectedEdition(mockEditions[0]);
    });

    expect(mockRateBook).toHaveBeenCalledWith(
      expect.any(FormData),
      'testuser',
      undefined
    );
    expect(onEditionSaved).toHaveBeenCalledWith(
      true,
      'Book saved with selected edition!'
    );
    expect(result.current.selectedEdition).toEqual(mockEditions[0]);
  });

  it('should update edition when user already has book saved', async () => {
    const onEditionSaved = jest.fn();
    const { result } = renderHook(() =>
      useEditionSelection({
        ...defaultProps,
        apiBook: mockApiBookWithUserData,
        onEditionSaved,
      })
    );

    await act(async () => {
      await result.current.setSelectedEdition(mockEditions[1]);
    });

    expect(mockRateBook).toHaveBeenCalledWith(
      expect.any(FormData),
      'testuser',
      mockApiBookWithUserData.userData
    );
    expect(onEditionSaved).toHaveBeenCalledWith(
      true,
      'Edition updated successfully!'
    );
    expect(result.current.selectedEdition).toEqual(mockEditions[1]);
  });

  it('should handle errors when saving edition', async () => {
    const onEditionSaved = jest.fn();
    mockRateBook.mockRejectedValue(new Error('Save failed'));

    const { result } = renderHook(() =>
      useEditionSelection({
        ...defaultProps,
        apiBook: mockApiBookWithoutUserData,
        onEditionSaved,
      })
    );

    await act(async () => {
      await result.current.setSelectedEdition(mockEditions[0]);
    });

    expect(onEditionSaved).toHaveBeenCalledWith(
      false,
      'Error saving edition. Please try again.'
    );
  });

  it('should not save when user is not logged in', async () => {
    mockUseUser.mockReturnValue({ data: null });
    const onEditionSaved = jest.fn();

    const { result } = renderHook(() =>
      useEditionSelection({
        ...defaultProps,
        apiBook: mockApiBookWithoutUserData,
        onEditionSaved,
      })
    );

    await act(async () => {
      await result.current.setSelectedEdition(mockEditions[0]);
    });

    expect(mockRateBook).not.toHaveBeenCalled();
    expect(onEditionSaved).not.toHaveBeenCalled();
  });

  it('should manage isSaving state correctly', async () => {
    const { result } = renderHook(() =>
      useEditionSelection({
        ...defaultProps,
        apiBook: mockApiBookWithoutUserData,
      })
    );

    expect(result.current.isSaving).toBe(false);

    const savePromise = act(async () => {
      await result.current.setSelectedEdition(mockEditions[0]);
    });

    await savePromise;
    expect(result.current.isSaving).toBe(false);
  });
});
import { useEditionSelection } from './useEditionSelection';
import { Edition } from '@/domain/book.model';
import { ApiBook } from '@/domain/apiBook.model';
import { EStatus } from '@/utils/constants/EStatus';

// Mock de los helpers
jest.mock('@/utils/bookEditionHelpers', () => ({
  findEditionById: jest.fn((editions, id) => {
    if (!editions || !id) return null;
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    return (
      editions.find((edition: Edition) => edition.id === numericId) || null
    );
  }),
  getDisplayDataFromEdition: jest.fn(
    (edition, fallbackTitle, fallbackImageUrl) => ({
      title: edition?.title || fallbackTitle,
      imageUrl: edition?.cached_image?.url || fallbackImageUrl,
    })
  ),
}));

describe('useEditionSelection', () => {
  const mockUser = {
    id: 'user1',
    username: 'testuser',
  };

  const mockEditions: Edition[] = [
    {
      id: 1,
      book_id: 1,
      title: 'Spanish Edition',
      pages: 300,
      cached_image: {
        id: 1,
        url: 'https://example.com/spanish-cover.jpg',
        color: '#FF0000',
        width: 300,
        height: 450,
        color_name: 'red',
      },
      language: {
        language: 'Spanish',
        id: 1,
      },
    },
    {
      id: 2,
      book_id: 1,
      title: 'English Edition',
      pages: 280,
      cached_image: {
        id: 2,
        url: 'https://example.com/english-cover.jpg',
        color: '#0000FF',
        width: 300,
        height: 450,
        color_name: 'blue',
      },
      language: {
        language: 'English',
        id: 2,
      },
    },
  ];

  const mockApiBookWithUserData: ApiBook = {
    id: '1',
    averageRating: 4.5,
    userData: {
      userId: 'user1',
      status: EStatus.READING,
      rating: 4,
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      progress: 50,
      editionId: '1',
    },
  };

  const mockApiBookWithoutUserData: ApiBook = {
    id: '1',
    averageRating: 4.5,
  };

  const defaultProps = {
    editions: mockEditions,
    apiBook: undefined,
    defaultCoverUrl: 'https://example.com/default-cover.jpg',
    defaultTitle: 'Default Book Title',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with no selected edition when no userData is provided', () => {
    const { result } = renderHook(() =>
      useEditionSelection({
        ...defaultProps,
        apiBook: mockApiBookWithoutUserData,
      })
    );

    expect(result.current.selectedEdition).toBeNull();
    expect(result.current.hasUserSelectedEdition).toBe(false);
    expect(result.current.displayTitle).toBe('Default Book Title');
    expect(result.current.displayImage).toBe(
      'https://example.com/default-cover.jpg'
    );
  });

  it('should initialize with selected edition when userData has editionId', () => {
    const { result } = renderHook(() =>
      useEditionSelection({
        ...defaultProps,
        apiBook: mockApiBookWithUserData,
      })
    );

    expect(result.current.selectedEdition).toEqual(mockEditions[0]);
    expect(result.current.hasUserSelectedEdition).toBe(true);
    expect(result.current.displayTitle).toBe('Spanish Edition');
    expect(result.current.displayImage).toBe(
      'https://example.com/spanish-cover.jpg'
    );
  });

  it('should handle undefined apiBook gracefully', () => {
    const { result } = renderHook(() =>
      useEditionSelection({
        ...defaultProps,
        apiBook: undefined,
      })
    );

    expect(result.current.selectedEdition).toBeNull();
    expect(result.current.hasUserSelectedEdition).toBe(false);
    expect(result.current.displayTitle).toBe('Default Book Title');
    expect(result.current.displayImage).toBe(
      'https://example.com/default-cover.jpg'
    );
  });

  it('should handle empty editions array', () => {
    const { result } = renderHook(() =>
      useEditionSelection({
        ...defaultProps,
        editions: [],
        apiBook: mockApiBookWithUserData,
      })
    );

    expect(result.current.selectedEdition).toBeNull();
    expect(result.current.hasUserSelectedEdition).toBe(true);
    expect(result.current.displayTitle).toBe('Default Book Title');
    expect(result.current.displayImage).toBe(
      'https://example.com/default-cover.jpg'
    );
  });

  it('should handle invalid editionId in userData', () => {
    const apiBookWithInvalidEdition: ApiBook = {
      ...mockApiBookWithUserData,
      userData: {
        ...mockApiBookWithUserData.userData!,
        editionId: '999', // ID que no existe en las ediciones
      },
    };

    const { result } = renderHook(() =>
      useEditionSelection({
        ...defaultProps,
        apiBook: apiBookWithInvalidEdition,
      })
    );

    expect(result.current.selectedEdition).toBeNull();
    expect(result.current.hasUserSelectedEdition).toBe(true);
    expect(result.current.displayTitle).toBe('Default Book Title');
    expect(result.current.displayImage).toBe(
      'https://example.com/default-cover.jpg'
    );
  });

  it('should allow manual edition selection for user without saved book', async () => {
    mockUseUser.mockReturnValue({ data: mockUser });

    const { result } = renderHook(() =>
      useEditionSelection({
        ...defaultProps,
        apiBook: mockApiBookWithoutUserData,
      })
    );

    // Inicialmente no hay edición seleccionada
    expect(result.current.selectedEdition).toBeNull();

    // Seleccionar manualmente una edición (esto ahora es asíncrono y guarda el libro)
    await act(async () => {
      await result.current.setSelectedEdition(mockEditions[1]);
    });

    expect(result.current.selectedEdition).toEqual(mockEditions[1]);
    expect(mockRateBook).toHaveBeenCalled();
  });

  it('should allow manual edition selection without saving when user not logged in', async () => {
    mockUseUser.mockReturnValue({ data: null });

    const { result } = renderHook(() =>
      useEditionSelection({
        ...defaultProps,
        apiBook: mockApiBookWithoutUserData,
      })
    );

    // Inicialmente no hay edición seleccionada
    expect(result.current.selectedEdition).toBeNull();

    // Seleccionar manualmente una edición (no debería guardar porque no hay usuario)
    await act(async () => {
      await result.current.setSelectedEdition(mockEditions[1]);
    });

    // La edición no debe cambiar porque no hay usuario logueado
    expect(result.current.selectedEdition).toBeNull();
    expect(mockRateBook).not.toHaveBeenCalled();
  });
});
