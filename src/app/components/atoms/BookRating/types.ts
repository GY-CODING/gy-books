import { ApiBook } from '@/domain/apiBook.model';
import { Edition } from '@/domain/HardcoverBook';
import { EBookStatus } from '@gycoding/nebula';

export interface BookRatingProps {
  bookId: string;
  apiBook: ApiBook | null;
  isRatingLoading: boolean;
  mutate?: (
    data?: ApiBook | null,
    options?: { revalidate?: boolean }
  ) => Promise<ApiBook | null | undefined>;
  isLoggedIn: boolean;
  selectedEdition?: Edition | null;
}

export interface BookRatingState {
  tempRating: number;
  tempStatus: EBookStatus;
  tempStartDate: string;
  tempEndDate: string;
  tempProgress: number;
  isSubmitting: boolean;
  isProgressPercent: boolean;
  tempReview: string;
}

export interface BookRatingHandlers {
  setTempRating: (rating: number) => void;
  setTempStatus: (status: EBookStatus) => void;
  setTempStartDate: (date: string) => void;
  setTempEndDate: (date: string) => void;
  setTempProgress: (progress: number) => void;
  setIsProgressPercent: (isPercent: boolean) => void;
  setTempReview: (review: string) => void;
  handleApply: () => Promise<void>;
}
