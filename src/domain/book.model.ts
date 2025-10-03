import { EStatus } from '@/utils/constants/EStatus';
import { UserData } from './userData.model';
import { findEditionById } from '@/utils/bookEditionHelpers';

export interface Series {
  name: string;
  id: number;
}

export interface Cover {
  url?: string;
}

export interface AuthorImage {
  url: string;
}

export interface Author {
  id: number;
  name: string;
  image: AuthorImage;
  biography: string;
}

export interface Edition {
  id: number;
  book_id: number;
  title: string;
  pages: number | null;
  cached_image?: {
    id: number;
    url: string;
    color: string;
    width: number;
    height: number;
    color_name: string;
  } | null;
  language?: {
    language: string;
    id: number;
  } | null;
}

export default interface Book {
  id: string;
  title: string;
  series: Series | null;
  cover: Cover;
  releaseDate: string;
  pageCount: number;
  author: Author;
  description: string;
  rating?: number;
  status?: EStatus;
  editions?: Edition[];
  userData?: UserData;
}

/**
 * Helper class with static methods for working with Book objects
 */
export class BookHelpers {
  /**
   * Obtiene la edición seleccionada basada en el editionId del userData
   */
  static getSelectedEdition(book: Book): Edition | null {
    if (!book.userData?.editionId || !book.editions) {
      return null;
    }

    return findEditionById(book.editions, book.userData.editionId);
  }

  /**
   * Obtiene el título a mostrar (de la edición seleccionada o del libro)
   */
  static getDisplayTitle(book: Book): string {
    const selectedEdition = this.getSelectedEdition(book);
    return selectedEdition?.title || book.title;
  }

  /**
   * Obtiene la URL de la imagen a mostrar (de la edición seleccionada o del libro)
   */
  static getDisplayCoverUrl(book: Book): string {
    const selectedEdition = this.getSelectedEdition(book);
    return selectedEdition?.cached_image?.url || book.cover.url || '';
  }

  /**
   * Verifica si el libro tiene una edición específica seleccionada
   */
  static hasSelectedEdition(book: Book): boolean {
    return this.getSelectedEdition(book) !== null;
  }
}
