import { feedActivity } from '@/domain/activity.model';
import { auth0 } from '@/lib/auth0';
import { ELevel } from '@/utils/constants/ELevel';
import { ELogs } from '@/utils/constants/ELogs';
import { sendLog } from '@/utils/logs/logHelper';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest) {
  try {
    const SESSION = await auth0.getSession();

    if (!SESSION) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const USER_ID = SESSION?.user.sub;
    const ID_TOKEN = SESSION?.tokenSet?.idToken;

    if (SESSION) {
      await sendLog(ELevel.INFO, ELogs.SESSION_RECIVED, { user: USER_ID });
    }

    const baseUrl = process.env.GY_API?.replace(/['"]/g, '');

    if (!baseUrl) {
      await sendLog(ELevel.ERROR, ELogs.ENVIROMENT_VARIABLE_NOT_DEFINED);
      throw new Error(ELogs.ENVIROMENT_VARIABLE_NOT_DEFINED);
    }

    // Extraer page y size de la query
    const { searchParams } = _req.nextUrl;
    const page = searchParams.get('page') ?? '0';
    const size = searchParams.get('size') ?? '50';

    const apiUrl = `${baseUrl}/books/activity?page=${page}&size=${size}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ID_TOKEN}`,
    };

    const gyCodingResponse = await fetch(apiUrl, { headers });

    if (!gyCodingResponse.ok) {
      const errorText = await gyCodingResponse.text();
      await sendLog(ELevel.ERROR, ELogs.ACTIVITY_FETCH_ERROR, {
        error: errorText,
      });
      throw new Error(`GyCoding API Error: ${errorText}`);
    }

    const activities = await gyCodingResponse.json();
    // Leer el header X-Has-Next de la respuesta de la API
    const hasNext = gyCodingResponse.headers.get('x-has-next');
    console.log('Has next page:', hasNext);
    // Crear respuesta y setear el header X-Has-Next
    const response = NextResponse.json(activities as feedActivity[]);
    if (hasNext !== null) {
      response.headers.set('X-Has-Next', hasNext);
    }
    return response;
  } catch (error) {
    console.error('Error in /api/auth/books/activity:', error);
    await sendLog(ELevel.ERROR, ELogs.ACTIVITY_FETCH_ERROR, {
      error: error,
    });

    return NextResponse.json(
      { error: error instanceof Error ? error.message : ELogs.UNKNOWN_ERROR },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const SESSION = await auth0.getSession();

    if (!SESSION) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const USER_ID = SESSION?.user.sub;
    const ID_TOKEN = SESSION?.tokenSet?.idToken;

    if (SESSION) {
      await sendLog(ELevel.INFO, ELogs.SESSION_RECIVED, { user: USER_ID });
    }

    const body = await req.json();
    const { message } = body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.GY_API?.replace(/['"]/g, '');

    if (!baseUrl) {
      await sendLog(ELevel.ERROR, ELogs.ENVIROMENT_VARIABLE_NOT_DEFINED);
      throw new Error(ELogs.ENVIROMENT_VARIABLE_NOT_DEFINED);
    }

    const apiUrl = `${baseUrl}/books/activity`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ID_TOKEN}`,
    };

    const gyCodingResponse = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ message }),
    });

    if (!gyCodingResponse.ok) {
      const errorText = await gyCodingResponse.text();
      await sendLog(ELevel.ERROR, ELogs.ACTIVITY_CREATE_ERROR, {
        error: errorText,
      });
      throw new Error(`GyCoding API Error: ${errorText}`);
    }

    const activity = await gyCodingResponse.json();

    return NextResponse.json(activity as feedActivity);
  } catch (error) {
    console.error('Error creating activity:', error);
    await sendLog(ELevel.ERROR, ELogs.ACTIVITY_CREATE_ERROR, {
      error: error,
    });

    return NextResponse.json(
      { error: error instanceof Error ? error.message : ELogs.UNKNOWN_ERROR },
      { status: 500 }
    );
  }
}
