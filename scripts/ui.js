// =============================================================
// ui.js — Product renderers, shop grid, wishlist, lookbook
// Depends on: products.js, auth.js, cart.js
// =============================================================

// ── Shared helpers ────────────────────────────────────────────
function getProductPriceNumber(product) {
  const n = parseFloat(String(product?.price || '').replace(/[^0-9.]/g, ''));
  return isFinite(n) ? n : 0;
}

function getPrimaryCategory(product) {
  if (Array.isArray(product?.categories) && product.categories.length) return String(product.categories[0]);
  if (product?.categories) return String(product.categories);
  if (product?.category) return String(product.category);
  return '';
}

function getDefaultOptionLabel(product) {
  if (Array.isArray(product?.colors) && product.colors.length) return product.colors[0]?.name || '';
  if (Array.isArray(product?.skullOptions) && product.skullOptions.length) {
    const skull = product.skullOptions[0];
    const hoodie = skull?.hoodies?.[0];
    return hoodie?.name && skull?.name ? `${skull.name} / ${hoodie.name}` : skull?.name || '';
  }
  return '';
}

function renderUrgencyTagBadge(product, tone = 'overlay') {
  const tag = normalizeUrgencyTag(product?.urgencyTag);
  if (!tag) return '';
  const cls = tone === 'inline' ? 'border-amber-400/60 text-white bg-red-950/25' : 'border-amber-400/60 text-white bg-red-950/45';
  return `<span class="text-[10px] font-medium tracking-[0.18em] px-2 py-1 border ${cls}">${tag}</span>`;
}

// ── Related products ──────────────────────────────────────────
function getRelatedProducts(currentProduct, limit = 4) {
  const currentCategory = getPrimaryCategory(currentProduct).toLowerCase();
  const currentPrice = getProductPriceNumber(currentProduct);
  return PRODUCTS
    .filter((p) => p.id !== currentProduct.id)
    .map((p) => {
      const sameCategory = currentCategory && getPrimaryCategory(p).toLowerCase() === currentCategory;
      const priceScore = Math.max(0, 2 - Math.abs(currentPrice - getProductPriceNumber(p)) / 20);
      const badgeBonus = currentProduct.badge && p.badge === currentProduct.badge ? 0.4 : 0;
      return { product: p, score: (sameCategory ? 3 : 0) + priceScore + badgeBonus };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((e) => e.product);
}

function renderRelatedProducts(currentProduct) {
  const grid = document.getElementById('related-products-grid');
  if (!grid) return;
  const related = getRelatedProducts(currentProduct, 4);
  grid.innerHTML = '';
  if (!related.length) {
    grid.innerHTML = '<p class="col-span-full text-sm text-gray-400">No similar items found yet.</p>';
    return;
  }
  related.forEach((product) => {
    const image = product.images?.[0] || 'https://placehold.co/600x600/222222/ffffff?text=Product';
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'text-left border border-white/10 hover:border-white transition bg-transparent';
    card.innerHTML = `
      <img src="${image}" alt="${product.title}" class="w-full h-36 object-contain bg-neutral-900" onerror="this.onerror=null;this.src='https://placehold.co/600x600/222222/ffffff?text=Product'">
      <div class="p-2">
        <p class="text-xs text-white truncate">${product.title}</p>
        <p class="text-xs text-gray-400">${product.price || ''}</p>
      </div>`;
    card.addEventListener('click', () => { window.location.hash = `#${product.id}`; });
    grid.appendChild(card);
  });
}

// ── Shop grid ─────────────────────────────────────────────────
function renderShopGrid(productsToRender, title = 'ALL PRODUCTS') {
  const gridContainer = document.getElementById('shop-product-grid');
  const shopTitle = document.getElementById('shop-title');
  if (!gridContainer || !shopTitle) return;

  shopTitle.textContent = title;
  gridContainer.innerHTML = '';

  if (!productsToRender.length) {
    gridContainer.innerHTML = '<p class="col-span-full text-gray-400 text-center py-10 text-xl">No products found matching your criteria.</p>';
    return;
  }

  productsToRender.forEach((product) => {
    const colors = Array.isArray(product.colors) ? product.colors : [];
    const sizes = Array.isArray(product.sizes) ? product.sizes : [];
    const defaultOptionLabel = getDefaultOptionLabel(product);
    const firstColor = colors[0] || { name: 'Black', color: 'bg-black' };

    const card = document.createElement('div');
    card.className = 'bg-transparent overflow-hidden shadow-lg border border-white/10 cursor-pointer hover:border-white transition';
    card.onclick = () => { window.location.hash = `#${product.id}`; };

    card.innerHTML = `
      <div class="relative overflow-hidden">
        ${window.wishlistButtonMarkup(product.id)}
        <img src="${product.images[0]}" alt="${product.title}" class="w-full max-h-80 aspect-[4/5] object-contain bg-neutral-900" style="width:100%;height:auto;">
        ${(product.badge || normalizeUrgencyTag(product.urgencyTag)) ? `
          <div class="absolute top-3 right-3 flex flex-col items-end gap-1">
            ${product.badge ? `<span class="bg-blue-900 text-white text-xs px-2 py-1 font-medium">${product.badge}</span>` : ''}
            ${renderUrgencyTagBadge(product)}
          </div>` : ''}
      </div>
      <div class="p-4">
        <h3 class="font-semibold text-white mb-1">${product.title}</h3>
        <p class="text-sm text-gray-400">${product.price}</p>
        <div class="flex justify-start space-x-2 mt-2">
          <div class="w-3 h-3 ${firstColor.color} border border-white/50" title="${firstColor.name}"></div>
          ${colors.length > 1 ? `<span class="text-xs text-gray-500"> + ${colors.length - 1} colors</span>` : ''}
        </div>
        <div data-quick-controls class="mt-3 flex gap-2">
          ${sizes.length ? `
            <select data-quick-size class="flex-1 bg-neutral-900 border border-white/15 p-2 text-white text-xs focus:outline-none focus:border-white/40">
              ${sizes.map((s) => `<option value="${s}">${s}</option>`).join('')}
            </select>` : ''}
          <button type="button" data-quick-add class="px-3 py-2 border border-white/25 text-white text-xs uppercase tracking-[0.15em] hover:border-white transition">Quick Add</button>
        </div>
      </div>`;

    // Wishlist toggle
    card.querySelector('[data-wishlist-toggle]')?.addEventListener('click', async (e) => {
      e.preventDefault(); e.stopPropagation();
      const changed = await window.toggleWishlistProduct(product.id);
      if (changed) renderShopGrid(productsToRender, title);
    });

    // Quick controls stop propagation
    card.querySelector('[data-quick-controls]')?.addEventListener('click', (e) => e.stopPropagation());

    // Quick Add
    card.querySelector('[data-quick-add]')?.addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      if (!window.Cart?.add) return;
      const sizeSelect = card.querySelector('[data-quick-size]');
      const priceCents = Math.round(getProductPriceNumber(product) * 100);
      Cart.add({
        id: product.id, title: product.title, priceCents, qty: 1,
        color: defaultOptionLabel || undefined,
        size: sizeSelect?.value || undefined,
        image: product.images?.[0] || undefined,
      });
      Cart.open();
    });

    gridContainer.appendChild(card);
  });
}

