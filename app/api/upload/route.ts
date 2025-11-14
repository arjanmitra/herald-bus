import { NextRequest, NextResponse } from 'next/server';
import getDB from '../../../lib/db';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Validate file type
        if (file.type !== 'application/pdf') {
            return NextResponse.json(
                { error: 'File must be a PDF' },
                { status: 400 }
            );
        }

        // Validate file size (e.g., max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'File size exceeds 10MB limit' },
                { status: 400 }
            );
        }

        // Get Herald API key from environment
        const heraldApiKey = process.env.HERALD_API_KEY;
        if (!heraldApiKey) {
            return NextResponse.json(
                { error: 'Herald API key not configured' },
                { status: 500 }
            );
        }

        // Create FormData for Herald API
        const heraldFormData = new FormData();
        heraldFormData.append('file', file);

        // Upload to Herald API
        const heraldResponse = await fetch('https://sandbox.heraldapi.com/files', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${heraldApiKey}`,
            },
            body: heraldFormData,
        });

        if (!heraldResponse.ok) {
            const errorData = await heraldResponse.json().catch(() => ({}));
            console.error('Herald API error:', errorData);
            return NextResponse.json(
                { error: 'Herald upload failed', details: errorData },
                { status: heraldResponse.status }
            );
        }

        const heraldData = await heraldResponse.json();

        // If user is authenticated, save metadata to DB
        try {
            const token = request.cookies.get('session')?.value;
            if (token) {
                const db = await getDB();
                const session = db.data!.sessions.find((s: any) => s.token === token);
                if (session) {
                    const extractionId = nanoid();
                    db.data!.extractions.push({
                        id: extractionId,
                        userId: session.userId,
                        filename: file.name,
                        heraldFileId: heraldData.id || heraldData.fileId,
                        createdAt: new Date().toISOString(),
                        metadata: heraldData,
                    });
                    await db.write();
                }
            }
        } catch (e) {
            console.error('Failed to record extraction in DB', e);
        }

        return NextResponse.json(
            {
                success: true,
                filename: file.name,
                heraldFileId: heraldData.id || heraldData.fileId,
                message: 'PDF uploaded to Herald successfully',
                heraldData: heraldData
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Upload failed' },
            { status: 500 }
        );
    }
}
