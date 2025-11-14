'use client';

import React from 'react';
import { useAuth } from './AuthContext';

interface ContentWrapperProps {
    children: React.ReactNode;
}

export default function ContentWrapper({ children }: ContentWrapperProps) {
    const { user } = useAuth();

    if (!user) {
        // For unauthenticated users, render children directly (auth pages)
        return <>{children}</>;
    }

    // For authenticated users, wrap with content container
    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px 40px 20px' }}>
            {children}
        </div>
    );
}