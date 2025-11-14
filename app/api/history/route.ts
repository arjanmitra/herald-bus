import { NextRequest, NextResponse } from 'next/server';
import { findSessionById, getUserUploadHistory } from '../../../lib/db';

export async function GET(req: NextRequest) {
    try {
        const sessionId = req.cookies.get('session')?.value;
        if (!sessionId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

        const session = await findSessionById(sessionId);
        if (!session) return NextResponse.json({ error: 'Invalid session' }, { status: 401 });

        const history = await getUserUploadHistory(session.user_id);

        const list = history.map(h => ({
            id: h.id,
            filename: h.filename,
            heraldFileId: h.herald_file_id,
            createdAt: h.created_at,
            metadata: h.metadata
        }));

        return NextResponse.json({ success: true, history: list });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to load history' }, { status: 500 });
    }
}

