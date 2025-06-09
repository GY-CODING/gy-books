// src/app/api/books/[id]/route.ts
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log('API Route - Iniciando petición GET');
  console.log('API Route - Params:', params);

  try {
    const apiUrl = process.env.HARDCOVER_API_URL;
    const apiKey = process.env.HARDCOVER_API_TOKEN;

    console.log('API Route - Variables de entorno:', {
      apiUrl: apiUrl ? 'Definida' : 'No definida',
      apiKey: apiKey ? 'Definida' : 'No definida',
    });

    if (!apiUrl || !apiKey) {
      console.error('API Route - Faltan variables de entorno');
      return NextResponse.json(
        { error: 'Configuración de API no encontrada' },
        { status: 500 }
      );
    }

    const { id } = params;
    console.log('API Route - Book ID:', id);

    const query = `
      query GetBookById {
        books_by_pk(id: ${id}) {
          id
          title
          description
          release_date
          image {
            url
          }
          contributions(limit: 1) {
            author {
              id
              name
              image {
                url
              }
            }
          }
          book_series {
            series {
              id
              name
            }
          }
        }
      }
    `;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${apiKey}`,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Route - Error en respuesta:', errorText);
      throw new Error(
        `Error al obtener los detalles del libro: ${response.status} ${errorText}`
      );
    }

    const data = await response.json();
    console.log('API Route - Datos recibidos:', data);

    if (data.errors) {
      console.error('API Route - Errores GraphQL:', data.errors);
      throw new Error(data.errors[0].message);
    }

    return NextResponse.json(data.data.books_by_pk);
  } catch (error) {
    console.error('API Route - Error:', error);
    return NextResponse.json(
      { error: 'Error al obtener los detalles del libro' },
      { status: 500 }
    );
  }
}
