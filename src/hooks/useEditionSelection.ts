import { useState, useEffect, useMemo } from 'react';
import {
  findEditionById,
  getDisplayDataFromEdition,
} from '@/utils/bookEditionHelpers';
import rateBook from '@/app/actions/book/rateBook';
import { useUser } from '@/hooks/useUser';
import type { Book } from '@gycoding/nebula';
import { Edition } from '@/domain/HardcoverBook';

interface UseEditionSelectionProps {
  editions: Edition[];
  Book: Book | undefined;
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
  isPreviewMode: boolean;
}

/**
 * Hook personalizado para manejar la selección de ediciones de un libro
 * Inicializa automáticamente la edición basándose en userData.editionId
 */
export function useEditionSelection({
  editions,
  Book,
  defaultCoverUrl,
  defaultTitle,
  onEditionSaved,
}: UseEditionSelectionProps): UseEditionSelectionReturn {
  const { data: user } = useUser();
  const [selectedEdition, setSelectedEdition] = useState<Edition | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Determinar si el usuario ya tiene una edición seleccionada en sus datos
  const userEditionId = Book?.userData?.editionId;
  const hasUserSelectedEdition = Boolean(userEditionId);

  // Estados válidos para guardar ediciones (usar strings para evitar require dinámico)
  const validStatuses = ['WANT_TO_READ', 'READING', 'READ'];
  const hasValidStatus =
    Book?.userData?.status &&
    validStatuses.includes(Book.userData.status);

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

  // Función para manejar el cambio de edición sin auto-guardado
  const handleEditionChange = async (newEdition: Edition | null) => {
    if (!user || isSaving) return;

    // Si no hay libro guardado o no está en estado válido, solo cambiar visualización
    if (!Book?.userData || !hasValidStatus) {
      setSelectedEdition(newEdition);
      return;
    }

    // Solo llegar aquí si el libro está guardado Y en estado válido
    setIsSaving(true);

    try {
      if (Book?.userData && newEdition && hasValidStatus) {
        // Actualizar la edición en la base de datos
        const formData = new FormData();
        formData.append('bookId', Book.id);
        formData.append('rating', (Book.userData.rating || 0).toString());
        formData.append('status', Book.userData.status);
        formData.append('startDate', Book.userData.startDate || '');
        formData.append('endDate', Book.userData.endDate || '');
        formData.append(
          'progress',
          (Book.userData.progress || 0).toString()
        );
        formData.append('editionId', newEdition.id.toString());

        await rateBook(formData, user.username, Book.userData);

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

  // Determinar si estamos en modo preview (no guardado o sin estado válido)
  const isPreviewMode = !Book?.userData || !hasValidStatus;

  return {
    selectedEdition,
    setSelectedEdition: handleEditionChange,
    displayTitle,
    displayImage,
    hasUserSelectedEdition,
    isSaving,
    isPreviewMode,
  };
}
