/* ============================================================
   script.js — Muhammad Hamdan Portfolio
   Pure Vanilla JS — no libraries
   ============================================================ */

(function () {
  'use strict';

  // ────────────────────────────────────────────────────────────
  // 1. Typewriter Effect
  // ────────────────────────────────────────────────────────────
  const roles = [
    'AI/ML Engineer',
    'Deep Learning Developer',
    'CS Student @ SZABIST',
  ];

  const typewriterEl = document.getElementById('typewriter');
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const TYPING_SPEED = 80;
  const DELETING_SPEED = 45;
  const PAUSE_AFTER_TYPE = 2000;
  const PAUSE_AFTER_DELETE = 400;

  function typewrite() {
    const currentRole = roles[roleIndex];

    if (!isDeleting) {
      // Typing
      typewriterEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentRole.length) {
        // Finished typing — pause, then delete
        isDeleting = true;
        setTimeout(typewrite, PAUSE_AFTER_TYPE);
        return;
      }

      setTimeout(typewrite, TYPING_SPEED);
    } else {
      // Deleting
      typewriterEl.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typewrite, PAUSE_AFTER_DELETE);
        return;
      }

      setTimeout(typewrite, DELETING_SPEED);
    }
  }

  // Kick off typewriter once DOM is ready
  typewrite();

  // ────────────────────────────────────────────────────────────
  // 2. Navbar scroll behavior
  // ────────────────────────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  const SCROLL_THRESHOLD = 50;

  function onScroll() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Initial check

  // ────────────────────────────────────────────────────────────
  // 3. Mobile nav toggle
  // ────────────────────────────────────────────────────────────
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close mobile nav when a link is clicked
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // ────────────────────────────────────────────────────────────
  // 4. Smooth scroll for anchor links
  // ────────────────────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const targetPosition =
          targetEl.getBoundingClientRect().top + window.scrollY - navHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });

  // ────────────────────────────────────────────────────────────
  // 5. Scroll Reveal (IntersectionObserver)
  // ────────────────────────────────────────────────────────────
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target); // Only animate once
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // ────────────────────────────────────────────────────────────
  // 6. Active nav link highlighting on scroll
  // ────────────────────────────────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navAnchors.forEach((a) => {
            a.classList.toggle(
              'active',
              a.getAttribute('href') === `#${id}`
            );
          });
        }
      });
    },
    {
      threshold: 0.3,
      rootMargin: '-80px 0px -50% 0px',
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
})();
