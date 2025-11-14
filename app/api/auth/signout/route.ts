import { NextRequest, NextResponse } from 'next/server';
import { deleteSession } from '../../../../lib/db';

export async function POST(req: NextRequest) {
    try {
        const sessionId = req.cookies.get('session')?.value;
        if (sessionId) {
            await deleteSession(sessionId);
        }

        const res = NextResponse.json({ success: true });
        res.cookies.set('session', '', { httpOnly: true, path: '/', maxAge: 0 });
        return res;
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Signout failed' }, { status: 500 });
    }
}

