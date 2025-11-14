import { NextRequest, NextResponse } from 'next/server';
import getDB from '../../../../lib/db';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();
        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
        }

        const db = await getDB();
        const user = db.data!.users.find(u => u.email === email.toLowerCase());
        if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

        // create session
        const token = nanoid(32);
        const session = { token, userId: user.id, createdAt: new Date().toISOString() };
        db.data!.sessions.push(session);
        await db.write();

        const res = NextResponse.json({ success: true, message: 'Signed in' });
        // set httpOnly cookie
        res.cookies.set('session', token, { httpOnly: true, path: '/', sameSite: 'lax' });
        return res;
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Signin failed' }, { status: 500 });
    }
}
