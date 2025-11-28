import HardcoverBook from '@/domain/HardcoverBook';
import { EBookStatus } from '@gycoding/nebula';

export interface ProfileFilters {
  status: EBookStatus | null;
  author: string;
  series: string;
  rating: number;
  search: string;
  orderBy: string;
  orderDirection: 'asc' | 'desc';
}

export interface ProfileFilterOptions {
  statusOptions: Array<{ label: string; value: EBookStatus }>;
  authorOptions: string[];
  seriesOptions: string[];
}

export interface ProfileState {
  tab: number;
  isEditingBiography: boolean;
  biography: string;
  books: HardcoverBook[];
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
  books: HardcoverBook[];
  hasMore: boolean;
  loading: boolean;
  page: number;
}

export interface ProfilePaginationActions {
  loadMoreBooks: () => Promise<void>;
  resetPagination: () => void;
}

export interface ProfileFiltersActions {
  handleStatusFilterChange: (status: EBookStatus | null) => void;
  handleAuthorFilterChange: (author: string) => void;
  handleSeriesFilterChange: (series: string) => void;
  handleRatingFilterChange: (rating: number) => void;
  handleSearchChange: (search: string) => void;
  handleOrderByChange: (orderBy: string) => void;
  handleOrderDirectionChange: (direction: 'asc' | 'desc') => void;
}
