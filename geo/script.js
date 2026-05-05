// ==========================================================
// GEO Aviation — interactions
// ==========================================================

// ---------- Sticky-nav background on scroll ----------
const nav = document.getElementById('nav');
const updateNav = () => {
  if (window.scrollY > 12) nav.classList.add('is-scrolled');
  else nav.classList.remove('is-scrolled');
};
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

// ---------- Reveal-on-intersect (generic) ----------
const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
);
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// ---------- Animated counters ----------
const formatNumber = (n, decimals) => {
  if (decimals > 0) return n.toFixed(decimals);
  return Math.round(n).toLocaleString('en-US');
};

const animateCounter = (el) => {
  const raw = el.dataset.count;
  const target = parseFloat(raw);
  const decimals = parseInt(el.dataset.decimals || '0', 10);
  const isNegative = target < 0;
  const absTarget = Math.abs(target);
  const duration = 1600;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = absTarget * eased;
    el.textContent = (isNegative ? '-' : '') + formatNumber(value, decimals);
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = (isNegative ? '-' : '') + formatNumber(absTarget, decimals);
  };
  requestAnimationFrame(tick);
};

const counterObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.4 }
);
document.querySelectorAll('.counter').forEach((el) => counterObserver.observe(el));

// ---------- Pinned scroll-driven reveal stage ----------
const stage = document.querySelector('.reveal-stage');
const stageSteps = document.querySelectorAll('.rs-step');
const stageProgress = document.querySelectorAll('.rs-progress span');

if (stage && stageSteps.length) {
  const totalSteps = stageSteps.length;
  let lastIndex = -1;

  const onStageScroll = () => {
    const rect = stage.getBoundingClientRect();
    const stageHeight = stage.offsetHeight;
    const viewportH = window.innerHeight;
    // total scrollable distance while pinned = stageHeight - viewportH
    const scrolled = -rect.top;
    const total = stageHeight - viewportH;
    const progress = Math.min(Math.max(scrolled / total, 0), 0.999);
    const index = Math.min(Math.floor(progress * totalSteps), totalSteps - 1);

    if (index !== lastIndex) {
      lastIndex = index;
      stageSteps.forEach((s, i) => s.classList.toggle('is-active', i === index));
      stageProgress.forEach((s, i) => s.classList.toggle('is-active', i === index));
      // toggle plane state classes
      stage.classList.remove('is-reveal-1', 'is-reveal-2', 'is-reveal-3');
      if (index >= 1) stage.classList.add('is-reveal-1');
      if (index >= 2) stage.classList.add('is-reveal-2');
      if (index >= 3) stage.classList.add('is-reveal-3');
    }
  };

  let raf = 0;
  window.addEventListener(
    'scroll',
    () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        onStageScroll();
      });
    },
    { passive: true }
  );
  onStageScroll();
}

// ---------- Subtle parallax for hero plane based on scroll ----------
const heroPlane = document.querySelector('.hero__plane');
if (heroPlane && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let raf2 = 0;
  window.addEventListener(
    'scroll',
    () => {
      if (raf2) return;
      raf2 = requestAnimationFrame(() => {
        raf2 = 0;
        const y = Math.min(window.scrollY * 0.25, 200);
        heroPlane.style.transform = `translateY(${-y}px)`;
      });
    },
    { passive: true }
  );
}

// ---------- Soft hero-content fade based on scroll ----------
const heroContent = document.querySelector('.hero__content');
if (heroContent) {
  let raf3 = 0;
  window.addEventListener(
    'scroll',
    () => {
      if (raf3) return;
      raf3 = requestAnimationFrame(() => {
        raf3 = 0;
        const t = Math.min(window.scrollY / window.innerHeight, 1);
        heroContent.style.opacity = String(1 - t * 1.1);
        heroContent.style.transform = `translateY(${t * -40}px)`;
      });
    },
    { passive: true }
  );
}

// ---------- FAQ: ensure single-open behavior (Apple-like accordion) ----------
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach((item) => {
  item.addEventListener('toggle', () => {
    if (item.open) {
      faqItems.forEach((other) => {
        if (other !== item && other.open) other.open = false;
      });
    }
  });
});

// ---------- Mobile nav toggle (basic) ----------
const menu = document.querySelector('.nav__menu');
const links = document.querySelector('.nav__links');
if (menu && links) {
  menu.addEventListener('click', () => {
    const isOpen = links.classList.toggle('is-open');
    menu.setAttribute('aria-expanded', String(isOpen));
    links.style.display = isOpen ? 'flex' : '';
    if (isOpen) {
      Object.assign(links.style, {
        position: 'absolute',
        top: '100%',
        left: '0',
        right: '0',
        flexDirection: 'column',
        gap: '0',
        padding: '12px 0',
        background: 'rgba(0,0,0,0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      });
      links.querySelectorAll('a').forEach((a) => {
        a.style.padding = '14px 24px';
        a.style.fontSize = '15px';
      });
    }
  });
}
