/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { sendLog } from '@/utils/logs/logHelper';
import { ELevel } from '@/utils/constants/ELevel';
import { ELogs } from '@/utils/constants/ELogs';
import { Book } from '@gycoding/nebula';

async function handler(request: Request) {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const id = pathParts[pathParts.length - 1];
  if (!id) {
    return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
  }

  try {
    const baseUrl = process.env.GY_API?.replace(/['"]/g, '');
    if (!baseUrl) {
      throw new Error(ELogs.ENVIROMENT_VARIABLE_NOT_DEFINED);
    }

    const apiUrl = `${baseUrl}/books/${id}/public`;

    if (request.method === 'GET') {
      const gyCodingResponse = await fetch(apiUrl, {
        method: 'GET',
      });

      if (!gyCodingResponse.ok) {
        const errorText = await gyCodingResponse.text();
        console.error('GET Error Response:', {
          status: gyCodingResponse.status,
          statusText: gyCodingResponse.statusText,
          error: errorText,
        });
        await sendLog(ELevel.ERROR, ELogs.PROFILE_COULD_NOT_BE_RECEIVED, {
          error: errorText,
        });
        throw new Error(`GyCoding API Error: ${errorText}`);
      }

      const apiBook = await gyCodingResponse.json();

      await sendLog(ELevel.INFO, ELogs.PROFILE_HAS_BEEN_RECEIVED, {
        bookId: id,
      });
      return NextResponse.json(apiBook as Book);
    }

    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  } catch (error) {
    console.error('Error in /api/auth/books/[id]:', error);
    await sendLog(ELevel.ERROR, ELogs.PROFILE_COULD_NOT_BE_RECEIVED, {
      error: error,
    });

    return NextResponse.json(
      { error: error instanceof Error ? error.message : ELogs.UNKNOWN_ERROR },
      { status: 500 }
    );
  }
}

export const GET = handler;
