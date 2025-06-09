/* eslint-disable @typescript-eslint/no-explicit-any */
import { mapHardcoverToBook } from '@/mapper/books.mapper';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  console.log('API Route - Request received');

  const searchParams = req.nextUrl.searchParams;
  const queryParam = searchParams.get('query');
  console.log('API Route - Query:', queryParam);

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error('API Route - API_KEY is not defined');
    return NextResponse.json(
      { error: 'API_KEY is not defined' },
      { status: 500 }
    );
  }

  const query = `
    query SearchBooks($query: String!) {
      search(query: $query) {
        error
        page
        per_page
        query
        query_type
        results
      }
    }
  `;

  try {
    const apiUrl = process.env.HARDCOVER_API_URL;
    const apiKey = process.env.HARDCOVER_API_TOKEN;

    console.log('API Route - Environment variables check:');
    console.log('HARDCOVER_API_URL exists:', !!apiUrl);
    console.log('HARDCOVER_API_KEY exists:', !!apiKey);
    console.log('HARDCOVER_API_URL:', apiUrl);
    console.log('HARDCOVER_API_KEY length:', apiKey?.length);

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
        query: query,
        variables: {
          query: queryParam,
        },
      }),
    });

    console.log('API Route - Backend response status:', response.status);
    console.log(
      'API Route - Response headers:',
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Route - Backend error:', errorText);
      return NextResponse.json(
        { error: `Backend error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('API Route - Backend data received:', data);

    // Mapear los resultados usando el mapper
    const books = data.data.search.results.hits.map((hit: any) => {
      console.log('Processing book:', {
        id: hit.document.id,
        title: hit.document.title,
        hasImage: !!hit.document.image,
        imageUrl: hit.document.image?.url,
      });
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
