// =============================================================
// router.js — Hash-based SPA router, navbar, shop filters
// Depends on: products.js, ui.js, auth.js, ticker.js
// =============================================================

(function () {
  // ── DOM refs ──────────────────────────────────────────────────
  const header = document.getElementById('main-header');
  const innerNavDiv = document.getElementById('nav-inner');
  const logoContainer = document.getElementById('logo-container');
  const homeLink = document.getElementById('home-link');
  const announcementBar = document.getElementById('announcement-bar');
  const appContainer = document.getElementById('app-container');
  const searchInput = document.getElementById('header-search-input');
  const searchInputContainer = document.getElementById('search-input-container');
  const searchToggleButton = document.getElementById('search-toggle-button');

  const HEADER_OFFSET_TRIM = 0;
  const scrollThreshold = 10;
  let ticking = false;

  // ── Hero animation ────────────────────────────────────────────
  const heroTitle = document.getElementById('hero-title');
  const titles = ['GENKI', '元気'];
  let titleIndex = 0;
  let isAnimating = false;

  if (heroTitle) {
    heroTitle.textContent = titles[0];
    heroTitle.classList.add('is-in');

    function morphText() {
      if (isAnimating) return;
      isAnimating = true;
      heroTitle.classList.add('is-glitch', 'is-out');
      heroTitle.classList.remove('is-in');
      setTimeout(() => {
        titleIndex = (titleIndex + 1) % titles.length;
        heroTitle.textContent = titles[titleIndex];
        heroTitle.classList.remove('is-out');
        heroTitle.classList.add('is-in');
        setTimeout(() => heroTitle.classList.remove('is-glitch'), 260);
        isAnimating = false;
        setTimeout(morphText, 4000);
      }, 600);
    }
    setTimeout(morphText, 4000);
  }

  // ── Navbar scroll behavior (home page only) ───────────────────
  function updateNavbar(scrollY) {
    if (window.location.hash !== '' && window.location.hash !== '#home') return;
    const progress = Math.min(1, scrollY / scrollThreshold);
    header.style.backgroundColor = `rgba(0,0,0,${(progress * 0.9).toFixed(2)})`;
    header.style.backdropFilter = `blur(${(progress * 6).toFixed(1)}px)`;
    const pad = 18 - (18 - 8) * progress;
    innerNavDiv.style.padding = `${pad.toFixed(1)}px .3rem`;
    logoContainer.style.opacity = progress.toFixed(2);
    if (announcementBar) {
      announcementBar.style.opacity = progress.toFixed(2);
      announcementBar.style.transform = `translateY(${(-6 + progress * 6).toFixed(1)}px)`;
      announcementBar.style.pointerEvents = 'auto';
    }
    homeLink.style.pointerEvents = progress < 0.1 ? 'none' : 'auto';
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { updateNavbar(window.scrollY); ticking = false; });
  }

  // ── App top offset ────────────────────────────────────────────
  function applyAppTopOffset(pageId) {
    if (!appContainer || !header) return;
    appContainer.style.paddingTop = pageId === 'home-page' ? '0px' : `${Math.max(0, header.offsetHeight - HEADER_OFFSET_TRIM)}px`;
  }

  function applyCurrentRouteOffset() {
    const base = (window.location.hash || '#home').split('?')[0].split('/')[0];
    applyAppTopOffset(!base || base === '#home' ? 'home-page' : 'not-home');
  }

  function syncRouteOffset() {
    applyCurrentRouteOffset();
    requestAnimationFrame(() => {
      applyCurrentRouteOffset();
      setTimeout(applyCurrentRouteOffset, 120);
      setTimeout(applyCurrentRouteOffset, 360);
    });
  }

  window.addEventListener('resize', applyCurrentRouteOffset);
  window.addEventListener('load', syncRouteOffset, { once: true });
  document.fonts?.ready?.then(syncRouteOffset).catch(() => {});
  [header, innerNavDiv, announcementBar].forEach((el) => el?.addEventListener('transitionend', applyCurrentRouteOffset));

  // ── Search ────────────────────────────────────────────────────
  window.toggleSearchInput = function (event) {
    if (event) event.stopPropagation();
    searchInputContainer.classList.toggle('active');
    if (searchInputContainer.classList.contains('active')) {
      searchInput.focus();
      document.addEventListener('click', closeSearchOnDocumentClick);
    } else {
      document.removeEventListener('click', closeSearchOnDocumentClick);
    }
  };

  function closeSearchOnDocumentClick(event) {
    if (!searchInputContainer.contains(event.target) && !searchToggleButton.contains(event.target)) {
      searchInputContainer.classList.remove('active');
      document.removeEventListener('click', closeSearchOnDocumentClick);
    }
  }

  window.performSearchAndRoute = function () {
    const query = searchInput.value.trim();
    searchInputContainer.classList.remove('active');
    window.location.hash = query ? `#shop?q=${encodeURIComponent(query)}` : '#shop';
  };

  searchInput?.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); window.performSearchAndRoute(); } });

  // ── Shop filters ──────────────────────────────────────────────
  const SHOP_FILTERS_STATE_KEY = 'genki_shop_filters_open';

  function initShopFiltersUI() {
    const toggle = document.getElementById('shop-filters-toggle');
    const panel = document.getElementById('shop-filters-panel');
    const toggleCopy = document.getElementById('shop-filters-toggle-copy');
    if (!toggle || !panel || !toggleCopy) return;

    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const setOpen = (open, persist = true) => {
      panel.classList.toggle('hidden', !open);
      toggle.setAttribute('aria-expanded', String(open));
      toggleCopy.textContent = open ? 'Hide' : 'Show';
      if (persist) sessionStorage.setItem(SHOP_FILTERS_STATE_KEY, open ? '1' : '0');
    };

    if (!toggle.dataset.bound) {
      toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true', true));
      panel.addEventListener('click', (e) => {
        if (window.matchMedia('(max-width: 767px)').matches && e.target.closest('[data-categories]')) setOpen(false, true);
      });
      toggle.dataset.bound = '1';
    }
    isMobile ? setOpen(sessionStorage.getItem(SHOP_FILTERS_STATE_KEY) === '1', false) : setOpen(true, false);
  }

  function updateCategoryCounts() {
    const counts = PRODUCTS.reduce((acc, p) => {
      const cats = Array.isArray(p.categories) ? p.categories : p.categories ? [p.categories] : p.category ? [p.category] : [];
      if (!cats.length) cats.push('uncategorized');
      cats.forEach((c) => { acc[String(c).trim().toLowerCase()] = (acc[String(c).trim().toLowerCase()] || 0) + 1; });
      acc.all = (acc.all || 0) + 1;
      return acc;
    }, {});
    document.querySelectorAll('[data-categories]').forEach((link) => {
      const key = (link.dataset.categories || '').toLowerCase();
      const label = link.dataset.label || link.textContent.replace(/\s*\(\d+\)$/, '').trim();
      link.textContent = `${label} (${counts[key] || 0})`;
    });
  }

  function sortProductsForShop(products, sortBy = 'newest') {
    const parsePrice = (p) => { const n = parseFloat(String(p?.price || '').replace(/[^0-9.]/g, '')); return isFinite(n) ? n : 0; };
    const sorted = [...products];
    if (sortBy === 'price-asc') sorted.sort((a, b) => parsePrice(a) - parsePrice(b));
    else if (sortBy === 'price-desc') sorted.sort((a, b) => parsePrice(b) - parsePrice(a));
    else if (sortBy === 'name-asc') sorted.sort((a, b) => String(a.title || '').localeCompare(String(b.title || '')));
    return sorted;
  }

  // ── Page map ──────────────────────────────────────────────────
  const pageMap = {
    '#home': 'home-page', '': 'home-page',
    '#new': 'new-page',
    '#shop': 'shop-page',
    '#wishlist': 'wishlist-page',
    '#account': 'account-page',
    '#about': 'about-page',
    '#collabs': 'collabs-page',
    '#contact': 'contact-page',
    '#cancel': 'cancel-page',
    '#lookbook-main': 'lookbook-main-page',
    '#checkout-success': 'checkout-success-page',
    '#size-guide': 'size-guide-page',
  };

  // ── Router ────────────────────────────────────────────────────
  function route() {
    const fullHash = window.location.hash || '#home';
    const hashWithoutQuery = fullHash.split('?')[0];
    const hashParts = hashWithoutQuery.split('/');
    const baseHash = hashParts[0];
    const categoriesSlug = hashParts[1];
    const urlParams = new URLSearchParams(fullHash.split('?')[1] || '');

    // Checkout is modal-driven
    if (baseHash === '#checkout') {
      window.openCheckoutModal?.();
      window.location.hash = window.__GENKI_LAST_ROUTE_HASH || '#home';
      return;
    }
    window.closeCheckoutModal?.();
    window.__GENKI_LAST_ROUTE_HASH = baseHash || '#home';

    // Resolve page ID
    let pageId = pageMap[baseHash] || 'home-page';
    if (PRODUCTS.some((p) => `#${p.id}` === baseHash)) pageId = 'product-page';
    else if (baseHash.startsWith('#lookbook-') && baseHash !== '#lookbook-main') pageId = 'lookbook-item-page';
    else if (baseHash === '#shop' && categoriesSlug?.startsWith('categories-')) pageId = 'shop-page';

    // Show target page, hide all others
    document.querySelectorAll('.page-content').forEach((p) => { p.style.display = 'none'; });
    const targetPage = document.getElementById(pageId);
    if (targetPage) targetPage.style.display = 'block';
    window.scrollTo(0, 0);

    // Header state
    if (pageId === 'home-page') {
      updateNavbar(window.scrollY);
      applyAppTopOffset('home-page');
      window.addEventListener('scroll', onScroll);
    } else {
      header.style.backgroundColor = 'rgba(0,0,0,0.9)';
      header.style.backdropFilter = 'blur(4px)';
      innerNavDiv.style.padding = '8px .9rem';
      logoContainer.style.opacity = '1';
      if (homeLink) homeLink.style.pointerEvents = 'auto';
      if (announcementBar) {
        announcementBar.style.opacity = '1';
        announcementBar.style.transform = 'translateY(0)';
        announcementBar.style.pointerEvents = 'auto';
      }
      window.removeEventListener('scroll', onScroll);
    }
    applyAppTopOffset(pageId);
    syncRouteOffset();

    // ── Page-specific rendering ──────────────────────────────────
    if (pageId === 'home-page') renderNewArrivalsFromProducts();

    if (pageId === 'new-page') renderShopNewFromProducts();

    if (pageId === 'shop-page') {
      initShopFiltersUI();
      updateCategoryCounts();
      let filtered = PRODUCTS;
      let title = 'ALL PRODUCTS';
      const sortSelect = document.getElementById('shop-sort-select');
      const sortBy = urlParams.get('sort') || 'newest';
      const searchQuery = urlParams.get('q');

      if (sortSelect) {
        sortSelect.value = ['newest', 'price-asc', 'price-desc', 'name-asc'].includes(sortBy) ? sortBy : 'newest';
        if (!sortSelect.dataset.bound) {
          sortSelect.addEventListener('change', () => {
            const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
            const nextSort = sortSelect.value;
            nextSort === 'newest' ? params.delete('sort') : params.set('sort', nextSort);
            const qs = params.toString();
            window.location.hash = qs ? `${(window.location.hash || '#shop').split('?')[0]}?${qs}` : (window.location.hash || '#shop').split('?')[0];
          });
          sortSelect.dataset.bound = '1';
        }
      }

    

      const inCategory = (p, cat) => {
        const cl = cat.toLowerCase();
        if (Array.isArray(p.categories)) return p.categories.some((c) => String(c).toLowerCase() === cl);
        if (p.categories) return String(p.categories).toLowerCase() === cl;
        if (p.category) return String(p.category).toLowerCase() === cl;
        return false;
      };

      if (searchQuery) {
        const terms = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);
        filtered = filtered.filter((p) => {
          const haystack = [p.title, Array.isArray(p.categories) ? p.categories.join(' ') : (p.categories || ''), p.category, p.keywords, Array.isArray(p.colors) ? p.colors.map((c) => c.name).join(' ') : '', p.id].join(' ').toLowerCase();
          return terms.every((t) => haystack.includes(t));
        });
        title = `SEARCH RESULTS for: "${searchQuery}"`;
        if (searchInput) searchInput.value = searchQuery;
      } else {
        if (searchInput) searchInput.value = '';
        if (categoriesSlug?.startsWith('categories-')) {
          const cat = categoriesSlug.replace('categories-', '');
          if (cat.toLowerCase() !== 'all') { filtered = PRODUCTS.filter((p) => inCategory(p, cat)); title = `${cat.toUpperCase()} COLLECTION`; }
        }
      }

      renderShopGrid(sortProductsForShop(filtered, sortBy), title);
    }

    if (pageId === 'wishlist-page') window.renderWishlistPage();
    if (pageId === 'lookbook-main-page') renderLookbookMain();
    if (pageId === 'product-page') renderProduct(baseHash.replace('#', ''));
    if (pageId === 'lookbook-item-page') renderLook(baseHash.replace('#', ''));

    window.updateProductWishlistButton?.();
  }

  window.addEventListener('hashchange', route);
  window.addEventListener('resize', initShopFiltersUI);

  // ── Checkout modal ────────────────────────────────────────────
  const checkoutModal = document.getElementById('checkout-page');
  const checkoutModalPanel = document.getElementById('checkout-modal-panel');
  const checkoutCloseButton = document.getElementById('checkout-close');
  const handleCheckoutEscape = (e) => { if (e.key === 'Escape') window.closeCheckoutModal(); };

  window.openCheckoutModal = function () {
    if (!checkoutModal) return;
    checkoutModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleCheckoutEscape);
  };
  window.closeCheckoutModal = function () {
    if (!checkoutModal) return;
    checkoutModal.classList.add('hidden');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleCheckoutEscape);
  };
  checkoutCloseButton?.addEventListener('click', window.closeCheckoutModal);
  checkoutModal?.addEventListener('click', (e) => { if (e.target === checkoutModal) window.closeCheckoutModal(); });
  checkoutModalPanel?.addEventListener('click', (e) => e.stopPropagation());

  // ── Newsletter modal ──────────────────────────────────────────
  const newsletterModal = document.getElementById('newsletter-modal');
  const newsletterModalPanel = document.getElementById('newsletter-modal-panel');
  const newsletterCloseButton = document.getElementById('newsletter-close');
  const handleNewsletterEscape = (e) => { if (e.key === 'Escape') window.closeNewsletterModal(); };

  window.openNewsletterModal = function () {
    if (!newsletterModal) return;
    newsletterModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleNewsletterEscape);
    document.getElementById('newsletter-status')?.classList.add('hidden');
    requestAnimationFrame(() => document.getElementById('newsletter-email')?.focus());
  };
  window.closeNewsletterModal = function () {
    if (!newsletterModal) return;
    newsletterModal.classList.add('hidden');
    if (!checkoutModal || checkoutModal.classList.contains('hidden')) document.body.style.overflow = '';
    document.removeEventListener('keydown', handleNewsletterEscape);
  };
  newsletterCloseButton?.addEventListener('click', window.closeNewsletterModal);
  newsletterModal?.addEventListener('click', (e) => { if (e.target === newsletterModal) window.closeNewsletterModal(); });
  newsletterModalPanel?.addEventListener('click', (e) => e.stopPropagation());

  // ── Boot ──────────────────────────────────────────────────────
// ── Boot ──────────────────────────────────────────────────────
window.onload = async function () {
  initAnnouncementTicker();
  await window.initSupabaseWishlist();
  route();
};
})();
