// Sticky-nav shadow on scroll
const nav = document.getElementById('nav');
const onScroll = () => {
  if (window.scrollY > 8) nav.classList.add('is-scrolled');
  else nav.classList.remove('is-scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Reveal on intersect
const io = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// Animate stat counters
const animateCount = (el) => {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1400;
  const start = performance.now();
  const isFloat = target < 10;
  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;
    el.textContent = isFloat ? value.toFixed(1).replace(/\.0$/, '') : Math.floor(value);
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  };
  requestAnimationFrame(tick);
};
const statObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.5 }
);
document.querySelectorAll('.stat__num').forEach((el) => statObserver.observe(el));

// Showcase tabs
const tabs = document.querySelectorAll('.show-tab');
const panes = document.querySelectorAll('.show-pane');
const paneContent = {
  plan: {
    title: 'Plan in plain language.',
    body:
      'Type a sentence, get a milestone. Lumen breaks goals into tasks, owners, and dates — then keeps them in sync as the world changes.',
    list: ['Natural-language project briefs', 'Auto-generated dependencies', 'Capacity planning across squads'],
    rows: [
      ['blue', 'Auth migration', '8 tasks · @maya'],
      ['violet', 'Onboarding redesign', '12 tasks · @kai'],
      ['green', 'Public API v3', '4 tasks · @ari'],
      ['ghost', 'Add realtime presence', 'drafting…'],
    ],
  },
  build: {
    title: 'Build with agents that know your code.',
    body: 'Spawn focused agents that read your repo, open PRs, and write tests. You stay in the loop — never out of it.',
    list: ['Repo-aware agents', 'PR-first workflow', 'Inline review comments'],
    rows: [
      ['blue', 'PR #482 · refresh-token rotation', '+312 −48 · ready for review'],
      ['violet', 'PR #480 · onboarding empty state', 'CI green'],
      ['green', 'PR #478 · API v3 docs', 'merged'],
      ['ghost', 'Agent drafting…', '4 files'],
    ],
  },
  ship: {
    title: 'Ship with calm confidence.',
    body: 'Deploys, rollbacks, feature flags — orchestrated from one timeline. See exactly what changed, why, and who.',
    list: ['One-click rollbacks', 'Tied to PRs and incidents', 'Audit-ready timeline'],
    rows: [
      ['green', 'Deploy v4.7.2 · production', '2m 14s · success'],
      ['blue', 'Flag · onboarding-v2', '50% rollout'],
      ['violet', 'Incident · auth latency', 'resolved'],
      ['ghost', 'Awaiting review…', 'staging'],
    ],
  },
  learn: {
    title: 'Learn from your own velocity.',
    body: 'Honest signals, not vanity charts. See where your team gets stuck, and remove the friction.',
    list: ['Cycle time by stage', 'Review depth metrics', 'Blocker heatmap'],
    rows: [
      ['blue', 'Cycle time', '2.4d (-38%)'],
      ['violet', 'Review depth', '4.1 comments / PR'],
      ['green', 'Deploys', '14 / week'],
      ['ghost', 'Computing this week…', '—'],
    ],
  },
};

tabs.forEach((tab) =>
  tab.addEventListener('click', () => {
    const key = tab.dataset.tab;
    tabs.forEach((t) => t.classList.toggle('is-active', t === tab));
    const pane = document.querySelector('.show-pane');
    const content = paneContent[key];
    if (!pane || !content) return;
    pane.style.opacity = '0';
    pane.style.transform = 'translateY(8px)';
    setTimeout(() => {
      pane.innerHTML = `
        <div>
          <h3>${content.title}</h3>
          <p>${content.body}</p>
          <ul class="check-list">${content.list.map((i) => `<li>${i}</li>`).join('')}</ul>
        </div>
        <div class="show-mock">
          <div class="mock-list">
            ${content.rows
              .map(
                ([d, t, m]) =>
                  `<div class="mock-row${d === 'ghost' ? ' mock-row--ghost' : ''}"><span class="dot${
                    d !== 'ghost' ? ' dot--' + d : ''
                  }"></span> ${t}<span class="mock-meta">${m}</span></div>`
              )
              .join('')}
          </div>
        </div>`;
      pane.style.transition = 'opacity .35s ease, transform .35s ease';
      pane.style.opacity = '1';
      pane.style.transform = 'none';
    }, 150);
  })
);

// Subtle parallax for hero panel based on cursor (desktop only)
const heroPanel = document.querySelector('.hero__panel .panel-window');
if (heroPanel && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const wrap = document.querySelector('.hero__panel');
  wrap.addEventListener('mousemove', (e) => {
    const rect = wrap.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    heroPanel.style.transform = `rotateX(${4 - y * 6}deg) rotateY(${-6 + x * 8}deg)`;
  });
  wrap.addEventListener('mouseleave', () => {
    heroPanel.style.transform = '';
  });
}

// Mobile nav toggle (basic show/hide)
const toggle = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('.nav__links');
if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}
