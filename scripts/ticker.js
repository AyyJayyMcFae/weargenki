// =============================================================
// ticker.js — Announcement bar continuous-scroll ticker
// No external dependencies
// =============================================================

function initAnnouncementTicker() {
  const announcementBar = document.getElementById('announcement-bar');
  const marquee = document.querySelector('#announcement-bar .announcement-marquee');
  if (!marquee) return;

  const runs = marquee.querySelectorAll('.announcement-run');
  if (!runs.length) return;

  const primaryHTML = runs[0].innerHTML;

  // ── Accessibility helpers ────────────────────────────────────
  function makeItemsInteractive(runEl, interactive) {
    if (!runEl) return;
    runEl.querySelectorAll('.announcement-item[data-href], .announcement-item[data-action]').forEach((item) => {
      if (interactive) {
        if (item.tagName !== 'A') { item.setAttribute('role', 'link'); item.tabIndex = 0; }
        item.removeAttribute('aria-hidden');
      } else {
        item.removeAttribute('role');
        item.tabIndex = -1;
        item.setAttribute('aria-hidden', 'true');
      }
    });
    runEl.querySelectorAll('a.announcement-item[href]').forEach((item) => {
      if (interactive) { item.removeAttribute('tabindex'); item.removeAttribute('aria-hidden'); }
      else { item.tabIndex = -1; item.setAttribute('aria-hidden', 'true'); }
    });
  }

  // ── Click/key handler ────────────────────────────────────────
  function activateAnnouncementItem(item) {
    if (!item) return;
    const action = (item.getAttribute('data-action') || '').trim();
    if (action === 'open-newsletter') { window.openNewsletterModal?.(); return; }
    const href = (item.getAttribute('data-href') || '').trim();
    if (!href) return;
    if (item.getAttribute('data-target') === '_blank') { window.open(href, '_blank', 'noopener'); return; }
    if (href.startsWith('#')) { window.location.hash = href; return; }
    window.location.href = href;
  }

  // Bind delegation once
  if (!marquee.dataset.announcementLinkBound) {
    marquee.addEventListener('click', (e) => {
      const item = e.target.closest('.announcement-item[data-href], .announcement-item[data-action]');
      if (!item) return;
      e.preventDefault();
      activateAnnouncementItem(item);
    });
    marquee.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const item = e.target.closest('.announcement-item[data-href], .announcement-item[data-action]');
      if (!item) return;
      e.preventDefault();
      activateAnnouncementItem(item);
    });
    marquee.dataset.announcementLinkBound = '1';
  }

  // ── Scroll engine ────────────────────────────────────────────
  let runWidth = 0;
  let offset = 0;
  let lastTs = 0;
  let rafId = 0;
  let isPaused = false;
  const pxPerSecond = 70;

  const applyOffset = () => { marquee.style.transform = `translate3d(${-offset}px, 0, 0)`; };

  function rebuildRunsForViewport() {
    marquee.innerHTML = '';

    // Measure a hidden copy
    const measureRun = document.createElement('div');
    measureRun.className = 'announcement-run';
    Object.assign(measureRun.style, { position: 'absolute', visibility: 'hidden', pointerEvents: 'none', whiteSpace: 'nowrap' });
    measureRun.innerHTML = primaryHTML;
    marquee.appendChild(measureRun);
    const measuredWidth = measureRun.getBoundingClientRect().width || measureRun.scrollWidth || 0;
    measureRun.remove();

    if (!measuredWidth) return 0;

    const viewportWidth = announcementBar?.clientWidth || window.innerWidth;
    const copies = Math.max(3, Math.ceil(viewportWidth / measuredWidth) + 2);

    for (let i = 0; i < copies; i++) {
      const run = document.createElement('div');
      run.className = 'announcement-run';
      run.innerHTML = primaryHTML;
      if (i > 0) run.setAttribute('aria-hidden', 'true');
      makeItemsInteractive(run, i === 0);
      marquee.appendChild(run);
    }
    return measuredWidth;
  }

  function updateTickerMetrics() {
    const nextWidth = rebuildRunsForViewport();
    if (!nextWidth) return;
    if (runWidth > 0) offset = (offset / runWidth) * nextWidth;
    runWidth = nextWidth;
    offset = ((offset % runWidth) + runWidth) % runWidth;
    applyOffset();
  }

  function tick(ts) {
    if (!lastTs) lastTs = ts;
    const dt = (ts - lastTs) / 1000;
    lastTs = ts;
    if (!isPaused && runWidth > 0) {
      offset = (offset + pxPerSecond * dt) % runWidth;
      applyOffset();
    }
    rafId = requestAnimationFrame(tick);
  }

  updateTickerMetrics();
  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(tick);

  marquee.addEventListener('mouseenter', () => { isPaused = true; });
  marquee.addEventListener('mouseleave', () => { isPaused = false; });
  window.addEventListener('resize', updateTickerMetrics);
  document.fonts?.ready?.then(updateTickerMetrics).catch(() => {});
  window.addEventListener('load', updateTickerMetrics, { once: true });
}
