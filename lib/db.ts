import { sql } from '@vercel/postgres';

export type User = {
    id: string;
    email: string;
    password_hash: string;
    created_at: Date;
};

export type Session = {
    id: string;
    user_id: string;
    created_at: Date;
    expires_at: Date;
};

export type UploadHistory = {
    id: string;
    user_id: string;
    filename: string;
    herald_file_id: string;
    metadata: any;
    created_at: Date;
};

// Initialize database tables (run once)
export async function initDB() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        await sql`
            CREATE TABLE IF NOT EXISTS sessions (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expires_at TIMESTAMP NOT NULL
            )
        `;

        await sql`
            CREATE TABLE IF NOT EXISTS upload_history (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                filename TEXT NOT NULL,
                herald_file_id TEXT NOT NULL,
                metadata JSONB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        await sql`CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_upload_history_user_id ON upload_history(user_id)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at)`;

        return true;
    } catch (error) {
        console.error('Database initialization error:', error);
        return false;
    }
}

// User operations
export async function createUser(id: string, email: string, passwordHash: string): Promise<User | null> {
    try {
        const result = await sql<User>`
            INSERT INTO users (id, email, password_hash)
            VALUES (${id}, ${email}, ${passwordHash})
            RETURNING *
        `;
        return result.rows[0] || null;
    } catch (error) {
        console.error('Create user error:', error);
        return null;
    }
}

export async function findUserByEmail(email: string): Promise<User | null> {
    try {
        const result = await sql<User>`
            SELECT * FROM users WHERE email = ${email} LIMIT 1
        `;
        return result.rows[0] || null;
    } catch (error) {
        console.error('Find user error:', error);
        return null;
    }
}

export async function findUserById(id: string): Promise<User | null> {
    try {
        const result = await sql<User>`
            SELECT * FROM users WHERE id = ${id} LIMIT 1
        `;
        return result.rows[0] || null;
    } catch (error) {
        console.error('Find user by id error:', error);
        return null;
    }
}

// Session operations
export async function createSession(id: string, userId: string, expiresAt: Date): Promise<Session | null> {
    try {
        const result = await sql<Session>`
            INSERT INTO sessions (id, user_id, expires_at)
            VALUES (${id}, ${userId}, ${expiresAt.toISOString()})
            RETURNING *
        `;
        return result.rows[0] || null;
    } catch (error) {
        console.error('Create session error:', error);
        return null;
    }
}

export async function findSessionById(id: string): Promise<Session | null> {
    try {
        const result = await sql<Session>`
            SELECT * FROM sessions WHERE id = ${id} AND expires_at > NOW() LIMIT 1
        `;
        return result.rows[0] || null;
    } catch (error) {
        console.error('Find session error:', error);
        return null;
    }
}

export async function deleteSession(id: string): Promise<boolean> {
    try {
        await sql`DELETE FROM sessions WHERE id = ${id}`;
        return true;
    } catch (error) {
        console.error('Delete session error:', error);
        return false;
    }
}

export async function cleanupExpiredSessions(): Promise<void> {
    try {
        await sql`DELETE FROM sessions WHERE expires_at < NOW()`;
    } catch (error) {
        console.error('Cleanup sessions error:', error);
    }
}

// Upload history operations
export async function createUploadHistory(
    id: string,
    userId: string,
    filename: string,
    heraldFileId: string,
    metadata?: any
): Promise<UploadHistory | null> {
    try {
        const result = await sql<UploadHistory>`
            INSERT INTO upload_history (id, user_id, filename, herald_file_id, metadata)
            VALUES (${id}, ${userId}, ${filename}, ${heraldFileId}, ${JSON.stringify(metadata || {})})
            RETURNING *
        `;
        return result.rows[0] || null;
    } catch (error) {
        console.error('Create upload history error:', error);
        return null;
    }
}

export async function updateUploadMetadata(id: string, metadata: any): Promise<boolean> {
    try {
        await sql`
            UPDATE upload_history 
            SET metadata = ${JSON.stringify(metadata)}
            WHERE id = ${id}
        `;
        return true;
    } catch (error) {
        console.error('Update upload metadata error:', error);
        return false;
    }
}

export async function getUserUploadHistory(userId: string): Promise<UploadHistory[]> {
    try {
        const result = await sql<UploadHistory>`
            SELECT * FROM upload_history 
            WHERE user_id = ${userId} 
            ORDER BY created_at DESC
        `;
        return result.rows;
    } catch (error) {
        console.error('Get user upload history error:', error);
        return [];
    }
}

export async function findUploadById(id: string): Promise<UploadHistory | null> {
    try {
        const result = await sql<UploadHistory>`
            SELECT * FROM upload_history WHERE id = ${id} LIMIT 1
        `;
        return result.rows[0] || null;
    } catch (error) {
        console.error('Find upload by id error:', error);
        return null;
    }
}

