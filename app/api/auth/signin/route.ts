import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, createSession } from '../../../../lib/db';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();
        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
        }

        const user = await findUserByEmail(email.toLowerCase());
        if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

        const ok = await bcrypt.compare(password, user.password_hash);
        if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

        // create session (expires in 30 days)
        const sessionId = nanoid(32);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);

        await createSession(sessionId, user.id, expiresAt);

        const res = NextResponse.json({ success: true, message: 'Signed in' });
        // set httpOnly cookie
        res.cookies.set('session', sessionId, {
            httpOnly: true,
            path: '/',
            sameSite: 'lax',
            expires: expiresAt
        });
        return res;
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Signin failed' }, { status: 500 });
    }
}

