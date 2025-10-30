/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import {
  GET_BOOKS_BY_IDS_QUERY,
  SEARCH_BOOKS_QUERY,
} from '@/utils/constants/Query';
import { mapHardcoverBooksToList } from '@/mapper/mapHardcoverToBookToBook';

export async function POST(req: NextRequest) {
  try {
    const { ids, query } = await req.json();

    const apiUrl = process.env.HARDCOVER_API_URL;
    const apiKey = process.env.HARDCOVER_API_TOKEN;

    if (!apiUrl || !apiKey) {
      return NextResponse.json(
        { error: 'Missing Hardcover API credentials' },
        { status: 500 }
      );
    }

    let graphQLQuery = '';
    let variables: Record<string, any> = {};

    if (Array.isArray(ids) && ids.length > 0) {
      // 🔹 Obtener varios libros (posible chunking si vienen muchos ids)
      graphQLQuery = GET_BOOKS_BY_IDS_QUERY;
      // variables se construyen por chunk más abajo
      variables = { ids: [] };
    } else if (typeof query === 'string') {
      // 🔹 Buscar libros
      graphQLQuery = SEARCH_BOOKS_QUERY;
      variables = { query };
    } else {
      return NextResponse.json(
        { error: 'Invalid request: must provide ids[] or query' },
        { status: 400 }
      );
    }

    // Si nos pidieron varios ids, hacemos peticiones por batches para evitar
    // URLs/requests demasiado grandes y respetar límites del API.
    if (Array.isArray(ids) && ids.length > 0) {
      const BATCH_SIZE = 50; // configurable

      const chunks: number[][] = [];
      for (let i = 0; i < ids.length; i += BATCH_SIZE) {
        const chunk = ids.slice(i, i + BATCH_SIZE).map((id: any) => parseInt(id, 10));
        chunks.push(chunk);
      }

      // helper para pedir un chunk y devolver rawBooks[]
      const fetchChunk = async (chunkIds: number[]) => {
        const resp = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: apiKey,
          },
          body: JSON.stringify({ query: GET_BOOKS_BY_IDS_QUERY, variables: { ids: chunkIds } }),
        });

        if (!resp.ok) {
          const text = await resp.text();
          console.error('Hardcover API Error (chunk):', text);
          throw new Error(`Hardcover API failed: ${resp.statusText}`);
        }

        const d = await resp.json();
        if (d.errors) throw new Error(d.errors[0]?.message || 'GraphQL error');

        // extraer libros del formato de respuesta (igual que antes)
        if (d.data?.books) return d.data.books;
        if (d.data?.search?.results) {
          if (Array.isArray(d.data.search.results))
            return d.data.search.results.map((h: any) => h.document || h);
          if (d.data.search.results?.hits)
            return d.data.search.results.hits.map((h: any) => h.document || h);
        }
        if (d.data?.books_by_pk) return [d.data.books_by_pk];
        return [];
      };

      // Ejecutar peticiones en paralelo (cada una por chunk) y aplanar resultados
      const chunkResults = await Promise.all(chunks.map((c) => fetchChunk(c)));
      const allRawBooks = chunkResults.flat();

      const mappedBooks = mapHardcoverBooksToList(allRawBooks);
      return NextResponse.json(mappedBooks);
    }

    // Si no es una petición por ids, hacemos la petición única (búsqueda)
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiKey,
      },
      body: JSON.stringify({ query: graphQLQuery, variables }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Hardcover API Error:', text);
      throw new Error(`Hardcover API failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.errors) {
      throw new Error(data.errors[0]?.message || 'GraphQL error');
    }

    // 📘 Detectar formato de respuesta y mapear
    let rawBooks: any[] = [];
    if (data.data?.books) {
      rawBooks = data.data.books;
    } else if (data.data?.search?.results) {
      // Puede ser un array de hits o de documentos
      if (Array.isArray(data.data.search.results)) {
        // Algunos endpoints devuelven results como array de hits
        rawBooks = data.data.search.results.map((h: any) => h.document || h);
      } else if (data.data.search.results?.hits) {
        rawBooks = data.data.search.results.hits.map((h: any) => h.document || h);
      }
    } else if (data.data?.books_by_pk) {
      rawBooks = [data.data.books_by_pk];
    }
    const mappedBooks = mapHardcoverBooksToList(rawBooks);
    return NextResponse.json(mappedBooks);
  } catch (error) {
    console.error('Error in /api/hardcover:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
