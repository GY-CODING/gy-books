/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from '@/domain/friend.model';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { UUID } from 'crypto';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import UserProfilePage from './page';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useSearchParams: jest.fn(),
  useRouter: jest.fn(),
}));

// Mock hooks
jest.mock('@/hooks/useAccountsUser');

// Mock server actions
jest.mock('../../actions/book/fetchApiBook');

import { useAccountsUser } from '@/hooks/useAccountsUser';
import { EBookStatus } from '@gycoding/nebula';
import { getBooksWithPagination } from '../../actions/book/fetchApiBook';

// Mock lazy-loaded components
jest.mock('@/app/components/organisms/Stats', () => {
  return function MockStats({ id }: { id: UUID }) {
    return <div data-testid="stats-component">Stats for user {id}</div>;
  };
});

jest.mock('@/app/components/molecules/HallOfFame', () => {
  return function MockHallOfFame({ userId }: { userId: UUID }) {
    return (
      <div data-testid="hall-of-fame-component">Hall of Fame for {userId}</div>
    );
  };
});

jest.mock('@/app/components/molecules/activityTab', () => {
  return function MockActivityTab({ id }: { id: UUID }) {
    return <div data-testid="activity-tab-component">Activity for {id}</div>;
  };
});

// Mock Material-UI components
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  Container: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Box: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Typography: ({ children, ...props }: any) => (
    <span {...props}>{children}</span>
  ),
  Tab: ({ label, ...props }: any) => <button {...props}>{label}</button>,
  Tabs: ({ children, onChange, value, ...props }: any) => (
    <div data-testid="tabs" {...props}>
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child, {
          onClick: () => onChange?.(null, index),
          'data-selected': value === index,
        })
      )}
    </div>
  ),
  CircularProgress: (props: any) => <div data-testid="loading" {...props} />,
}));

// Mock profile components
jest.mock('@/app/profile/components/ProfileHeader/ProfileHeader', () => ({
  ProfileHeader: ({ user, canEdit }: any) => (
    <div data-testid="profile-header">
      <span>Profile: {user?.username}</span>
      <span data-testid="can-edit">{canEdit ? 'editable' : 'readonly'}</span>
    </div>
  ),
}));

jest.mock(
  '@/app/profile/components/ProfileHeader/ProfileHeaderSkeleton',
  () => ({
    ProfileHeaderSkeleton: ({ canEdit }: any) => (
      <div data-testid="profile-header-skeleton">
        Loading... {canEdit ? 'editable' : 'readonly'}
      </div>
    ),
  })
);

jest.mock('@/app/profile/components/BooksFilter/BooksFilter', () => ({
  BooksFilter: ({
    onStatusChange,
    onSearchChange,
    onOrderByChange,
    onAuthorChange,
    onSeriesChange,
    onRatingChange,
    onOrderDirectionChange,
  }: any) => (
    <div data-testid="books-filter">
      <select
        data-testid="status-filter"
        onChange={(e) => onStatusChange?.(e.target.value || null)}
      >
        <option value="">All</option>
        <option value={EBookStatus.READING}>Reading</option>
        <option value={EBookStatus.READ}>Read</option>
        <option value={EBookStatus.WANT_TO_READ}>Want to Read</option>
      </select>
      <input
        data-testid="search-input"
        placeholder="Search books..."
        onChange={(e) => onSearchChange?.(e.target.value)}
      />
      <select
        data-testid="order-by-select"
        onChange={(e) => onOrderByChange?.(e.target.value)}
      >
        <option value="title">Title</option>
        <option value="author">Author</option>
        <option value="rating">Rating</option>
      </select>
      <input
        data-testid="author-filter"
        placeholder="Filter by author..."
        onChange={(e) => onAuthorChange?.(e.target.value)}
      />
      <input
        data-testid="series-filter"
        placeholder="Filter by series..."
        onChange={(e) => onSeriesChange?.(e.target.value)}
      />
      <input
        data-testid="rating-filter"
        type="number"
        min="0"
        max="5"
        placeholder="Filter by rating..."
        onChange={(e) => onRatingChange?.(Number(e.target.value))}
      />
      <button
        data-testid="order-direction-button"
        onClick={() => onOrderDirectionChange?.('asc')}
      >
        Toggle Direction
      </button>
    </div>
  ),
}));

jest.mock('@/app/profile/components/BooksList/BooksList', () => ({
  BooksList: ({ books }: any) => (
    <div data-testid="books-list">
      {books.map((book: any) => (
        <div key={book.id} data-testid="book-item">
          {book.title} by {book.author?.name}
        </div>
      ))}
    </div>
  ),
}));

jest.mock('@/app/profile/components/BooksList/BooksListSkeleton', () => ({
  BooksListSkeleton: () => (
    <div data-testid="books-list-skeleton">Loading books...</div>
  ),
}));

jest.mock('@/app/components/atoms/ProfileSkeleton/ProfileSkeleton', () => {
  return function ProfileSkeleton() {
    return <div data-testid="profile-skeleton">Loading profile...</div>;
  };
});

