/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import deleteBookFromHallOfFame from '@/app/actions/book/halloffame/deleteBookFromHallOfFame';
import fetchHallOfFame from '@/app/actions/book/halloffame/fetchHallOfFame';
import setHallOfFameBook from '@/app/actions/book/halloffame/setHallOfFameBook';
import Book from '@/domain/book.model';
import { hallOfFame } from '@/domain/hallOfFame.model';
import useHardcoverBatch from '@/hooks/books/useHardcoverBatch';
import { useMemo, useState } from 'react';
import useSWR, { mutate } from 'swr';

interface useHallOfFameProps {
  data: hallOfFame | null;
  isLoading: boolean;
  error: Error | null;
  quote: string;
  books?: Book[];
  isLoadingAddToHallOfFame: boolean;
  isUpdatedAddToHallOfFame: boolean;
  isErrorAddToHallOfFame: boolean;
  setIsLoadingToAddHallOfFame: (isLoading: boolean) => void;
  setIsUpdatedAddToHallOfFame: (isUpdated: boolean) => void;
  setIsErrorAddToHallOfFame: (isError: boolean) => void;
  handleAddBookToHallOfFame: (bookId: string) => Promise<void>;
  isLoadingDeleteToHallOfFame: boolean;
  isUpdatedDeleteToHallOfFame: boolean;
  isErrorDeleteToHallOfFame: boolean;
  setIsLoadingToDeleteHallOfFame: (isLoading: boolean) => void;
  setIsUpdatedDeleteToHallOfFame: (isUpdated: boolean) => void;
  setIsErrorDeleteToHallOfFame: (isError: boolean) => void;
  handleDeleteBookToHallOfFame: (bookId: string) => Promise<void>;
}

export function useHallOfFame(userId: string): useHallOfFameProps {
  const [isLoadingAddToHallOfFame, setIsLoadingToAddHallOfFame] =
    useState(false);
  const [isUpdatedAddToHallOfFame, setIsUpdatedAddToHallOfFame] =
    useState(false);
  const [isErrorAddToHallOfFame, setIsErrorAddToHallOfFame] = useState(false);

  const [isLoadingDeleteToHallOfFame, setIsLoadingToDeleteHallOfFame] =
    useState(false);
  const [isUpdatedDeleteToHallOfFame, setIsUpdatedDeleteToHallOfFame] =
    useState(false);
  const [isErrorDeleteToHallOfFame, setIsErrorDeleteToHallOfFame] =
    useState(false);

  const { data, isLoading, error } = useSWR(
    `/api/public/accounts/halloffame/${userId}`,
    () => fetchHallOfFame(userId)
  );

  const quote = data?.quote || '';
  // Extraer ids de los libros (pueden venir como string o como objeto con id)
  const rawBooks = data?.books || [];
  const ids = useMemo(
    () =>
      rawBooks
        .map((b: any) => (typeof b === 'string' ? b : b?.id))
        .filter(Boolean),
    [rawBooks]
  );
  const { data: hardcoverData, isLoading: isLoadingHardcover } =
    useHardcoverBatch(ids);
  // Si hay hardcoverData úsalo, si no, cae a rawBooks
  const books = (
    hardcoverData && hardcoverData.length > 0 ? hardcoverData : rawBooks
  ) as Book[];

  const handleAddBookToHallOfFame = async (bookId: string): Promise<void> => {
    setIsLoadingToAddHallOfFame(true);
    setIsUpdatedAddToHallOfFame(false);
    setIsErrorAddToHallOfFame(false);

    try {
      const formData = new FormData();
      formData.append('bookId', bookId);

      // setHallOfFameBook debe devolver hallOfFame o null
      void (await setHallOfFameBook(formData));

      setIsUpdatedAddToHallOfFame(true);
      await mutate(`/api/public/accounts/halloffame/${userId}`);
    } catch (error) {
      console.error('Error adding book to Hall of Fame:', error);
      setIsErrorAddToHallOfFame(true);
    } finally {
      setIsLoadingToAddHallOfFame(false);
    }
  };

  const handleDeleteBookToHallOfFame = async (
    bookId: string
  ): Promise<void> => {
    setIsLoadingToDeleteHallOfFame(true);
    setIsUpdatedDeleteToHallOfFame(false);
    setIsErrorDeleteToHallOfFame(false);

    try {
      const formData = new FormData();
      formData.append('bookId', bookId);

      await deleteBookFromHallOfFame(formData);

      setIsUpdatedDeleteToHallOfFame(true);
      await mutate(`/api/public/accounts/halloffame/${userId}`);
    } catch (error) {
      console.error('Error deleting book from Hall of Fame:', error);
      setIsErrorDeleteToHallOfFame(true);
    } finally {
      setIsLoadingToDeleteHallOfFame(false);
    }
  };

  return {
    data: data || null,
    isLoading: isLoading || isLoadingHardcover,
    error,
    quote,
    books,
    handleAddBookToHallOfFame,
    handleDeleteBookToHallOfFame,
    isLoadingAddToHallOfFame,
    isUpdatedAddToHallOfFame,
    isErrorAddToHallOfFame,
    setIsLoadingToAddHallOfFame,
    setIsUpdatedAddToHallOfFame,
    setIsErrorAddToHallOfFame,
    isLoadingDeleteToHallOfFame,
    isUpdatedDeleteToHallOfFame,
    isErrorDeleteToHallOfFame,
    setIsLoadingToDeleteHallOfFame,
    setIsUpdatedDeleteToHallOfFame,
    setIsErrorDeleteToHallOfFame,
  };
}
