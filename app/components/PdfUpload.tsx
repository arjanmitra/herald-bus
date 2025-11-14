'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

ModuleRegistry.registerModules([AllCommunityModule]);

const styles = `
  .upload-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  }
  
  .header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px 30px;
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  }
  
  .header h1 {
    margin: 0;
    font-size: 30px;
    font-weight: 300;
    letter-spacing: -0.5px;
  }
  
  .main-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
  }
  
  .message {
    padding: 15px 20px;
    border-radius: 15px;
    margin-bottom: 30px;
    font-size: 14px;
    font-weight: 500;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .message-close {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    padding: 0;
    margin-left: 15px;
    opacity: 0.7;
    transition: opacity 0.2s ease;
  }
  
  .message-close:hover {
    opacity: 1;
  }
  
  .message.success {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }
  
  .message.error {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }
  
  .card {
    background: white;
    border-radius: 20px;
    padding: 40px;
    margin-bottom: 30px;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  }
  
  .card h2 {
    margin: 0 0 30px 0;
    font-size: 28px;
    font-weight: 400;
    color: #333;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .upload-area {
    border: 2px dashed #d1d5db;
    border-radius: 20px;
    padding: 40px 30px;
    text-align: center;
    background: #fafafa;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 30px;
    width: 100%;
    display: block;
  }
  
  .upload-area:hover {
    border-color: #667eea;
    background: #f8f9ff;
  }
  
  .upload-area svg {
    width: 48px;
    height: 48px;
    margin: 0 auto 16px;
    display: block;
    color: #667eea;
  }
  
  .upload-area p {
    margin: 0;
    font-size: 14px;
    color: #666;
    font-weight: 500;
  }
  
  .button-container {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 20px;
    margin-bottom: 30px;
  }
  
  .btn {
    padding: 12px 30px;
    border-radius: 25px;
    border: none;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  }
  
  .btn-primary:hover:not(:disabled) {
    box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6);
    transform: translateY(-2px);
  }
  
  .btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .btn-secondary {
    background: #f0f0f0;
    color: #333;
  }
  
  .btn-secondary:hover:not(:disabled) {
    background: #e0e0e0;
  }
  
  .history-section {
    margin-top: 40px;
  }
  
  .history-section h3 {
    margin: 0 0 20px 0;
    font-size: 16px;
    font-weight: 600;
    color: #333;
    text-align: left;
  }
  
  .history-table {
    margin-top: 20px;
  }
  
  .file-info {
    background: #f9f9f9;
    padding: 20px;
    border-radius: 15px;
    margin-bottom: 30px;
    border-left: 4px solid #667eea;
  }
  
  .file-info-row {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    font-size: 14px;
    color: #666;
  }
  
  .file-info-label {
    font-weight: 600;
    color: #333;
  }
  
  .status-badge {
    display: inline-block;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    background: #e3f2fd;
    color: #1976d2;
  }
  
  .status-badge.success {
    background: #e8f5e9;
    color: #2e7d32;
  }
  
  .status-badge.pending {
    background: #fff3e0;
    color: #e65100;
  }
  
  .table-section {
    margin-bottom: 40px;
  }
  
  .table-section h3 {
    margin: 0 0 20px 0;
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
  }
  
  .modal {
    background: white;
    border-radius: 20px;
    padding: 40px;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  }
  
  .modal h3 {
    margin: 0 0 20px 0;
    font-size: 20px;
    font-weight: 700;
    color: #333;
  }
  
  .modal input {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #e0e0e0;
    border-radius: 20px;
    font-size: 14px;
    margin-bottom: 30px;
    box-sizing: border-box;
  }
  
  .modal-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
  }
  
  .user-menu {
    position: relative;
  }
  
  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: white;
    color: #667eea;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 16px;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  }
  
  .user-menu-dropdown {
    position: absolute;
    top: 50px;
    right: 0;
    background: white;
    border-radius: 15px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    padding: 15px;
    min-width: 250px;
    z-index: 50;
  }
  
  .user-menu-dropdown p {
    margin: 0 0 15px 0;
    font-size: 13px;
    color: #666;
  }
  
  .user-menu-dropdown strong {
    color: #333;
    font-weight: 600;
  }
  
  .user-menu-dropdown button {
    width: 100%;
    padding: 10px;
    background: #dc3545;
    color: white;
    border: none;
    border-radius: 15px;
    font-weight: 600;
    cursor: pointer;
  }
  
  .ag-theme-quartz {
    font-family: inherit;
    --ag-font-size: 13px;
    --ag-row-height: 50px;
    --ag-header-height: 40px;
  }
  
  .ag-theme-quartz .ag-cell {
    display: flex;
    align-items: center;
  }
`;

