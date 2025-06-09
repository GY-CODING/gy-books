import Book from '../domain/book.model';

const DEFAULT_COVER_IMAGE =
  'https://raw.githubusercontent.com/GY-CODING/img-repo/refs/heads/main/gy-books/none.png';

interface HardcoverBook {
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
    };
  }>;
  description: string;
}

export function mapHardcoverToBook(hardcoverBook: HardcoverBook): Book {
  if (!hardcoverBook) {
    throw new Error('Book data is undefined');
  }

  console.log('Mapping book:', {
    id: hardcoverBook.id,
    title: hardcoverBook.title,
    hasImage: !!hardcoverBook.image,
    imageUrl: hardcoverBook.image?.url,
  });

  const mainAuthor = hardcoverBook.contributions?.[0]?.author;
  if (!mainAuthor) {
    return {
      id: hardcoverBook.id,
      title: hardcoverBook.title,
      series: hardcoverBook.featured_series?.series
        ? {
            name: hardcoverBook.featured_series.series.name,
            id: hardcoverBook.featured_series.series.id,
          }
        : null,
      cover: {
        url: hardcoverBook.image?.url || DEFAULT_COVER_IMAGE,
      },
      releaseDate: hardcoverBook.release_date || '',
      pageCount: hardcoverBook.pages || 0,
      author: {
        id: 0,
        name: 'Unknown Author',
        image: {
          url: '',
        },
      },
      description: hardcoverBook.description || '',
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
      ? {
          name: hardcoverBook.featured_series.series.name,
          id: hardcoverBook.featured_series.series.id,
        }
      : null,
    cover: {
      url: imageUrl,
    },
    releaseDate: hardcoverBook.release_date || '',
    pageCount: hardcoverBook.pages || 0,
    author: {
      id: mainAuthor.id,
      name: mainAuthor.name,
      image: {
        url: mainAuthor.image?.url || '',
      },
    },
    description: hardcoverBook.description || '',
  };
}
