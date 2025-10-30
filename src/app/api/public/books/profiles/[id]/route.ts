import { NextRequest, NextResponse } from 'next/server';
import { sendLog } from '@/utils/logs/logHelper';
import { ELevel } from '@/utils/constants/ELevel';
import { ELogs } from '@/utils/constants/ELogs';
import { Profile } from '@gycoding/nebula';

export async function GET(
  req: NextRequest,
  context: any
) {
  try {

    // In Next.js app routes the second arg can be a thenable; await it before using params
    const { params } = (await context) as { params: { id: string } };
    const profileId = params.id;


    let apiUrl: string | null = null;
    let headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const baseUrl = process.env.GY_API?.replace(/['"]/g, '');

    if (!baseUrl) {
      await sendLog(ELevel.ERROR, ELogs.ENVIROMENT_VARIABLE_NOT_DEFINED);
      throw new Error(ELogs.ENVIROMENT_VARIABLE_NOT_DEFINED);
    }

    apiUrl = `${baseUrl}/books/profiles/${profileId}`;
    headers = {
      ...headers,
    };

    if (!apiUrl) {
      throw new Error(ELogs.API_URL_NOT_DEFINED);
    }

    const gyCodingResponse = await fetch(apiUrl, { headers, method: 'GET' });

    if (!gyCodingResponse.ok) {
      const errorText = await gyCodingResponse.text();
      await sendLog(ELevel.ERROR, ELogs.PROFILE_COULD_NOT_BE_RECEIVED, {
        error: errorText,
      });
      throw new Error(`GyCoding API Error: ${errorText}`);
      
    }
    const data = await gyCodingResponse.json();

    return NextResponse.json(data as Profile);
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
}
