// Tarifs d'envoi Canada — MultiLaser Créations
// Source : outil officiel Trouver un tarif de Postes Canada (canal CONSUMER,
// Colis standard), le 19 novembre 2026, heure de l'Est (America/Toronto).
// Origine : J9L 1S0 (Mont-Laurier). Un code postal typique par province ou territoire.
// Montants du site : prix de base + supplément carburant (39,90 % du 16 au 22 nov. 2026),
// arrondis au 0,99 $ supérieur. Les taxes au comptoir ne sont pas incluses
// (souvent récupérables si l'entreprise est inscrite).
//
// Affiches (palette) : poids réel max 4 lb / 1,81 kg emballées, boîte 40 × 25 × 10 cm.
// Boîte 6-pack : estimation inchangée — voir PACKAGES.box6pack ci-dessous.

export const SHIPPING_META = {
  quotedOn: '2026-11-19',
  source: 'https://www.canadapost-postescanada.ca/cpc/en/tools/find-a-rate.page',
  originPostalCode: 'J9L 1S0',
  service: 'DOM.RP',
  fuelSurchargePercent: 39.9,
  kitAloneCad: 5.3,
};

// Poids et dimensions utilisés pour les cotes Postes Canada.
export const PACKAGES = {
  poster: {
    weightKg: 1.81, // max 4 lb emballées, confirmé le 19 nov. 2026
    weightNote: 'Poids réel maximum 4 lb (1,81 kg) par affiche, emballée.',
    lengthCm: 40,
    widthCm: 25,
    heightCm: 10,
    destSample: { QC: 'J1C0T5', ON: 'M5V2T6', NB: 'E3B1B5', NS: 'B3J2K9', PE: 'C1A4P3', NL: 'A1C1A1', MB: 'R3C0A1', SK: 'S4P3Y2', AB: 'T5J0A7', BC: 'V6B1A1', YT: 'Y1A1A1', NT: 'X1A2P3', NU: 'X0A0H0' },
  },
  box6pack: {
    // Contreplaqué de bouleau 3 mm, 6 panneaux cut_only, aire 0,17495 m² × 3 mm × 680 kg/m³ = 0,357 kg.
    // Emballage estimé : +0,25 kg (boîte + papier). Total emballé ≈ 0,61 kg, arrondi à 0,65 kg.
    // Dimensions assemblées 222 × 156 × 148 mm ; colis estimé 25 × 18 × 17 cm.
    // Poids volumétrique Colis standard : 1,28 kg (donc palier 1,5 kg, le volume l'emporte).
    woodKg: 0.357,
    packingKg: 0.25,
    weightKg: 0.65,
    weightNote: 'Estimation (bois 0,357 kg + emballage 0,25 kg).',
    assembledMm: { l: 222, w: 156, h: 148 },
    lengthCm: 25,
    widthCm: 18,
    heightCm: 17,
  },
};

// firstPoster / firstBox / addonHeavy : dollars CAD, avant taxes.
export const PROVINCES = {
  QC: { name: 'Québec', sample: 'J1C 0T5 Sherbrooke', rateCode: 'C06', firstPoster: 23.99, firstBox: 23.99, addonHeavy: 1.99 },
  ON: { name: 'Ontario', sample: 'M5V 2T6 Toronto', rateCode: 'G02', firstPoster: 22.99, firstBox: 22.99, addonHeavy: 2.99 },
  NB: { name: 'Nouveau-Brunswick', sample: 'E3B 1B5 Fredericton', rateCode: 'G06', firstPoster: 28.99, firstBox: 27.99, addonHeavy: 3.99 },
  NS: { name: 'Nouvelle-Écosse', sample: 'B3J 2K9 Halifax', rateCode: 'G05', firstPoster: 26.99, firstBox: 26.99, addonHeavy: 4.99 },
  PE: { name: 'Île-du-Prince-Édouard', sample: 'C1A 4P3 Charlottetown', rateCode: 'G07', firstPoster: 28.99, firstBox: 27.99, addonHeavy: 3.99 },
  NL: { name: 'Terre-Neuve-et-Labrador', sample: "A1C 1A1 St. John's", rateCode: 'M03', firstPoster: 31.99, firstBox: 30.99, addonHeavy: 3.99 },
  MB: { name: 'Manitoba', sample: 'R3C 0A1 Winnipeg', rateCode: 'N02', firstPoster: 29.99, firstBox: 29.99, addonHeavy: 2.99 },
  SK: { name: 'Saskatchewan', sample: 'S4P 3Y2 Regina', rateCode: 'N03', firstPoster: 29.99, firstBox: 29.99, addonHeavy: 3.99 },
  AB: { name: 'Alberta', sample: 'T5J 0A7 Edmonton', rateCode: 'N05', firstPoster: 32.99, firstBox: 32.99, addonHeavy: 4.99 },
  BC: { name: 'Colombie-Britannique', sample: 'V6B 1A1 Vancouver', rateCode: 'N05', firstPoster: 32.99, firstBox: 32.99, addonHeavy: 4.99 },
  YT: { name: 'Yukon', sample: 'Y1A 1A1 Whitehorse', rateCode: 'S04', firstPoster: 32.99, firstBox: 30.99, addonHeavy: 5.99 },
  NT: { name: 'Territoires du Nord-Ouest', sample: 'X1A 2P3 Yellowknife', rateCode: 'S04', firstPoster: 32.99, firstBox: 30.99, addonHeavy: 5.99 },
  NU: { name: 'Nunavut', sample: 'X0A 0H0 Iqaluit', rateCode: 'T02', firstPoster: 39.99, firstBox: 34.99, addonHeavy: 18.99 },
};

