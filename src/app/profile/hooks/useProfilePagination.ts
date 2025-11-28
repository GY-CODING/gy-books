import { useState, useCallback, useRef, useEffect } from 'react';
import Book from '@/domain/book.model';
import { UUID } from 'crypto';
import { getBooksWithPagination } from '../../actions/book/fetchApiBook';
import {
  ProfilePaginationState,
  ProfilePaginationActions,
} from '../utils/profileTypes';
import { ProfileBookHelpers } from '../utils/profileHelpers';

export function useProfilePagination(
  userId: UUID | undefined
): ProfilePaginationState & ProfilePaginationActions {
  const [books, setBooks] = useState<Book[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const pageRef = useRef(0);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);

  // Sincronizar refs con estado
  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  const loadMoreBooks = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current || !userId) return;

    setLoading(true);
    const currentPage = pageRef.current;

    try {
      const res = await getBooksWithPagination(userId, currentPage, 50);

      if (res && Array.isArray(res.books) && res.books.length > 0) {
        setBooks((prev) => {
          const allBooks = [...prev, ...res.books];
          const uniqueBooks = ProfileBookHelpers.removeDuplicateBooks(allBooks);
          return uniqueBooks;
        });
        pageRef.current = currentPage + 1;
        setHasMore(!!res.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading books:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const resetPagination = useCallback(() => {
    pageRef.current = 0;
    setBooks([]);
    setHasMore(true);
    setLoading(false);
  }, []);

  // Cargar libros iniciales cuando cambie el userId
  useEffect(() => {
    if (!userId) return;

    // Reset pagination
    pageRef.current = 0;
    setBooks([]);
    setHasMore(true);
    setLoading(false);

    // Load initial books
    loadMoreBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]); // Solo dependemos del userId para evitar loops infinitos

  return {
    books,
    hasMore,
    loading,
    page: pageRef.current,
    loadMoreBooks,
    resetPagination,
  };
}
