/* eslint-disable @typescript-eslint/no-explicit-any */
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';
import { sendLog } from '@/utils/logs/logHelper';
import { ELevel } from '@/utils/constants/ELevel';
import { ELogs } from '@/utils/constants/ELogs';
import { ApiBook } from '@/domain/apiBook.model';

async function handler(request: Request) {
  const url = new URL(request.url);
  const ID = url.pathname.split('/').pop();

  if (!ID) {
    return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
  }

  try {
    const session = await getSession();
    const idToken = session?.idToken;

    if (!session || !idToken) {
      await sendLog(ELevel.ERROR, ELogs.NO_ACTIVE_SESSION);
      return NextResponse.json(
        { error: 'No active session found' },
        { status: 401 }
      );
    }

    const baseUrl = process.env.GY_API?.replace(/['"]/g, '');
    if (!baseUrl) {
      throw new Error(ELogs.ENVIROMENT_VARIABLE_NOT_DEFINED);
    }

    const API_URL = `${baseUrl}/books/${ID}`;
    const HEADERS = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    };

    if (request.method === 'GET') {
      const gyCodingResponse = await fetch(API_URL, {
        headers: HEADERS,
        method: 'GET',
      });

      if (gyCodingResponse.status === 404) {
        return NextResponse.json(
          {
            id: ID,
            averageRating: 0,
            userData: null,
          },
          { status: 200 }
        );
      }
      if (!gyCodingResponse.ok) {
        const errorText = await gyCodingResponse.text();
        console.error('GET Error Response:', {
          status: gyCodingResponse.status,
          statusText: gyCodingResponse.statusText,
          error: errorText,
        });
        await sendLog(ELevel.ERROR, ELogs.BOOK_ERROR, {
          error: errorText,
        });
        throw new Error(`GyCoding API Error: ${errorText}`);
      }

      const API_BOOK = await gyCodingResponse.json();
      return NextResponse.json(API_BOOK as ApiBook);
    }

    if (request.method === 'PATCH') {
      const BODY = await request.json();

      const USER_DATA = {
        userData: {
          rating: BODY.rating,
          status: BODY.status,
          startDate: BODY.startDate,
          endDate: BODY.endDate,
        },
      };

      const gyCodingResponse = await fetch(API_URL, {
        headers: HEADERS,
        method: 'PATCH',
        body: JSON.stringify(USER_DATA),
      });

      if (!gyCodingResponse.ok) {
        await sendLog(ELevel.ERROR, 'BOOK CANNOT BE UPDATED');
        return NextResponse.json(
          { error: 'ERROR UPDATING BOOK DATA' },
          { status: 500 }
        );
      }

      const BOOK_RATING_DATA = await gyCodingResponse.json();
      console.log(`PATCH RESPONSE ${JSON.stringify(BOOK_RATING_DATA)}`);
      return NextResponse.json({
        bookRatingData: BOOK_RATING_DATA as ApiBook,
      });
    }

    if (request.method === 'DELETE') {
      console.log('API URL', API_URL);
      console.log('BOOK ID ', ID);
      const gyCodingResponse = await fetch(API_URL, {
        headers: HEADERS,
        method: 'DELETE',
      });

      if (!gyCodingResponse.ok) {
        console.log('DELETE RESPONSE', gyCodingResponse);

        await sendLog(ELevel.ERROR, 'BOOK CANNOT BE DELETED');
        return NextResponse.json(
          { error: 'ERROR DELETING BOOK' },
          { status: 500 }
        );
      }

      return NextResponse.json(204);
    }

    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  } catch (error) {
    console.error('Error in /api/auth/books/[id]:', error);
    await sendLog(ELevel.ERROR, ELogs.BOOK_ERROR, {
      error: error,
    });

    return NextResponse.json(
      { error: error instanceof Error ? error.message : ELogs.UNKNOWN_ERROR },
      { status: 500 }
    );
  }
}

export const PATCH = withApiAuthRequired(handler); //ACTUALIZAR LIBRO
export const GET = withApiAuthRequired(handler); //OBTENER LIBRO CON INFO DEL USUARIO
export const DELETE = withApiAuthRequired(handler); //ELIMINAR LIBRO
