import Book from '@/domain/book.model';
import { mapHardcoverToBook } from '@/mapper/BookToMO.mapper';

export default async function getBookById(id: string): Promise<Book> {
  try {
    const url = id; // useSWR ya añade el prefijo /api/books/

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('getBookById service - Error response:', errorText);
      throw new Error(
        `No se pudo cargar el libro: ${response.status} ${errorText}`
      );
    }

    const data = await response.json();

    return mapHardcoverToBook(data);
  } catch (err) {
    console.error('getBookById service - Error:', err);
    throw err;
  }
}
