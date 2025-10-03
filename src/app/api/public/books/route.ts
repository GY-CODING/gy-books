import { NextRequest, NextResponse } from 'next/server';
import { sendLog } from '@/utils/logs/logHelper';
import { ELevel } from '@/utils/constants/ELevel';
import { ELogs } from '@/utils/constants/ELogs';
import { GET_BOOK_BY_ID_QUERY } from '@/utils/constants/Query';
import { mapHardcoverToBook } from '@/mapper/books.mapper';
import Book from '@/domain/book.model';

export const GET = async (req: NextRequest) => {
  try {
    const HARDCOVER_API_URL = process.env.HARDCOVER_API_URL;
    const HARDCOVER_API_TOKEN = process.env.HARDCOVER_API_TOKEN;
    const profileId = req.nextUrl.pathname.split('/')[4]; // [id]

    if (!HARDCOVER_API_TOKEN || !HARDCOVER_API_URL) {
      throw new Error(ELogs.ENVIROMENT_VARIABLE_NOT_DEFINED);
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '0', 10);
    const size = parseInt(searchParams.get('size') || '10', 10);

    const apiUrl = `${process.env.GY_API}/books/${profileId}/list?page=${page}&size=${size}`;
    const headers = {
      'Content-Type': 'application/json',
    };

    const response = await fetch(apiUrl, { headers, method: 'GET' });

    if (!response.ok) {
      const errorText = await response.text();
      await sendLog(ELevel.ERROR, ELogs.PROFILE_BOOKS_CANNOT_BE_RECEIVED, {
        error: errorText,
      });
      throw new Error(
        `${ELogs.PROFILE_BOOKS_CANNOT_BE_RECEIVED}: ${errorText}`
      );
    }

    const RATINGS_DATA = await response.json();

    const LIBRARY: { books: Book[]; hasMore: boolean } = {
      books: [],
      hasMore: RATINGS_DATA.length === size,
    };

    for (const book of RATINGS_DATA) {
      try {
        const bookResponse = await fetch(HARDCOVER_API_URL!, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${HARDCOVER_API_TOKEN}`,
          },
          body: JSON.stringify({
            query: GET_BOOK_BY_ID_QUERY,
            variables: {
              id: parseInt(book.id),
            },
          }),
        });

        if (!bookResponse.ok) {
          console.error(
            `Error fetching book ${book.bookId}:`,
            await bookResponse.text()
          );
          continue;
        }

        const bookData = await bookResponse.json();

        const MAPPED_BOOK: Book = {
          ...mapHardcoverToBook(bookData.data.books_by_pk),
          id: book.id,
          rating: book.userData.rating,
          series: bookData.data.books_by_pk.book_series?.[0]?.series
            ? {
                id: bookData.data.books_by_pk.book_series[0].series.id,
                name: bookData.data.books_by_pk.book_series[0].series.name,
              }
            : null,
          status: book.userData.status,
        };

        LIBRARY.books.push(MAPPED_BOOK);
      } catch (error) {
        console.error(`Error processing book ${book.bookId}:`, error);
      }
    }

    return NextResponse.json(LIBRARY);
  } catch (error) {
    console.error('Error in /api/accounts/users/[id]/books', error);
    await sendLog(ELevel.ERROR, ELogs.LIBRARY_CANNOT_BE_RECEIVED, {
      error: error instanceof Error ? error.message : ELogs.UNKNOWN_ERROR,
    });

    return NextResponse.json(
      { error: error instanceof Error ? error.message : ELogs.UNKNOWN_ERROR },
      { status: 500 }
    );
  }
};
