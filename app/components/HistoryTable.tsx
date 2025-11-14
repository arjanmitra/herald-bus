'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import StatusBadge from './shared/StatusBadge';
import { useAuth } from './shared/AuthContext';

ModuleRegistry.registerModules([AllCommunityModule]);

interface HistoryItem {
    id: string;
    filename: string;
    heraldFileId: string;
    createdAt: string;
    metadata: any;
    extractionStatus: string;
    status: string;
}

export default function HistoryTable() {
    const router = useRouter();
    const { user } = useAuth();
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [downloadingExcel, setDownloadingExcel] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteItem, setDeleteItem] = useState<HistoryItem | null>(null);

    const fetchHistory = async () => {
        if (!user) return;
        
        setLoadingHistory(true);
        try {
            const resp = await fetch('/api/history');
            if (resp.ok) {
                const json = await resp.json();
                setHistory(json.history || []);
            } else {
                setHistory([]);
            }
        } catch (err) {
            console.error('fetchHistory error:', err);
            setHistory([]);
        } finally {
            setLoadingHistory(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteItem) return;

        try {
            const resp = await fetch(`/api/history/delete?id=${deleteItem.id}`, {
                method: 'DELETE'
            });
            if (resp.ok) {
                await fetchHistory(); // Refresh the history list
            }
        } catch (err) {
            console.error('Delete failed:', err);
        } finally {
            setShowDeleteModal(false);
            setDeleteItem(null);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [user]);

    const StatusCellRenderer = (props: any) => {
        return <StatusBadge status={props.value || 'Uploaded'} size="small" />;
    };

    const ActionsCellRenderer = (props: any) => {
        const row = props.data;
        const isExtracted = row.status === 'Extracted';

        const handleDownloadExcel = async (e: React.MouseEvent) => {
            e.stopPropagation();
            if (downloadingExcel) return;
            const extractionData = row.metadata?.data_extraction || row.metadata;
            if (!extractionData) return;
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
                    a.download = `${row.filename.replace('.pdf', '')}-extraction.xlsx`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    window.URL.revokeObjectURL(url);
                }
            } catch (err) {
                console.error('Download failed:', err);
            } finally {
                setDownloadingExcel(false);
            }
        };

        const handleDelete = async (e: React.MouseEvent) => {
            e.stopPropagation();
            setDeleteItem(row);
            setShowDeleteModal(true);
        };

        const handleOpen = () => {
            // Navigate to correct screen based on extraction status
            switch (row.extractionStatus) {
                case 'uploaded':
                    router.push(`/extract/${row.heraldFileId}?filename=${encodeURIComponent(row.filename)}`);
                    break;
                case 'extraction_started':
                    router.push(`/results/${row.heraldFileId}?filename=${encodeURIComponent(row.filename)}`);
                    break;
                case 'extraction_complete':
                    router.push(`/results/${row.heraldFileId}?filename=${encodeURIComponent(row.filename)}`);
                    break;
                default:
                    router.push(`/extract/${row.heraldFileId}?filename=${encodeURIComponent(row.filename)}`);
            }
        };

        return (
            <div style={{ display: 'flex', gap: '6px' }}>
                <button
                    onClick={handleOpen}
                    style={{
                        padding: '4px 8px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '15px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        lineHeight: '1.2',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                    title="Open extraction"
                >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                </button>
                {isExtracted && (
                    <button
                        onClick={handleDownloadExcel}
                        disabled={downloadingExcel}
                        style={{
                            padding: '4px 8px',
                            background: downloadingExcel ? '#ccc' : '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '15px',
                            fontSize: '10px',
                            fontWeight: 600,
                            cursor: downloadingExcel ? 'not-allowed' : 'pointer',
                            lineHeight: '1.2',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                        title="Download Excel file"
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14,2 14,8 20,8" />
                            <line x1="16" y1="13" x2="8" y2="21" />
                            <line x1="8" y1="13" x2="16" y2="21" />
                        </svg>
                    </button>
                )}
                <button
                    onClick={handleDelete}
                    style={{
                        padding: '4px 6px',
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        lineHeight: '1'
                    }}
                    title="Delete extraction"
                >
                    ×
                </button>
            </div>
        );
    };

    if (!user) {
        return <p style={{ color: '#999', marginTop: '30px' }}>Please sign in to see your past extractions.</p>;
    }

    return (
        <>
            <div className="history-section">
                <h3>Your Past Extractions</h3>
                {history.length > 0 ? (
                    <div className="ag-theme-quartz" style={{ height: '300px', width: '100%' }}>
                        <AgGridReact
                            columnDefs={[
                                { 
                                    field: 'createdAt', 
                                    headerName: 'Uploaded', 
                                    valueFormatter: (p: any) => new Date(p.value).toLocaleString(), 
                                    flex: 1 
                                },
                                { field: 'filename', headerName: 'File Name', flex: 2 },
                                { field: 'heraldFileId', headerName: 'Herald File ID', flex: 2 },
                                {
                                    field: 'status',
                                    headerName: 'Status',
                                    flex: 1,
                                    cellRenderer: StatusCellRenderer
                                },
                                {
                                    colId: 'actions',
                                    headerName: 'Actions',
                                    cellRenderer: ActionsCellRenderer,
                                    flex: 1
                                },
                            ]}
                            rowData={history.map((h) => {
                                const extractionStatus = h.metadata?.extraction_status ||
                                    (h.metadata?.data_extraction ? 'extraction_complete' : 'uploaded');

                                let status = 'Uploaded';
                                switch (extractionStatus) {
                                    case 'uploaded':
                                        status = 'Uploaded';
                                        break;
                                    case 'extraction_started':
                                        status = 'Extraction Pending';
                                        break;
                                    case 'extraction_complete':
                                        status = 'Extracted';
                                        break;
                                    default:
                                        status = 'Uploaded';
                                }

                                return {
                                    id: h.id,
                                    filename: h.filename,
                                    heraldFileId: h.heraldFileId,
                                    createdAt: h.createdAt,
                                    metadata: h.metadata,
                                    status,
                                    extractionStatus
                                };
                            })}
                            rowHeight={50}
                            domLayout="autoHeight"
                        />
                    </div>
                ) : (
                    <p style={{ color: '#999', textAlign: 'left' }}>
                        {loadingHistory ? 'Loading...' : 'No extractions yet. Upload a document to get started.'}
                    </p>
                )}
            </div>

            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Delete Extraction</h3>
                        <p style={{ margin: '20px 0', color: '#666' }}>
                            Are you sure you want to delete <strong>"{deleteItem?.filename}"</strong>?
                            <br />
                            This action cannot be undone.
                        </p>
                        <div className="modal-actions">
                            <button onClick={() => { setShowDeleteModal(false); setDeleteItem(null); }} className="btn btn-secondary">Cancel</button>
                            <button onClick={confirmDelete} className="btn" style={{ background: '#dc3545', color: 'white' }}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}