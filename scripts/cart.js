// =============================================================
// cart.js — Cart state, checkout form, Square integration
// Depends on: genki-config.js (.genki-secrets.js loaded first)
// =============================================================

(function () {
  const localConfig = window.__GENKI_CONFIG__ || {};
  const SQUARE_APP_ID = localConfig.SQUARE_APP_ID || 'REPLACE_WITH_YOUR_SQUARE_APP_ID';
  const SQUARE_LOCATION_ID = localConfig.SQUARE_LOCATION_ID || 'REPLACE_WITH_YOUR_SQUARE_LOCATION_ID';

  const STORAGE_KEY = 'genki_cart_v1';
  const LAST_ORDER_KEY = 'genki_last_order_v1';
  const CANCEL_WINDOW_HOURS = 12;

  const state = { items: [] };
  let squarePayments = null;
  let squareCard = null;
  let squareSdkPromise = null;
  let refreshPayNowButtonState = () => {};

  const $ = (sel) => document.querySelector(sel);

  // ── Helpers ──────────────────────────────────────────────────
  const money = (cents) => `$${(cents / 100).toFixed(2)}`;
  const generateCancelCode = () => String(Math.floor(10000000 + Math.random() * 90000000));

  function setCancelDetails(code) {
    const codeEl = document.getElementById('checkout-cancel-code');
    const windowEl = document.getElementById('checkout-cancel-window');
    if (codeEl) codeEl.textContent = code || '—';
    if (windowEl) windowEl.textContent = String(CANCEL_WINDOW_HOURS);
  }

  function parsePriceToCents(text) {
    if (!text) return 0;
    const n = parseFloat(text.replace(/[^0-9.]/g, ''));
    return Math.round(n * 100);
  }

  function getPriceForSize(product, size) {
    const base = parseFloat(String(product?.price || '').replace(/[^0-9.\-]/g, '')) || 0;
    if (product?.surcharges && size) {
      const clean = String(size).trim();
      if (Object.prototype.hasOwnProperty.call(product.surcharges, clean)) {
        return base + (Number(product.surcharges[clean]) || 0);
      }
    }
    return base;
  }

  // ── Persistence ──────────────────────────────────────────────
  function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items)); }
  function load() {
    try { state.items = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch (e) { state.items = []; }
  }
  function saveLastOrder(order) {
    try { localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order)); } catch (_) {}
  }
  function loadLastOrder() {
    try { return JSON.parse(localStorage.getItem(LAST_ORDER_KEY) || 'null'); } catch (_) { return null; }
  }

  // ── Cart operations ──────────────────────────────────────────
  function add(item) {
    const key = `${item.id}|${item.color || ''}|${item.size || ''}`;
    const existing = state.items.find((x) => `${x.id}|${x.color || ''}|${x.size || ''}` === key);
    if (existing) { existing.qty += item.qty || 1; }
    else { state.items.push(Object.assign({ qty: 1 }, item)); }
    save(); render();
  }
  function remove(index) { state.items.splice(index, 1); save(); render(); }
  function updateQty(index, delta) {
    const it = state.items[index];
    if (!it) return;
    it.qty = Math.max(1, it.qty + delta);
    save(); render();
  }
  function subtotal() { return state.items.reduce((s, it) => s + it.priceCents * it.qty, 0); }

  function buildItemsText(items) {
    return (items || []).map((it) => {
      const color = it.color ? ` / ${it.color}` : '';
      const size = it.size ? ` / ${it.size}` : '';
      return `- ${it.title || it.id}${color}${size} x${it.qty || 1} (${money(it.priceCents)})`;
    }).join('\n') || '- No items';
  }

  // ── FormSubmit helpers ───────────────────────────────────────
  function buildAjaxUrl(actionUrl) {
    const marker = 'https://formsubmit.co/';
    if (!actionUrl?.startsWith(marker)) return '';
    return `https://formsubmit.co/ajax/${actionUrl.slice(marker.length)}`;
  }

  function toPlainObject(fd) {
    const out = {};
    fd.forEach((value, key) => { out[key] = String(value); });
    return out;
  }

  async function submitOrderSlipForm(payload) {
    const form = document.getElementById('order-slip-form');
    if (!form) return false;
    const set = (name, value) => {
      const input = form.querySelector(`input[name="${name}"]`);
      if (input) input.value = value || '';
    };
    set('_next', `${window.location.origin}${window.location.pathname}#checkout-success`);
    set('total', money(payload.amount));
    set('name', payload.buyer?.name || '');
    set('email', payload.buyer?.email || '');
    set('phone', payload.buyer?.phone || '');
    set('shipping_details', payload.buyer?.shippingDetails || payload.buyer?.address || '');
    set('notes', payload.buyer?.notes || '');
    set('items', buildItemsText(payload.items));
    set('cancel_code', payload.cancelCode || '');
    set('cancel_window_hours', payload.cancelWindowHours ? String(payload.cancelWindowHours) : '');
    try {
      const resp = await fetch(buildAjaxUrl(form.action), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(toPlainObject(new FormData(form))),
      });
      if (!resp.ok) return false;
      const data = await resp.json().catch(() => ({}));
      return !!(data.success || data.message || data.status);
    } catch (_) { return false; }
  }

  async function submitCancelSlipForm(payload) {
    const form = document.getElementById('cancel-slip-form');
    if (!form) return false;
    const set = (name, value) => {
      const input = form.querySelector(`input[name="${name}"]`);
      if (input) input.value = value || '';
    };
    set('cancel_code', payload.cancelCode || '');
    set('email', payload.email || '');
    set('reason', payload.reason || '');
    set('within_window', payload.withinWindow ? 'yes' : 'no');
    set('local_match', payload.localMatch ? 'yes' : 'no');
    set('submitted_at', new Date().toISOString());
    try {
      const resp = await fetch(buildAjaxUrl(form.action), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(toPlainObject(new FormData(form))),
      });
      if (!resp.ok) return false;
      const data = await resp.json().catch(() => ({}));
      return !!(data.success || data.message || data.status);
    } catch (_) { return false; }
  }

  // ── Render ───────────────────────────────────────────────────
  function render() {
    const list = $('#cart-items');
    const sub = $('#cart-subtotal');
    const badge = $('#cart-count');

    if (list) {
      list.innerHTML = '';
      if (!state.items.length) {
        const empty = document.createElement('p');
        empty.className = 'text-sm text-gray-400';
        empty.textContent = 'Your cart is empty.';
        list.appendChild(empty);
      } else {
        state.items.forEach((it, i) => {
          const row = document.createElement('div');
          row.className = 'cart-line';
          row.innerHTML = `
            <img src="${it.image || 'https://placehold.co/120x120'}" alt="${it.title}" class="w-16 h-16 object-cover border border-white/10"/>
            <div>
              <div class="font-semibold">${it.title}</div>
              <div class="text-xs text-gray-400">${it.color || ''} ${it.size ? '/ ' + it.size : ''}</div>
              <div class="mt-2 inline-flex items-center space-x-2">
                <button class="qty-btn" data-idx="${i}" data-delta="-1">-</button>
                <span>${it.qty}</span>
                <button class="qty-btn" data-idx="${i}" data-delta="1">+</button>
              </div>
            </div>
            <div class="text-right">
              <div class="price-sm">${money(it.priceCents)}</div>
              <button class="mt-6 text-xs text-gray-400 hover:text-white" data-remove="${i}">Remove</button>
            </div>`;
          list.appendChild(row);
        });
      }
    }

    if (sub) sub.textContent = money(subtotal());
    const count = state.items.reduce((n, it) => n + it.qty, 0);
    if (badge) badge.textContent = count;
    refreshPayNowButtonState();
  }

  function nudgeCartIcon() {
    const toggle = $('#cart-toggle');
    if (!toggle) return;
    toggle.classList.remove('cart-attention');
    void toggle.offsetWidth;
    toggle.classList.add('cart-attention');
  }

  function goToCheckout() {
    if (typeof window.openCheckoutModal === 'function') { window.openCheckoutModal(); return; }
    window.location.hash = '#checkout';
  }

  // ── Square SDK ───────────────────────────────────────────────
  const isTestMode = () =>
    !SQUARE_APP_ID || SQUARE_APP_ID.startsWith('REPLACE') ||
    !SQUARE_LOCATION_ID || SQUARE_LOCATION_ID.startsWith('REPLACE');

  const isSquareSandbox = (id = '') => String(id).trim().startsWith('sandbox-');
  const getSquareSdkUrl = () =>
    isSquareSandbox(SQUARE_APP_ID)
      ? 'https://sandbox.web.squarecdn.com/v1/square.js'
      : 'https://web.squarecdn.com/v1/square.js';

  const waitForSquare = (ms = 4000) => new Promise((resolve, reject) => {
    const start = Date.now();
    const tick = () => {
      if (window.Square) return resolve();
      if (Date.now() - start >= ms) return reject(new Error('Square.js not loaded.'));
      setTimeout(tick, 100);
    };
    tick();
  });

  const loadSquareSdk = () => {
    if (isTestMode() || window.Square) return Promise.resolve();
    if (squareSdkPromise) return squareSdkPromise;
    const url = getSquareSdkUrl();
    squareSdkPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-square-sdk="1"]');
      if (existing) {
        existing.addEventListener('load', resolve, { once: true });
        existing.addEventListener('error', () => reject(new Error('Square SDK failed.')), { once: true });
        return;
      }
      const script = document.createElement('script');
      script.src = url; script.async = true; script.dataset.squareSdk = '1';
      script.onload = resolve;
      script.onerror = () => reject(new Error('Square SDK failed to load.'));
      document.body.appendChild(script);
    });
    return squareSdkPromise;
  };

  const ensureSquareCard = async () => {
    if (squareCard) return;
    await loadSquareSdk();
    if (!window.Square) throw new Error('Square.js not loaded.');
    if (isTestMode()) throw new Error('Square app/location IDs not configured.');
    squarePayments = Square.payments(SQUARE_APP_ID, SQUARE_LOCATION_ID);
    squareCard = await squarePayments.card();
    await squareCard.attach('#square-card-container');
  };

  // ── Payload builder ──────────────────────────────────────────
  function buildPayload() {
    const g = (id) => (document.getElementById(id)?.value || '').trim();
    const name = g('sq-name');
    const email = g('sq-email');
    const address1 = g('sq-address');
    const address2 = g('sq-address-2');
    const city = g('sq-city');
    const stateVal = g('sq-state');
    const zip = g('sq-zip');
    const country = g('sq-country');
    const phone = g('sq-phone');
    const notes = g('sq-notes');
    const cardholderName = g('sq-cardholder-name');
    const billingZip = g('sq-billing-zip');
    const address = [address1, address2, city, stateVal, zip, country].filter(Boolean).join(', ');
    return {
      name, email, phone, address1, address, shippingDetails: address, notes,
      cancelCode: generateCancelCode(),
      addressParts: { line1: address1, line2: address2, city, state: stateVal, zip, country },
      manualPayment: { cardholderName, billingZip },
    };
  }

  // ── Pay Now readiness ────────────────────────────────────────
  const isPayNowReady = () => {
    if (isTestMode() || !state.items.length) return false;
    const g = (id) => (document.getElementById(id)?.value || '').trim();
    return !!(g('sq-name') && g('sq-email') && g('sq-address') && g('sq-city') && g('sq-state') && g('sq-zip') && g('sq-cardholder-name') && g('sq-billing-zip'));
  };

  // ── Success message ──────────────────────────────────────────
  function applyCheckoutSuccessMessage(order) {
    const title = document.getElementById('checkout-success-title');
    const copy = document.getElementById('checkout-success-copy');
    if (order?.paymentStatus === 'paid') {
      if (title) title.textContent = 'Payment received';
      if (copy) copy.textContent = "Your payment was successful. We'll process your order shortly.";
    } else if (order?.paymentStatus === 'pending') {
      if (title) title.textContent = 'Order request received';
      if (copy) copy.textContent = 'No payment was captured. We only fulfill paid orders.';
    } else {
      if (title) title.textContent = 'Order received';
      if (copy) copy.textContent = "We'll process your order shortly. Check your email for the receipt.";
    }
  }

  // ── Cancel handler ───────────────────────────────────────────
  async function handleCancelSubmit({ email, cancelCode, reason, setStatus }) {
    setStatus('');
    if (!email || !email.includes('@')) { setStatus('Enter the email used on the order.', true); return; }
    if (!/^\d{8}$/.test(cancelCode)) { setStatus('Cancel code must be 8 digits.', true); return; }
    const last = loadLastOrder();
    const withinWindow = last?.createdAt ? (Date.now() - Number(last.createdAt) <= CANCEL_WINDOW_HOURS * 3600000) : false;
    const localMatch = last ? (String(last.cancelCode) === cancelCode && String(last.email || '').toLowerCase() === email.toLowerCase()) : false;
    const sent = await submitCancelSlipForm({ cancelCode, email, reason, withinWindow, localMatch });
    if (!sent) { setStatus('Could not send cancel request. Please try again.', true); return; }
    setStatus('Cancel request sent. We will confirm by email.', false);
  }

  // ── Wire everything ──────────────────────────────────────────
  function wireBasics() {
    // Cart toggle
    const toggle = $('#cart-toggle');
    if (toggle) toggle.addEventListener('click', () => { nudgeCartIcon(); goToCheckout(); });

    // Cart item events (qty, remove)
    const list = $('#cart-items');
    if (list) {
      list.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        if (btn.dataset.idx && btn.dataset.delta) updateQty(parseInt(btn.dataset.idx, 10), parseInt(btn.dataset.delta, 10));
        if (btn.dataset.remove !== undefined) remove(parseInt(btn.dataset.remove, 10));
      });
    }

    // Square Pay Now inputs
    const squarePay = document.getElementById('square-pay');
    const squarePayLater = document.getElementById('square-pay-later');
    const squareError = document.getElementById('square-error');

    const setSquareError = (msg = '') => {
      if (!squareError) return;
      squareError.textContent = msg;
      squareError.classList.toggle('hidden', !msg);
    };

    const updatePayNowState = () => {
      if (!squarePay) return;
      const enabled = isPayNowReady();
      squarePay.disabled = !enabled;
      squarePay.classList.toggle('opacity-50', !enabled);
      squarePay.classList.toggle('cursor-not-allowed', !enabled);
    };
    refreshPayNowButtonState = updatePayNowState;

    ['sq-name', 'sq-email', 'sq-address', 'sq-city', 'sq-state', 'sq-zip', 'sq-cardholder-name', 'sq-billing-zip']
      .forEach((id) => document.getElementById(id)?.addEventListener('input', updatePayNowState));

    // Hydrate cancel form from last order
    const hydrateCancelForm = () => {
      const last = loadLastOrder();
      const shownCode = (document.getElementById('checkout-cancel-code')?.textContent || '').trim();
      if (last?.cancelCode && !/^\d{8}$/.test(shownCode)) setCancelDetails(String(last.cancelCode));
      const cancelEmailEl = document.getElementById('cancel-email');
      const cancelPageEmailEl = document.getElementById('cancel-page-email');
      const cancelCodeEl = document.getElementById('cancel-code-input');
      const cancelPageCodeEl = document.getElementById('cancel-page-code');
      if (cancelEmailEl && last?.email) cancelEmailEl.value = last.email;
      if (cancelPageEmailEl && last?.email) cancelPageEmailEl.value = last.email;
      if (cancelCodeEl && window.location.hash === '#checkout-success') {
        const code = (document.getElementById('checkout-cancel-code')?.textContent || '').trim();
        if (/^\d{8}$/.test(code)) cancelCodeEl.value = code;
      }
      if (cancelPageCodeEl && last?.cancelCode) cancelPageCodeEl.value = String(last.cancelCode);
      if (window.location.hash === '#checkout-success') applyCheckoutSuccessMessage(last);
    };

    // Pay Now handler
    const handleSquarePay = async () => {
      setSquareError('');
      if (isTestMode()) { setSquareError('Pay Now is disabled until Square is configured.'); return; }
      const { name, email, address1, address, cancelCode, addressParts, phone, manualPayment } = buildPayload();
      if (!state.items.length) { setSquareError('Your cart is empty.'); return; }
      if (!name || !email || !address1 || !addressParts.city || !addressParts.state || !addressParts.zip) {
        setSquareError('Please add your name, email, and full shipping address.'); return;
      }
      if (squarePay) { squarePay.disabled = true; squarePay.textContent = 'Processing...'; }
      try {
        await ensureSquareCard();
        const tokenResult = await squareCard.tokenize();
        if (tokenResult.status !== 'OK') throw new Error(tokenResult.errors?.[0]?.message || 'Card could not be processed.');
        const payload = { amount: subtotal(), buyer: { name, email, phone, address, addressParts, manualPayment }, items: state.items, cancelCode, cancelWindowHours: CANCEL_WINDOW_HOURS };
        const resp = await fetch('/api/square-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, sourceId: tokenResult.token }),
        });
        const data = await resp.json().catch(() => ({}));
        if (!resp.ok || !data.success) throw new Error(data.error || 'Payment failed. Please try again.');
        await submitOrderSlipForm(payload);
        applyCheckoutSuccessMessage({ paymentStatus: 'paid' });
        setCancelDetails(cancelCode);
        saveLastOrder({ cancelCode, email, createdAt: Date.now(), paymentStatus: 'paid' });
        state.items = []; save(); render();
        window.closeCheckoutModal?.();
        window.location.hash = '#checkout-success';
      } catch (err) {
        setSquareError(err.message || 'Payment failed.');
      } finally {
        if (squarePay) squarePay.textContent = 'Pay Now';
        updatePayNowState();
      }
    };

    // Pay Later handler
    const handlePayLater = async () => {
      setSquareError('');
      const { name, email, address1, address, cancelCode, addressParts, phone, manualPayment } = buildPayload();
      if (!state.items.length) { setSquareError('Your cart is empty.'); return; }
      if (!name || !email || !address1 || !addressParts.city || !addressParts.state || !addressParts.zip) {
        setSquareError('Please add your name, email, and full shipping address.'); return;
      }
      const payload = { amount: subtotal(), buyer: { name, email, phone, address, addressParts, manualPayment }, items: state.items, cancelCode, cancelWindowHours: CANCEL_WINDOW_HOURS };
      const sent = await submitOrderSlipForm(payload);
      if (!sent) { setSquareError('Could not submit order request. Please try again.'); return; }
      saveLastOrder({ cancelCode, email, createdAt: Date.now(), paymentStatus: 'pending' });
      applyCheckoutSuccessMessage({ paymentStatus: 'pending' });
      setCancelDetails(cancelCode);
      state.items = []; save(); render();
      window.closeCheckoutModal?.();
      window.location.hash = '#checkout-success';
    };

    squarePay?.addEventListener('click', handleSquarePay);
    squarePayLater?.addEventListener('click', handlePayLater);

    // Cancel submit buttons
    const makeStatusSetter = (el) => (msg = '', isError = false) => {
      if (!el) return;
      el.textContent = msg;
      el.classList.toggle('hidden', !msg);
      el.classList.toggle('text-red-400', !!(msg && isError));
      el.classList.toggle('text-green-400', !!(msg && !isError));
    };

    document.getElementById('cancel-submit')?.addEventListener('click', async () => {
      await handleCancelSubmit({
        email: (document.getElementById('cancel-email')?.value || '').trim(),
        cancelCode: (document.getElementById('cancel-code-input')?.value || '').trim(),
        reason: (document.getElementById('cancel-reason')?.value || '').trim(),
        setStatus: makeStatusSetter(document.getElementById('cancel-submit-status')),
      });
    });

    document.getElementById('cancel-page-submit')?.addEventListener('click', async () => {
      await handleCancelSubmit({
        email: (document.getElementById('cancel-page-email')?.value || '').trim(),
        cancelCode: (document.getElementById('cancel-page-code')?.value || '').trim(),
        reason: (document.getElementById('cancel-page-reason')?.value || '').trim(),
        setStatus: makeStatusSetter(document.getElementById('cancel-page-status')),
      });
    });

    hydrateCancelForm();
    window.addEventListener('hashchange', () => {
      if (window.location.hash === '#checkout-success') {
        hydrateCancelForm();
        applyCheckoutSuccessMessage(loadLastOrder());
      }
    });

    updatePayNowState();

    // Prepare Square card UI
    if (!isTestMode()) {
      loadSquareSdk().then(ensureSquareCard).catch((err) => {
        if (squareError) { squareError.textContent = err.message; squareError.classList.remove('hidden'); }
      });
    }
  }

  // ── Public API ───────────────────────────────────────────────
  window.Cart = { add, remove, updateQty, open: nudgeCartIcon, goToCheckout, getPriceForSize };

  // ── Init ─────────────────────────────────────────────────────
  load();
  wireBasics();
  render();

  // Restore success page state on direct load
  if (window.location.hash === '#checkout-success') {
    applyCheckoutSuccessMessage(loadLastOrder());
  }
})();
