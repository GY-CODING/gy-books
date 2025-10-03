import { useState, useEffect, useMemo } from 'react';
import { Edition } from '@/domain/book.model';
import { ApiBook } from '@/domain/apiBook.model';
import {
  findEditionById,
  getDisplayDataFromEdition,
} from '@/utils/bookEditionHelpers';
import rateBook from '@/app/actions/book/rateBook';
import { useUser } from '@/hooks/useUser';
import { EStatus } from '@/utils/constants/EStatus';

interface UseEditionSelectionProps {
  editions: Edition[];
  apiBook: ApiBook | undefined;
  defaultCoverUrl: string;
  defaultTitle: string;
  onEditionSaved?: (success: boolean, message: string) => void;
}

interface UseEditionSelectionReturn {
  selectedEdition: Edition | null;
  setSelectedEdition: (edition: Edition | null) => void;
  displayTitle: string;
  displayImage: string;
  hasUserSelectedEdition: boolean;
  isSaving: boolean;
}

/**
 * Hook personalizado para manejar la selección de ediciones de un libro
 * Inicializa automáticamente la edición basándose en userData.editionId
 */
export function useEditionSelection({
  editions,
  apiBook,
  defaultCoverUrl,
  defaultTitle,
  onEditionSaved,
}: UseEditionSelectionProps): UseEditionSelectionReturn {
  const { data: user } = useUser();
  const [selectedEdition, setSelectedEdition] = useState<Edition | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Determinar si el usuario ya tiene una edición seleccionada en sus datos
  const userEditionId = apiBook?.userData?.editionId;
  const hasUserSelectedEdition = Boolean(userEditionId);

  // Efecto para inicializar la edición seleccionada basándose en userData
  useEffect(() => {
    if (!userEditionId || !editions.length) {
      setSelectedEdition(null);
      return;
    }

    const userEdition = findEditionById(editions, userEditionId);
    if (userEdition) {
      setSelectedEdition(userEdition);
    }
  }, [userEditionId, editions]);

  // Función para manejar el cambio de edición con guardado automático
  const handleEditionChange = async (newEdition: Edition | null) => {
    if (!user || isSaving) return;

    setIsSaving(true);

    try {
      // Si el usuario no tiene el libro guardado y selecciona una edición, guardarlo automáticamente
      const shouldAutoSave = !apiBook?.userData && newEdition;

      if (shouldAutoSave) {
        const formData = new FormData();
        formData.append('bookId', apiBook?.id || '');
        formData.append('rating', '0');
        formData.append('status', EStatus.WANT_TO_READ);
        formData.append('startDate', '');
        formData.append('endDate', '');
        formData.append('progress', '0');
        formData.append('editionId', newEdition.id.toString());

        await rateBook(formData, user.username, undefined);

        setSelectedEdition(newEdition);
        onEditionSaved?.(true, 'Book saved with selected edition!');
      } else if (apiBook?.userData && newEdition) {
        // Si ya tiene el libro guardado, actualizar la edición
        const formData = new FormData();
        formData.append('bookId', apiBook.id);
        formData.append('rating', (apiBook.userData.rating || 0).toString());
        formData.append('status', apiBook.userData.status);
        formData.append('startDate', apiBook.userData.startDate || '');
        formData.append('endDate', apiBook.userData.endDate || '');
        formData.append(
          'progress',
          (apiBook.userData.progress || 0).toString()
        );
        formData.append('editionId', newEdition.id.toString());

        await rateBook(formData, user.username, apiBook.userData);

        setSelectedEdition(newEdition);
        onEditionSaved?.(true, 'Edition updated successfully!');
      } else {
        // Solo cambiar la selección visual sin guardar
        setSelectedEdition(newEdition);
      }
    } catch (error) {
      console.error('Error saving edition:', error);
      onEditionSaved?.(false, 'Error saving edition. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Calcular datos de visualización de forma memoizada
  const { title: displayTitle, imageUrl: displayImage } = useMemo(() => {
    return getDisplayDataFromEdition(
      selectedEdition,
      defaultTitle,
      defaultCoverUrl
    );
  }, [selectedEdition, defaultTitle, defaultCoverUrl]);

  return {
    selectedEdition,
    setSelectedEdition: handleEditionChange,
    displayTitle,
    displayImage,
    hasUserSelectedEdition,
    isSaving,
  };
}
