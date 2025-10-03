/* eslint-disable @typescript-eslint/no-explicit-any */
import { mapHardcoverToBook } from '@/mapper/books.mapper';
import { NextRequest, NextResponse } from 'next/server';
import { SEARCH_BOOKS_QUERY } from '@/utils/constants/Query';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const queryParam = searchParams.get('query');

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error('API Route - API_KEY is not defined');
    return NextResponse.json(
      { error: 'API_KEY is not defined' },
      { status: 500 }
    );
  }

  try {
    const apiUrl = process.env.HARDCOVER_API_URL;
    const apiKey = process.env.HARDCOVER_API_TOKEN;

    if (!apiUrl || !apiKey) {
      console.error('API Route - Missing environment variables');
      return NextResponse.json(
        { error: 'Missing environment variables' },
        { status: 500 }
      );
    }

    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiKey,
      },
      method: 'POST',
      body: JSON.stringify({
        query: SEARCH_BOOKS_QUERY,
        variables: {
          query: queryParam,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Route - Backend error:', errorText);
      return NextResponse.json(
        { error: `Backend error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Mapear los resultados usando el mapper
    const books = data.data.search.results.hits.map((hit: any) => {
      return mapHardcoverToBook(hit.document);
    });

    return NextResponse.json({ books });
  } catch (error: any) {
    console.error('API Route - Error:', error);
    return NextResponse.json(
      { error: `Failed to fetch from backend: ${error.message}` },
      { status: 500 }
    );
  }
}
