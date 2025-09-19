import { NextRequest, NextResponse } from 'next/server';
import { sendLog } from '@/utils/logs/logHelper';
import { ELevel } from '@/utils/constants/ELevel';
import { ELogs } from '@/utils/constants/ELogs';
import { GET_STATS } from '@/utils/constants/Query';
import { calculateStats } from '@/utils/functions/mapStats';
import { EStatus } from '@/utils/constants/EStatus';

const HARDCOVER_API_URL = process.env.HARDCOVER_API_URL;
const HARDCOVER_API_TOKEN = process.env.HARDCOVER_API_TOKEN;
const GY_API = process.env.GY_API;
const PAGE_SIZE = 20;

async function fetchUserBooksPage(profileId: string, page: number) {
  const url = `${GY_API}/books/${profileId}/list?page=${page}&size=${PAGE_SIZE}`;
  console.log(`🌐 Fetching user books from: ${url}`);

  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
  });

  console.log(`📡 GY API Response status: ${res.status}`);

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`❌ GY API Error (${res.status}):`, errorText);
    throw new Error(errorText);
  }

  const data = await res.json();
  console.log(`✅ GY API Response data:`, data);
  return data;
}

async function fetchBookStats(bookId: number) {
  console.log(`📚 Fetching book stats for ID: ${bookId}`);

  const requestBody = {
    query: GET_STATS,
    variables: { id: bookId },
  };

  console.log(
    `📤 HARDCOVER API Request body:`,
    JSON.stringify(requestBody, null, 2)
  );

  const res = await fetch(HARDCOVER_API_URL!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: HARDCOVER_API_TOKEN!,
    },
    body: JSON.stringify(requestBody),
  });

  console.log(`📡 HARDCOVER API Response status: ${res.status}`);

  if (!res.ok) {
    const text = await res.text();
    console.error(`❌ HARDCOVER API Error (${res.status}):`, text);
    throw new Error(text);
  }

  const data = await res.json();
  console.log(`✅ HARDCOVER API Response data:`, JSON.stringify(data, null, 2));
  return data;
}

async function processBooksInBatches(
  bookIds: number[],
  authors: Record<string, number>,
  stats: { totalPages: number; totalBooks: number }
) {
  console.log(`🔄 Starting batch processing for ${bookIds.length} books`);
  const CONCURRENCY = 5;
  let idx = 0;

  while (idx < bookIds.length) {
    const batch = bookIds.slice(idx, idx + CONCURRENCY);
    console.log(
      `📦 Processing batch ${Math.floor(idx / CONCURRENCY) + 1}: books ${batch.join(', ')}`
    );

    await Promise.all(
      batch.map(async (bookId) => {
        try {
          console.log(`🎯 Processing book ${bookId}...`);
          const bookData = await fetchBookStats(bookId);

          if (!bookData || !bookData.data) {
            console.warn(`⚠️ Book ${bookId} has empty data:`, bookData);
            await sendLog(ELevel.WARN, 'BOOK_STATS_EMPTY', {
              bookId,
              bookData,
            });
            return;
          }

          if (!bookData.data.books_by_pk) {
            console.warn(
              `⚠️ Book ${bookId} missing books_by_pk:`,
              bookData.data
            );
            await sendLog(ELevel.WARN, 'BOOKS_BY_PK_MISSING', {
              bookId,
              bookData,
            });
            return;
          }

          console.log(`✅ Book ${bookId} data valid, calculating stats...`);
          calculateStats(bookData, authors, stats);
          console.log(
            `📊 Book ${bookId} stats updated. Current authors count: ${Object.keys(authors).length}`
          );
        } catch (err) {
          console.error(`❌ Error processing book ${bookId}:`, err);
          await sendLog(ELevel.ERROR, 'BOOK_STATS_ERROR', {
            bookId,
            error: (err as Error).message,
          });
        }
      })
    );

    idx += CONCURRENCY;
    console.log(`⏳ Batch completed, waiting 150ms before next batch...`);
    // Pequeña pausa para evitar rate limits
    await new Promise((r) => setTimeout(r, 150));
  }

  console.log(
    `🎉 Batch processing completed. Final authors: ${Object.keys(authors).length}`
  );
}

