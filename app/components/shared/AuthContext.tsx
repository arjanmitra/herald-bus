'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signin: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string) => Promise<void>;
    signout: () => Promise<void>;
    fetchMe: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchMe = async () => {
        try {
            const resp = await fetch('/api/auth/me');
            const json = await resp.json();
            if (json?.authenticated) {
                setUser(json.user);
            } else {
                setUser(null);
            }
        } catch (err) {
            console.error('fetchMe error:', err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const signin = async (email: string, password: string) => {
        const resp = await fetch('/api/auth/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        if (resp.ok) {
            await fetchMe();
        } else {
            const json = await resp.json();
            throw new Error(json?.error || 'Sign in failed');
        }
    };

    const signup = async (email: string, password: string) => {
        const resp = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        if (resp.ok) {
            await signin(email, password);
        } else {
            const json = await resp.json();
            throw new Error(json?.error || 'Sign up failed');
        }
    };

    const signout = async () => {
        try {
            await fetch('/api/auth/signout', { method: 'POST' });
        } catch (err) {
            console.error(err);
        }
        setUser(null);
        router.push('/');
    };

    useEffect(() => {
        fetchMe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, signin, signup, signout, fetchMe }}>
            {children}
        </AuthContext.Provider>
    );
};