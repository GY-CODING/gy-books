import { useState, useEffect } from 'react';
import { BookRatingProps } from '../types';
import { formatPercent, formatProgress } from '@/domain/userData.model';
import { EStatus } from '@/utils/constants/EStatus';
import rateBook from '@/app/actions/book/rateBook';
import { useUser } from '@/hooks/useUser';
import { useRemoveBook } from '@/hooks/useRemoveBook';

export function useBookRatingState(props: BookRatingProps) {
  const { bookId, apiBook, mutate } = props;
  const { data: user, isLoading: isUserLoading } = useUser();
  const { handleDeleteBook, isLoading: isDeleteLoading } = useRemoveBook();
  const [tempRating, setTempRating] = useState<number>(0);
  const [tempStatus, setTempStatus] = useState<EStatus>(EStatus.WANT_TO_READ);
  const [tempStartDate, setTempStartDate] = useState<string>('');
  const [tempEndDate, setTempEndDate] = useState<string>('');
  const [tempProgress, setTempProgress] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProgressPercent, setIsProgressPercent] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (apiBook && apiBook.userData) {
      setTempRating(apiBook.userData.rating || 0);
      setTempStatus(apiBook.userData.status ?? EStatus.WANT_TO_READ);
      setTempStartDate(apiBook.userData.startDate || '');
      setTempEndDate(apiBook.userData.endDate || '');
      setTempProgress(
        formatProgress(apiBook.userData.progress || 0) as unknown as number
      );
      setIsProgressPercent(
        apiBook.userData.progress !== undefined &&
          apiBook.userData.progress <= 1
      );
    } else {
      setTempRating(0);
      setTempStatus(EStatus.RATE);
      setTempStartDate('');
      setTempEndDate('');
    }
    if (apiBook?.userData?.status === EStatus.READ) {
      apiBook.userData.progress = 1;
      setIsProgressPercent(true);
    }
  }, [apiBook]);

  const handleApply = async () => {
    if (!user || isSubmitting) return;
    setIsSubmitting(true);
    try {
      let progressValue = tempProgress as unknown as number;
      if (isProgressPercent) {
        progressValue = formatPercent(progressValue);
      }
      const formData = new FormData();
      formData.append('bookId', bookId);
      formData.append('rating', tempRating.toString());
      formData.append('startDate', tempStartDate);
      formData.append('endDate', tempEndDate);
      formData.append('progress', progressValue as unknown as string);
      const statusToSave = tempStatus;
      formData.append('status', statusToSave.toString());
      const updatedApiBook = await rateBook(
        formData,
        user.username,
        apiBook?.userData
      );
      if (updatedApiBook && updatedApiBook.userData) {
        setTempRating(updatedApiBook.userData.rating || 0);
        setTempStatus(updatedApiBook.userData.status ?? EStatus.WANT_TO_READ);
        setTempStartDate(updatedApiBook.userData.startDate || '');
        setTempEndDate(updatedApiBook.userData.endDate || '');
        setTempProgress(
          formatProgress(
            updatedApiBook.userData.progress || 0
          ) as unknown as number
        );
      }
      if (mutate) {
        await mutate(updatedApiBook, { revalidate: false });
      }
      setAnchorEl(null);
      setDrawerOpen(false);
    } catch (error) {
      console.error('Error applying changes:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    state: {
      tempRating,
      tempStatus,
      tempStartDate,
      tempEndDate,
      tempProgress,
      isSubmitting,
      isProgressPercent,
    },
    handlers: {
      setTempRating,
      setTempStatus,
      setTempStartDate,
      setTempEndDate,
      setTempProgress,
      setIsProgressPercent,
      handleApply,
    },
    anchorEl,
    setAnchorEl,
    drawerOpen,
    setDrawerOpen,
    user,
    isUserLoading,
    isDeleteLoading,
    handleDeleteBook,
  };
}