export const GET = async (req: NextRequest) => {
  console.log('🚀 STATS API STARTED - Request received');
  console.log('📍 Request URL:', req.url);
  console.log('📍 Request method:', req.method);

  try {
    console.log('🔧 Checking environment variables...');
    console.log('HARDCOVER_API_URL:', HARDCOVER_API_URL ? 'SET' : 'NOT SET');
    console.log(
      'HARDCOVER_API_TOKEN:',
      HARDCOVER_API_TOKEN ? 'SET' : 'NOT SET'
    );
    console.log('GY_API:', GY_API ? 'SET' : 'NOT SET');

    if (!HARDCOVER_API_TOKEN || !HARDCOVER_API_URL || !GY_API) {
      console.error('❌ Environment variables missing');
      throw new Error(ELogs.ENVIROMENT_VARIABLE_NOT_DEFINED);
    }

    const profileId = req.nextUrl.pathname.split('/')[4];
    console.log('👤 Profile ID extracted:', profileId);

    if (!profileId) {
      console.error('❌ Profile ID missing in path');
      throw new Error('Profile ID missing in path');
    }

    const authors: Record<string, number> = {};
    const stats = { totalPages: 0, totalBooks: 0 };
    const bookStatus: Record<string, number> = {};
    const processedBookIds = new Set<string>();
    let currentPage = 0;
    let hasMore = true;
    const readBooks: number[] = [];

    console.log('📚 Starting to collect user books...');

    // 1. Recopilar todos los libros leídos
    while (hasMore) {
      console.log(`📄 Fetching page ${currentPage}...`);
      let userBooks;
      try {
        userBooks = await fetchUserBooksPage(profileId, currentPage);
        console.log(
          `✅ Page ${currentPage} fetched successfully, books count:`,
          Array.isArray(userBooks) ? userBooks.length : 'NOT_ARRAY'
        );
      } catch (error) {
        console.error(`❌ Error fetching page ${currentPage}:`, error);
        await sendLog(ELevel.ERROR, ELogs.PROFILE_BOOKS_CANNOT_BE_RECEIVED, {
          error: (error as Error).message,
        });
        throw error;
      }

      if (!Array.isArray(userBooks) || userBooks.length === 0) {
        console.log(
          `🛑 No more books or invalid response on page ${currentPage}`
        );
        break;
      }

      console.log(
        `🔄 Processing ${userBooks.length} books from page ${currentPage}...`
      );

      for (const book of userBooks) {
        try {
          const bookIdStr = book.id || book.bookId || book?.book?.id;
          console.log(`📖 Processing book:`, {
            id: bookIdStr,
            status: book.userData?.status,
          });

          if (!bookIdStr || processedBookIds.has(bookIdStr)) {
            console.log(
              `⏭️ Skipping book (already processed or no ID):`,
              bookIdStr
            );
            continue;
          }

          processedBookIds.add(bookIdStr);
          const bookId = parseInt(bookIdStr, 10);

          if (isNaN(bookId)) {
            console.log(`⚠️ Invalid book ID:`, bookIdStr);
            continue;
          }

          const status = book.userData?.status || 'unknown';
          bookStatus[status] = (bookStatus[status] || 0) + 1;

          if (status === EStatus.READ) {
            readBooks.push(bookId);
            console.log(`📚 Added read book:`, bookId);
          }
        } catch (err) {
          console.error('❌ Error processing individual book:', err);
          await sendLog(ELevel.ERROR, 'BOOK_PROCESS_ERROR', {
            error: (err as Error).message,
          });
        }
      }

      hasMore = userBooks.length === PAGE_SIZE;
      console.log(`🔄 Page ${currentPage} completed. Has more: ${hasMore}`);
      currentPage++;
    }

    console.log('📊 Books collection completed');
    console.log('📈 Total books processed:', processedBookIds.size);
    console.log('📖 Read books count:', readBooks.length);
    console.log('📊 Book status distribution:', bookStatus);

    // 2. Procesar libros leídos en paralelo (concurrencia limitada)
    console.log('🚀 Starting to process read books...');
    await processBooksInBatches(readBooks, authors, stats);

    console.log('✅ Book processing completed');
    console.log('📊 Final stats:', {
      authors: Object.keys(authors).length,
      totalPages: stats.totalPages,
      totalBooks: stats.totalBooks,
    });

    // 3. Log extra si no hay autores
    if (Object.keys(authors).length === 0) {
      console.log('⚠️ No authors found!');
      await sendLog(ELevel.WARN, 'NO_AUTHORS_FOUND', {
        profileId,
        readBooksCount: readBooks.length,
        stats,
      });
    }

    const response = {
      authors,
      totalPages: stats.totalPages,
      totalBooks: stats.totalBooks,
      bookStatus,
    };

    console.log('📤 Sending response:', response);
    return NextResponse.json(response);
  } catch (error) {
    console.error('💥 Error in stats API:', error);
    await sendLog(ELevel.ERROR, ELogs.LIBRARY_CANNOT_BE_RECEIVED, {
      error: (error as Error).message || ELogs.UNKNOWN_ERROR,
    });
    return NextResponse.json(
      { error: (error as Error).message || ELogs.UNKNOWN_ERROR },
      { status: 500 }
    );
  }
};
