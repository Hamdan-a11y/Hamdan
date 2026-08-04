/* ============================================================
   script.js — Muhammad Hamdan Portfolio
   Pure Vanilla JS — no libraries
   ============================================================ */

(function () {
  'use strict';
  
  // Helper to parse any CSS color variable dynamically to [R, G, B]
  function getColorRGB(cssVar, fallbackRGB) {
    var val = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
    if (!val) return fallbackRGB;
    var canvas = document.createElement('canvas');
    canvas.width = 1; canvas.height = 1;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = val;
    var parsed = ctx.fillStyle;
    if (parsed.startsWith('#')) {
      return [parseInt(parsed.slice(1, 3), 16), parseInt(parsed.slice(3, 5), 16), parseInt(parsed.slice(5, 7), 16)];
    } else if (parsed.startsWith('rgb')) {
      var match = parsed.match(/\d+/g);
      if (match) return [parseInt(match[0]), parseInt(match[1]), parseInt(match[2])];
    }
    return fallbackRGB;
  }

  // ────────────────────────────────────────────────────────────
  // 1. Typewriter Effect
  // ────────────────────────────────────────────────────────────
  const roles = [
    'Python & Django Developer',
    'Backend & Automation Developer',
    'AI/ML Certified CS Graduate',
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
      typewriterEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === currentRole.length) {
        isDeleting = true;
        setTimeout(typewrite, PAUSE_AFTER_TYPE);
        return;
      }
      setTimeout(typewrite, TYPING_SPEED);
    } else {
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
  typewrite();

  // ────────────────────────────────────────────────────────────
  // 2. Dark / Light Mode Toggle with Dual-Persona Boot Animation
  // ────────────────────────────────────────────────────────────
  const themeToggleBtn = document.getElementById('theme-toggle');
  const bootOverlay = document.getElementById('boot-overlay');
  const htmlEl = document.documentElement;

  // Helper to update dynamic section titles (e.g. About Me -> $ whoami)
  function updateDynamicTitles(isDark) {
    const titles = document.querySelectorAll('h2[data-light-title][data-dark-title]');
    titles.forEach(function(h2) {
      const lightTitle = h2.getAttribute('data-light-title');
      const darkTitle = h2.getAttribute('data-dark-title');
      h2.textContent = isDark ? darkTitle : lightTitle;
    });
  }

  const savedTheme = localStorage.getItem('portfolio-theme');
  const initialIsDark = savedTheme === 'dark';
  if (initialIsDark) {
    htmlEl.setAttribute('data-theme', 'dark');
  }
  updateDynamicTitles(initialIsDark);

  let isBooting = false;

  themeToggleBtn.addEventListener('click', function() {
    if (isBooting) return;
    const isDark = htmlEl.getAttribute('data-theme') === 'dark';

    if (isDark) {
      // Switching to Light Mode: Smooth cross-fade, no boot animation
      htmlEl.removeAttribute('data-theme');
      localStorage.setItem('portfolio-theme', 'light');
      updateDynamicTitles(false);
    } else {
      // Switching to Dark Mode: Trigger Boot Sequence animation
      isBooting = true;
      if (bootOverlay) {
        bootOverlay.classList.add('active');
      }

      setTimeout(function() {
        htmlEl.setAttribute('data-theme', 'dark');
        localStorage.setItem('portfolio-theme', 'dark');
        updateDynamicTitles(true);
      }, 350);

      setTimeout(function() {
        if (bootOverlay) {
          bootOverlay.classList.remove('active');
        }
        isBooting = false;
      }, 950);
    }
  });

  function isDarkMode() {
    return htmlEl.getAttribute('data-theme') === 'dark';
  }

  // ────────────────────────────────────────────────────────────
  // 3. Navbar scroll behavior
  // ────────────────────────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ────────────────────────────────────────────────────────────
  // 4. Mobile nav toggle
  // ────────────────────────────────────────────────────────────
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // ────────────────────────────────────────────────────────────
  // 5. Smooth scroll for anchor links
  // ────────────────────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const pos = targetEl.getBoundingClientRect().top + window.scrollY - navHeight - 20;
        window.scrollTo({ top: pos, behavior: 'smooth' });
      }
    });
  });

  // ────────────────────────────────────────────────────────────
  // 6. Scroll Reveal
  // ────────────────────────────────────────────────────────────
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  // ────────────────────────────────────────────────────────────
  // 7. Active nav link highlighting
  // ────────────────────────────────────────────────────────────
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navAnchors.forEach((a) => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + id);
          });
        }
      });
    },
    { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' }
  );
  document.querySelectorAll('section[id]').forEach((s) => sectionObserver.observe(s));

  // ══════════════════════════════════════════════════════════
  // FEATURE 1 — Particle Canvas with Mouse Gravity
  // ══════════════════════════════════════════════════════════
  (function initParticles() {
    var canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var W, H, particles;
    var mouse = { x: null, y: null };
    var PARTICLE_COUNT = 75;
    var CONNECTION_DIST = 130;
    var MOUSE_ATTRACT_DIST = 180;
    var MOUSE_FORCE = 0.022;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function mkParticle() {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: 1.5 + Math.random() * 1.7,
        opacity: 0.3 + Math.random() * 0.55
      };
    }

    function init() { particles = []; for (var i = 0; i < PARTICLE_COUNT; i++) particles.push(mkParticle()); }

    function animate() {
      ctx.clearRect(0, 0, W, H);
      var dark = isDarkMode();
      var pc = dark ? getColorRGB('--accent', [0, 255, 157]).join(',') : '15,23,42';
      var lc = dark ? getColorRGB('--accent-light', [0, 229, 141]).join(',') : '15,23,42';

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        if (mouse.x !== null) {
          var dx = mouse.x - p.x, dy = mouse.y - p.y;
          var dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < MOUSE_ATTRACT_DIST) {
            var force = (MOUSE_ATTRACT_DIST - dist) / MOUSE_ATTRACT_DIST;
            p.vx += dx * force * MOUSE_FORCE;
            p.vy += dy * force * MOUSE_FORCE;
          }
        }
        var spd = Math.sqrt(p.vx*p.vx + p.vy*p.vy);
        if (spd > 1.8) { p.vx = p.vx/spd*1.8; p.vy = p.vy/spd*1.8; }
        p.x += p.vx; p.y += p.vy;
        if (p.x < -10) p.x = W+10;
        if (p.x > W+10) p.x = -10;
        if (p.y < -10) p.y = H+10;
        if (p.y > H+10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(' + pc + ',' + p.opacity + ')';
        ctx.fill();

        for (var j = i+1; j < particles.length; j++) {
          var q = particles[j];
          var ddx = p.x-q.x, ddy = p.y-q.y;
          var dd = Math.sqrt(ddx*ddx+ddy*ddy);
          if (dd < CONNECTION_DIST) {
            var alpha = (1 - dd/CONNECTION_DIST) * 0.35;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = 'rgba(' + lc + ',' + alpha + ')';
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    }

    function updateTouch(e) {
      if (e.touches && e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    }

    window.addEventListener('mousemove', function(e) { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('touchstart', updateTouch, { passive: true });
    window.addEventListener('touchmove', updateTouch, { passive: true });
    window.addEventListener('touchend', function() { mouse.x = null; mouse.y = null; });
    window.addEventListener('mouseleave', function() { mouse.x = null; mouse.y = null; });
    window.addEventListener('resize', function() { resize(); init(); });
    resize(); init(); animate();
  })();

  // ══════════════════════════════════════════════════════════
  // FEATURE 2 — Neural Network Visualizer (Hero)
  // ══════════════════════════════════════════════════════════
  (function initNeuralNet() {
    var canvas = document.getElementById('neural-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var hero = document.getElementById('hero');
    var W, H;
    var mouse = { x: -999, y: -999 };
    var LAYERS = [4, 6, 5, 3];
    var nodes = [], edges = [], t = 0;

    function resize() {
      W = canvas.width = hero.offsetWidth;
      H = canvas.height = hero.offsetHeight;
      buildNet();
    }

    function buildNet() {
      nodes = []; edges = [];
      var lCount = LAYERS.length;
      var lSpacing = W / (lCount + 1);
      LAYERS.forEach(function(count, li) {
        var x = lSpacing * (li + 1);
        var nSpacing = H / (count + 1);
        for (var i = 0; i < count; i++) {
          nodes.push({ x: x, y: nSpacing*(i+1), layer: li, phase: Math.random()*Math.PI*2, activation: 0, target: Math.random() });
        }
      });
      var start = 0;
      for (var l = 0; l < LAYERS.length - 1; l++) {
        var nextStart = start + LAYERS[l];
        for (var i = start; i < nextStart; i++) {
          var nextEnd = nextStart + LAYERS[l+1];
          for (var j = nextStart; j < nextEnd; j++) {
            edges.push({ from: i, to: j, phase: Math.random()*Math.PI*2, flow: 0 });
          }
        }
        start = nextStart;
      }
    }

    function animate() {
      ctx.clearRect(0, 0, W, H);
      t += 0.012;
      var dark = isDarkMode();
      var nodeColor = dark ? getColorRGB('--accent', [0, 255, 157]) : [15, 23, 42];
      var edgeColor = dark ? getColorRGB('--accent-light', [0, 229, 141]) : [51, 65, 85];
      var nr = nodeColor[0], ng = nodeColor[1], nb = nodeColor[2];
      var er = edgeColor[0], eg = edgeColor[1], eb = edgeColor[2];

      nodes.forEach(function(n) {
        if (Math.random() < 0.005) n.target = Math.random();
        n.activation += (n.target - n.activation) * 0.04;
        var dx = mouse.x - n.x, dy = mouse.y - n.y;
        var dist = Math.sqrt(dx*dx+dy*dy);
        var prox = Math.max(0, 1 - dist/160);
        var pulse = 0.5 + 0.5 * Math.sin(t*2 + n.phase);
        var b = Math.min(1, n.activation + pulse*0.3 + prox*0.6);

        if (b > 0.3) {
          var grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 22);
          grd.addColorStop(0, 'rgba('+nr+','+ng+','+nb+','+(b*0.3)+')');
          grd.addColorStop(1, 'rgba('+nr+','+ng+','+nb+',0)');
          ctx.beginPath();
          ctx.arc(n.x, n.y, 22, 0, Math.PI*2);
          ctx.fillStyle = grd;
          ctx.fill();
        }

        var r = 5 + b*4;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI*2);
        ctx.fillStyle = 'rgba('+nr+','+ng+','+nb+','+(0.25+b*0.65)+')';
        ctx.fill();
        ctx.strokeStyle = 'rgba('+nr+','+ng+','+nb+','+(0.5+b*0.4)+')';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      edges.forEach(function(e) {
        var from = nodes[e.from], to = nodes[e.to];
        var ea = (from.activation + to.activation) / 2;
        var alpha = 0.06 + ea * 0.18;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = 'rgba('+er+','+eg+','+eb+','+alpha+')';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        if (ea > 0.4) {
          e.flow = (e.flow + 0.008) % 1;
          var fx = from.x + (to.x - from.x)*e.flow;
          var fy = from.y + (to.y - from.y)*e.flow;
          ctx.beginPath();
          ctx.arc(fx, fy, 2.5, 0, Math.PI*2);
          ctx.fillStyle = 'rgba('+nr+','+ng+','+nb+','+(ea*0.7)+')';
          ctx.fill();
        }
      });

      requestAnimationFrame(animate);
    }

    function updateHeroTouch(e) {
      if (e.touches && e.touches.length > 0) {
        var rect = hero.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
      }
    }

    hero.addEventListener('mousemove', function(e) {
      var rect = hero.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    hero.addEventListener('touchstart', updateHeroTouch, { passive: true });
    hero.addEventListener('touchmove', updateHeroTouch, { passive: true });
    hero.addEventListener('touchend', function() { mouse.x = -999; mouse.y = -999; });
    hero.addEventListener('mouseleave', function() { mouse.x = -999; mouse.y = -999; });
    window.addEventListener('resize', resize);
    resize(); animate();
  })();

  // ══════════════════════════════════════════════════════════
  // FEATURE 3 — 3D Tilt Cards + Holographic Glare
  // ══════════════════════════════════════════════════════════
  (function initTiltCards() {
    document.querySelectorAll('.card').forEach(function(card) {
      var glare = document.createElement('div');
      glare.className = 'card-glare';
      card.appendChild(glare);

      var rafId = null;
      var MAX_TILT = 8;

      function handlePos(cx, cy) {
        if (rafId) return;
        rafId = requestAnimationFrame(function() {
          var rect = card.getBoundingClientRect();
          var x = cx - rect.left, y = cy - rect.top;
          var ccx = rect.width/2, ccy = rect.height/2;
          var rX = ((y - ccy)/ccy) * MAX_TILT;
          var rY = ((ccx - x)/ccx) * MAX_TILT;
          card.style.transform = 'perspective(900px) rotateX('+rX+'deg) rotateY('+rY+'deg) translateY(-6px)';
          card.style.transition = 'transform 0.08s ease';
          glare.style.setProperty('--gx', ((x/rect.width)*100)+'%');
          glare.style.setProperty('--gy', ((y/rect.height)*100)+'%');
          card.style.setProperty('--x', x+'px');
          card.style.setProperty('--y', y+'px');
          rafId = null;
        });
      }

      card.addEventListener('mousemove', function(e) {
        handlePos(e.clientX, e.clientY);
      });

      card.addEventListener('touchmove', function(e) {
        if (e.touches && e.touches.length > 0) {
          handlePos(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: true });

      function resetCard() {
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        card.style.transition = 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1)';
        card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)';
      }

      card.addEventListener('mouseleave', resetCard);
      card.addEventListener('touchend', resetCard);
    });
  })();

  // ══════════════════════════════════════════════════════════
  // FEATURE 4 — Animated Circular Skill Progress Arcs
  // ══════════════════════════════════════════════════════════
  (function initSkillArcs() {
    var skillCards = document.querySelectorAll('.skill-category[data-level]');
    if (!skillCards.length) return;

    var svgDefs = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgDefs.setAttribute('width', '0');
    svgDefs.setAttribute('height', '0');
    svgDefs.style.position = 'absolute';
    svgDefs.innerHTML = '<defs><linearGradient id="skillGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#6366f1"/><stop offset="100%" stop-color="#a78bfa"/></linearGradient></defs>';
    document.body.appendChild(svgDefs);

    var RADIUS = 20;
    var CIRC = 2 * Math.PI * RADIUS;

    skillCards.forEach(function(card) {
      var level = parseInt(card.getAttribute('data-level'), 10) || 75;
      var header = card.querySelector('.skill-category-header');

      var wrapper = document.createElement('div');
      wrapper.className = 'skill-ring-wrapper';
      wrapper.style.marginLeft = 'auto';

      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '52');
      svg.setAttribute('height', '52');
      svg.setAttribute('viewBox', '0 0 52 52');
      svg.style.transform = 'rotate(-90deg)';
      svg.style.overflow = 'visible';

      var bgC = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      bgC.setAttribute('cx','26'); bgC.setAttribute('cy','26'); bgC.setAttribute('r', String(RADIUS));
      bgC.setAttribute('fill','none'); bgC.setAttribute('stroke','rgba(15,23,42,0.12)'); bgC.setAttribute('stroke-width','3.5');

      var fillC = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      fillC.setAttribute('cx','26'); fillC.setAttribute('cy','26'); fillC.setAttribute('r', String(RADIUS));
      fillC.setAttribute('fill','none'); fillC.setAttribute('stroke','url(#skillGrad)'); fillC.setAttribute('stroke-width','3.5');
      fillC.setAttribute('stroke-linecap','round');
      fillC.setAttribute('stroke-dasharray', String(CIRC));
      fillC.setAttribute('stroke-dashoffset', String(CIRC));
      fillC.style.transition = 'stroke-dashoffset 1.3s cubic-bezier(0.4,0,0.2,1)';

      svg.appendChild(bgC); svg.appendChild(fillC);
      wrapper.appendChild(svg);

      var label = document.createElement('span');
      label.className = 'skill-ring-label';
      label.textContent = level + '%';
      wrapper.appendChild(label);
      header.appendChild(wrapper);

      var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            fillC.style.strokeDashoffset = String(CIRC - (level/100)*CIRC);
            obs.unobserve(card);
          }
        });
      }, { threshold: 0.3 });
      obs.observe(card);
    });
  })();

  // ══════════════════════════════════════════════════════════
  // FEATURE 5 — Custom Animated Cursor
  // ══════════════════════════════════════════════════════════
  (function initCustomCursor() {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    var dot = document.getElementById('cursor-dot');
    var ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    var mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
    var LERP = 0.14;

    document.addEventListener('mousemove', function(e) {
      mouseX = e.clientX; mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * LERP;
      ringY += (mouseY - ringY) * LERP;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    document.querySelectorAll('a, button, .card, .skill-badge, .coursework-tag, .project-link, .theme-toggle, .nav-toggle').forEach(function(el) {
      el.addEventListener('mouseenter', function() { dot.classList.add('cursor-hover'); ring.classList.add('cursor-hover'); });
      el.addEventListener('mouseleave', function() { dot.classList.remove('cursor-hover'); ring.classList.remove('cursor-hover'); });
    });

    document.addEventListener('mousedown', function() { dot.classList.add('cursor-click'); ring.classList.add('cursor-click'); });
    document.addEventListener('mouseup', function() { dot.classList.remove('cursor-click'); ring.classList.remove('cursor-click'); });
    document.addEventListener('mouseleave', function() { dot.style.opacity='0'; ring.style.opacity='0'; });
    document.addEventListener('mouseenter', function() { dot.style.opacity='1'; ring.style.opacity='0.7'; });
  })();

  // ══════════════════════════════════════════════════════════
  // FEATURE 6 — GitHub Activity Heatmap + Live Stats
  // Fetches real data from GitHub REST API + contributions API
  // Falls back to seeded data silently if APIs are unavailable
  // ══════════════════════════════════════════════════════════
  (function initGitHubActivity() {
    var USERNAME       = 'Hamdan-a11y';
    var MONTHS         = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var TOTAL_WEEKS    = 53;
    var DAYS_PER_WEEK  = 7;
    var FALLBACK_STATS = { followers: 14, commits: 892, repos: 33, stars: 47 };

    // ── Seeded fallback for heatmap when contributions API is down ──
    function seededRand(seed) {
      var x = Math.sin(seed + 1) * 10000;
      return x - Math.floor(x);
    }

    function generateFallbackData() {
      var data = [];
      var today = new Date();
      var startDate = new Date(today);
      startDate.setDate(today.getDate() - (TOTAL_WEEKS * 7 - 1));
      var streak = 0;
      for (var w = 0; w < TOTAL_WEEKS; w++) {
        var week = [];
        for (var d = 0; d < DAYS_PER_WEEK; d++) {
          var s = w * 7 + d;
          var r = seededRand(s);
          var isWeekend = (d === 5 || d === 6);
          streak = Math.max(0, streak - 0.05);
          var lv = 0;
          if (r < 0.18 + streak)       { lv = 0; }
          else if (r < 0.40)            { lv = 1; }
          else if (r < 0.62)            { lv = 2; streak += 0.08; }
          else if (r < 0.82)            { lv = 3; streak += 0.12; }
          else                          { lv = 4; streak += 0.18; }
          if (isWeekend && lv > 1) lv = Math.max(0, lv - 1);
          var ct = [0,
            Math.floor(1 + seededRand(s+100)*3),
            Math.floor(4 + seededRand(s+200)*5),
            Math.floor(8 + seededRand(s+300)*7),
            Math.floor(15 + seededRand(s+400)*10)][lv];
          var dt = new Date(startDate);
          dt.setDate(startDate.getDate() + w * 7 + d);
          week.push({ level: lv, count: ct, date: dt });
        }
        data.push(week);
      }
      return data;
    }

    // ── Live API fetches — all errors silently return null ──
    function ghFetch(url) {
      return fetch(url, { headers: { 'Accept': 'application/vnd.github.v3+json' } })
        .then(function(r) { return r.ok ? r.json() : null; })
        .catch(function() { return null; });
    }

    function fetchUserStats()  { return ghFetch('https://api.github.com/users/' + USERNAME); }
    function fetchAllRepos()   { return ghFetch('https://api.github.com/users/' + USERNAME + '/repos?per_page=100&sort=updated'); }
    function fetchContributions() {
      return fetch('https://github-contributions-api.jogruber.de/v4/' + USERNAME + '?y=last')
        .then(function(r) { return r.ok ? r.json() : null; })
        .catch(function() { return null; });
    }

    // ── Map contributions API response → week×day grid ──
    function processContributions(contribs) {
      if (!contribs || !contribs.contributions) return generateFallbackData();
      var lookup = {};
      contribs.contributions.forEach(function(c) {
        lookup[c.date] = { level: c.level, count: c.count };
      });
      var data = [];
      var today = new Date();
      var startDate = new Date(today);
      startDate.setDate(today.getDate() - (TOTAL_WEEKS * 7 - 1));
      for (var w = 0; w < TOTAL_WEEKS; w++) {
        var week = [];
        for (var d = 0; d < DAYS_PER_WEEK; d++) {
          var dt = new Date(startDate);
          dt.setDate(startDate.getDate() + w * 7 + d);
          var isFuture = dt > today;
          var key   = dt.toISOString().split('T')[0]; // YYYY-MM-DD
          var entry = (!isFuture && lookup[key]) ? lookup[key] : { level: 0, count: 0 };
          week.push({ level: entry.level, count: entry.count, date: dt });
        }
        data.push(week);
      }
      return data;
    }

    // ── Ease-out cubic count-up ──
    function countUp(el, target, duration) {
      var startTime = null;
      function step(ts) {
        if (!startTime) startTime = ts;
        var p    = Math.min((ts - startTime) / duration, 1);
        var ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(ease * target).toLocaleString();
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString();
      }
      requestAnimationFrame(step);
    }

    // ── Month label strip ──
    function buildMonthLabels(containerEl) {
      var today = new Date();
      var startDate = new Date(today);
      startDate.setDate(today.getDate() - (TOTAL_WEEKS * 7 - 1));
      var lastMonth = -1;
      containerEl.innerHTML = '';
      for (var w = 0; w < TOTAL_WEEKS; w++) {
        var wd = new Date(startDate);
        wd.setDate(startDate.getDate() + w * 7);
        var m  = wd.getMonth();
        var sp = document.createElement('span');
        sp.className  = 'gh-month-label';
        sp.style.cssText = 'width:15px;display:inline-block;flex-shrink:0';
        if (m !== lastMonth) { sp.textContent = MONTHS[m]; lastMonth = m; }
        containerEl.appendChild(sp);
      }
    }

    // ── Build heatmap DOM ──
    function buildGrid(gridEl, data, tooltip) {
      gridEl.innerHTML = '';
      data.forEach(function(week) {
        var col = document.createElement('div');
        col.className = 'gh-week-col';
        week.forEach(function(cd) {
          var cell    = document.createElement('div');
          cell.className = 'gh-cell';
          cell.setAttribute('data-level', String(cd.level));
          var dateStr = cd.date.toLocaleDateString('en-US', {
            weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
          });
          cell.setAttribute('data-date',    dateStr);
          cell.setAttribute('data-commits', cd.count);

          function showTooltip(cx, cy) {
            var c     = parseInt(cell.getAttribute('data-commits'), 10);
            var label = c === 0 ? 'No contributions'
                      : c === 1 ? '1 contribution'
                      : c + ' contributions';
            tooltip.textContent = label + ' · ' + cell.getAttribute('data-date');
            tooltip.classList.add('visible');
            var rect = tooltip.parentElement.getBoundingClientRect();
            tooltip.style.left = Math.min(rect.width - 150, Math.max(10, cx - rect.left - 40)) + 'px';
            tooltip.style.top  = (cy - rect.top - 36) + 'px';
          }

          cell.addEventListener('mouseenter', function(e) {
            showTooltip(e.clientX, e.clientY);
          });
          cell.addEventListener('mousemove', function(e) {
            showTooltip(e.clientX, e.clientY);
          });
          cell.addEventListener('touchstart', function(e) {
            if (e.touches && e.touches.length > 0) {
              showTooltip(e.touches[0].clientX, e.touches[0].clientY);
            }
          }, { passive: true });
          cell.addEventListener('mouseleave', function() {
            tooltip.classList.remove('visible');
          });
          cell.addEventListener('touchend', function() {
            setTimeout(function() { tooltip.classList.remove('visible'); }, 2000);
          });
          col.appendChild(cell);
        });
        gridEl.appendChild(col);
      });
    }

    // ── Staggered entrance animation ──
    function animateCells(gridEl) {
      gridEl.querySelectorAll('.gh-week-col').forEach(function(col, ci) {
        col.querySelectorAll('.gh-cell').forEach(function(cell, di) {
          setTimeout(function() {
            cell.style.transition = 'opacity 0.3s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)';
            cell.style.opacity    = '1';
            cell.style.transform  = 'scale(1)';
          }, ci * 8 + di * 12);
        });
      });
    }

    // ── Show cells instantly (used after API rebuild) ──
    function showCellsInstant(gridEl) {
      gridEl.querySelectorAll('.gh-cell').forEach(function(cell) {
        cell.style.transition = 'none';
        cell.style.opacity    = '1';
        cell.style.transform  = 'scale(1)';
      });
    }

    // ── Update stat counter cards ──
    function updateStatCards(stats) {
      var mapping = {
        'gh-count-followers': stats.followers,
        'gh-count-commits':   stats.commits,
        'gh-count-repos':     stats.repos,
        'gh-count-stars':     stats.stars
      };
      Object.keys(mapping).forEach(function(id) {
        var el = document.getElementById(id);
        if (!el) return;
        el.setAttribute('data-count', mapping[id]);
        countUp(el, mapping[id], 1400);
      });
    }

    // ── Loading dash while API fetches ──
    function setStatLoading(on) {
      ['gh-count-followers','gh-count-commits','gh-count-repos','gh-count-stars'].forEach(function(id) {
        var el = document.getElementById(id);
        if (el && on) el.textContent = '—';
      });
    }

    // ══ INIT ══
    var gridEl    = document.getElementById('gh-grid');
    var monthEl   = document.getElementById('gh-month-labels');
    var tooltipEl = document.getElementById('gh-tooltip');
    if (!gridEl || !monthEl || !tooltipEl) return;

    // Build structure immediately with fallback data so layout is ready
    buildMonthLabels(monthEl);
    buildGrid(gridEl, generateFallbackData(), tooltipEl);

    // Pre-hide cells for entrance animation
    gridEl.querySelectorAll('.gh-cell').forEach(function(cell) {
      cell.style.opacity   = '0';
      cell.style.transform = 'scale(0.5)';
    });

    var sectionEl   = document.getElementById('github');
    var hasAnimated = false;

    var ghObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting || hasAnimated) return;
        hasAnimated = true;

        // Show loading dashes + animate fallback cells immediately
        setStatLoading(true);
        animateCells(gridEl);

        // Fetch user, repos, and contributions in parallel
        Promise.all([fetchUserStats(), fetchAllRepos(), fetchContributions()])
          .then(function(results) {
            var user     = results[0];
            var repos    = results[1];
            var contribs = results[2];

            // Build stats object
            var stats = {
              followers: (user && typeof user.followers    === 'number') ? user.followers    : FALLBACK_STATS.followers,
              repos:     (user && typeof user.public_repos === 'number') ? user.public_repos : FALLBACK_STATS.repos,
              stars:     (repos && Array.isArray(repos))
                           ? repos.reduce(function(s, r) { return s + (r.stargazers_count || 0); }, 0)
                           : FALLBACK_STATS.stars,
              commits:   FALLBACK_STATS.commits
            };

            // Sum all-time commits from contributions total object
            if (contribs && contribs.total && typeof contribs.total === 'object') {
              var total = Object.keys(contribs.total).reduce(function(s, k) {
                return s + (typeof contribs.total[k] === 'number' ? contribs.total[k] : 0);
              }, 0);
              if (total > 0) stats.commits = total;
            }

            // Animate stats to real values
            updateStatCards(stats);

            // Rebuild heatmap with real contribution data
            buildGrid(gridEl, processContributions(contribs), tooltipEl);
            showCellsInstant(gridEl);
          })
          .catch(function() {
            // Complete failure — still show fallback numbers
            updateStatCards(FALLBACK_STATS);
          });

        ghObserver.unobserve(entry.target);
      });
    }, { threshold: 0.1 });

    if (sectionEl) ghObserver.observe(sectionEl);

    // Theme toggle repaint helper
    var themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', function() {
        gridEl.style.opacity = '0.99';
        setTimeout(function() { gridEl.style.opacity = '1'; }, 50);
      });
    }
  })();

  // ────────────────────────────────────────────────────────────
  // 7. Palette Studio Customizer Feature
  // ────────────────────────────────────────────────────────────
  (function initPaletteStudio() {
    var toggleBtn  = document.getElementById('palette-toggle');
    var studioEl   = document.getElementById('palette-studio');
    var closeBtn   = document.getElementById('palette-close');
    var resetBtn   = document.getElementById('palette-reset');
    var hueSlider  = document.getElementById('palette-hue-slider');
    var presetBtns = document.querySelectorAll('.palette-preset-btn');
    var htmlEl     = document.documentElement;

    if (!toggleBtn || !studioEl) return;

    // --- Helper to clear active preset button states ---
    function clearPresetActive() {
      presetBtns.forEach(function(btn) {
        btn.classList.remove('active');
      });
    }

    // --- Open/Close Studio Popover ---
    toggleBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      var active = studioEl.classList.toggle('active');
      studioEl.setAttribute('aria-hidden', !active);
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        studioEl.classList.remove('active');
        studioEl.setAttribute('aria-hidden', 'true');
      });
    }

    // Close when clicking outside the studio container
    document.addEventListener('click', function(e) {
      if (studioEl.classList.contains('active') && !studioEl.contains(e.target) && e.target !== toggleBtn) {
        studioEl.classList.remove('active');
        studioEl.setAttribute('aria-hidden', 'true');
      }
    });

    // Prevent closing when clicking inside the studio container
    studioEl.addEventListener('click', function(e) {
      e.stopPropagation();
    });

    // --- Switch to Preset theme ---
    presetBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var preset = btn.getAttribute('data-preset');
        clearPresetActive();
        btn.classList.add('active');

        // Apply theme attribute
        htmlEl.setAttribute('data-palette', preset);
        localStorage.setItem('portfolio-palette', preset);

        // Reset custom hue settings
        htmlEl.style.removeProperty('--custom-hue');
        localStorage.removeItem('portfolio-hue');
      });
    });

    // --- Drag custom HSL Hue Slider ---
    if (hueSlider) {
      hueSlider.addEventListener('input', function() {
        var hueVal = hueSlider.value;
        clearPresetActive();

        htmlEl.setAttribute('data-palette', 'custom');
        htmlEl.style.setProperty('--custom-hue', hueVal);

        localStorage.setItem('portfolio-palette', 'custom');
        localStorage.setItem('portfolio-hue', hueVal);
      });
    }

    // --- Reset to Default (Matrix Green) ---
    if (resetBtn) {
      resetBtn.addEventListener('click', function() {
        clearPresetActive();
        // default preset is matrix
        var defaultPresetBtn = document.querySelector('.palette-preset-btn[data-preset="matrix"]');
        if (defaultPresetBtn) defaultPresetBtn.classList.add('active');

        htmlEl.setAttribute('data-palette', 'matrix');
        localStorage.setItem('portfolio-palette', 'matrix');

        htmlEl.style.removeProperty('--custom-hue');
        localStorage.removeItem('portfolio-hue');
        if (hueSlider) hueSlider.value = 150; // default green-ish hue
      });
    }

    // --- Restore Preferences on Load ---
    var savedPalette = localStorage.getItem('portfolio-palette') || 'matrix';
    var savedHue     = localStorage.getItem('portfolio-hue');

    clearPresetActive();
    var activeBtn = document.querySelector('.palette-preset-btn[data-preset="' + savedPalette + '"]');
    if (activeBtn) {
      activeBtn.classList.add('active');
    }

    if (savedPalette === 'custom' && savedHue) {
      htmlEl.setAttribute('data-palette', 'custom');
      htmlEl.style.setProperty('--custom-hue', savedHue);
      if (hueSlider) hueSlider.value = savedHue;
    } else {
      htmlEl.setAttribute('data-palette', savedPalette);
      if (hueSlider) hueSlider.value = 150;
    }
  })();

})();
