import { NextRequest, NextResponse } from 'next/server';
import { sendLog } from '@/utils/logs/logHelper';
import { ELevel } from '@/utils/constants/ELevel';
import { ELogs } from '@/utils/constants/ELogs';
import { HallOfFame } from '@gycoding/nebula';

export const GET = async (req: NextRequest) => {
  try {
    const SEARCH_PARAMS = req.nextUrl.searchParams;
    const PROFILE_ID = SEARCH_PARAMS.get('profileId');

    let apiUrl: string | null = null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const baseUrl = process.env.GY_API?.replace(/['"]/g, '');

    if (!baseUrl) {
      await sendLog(ELevel.ERROR, ELogs.ENVIROMENT_VARIABLE_NOT_DEFINED);
      throw new Error(ELogs.ENVIROMENT_VARIABLE_NOT_DEFINED);
    }

    apiUrl = `${baseUrl}/books/profiles/${PROFILE_ID}/halloffame`;

    if (!apiUrl) {
      throw new Error(ELogs.API_URL_NOT_DEFINED);
    }

    const gyCodingResponse = await fetch(apiUrl, { headers });

    if (!gyCodingResponse.ok) {
      const errorText = await gyCodingResponse.text();
      await sendLog(ELevel.ERROR, ELogs.PROFILE_COULD_NOT_BE_RECEIVED, {
        error: errorText,
      });
      throw new Error(`GyCoding API Error: ${errorText}`);
    }    
    const hallOfFame = await gyCodingResponse.json();
    return NextResponse.json(hallOfFame as HallOfFame);
  } catch (error) {
    console.error('Error in /api/auth/user:', error);
    await sendLog(ELevel.ERROR, ELogs.PROFILE_COULD_NOT_BE_RECEIVED, {
      error: error instanceof Error ? error.message : error,
    });

    return NextResponse.json(
      { error: error instanceof Error ? error.message : ELogs.UNKNOWN_ERROR },
      { status: 500 }
    );
  }
};
