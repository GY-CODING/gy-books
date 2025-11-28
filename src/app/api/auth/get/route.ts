/* eslint-disable @typescript-eslint/no-unused-vars */
import { User } from '@/domain/user.model';
import { auth0 } from '@/lib/auth0';
import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';
/**
 * @swagger
 * /api/auth/get:
 *   get:
 *     summary: Obtiene el usuario autenticado / perfil
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             example:
 *               id: "123e4567-e89b-12d3-a456-426614174000"
 *               username: "username123"
 *               email: "user@gycoding.com"
 *               phoneNumber: "+34 600000000"
 *               roles:
 *                 - "COMMON"
 *               apiKey: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
 *               picture: "https://api.gycoding.com/user/picture/id"
 *               biography: "Aquí una biografía ficticia."
 */

export async function GET() {
  const session = await auth0.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session?.user.sub;

  if (!userId) {
    return NextResponse.json({ error: 'No user session' }, { status: 401 });
  }

  const uri = process.env.MONGO_URI;
  if (!uri) {
    return NextResponse.json({ error: 'Missing Mongo URI' }, { status: 500 });
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const db = client.db('GYAccounts');
    const db_books = client.db('GYBooks');
    const collection = db.collection('Metadata');
    const collection_books = db_books.collection('Metadata');
    const userDoc = await collection.findOne({ userId });
    const profileId = userDoc!.profile?.id;
    const userBooksDoc = await collection_books.findOne({ profileId });

    if (!userDoc) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...userDoc.profile,
      biography: userBooksDoc?.biography || '',
    } as User);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
