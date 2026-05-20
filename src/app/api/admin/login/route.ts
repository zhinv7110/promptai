import { NextResponse } from 'next/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Simple JWT-like token (base64 encoded JSON)
function createToken(): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    role: 'admin',
    exp: Math.floor(Date.now() / 1000) + 86400, // 24 hours
  })).toString('base64url');
  return `${header}.${payload}.admin`;
}

export async function POST(request: Request) {
  const { password } = await request.json();

  if (password === ADMIN_PASSWORD) {
    return NextResponse.json({ ok: true, token: createToken() });
  }

  return NextResponse.json({ ok: false, error: 'Invalid password' }, { status: 401 });
}
