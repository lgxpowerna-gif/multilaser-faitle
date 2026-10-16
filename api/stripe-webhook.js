// Reçoit les événements Stripe. Enregistre une marque "payé" seulement pour
// les sessions payées des liens de paiement des fichiers numériques.
import { put, del } from '@vercel/blob';
import { verifyStripeSignature, markerPath, SESSION_RE, produits } from './_commun.js';

const json = (status, obj) => new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });

export async function POST(request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const prods = produits();
  if (!secret || prods.size === 0) return json(503, { error: 'not configured' });

  const raw = await request.text();
  if (!verifyStripeSignature(raw, request.headers.get('stripe-signature'), secret)) {
    return json(400, { error: 'bad signature' });
  }
  let event;
  try { event = JSON.parse(raw); } catch { return json(400, { error: 'bad json' }); }

  const s = event?.data?.object;
  if (!s || s.object !== 'checkout.session' || !SESSION_RE.test(s.id || '')) return json(200, { ignored: true });
  if (typeof s.payment_link !== 'string' || !prods.has(s.payment_link)) return json(200, { ignored: 'other link' });

  if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
    if (s.payment_status !== 'paid') return json(200, { ignored: 'not paid' });
    await put(markerPath(s.id), JSON.stringify({
      session: s.id, payment_link: s.payment_link, amount_total: s.amount_total,
      currency: s.currency, livemode: s.livemode, event: event.id, at: new Date().toISOString(),
    }), { access: 'private', contentType: 'application/json', addRandomSuffix: false, allowOverwrite: true });
    return json(200, { recorded: true });
  }
  if (event.type === 'checkout.session.expired' || event.type === 'checkout.session.async_payment_failed') {
    try { await del(markerPath(s.id)); } catch { /* rien à supprimer */ }
    return json(200, { removed: true });
  }
  return json(200, { ignored: event.type });
}

export function GET() {
  return json(405, { error: 'method not allowed' });
}
