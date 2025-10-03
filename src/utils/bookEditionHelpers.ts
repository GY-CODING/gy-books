import { Edition } from '@/domain/book.model';

/**
 * Encuentra una edición específica por su ID
 * @param editions Array de ediciones disponibles
 * @param editionId ID de la edición a buscar (puede ser string o number)
 * @returns La edición encontrada o null si no existe
 */
export function findEditionById(
  editions: Edition[] | undefined,
  editionId: string | number | undefined
): Edition | null {
  if (!editions || !editionId) {
    return null;
  }

  const numericEditionId =
    typeof editionId === 'string' ? parseInt(editionId, 10) : editionId;
  if (isNaN(numericEditionId)) {
    return null;
  }

  return editions.find((edition) => edition.id === numericEditionId) || null;
}

/**
 * Obtiene los datos de visualización de una edición específica
 * @param edition Edición seleccionada
 * @param fallbackTitle Título por defecto si no hay edición
 * @param fallbackImageUrl URL de imagen por defecto si no hay edición
 * @returns Objeto con título e imagen a mostrar
 */
export function getDisplayDataFromEdition(
  edition: Edition | null,
  fallbackTitle: string,
  fallbackImageUrl: string
) {
  return {
    title: edition?.title || fallbackTitle,
    imageUrl: edition?.cached_image?.url || fallbackImageUrl,
  };
}