export default function PdfUpload() {
    const router = useRouter();
    const badgeRef = useRef<HTMLDivElement | null>(null);

    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [responseData, setResponseData] = useState<any>(null);

    const [extracting, setExtracting] = useState(false);
    const [extractionResult, setExtractionResult] = useState<any>(null);
    const [checking, setChecking] = useState(false);
    const [currentStep, setCurrentStep] = useState<'upload' | 'extract' | 'result'>('upload');

    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

    // Auto-clear messages after 5 seconds
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage('');
                setMessageType('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const [user, setUser] = useState<any>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [authMode, setAuthMode] = useState<'signin' | 'signup' | null>(null);
    const [authEmail, setAuthEmail] = useState('');
    const [authPassword, setAuthPassword] = useState('');
    const [history, setHistory] = useState<any[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    const [showEmailModal, setShowEmailModal] = useState(false);
    const [emailRecipient, setEmailRecipient] = useState('');
    const [sendingEmail, setSendingEmail] = useState(false);
    const [downloadingExcel, setDownloadingExcel] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteItem, setDeleteItem] = useState<any>(null);

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
                setResponseData(json);
                setMessage(`File "${file.name}" uploaded`);
                setMessageType('success');
                setFile(null);
                const inp = document.getElementById('pdf-input') as HTMLInputElement | null;
                if (inp) inp.value = '';
                setCurrentStep('extract');
                await fetchHistory();
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

    const handleExtract = async () => {
        if (extracting) return;
        console.log('Response Data:', responseData);
        const fileId = responseData?.heraldFileId || responseData?.id || responseData?.fileId || responseData?.heraldData?.file?.id;
        if (!fileId) return setMessage('No Herald file ID available'), setMessageType('error');
        setExtracting(true);
        setExtractionResult(null);
        setMessage('');
        try {
            const resp = await fetch('/api/extract', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ heraldFileId: fileId }) });
            const json = await resp.json();
            if (resp.ok) {
                setExtractionResult(json.extraction ?? json);
                setMessage('Extraction initiated');
                setMessageType('success');
                setCurrentStep('result');
                // Refresh history to show updated status
                await fetchHistory();
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

    const handleCheckExtraction = async () => {
        if (checking) return;
        const extractionId = extractionResult?.data_extraction?.id || extractionResult?.id;
        if (!extractionId) return setMessage('No extraction ID available'), setMessageType('error');
        setChecking(true);
        try {
            const resp = await fetch(`/api/extract?id=${extractionId}`);
            const json = await resp.json();
            if (resp.ok) {
                setExtractionResult(json.extraction ?? json);
                setMessage('Extraction status updated');
                setMessageType('success');
                // Refresh history to show updated status
                await fetchHistory();
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
            const resp = await fetch('/api/export', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'download', extractionData }) });
            if (resp.ok) {
                const blob = await resp.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `extraction-${Date.now()}.xlsx`;
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

    const handleSendEmail = async () => {
        if (sendingEmail) return;
        if (!emailRecipient.trim()) return setMessage('Please enter recipient email'), setMessageType('error');
        const extractionData = extractionResult?.data_extraction || extractionResult;
        if (!extractionData) return setMessage('No extraction data available'), setMessageType('error');
        setSendingEmail(true);
        try {
            const resp = await fetch('/api/export', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'email', extractionData, recipientEmail: emailRecipient }) });
            const json = await resp.json();
            if (resp.ok) {
                setMessage(`Email sent to ${emailRecipient}`);
                setMessageType('success');
                setShowEmailModal(false);
                setEmailRecipient('');
            } else {
                setMessage(json?.error || 'Email failed');
                setMessageType('error');
            }
        } catch (err) {
            console.error(err);
            setMessage('Email send failed');
            setMessageType('error');
        } finally {
            setSendingEmail(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteItem) return;

        try {
            const resp = await fetch(`/api/history/delete?id=${deleteItem.id}`, {
                method: 'DELETE'
            });
            const json = await resp.json();
            if (resp.ok) {
                setMessage('Upload deleted successfully');
                setMessageType('success');
                await fetchHistory(); // Refresh the history list
            } else {
                setMessage(json?.error || 'Delete failed');
                setMessageType('error');
            }
        } catch (err) {
            console.error('Delete failed:', err);
            setMessage('Delete failed');
            setMessageType('error');
        } finally {
            setShowDeleteModal(false);
            setDeleteItem(null);
        }
    };

    // Auth helpers
    const fetchMe = async () => {
        console.log('🔍 [DEBUG] fetchMe called');
        try {
            const resp = await fetch('/api/auth/me');
            const json = await resp.json();
            console.log('🔍 [DEBUG] fetchMe response:', json);
            if (json?.authenticated) {
                setUser(json.user);
                console.log('✅ [DEBUG] User set:', json.user);
            } else {
                setUser(null);
                console.log('❌ [DEBUG] User not authenticated');
            }
        } catch (err) {
            console.error('❌ [DEBUG] fetchMe error:', err);
            setUser(null);
        }
    };

    const signin = async () => {
        console.log('🔑 [DEBUG] signin called with email:', authEmail);
        try {
            const resp = await fetch('/api/auth/signin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: authEmail, password: authPassword }) });
            console.log('🔑 [DEBUG] signin response status:', resp.status);
            if (resp.ok) {
                const json = await resp.json();
                console.log('🔑 [DEBUG] signin success:', json);
                await fetchMe();
                await fetchHistory();
                setAuthMode(null);
                setAuthEmail('');
                setAuthPassword('');
                setMessage('Signed in');
                setMessageType('success');
            } else {
                const json = await resp.json();
                console.log('❌ [DEBUG] signin failed:', json);
                setMessage(json?.error || 'Sign in failed');
                setMessageType('error');
            }
        } catch (err) {
            console.error('❌ [DEBUG] signin error:', err);
            setMessage('Sign in failed');
            setMessageType('error');
        }
    };

    const signup = async () => {
        try {
            const resp = await fetch('/api/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: authEmail, password: authPassword }) });
            if (resp.ok) await signin();
            else {
                const json = await resp.json();
                setMessage(json?.error || 'Sign up failed');
                setMessageType('error');
            }
        } catch (err) {
            console.error(err);
            setMessage('Sign up failed');
            setMessageType('error');
        }
    };

    const signout = async () => {
        try {
            await fetch('/api/auth/signout', { method: 'POST' });
        } catch (err) {
            console.error(err);
        }
        setUser(null);
        setHistory([]);
        setMessage('Signed out');
        setMessageType('success');
        try {
            router.refresh();
        } catch { }
        if (typeof window !== 'undefined') window.location.replace('/');
    };

    const fetchHistory = async () => {
        console.log('📋 [DEBUG] fetchHistory called');
        setLoadingHistory(true);
        try {
            const resp = await fetch('/api/history');
            console.log('📋 [DEBUG] fetchHistory response status:', resp.status);
            if (resp.ok) {
                const json = await resp.json();
                console.log('📋 [DEBUG] fetchHistory data:', json);
                setHistory(json.history || []);
                console.log('📋 [DEBUG] History set, length:', json.history?.length || 0);
            } else {
                console.log('❌ [DEBUG] fetchHistory failed with status:', resp.status);
                const errorText = await resp.text();
                console.log('❌ [DEBUG] fetchHistory error:', errorText);
                setHistory([]);
            }
        } catch (err) {
            console.error('❌ [DEBUG] fetchHistory error:', err);
            setHistory([]);
        } finally {
            setLoadingHistory(false);
        }
    };

    useEffect(() => {
        fetchMe();
        fetchHistory();
    }, []);

    useEffect(() => {
        const onDocClick = (e: MouseEvent) => {
            if (menuOpen && badgeRef.current && !badgeRef.current.contains(e.target as Node)) setMenuOpen(false);
        };
        document.addEventListener('click', onDocClick);
        return () => document.removeEventListener('click', onDocClick);
    }, [menuOpen]);

    const riskColumnDefs = [
        { field: 'risk_parameter_id', headerName: 'Parameter ID', flex: 1 },
        { field: 'value', headerName: 'Value', flex: 1 },
    ];

    const coverageColumnDefs = [
        { field: 'coverage_parameter_id', headerName: 'Parameter ID', flex: 1 },
        { field: 'value', headerName: 'Value', flex: 1 },
    ];

    // Custom cell renderers for AG Grid
    const StatusCellRenderer = (props: any) => {
        const status = props.value || 'Uploaded';
        const colors: Record<string, string> = {
            'Uploaded': '#e3f2fd',
            'Extraction Pending': '#fff3e0',
            'Extracted': '#e8f5e9'
        };
        const textColors: Record<string, string> = {
            'Uploaded': '#1976d2',
            'Extraction Pending': '#e65100',
            'Extracted': '#2e7d32'
        };
        return (
            <span style={{
                display: 'inline-block',
                padding: '2px 8px',
                borderRadius: '15px',
                fontSize: '10px',
                fontWeight: 600,
                background: colors[status] || '#f0f0f0',
                color: textColors[status] || '#666',
                lineHeight: '1.2'
            }}>
                {status}
            </span>
        );
    };

    const ActionsCellRenderer = (props: any) => {
        const row = props.data;
        const isExtracted = row.status === 'Extracted';

        console.log('🎯 [DEBUG] ActionsCellRenderer row data:', {
            filename: row.filename,
            status: row.status,
            extractionStatus: row.extractionStatus,
            metadata: row.metadata
        });

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

        return (
            <div style={{ display: 'flex', gap: '6px' }}>
                <button
                    onClick={() => {
                        if (row) {
                            console.log('🎯 [DEBUG] Load button clicked, navigating based on status:', row.extractionStatus);
                            setResponseData({ filename: row.filename, heraldFileId: row.heraldFileId });

                            // Navigate to correct screen based on extraction status
                            switch (row.extractionStatus) {
                                case 'uploaded':
                                    console.log('🎯 [DEBUG] Going to extract screen (uploaded)');
                                    setExtractionResult(null);
                                    setCurrentStep('extract');
                                    break;
                                case 'extraction_started':
                                    console.log('🎯 [DEBUG] Going to result screen for status check (extraction_started)');
                                    setExtractionResult(row.metadata?.data_extraction || null);
                                    setCurrentStep('result');
                                    break;
                                case 'extraction_complete':
                                    console.log('🎯 [DEBUG] Going to result screen with data (extraction_complete)');
                                    setExtractionResult(row.metadata?.data_extraction || null);
                                    setCurrentStep('result');
                                    break;
                                default:
                                    console.log('🎯 [DEBUG] Default: going to extract screen');
                                    setExtractionResult(null);
                                    setCurrentStep('extract');
                            }
                        }
                    }}
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
    }; const riskData = extractionResult?.data_extraction?.risk_values || extractionResult?.risk_values || [];
    const coverageData = extractionResult?.data_extraction?.coverage_values || extractionResult?.coverage_values || [];
    const extractionStatus = extractionResult?.data_extraction?.status || extractionResult?.status || 'unknown';

    return (
        <>
            <style>{styles}</style>
            <div className="upload-container">
                <header className="header">
                    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h1
                            onClick={() => setCurrentStep('upload')}
                            style={{ cursor: 'pointer' }}
                        >
                            Herald
                        </h1>
                        <div ref={badgeRef} className="user-menu">
                            {user ? (
                                <>
                                    <div className="user-avatar" onClick={() => setMenuOpen((s) => !s)}>
                                        {(user.email || '').split('@')[0].slice(0, 2).toUpperCase()}
                                    </div>
                                    {menuOpen && (
                                        <div className="user-menu-dropdown">
                                            <p>Signed in as <strong>{user.email}</strong></p>
                                            <button onClick={() => { setMenuOpen(false); signout(); }}>Sign out</button>
                                        </div>
                                    )}
                                </>
                            ) : null}
                        </div>
                    </div>
                </header>

                <div className="main-content">

                    {message && (
                        <div className={`message ${messageType}`}>
                            <span>{message}</span>
                            <button
                                className="message-close"
                                onClick={() => {
                                    setMessage('');
                                    setMessageType('');
                                }}
                                aria-label="Close message"
                            >
                                ×
                            </button>
                        </div>
                    )}

                    {currentStep === 'upload' && (
                        <div className="card">
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

                            {user && (
                                <div className="history-section">
                                    <h3>Your Past Extractions</h3>
                                    {history.length > 0 ? (
                                        <div className="ag-theme-quartz" style={{ height: '300px', width: '100%' }}>
                                            <AgGridReact
                                                columnDefs={[
                                                    { field: 'createdAt', headerName: 'Uploaded', valueFormatter: (p: any) => new Date(p.value).toLocaleString(), flex: 1 },
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
                                                    console.log('🔍 [DEBUG] Processing history item:', {
                                                        filename: h.filename,
                                                        extractionStatus,
                                                        metadata: h.metadata,
                                                        metadataKeys: Object.keys(h.metadata || {}),
                                                        dataExtraction: h.metadata?.data_extraction,
                                                        extraction: h.metadata?.extraction
                                                    });

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

                                                    console.log('🔍 [DEBUG] Final status for', h.filename, ':', status);
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
                                        <p style={{ color: '#999', textAlign: 'left' }}>No extractions yet. Upload a document to get started.</p>
                                    )}
                                </div>
                            )}
                            {!user && <p style={{ color: '#999', marginTop: '30px' }}>Please sign in to see your past extractions.</p>}
                        </div>
                    )}

                    {currentStep === 'extract' && responseData && (
                        <div className="card">
                            <h2>Initiate Data Extraction</h2>
                            <div className="file-info">
                                <div className="file-info-row">
                                    <span className="file-info-label">File Name:</span>
                                    <span>{responseData?.filename}</span>
                                </div>
                                <div className="file-info-row">
                                    <span className="file-info-label">Herald File ID:</span>
                                    <span style={{ fontFamily: 'monospace' }}>{responseData?.heraldFileId}</span>
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
                                <button onClick={() => setCurrentStep('upload')} className="btn btn-secondary">Back</button>
                            </div>
                        </div>
                    )}

                    {currentStep === 'result' && extractionResult && (
                        <div className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
                                <div>
                                    <h2 style={{ marginTop: 0 }}>Extraction Results</h2>
                                    <div style={{ fontSize: '14px', color: '#999', marginTop: '5px' }}>
                                        Status: <div className={`status-badge ${extractionStatus === 'available' ? 'success' : 'pending'}`}>{extractionStatus.toUpperCase()}</div>
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
                                        <AgGridReact columnDefs={riskColumnDefs} rowData={riskData} pagination paginationPageSize={10} domLayout="autoHeight" />
                                    </div>
                                </div>
                            )}

                            {coverageData.length > 0 && (
                                <div className="table-section">
                                    <h3>Coverage Parameters</h3>
                                    <div className="ag-theme-quartz" style={{ height: '300px' }}>
                                        <AgGridReact columnDefs={coverageColumnDefs} rowData={coverageData} pagination paginationPageSize={10} domLayout="autoHeight" />
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
                                    <>
                                        <button onClick={handleDownloadExcel} disabled={!extractionResult || downloadingExcel} className="btn btn-primary">
                                            {downloadingExcel ? 'Downloading...' : 'Download Excel'}
                                        </button>
                                        {/* <button onClick={() => setShowEmailModal(true)} disabled={!extractionResult} className="btn btn-primary">
                                            Send via Email
                                        </button> */}
                                        <button onClick={() => setCurrentStep('upload')} className="btn btn-secondary">
                                            Extract Another Document
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {showEmailModal && (
                        <div className="modal-overlay">
                            <div className="modal">
                                <h3>Send Extraction Data via Email</h3>
                                <input value={emailRecipient} onChange={(e) => setEmailRecipient(e.target.value)} placeholder="recipient@example.com" />
                                <div className="modal-actions">
                                    <button onClick={() => setShowEmailModal(false)} className="btn btn-secondary">Cancel</button>
                                    <button onClick={handleSendEmail} disabled={sendingEmail || !emailRecipient.trim()} className="btn btn-primary">
                                        {sendingEmail ? 'Sending...' : 'Send Email'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

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
                </div>
            </div>
        </>
    );
}
