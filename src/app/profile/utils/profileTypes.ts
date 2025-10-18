import { EStatus } from '@/utils/constants/EStatus';
import Book from '@/domain/book.model';

export interface ProfileFilters {
  status: EStatus | null;
  author: string;
  series: string;
  rating: number;
  search: string;
  orderBy: string;
  orderDirection: 'asc' | 'desc';
}

export interface ProfileFilterOptions {
  statusOptions: Array<{ label: string; value: EStatus }>;
  authorOptions: string[];
  seriesOptions: string[];
}

export interface ProfileState {
  tab: number;
  isEditingBiography: boolean;
  biography: string;
  books: Book[];
  hasMore: boolean;
  loading: boolean;
}

export interface ProfileBiographyState {
  isEditing: boolean;
  value: string;
  isLoading: boolean;
  isUpdated: boolean;
  isError: boolean;
}

export interface ProfilePaginationState {
  books: Book[];
  hasMore: boolean;
  loading: boolean;
  page: number;
}

export interface ProfilePaginationActions {
  loadMoreBooks: () => Promise<void>;
  resetPagination: () => void;
}

export interface ProfileFiltersActions {
  handleStatusFilterChange: (status: EStatus | null) => void;
  handleAuthorFilterChange: (author: string) => void;
  handleSeriesFilterChange: (series: string) => void;
  handleRatingFilterChange: (rating: number) => void;
  handleSearchChange: (search: string) => void;
  handleOrderByChange: (orderBy: string) => void;
  handleOrderDirectionChange: (direction: 'asc' | 'desc') => void;
}
