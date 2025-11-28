/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import HardcoverBook from '@/domain/HardcoverBook';
import { Book } from '@gycoding/nebula';

interface ApiResponse {
  books: HardcoverBook[];
}

export default async function queryBooks(formData: FormData): Promise<Book[]> {
  const query = formData.get('title');

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const url = `${baseUrl}/api/public/hardcover?query=${query}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server Action - Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse = await response.json();

    // Filtrar y ordenar libros: primero los que tienen series
    const sortedBooks = data.books.sort((a, b) => {
      const aHasSeries = a.series !== null;
      const bHasSeries = b.series !== null;

      if (aHasSeries && !bHasSeries) return -1; // a va primero
      if (!aHasSeries && bHasSeries) return 1; // b va primero
      return 0; // mantienen su orden original
    });

    return sortedBooks;
  } catch (error: any) {
    console.error('Server Action - Error details:', error);
    throw new Error(`Failed to fetch books: ${error.message}`);
  }
}
