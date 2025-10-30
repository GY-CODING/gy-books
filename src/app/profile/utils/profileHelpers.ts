import type HardcoverBook from '@/domain/HardcoverBook';
import type { EBookStatus } from '@gycoding/nebula';
import type { ProfileFilters } from '../hooks/useProfileFilters';

export const ProfileBookHelpers = {
  generateFilterOptions(books: HardcoverBook[]) {
    const statusSet = new Set<EBookStatus>();
    const authorSet = new Set<string>();
    const seriesSet = new Set<string>();

    books.forEach((b) => {
      if (b.status) statusSet.add(b.status as EBookStatus);
      if (b.author && b.author.name) authorSet.add(b.author.name);
      if (b.series && Array.isArray(b.series)) {
        b.series.forEach((s) => s && seriesSet.add(s.name));
      }
    });

    return {
      statusOptions: Array.from(statusSet).map((s) => ({ label: String(s), value: s })),
      authorOptions: Array.from(authorSet),
      seriesOptions: Array.from(seriesSet),
    };
  },

  filterBooks(books: HardcoverBook[], filters: ProfileFilters) {
    return books.filter((book) => {
      const statusOk = !filters.status || String(book.status) === String(filters.status);
      const authorOk = !filters.author || (book.author && book.author.name === filters.author);
      const seriesOk = !filters.series || (book.series && book.series.some((s) => s.name === filters.series));
      const bookRating = (book as HardcoverBook & { rating?: number }).rating;
      const ratingOk = !filters.rating || (typeof bookRating === 'number' && bookRating >= filters.rating);
      const searchOk =
        !filters.search ||
        (book.title && book.title.toLowerCase().includes(filters.search.toLowerCase())) ||
        (book.author && book.author.name && book.author.name.toLowerCase().includes(filters.search.toLowerCase()));
      return statusOk && authorOk && seriesOk && ratingOk && searchOk;
    });
  },

  sortBooks(books: HardcoverBook[], orderBy: string, orderDirection: 'asc' | 'desc') {
    if (!orderBy) return books;
    const result = [...books];
    result.sort((a: HardcoverBook, b: HardcoverBook) => {
      let aValue: string | number = '';
      let bValue: string | number = '';
      switch (orderBy) {
        case 'author':
          aValue = a.author?.name || '';
          bValue = b.author?.name || '';
          break;
        case 'series':
          aValue = a.series?.[0]?.name || '';
          bValue = b.series?.[0]?.name || '';
          break;
        case 'rating':
          aValue = typeof (a as HardcoverBook & { rating?: number }).rating === 'number' ? (a as unknown as { rating?: number }).rating ?? 0 : 0;
          bValue = typeof (b as HardcoverBook & { rating?: number }).rating === 'number' ? (b as unknown as { rating?: number }).rating ?? 0 : 0;
          break;
        case 'title':
          aValue = a.title || '';
          bValue = b.title || '';
          break;
        default:
          aValue = a.title || '';
          bValue = b.title || '';
      }
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return orderDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      return orderDirection === 'asc' ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number);
    });
    return result;
  },
};

export default ProfileBookHelpers;
