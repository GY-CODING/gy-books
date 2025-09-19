import { NextResponse, NextRequest } from 'next/server';
import { sendLog } from '@/utils/logs/logHelper';
import { ELevel } from '@/utils/constants/ELevel';
import { ELogs } from '@/utils/constants/ELogs';
import { User } from '@/domain/friend.model';
import { auth0 } from '@/lib/auth0';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const ID = params.id;
    const SESSION = await auth0.getSession();

    if (!SESSION) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const USER_ID = SESSION?.user.sub;
    const ID_TOKEN = SESSION?.tokenSet?.idToken;

    if (!ID) {
      return NextResponse.json(
        { error: 'Book ID is required' },
        { status: 400 }
      );
    }

    if (SESSION) {
      await sendLog(ELevel.INFO, ELogs.SESSION_RECIVED, { user: USER_ID });
    }

    const baseUrl = process.env.GY_API?.replace(/['"]/g, '');
    if (!baseUrl) {
      throw new Error(ELogs.ENVIROMENT_VARIABLE_NOT_DEFINED);
    }

    const API_URL = `${baseUrl}/accounts/books/${ID}`;
    const HEADERS = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ID_TOKEN}`,
    };

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

    const USER = await gyCodingResponse.json();
    return NextResponse.json(USER as User);
  } catch (error) {
    console.error('Error in /api/accounts/users/[id]:', error);
    await sendLog(ELevel.ERROR, ELogs.BOOK_ERROR, {
      error: error,
    });

    return NextResponse.json(
      { error: error instanceof Error ? error.message : ELogs.UNKNOWN_ERROR },
      { status: 500 }
    );
  }
}