// ── Wishlist page ─────────────────────────────────────────────
window.renderWishlistPage = function () {
  const grid = document.getElementById('wishlist-product-grid');
  if (!grid) return;

  if (!authState.user) {
    grid.innerHTML = `
      <div class="col-span-full border border-white/10 bg-neutral-900/50 p-6 text-center">
        <p class="text-gray-300 mb-4">Sign in to use your account wishlist.</p>
        <button type="button" id="wishlist-signin-btn" class="px-6 py-3 bg-white text-black font-semibold uppercase tracking-widest text-sm hover:bg-gray-200 transition">Sign in with Google</button>
      </div>`;
    document.getElementById('wishlist-signin-btn')?.addEventListener('click', () => {
      document.getElementById('account-signin-button')?.click();
    });
    return;
  }

  const products = PRODUCTS.filter((p) => authState.wishlistIds.has(p.id));
  if (!products.length) {
    grid.innerHTML = '<p class="col-span-full text-gray-400 text-center py-10 text-xl">Your wishlist is empty.</p>';
    return;
  }

  grid.innerHTML = '';
  products.forEach((product) => {
    const image = product.images?.[0] || 'https://placehold.co/600x600/222222/ffffff?text=Product';
    const card = document.createElement('div');
    card.className = 'bg-transparent overflow-hidden shadow-lg border border-white/10 cursor-pointer hover:border-white transition';
    card.innerHTML = `
      <div class="relative overflow-hidden">
        ${window.wishlistButtonMarkup(product.id)}
        <img src="${image}" alt="${product.title}" class="w-full h-80 object-cover">
      </div>
      <div class="p-4">
        <h3 class="font-semibold text-white mb-1">${product.title}</h3>
        <p class="text-sm text-gray-400">${product.price || ''}</p>
      </div>`;
    card.addEventListener('click', () => { window.location.hash = `#${product.id}`; });
    card.querySelector('[data-wishlist-toggle]')?.addEventListener('click', async (e) => {
      e.preventDefault(); e.stopPropagation();
      const changed = await window.toggleWishlistProduct(product.id);
      if (changed) window.renderWishlistPage();
    });
    grid.appendChild(card);
  });
};

