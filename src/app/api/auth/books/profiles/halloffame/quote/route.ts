import { auth0 } from '@/lib/auth0';
import { ELevel } from '@/utils/constants/ELevel';
import { ELogs } from '@/utils/constants/ELogs';
import { sendLog } from '@/utils/logs/logHelper';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest) {
  try {
    const SESSION = await auth0.getSession();

    if (!SESSION) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const USER_ID = SESSION?.user.sub;
    const ID_TOKEN = SESSION?.tokenSet?.idToken;

    const body = await req.json();
    const quote = body.quote;

    if (SESSION) {
      await sendLog(ELevel.INFO, ELogs.SESSION_RECIVED, { user: USER_ID });
    }

    let apiUrl: string | null = null;
    let headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const baseUrl = process.env.GY_API?.replace(/['\"]/g, '');

    if (!baseUrl) {
      await sendLog(ELevel.ERROR, ELogs.ENVIROMENT_VARIABLE_NOT_DEFINED);
      throw new Error(ELogs.ENVIROMENT_VARIABLE_NOT_DEFINED);
    }

    apiUrl = `${baseUrl}/books/profiles/halloffame/quote`;
    console.log(apiUrl);
    headers = {
      ...headers,
      Authorization: `Bearer ${ID_TOKEN}`,
    };

    if (!apiUrl) {
      throw new Error(ELogs.API_URL_NOT_DEFINED);
    }
    const gyCodingResponse = await fetch(apiUrl, {
      headers,
      method: 'PATCH',
      body: JSON.stringify({ quote: quote }),
    });

    if (!gyCodingResponse.ok) {
      const errorText = await gyCodingResponse.text();
      await sendLog(ELevel.ERROR, ELogs.PROFILE_COULD_NOT_BE_RECEIVED, {
        error: errorText,
      });
      throw new Error(`GyCoding API Error: ${errorText}`);
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error in /api/auth/books/profiles/halloffame/quote:', error);
    await sendLog(ELevel.ERROR, ELogs.PROFILE_COULD_NOT_BE_RECEIVED, {
      error: error,
    });

    return NextResponse.json(
      { error: error instanceof Error ? error.message : ELogs.UNKNOWN_ERROR },
      { status: 500 }
    );
  }
}
