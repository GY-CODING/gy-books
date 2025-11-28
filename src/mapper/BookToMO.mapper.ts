/* eslint-disable @typescript-eslint/no-explicit-any */

import HardcoverBook, {
  Author,
  AuthorImage,
  Cover,
  Edition,
  Series,
} from '@/domain/HardcoverBook';
import { EBookStatus } from '@gycoding/nebula';

export function mapHardcoverToBook(data: any): HardcoverBook {
  const seriesEntry = data.book_series?.[0]?.series;

  const series: Series | null = seriesEntry
    ? {
        id: parseInt(seriesEntry.id),
        name: seriesEntry.name,
      }
    : null;

  const authorData = data.contributions?.[0]?.author;

  const authorImage: AuthorImage = {
    url: authorData?.image?.url ?? '',
  };

  const author: Author = {
    id: parseInt(authorData?.id),
    name: authorData?.name ?? '',
    image: authorImage,
    biography: authorData?.bio ?? '',
  };

  const cover: Cover = {
    url: data.image?.url ?? '',
  };

  // Map editions if present
  let editions: Edition[] | undefined = undefined;
  const editionsRaw = data.book_series?.[0]?.book?.editions;
  if (Array.isArray(editionsRaw)) {
    editions = editionsRaw.map((ed: any) => ({
      id: parseInt(ed.id),
      book_id: parseInt(ed.book_id),
      title: ed.title,
      pages: ed.pages ?? null,
      cached_image:
        ed.cached_image && ed.cached_image.url
          ? {
              id: ed.cached_image.id,
              url: ed.cached_image.url,
              color: ed.cached_image.color,
              width: ed.cached_image.width,
              height: ed.cached_image.height,
              color_name: ed.cached_image.color_name,
            }
          : null,
      language: ed.language ?? null,
    }));
  }

  const book: HardcoverBook = {
    id: data.id.toString(),
    title: data.title,
    description: data.description ?? '',
    releaseDate: data.release_date ?? '',
    pageCount: 0,
    cover,
    author,
    series,
    status: EBookStatus.WANT_TO_READ,
    editions,
  };

  return book;
}
