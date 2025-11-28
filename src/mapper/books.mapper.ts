import { DEFAULT_COVER_IMAGE } from '@/utils/constants/constants';
import { EBookStatus } from '@gycoding/nebula';
import type HardcoverBook from '@/domain/HardcoverBook';

interface HardcoverAPIBook {
  id: string;
  title: string;
  featured_series?: {
    series: {
      name: string;
      id: number;
    };
  };
  image: {
    url: string;
    color_name: string;
  };
  release_date: string;
  pages: number;
  contributions: Array<{
    author: {
      id: number;
      name: string;
      image: {
        url: string;
        color_name: string;
      };
      biography: string;
    };
  }>;
  description: string;
  rating?: number;
}

export function mapHardcoverToBook(
  hardcoverBook: HardcoverAPIBook
): HardcoverBook {
  if (!hardcoverBook) {
    throw new Error('Book data is undefined');
  }
  const mainAuthor = hardcoverBook.contributions?.[0]?.author;
  if (!mainAuthor) {
    return {
      id: hardcoverBook.id,
      title: hardcoverBook.title,
      series: hardcoverBook.featured_series?.series
        ? [
            {
              name: hardcoverBook.featured_series.series.name,
              id: hardcoverBook.featured_series.series.id,
            },
          ]
        : [],
      cover: {
        url: hardcoverBook.image?.url || DEFAULT_COVER_IMAGE,
      },
      pageCount: hardcoverBook.pages || 0,
      author: {
        id: 0,
        name: 'Unknown Author',
        image: {
          url: '',
        },
        biography: '',
      },
      description: hardcoverBook.description || '',
      averageRating: 0,
      status: EBookStatus.WANT_TO_READ,
    };
  }

  let imageUrl = hardcoverBook.image?.url || '';
  if (imageUrl && !imageUrl.startsWith('http')) {
    console.warn(`Invalid image URL for book ${hardcoverBook.id}: ${imageUrl}`);
    imageUrl = DEFAULT_COVER_IMAGE;
  } else if (!imageUrl) {
    imageUrl = DEFAULT_COVER_IMAGE;
  }

  return {
    id: hardcoverBook.id,
    title: hardcoverBook.title,
    series: hardcoverBook.featured_series?.series
      ? [
          {
            name: hardcoverBook.featured_series.series.name,
            id: hardcoverBook.featured_series.series.id,
          },
        ]
      : [],
    cover: {
      url: imageUrl,
    },
    pageCount: hardcoverBook.pages || 0,
    author: {
      id: mainAuthor.id,
      name: mainAuthor.name,
      image: {
        url: mainAuthor.image?.url || '',
      },
      biography: mainAuthor.biography || '',
    },
    description: hardcoverBook.description || '',
    averageRating: 0,
    status: EBookStatus.WANT_TO_READ,
  };
}
