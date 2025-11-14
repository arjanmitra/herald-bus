import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, createUser } from '../../../../lib/db';
import { nanoid } from 'nanoid';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password } = body;
        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
        }

        const existing = await findUserByEmail(email.toLowerCase());
        if (existing) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        const id = nanoid();
        const passwordHash = await bcrypt.hash(password, 10);

        await createUser(id, email.toLowerCase(), passwordHash);

        return NextResponse.json({ success: true, message: 'Account created' }, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Signup failed' }, { status: 500 });
    }
}

