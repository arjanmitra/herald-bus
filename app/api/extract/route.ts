import { NextRequest, NextResponse } from 'next/server';
import { findSessionById, getUserUploadHistory, updateUploadMetadata } from '../../../lib/db';

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

        console.log('[extract-check] Full Herald response:', JSON.stringify(heraldData, null, 2));
        console.log('[extract-check] Herald status:', heraldData.status);
        console.log('[extract-check] Herald data_extraction status:', heraldData.data_extraction?.status);

        // If extraction is complete, update the database record
        const extractionStatus = heraldData.data_extraction?.status || heraldData.status;
        if (extractionStatus === 'available') {
            console.log('[extract-check] Extraction is available, updating database...');
            try {
                const sessionId = request.cookies.get('session')?.value;
                if (sessionId) {
                    const session = await findSessionById(sessionId);
                    if (session) {
                        // Find the upload record by herald file id and update metadata
                        const userHistory = await getUserUploadHistory(session.user_id);
                        const fileId = heraldData.data_extraction?.file_id || heraldData.file?.id;
                        console.log('[extract-check] Looking for file:', fileId);
                        console.log('[extract-check] User history file IDs:', userHistory.map(h => h.herald_file_id));
                        const uploadRecord = userHistory.find(h => h.herald_file_id === fileId);
                        if (uploadRecord) {
                            console.log('[extract-check] Found upload record:', uploadRecord.filename);
                            const updatedMetadata = {
                                ...uploadRecord.metadata,
                                data_extraction: heraldData.data_extraction,
                                extraction_status: 'extraction_complete'
                            };
                            const updateSuccess = await updateUploadMetadata(uploadRecord.id, updatedMetadata);
                            if (updateSuccess) {
                                console.log('[extract-check] Successfully updated database with extraction results for:', uploadRecord.filename);
                            } else {
                                console.log('[extract-check] Failed to update database for:', uploadRecord.filename);
                            }
                        } else {
                            console.log('[extract-check] No upload record found for file ID:', fileId);
                        }
                    } else {
                        console.log('[extract-check] No valid session found');
                    }
                } else {
                    console.log('[extract-check] No session cookie found');
                }
            } catch (dbError) {
                console.error('[extract-check] Failed to update database:', dbError);
                // Don't fail the request if DB update fails
            }
        } else {
            console.log('[extract-check] Extraction status:', extractionStatus, '- not updating database yet');
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

        // Save extraction results to database immediately
        try {
            const sessionId = request.cookies.get('session')?.value;
            if (sessionId) {
                const session = await findSessionById(sessionId);
                if (session) {
                    // Find the upload record by herald file id and update metadata
                    const userHistory = await getUserUploadHistory(session.user_id);
                    const uploadRecord = userHistory.find(h => h.herald_file_id === fileId);
                    if (uploadRecord) {
                        const updatedMetadata = {
                            ...uploadRecord.metadata,
                            data_extraction: heraldData,
                            extraction_status: 'extraction_started'
                        };
                        await updateUploadMetadata(uploadRecord.id, updatedMetadata);
                        console.log('[extract] Updated database with extraction initiation for:', uploadRecord.filename);
                    }
                }
            }
        } catch (dbError) {
            console.error('[extract] Failed to update database:', dbError);
            // Don't fail the request if DB update fails
        }

        return NextResponse.json({ success: true, extraction: heraldData }, { status: 200 });
    } catch (error) {
        console.error('Extraction error:', error);
        return NextResponse.json({ error: 'Extraction failed' }, { status: 500 });
    }
}
