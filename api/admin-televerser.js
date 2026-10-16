// TEMPORAIRE : sert une seule fois à déposer le zip dans le Blob privé, puis sera retiré.
import crypto from 'node:crypto';
import { put } from '@vercel/blob';

export async function POST(request) {
  const secret = process.env.UPLOAD_SECRET;
  const zipPath = process.env.ZIP_PATHNAME;
  const got = request.headers.get('x-upload-secret') || '';
  if (!secret || !zipPath || secret.length < 32) return new Response('disabled', { status: 404 });
  const a = Buffer.from(secret), b = Buffer.from(got);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return new Response('forbidden', { status: 403 });
  const body = Buffer.from(await request.arrayBuffer());
  if (body.length < 1000 || body.length > 4_000_000 || body.readUInt32LE(0) !== 0x04034b50) return new Response('bad file', { status: 400 });
  const blob = await put(zipPath, body, { access: 'private', contentType: 'application/zip', addRandomSuffix: false, allowOverwrite: true });
  return new Response(JSON.stringify({ ok: true, size: body.length, sha256: crypto.createHash('sha256').update(body).digest('hex'), pathname: blob.pathname === zipPath }), { headers: { 'Content-Type': 'application/json' } });
}

export function GET() { return new Response('not found', { status: 404 }); }
