import { NextResponse } from 'next/server';
import { initDB } from '../../../lib/db';

export async function GET() {
    try {
        const success = await initDB();
        if (success) {
            return NextResponse.json({
                message: 'Database initialized successfully',
                tables: ['users', 'sessions', 'upload_history']
            });
        }
        return NextResponse.json({ error: 'Database initialization failed' }, { status: 500 });
    } catch (error) {
        console.error('Init DB error:', error);
        return NextResponse.json({
            error: 'Database initialization failed',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