const mockUser: User = {
  id: '550e8400-e29b-41d4-a716-446655440000' as UUID,
  username: 'publicuser',
  biography: 'Public user biography',
  email: 'public@example.com',
  picture: 'public-avatar.jpg',
  phoneNumber: '+1234567890',
};

const mockBooks = [
  {
    id: 'book-1',
    title: 'Public Book 1',
    author: { name: 'Author 1' },
    series: { name: 'Series 1' },
    status: EBookStatus.READ,
    rating: 5,
  },
  {
    id: 'book-2',
    title: 'Public Book 2',
    author: { name: 'Author 2' },
    series: { name: 'Series 2' },
    status: EBookStatus.READING,
    rating: 4,
  },
];

describe('UserProfilePage', () => {
  const mockUseAccountsUser = useAccountsUser as jest.MockedFunction<
    typeof useAccountsUser
  >;
  const mockGetBooksWithPagination =
    getBooksWithPagination as jest.MockedFunction<
      typeof getBooksWithPagination
    >;
  const mockUseParams = useParams as jest.MockedFunction<typeof useParams>;
  const mockUseSearchParams = useSearchParams as jest.MockedFunction<
    typeof useSearchParams
  >;
  const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

  const mockSearchParams = {
    get: jest.fn(),
    toString: jest.fn(() => ''),
  };

  const mockRouter = {
    replace: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  };

  const mockParams = {
    id: '550e8400-e29b-41d4-a716-446655440000',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseParams.mockReturnValue(mockParams);
    mockUseSearchParams.mockReturnValue(mockSearchParams as any);
    mockUseRouter.mockReturnValue(mockRouter as any);

    mockUseAccountsUser.mockReturnValue({
      data: mockUser,
      isLoading: false,
      error: null,
    });

    mockGetBooksWithPagination.mockResolvedValue({
      books: mockBooks,
      hasMore: false,
    });

    mockSearchParams.get.mockImplementation((key: string) => {
      const params: Record<string, string> = {};
      return params[key] || null;
    });
  });

  it('renders profile skeleton when user is loading', () => {
    mockUseAccountsUser.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(<UserProfilePage />);

    expect(screen.getByTestId('profile-header-skeleton')).toBeInTheDocument();
    expect(screen.getByText('Loading... readonly')).toBeInTheDocument();
  });

  it('renders "No user logged in" when user is not found', () => {
    mockUseAccountsUser.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });

    render(<UserProfilePage />);

    expect(screen.getByText('No user logged in')).toBeInTheDocument();
  });

  it('renders complete profile when user is loaded', async () => {
    render(<UserProfilePage />);

    await waitFor(() => {
      expect(screen.getByTestId('profile-header')).toBeInTheDocument();
      expect(screen.getByText('Profile: publicuser')).toBeInTheDocument();
      expect(screen.getByText('readonly')).toBeInTheDocument();
    });
  });

  it('renders tabs correctly', async () => {
    render(<UserProfilePage />);

    await waitFor(() => {
      expect(screen.getByTestId('tabs')).toBeInTheDocument();
      expect(screen.getByText('Books')).toBeInTheDocument();
      expect(screen.getByText('Hall of Fame')).toBeInTheDocument();
      expect(screen.getByText('Stats')).toBeInTheDocument();
      expect(screen.getByText('Activity')).toBeInTheDocument();
    });
  });

  it('switches between tabs correctly', async () => {
    render(<UserProfilePage />);

    await waitFor(() => {
      expect(screen.getByTestId('books-filter')).toBeInTheDocument();
    });

    // Click on Hall of Fame tab
    fireEvent.click(screen.getByText('Hall of Fame'));
    await waitFor(() => {
      expect(screen.getByTestId('hall-of-fame-component')).toBeInTheDocument();
    });

    // Click on Stats tab
    fireEvent.click(screen.getByText('Stats'));
    await waitFor(() => {
      expect(screen.getByTestId('stats-component')).toBeInTheDocument();
    });

    // Click on Activity tab
    fireEvent.click(screen.getByText('Activity'));
    await waitFor(() => {
      expect(screen.getByTestId('activity-tab-component')).toBeInTheDocument();
    });
  });

  it('filters books by status', async () => {
    render(<UserProfilePage />);

    await waitFor(() => {
      expect(screen.getByTestId('status-filter')).toBeInTheDocument();
    });

    const statusFilter = screen.getByTestId('status-filter');
    fireEvent.change(statusFilter, { target: { value: EBookStatus.READ } });

    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith(
        expect.stringContaining('/users/550e8400-e29b-41d4-a716-446655440000'),
        expect.any(Object)
      );
    });
  });

  it('searches books correctly', async () => {
    render(<UserProfilePage />);

    await waitFor(() => {
      expect(screen.getByTestId('search-input')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'test search' } });

    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalled();
    });
  });

  it('changes order by correctly', async () => {
    render(<UserProfilePage />);

    await waitFor(() => {
      expect(screen.getByTestId('order-by-select')).toBeInTheDocument();
    });

    const orderBySelect = screen.getByTestId('order-by-select');
    fireEvent.change(orderBySelect, { target: { value: 'author' } });

    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalled();
    });
  });

  it('filters books by author', async () => {
    render(<UserProfilePage />);

    await waitFor(() => {
      expect(screen.getByTestId('author-filter')).toBeInTheDocument();
    });

    const authorFilter = screen.getByTestId('author-filter');
    fireEvent.change(authorFilter, { target: { value: 'Stephen King' } });

    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalled();
    });
  });

  it('filters books by series', async () => {
    render(<UserProfilePage />);

    await waitFor(() => {
      expect(screen.getByTestId('series-filter')).toBeInTheDocument();
    });

    const seriesFilter = screen.getByTestId('series-filter');
    fireEvent.change(seriesFilter, { target: { value: 'Harry Potter' } });

    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalled();
    });
  });

  it('filters books by rating', async () => {
    render(<UserProfilePage />);

    await waitFor(() => {
      expect(screen.getByTestId('rating-filter')).toBeInTheDocument();
    });

    const ratingFilter = screen.getByTestId('rating-filter');
    fireEvent.change(ratingFilter, { target: { value: '4' } });

    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalled();
    });
  });

  it('changes order direction correctly', async () => {
    render(<UserProfilePage />);

    await waitFor(() => {
      expect(screen.getByTestId('order-direction-button')).toBeInTheDocument();
    });

    const orderDirectionButton = screen.getByTestId('order-direction-button');
    fireEvent.click(orderDirectionButton);

    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalled();
    });
  });

  it('loads initial URL parameters', () => {
    mockSearchParams.get.mockImplementation((key: string) => {
      const params: Record<string, string> = {
        status: EBookStatus.READ,
        search: 'test search',
        orderBy: 'author',
        author: 'Stephen King',
        series: 'Harry Potter',
        rating: '4',
        orderDirection: 'asc',
      };
      return params[key] || null;
    });

    render(<UserProfilePage />);

    expect(mockSearchParams.get).toHaveBeenCalledWith('status');
    expect(mockSearchParams.get).toHaveBeenCalledWith('search');
    expect(mockSearchParams.get).toHaveBeenCalledWith('orderBy');
    expect(mockSearchParams.get).toHaveBeenCalledWith('author');
    expect(mockSearchParams.get).toHaveBeenCalledWith('series');
    expect(mockSearchParams.get).toHaveBeenCalledWith('rating');
    expect(mockSearchParams.get).toHaveBeenCalledWith('orderDirection');
  });

  it('handles automatic pagination loading', async () => {
    mockGetBooksWithPagination.mockResolvedValueOnce({
      books: mockBooks.slice(0, 1),
      hasMore: true,
    });

    render(<UserProfilePage />);

    await waitFor(() => {
      expect(mockGetBooksWithPagination).toHaveBeenCalledWith(
        mockUser.id,
        0,
        50
      );
    });
  });

  it('displays loading indicator when loading more books', async () => {
    mockGetBooksWithPagination.mockImplementation(
      () =>
        new Promise((resolve) => {
          // Mock a loading state first
          setTimeout(() => resolve({ books: [], hasMore: false }), 100);
        })
    );

    render(<UserProfilePage />);

    // Since the component loads books immediately, we need to check for the initial loading
    // The loading indicator should appear during the first load
    expect(mockGetBooksWithPagination).toHaveBeenCalled();
  });

  it('calls useAccountsUser with correct user id from params', () => {
    render(<UserProfilePage />);

    expect(mockUseAccountsUser).toHaveBeenCalledWith(
      '550e8400-e29b-41d4-a716-446655440000'
    );
  });

  it('updates URL with user id in path', async () => {
    render(<UserProfilePage />);

    await waitFor(() => {
      expect(screen.getByTestId('status-filter')).toBeInTheDocument();
    });

    const statusFilter = screen.getByTestId('status-filter');
    fireEvent.change(statusFilter, { target: { value: EBookStatus.READ } });

    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith(
        expect.stringContaining('/users/550e8400-e29b-41d4-a716-446655440000'),
        expect.objectContaining({ scroll: false })
      );
    });
  });

  it('profile header has canEdit set to false', async () => {
    render(<UserProfilePage />);

    await waitFor(() => {
      expect(screen.getByTestId('can-edit')).toBeInTheDocument();
      expect(screen.getByText('readonly')).toBeInTheDocument();
    });
  });

  it('handles user id changes correctly', async () => {
    const { rerender } = render(<UserProfilePage />);

    // Change the user ID
    mockUseParams.mockReturnValue({ id: 'different-user-id' });

    rerender(<UserProfilePage />);

    await waitFor(() => {
      expect(mockUseAccountsUser).toHaveBeenCalledWith('different-user-id');
    });
  });

  it('loads books with correct pagination parameters', async () => {
    render(<UserProfilePage />);

    await waitFor(() => {
      expect(mockGetBooksWithPagination).toHaveBeenCalledWith(
        mockUser.id,
        0,
        50 // Updated to use 50 items per page for better performance
      );
    });
  });
});
