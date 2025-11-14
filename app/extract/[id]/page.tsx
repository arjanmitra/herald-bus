'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Message from '../../components/shared/Message';
import Link from 'next/link';

interface ExtractPageProps {
    params: { id: string };
}

export default function ExtractPage({ params }: ExtractPageProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const filename = searchParams.get('filename') || 'Unknown file';
    const heraldFileId = params.id;

    const [extracting, setExtracting] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

    const handleExtract = async () => {
        if (extracting) return;
        
        setExtracting(true);
        setMessage('');
        
        try {
            const resp = await fetch('/api/extract', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ heraldFileId })
            });
            const json = await resp.json();
            
            if (resp.ok) {
                setMessage('Extraction initiated');
                setMessageType('success');
                
                // Navigate to results page
                router.push(`/results/${heraldFileId}?filename=${encodeURIComponent(filename)}`);
            } else {
                setMessage(json?.error || 'Extraction error');
                setMessageType('error');
            }
        } catch (err) {
            console.error(err);
            setMessage('Extraction failed');
            setMessageType('error');
        } finally {
            setExtracting(false);
        }
    };

    return (
        <div className="card">
            <Message 
                message={message}
                type={messageType}
                onClose={() => { setMessage(''); setMessageType(''); }}
            />

            <h2>Initiate Data Extraction</h2>
            <div className="file-info">
                <div className="file-info-row">
                    <span className="file-info-label">File Name:</span>
                    <span>{filename}</span>
                </div>
                <div className="file-info-row">
                    <span className="file-info-label">Herald File ID:</span>
                    <span style={{ fontFamily: 'monospace' }}>{heraldFileId}</span>
                </div>
                <div className="file-info-row">
                    <span className="file-info-label">Status:</span>
                    <span><div className="status-badge">Ready</div></span>
                </div>
            </div>
            <div className="button-container">
                <button onClick={handleExtract} disabled={extracting} className="btn btn-primary">
                    {extracting ? 'Extracting...' : 'Start Extraction'}
                </button>
                <Link href="/upload" className="btn btn-secondary">
                    Back to Upload
                </Link>
            </div>
        </div>
    );
}