// ── Featured carousel (home page) ────────────────────────────
const FEATURED_RULE = 'sketch';
const FEATURED_FALLBACK_IDS = ['genki-esquire-jacket', 'acd-kancho-hancho-shirt', 'genki-sakura-hoodie', 'acd-neko-pastel-cap', 'genki-america-snapback'];

function getFeaturedProducts(limit = 5) {
  const rule = String(FEATURED_RULE || '').toLowerCase();
  const wantsSketch = /\b(sketch|acd)\b/i.test(rule);
  let filtered = PRODUCTS.filter((p) => {
    if (!wantsSketch) return true;
    return /sketch|acd/i.test(`${p.badge || ''} ${p.keywords || ''}`);
  });
  if (!filtered.length) {
    const byId = new Map(PRODUCTS.map((p) => [p.id, p]));
    filtered = FEATURED_FALLBACK_IDS.map((id) => byId.get(id)).filter(Boolean);
  }
  if (filtered.length < limit) filtered = filtered.concat(PRODUCTS.filter((p) => !filtered.some((x) => x.id === p.id)));
  return filtered.slice(0, limit);
}

function renderNewArrivalsFromProducts() {
  const container = document.getElementById('new-items-carousel');
  if (!container) return;
  container.innerHTML = '';
  getFeaturedProducts(5).forEach((product, index) => {
    const visibilityClass = index === 3 ? ' hidden md:block' : index === 4 ? ' hidden xl:block' : '';
    const image = product.images?.[0] || 'https://placehold.co/600x600/222222/ffffff?text=Product';
    const colors = Array.isArray(product.colors) ? product.colors : [];
    const colorDots = colors.slice(0, 5).map((c) => `<div class="w-4 h-4 ${c?.color || 'bg-black'} border border-white/50" title="${c?.name || ''}"></div>`).join('');
    const card = document.createElement('div');
    card.className = `bg-transparent overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-[1.02] transition duration-300 border border-white/10 cursor-pointer${visibilityClass}`;
    card.onclick = () => { window.location.hash = `#${product.id}`; };
    card.innerHTML = `
      <div class="relative overflow-hidden">
        <img src="${image}" alt="${product.title}" class="w-full h-64 object-contain bg-neutral-900 transition duration-300 hover:opacity-80" onerror="this.onerror=null;this.src='https://placehold.co/600x600/222222/ffffff?text=Product'">
        <div class="absolute top-3 right-3 flex flex-col items-end gap-1">
          <span class="bg-blue-900 text-white text-xs px-2 py-1 font-medium">FEATURED</span>
          ${renderUrgencyTagBadge(product)}
        </div>
      </div>
      <div class="p-4 text-center">
        <h3 class="text-lg font-semibold text-white mb-1">${product.title}</h3>
        <p class="text-sm text-gray-400 mb-3">${product.price || ''}</p>
        ${colorDots ? `<div class="flex justify-center space-x-2">${colorDots}</div>` : ''}
      </div>`;
    container.appendChild(card);
  });
}

// ── New arrivals page ─────────────────────────────────────────
const NEW_ARRIVALS_LIMIT = 8;

function renderShopNewFromProducts() {
  const grid = document.getElementById('new-page-grid');
  if (!grid) return;
  grid.innerHTML = '';
  PRODUCTS.slice(0, NEW_ARRIVALS_LIMIT).forEach((product) => {
    const image = product.images?.[0] || 'https://placehold.co/600x600/222222/ffffff?text=Product';
    const card = document.createElement('div');
    card.className = 'bg-transparent overflow-hidden shadow-lg border border-white/10 cursor-pointer hover:border-white';
    card.onclick = () => { window.location.hash = `#${product.id}`; };
    card.innerHTML = `
      <div class="relative overflow-hidden">
        <img src="${image}" alt="${product.title}" class="w-full h-80 object-contain bg-neutral-900" onerror="this.onerror=null;this.src='https://placehold.co/600x600/222222/ffffff?text=Product'">
        <div class="absolute top-3 right-3 flex flex-col items-end gap-1">
          <span class="bg-blue-900 text-white text-xs px-2 py-1 font-medium">NEW</span>
          ${renderUrgencyTagBadge(product)}
        </div>
      </div>
      <div class="p-4">
        <h3 class="font-semibold text-white mb-1">${product.title}</h3>
        <p class="text-sm text-gray-400">${product.price || ''}</p>
      </div>`;
    grid.appendChild(card);
  });
}

