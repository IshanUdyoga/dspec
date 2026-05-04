/* ═══════════════════════════════════════════════════
   DSPEC GARAGE — Main Script
   ═══════════════════════════════════════════════════ */

'use strict';

/* ─── PRELOADER ─────────────────────────────────── */
(function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('done'), 2000);
  });
})();


/* ─── FOOTER YEAR ────────────────────────────────── */
(function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
})();


/* ─── PARTICLE CANVAS ────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  const COUNT = 90;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.init(); }
    init() {
      this.x  = Math.random() * canvas.width;
      this.y  = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.38;
      this.vy = (Math.random() - 0.5) * 0.38;
      this.r  = Math.random() * 1.6 + 0.3;
      this.a  = Math.random() * 0.45 + 0.08;
      this.isCyan = Math.random() > 0.65;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height)  this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.isCyan
        ? `rgba(0,212,255,${this.a})`
        : `rgba(255,255,255,${this.a * 0.5})`;
      ctx.fill();
    }
  }

  function build() {
    particles = Array.from({ length: COUNT }, () => new Particle());
  }

  function drawLines() {
    const maxDist = 130;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,212,255,${0.07 * (1 - dist / maxDist)})`;
          ctx.lineWidth   = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  let rafId;
  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawLines();
    particles.forEach(p => { p.update(); p.draw(); });
    rafId = requestAnimationFrame(loop);
  }

  resize();
  build();
  loop();

  window.addEventListener('resize', () => { resize(); build(); });
})();


/* ─── NAVBAR SCROLL BEHAVIOR ─────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ─── HAMBURGER MENU ─────────────────────────────── */
(function initHamburger() {
  const btn   = document.getElementById('hamburger');
  const nav   = document.getElementById('navLinks');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const isOpen = btn.classList.toggle('open');
    nav.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', isOpen);
  });

  // Close on link click
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('open');
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (nav.classList.contains('open') &&
        !nav.contains(e.target) &&
        !btn.contains(e.target)) {
      btn.classList.remove('open');
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
})();


/* ─── ACTIVE NAV LINK ON SCROLL ──────────────────── */
(function initActiveLinks() {
  const sections  = Array.from(document.querySelectorAll('section[id]'));
  const navLinks  = Array.from(document.querySelectorAll('.nav-link'));
  if (!sections.length || !navLinks.length) return;

  function update() {
    const scrollY = window.scrollY + 100;
    let current   = sections[0].id;

    sections.forEach(sec => {
      if (scrollY >= sec.offsetTop) current = sec.id;
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === current);
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();


/* ─── HERO PARALLAX ──────────────────────────────── */
(function initParallax() {
  const bg = document.getElementById('parallaxBg');
  if (!bg) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY * 0.28;
        bg.style.transform = `scale(1.12) translateY(${y}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();


/* ─── SCROLL REVEAL (IntersectionObserver) ───────── */
(function initReveal() {
  const items = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (!items.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -55px 0px' });

  items.forEach(el => observer.observe(el));
})();


/* ─── SERVICE CARD 3-D TILT + GLOW ──────────────── */
(function initCardEffects() {
  const cards = document.querySelectorAll('.service-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', function (e) {
      const r   = this.getBoundingClientRect();
      const xRel = (e.clientX - r.left) / r.width;   // 0 → 1
      const yRel = (e.clientY - r.top)  / r.height;  // 0 → 1

      // Tilt
      const tiltX = (yRel - 0.5) * -14;  // ±7°
      const tiltY = (xRel - 0.5) *  14;
      this.style.transform =
        `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;

      // Radial glow origin
      this.style.setProperty('--mx', `${xRel * 100}%`);
      this.style.setProperty('--my', `${yRel * 100}%`);
    });

    card.addEventListener('mouseleave', function () {
      this.style.transform = '';
    });
  });
})();


/* ─── COUNT-UP ANIMATION ─────────────────────────── */
(function initCountUp() {
  const counters = document.querySelectorAll('.count-up');
  if (!counters.length) return;

  function animate(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1800; // ms
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();


/* ─── BACK TO TOP ────────────────────────────────── */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 420);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ─── SMOOTH ANCHOR SCROLL ───────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const selector = this.getAttribute('href');
      if (selector === '#') return;
      const target = document.querySelector(selector);
      if (!target) return;
      e.preventDefault();
      const offset    = 80;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });
})();


/* ─── WORKSHOP FEATURES STAGGER ON SCROLL ─────────── */
(function initWorkshopStagger() {
  const feats = document.querySelectorAll('.workshop-feat');
  // reveal-up is handled by the general reveal observer;
  // this just ensures staggered delays are applied via CSS --delay already set in HTML
})();


/* ─── MAP IFRAME DARK FILTER ─────────────────────── */
// Already applied via CSS filter on .map-wrap iframe


/* ─── TICKER PAUSE ON HOVER ──────────────────────── */
(function initTickerPause() {
  const track = document.querySelector('.ticker-content');
  if (!track) return;
  track.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });
  track.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });
})();
