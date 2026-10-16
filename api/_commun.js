// Code partagé (les fichiers qui commencent par _ ne sont pas des routes).
import crypto from 'node:crypto';

export const SESSION_RE = /^cs_(live|test)_[A-Za-z0-9]{10,200}$/;

export function markerPath(sessionId) {
  return `paid/${sessionId}.json`;
}

// Vérifie l'en-tête Stripe-Signature (schéma v1, HMAC-SHA256), tolérance 5 min.
export function verifyStripeSignature(rawBody, header, secret, toleranceSec = 300, nowSec = Math.floor(Date.now() / 1000)) {
  if (!header || !secret) return false;
  let t = null;
  const v1 = [];
  for (const part of header.split(',')) {
    const i = part.indexOf('=');
    if (i < 0) continue;
    const k = part.slice(0, i).trim();
    const v = part.slice(i + 1).trim();
    if (k === 't') t = v;
    if (k === 'v1') v1.push(v);
  }
  if (!t || !/^\d+$/.test(t) || v1.length === 0) return false;
  if (Math.abs(nowSec - Number(t)) > toleranceSec) return false;
  const expected = crypto.createHmac('sha256', secret).update(`${t}.${rawBody}`, 'utf8').digest('hex');
  const eb = Buffer.from(expected, 'utf8');
  return v1.some((sig) => {
    const sb = Buffer.from(sig, 'utf8');
    return sb.length === eb.length && crypto.timingSafeEqual(sb, eb);
  });
}

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function page(status, title, bodyHtml, extraHead = '') {
  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow">
<title>${esc(title)} – MultiLaser Créations</title>${extraHead}
<style>body{font-family:system-ui,sans-serif;max-width:560px;margin:3rem auto;padding:0 1rem;color:#222;line-height:1.5}
h1{font-size:1.4rem}a.btn{display:inline-block;background:#222;color:#fff;padding:.7rem 1.2rem;border-radius:6px;text-decoration:none}
small{color:#666}</style></head><body><h1>${esc(title)}</h1>${bodyHtml}
<p><small>MultiLaser Créations – <a href="https://multilaser.faitle.net/">multilaser.faitle.net</a></small></p></body></html>`;
  return new Response(html, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
      'X-Robots-Tag': 'noindex, nofollow',
      'Referrer-Policy': 'no-referrer',
    },
  });
}

export { esc };
