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
        <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '20px 30px',
            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
            width: '100vw',
            position: 'relative',
            top: 0,
            left: 0,
            right: 0,
            margin: 0,
            boxSizing: 'border-box',
            zIndex: 100
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                    <Link href="/upload" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <h1 style={{
                            cursor: 'pointer',
                            margin: 0,
                            fontSize: '30px',
                            fontWeight: 300,
                            letterSpacing: '-0.5px'
                        }}>Herald</h1>
                    </Link>
                    <nav style={{ display: 'flex', gap: '20px' }}>
                        <Link href="/upload" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>Upload</Link>
                        <Link href="/history" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>History</Link>
                    </nav>
                </div>
                <UserMenu />
            </div>
        </div>
    );
}