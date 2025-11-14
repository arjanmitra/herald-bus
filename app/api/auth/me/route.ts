import { NextRequest, NextResponse } from 'next/server';
import getDB from '../../../../lib/db';

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get('session')?.value;
        if (!token) return NextResponse.json({ authenticated: false });

        const db = await getDB();
        const session = db.data!.sessions.find((s: any) => s.token === token);
        if (!session) return NextResponse.json({ authenticated: false });

        const user = db.data!.users.find(u => u.id === session.userId);
        if (!user) return NextResponse.json({ authenticated: false });

        return NextResponse.json({ authenticated: true, user: { id: user.id, email: user.email } });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ authenticated: false });
    }
}
