'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

interface UserMenuProps {
    className?: string;
}

export default function UserMenu({ className }: UserMenuProps) {
    const { user, signout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const badgeRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const onDocClick = (e: MouseEvent) => {
            if (menuOpen && badgeRef.current && !badgeRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('click', onDocClick);
        return () => document.removeEventListener('click', onDocClick);
    }, [menuOpen]);

    if (!user) return null;

    return (
        <div ref={badgeRef} className={`user-menu ${className || ''}`}>
            <div className="user-avatar" onClick={() => setMenuOpen((s) => !s)}>
                {(user.email || '').split('@')[0].slice(0, 2).toUpperCase()}
            </div>
            {menuOpen && (
                <div className="user-menu-dropdown">
                    <p>Signed in as <strong>{user.email}</strong></p>
                    <button onClick={() => { setMenuOpen(false); signout(); }}>Sign out</button>
                </div>
            )}
        </div>
    );
}