// ── Wishlist button on PDP ────────────────────────────────────
window.updateProductWishlistButton = function () {
  const btn = document.getElementById('product-wishlist-toggle');
  if (!btn) return;
  const hash = (window.location.hash || '').split('?')[0].replace('#', '');
  const activeId = PRODUCTS.some((p) => p.id === hash) ? hash : '';
  if (!activeId) { btn.style.display = 'none'; return; }
  const wished = authState.wishlistIds.has(activeId);
  btn.style.display = 'block';
  btn.textContent = wished ? 'REMOVE FROM WISHLIST' : 'ADD TO WISHLIST';
  btn.classList.toggle('bg-white', wished);
  btn.classList.toggle('text-black', wished);
  btn.classList.toggle('border-white', wished);
  btn.classList.toggle('text-white', !wished);
};

// ── Product detail page ───────────────────────────────────────
function renderProduct(key) {
  const data = PRODUCTS.find((p) => p.id === key);
  if (!data) return;

  const fallbackImages = data.images || [];
  const getImagesForColor = (colorObj) => {
    if (!colorObj) return fallbackImages;
    if (Array.isArray(colorObj.images) && colorObj.images.length) return colorObj.images;
    if (colorObj.image) return [colorObj.image];
    return fallbackImages;
  };

  const el = (id) => document.getElementById(id);
  const titleEl = el('product-title');
  const priceEl = el('product-price');
  const mainImg = el('product-main-image');
  const thumbs = el('product-thumbs');
  const thumbsPrev = el('product-thumbs-prev');
  const thumbsNext = el('product-thumbs-next');
  const badge = el('product-badge');
  const urgencyBadge = el('product-urgency-badge');
  const hoodieColorsContainer = el('product-hoodie-colors');
  const skullColorsContainer = el('product-skull-colors');
  const hoodieLabel = el('product-hoodie-label');
  const skullLabel = el('product-skull-label');
  const hoodieName = el('product-hoodie-name');
  const skullName = el('product-skull-name');
  const hoodieBlock = el('product-hoodie-block');
  const skullBlock = el('product-skull-block');
  const sizeBlock = el('product-size-block');
  const sizeName = el('product-size-name');
  const sizesContainer = el('product-sizes');
  const detailsList = el('product-details-list');
  const mainImgViewport = el('product-main-image-viewport');
  const mainImgWrapper = mainImg?.parentElement;

  const THUMBS_PER_PAGE = 3;
  let activeImageIndex = 0;
  let thumbWindowStart = 0;
  let currentGalleryImages = [];

  // ── Zoom state ───────────────────────────────────────────────
  let zoomScale = 1;
  let panX = 0, panY = 0;
  let draggingZoom = false, movedWhileDragging = false;
  let dragStartClientX = 0, dragStartClientY = 0, dragStartPanX = 0, dragStartPanY = 0, dragPointerId = null;
  const ZOOM_TAP_SCALE = 2, ZOOM_MAX = 3;

  const clampZoomPan = () => {
    const w = mainImg?.clientWidth || 0, h = mainImg?.clientHeight || 0;
    const maxX = Math.max(0, ((zoomScale - 1) * w) / 2);
    const maxY = Math.max(0, ((zoomScale - 1) * h) / 2);
    panX = Math.max(-maxX, Math.min(maxX, panX));
    panY = Math.max(-maxY, Math.min(maxY, panY));
  };

  const applyZoomTransform = () => {
    clampZoomPan();
    if (mainImg) {
      mainImg.style.transform = `translate3d(${panX}px, ${panY}px, 0) scale(${zoomScale})`;
      mainImg.style.cursor = zoomScale > 1 ? (draggingZoom ? 'grabbing' : 'grab') : 'zoom-in';
    }
  };

  const resetMainImageZoom = (animate = true) => {
    zoomScale = 1; panX = 0; panY = 0; draggingZoom = false; movedWhileDragging = false;
    if (mainImg) {
      mainImg.style.transition = animate ? 'transform 160ms ease' : 'none';
      applyZoomTransform();
      if (!animate) requestAnimationFrame(() => { mainImg.style.transition = 'transform 160ms ease'; });
    }
  };

  if (mainImg) {
    mainImg.onclick = (e) => {
      if (movedWhileDragging) { movedWhileDragging = false; return; }
      if (zoomScale === 1) {
        const rect = mainImg.getBoundingClientRect();
        panX = -(e.clientX - rect.left - rect.width / 2) * (ZOOM_TAP_SCALE - 1);
        panY = -(e.clientY - rect.top - rect.height / 2) * (ZOOM_TAP_SCALE - 1);
        zoomScale = Math.min(ZOOM_MAX, ZOOM_TAP_SCALE);
        mainImg.style.transition = 'transform 160ms ease';
        applyZoomTransform();
      } else { resetMainImageZoom(true); }
    };
    mainImg.onpointerdown = (e) => {
      if (zoomScale <= 1) return;
      draggingZoom = true; movedWhileDragging = false; dragPointerId = e.pointerId;
      dragStartClientX = e.clientX; dragStartClientY = e.clientY; dragStartPanX = panX; dragStartPanY = panY;
      mainImg.style.transition = 'none'; mainImg.style.cursor = 'grabbing';
      try { mainImg.setPointerCapture(e.pointerId); } catch (_) {}
      e.preventDefault();
    };
    mainImg.onpointermove = (e) => {
      if (!draggingZoom || e.pointerId !== dragPointerId) return;
      const dx = e.clientX - dragStartClientX, dy = e.clientY - dragStartClientY;
      if (Math.abs(dx) + Math.abs(dy) > 3) movedWhileDragging = true;
      panX = dragStartPanX + dx; panY = dragStartPanY + dy;
      applyZoomTransform(); e.preventDefault();
    };
    const endZoomDrag = (e) => {
      if (!draggingZoom || e?.pointerId !== dragPointerId) return;
      draggingZoom = false; dragPointerId = null;
      mainImg.style.transition = 'transform 80ms ease-out';
      applyZoomTransform();
      requestAnimationFrame(() => { mainImg.style.transition = 'transform 160ms ease'; });
      try { mainImg.releasePointerCapture(e.pointerId); } catch (_) {}
    };
    mainImg.onpointerup = endZoomDrag;
    mainImg.onpointercancel = endZoomDrag;
    mainImg.ondragstart = () => false;
  }

  // ── Swipe (non-zoomed) ────────────────────────────────────────
  const SWIPE_MIN = 36, SWIPE_MAX_V = 48, SWIPE_MAX_MS = 450;
  let swipePointerId = null, swipeStartX = 0, swipeStartY = 0, swipeDeltaX = 0, swipeDeltaY = 0, swipeStartTime = 0;
  let suppressClick = false;

  const goPrev = () => { if (activeImageIndex > 0) { activeImageIndex--; syncActiveImage(); } };
  const goNext = () => { if (activeImageIndex < currentGalleryImages.length - 1) { activeImageIndex++; syncActiveImage(); } };

  if (mainImgViewport) {
    mainImgViewport.onpointerdown = (e) => {
      if (e.button !== 0 || e.target?.closest('#product-thumbs-prev, #product-thumbs-next') || zoomScale > 1) return;
      swipePointerId = e.pointerId; swipeStartX = e.clientX; swipeStartY = e.clientY;
      swipeDeltaX = 0; swipeDeltaY = 0; swipeStartTime = Date.now();
      try { mainImgViewport.setPointerCapture(e.pointerId); } catch (_) {}
    };
    mainImgViewport.onpointermove = (e) => {
      if (swipePointerId === null || e.pointerId !== swipePointerId) return;
      swipeDeltaX = e.clientX - swipeStartX; swipeDeltaY = e.clientY - swipeStartY;
    };
    const finishSwipe = (e) => {
      if (swipePointerId === null || e?.pointerId !== swipePointerId) return;
      const elapsed = Date.now() - swipeStartTime;
      const isSwipe = zoomScale === 1 && Math.abs(swipeDeltaX) >= SWIPE_MIN && Math.abs(swipeDeltaY) <= SWIPE_MAX_V && elapsed <= SWIPE_MAX_MS;
      if (isSwipe) { suppressClick = true; swipeDeltaX < 0 ? goNext() : goPrev(); requestAnimationFrame(() => { suppressClick = false; }); }
      try { mainImgViewport.releasePointerCapture(e.pointerId); } catch (_) {}
      swipePointerId = null;
    };
    mainImgViewport.onpointerup = finishSwipe;
    mainImgViewport.onpointercancel = finishSwipe;
  }

  if (thumbsPrev) thumbsPrev.onclick = goPrev;
  if (thumbsNext) thumbsNext.onclick = goNext;

  // ── Gallery sync ──────────────────────────────────────────────
  const backprintProductIds = new Set(['acd-organic-sweatshirt', 'genki-rainman-reverse-tee', 'ouroboros-sun-fade-fur-hoodie', 'acd-kancho-hancho-shirt']);

  const ensureBackprintBadge = () => {
    const existing = mainImgWrapper?.querySelector('.backprint-badge');
    const show = backprintProductIds.has(data.id) && activeImageIndex === 0;
    if (show && !existing) {
      const b = document.createElement('span');
      b.className = 'backprint-badge absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-[11px] uppercase tracking-[0.25em] text-white border border-white/10';
      b.textContent = 'Back print shown';
      mainImgWrapper.appendChild(b);
    } else if (!show && existing) { existing.remove(); }
  };

  const renderThumbWindow = () => {
    const total = currentGalleryImages.length;
    thumbs.innerHTML = '';
    currentGalleryImages.slice(thumbWindowStart, thumbWindowStart + THUMBS_PER_PAGE).forEach((src, offset) => {
      const absIdx = thumbWindowStart + offset;
      const img = document.createElement('img');
      img.src = src; img.alt = `${data.title} ${absIdx + 1}`;
      img.className = 'product-thumb w-full h-24 object-cover rounded border border-white/10 cursor-pointer hover:opacity-80 transition';
      img.dataset.index = absIdx;
      if (absIdx === activeImageIndex) img.classList.add('border-white', 'border-2');
      img.addEventListener('click', () => { activeImageIndex = absIdx; syncActiveImage(); });
      thumbs.appendChild(img);
    });
    if (thumbsPrev) thumbsPrev.disabled = total <= 1 || activeImageIndex <= 0;
    if (thumbsNext) thumbsNext.disabled = total <= 1 || activeImageIndex >= total - 1;
  };

  const syncActiveImage = () => {
    const total = currentGalleryImages.length;
    if (!total) { resetMainImageZoom(false); if (thumbsPrev) thumbsPrev.disabled = true; if (thumbsNext) thumbsNext.disabled = true; return; }
    activeImageIndex = Math.max(0, Math.min(activeImageIndex, total - 1));
    resetMainImageZoom(false);
    mainImg.src = currentGalleryImages[activeImageIndex];
    if (activeImageIndex < thumbWindowStart || activeImageIndex >= thumbWindowStart + THUMBS_PER_PAGE) {
      thumbWindowStart = Math.floor(activeImageIndex / THUMBS_PER_PAGE) * THUMBS_PER_PAGE;
    }
    renderThumbWindow();
    ensureBackprintBadge();
  };

  const renderGallery = (images) => {
    currentGalleryImages = (images?.length) ? images : fallbackImages;
    activeImageIndex = 0; thumbWindowStart = 0; syncActiveImage();
  };

  // ── Populate header fields ────────────────────────────────────
  if (titleEl) titleEl.textContent = data.title;
  if (priceEl) priceEl.textContent = data.price;
  if (hoodieLabel) hoodieLabel.textContent = data.primaryOptionLabel || 'Color';
  if (skullLabel) skullLabel.textContent = data.secondaryOptionLabel || 'Skull';
  if (badge) { badge.textContent = data.badge || ''; badge.style.display = data.badge ? 'inline-block' : 'none'; }
  if (urgencyBadge) {
    const tag = normalizeUrgencyTag(data.urgencyTag);
    urgencyBadge.textContent = tag;
    urgencyBadge.style.display = tag ? 'inline-block' : 'none';
  }

  // ── Variant selectors ─────────────────────────────────────────
  hoodieColorsContainer.innerHTML = '';
  skullColorsContainer.innerHTML = '';
  hoodieBlock.style.display = 'block';
  skullBlock.style.display = 'none';

  if (data.skullOptions?.length) {
    let activeSkull = 0, activeHoodie = 0;
    const getComboImages = () => {
      const skull = data.skullOptions[activeSkull] || {};
      const hoodie = skull.hoodies?.[activeHoodie];
      if (hoodie?.images?.length) return hoodie.images;
      if (hoodie?.image) return [hoodie.image];
      return skull.images?.length ? skull.images : fallbackImages;
    };
    const renderHoodies = () => {
      const hoodies = data.skullOptions[activeSkull]?.hoodies || [];
      hoodieColorsContainer.innerHTML = '';
      hoodieBlock.style.display = hoodies.length ? 'block' : 'none';
      if (hoodieName) hoodieName.textContent = hoodies[activeHoodie]?.name || 'N/A';
      hoodies.forEach((h, i) => {
        const btn = document.createElement('button');
        btn.title = h.name; btn.className = `w-8 h-8 ${h.color || 'bg-white'} border-2 border-white/20 hover:border-white transition`;
        if (i === activeHoodie) btn.classList.add('border-white');
        btn.addEventListener('click', () => {
          activeHoodie = i;
          hoodieColorsContainer.querySelectorAll('button').forEach((b) => b.classList.remove('border-white'));
          btn.classList.add('border-white');
          if (hoodieName) hoodieName.textContent = h.name;
          renderGallery(getComboImages());
        });
        hoodieColorsContainer.appendChild(btn);
      });
    };
    skullBlock.style.display = 'block';
    if (skullName) skullName.textContent = data.skullOptions[0]?.name || 'N/A';
    data.skullOptions.forEach((s, i) => {
      const btn = document.createElement('button');
      btn.title = s.name; btn.className = `w-8 h-8 ${s.color || 'bg-white'} border-2 border-white/20 hover:border-white transition`;
      if (i === 0) btn.classList.add('border-white');
      btn.addEventListener('click', () => {
        activeSkull = i; activeHoodie = 0;
        skullColorsContainer.querySelectorAll('button').forEach((b) => b.classList.remove('border-white'));
        btn.classList.add('border-white');
        if (skullName) skullName.textContent = s.name;
        renderHoodies(); renderGallery(getComboImages());
      });
      skullColorsContainer.appendChild(btn);
    });
    renderHoodies(); renderGallery(getComboImages());

  } else if (data.colors?.length) {
    if (hoodieName) hoodieName.textContent = data.colors[0].name;
    renderGallery(getImagesForColor(data.colors[0]));
    data.colors.forEach((c, i) => {
      const btn = document.createElement('button');
      btn.title = c.name; btn.className = `w-8 h-8 ${c.color} border-2 border-white/20 hover:border-white transition`;
      if (i === 0) btn.classList.add('border-white');
      btn.addEventListener('click', () => {
        if (hoodieName) hoodieName.textContent = c.name;
        hoodieColorsContainer.querySelectorAll('button').forEach((b) => b.classList.remove('border-white'));
        btn.classList.add('border-white');
        renderGallery(getImagesForColor(c));
      });
      hoodieColorsContainer.appendChild(btn);
    });
  } else {
    if (hoodieName) hoodieName.textContent = 'N/A';
    skullBlock.style.display = 'none';
    renderGallery(fallbackImages);
  }

  // ── Sizes ─────────────────────────────────────────────────────
  if (sizeBlock && sizeName && sizesContainer) {
    const sizes = Array.isArray(data.sizes) ? data.sizes : [];
    sizesContainer.innerHTML = '';
    if (sizes.length) {
      sizeBlock.style.display = 'block';
      let activeSize = 0;
      sizeName.textContent = sizes[0];
      const updatePrice = () => {
        if (priceEl) priceEl.textContent = `$${Cart.getPriceForSize(data, sizes[activeSize]).toFixed(2)}`;
      };
      sizes.forEach((s, i) => {
        const btn = document.createElement('button');
        btn.textContent = s; btn.className = 'border border-white/20 p-2 hover:bg-white/10 transition';
        if (i === 0) btn.classList.add('bg-white', 'text-black', 'font-bold');
        btn.addEventListener('click', () => {
          activeSize = i; sizeName.textContent = s;
          sizesContainer.querySelectorAll('button').forEach((b) => b.classList.remove('bg-white', 'text-black', 'font-bold'));
          btn.classList.add('bg-white', 'text-black', 'font-bold');
          updatePrice();
        });
        sizesContainer.appendChild(btn);
      });
      updatePrice();
    } else {
      sizeBlock.style.display = 'none';
      sizeName.textContent = 'OS';
    }
  }

  // ── Details ───────────────────────────────────────────────────
  if (detailsList) {
    detailsList.innerHTML = '';
    (data.details || []).forEach((d) => {
      const li = document.createElement('li'); li.textContent = d; detailsList.appendChild(li);
    });
  }

  // ── Add to cart ───────────────────────────────────────────────
  const addBtn = el('product-add-to-cart');
  if (addBtn && window.Cart?.add) {
    addBtn.onclick = () => {
      const selectedHoodie = hoodieColorsContainer?.querySelector('button.border-white');
      const selectedSkull = skullColorsContainer?.querySelector('button.border-white');
      const selectedSize = sizesContainer?.querySelector('button.bg-white');
      const colorLabel = selectedHoodie?.title;
      const skullLabelVal = selectedSkull?.title;
      const sizeLabel = selectedSize?.textContent;
      const priceCents = Math.round(Cart.getPriceForSize(data, sizeLabel) * 100);
      Cart.add({
        id: data.id, title: data.title, priceCents, qty: 1,
        color: colorLabel, skull: skullLabelVal, size: sizeLabel,
        image: mainImg?.src || data.images?.[0],
      });
      Cart.open();
    };
  }

  // ── Wishlist button ───────────────────────────────────────────
  const wishlistBtn = el('product-wishlist-toggle');
  if (wishlistBtn) {
    wishlistBtn.onclick = async () => {
      const changed = await window.toggleWishlistProduct(data.id);
      if (changed) window.updateProductWishlistButton();
    };
  }
  window.updateProductWishlistButton();
  renderRelatedProducts(data);
}

