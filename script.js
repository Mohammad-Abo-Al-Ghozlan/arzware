/* ============================================================
   ARZWARE Creative Agency — Main Script
   Vanilla JS · No dependencies
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     1. Send Prompt
     ---------------------------------------------------------- */
  window.sendPrompt = function sendPrompt(message) {
    console.log('Prompt:', message);
    showToast('Message sent: ' + message);
  };

  // Wire up CTA buttons
  const btnApproach = document.getElementById('btn-approach');
  if (btnApproach) {
    btnApproach.addEventListener('click', () => sendPrompt('Tell me about the ARZWARE modernization approach'));
  }
  const btnAudit = document.getElementById('btn-audit');
  if (btnAudit) {
    btnAudit.addEventListener('click', () => sendPrompt('I want to start a systems audit with ARZWARE'));
  }

  /* ----------------------------------------------------------
     2. Toast Notification
     ---------------------------------------------------------- */
  function showToast(text) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = text;

    // Inline styles so the toast works without extra CSS rules
    Object.assign(toast.style, {
      position:        'fixed',
      bottom:          '2rem',
      right:           '2rem',
      background:      '#0b1e3d',          // navy brand
      color:           '#ffffff',
      padding:         '1rem 1.5rem',
      borderRadius:    '0.5rem',
      boxShadow:       '0 8px 24px rgba(11,30,61,.35)',
      fontSize:        '0.95rem',
      fontFamily:      'inherit',
      zIndex:          '10000',
      opacity:         '0',
      transform:       'translateY(12px)',
      transition:      'opacity .35s ease, transform .35s ease',
      pointerEvents:   'none',
      borderLeft:      '4px solid #3b82f6'  // blue accent
    });

    document.body.appendChild(toast);

    // Trigger entrance animation on next frame
    requestAnimationFrame(() => {
      toast.style.opacity   = '1';
      toast.style.transform = 'translateY(0)';
    });

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      toast.style.opacity   = '0';
      toast.style.transform = 'translateY(12px)';
      toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, 3000);
  }

  /* ----------------------------------------------------------
     3. Smooth Scroll Navigation
     ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const section = document.querySelector(targetId);
      if (section) {
        e.preventDefault();
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Close mobile menu if open
        const nav = document.querySelector('nav');
        if (nav && nav.classList.contains('active')) {
          nav.classList.remove('active');
          const toggle = document.querySelector('.menu-toggle');
          if (toggle) toggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  /* ----------------------------------------------------------
     4. Scroll-Triggered Reveal Animations
     ---------------------------------------------------------- */
  const revealTargets = document.querySelectorAll(
    '.hero, .problem, .framework, .services, .cases, .os-wrap, .insights, .cta-band'
  );

  // Set initial hidden state
  revealTargets.forEach(el => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(30px)';
    el.style.transition = 'opacity .6s ease, transform .6s ease';
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealTargets.forEach(el => revealObserver.observe(el));

  /* ----------------------------------------------------------
     5. Counter Animation
     ---------------------------------------------------------- */
  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-target'));
    if (isNaN(target)) return;

    const suffix = el.querySelector('span');
    const duration  = 1800; // ms
    const startTime = performance.now();
    const isInteger = Number.isInteger(target);

    function step(now) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const ease     = 1 - Math.pow(1 - progress, 3);
      const current  = ease * target;

      const displayVal = isInteger
        ? Math.round(current).toLocaleString()
        : current.toFixed(1);

      // Update only the text node, preserving the <span> suffix
      if (suffix) {
        el.firstChild.textContent = displayVal;
      } else {
        el.textContent = displayVal;
      }

      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const counterEls = document.querySelectorAll('.stat-val, .cnum-val');

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  counterEls.forEach(el => counterObserver.observe(el));

  /* ----------------------------------------------------------
     6. Active Nav Link Highlighting
     ---------------------------------------------------------- */
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  const navSections = [];

  navLinks.forEach(link => {
    const id = link.getAttribute('href');
    if (id && id !== '#') {
      const sec = document.querySelector(id);
      if (sec) navSections.push({ link, section: sec });
    }
  });

  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const match = navSections.find(ns => ns.section === entry.target);
        if (match) match.link.classList.add('active');
      }
    });
  }, { threshold: 0.25, rootMargin: '-10% 0px -60% 0px' });

  navSections.forEach(ns => navObserver.observe(ns.section));

  /* ----------------------------------------------------------
     7. Mobile Hamburger Menu Toggle
     ---------------------------------------------------------- */
  const menuToggle = document.querySelector('.menu-toggle');
  const nav        = document.querySelector('nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      nav.classList.toggle('active');
      // Toggle aria attribute for accessibility
      const expanded = nav.classList.contains('active');
      menuToggle.setAttribute('aria-expanded', expanded);
    });
  }

});
