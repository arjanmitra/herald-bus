import { NextRequest, NextResponse } from 'next/server';
import { findSessionById } from '../../../../lib/db';
import { sql } from '@vercel/postgres';

export async function DELETE(req: NextRequest) {
    try {
        const sessionId = req.cookies.get('session')?.value;
        if (!sessionId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

        const session = await findSessionById(sessionId);
        if (!session) return NextResponse.json({ error: 'Invalid session' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const uploadId = searchParams.get('id');

        if (!uploadId) {
            return NextResponse.json({ error: 'Upload ID required' }, { status: 400 });
        }

        // Verify the upload belongs to the current user before deleting
        const result = await sql`
            DELETE FROM upload_history 
            WHERE id = ${uploadId} AND user_id = ${session.user_id}
            RETURNING id
        `;

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Upload not found or not authorized' }, { status: 404 });
        }

        console.log('[delete] Successfully deleted upload:', uploadId);
        return NextResponse.json({ success: true, message: 'Upload deleted successfully' });
    } catch (err) {
        console.error('[delete] Error:', err);
        return NextResponse.json({ error: 'Failed to delete upload' }, { status: 500 });
    }
}