// ── Lookbook ──────────────────────────────────────────────────
const lookbookData = {
  'lookbook-1': { title: 'GENKI TWO-FACED - Split', image: 'https://res.cloudinary.com/dzhvdoifb/image/upload/v1762066135/WtBAmJy_nidtmq.webp', caption: 'Genki Tour Hoodie', linkedProduct: 'genki-two-faced-hoodie' },
  'lookbook-2': { title: 'Genki Skull - Street Essentials', image: 'https://res.cloudinary.com/dzhvdoifb/image/upload/v1762748940/I0P8IHJ_oxbf46.webp', caption: 'In the thick of it all with the Genki Skull Hoodie.', linkedProduct: 'genki-skull-hoodie' },
  'lookbook-3': { title: 'Genki Sakura - Cargo Focus', image: 'https://res.cloudinary.com/dzhvdoifb/image/upload/v1762748935/0AA3u2l_iwzzvt.webp', caption: 'Sporty and utility look centered around the Genki Sport Fleece Joggers.', linkedProduct: 'genki-sakura-hoodie' },
  'lookbook-4': { title: 'GENKI NEW YORK - Downtown Taxicab Yellow Beanie.', image: 'https://res.cloudinary.com/dzhvdoifb/image/upload/v1762752906/6EiT5o1_nhvhwf.webp', caption: 'Cozy city vibes with the GENKI Tour Beanie.', linkedProduct: 'genki-tour-beanie' },
};

