import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';
import { sendLog } from '@/utils/logs/logHelper';
import { ELevel } from '@/utils/constants/ELevel';
import { ELogs } from '@/utils/constants/ELogs';
import { User } from '@/domain/user.model';

export const GET = withApiAuthRequired(async () => {
  try {
    const session = await getSession();
    const userId = session?.user.sub;
    const accessToken = session?.accessToken;

    if (session) {
      await sendLog(ELevel.INFO, ELogs.SESSION_RECIVED, { user: userId });
    }

    // Configuración base
    let apiUrl: string | null = null;
    let headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const env = process.env.GY_ENVIRONMENT;

    if (env === 'STAGING') {
      const baseUrl = process.env.GY_API_STAGING?.replace(/['"]/g, '');
      const apiKey = process.env.GY_API_KEY;

      if (!baseUrl || !apiKey) {
        throw new Error(ELogs.ENVIROMENT_VARIABLE_NOT_DEFINED);
      }

      apiUrl = `${baseUrl}/user/profile`;
      headers = {
        ...headers,
        'x-user-id': userId!,
        'x-api-key': apiKey,
      };
    }

    if (env === 'PRODUCTION') {
      const baseUrl = process.env.GY_API?.replace(/['"]/g, '');

      if (!baseUrl || !accessToken) {
        throw new Error(ELogs.ENVIROMENT_VARIABLE_NOT_DEFINED);
      }

      apiUrl = `${baseUrl}/accounts/user/profile`;
      headers = {
        ...headers,
        Authorization: `Bearer ${accessToken}`,
      };
    }

    if (!apiUrl) {
      throw new Error('API URL not defined');
    }

    // Llamada unificada
    const gyCodingResponse = await fetch(apiUrl, { headers });

    if (!gyCodingResponse.ok) {
      const errorText = await gyCodingResponse.text();
      await sendLog(ELevel.ERROR, ELogs.PROFILE_COULD_NOT_BE_RECEIVED, {
        error: errorText,
      });
      throw new Error(`GyCoding API Error: ${errorText}`);
    }

    const gyCodingData = await gyCodingResponse.json();

    await sendLog(ELevel.INFO, ELogs.PROFILE_HAS_BEEN_RECEIVED, {
      user: gyCodingData.username,
      status: gyCodingResponse.status,
    });

    return NextResponse.json({
      gyCodingUser: gyCodingData as User,
    });
  } catch (error) {
    console.error('Error in /api/auth/user:', error);
    await sendLog(ELevel.ERROR, ELogs.PROFILE_COULD_NOT_BE_RECEIVED, {
      error: error,
    });

    return NextResponse.json(
      { error: error instanceof Error ? error.message : ELogs.UNKNOWN_ERROR },
      { status: 500 }
    );
  }
});
