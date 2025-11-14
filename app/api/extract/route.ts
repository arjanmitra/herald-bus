import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const extractionId = searchParams.get('id');

        if (!extractionId) {
            return NextResponse.json({ error: 'No extraction id provided' }, { status: 400 });
        }

        const heraldApiKey = process.env.HERALD_API_KEY;
        if (!heraldApiKey) {
            return NextResponse.json({ error: 'Herald API key not configured' }, { status: 500 });
        }

        // Call Herald GET extraction endpoint
        const heraldResp = await fetch(`https://sandbox.heraldapi.com/data_extractions/${extractionId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${heraldApiKey}`,
                'Accept': 'application/json',
            },
        });

        const heraldData = await heraldResp.json().catch(() => ({}));

        if (!heraldResp.ok) {
            console.error('Herald check extraction error:', heraldData);
            return NextResponse.json({ error: 'Check extraction failed', details: heraldData }, { status: heraldResp.status });
        }

        return NextResponse.json({ success: true, extraction: heraldData }, { status: 200 });
    } catch (error) {
        console.error('Check extraction error:', error);
        return NextResponse.json({ error: 'Check extraction failed' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const fileId = body.heraldFileId || body.fileId || body.id || body.file?.id

        if (!fileId) {
            return NextResponse.json({ error: 'No Herald file id provided' }, { status: 400 });
        }

        const heraldApiKey = process.env.HERALD_API_KEY;
        if (!heraldApiKey) {
            return NextResponse.json({ error: 'Herald API key not configured' }, { status: 500 });
        }

        // Call Herald extractions endpoint
        const heraldResp = await fetch('https://sandbox.heraldapi.com/data_extractions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${heraldApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ file_id: fileId }),
        });

        const heraldData = await heraldResp.json().catch(() => ({}));

        if (!heraldResp.ok) {
            console.error('Herald extraction error:', heraldData);
            return NextResponse.json({ error: 'Herald extraction failed', details: heraldData }, { status: heraldResp.status });
        }

        return NextResponse.json({ success: true, extraction: heraldData }, { status: 200 });
    } catch (error) {
        console.error('Extraction error:', error);
        return NextResponse.json({ error: 'Extraction failed' }, { status: 500 });
    }
}
