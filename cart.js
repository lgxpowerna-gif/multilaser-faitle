(function () {
  const KEY = 'ml_cart_v1';

  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
      return Array.isArray(raw) ? raw : [];
    } catch { return []; }
  }
  function save(items) {
    localStorage.setItem(KEY, JSON.stringify(items));
    updateBadge();
  }
  function lineKey(item) {
    const m = item.meta || {};
    return [item.id, m.texte || '', m.shape || '', m.fonte || '', m.taille || ''].join('|');
  }
  function add(item) {
    const items = load();
    const k = lineKey(item);
    const found = items.find((x) => lineKey(x) === k);
    if (found) found.qty = Math.min(20, (found.qty || 1) + (item.qty || 1));
    else items.push({ id: item.id, qty: item.qty || 1, meta: item.meta || {} });
    save(items);
    return items;
  }
  function setQty(index, qty) {
    const items = load();
    if (!items[index]) return items;
    if (qty < 1) items.splice(index, 1);
    else items[index].qty = Math.min(20, qty);
    save(items);
    return items;
  }
  function remove(index) {
    const items = load();
    items.splice(index, 1);
    save(items);
    return items;
  }
  function clear() { save([]); }
  function count() { return load().reduce((n, i) => n + (Number(i.qty) || 0), 0); }
  function updateBadge() {
    const n = count();
    document.querySelectorAll('#cartCount').forEach((el) => {
      el.textContent = n ? String(n) : '';
      el.hidden = !n;
    });
    document.querySelectorAll('#navCart').forEach((el) => {
      el.setAttribute('data-count', n ? String(n) : '0');
    });
  }
  window.MLCart = { load, save, add, setQty, remove, clear, count, updateBadge };
  document.addEventListener('DOMContentLoaded', updateBadge);
  updateBadge();
})();
