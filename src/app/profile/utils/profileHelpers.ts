import Book, { BookHelpers } from '@/domain/book.model';
import { ProfileFilters, ProfileFilterOptions } from './profileTypes';
import { EStatus } from '@/utils/constants/EStatus';

export class ProfileBookHelpers {
  static generateFilterOptions(books: Book[]): ProfileFilterOptions {
    const statusOptions = [
      { label: 'Reading', value: EStatus.READING },
      { label: 'Read', value: EStatus.READ },
      { label: 'Want to read', value: EStatus.WANT_TO_READ },
    ];

    const authorOptions = Array.from(
      new Set(
        books
          .map((b) => b.author?.name)
          .filter((name): name is string => name != null && name.trim() !== '')
      )
    ).sort();

    const seriesOptions = Array.from(
      new Set(
        books
          .map((b) => b.series?.name)
          .filter((name): name is string => name != null && name.trim() !== '')
      )
    ).sort();

    return {
      statusOptions,
      authorOptions,
      seriesOptions,
    };
  }

  static filterBooks(books: Book[], filters: ProfileFilters): Book[] {
    return books.filter((book) => {
      const statusOk = !filters.status || book.status === filters.status;
      const authorOk =
        !filters.author || (book.author && book.author.name === filters.author);
      const seriesOk =
        !filters.series || (book.series && book.series.name === filters.series);
      const ratingOk =
        !filters.rating ||
        (typeof book.rating === 'number' && book.rating >= filters.rating);

      const searchOk =
        !filters.search ||
        (BookHelpers.getDisplayTitle(book) &&
          BookHelpers.getDisplayTitle(book)
            .toLowerCase()
            .includes(filters.search.toLowerCase())) ||
        book.author?.name
          ?.toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        book.series?.name?.toLowerCase().includes(filters.search.toLowerCase());

      return statusOk && authorOk && seriesOk && ratingOk && searchOk;
    });
  }

  static sortBooks(
    books: Book[],
    orderBy: string,
    orderDirection: 'asc' | 'desc'
  ): Book[] {
    return [...books].sort((a, b) => {
      let aValue: string | number = '';
      let bValue: string | number = '';

      switch (orderBy) {
        case 'author':
          aValue = a.author?.name || '';
          bValue = b.author?.name || '';
          break;
        case 'series':
          aValue = a.series?.name || '';
          bValue = b.series?.name || '';
          break;
        case 'rating':
          aValue = typeof a.rating === 'number' ? a.rating : 0;
          bValue = typeof b.rating === 'number' ? b.rating : 0;
          break;
        case 'title':
        default:
          aValue = BookHelpers.getDisplayTitle(a) || '';
          bValue = BookHelpers.getDisplayTitle(b) || '';
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return orderDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return orderDirection === 'asc'
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      }
    });
  }

  static removeDuplicateBooks(books: Book[]): Book[] {
    return books.filter(
      (book, idx, arr) => arr.findIndex((b) => b.id === book.id) === idx
    );
  }
}
