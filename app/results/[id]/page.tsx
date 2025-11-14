'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import Message from '../../components/shared/Message';
import StatusBadge from '../../components/shared/StatusBadge';
import Link from 'next/link';

ModuleRegistry.registerModules([AllCommunityModule]);

interface ResultsPageProps {
    params: { id: string };
}

export default function ResultsPage({ params }: ResultsPageProps) {
    const searchParams = useSearchParams();
    const filename = searchParams.get('filename') || 'Unknown file';
    const heraldFileId = params.id;

    const [extractionResult, setExtractionResult] = useState<any>(null);
    const [checking, setChecking] = useState(false);
    const [downloadingExcel, setDownloadingExcel] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
    const [loading, setLoading] = useState(true);

    const handleCheckExtraction = async () => {
        if (checking) return;
        setChecking(true);

        try {
            const resp = await fetch(`/api/extract?id=${heraldFileId}`);
            const json = await resp.json();

            if (resp.ok) {
                setExtractionResult(json.extraction ?? json);
                setMessage('Extraction status updated');
                setMessageType('success');
            } else {
                setMessage(json?.error || 'Check failed');
                setMessageType('error');
            }
        } catch (err) {
            console.error(err);
            setMessage('Check extraction failed');
            setMessageType('error');
        } finally {
            setChecking(false);
        }
    };

    const handleDownloadExcel = async () => {
        if (downloadingExcel) return;
        const extractionData = extractionResult?.data_extraction || extractionResult;
        if (!extractionData) return setMessage('No extraction data available'), setMessageType('error');

        setDownloadingExcel(true);
        try {
            const resp = await fetch('/api/export', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'download', extractionData })
            });

            if (resp.ok) {
                const blob = await resp.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${filename.replace('.pdf', '')}-extraction.xlsx`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
                setMessage('Excel downloaded');
                setMessageType('success');
            } else {
                const json = await resp.json();
                setMessage(json?.error || 'Download failed');
                setMessageType('error');
            }
        } catch (err) {
            console.error(err);
            setMessage('Download failed');
            setMessageType('error');
        } finally {
            setDownloadingExcel(false);
        }
    };

    // Load initial extraction data
    useEffect(() => {
        handleCheckExtraction().finally(() => setLoading(false));
    }, []);

    const riskColumnDefs = [
        { field: 'risk_parameter_id', headerName: 'Parameter ID', flex: 1 },
        { field: 'value', headerName: 'Value', flex: 1 },
    ];

    const coverageColumnDefs = [
        { field: 'coverage_parameter_id', headerName: 'Parameter ID', flex: 1 },
        { field: 'value', headerName: 'Value', flex: 1 },
    ];

    const riskData = extractionResult?.data_extraction?.risk_values || extractionResult?.risk_values || [];
    const coverageData = extractionResult?.data_extraction?.coverage_values || extractionResult?.coverage_values || [];
    const extractionStatus = extractionResult?.data_extraction?.status || extractionResult?.status || 'unknown';

    if (loading) {
        return (
            <div className="card">
                <h2>Loading Extraction Results...</h2>
                <p>Please wait while we fetch your extraction data.</p>
            </div>
        );
    }

    return (
        <div className="card">
            <Message
                message={message}
                type={messageType}
                onClose={() => { setMessage(''); setMessageType(''); }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
                <div>
                    <h2 style={{ marginTop: 0 }}>Extraction Results</h2>
                    <div style={{ fontSize: '14px', color: '#999', marginTop: '5px' }}>
                        File: {filename}
                    </div>
                    <div style={{ fontSize: '14px', color: '#999', marginTop: '5px' }}>
                        Status: <StatusBadge status={extractionStatus === 'available' ? 'Extracted' : 'Extraction Pending'} />
                    </div>
                </div>
                <button onClick={handleCheckExtraction} disabled={checking} className="btn btn-secondary">
                    {checking ? 'Checking...' : 'Check Status'}
                </button>
            </div>

            {riskData.length > 0 && (
                <div className="table-section">
                    <h3>Risk Parameters</h3>
                    <div className="ag-theme-quartz" style={{ height: '300px' }}>
                        <AgGridReact
                            columnDefs={riskColumnDefs}
                            rowData={riskData}
                            pagination
                            paginationPageSize={10}
                            domLayout="autoHeight"
                        />
                    </div>
                </div>
            )}

            {coverageData.length > 0 && (
                <div className="table-section">
                    <h3>Coverage Parameters</h3>
                    <div className="ag-theme-quartz" style={{ height: '300px' }}>
                        <AgGridReact
                            columnDefs={coverageColumnDefs}
                            rowData={coverageData}
                            pagination
                            paginationPageSize={10}
                            domLayout="autoHeight"
                        />
                    </div>
                </div>
            )}

            {riskData.length === 0 && coverageData.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                    No extracted data available yet. Check status to refresh.
                </div>
            )}

            <div className="button-container" style={{ marginTop: '40px' }}>
                {(riskData.length > 0 || coverageData.length > 0) && (
                    <button onClick={handleDownloadExcel} disabled={!extractionResult || downloadingExcel} className="btn btn-primary">
                        {downloadingExcel ? 'Downloading...' : 'Download Excel'}
                    </button>
                )}
                <Link href="/upload" className="btn btn-secondary">
                    Extract Another Document
                </Link>
            </div>
        </div>
    );
}