import { auth0 } from '@/lib/auth0';
import { NextRequest, NextResponse } from 'next/server';
import { sendLog } from '@/utils/logs/logHelper';
import { ELevel } from '@/utils/constants/ELevel';
import { ELogs } from '@/utils/constants/ELogs';

async function handler(req: NextRequest) {
  try {
    const SESSION = await auth0.getSession();
    const USER_ID = SESSION?.user.sub;
    const ID_TOKEN = SESSION?.tokenSet?.idToken;

    if (!SESSION) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await sendLog(ELevel.INFO, ELogs.SESSION_RECIVED, { user: USER_ID });

    const baseUrl = process.env.GY_API?.replace(/['"]/g, '');
    if (!baseUrl) {
      await sendLog(ELevel.ERROR, ELogs.ENVIROMENT_VARIABLE_NOT_DEFINED);
      throw new Error(ELogs.ENVIROMENT_VARIABLE_NOT_DEFINED);
    }

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ID_TOKEN}`,
    };

    if (req.method === 'PATCH') {
      const body = await req.json();
      const apiUrl = `${baseUrl}/accounts/books/halloffame/book`;
      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ bookId: body }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        await sendLog(ELevel.ERROR, ELogs.PROFILE_COULD_NOT_BE_RECEIVED, {
          error: errorText,
        });
        throw new Error(`GyCoding API Error: ${errorText}`);
      }

      return new NextResponse(null, { status: 204 });
    } else if (req.method === 'DELETE') {
      const body = await req.json();

      if (!body) {
        return NextResponse.json(
          { error: 'bookId is required' },
          { status: 400 }
        );
      }

      const apiUrl = `${baseUrl}/accounts/books/halloffame/book/${body}`;

      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        await sendLog(ELevel.ERROR, ELogs.PROFILE_COULD_NOT_BE_RECEIVED, {
          error: errorText,
        });
        throw new Error(`GyCoding API Error: ${errorText}`);
      }

      return new NextResponse(null, { status: 204 });
    } else {
      return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
      );
    }
  } catch (error) {
    console.error('Error in /api/auth/books/halloffame:', error);
    await sendLog(ELevel.ERROR, ELogs.PROFILE_COULD_NOT_BE_RECEIVED, {
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      { error: error instanceof Error ? error.message : ELogs.UNKNOWN_ERROR },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  return handler(req);
}

export async function DELETE(req: NextRequest) {
  return handler(req);
}
