'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../components/shared/AuthContext';
import Message from '../components/shared/Message';
import HistoryTable from '../components/HistoryTable';
import AuthLanding from '../components/AuthLanding';

export default function UploadPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f && f.type === 'application/pdf') {
            setFile(f);
            setMessage('');
            setMessageType('');
        } else {
            setFile(null);
            setMessage('Please select a valid PDF file');
            setMessageType('error');
        }
    };

    const handleUpload = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!file) {
            setMessage('Please select a file first');
            setMessageType('error');
            return;
        }
        setUploading(true);
        const fd = new FormData();
        fd.append('file', file);
        try {
            const resp = await fetch('/api/upload', { method: 'POST', body: fd });
            const json = await resp.json();
            if (resp.ok) {
                setMessage(`File "${file.name}" uploaded`);
                setMessageType('success');
                setFile(null);
                const inp = document.getElementById('pdf-input') as HTMLInputElement | null;
                if (inp) inp.value = '';

                // Navigate to extract page
                const fileId = json.heraldFileId || json.id || json.fileId || json.heraldData?.file?.id;
                if (fileId) {
                    router.push(`/extract/${fileId}?filename=${encodeURIComponent(file.name)}`);
                }
            } else {
                setMessage(json?.error || 'Upload failed');
                setMessageType('error');
            }
        } catch (err) {
            console.error(err);
            setMessage('Upload failed');
            setMessageType('error');
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return <div className="card"><p>Loading...</p></div>;
    }

    if (!user) {
        return <AuthLanding />;
    }

    return (
        <div className="card">
            <Message
                message={message}
                type={messageType}
                onClose={() => { setMessage(''); setMessageType(''); }}
            />

            <h2>Upload Insurance Document</h2>
            <form onSubmit={handleUpload}>
                <label htmlFor="pdf-input" className="upload-area">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <p>{file ? `Selected: ${file.name}` : 'Click to select PDF or drag and drop'}</p>
                </label>
                <input id="pdf-input" type="file" accept="application/pdf" onChange={handleFileChange} style={{ display: 'none' }} />

                <div className="button-container">
                    <button type="submit" disabled={!file || uploading} className="btn btn-primary">
                        {uploading ? 'Uploading...' : 'Upload Document'}
                    </button>
                </div>
            </form>

            <HistoryTable />
        </div>
    );
}