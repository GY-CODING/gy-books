import { auth0 } from '@/lib/auth0';
import { ELevel } from '@/utils/constants/ELevel';
import { ELogs } from '@/utils/constants/ELogs';
import { sendLog } from '@/utils/logs/logHelper';
import { FriendRequest } from '@gycoding/nebula';
import { MongoClient } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

async function handler(req: NextRequest) {
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

    const baseUrl = process.env.GY_API?.replace(/['\"]/g, '');
    const MONGO_URI = process.env.MONGO_URI;

    if (!baseUrl) {
      await sendLog(ELevel.ERROR, ELogs.ENVIROMENT_VARIABLE_NOT_DEFINED);
      return NextResponse.json(
        { error: ELogs.ENVIROMENT_VARIABLE_NOT_DEFINED },
        { status: 500 }
      );
    }

    const apiUrl = `${baseUrl}/books/friends/request`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ID_TOKEN}`,
    };

    if (req.method === 'POST') {
      const body = await req.json();
      const toUserId = body.userId || body.to;

      if (!toUserId) {
        return NextResponse.json(
          { error: 'User ID is required' },
          { status: 400 }
        );
      }

      const gyCodingResponse = await fetch(apiUrl, {
        headers,
        method: 'POST',
        body: JSON.stringify({ to: toUserId }),
      });

      if (!gyCodingResponse.ok) {
        const errorText = await gyCodingResponse.text();
        await sendLog(ELevel.ERROR, ELogs.PROFILE_COULD_NOT_BE_RECEIVED, {
          error: errorText,
        });
        return NextResponse.json(
          { error: errorText },
          { status: gyCodingResponse.status }
        );
      }

      const data = await gyCodingResponse.json();
      await sendLog(ELevel.INFO, ELogs.PROFILE_HAS_BEEN_RECEIVED, { data });
      return NextResponse.json(data);
    }

    if (req.method === 'GET') {
      const url = new URL(
        req.url,
        process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      );
      const profileId = url.searchParams.get('profileId');

      if (!MONGO_URI) {
        await sendLog(ELevel.ERROR, ELogs.ENVIROMENT_VARIABLE_NOT_DEFINED);
        return NextResponse.json(
          { error: ELogs.ENVIROMENT_VARIABLE_NOT_DEFINED },
          { status: 500 }
        );
      }

      const client = new MongoClient(MONGO_URI);

      try {
        await client.connect();

        const db = client.db('GYBooks');
        const collection = db.collection('FriendRequest');
        const data = await collection.find({ to: profileId }).toArray();

        return NextResponse.json(data as unknown as FriendRequest[]);
      } catch (error) {
        console.error('Error fetching friend requests:', error);
        await sendLog(ELevel.ERROR, ELogs.PROFILE_COULD_NOT_BE_RECEIVED, {
          error: error instanceof Error ? error.message : String(error),
        });
        return NextResponse.json(
          {
            error: error instanceof Error ? error.message : ELogs.UNKNOWN_ERROR,
          },
          { status: 500 }
        );
      } finally {
        await client.close();
      }
    }

    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  } catch (error) {
    console.error('Error in /api/auth/books/friends/request:', error);
    await sendLog(ELevel.ERROR, ELogs.PROFILE_COULD_NOT_BE_RECEIVED, {
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      { error: error instanceof Error ? error.message : ELogs.UNKNOWN_ERROR },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return handler(req);
}

export async function GET(req: NextRequest) {
  return handler(req);
}
