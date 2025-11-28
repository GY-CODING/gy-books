import { auth0 } from '@/lib/auth0';
import { ELevel } from '@/utils/constants/ELevel';
import { ELogs } from '@/utils/constants/ELogs';
import { sendLog } from '@/utils/logs/logHelper';
import { NextRequest, NextResponse } from 'next/server';

async function handler(req: NextRequest) {
  try {
    const SESSION = await auth0.getSession();
    const ID_TOKEN = SESSION?.tokenSet?.idToken;

    if (!SESSION) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const baseUrl = process.env.GY_API?.replace(/['"]/g, '');
    if (!baseUrl) {
      await sendLog(ELevel.ERROR, ELogs.ENVIROMENT_VARIABLE_NOT_DEFINED);
      throw new Error(ELogs.ENVIROMENT_VARIABLE_NOT_DEFINED);
    }

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ID_TOKEN}`,
    };

    const apiUrl = `${baseUrl}/books/profiles/halloffame/book`;

    if (req.method === 'PATCH') {
      const body = await req.json();
      // El body es el bookId directamente según setHallOfFameBook.ts
      // Pero el backend probablemente espera { bookId: "..." } o similar.
      // setHallOfFameBook envía JSON.stringify(bookId).
      // Si el backend espera un objeto, deberíamos envolverlo.
      // Si espera solo el string, lo enviamos tal cual.
      // Asumiremos que el backend espera { bookId: ... } si es un JSON body estándar,
      // o tal vez el string directo.
      // Revisando updateHallOfFame (quote), envía { quote: ... }.
      // Así que aquí probablemente sea { bookId: ... }.

      // setHallOfFameBook envía: JSON.stringify(formData.get('bookId')) -> "123" (string con comillas)
      // Si el backend espera { bookId: "123" }, entonces setHallOfFameBook está enviando mal el body,
      // O el backend acepta el string directo.

      // Vamos a asumir que debemos enviar { bookId: body } si body es el string del ID.

      const payload = typeof body === 'string' ? { bookId: body } : body;
      console.log('PAYLOAD', payload);
      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        await sendLog(ELevel.ERROR, ELogs.PROFILE_COULD_NOT_BE_RECEIVED, {
          error: errorText,
        });
        throw new Error(`GyCoding API Error: ${errorText}`);
      }

      return new NextResponse(null, { status: 204 });
    }

    if (req.method === 'DELETE') {
      const body = await req.json();
      const payload = typeof body === 'string' ? { bookId: body } : body;
      const bookId = payload.bookId;

      if (!bookId) {
        return NextResponse.json(
          { error: 'Book ID is required' },
          { status: 400 }
        );
      }

      // Construir URL con ID: .../book/{bookId}
      const deleteUrl = `${apiUrl}/${bookId}`;

      const response = await fetch(deleteUrl, {
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
    }

    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  } catch (error) {
    console.error('Error in /api/auth/books/profiles/halloffame/book:', error);
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
