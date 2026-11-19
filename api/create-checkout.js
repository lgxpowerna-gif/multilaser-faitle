import Stripe from 'stripe';
import { CATALOG, computeShipping, itemsSubtotalCents } from '../shipping-config.js';

const json = (status, obj) => new Response(JSON.stringify(obj), {
  status,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
});

function originFrom(request) {
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  const proto = request.headers.get('x-forwarded-proto') || 'https';
  if (!host) return 'https://multilaser.faitle.net';
  return `${proto}://${host}`;
}

function randomId(n = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let s = '';
  for (let i = 0; i < n; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

function normalizeItems(raw) {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > 30) return null;
  const items = [];
  for (const line of raw) {
    const id = typeof line?.id === 'string' ? line.id : '';
    const product = CATALOG[id];
    if (!product) return null;
    const qty = Number(line.qty);
    if (!Number.isInteger(qty) || qty < 1 || qty > 20) return null;
    const meta = line.meta && typeof line.meta === 'object' ? line.meta : {};
    if (product.requireText && !String(meta.texte || '').trim()) return null;
    items.push({
      id,
      qty,
      meta: {
        texte: String(meta.texte || '').slice(0, 200),
        shape: String(meta.shape || '').slice(0, 40),
        fonte: String(meta.fonte || '').slice(0, 40),
        taille: String(meta.taille || '').slice(0, 20),
      },
    });
  }
  return items;
}

export async function POST(request) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return json(503, {
      error: 'Le panier n’est pas encore branché à Stripe : il manque la variable d’environnement STRIPE_SECRET_KEY. Elle n’a pas été écrite dans le code.',
    });
  }

  let body;
  try { body = await request.json(); } catch { return json(400, { error: 'Requête invalide.' }); }

  const method = body?.method === 'pickup' ? 'pickup' : body?.method === 'shipping' ? 'shipping' : null;
  const province = typeof body?.province === 'string' ? body.province : '';
  const items = normalizeItems(body?.items);
  if (!items) return json(400, { error: 'Le panier est invalide.' });
  if (!method) return json(400, { error: 'Choisis le ramassage ou l’envoi au Canada.' });

  const ship = computeShipping(items, method, province);
  if (!ship.ok) return json(400, { error: ship.error });

  const subtotal = itemsSubtotalCents(items);
  if (subtotal < 100) return json(400, { error: 'Le panier est vide.' });

  const origin = originFrom(request);
  const stripe = new Stripe(key);
  const line_items = items.map((line) => {
    const product = CATALOG[line.id];
    const extras = [line.meta.texte, line.meta.shape, line.meta.fonte, line.meta.taille].filter(Boolean);
    return {
      quantity: line.qty,
      price_data: {
        currency: 'cad',
        unit_amount: product.priceCents,
        product_data: {
          name: product.title,
          description: extras.length ? extras.join(' · ').slice(0, 500) : undefined,
        },
      },
    };
  });

  const shipping_options = [{
    shipping_rate_data: {
      type: 'fixed_amount',
      fixed_amount: { amount: ship.shippingCents, currency: 'cad' },
      display_name: ship.label.slice(0, 50),
    },
  }];

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      shipping_options,
      shipping_address_collection: method === 'shipping' ? { allowed_countries: ['CA'] } : undefined,
      success_url: `${origin}/merci.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/panier.html`,
      metadata: {
        source: 'panier',
        method,
        province: method === 'shipping' ? String(province).toUpperCase() : 'pickup',
        shipping_cents: String(ship.shippingCents),
        items: JSON.stringify(items.map((l) => ({ id: l.id, qty: l.qty, texte: l.meta.texte }))).slice(0, 450),
      },
      integration_identifier: `multilaser-panier-${randomId(8)}`,
    });
    if (!session.url) return json(500, { error: 'Stripe n’a pas renvoyé d’adresse de paiement.' });
    return json(200, { url: session.url });
  } catch (err) {
    return json(500, { error: 'Le paiement n’a pas pu être créé. Réessaie un peu plus tard.' });
  }
}

export function GET() {
  return json(405, { error: 'method not allowed' });
}
