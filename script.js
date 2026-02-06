// =============================================
//  PENTRA — Breach Interface Script
// =============================================

document.addEventListener('DOMContentLoaded', () => {
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // ===== CUSTOM CURSOR =====
  if (!isTouchDevice) {
    const dot = document.getElementById('cursorDot');
    const glow = document.getElementById('mouseGlow');

    document.addEventListener('mousemove', e => {
      dot.style.left = e.clientX + 'px';
      dot.style.top = e.clientY + 'px';
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });

    // Hover detection for interactive elements
    const hoverTargets = document.querySelectorAll('a, button, input, select, textarea, .accordion-trigger, .cert, .nav-link');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  // ===== NAV =====
  const nav = document.getElementById('nav');
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      mobileMenu.classList.remove('open');
    });
  });

  // ===== TEXT SCRAMBLE EFFECT =====
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

  function scramble(el) {
    const original = el.dataset.original || el.textContent;
    el.dataset.original = original;
    const length = original.length;
    let iteration = 0;

    const interval = setInterval(() => {
      el.textContent = original
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' ';
          if (i < iteration) return original[i];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      if (iteration >= length) clearInterval(interval);
      iteration += 1 / 2;
    }, 25);
  }

  // Scramble on hover for [data-scramble] elements
  document.querySelectorAll('[data-scramble]').forEach(el => {
    el.addEventListener('mouseenter', () => scramble(el));
  });

  // ===== ACCORDION =====
  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const panel = trigger.nextElementSibling;
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      // Close all
      document.querySelectorAll('.accordion-trigger').forEach(t => {
        t.setAttribute('aria-expanded', 'false');
        t.nextElementSibling.classList.remove('open');
      });

      // Toggle
      if (!isOpen) {
        trigger.setAttribute('aria-expanded', 'true');
        panel.classList.add('open');
      }
    });
  });

  // ===== SCROLL REVEAL =====
  const revealElements = document.querySelectorAll('.reveal-text, .reveal-fade');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // ===== STAT COUNTERS =====
  function animateCounters() {
    document.querySelectorAll('.hud-stat-num[data-target]').forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      const duration = 2200;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        el.textContent = Math.floor(eased * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target.toLocaleString();
      }

      requestAnimationFrame(tick);
    });
  }

  const statsEl = document.querySelector('.hud-stats');
  if (statsEl) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.3 });
    statsObserver.observe(statsEl);
  }

  // ===== HUD COUNTER =====
  const hudCounter = document.getElementById('hudCounter');
  if (hudCounter) {
    let count = 0;
    setInterval(() => {
      count += Math.floor(Math.random() * 3) + 1;
      hudCounter.textContent = count.toString().padStart(4, '0');
    }, 800);
  }

  // ===== CONTACT FORM =====
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      form.innerHTML = `
        <div class="form-success">
          <div class="success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h3>Message Received</h3>
          <p>Our team will review your inquiry and respond within 24 hours.</p>
        </div>
      `;
    });
  }

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ===== NAV ACTIVE STATE =====
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 150;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  });

});
