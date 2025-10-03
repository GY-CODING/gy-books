/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import Book from '@/domain/book.model';
import { mapHardcoverToBook } from '@/mapper/BookToMO.mapper';

export default async function fetchBookById(id: string): Promise<Book> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const url = `${baseUrl}/api/public/hardcover/${id}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ fetchBookById - Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    const mappedBook = mapHardcoverToBook(data);

    return mappedBook;
  } catch (error: any) {
    console.error('💥 fetchBookById - Error details:', error);
    throw new Error(`Failed to fetch books: ${error.message}`);
  }
}
