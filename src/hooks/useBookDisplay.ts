import { useMemo } from 'react';
import Book, { BookHelpers, Edition } from '@/domain/book.model';

interface BookDisplayData {
  title: string;
  coverUrl: string;
  selectedEdition: Edition | null;
  hasSelectedEdition: boolean;
}

/**
 * Hook personalizado para obtener los datos de visualización de un libro
 * Maneja la lógica de qué título e imagen mostrar basado en la edición seleccionada
 * @param book El libro del que obtener los datos de visualización
 * @param defaultCoverImage URL de imagen por defecto a usar si no hay imagen
 * @returns Objeto con los datos de visualización procesados
 */
export function useBookDisplay(
  book: Book,
  defaultCoverImage: string = ''
): BookDisplayData {
  return useMemo(() => {
    const selectedEdition = BookHelpers.getSelectedEdition(book);
    const title = BookHelpers.getDisplayTitle(book);
    const coverUrl = BookHelpers.getDisplayCoverUrl(book) || defaultCoverImage;
    const hasSelectedEdition = BookHelpers.hasSelectedEdition(book);

    return {
      title,
      coverUrl,
      selectedEdition,
      hasSelectedEdition,
    };
  }, [book, defaultCoverImage]);
}
