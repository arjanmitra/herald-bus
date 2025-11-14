import { join } from 'path';
import { mkdir } from 'fs/promises';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

type User = {
    id: string;
    email: string;
    passwordHash: string;
};

type Extraction = {
    id: string;
    userId: string;
    filename?: string;
    heraldFileId?: string;
    createdAt: string;
    metadata?: any;
};

type Session = {
    token: string;
    userId: string;
    createdAt: string;
};

export type DBSchema = {
    users: User[];
    extractions: Extraction[];
    sessions: Session[];
};

const file = join(process.cwd(), 'data', 'db.json');

let db: Low<DBSchema> | null = null;

async function initDB() {
    if (db) return db;

    try {
        await mkdir(join(process.cwd(), 'data'), { recursive: true });
    } catch (e) {
        // ignore if directory already exists
    }

    const adapter = new JSONFile<DBSchema>(file);
    db = new Low<DBSchema>(adapter as any, {} as any);
    await db.read();
    // Ensure top-level properties exist even if the file contains an empty object {}
    if (!db.data) {
        db.data = { users: [], extractions: [], sessions: [] };
    } else {
        (db.data as any).users ||= [];
        (db.data as any).extractions ||= [];
        (db.data as any).sessions ||= [];
    }
    await db.write();
    return db;
}

export async function getDB() {
    if (!db) {
        await initDB();
    }
    return db!;
}

export default getDB;