function renderLookbookMain() {
  const grid = document.getElementById('lookbook-main-grid');
  if (!grid) return;
  grid.innerHTML = '';
  Object.entries(lookbookData).forEach(([key, item]) => {
    const card = document.createElement('a');
    card.href = `#${key}`;
    card.className = 'group block overflow-hidden border border-white/10 hover:border-white transition';
    card.innerHTML = `
      <div class="relative overflow-hidden">
        <img src="${item.image}" alt="${item.caption || item.title}" class="w-full h-72 object-cover transition duration-300 group-hover:scale-[1.03] group-hover:brightness-110">
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
      </div>
      <div class="p-4 space-y-1">
        <p class="text-xs uppercase tracking-[0.3em] text-white/50">Lookbook</p>
        <h3 class="text-lg font-semibold">${item.title}</h3>
        <p class="text-sm text-gray-400">${item.caption || 'View look'}</p>
        ${item.linkedProduct ? `<span class="inline-flex items-center text-xs uppercase tracking-[0.25em] text-white/70 mt-2">Shop the fit</span>` : ''}
      </div>`;
    grid.appendChild(card);
  });
}

function renderLook(key) {
  const data = lookbookData[key];
  if (!data) return;
  const img = document.getElementById('look-main-image');
  const titleEl = document.getElementById('look-title');
  const captionEl = document.getElementById('look-caption');
  const linkedBtn = document.getElementById('look-linked-product');
  if (img) img.src = data.image;
  if (titleEl) titleEl.textContent = data.title;
  if (captionEl) captionEl.textContent = data.caption;
  if (linkedBtn) {
    if (data.linkedProduct) { linkedBtn.href = `#${data.linkedProduct}`; linkedBtn.style.display = 'inline-block'; }
    else { linkedBtn.style.display = 'none'; }
  }
}
