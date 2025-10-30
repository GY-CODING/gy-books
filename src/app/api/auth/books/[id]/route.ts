/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth0 } from '@/lib/auth0';
import { NextResponse, NextRequest } from 'next/server';
import { sendLog } from '@/utils/logs/logHelper';
import { ELevel } from '@/utils/constants/ELevel';
import { ELogs } from '@/utils/constants/ELogs';
import { Book, UserData } from '@gycoding/nebula';

async function handler(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const ID = params.id;

  if (!ID) {
    return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
  }

  try {
    const session = await auth0.getSession();
    const idToken = session?.tokenSet?.idToken;

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

      const book = await gyCodingResponse.json();
      return NextResponse.json(book as Book);
    }

    if (request.method === 'PATCH') {
      const BODY = await request.json();

      const progressNumber = parseFloat(BODY.progress as string);

      const USER_DATA: Partial<UserData> = {
          rating: BODY.rating,
          status: BODY.status,
          startDate: BODY.startDate,
          endDate: BODY.endDate,
          progress: progressNumber,
          review: BODY.review,
          editionId: BODY.editionId,
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
      return NextResponse.json({
        bookRatingData: BOOK_RATING_DATA as Book,
      });
    }

    if (request.method === 'DELETE') {
      const gyCodingResponse = await fetch(API_URL, {
        headers: HEADERS,
        method: 'DELETE',
      });

      if (!gyCodingResponse.ok) {
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

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return handler(request, context);
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return handler(request, context);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return handler(request, context);
}
