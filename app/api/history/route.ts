import { NextRequest, NextResponse } from 'next/server';
import getDB from '../../../lib/db';

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get('session')?.value;
        if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

        const db = await getDB();
        const session = db.data!.sessions.find(s => s.token === token);
        if (!session) return NextResponse.json({ error: 'Invalid session' }, { status: 401 });

        const userId = session.userId;
        const list = db.data!.extractions
            .filter(e => e.userId === userId)
            .map(e => ({ id: e.id, filename: e.filename, heraldFileId: e.heraldFileId, createdAt: e.createdAt, metadata: e.metadata }));

        return NextResponse.json({ success: true, history: list });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to load history' }, { status: 500 });
    }
}
