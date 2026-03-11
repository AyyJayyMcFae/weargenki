// =============================================================
// milestone.js — Community Milestone Bar
// No external dependencies
// =============================================================

(function () {
  // ── UPDATE THIS NUMBER WHEN SALES COME IN ──
  const CURRENT_SALES = 0;
  const MAX_SALES = 100;
  const TIERS = [25, 50, 75, 100];

  function initMilestone() {
    const fill = document.getElementById('milestone-fill');
    const countEl = document.getElementById('milestone-count');
    if (!fill || !countEl) return;

    const pct = Math.min(100, (CURRENT_SALES / MAX_SALES) * 100);

    // Animate bar fill on load
    requestAnimationFrame(() => {
      setTimeout(() => {
        fill.style.width = pct + '%';
      }, 200);
    });

    // Animate count up
    const duration = 1200;
    const start = performance.now();
    function animateCount(now) {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      countEl.textContent = Math.round(eased * CURRENT_SALES);
      if (progress < 1) requestAnimationFrame(animateCount);
    }
    setTimeout(() => requestAnimationFrame(animateCount), 200);

    // Light up completed tiers
    TIERS.forEach((threshold, i) => {
      if (CURRENT_SALES >= threshold) {
        const tier = document.getElementById('tier-' + (i + 1));
        if (!tier) return;
        tier.querySelector('.tier-num').style.color = '#fff';
        tier.querySelector('.tier-reward').style.color = 'rgba(255,255,255,0.8)';
      }
    });

    // ── Glitch morph — Kistanistas title ────────────────────
    const milestoneTitle = document.getElementById('milestone-title');
    const milestoneTitles = [
      'KISTANISTAS',
      '気スタニスタス'
    ];
    let milestoneTitleIndex = 0;
    let milestoneMorphing = false;

    function morphMilestoneTitle() {
      if (!milestoneTitle || milestoneMorphing) return;
      milestoneMorphing = true;
      milestoneTitle.classList.add('is-glitch', 'is-out');
      milestoneTitle.classList.remove('is-in');
      setTimeout(() => {
        milestoneTitleIndex = (milestoneTitleIndex + 1) % milestoneTitles.length;
        milestoneTitle.textContent = milestoneTitles[milestoneTitleIndex];
        milestoneTitle.classList.remove('is-out');
        milestoneTitle.classList.add('is-in');
        setTimeout(() => milestoneTitle.classList.remove('is-glitch'), 260);
        milestoneMorphing = false;
        setTimeout(morphMilestoneTitle, 4000);
      }, 600);
    }

    if (milestoneTitle) {
      milestoneTitle.classList.add('is-in');
      setTimeout(morphMilestoneTitle, 4000);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMilestone);
  } else {
    initMilestone();
  }
})();