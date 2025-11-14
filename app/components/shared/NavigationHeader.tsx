'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from './AuthContext';
import UserMenu from './UserMenu';

export default function NavigationHeader() {
    const { user } = useAuth();

    // Don't show the header for unauthenticated users
    if (!user) {
        return null;
    }

    return (
        <div className="upload-container">
            <header className="header">
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                        <Link href="/upload" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <h1 style={{ cursor: 'pointer', margin: 0 }}>Herald</h1>
                        </Link>
                        <nav style={{ display: 'flex', gap: '20px' }}>
                            <Link href="/upload" style={{ color: '#666', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>Upload</Link>
                            <Link href="/history" style={{ color: '#666', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>History</Link>
                        </nav>
                    </div>
                    <UserMenu />
                </div>
            </header>
        </div>
    );
}