import { NextRequest, NextResponse } from 'next/server';
import { findSessionById, findUserById } from '../../../../lib/db';

export async function GET(req: NextRequest) {
    try {
        const sessionId = req.cookies.get('session')?.value;
        if (!sessionId) return NextResponse.json({ authenticated: false });

        const session = await findSessionById(sessionId);
        if (!session) return NextResponse.json({ authenticated: false });

        const user = await findUserById(session.user_id);
        if (!user) return NextResponse.json({ authenticated: false });

        return NextResponse.json({ authenticated: true, user: { id: user.id, email: user.email } });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ authenticated: false });
    }
}

