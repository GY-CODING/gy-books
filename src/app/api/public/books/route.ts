import { NextRequest, NextResponse } from 'next/server';
import { sendLog } from '@/utils/logs/logHelper';
import { ELevel } from '@/utils/constants/ELevel';
import { ELogs } from '@/utils/constants/ELogs';
import { Book } from '@gycoding/nebula';

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get('profileId');
    const page = searchParams.get('page') || '0';
    const size = searchParams.get('size') || '50';
    if (!profileId) {
      return NextResponse.json(
        { error: 'Missing profileId param' },
        { status: 400 }
      );
    }

    const apiUrl = `${process.env.GY_API}/books/${profileId}/list?page=${page}&size=${size}`;
    const headers = {
      'Content-Type': 'application/json',
    };

    const response = await fetch(apiUrl, { headers, method: 'GET' });
    const data = await response.json();

    if (!response.ok) {
      await sendLog(ELevel.ERROR, ELogs.PROFILE_BOOKS_CANNOT_BE_RECEIVED, {
        error: data,
      });
      throw new Error(
        `${ELogs.PROFILE_BOOKS_CANNOT_BE_RECEIVED}: ${JSON.stringify(data)}`
      );
    }

    return NextResponse.json(data as Book[]);
  } catch (error) {
    console.error('Error in /api/accounts/users/[id]/books', error);
    await sendLog(ELevel.ERROR, ELogs.LIBRARY_CANNOT_BE_RECEIVED, {
      error: error instanceof Error ? error.message : ELogs.UNKNOWN_ERROR,
    });

    return NextResponse.json(
      { error: error instanceof Error ? error.message : ELogs.UNKNOWN_ERROR },
      { status: 500 }
    );
  }
};
