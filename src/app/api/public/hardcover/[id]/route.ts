// src/app/api/books/[id]/route.ts
import { NextResponse } from 'next/server';
import { GET_BOOK_BY_ID_QUERY } from '@/utils/constants/Query';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;

  try {
    const apiUrl = process.env.HARDCOVER_API_URL;
    const apiKey = process.env.HARDCOVER_API_TOKEN;

    if (!apiUrl || !apiKey) {
      console.error('API Route - Faltan variables de entorno');
      return NextResponse.json(
        { error: 'Configuración de API no encontrada' },
        { status: 500 }
      );
    }

    const { id } = params;

    // Validate that id is a valid number
    const bookId = parseInt(id);
    if (isNaN(bookId)) {
      console.error('API Route - Invalid book ID:', id);
      return NextResponse.json(
        { error: `Invalid book ID: ${id}. Must be a number.` },
        { status: 400 }
      );
    }

    const requestBody = {
      query: GET_BOOK_BY_ID_QUERY,
      variables: {
        id: bookId,
      },
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Route - Error en respuesta:', errorText);
      throw new Error(
        `Error al obtener los detalles del libro: ${response.status} ${errorText}`
      );
    }

    const data = await response.json();

    if (data.errors) {
      console.error('API Route - Errores GraphQL:', data.errors);
      throw new Error(data.errors[0].message);
    }

    if (!data.data?.books_by_pk) {
      console.error('API Route - No book found for ID:', bookId);
      return NextResponse.json(
        { error: `Book not found with ID: ${bookId}` },
        { status: 404 }
      );
    }

    console.log('API Route - Returning book data:', data.data.books_by_pk);
    return NextResponse.json(data.data.books_by_pk);
  } catch (error) {
    console.error('API Route - Error:', error);
    return NextResponse.json(
      { error: 'Error al obtener los detalles del libro' },
      { status: 500 }
    );
  }
}
