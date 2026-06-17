/* ========================================
   JAPAN ODYSSEY — Main JS
   ======================================== */

// ── Navbar scroll ──
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// ── Hamburger menu ──
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ── Active nav link ──
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.navbar-menu a, .mobile-menu a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// ── IntersectionObserver fade-up ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-up, .fade-in').forEach(el => observer.observe(el));

// ── Hero parallax ──
const heroBg = document.querySelector('.hero-bg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroBg.style.transform = `translateY(${y * 0.35}px)`;
  }, { passive: true });
}

// ── Carousel ──
function initCarousel(trackSel, prevSel, nextSel, visibleCount) {
  const track = document.querySelector(trackSel);
  const prev = document.querySelector(prevSel);
  const next = document.querySelector(nextSel);
  if (!track || !prev || !next) return;

  let idx = 0;
  const cards = track.children;
  const total = cards.length;

  function getVisible() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return visibleCount || 3;
  }

  function slide() {
    const visible = getVisible();
    const maxIdx = Math.max(0, total - visible);
    idx = Math.max(0, Math.min(idx, maxIdx));
    const cardW = cards[0].offsetWidth + 24;
    track.style.transform = `translateX(-${idx * cardW}px)`;
  }

  prev.addEventListener('click', () => { idx = Math.max(0, idx - 1); slide(); });
  next.addEventListener('click', () => {
    const visible = getVisible();
    idx = Math.min(total - visible, idx + 1);
    slide();
  });
  window.addEventListener('resize', slide);

  // Drag support
  let startX = 0, isDragging = false;
  track.addEventListener('pointerdown', e => { startX = e.clientX; isDragging = true; track.setPointerCapture(e.pointerId); });
  track.addEventListener('pointermove', e => { if (!isDragging) return; });
  track.addEventListener('pointerup', e => {
    if (!isDragging) return;
    isDragging = false;
    const diff = startX - e.clientX;
    if (diff > 50) { next.click(); }
    else if (diff < -50) { prev.click(); }
  });
}

initCarousel('.carousel-track', '#dest-prev', '#dest-next', 3);
initCarousel('.avis-track', '#avis-prev', '#avis-next', 3);

// ── Counter animation ──
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.target || el.textContent, 10);
    if (isNaN(target)) return;
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    let current = 0;
    const duration = 1800;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = prefix + Math.floor(current) + suffix;
      if (current >= target) clearInterval(timer);
    }, 16);
  });
}

const statsSection = document.querySelector('.stats-section');
if (statsSection) {
  const statsObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { animateCounters(); statsObs.disconnect(); }
  }, { threshold: 0.3 });
  statsObs.observe(statsSection);
}

// ── Page enter animation ──
document.body.classList.add('page-enter');
