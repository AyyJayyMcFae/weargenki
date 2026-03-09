// =============================================================
// auth.js — Supabase auth, wishlist, and account page logic
// Depends on: genki-config.js, supabase-js CDN
// =============================================================

const authState = {
  user: null,
  wishlistIds: new Set(),
  supabaseClient: null,
};

(function () {
  const localConfig = window.__GENKI_CONFIG__ || {};
  const SUPABASE_URL = localConfig.SUPABASE_URL || 'REPLACE_WITH_SUPABASE_URL';
  const SUPABASE_ANON_KEY = localConfig.SUPABASE_ANON_KEY || 'REPLACE_WITH_SUPABASE_ANON_KEY';
  const SITE_URL = (localConfig.SITE_URL || '').trim();

  const WISHLIST_TABLE = 'wishlists';
  const PROFILE_TABLE = 'profiles';
  const ORDERS_TABLE = 'orders';
  const ORDER_ITEMS_TABLE = 'order_items';

  // ── Helpers ──────────────────────────────────────────────────
  const escapeHtml = (v = '') =>
    String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const formatDate = (iso) => {
    if (!iso) return 'Unknown date';
    const d = new Date(iso);
    return isNaN(d) ? 'Unknown date' : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatMoney = (cents, currency = 'USD') =>
    new Intl.NumberFormat(undefined, { style: 'currency', currency }).format((Number(cents) || 0) / 100);

  function hasSupabaseConfig() {
    return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && !SUPABASE_URL.startsWith('REPLACE_') && !SUPABASE_ANON_KEY.startsWith('REPLACE_'));
  }

  function resolveAuthRedirectTo() {
    const fallback = `${window.location.origin}${window.location.pathname}`;
    if (!SITE_URL) return fallback;
    try { return new URL(window.location.pathname, SITE_URL).toString(); } catch (_) { return fallback; }
  }

  function getUserChipLabel(user) {
    const source = (user?.user_metadata?.full_name || user?.email || 'Guest').trim();
    return source.length > 22 ? `${source.slice(0, 22)}...` : source;
  }

  // ── Wishlist icon SVG ────────────────────────────────────────
  function renderWishlistIconSvg(filled) {
    return filled
      ? '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>';
  }

  window.wishlistButtonMarkup = function (productId) {
    const wished = authState.wishlistIds.has(productId);
    const label = wished ? 'Remove from wishlist' : 'Add to wishlist';
    const tone = wished ? 'text-red-400 border-red-400/70 bg-black/60' : 'text-white border-white/30 bg-black/60';
    return `<button type="button" data-wishlist-toggle="${productId}" aria-label="${label}" class="wishlist-toggle absolute top-3 left-3 w-9 h-9 border ${tone} flex items-center justify-center hover:border-white transition z-10">${renderWishlistIconSvg(wished)}</button>`;
  };

  // ── UI sync ──────────────────────────────────────────────────
  window.updateAuthUi = function () {
    const user = authState.user;
    const authChip = document.getElementById('auth-chip');
    const authButton = document.getElementById('auth-button');
    const wishlistCount = document.getElementById('wishlist-count');
    const wishlistPageCopy = document.getElementById('wishlist-page-copy');
    const accountPageCopy = document.getElementById('account-page-copy');
    const accountSignOutButton = document.getElementById('account-signout-button');

    if (authChip) authChip.textContent = getUserChipLabel(user);
    if (authButton) { authButton.setAttribute('aria-label', user ? 'Account' : 'Login'); }
    if (wishlistCount) wishlistCount.textContent = String(authState.wishlistIds.size);
    if (wishlistPageCopy) wishlistPageCopy.textContent = user ? 'Saved items are attached to your account.' : 'Sign in with Google to save products to your wishlist.';
    if (accountPageCopy) accountPageCopy.textContent = user ? 'Manage your profile and review your order history.' : 'Sign in to manage your profile and view order history.';
    if (accountSignOutButton) accountSignOutButton.classList.toggle('hidden', !user);

    const hash = (window.location.hash || '#home').split('?')[0];
    if (hash === '#wishlist') window.renderWishlistPage?.();
    if (hash === '#account') window.renderAccountPage?.();
    window.updateProductWishlistButton?.();
  };

  // ── Wishlist ─────────────────────────────────────────────────
  async function loadWishlistFromSupabase() {
    if (!authState.supabaseClient || !authState.user) { authState.wishlistIds = new Set(); return; }
    const { data, error } = await authState.supabaseClient.from(WISHLIST_TABLE).select('product_id').eq('user_id', authState.user.id);
    if (error) { console.error('Wishlist load failed:', error); return; }
    authState.wishlistIds = new Set((data || []).map((r) => r.product_id).filter(Boolean));
  }

  window.toggleWishlistProduct = async function (productId) {
    if (!authState.supabaseClient || !authState.user) { await signInWithGoogle(); return false; }
    const alreadySaved = authState.wishlistIds.has(productId);
    if (alreadySaved) {
      const { error } = await authState.supabaseClient.from(WISHLIST_TABLE).delete().eq('user_id', authState.user.id).eq('product_id', productId);
      if (error) { console.error('Wishlist remove failed:', error); return false; }
      authState.wishlistIds.delete(productId);
    } else {
      const { error } = await authState.supabaseClient.from(WISHLIST_TABLE).insert([{ user_id: authState.user.id, product_id: productId }]);
      if (error && error.code !== '23505') { console.error('Wishlist save failed:', error); return false; }
      authState.wishlistIds.add(productId);
    }
    window.updateAuthUi();
    return true;
  };

  // ── Auth actions ─────────────────────────────────────────────
  async function signInWithGoogle() {
    if (!authState.supabaseClient) { alert('Add SUPABASE_URL and SUPABASE_ANON_KEY in genki-config.js first.'); return; }
    const { error } = await authState.supabaseClient.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: resolveAuthRedirectTo() } });
    if (error) alert(error.message || 'Unable to start Google sign-in.');
  }

  async function signOutUser() {
    if (!authState.supabaseClient) return;
    const { error } = await authState.supabaseClient.auth.signOut();
    if (error) { alert(error.message || 'Sign-out failed.'); return; }
    if ((window.location.hash || '#home').split('?')[0] === '#account') window.location.hash = '#home';
  }

  window.refreshAuthState = async function () {
    if (!authState.supabaseClient) { authState.user = null; authState.wishlistIds = new Set(); window.updateAuthUi(); return; }
    const { data } = await authState.supabaseClient.auth.getSession();
    authState.user = data?.session?.user || null;
    await loadWishlistFromSupabase();
    window.updateAuthUi();
    if ((window.location.hash || '').split('?')[0] === '#account') window.renderAccountPage?.();
  };

  // ── Account page ─────────────────────────────────────────────
  function setAccountViewSignedIn(signedIn) {
    document.getElementById('account-auth-gate')?.classList.toggle('hidden', signedIn);
    document.getElementById('account-content')?.classList.toggle('hidden', !signedIn);
  }

  function setAccountProfileStatus(msg = '', isError = false) {
    const el = document.getElementById('account-profile-status');
    if (!el) return;
    el.textContent = msg;
    el.classList.toggle('text-red-400', !!(msg && isError));
    el.classList.toggle('text-green-400', !!(msg && !isError));
    el.classList.toggle('text-gray-400', !msg);
  }

  async function loadProfileForAccount() {
    if (!authState.supabaseClient || !authState.user) return;
    const emailEl = document.getElementById('account-email');
    const nameEl = document.getElementById('account-full-name');
    const phoneEl = document.getElementById('account-phone');
    const marketingEl = document.getElementById('account-marketing-opt-in');
    if (emailEl) emailEl.value = authState.user.email || '';
    if (nameEl) nameEl.value = authState.user.user_metadata?.full_name || '';
    if (phoneEl) phoneEl.value = '';
    if (marketingEl) marketingEl.checked = false;
    const { data, error } = await authState.supabaseClient.from(PROFILE_TABLE).select('full_name, phone, marketing_opt_in').eq('user_id', authState.user.id).maybeSingle();
    if (error && error.code !== 'PGRST116') { setAccountProfileStatus(`Could not load profile: ${error.message}`, true); return; }
    if (data) {
      if (nameEl) nameEl.value = data.full_name || nameEl.value || '';
      if (phoneEl) phoneEl.value = data.phone || '';
      if (marketingEl) marketingEl.checked = !!data.marketing_opt_in;
    }
    setAccountProfileStatus('');
  }

  async function saveProfileFromForm() {
    if (!authState.supabaseClient || !authState.user) { setAccountProfileStatus('Sign in first.', true); return; }
    const nameEl = document.getElementById('account-full-name');
    const phoneEl = document.getElementById('account-phone');
    const marketingEl = document.getElementById('account-marketing-opt-in');
    const payload = {
      user_id: authState.user.id,
      full_name: (nameEl?.value || '').trim() || null,
      phone: (phoneEl?.value || '').trim() || null,
      marketing_opt_in: !!marketingEl?.checked,
      updated_at: new Date().toISOString(),
    };
    const { error } = await authState.supabaseClient.from(PROFILE_TABLE).upsert(payload, { onConflict: 'user_id' });
    if (error) { setAccountProfileStatus(`Could not save: ${error.message}`, true); return; }
    if (payload.full_name) authState.user = { ...authState.user, user_metadata: { ...authState.user.user_metadata, full_name: payload.full_name } };
    window.updateAuthUi();
    setAccountProfileStatus('Profile saved.', false);
  }

  function renderOrdersList(orders = [], itemMap = new Map()) {
    const list = document.getElementById('account-orders-list');
    if (!list) return;
    if (!orders.length) { list.innerHTML = '<p class="text-sm text-gray-400">No orders yet.</p>'; return; }
    list.innerHTML = '';
    orders.forEach((order) => {
      const wrap = document.createElement('article');
      wrap.className = 'border border-white/10 p-4 bg-black/20';
      const items = itemMap.get(order.id) || [];
      const itemLines = items.length
        ? items.map((line) => {
          const title = escapeHtml(line.product_title || line.product_id || 'Item');
          const opts = [line.color, line.size].filter(Boolean).map(escapeHtml).join(' / ');
          return `<li class="text-sm text-gray-300">${title}${opts ? ` (${opts})` : ''} x${line.qty || 1} <span class="text-gray-500">${formatMoney(line.price_cents, order.currency)}</span></li>`;
        }).join('')
        : '<li class="text-sm text-gray-500">No line items found.</li>';
      wrap.innerHTML = `
        <div class="flex items-center justify-between gap-3 mb-2">
          <p class="text-sm uppercase tracking-[0.2em] text-gray-400">Order ${escapeHtml(order.order_number || String(order.id))}</p>
          <p class="text-sm text-gray-400">${formatDate(order.created_at)}</p>
        </div>
        <div class="flex items-center justify-between gap-3 mb-3">
          <p class="text-sm text-gray-300">Status: <span class="uppercase tracking-[0.15em]">${escapeHtml(order.status || 'pending')}</span></p>
          <p class="text-sm text-white font-semibold">${formatMoney(order.total_cents, order.currency)}</p>
        </div>
        <ul class="space-y-1">${itemLines}</ul>`;
      list.appendChild(wrap);
    });
  }

  async function loadOrdersForAccount() {
    const list = document.getElementById('account-orders-list');
    if (!list) return;
    if (!authState.supabaseClient || !authState.user) { list.innerHTML = '<p class="text-sm text-gray-400">Sign in to view order history.</p>'; return; }
    list.innerHTML = '<p class="text-sm text-gray-400">Loading orders...</p>';
    const { data: orders, error } = await authState.supabaseClient.from(ORDERS_TABLE).select('id, order_number, status, total_cents, currency, created_at').eq('user_id', authState.user.id).order('created_at', { ascending: false });
    if (error) { list.innerHTML = '<p class="text-sm text-red-400">Could not load orders.</p>'; return; }
    const orderIds = (orders || []).map((o) => o.id);
    let itemMap = new Map();
    if (orderIds.length) {
      const { data: items } = await authState.supabaseClient.from(ORDER_ITEMS_TABLE).select('order_id, product_id, product_title, qty, price_cents, size, color').in('order_id', orderIds);
      itemMap = (items || []).reduce((acc, item) => {
        if (!acc.has(item.order_id)) acc.set(item.order_id, []);
        acc.get(item.order_id).push(item);
        return acc;
      }, new Map());
    }
    renderOrdersList(orders || [], itemMap);
  }

  window.renderAccountPage = async function () {
  if (!authState.supabaseClient) { setAccountViewSignedIn(false); return; }
  
  // Show a neutral loading state instead of signed-out while we wait
  const gate = document.getElementById('account-auth-gate');
  const content = document.getElementById('account-content');
  if (gate) gate.classList.add('hidden');
  if (content) content.classList.add('hidden');

  if (!authState.user) {
    const { data } = await authState.supabaseClient.auth.getSession();
    authState.user = data?.session?.user || null;
  }

  if (!authState.user) {
    setAccountViewSignedIn(false);
    const list = document.getElementById('account-orders-list');
    if (list) list.innerHTML = '<p class="text-sm text-gray-400">Sign in to view order history.</p>';
    setAccountProfileStatus('');
    return;
  }

  setAccountViewSignedIn(true);
  await loadProfileForAccount();
  await loadOrdersForAccount();
};

  // ── Bind controls (called once on init) ─────────────────────
  function bindAuthControls() {
    const bind = (id, handler) => {
      const el = document.getElementById(id);
      if (el && !el.dataset.bound) { el.addEventListener('click', handler); el.dataset.bound = '1'; }
    };
    bind('auth-button', () => { window.location.hash = '#account'; });
    bind('wishlist-nav-button', () => { window.location.hash = '#wishlist'; });
    bind('account-signin-button', signInWithGoogle);
    bind('account-signout-button', signOutUser);
    bind('account-refresh-orders', loadOrdersForAccount);

    const profileForm = document.getElementById('account-profile-form');
    if (profileForm && !profileForm.dataset.bound) {
      profileForm.addEventListener('submit', (e) => { e.preventDefault(); saveProfileFromForm(); });
      profileForm.dataset.bound = '1';
    }
  }

  // ── Newsletter modal submit ──────────────────────────────────
  function bindNewsletterForm() {
    const form = document.getElementById('newsletter-form');
    const emailEl = document.getElementById('newsletter-email');
    const status = document.getElementById('newsletter-status');
    if (!form || form.dataset.bound) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = (emailEl?.value || '').trim();
      if (!email) return;
      if (authState.supabaseClient) {
        const { error } = await authState.supabaseClient.from('newsletter_subscribers').insert([{ email }]);
        if (error && error.code !== '23505') {
          if (status) { status.textContent = 'Something went wrong. Try again.'; status.classList.remove('hidden'); }
          form.reset(); return;
        }
      }
      if (status) { status.textContent = `Thanks. ${email} is queued for newsletter updates.`; status.classList.remove('hidden'); }
      form.reset();
    });
    form.dataset.bound = '1';
  }

  // ── Init ─────────────────────────────────────────────────────
  window.initSupabaseWishlist = async function () {
    bindAuthControls();
    bindNewsletterForm();
    if (!hasSupabaseConfig() || !window.supabase?.createClient) { window.updateAuthUi(); return; }
    authState.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });
    authState.supabaseClient.auth.onAuthStateChange(async (_event, session) => {
      authState.user = session?.user || null;
      await loadWishlistFromSupabase();
      window.updateAuthUi();
      if (_event === 'SIGNED_IN' && session?.user) {
        await fetch('https://formsubmit.co/ayyjayy.genki@gmail.com', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: session.user.email, _subject: 'New Genki Account Created' }),
        });
      }
    });
    await window.refreshAuthState();
  };
})();
