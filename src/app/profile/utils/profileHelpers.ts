import type HardcoverBook from '@/domain/HardcoverBook';
// Do NOT import EBookStatus directly to avoid dynamic require issues on the client
import type { ProfileFilters } from '../hooks/useProfileFilters';

export const ProfileBookHelpers = {
  generateFilterOptions(books: HardcoverBook[]) {
    const authorSet = new Set<string>();
    const seriesSet = new Set<string>();

    books.forEach((b) => {
      if (b.author && b.author.name) authorSet.add(b.author.name);
      if (b.series && Array.isArray(b.series)) {
        b.series.forEach((s) => s && seriesSet.add(s.name));
      }
    });

    // Hardcode the status options to avoid runtime import issues
    const statusOptions = [
      { label: 'Reading', value: 'READING' },
      { label: 'Want to read', value: 'WANT_TO_READ' },
      { label: 'Read', value: 'READ' },
    ];

    return {
      statusOptions,
      authorOptions: Array.from(authorSet),
      seriesOptions: Array.from(seriesSet),
    };
  },

  filterBooks(books: HardcoverBook[], filters: ProfileFilters) {
    return books.filter((book) => {
      // Prefer userData.status if available, else book.status
      const bookStatus: string | undefined =
        book.userData?.status ?? book.status;
      const statusOk = !filters.status || bookStatus === filters.status;
      const authorOk =
        !filters.author || (book.author && book.author.name === filters.author);
      const seriesOk =
        !filters.series ||
        (book.series && book.series.some((s) => s.name === filters.series));
      const bookRating = book.userData?.rating;
      const ratingOk =
        !filters.rating ||
        (typeof bookRating === 'number' && bookRating >= filters.rating);
      return statusOk && authorOk && seriesOk && ratingOk;
    });
  },

  sortBooks(
    books: HardcoverBook[],
    orderBy: ProfileOrderBy,
    orderDirection: ProfileOrderDirection
  ): HardcoverBook[] {
    if (!orderBy) return books;
    // Always sort the full array, robustly handling missing values
    const sorted = [...books].sort((a, b) => {
      switch (orderBy) {
        case 'rating': {
          // Sort by userData.rating (personal rating), fallback to 0 if not present
          const aRating = a.userData?.rating ?? 0;
          const bRating = b.userData?.rating ?? 0;
          // If both ratings are 0, keep original order
          if (aRating === 0 && bRating === 0) return 0;
          // Books with rating 0 go to the end
          if (aRating === 0) return 1;
          if (bRating === 0) return -1;
          return bRating - aRating;
        }
        case 'author': {
          // Sort by author name (first author), fallback to empty string
          const aAuthor = a.authors?.[0]?.name?.toLowerCase() ?? '';
          const bAuthor = b.authors?.[0]?.name?.toLowerCase() ?? '';
          // Books with no author go to the end
          if (!aAuthor && !bAuthor) return 0;
          if (!aAuthor) return 1;
          if (!bAuthor) return -1;
          return aAuthor.localeCompare(bAuthor);
        }
        case 'name': {
          // Sort by book title, fallback to empty string
          const aTitle = a.title?.toLowerCase() ?? '';
          const bTitle = b.title?.toLowerCase() ?? '';
          // Books with no title go to the end
          if (!aTitle && !bTitle) return 0;
          if (!aTitle) return 1;
          if (!bTitle) return -1;
          return aTitle.localeCompare(bTitle);
        }
        case 'series': {
          // Sort by saga/series name, fallback to empty string
          const aSaga = a.series?.name?.toLowerCase() ?? '';
          const bSaga = b.series?.name?.toLowerCase() ?? '';
          // Books with no saga go to the end
          if (!aSaga && !bSaga) return 0;
          if (!aSaga) return 1;
          if (!bSaga) return -1;
          return aSaga.localeCompare(bSaga);
        }
        default:
          return 0;
      }
    });
    if (orderDirection === 'asc') {
      return sorted.reverse();
    }
    return sorted;
  },
};
