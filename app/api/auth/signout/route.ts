import { NextRequest, NextResponse } from 'next/server';
import getDB from '../../../../lib/db';

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get('session')?.value;
        if (token) {
            const db = await getDB();
            db.data!.sessions = db.data!.sessions.filter(s => s.token !== token);
            await db.write();
        }

        const res = NextResponse.json({ success: true });
        res.cookies.set('session', '', { httpOnly: true, path: '/', maxAge: 0 });
        return res;
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Signout failed' }, { status: 500 });
    }
}
