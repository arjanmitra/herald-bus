'use client';

import React from 'react';
import HistoryTable from '../components/HistoryTable';
import Link from 'next/link';

export default function HistoryPage() {
    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>Extraction History</h2>
                <Link href="/upload" className="btn btn-primary">
                    Upload New Document
                </Link>
            </div>
            <HistoryTable />
        </div>
    );
}