export const CATALOG = {
  brut: { title: 'Affiche découpée (brut)', priceCents: 2000, shipClass: 'poster', requireText: false },
  imprimee: { title: 'Affiche imprimée + sablée + vernie', priceCents: 3500, shipClass: 'poster', requireText: true },
  complete: { title: 'Version complète avec attaches', priceCents: 4000, shipClass: 'poster', requireText: true },
  aimants: { title: 'Version complète avec aimants au néodyme', priceCents: 4000, shipClass: 'poster', requireText: true },
  noel: { title: 'Boules de Noël — ensemble de 4 expressions', priceCents: 1500, shipClass: 'kit', requireText: false },
  animaux: { title: 'Boules de Noël — ensemble de 4 animaux', priceCents: 1500, shipClass: 'kit', requireText: false },
  gnomes: { title: 'Gnomes de Noël — ensemble de 4', priceCents: 1500, shipClass: 'kit', requireText: false },
  boite: { title: 'Boîte 6-pack en bois', priceCents: 4500, shipClass: 'box', requireText: false },
};

function moneyToCents(n) {
  return Math.round(Number(n) * 100);
}

/**
 * @param {{ id: string, qty: number }[]} items
 * @param {'pickup'|'shipping'} method
 * @param {string} [province] code de 2 lettres
 * @returns {{ ok: true, shippingCents: number, label: string, breakdown: object } | { ok: false, error: string }}
 */
export function computeShipping(items, method, province) {
  if (method === 'pickup') {
    return { ok: true, shippingCents: 0, label: 'Ramassage Mont-Laurier — 0 $', breakdown: { method: 'pickup' } };
  }
  if (method !== 'shipping') {
    return { ok: false, error: 'Choisis le ramassage ou l’envoi au Canada.' };
  }
  const code = String(province || '').toUpperCase();
  const zone = PROVINCES[code];
  if (!zone) {
    return { ok: false, error: 'Choisis une province ou un territoire du Canada. Pour les États-Unis ou ailleurs, écris à multilaser@faitle.net.' };
  }

  let posters = 0;
  let boxes = 0;
  let kits = 0;
  for (const line of items) {
    const product = CATALOG[line.id];
    if (!product) return { ok: false, error: 'Article inconnu.' };
    const qty = Number(line.qty) || 0;
    if (qty < 1 || qty > 20) return { ok: false, error: 'Quantité invalide.' };
    if (product.shipClass === 'poster') posters += qty;
    else if (product.shipClass === 'box') boxes += qty;
    else if (product.shipClass === 'kit') kits += qty;
  }

  const heavy = posters + boxes;
  let shippingCents = 0;
  let label = '';
  if (heavy >= 1) {
    const first = posters > 0 ? zone.firstPoster : zone.firstBox;
    shippingCents = moneyToCents(first) + Math.max(0, heavy - 1) * moneyToCents(zone.addonHeavy);
    label = `Envoi Canada — ${zone.name}`;
  } else if (kits >= 1) {
    shippingCents = moneyToCents(SHIPPING_META.kitAloneCad);
    label = `Envoi Canada — ${zone.name} (trousse en enveloppe)`;
  } else {
    return { ok: false, error: 'Le panier est vide.' };
  }

  return {
    ok: true,
    shippingCents,
    label,
    breakdown: { method: 'shipping', province: code, posters, boxes, kits, heavy },
  };
}

export function itemsSubtotalCents(items) {
  let sum = 0;
  for (const line of items) {
    const product = CATALOG[line.id];
    if (!product) continue;
    const qty = Number(line.qty) || 0;
    sum += product.priceCents * qty;
  }
  return sum;
}
