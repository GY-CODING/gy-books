import { EBookStatus } from '@gycoding/nebula';
import { ProfileFilters } from './profileTypes';

export class ProfileURLHelpers {
  static parseFiltersFromURL(
    searchParams: URLSearchParams
  ): Partial<ProfileFilters> {
    const urlStatus = searchParams.get('status');
    const urlAuthor = searchParams.get('author');
    const urlSeries = searchParams.get('series');
    const urlRating = searchParams.get('rating');
    const urlSearch = searchParams.get('search') || '';
    const urlOrderBy = searchParams.get('orderBy') || 'rating';
    const urlOrderDirection = searchParams.get('orderDirection') || 'desc';

    return {
      status:
        urlStatus &&
        Object.values(EBookStatus).includes(urlStatus as EBookStatus)
          ? (urlStatus as EBookStatus)
          : null,
      author: urlAuthor || '',
      series: urlSeries || '',
      rating: urlRating ? Number(urlRating) : 0,
      search: urlSearch,
      orderBy: urlOrderBy,
      orderDirection: urlOrderDirection as 'asc' | 'desc',
    };
  }

  static buildURLFromFilters(
    filters: Partial<ProfileFilters>,
    currentParams: URLSearchParams
  ): string {
    const params = new URLSearchParams(currentParams.toString());

    if (filters.status) {
      params.set('status', filters.status);
    } else {
      params.delete('status');
    }

    if (filters.author) {
      params.set('author', filters.author);
    } else {
      params.delete('author');
    }

    if (filters.series) {
      params.set('series', filters.series);
    } else {
      params.delete('series');
    }

    if (filters.rating && filters.rating > 0) {
      params.set('rating', String(filters.rating));
    } else {
      params.delete('rating');
    }

    if (filters.search) {
      params.set('search', filters.search);
    } else {
      params.delete('search');
    }

    if (filters.orderBy) {
      params.set('orderBy', filters.orderBy);
    } else {
      params.delete('orderBy');
    }

    if (filters.orderDirection) {
      params.set('orderDirection', filters.orderDirection);
    } else {
      params.delete('orderDirection');
    }

    return params.toString();
  }
}
