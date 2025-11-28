import type HardcoverBook from '@/domain/HardcoverBook';
import { Stats } from '@/domain/stats.model';

/**
 * Calcula las estadísticas de una colección de libros.
 *
 * Esta función procesa un array de libros y genera KPIs como:
 * - Total de libros y páginas
 * - Distribución de autores
 * - Distribución de estados (READ, READING, WANT_TO_READ)
 * - Estadísticas de ratings (distribución, promedio, total)
 *
 * @param books - Array de libros del usuario (con userData incluido)
 * @returns Stats - Objeto con todas las estadísticas calculadas
 *
 * @example
 * ```typescript
 * const stats = calculateStats(userBooks);
 * console.log(stats.totalBooks); // 42
 * console.log(stats.averageRating); // 4.2
 * ```
 */
export function calculateStats(books: HardcoverBook[]): Stats {
  const stats: Stats = {
    totalBooks: 0,
    totalPages: 0,
    wantToReadPages: 0,
    authors: {},
    bookStatus: {},
    ratings: {
      distribution: {},
      averageRating: 0,
      totalRatedBooks: 0,
    },
  };

  if (!books || books.length === 0) {
    return stats;
  }

  let totalRatingSum = 0;
  let ratedBooksCount = 0;

  books.forEach((book) => {
    const { userData, pageCount } = book;

    // Si no tiene userData, skip
    if (!userData) return;

    const { status, rating } = userData;

    // Incrementar total de libros
    stats.totalBooks++;

    // Acumular páginas totales (solo libros READ o READING)
    if (status === 'READ' || status === 'READING') {
      stats.totalPages += pageCount || 0;
    }

    // Acumular páginas de WANT_TO_READ
    if (status === 'WANT_TO_READ') {
      stats.wantToReadPages += pageCount || 0;
    }

    // Distribución de autores
    const authorName = book.author?.name || book.authors?.[0]?.name;
    if (authorName) {
      stats.authors[authorName] = (stats.authors[authorName] || 0) + 1;
    }

    // Distribución de estados
    if (status) {
      stats.bookStatus[status] = (stats.bookStatus[status] || 0) + 1;
    }

    // Distribución de ratings
    if (rating && rating > 0) {
      const ratingKey = rating.toString();
      stats.ratings.distribution[ratingKey] =
        (stats.ratings.distribution[ratingKey] || 0) + 1;
      totalRatingSum += rating;
      ratedBooksCount++;
    }
  });

  // Calcular rating promedio
  if (ratedBooksCount > 0) {
    stats.ratings.averageRating =
      Math.round((totalRatingSum / ratedBooksCount) * 10) / 10;
    stats.ratings.totalRatedBooks = ratedBooksCount;
  }

  return stats;
}

/**
 * Ordena los autores por cantidad de libros leídos (descendente).
 *
 * @param authors - Record con nombre de autor y cantidad de libros
 * @returns Array de [nombre, cantidad] ordenado
 *
 * @example
 * ```typescript
 * const sorted = sortAuthorsByCount({ "Brandon Sanderson": 21, "Tolkien": 5 });
 * // [["Brandon Sanderson", 21], ["Tolkien", 5]]
 * ```
 */
export function sortAuthorsByCount(
  authors: Record<string, number>
): [string, number][] {
  return Object.entries(authors).sort((a, b) => b[1] - a[1]);
}

/**
 * Obtiene el top N de autores más leídos.
 *
 * @param authors - Record con nombre de autor y cantidad de libros
 * @param limit - Número máximo de autores a devolver (default: 10)
 * @returns Array de [nombre, cantidad] con los top N autores
 *
 * @example
 * ```typescript
 * const top5 = getTopAuthors(stats.authors, 5);
 * ```
 */
export function getTopAuthors(
  authors: Record<string, number>,
  limit = 10
): [string, number][] {
  return sortAuthorsByCount(authors).slice(0, limit);
}
