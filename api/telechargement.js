// Page de téléchargement après paiement Stripe.
// /api/telechargement?session_id=cs_...        -> page avec bouton
// /api/telechargement?session_id=cs_...&dl=1   -> le fichier zip
import { get } from '@vercel/blob';
import { SESSION_RE, markerPath, page, esc } from './_commun.js';

const CONTACT = '<p>Si vous avez payé et que le problème persiste, écrivez-nous via la page Facebook MultiLaser Créations ou à partir du site, avec votre courriel de reçu Stripe.</p>';

async function readMarker(sessionId) {
  const r = await get(markerPath(sessionId), { access: 'private', useCache: false });
  if (!r || r.statusCode !== 200) return null;
  const text = await new Response(r.stream).text();
  try { return JSON.parse(text); } catch { return null; }
}

export async function GET(request) {
  const linkId = process.env.PAYMENT_LINK_ID;
  const zipPath = process.env.ZIP_PATHNAME;
  if (!linkId || !zipPath) return page(503, 'Service temporairement indisponible', '<p>Réessayez dans quelques minutes.</p>' + CONTACT);

  const url = new URL(request.url);
  const sid = url.searchParams.get('session_id') || '';
  if (!sid) return page(400, 'Lien de téléchargement incomplet', '<p>Il manque l’identifiant de paiement dans le lien.</p>' + CONTACT);
  if (!SESSION_RE.test(sid)) return page(400, 'Lien de téléchargement invalide', '<p>Ce lien de téléchargement n’est pas valide.</p>' + CONTACT);

  let marker = null;
  try { marker = await readMarker(sid); } catch { marker = null; }

  if (!marker || marker.session !== sid || marker.payment_link !== linkId) {
    const n = Math.max(0, Math.min(20, parseInt(url.searchParams.get('n') || '0', 10) || 0));
    if (n < 10) {
      const next = `/api/telechargement?session_id=${encodeURIComponent(sid)}&n=${n + 1}`;
      return page(404, 'Paiement en cours de confirmation…',
        '<p>Nous n’avons pas encore la confirmation de ce paiement. La page se recharge toute seule dans quelques secondes.</p>',
        `<meta http-equiv="refresh" content="4;url=${esc(next)}">`);
    }
    return page(404, 'Paiement introuvable', '<p>Aucun paiement confirmé ne correspond à ce lien.</p>' + CONTACT);
  }

  if (url.searchParams.get('dl') !== '1') {
    const dl = `/api/telechargement?session_id=${encodeURIComponent(sid)}&dl=1`;
    return page(200, 'Merci pour votre achat!',
      `<p>Vos fichiers de découpe laser (SVG + DXF) sont prêts.</p>
<p><a class="btn" href="${esc(dl)}">Télécharger le fichier zip</a></p>
<p>Gardez cette page dans vos favoris : le lien reste valide si vous devez retélécharger. Lisez le fichier LISEZMOI_README.txt avant de couper (épaisseur, kerf, licence).</p>`);
  }

  const r = await get(zipPath, { access: 'private' });
  if (!r || r.statusCode !== 200) return page(503, 'Fichier temporairement indisponible', '<p>Réessayez dans quelques minutes.</p>' + CONTACT);
  const name = zipPath.split('/').pop();
  return new Response(r.stream, {
    status: 200,
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${name}"`,
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}
