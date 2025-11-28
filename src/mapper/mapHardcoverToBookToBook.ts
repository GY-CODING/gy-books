/* eslint-disable @typescript-eslint/no-explicit-any */
import HardcoverBook, {
  Author,
  BookHelpers,
  Edition,
  Series,
} from '@/domain/HardcoverBook';
import { DEFAULT_COVER_IMAGE } from '@/utils/constants/constants';
import { Book as NebulaBook } from '@gycoding/nebula';

export function mapHardcoverBookToBook(
  hardcoverBook: any,
  nebulaBook?: NebulaBook
): HardcoverBook {
  if (!hardcoverBook) throw new Error('Hardcover book data is undefined');

  // 1️⃣ Autor principal (del primer contributions[])
  let author: Author = {
    id: 0,
    name: 'Unknown Author',
    image: { url: DEFAULT_COVER_IMAGE },
    biography: '',
  };

  const mainAuthor = hardcoverBook.contributions?.[0]?.author;
  if (mainAuthor) {
    author = {
      id: mainAuthor.id ?? 0,
      name: mainAuthor.name ?? 'Unknown Author',
      image: { url: mainAuthor.image?.url || DEFAULT_COVER_IMAGE },
      biography: mainAuthor.biography || '',
    };
  } else if (hardcoverBook.author) {
    author = {
      id: hardcoverBook.author.id ?? 0,
      name: hardcoverBook.author.name ?? 'Unknown Author',
      image: { url: hardcoverBook.author.image?.url || DEFAULT_COVER_IMAGE },
      biography: hardcoverBook.author.biography || '',
    };
  }
  // 2️⃣ Series
  let series: Series[] = [];

  // Intentar book_series primero (queries por ID)
  if (hardcoverBook.book_series && Array.isArray(hardcoverBook.book_series)) {
    series = hardcoverBook.book_series.map((bs: any) => ({
      id: bs.series?.id ?? 0,
      name: bs.series?.name ?? '',
    }));
  }
  // Si no hay book_series, intentar featured_series (búsquedas)
  else if (hardcoverBook.featured_series?.series) {
    series = [{
      id: hardcoverBook.featured_series.series.id ?? 0,
      name: hardcoverBook.featured_series.series.name ?? '',
    }];
  }

  // 3️⃣ Ediciones: todas las de book_series + hardcoverBook.editions
  let allEditions: Edition[] = [];

  hardcoverBook.book_series?.forEach((bs: any) => {
    if (bs.book?.editions) {
      allEditions = allEditions.concat(
        bs.book.editions.map((e: any) => ({
          id: e.id,
          book_id: e.book_id,
          title: e.title,
          pages: e.pages ?? 0,
          cached_image: e.cached_image ?? null,
          language: e.language ?? null,
        }))
      );
    }
  });

  if (hardcoverBook.editions) {
    allEditions = allEditions.concat(
      hardcoverBook.editions.map((e: any) => ({
        id: e.id,
        book_id: e.book_id,
        title: e.title,
        pages: e.pages ?? 0,
        cached_image: e.cached_image ?? null,
        language: e.language ?? null,
      }))
    );
  }

  // Filtrar duplicados por ID
  const uniqueEditionsMap = new Map<number, Edition>();
  allEditions.forEach((edition) => {
    if (!uniqueEditionsMap.has(edition.id)) {
      uniqueEditionsMap.set(edition.id, edition);
    }
  });

  const editions = Array.from(uniqueEditionsMap.values());

  // 4️⃣ Portada y pageCount iniciales
  const coverUrl = hardcoverBook.image?.url || DEFAULT_COVER_IMAGE;
  const pageCount = editions.find((e) => e.pages != null)?.pages ?? 0;

  // 5️⃣ Construir objeto inicial
  let book: HardcoverBook = {
    id: hardcoverBook.id?.toString() ?? '',
    title: hardcoverBook.title ?? '',
    description: hardcoverBook.description ?? '',
    pageCount,
    cover: { url: coverUrl },
    author,
    series,
    editions,
    averageRating: nebulaBook?.averageRating ?? 0, // <-- averageRating de Nebula
    status: nebulaBook?.userData?.status,
    userData: nebulaBook?.userData,
  };

  // 6️⃣ Si hay userData con editionId → ajustar título, portada y pageCount
  if (BookHelpers.hasSelectedEdition(book)) {
    const selectedEdition = BookHelpers.getSelectedEdition(book);
    book = {
      ...book,
      title: BookHelpers.getDisplayTitle(book),
      cover: { url: BookHelpers.getDisplayCoverUrl(book) },
      pageCount: selectedEdition?.pages ?? book.pageCount,
    };
  }

  return book;
}

/**
 * Mapea un array de libros Hardcover
 */
export function mapHardcoverBooksToList(
  hardcoverBooks: any[],
  nebulaBooks?: NebulaBook[]
): HardcoverBook[] {
  if (!Array.isArray(hardcoverBooks)) return [];
  return hardcoverBooks.map((hb) => {
    const nb = nebulaBooks?.find((b) => b.id === hb.id);
    return mapHardcoverBookToBook(hb, nb);
  });
}
