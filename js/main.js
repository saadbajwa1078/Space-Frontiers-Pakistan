/* ===================================
   SPACE FRONTIERS PAKISTAN — MAIN JS
   =================================== */

// ======== NAVBAR SCROLL ========
(function() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function onScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ======== MOBILE NAV TOGGLE ========
(function() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', function() {
    links.classList.toggle('open');
    const isOpen = links.classList.contains('open');
    toggle.setAttribute('aria-expanded', isOpen);
    // Animate hamburger
    const spans = toggle.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // Close on link click
  links.querySelectorAll('a').forEach(function(a) {
    a.addEventListener('click', function() {
      links.classList.remove('open');
      const spans = toggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    });
  });
})();

// ======== ACTIVE NAV LINK ========
(function() {
  const links = document.querySelectorAll('.nav-links a');
  const path = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(function(link) {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (!href) return;
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

// ======== STAR FIELD GENERATOR ========
(function() {
  const container = document.getElementById('stars');
  if (!container) return;

  const count = 150;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star-dot';
    const size = Math.random() * 2.5 + 0.5;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const duration = (Math.random() * 4 + 2).toFixed(1);
    const delay = (Math.random() * 6).toFixed(1);
    const minOpacity = (Math.random() * 0.3 + 0.1).toFixed(2);

    star.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}%;
      top: ${y}%;
      --duration: ${duration}s;
      --delay: ${delay}s;
      --min-opacity: ${minOpacity};
    `;
    fragment.appendChild(star);
  }

  container.appendChild(fragment);
})();

// ======== COUNTDOWN TIMER ========
(function() {
  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMins = document.getElementById('cd-mins');
  const cdSecs = document.getElementById('cd-secs');

  if (!cdDays) return;

  // Conference date: June 14, 2026 09:00 PKT
  const target = new Date('2026-06-14T09:00:00+05:00').getTime();

  function pad(n) {
    // Avoid `padStart` for broader browser compatibility.
    return (n < 10 ? '0' : '') + String(n);
  }

  function tick() {
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      cdDays.textContent = '00';
      if (cdHours) cdHours.textContent = '00';
      if (cdMins) cdMins.textContent = '00';
      if (cdSecs) cdSecs.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    cdDays.textContent = pad(days);
    if (cdHours) cdHours.textContent = pad(hours);
    if (cdMins) cdMins.textContent = pad(mins);
    if (cdSecs) cdSecs.textContent = pad(secs);
  }

  tick();
  setInterval(tick, 1000);
})();

// ======== AGENDA TAB SWITCHER ========
(function() {
  const tabs = document.querySelectorAll('.agenda-day-tab');
  const preview = document.getElementById('agendaPreview');

  if (!tabs.length || !preview) return;

  const agendaData = {
    1: [
      { time: '09:00', session: 'Opening Ceremony & Welcome Address', tag: 'keynote' },
      { time: '10:30', session: "Pakistan's Role in Global Space Exploration — Dr. Rabia Sarfraz", tag: 'keynote' },
      { time: '12:00', session: 'Lunch & Networking', tag: 'break' },
      { time: '13:30', session: 'Satellite Technology Workshop', tag: 'workshop' },
      { time: '15:30', session: 'Exposition Hall Opens', tag: 'expo' },
    ],
    2: [
      { time: '09:30', session: 'Private Sector Opportunities in LEO Satellites — Ahmed Karim', tag: 'keynote' },
      { time: '11:00', session: 'Remote Sensing for Agriculture Panel', tag: 'panel' },
      { time: '12:30', session: 'Lunch Break', tag: 'break' },
      { time: '14:00', session: 'CubeSat Design Workshop', tag: 'workshop' },
      { time: '16:00', session: 'Exposition & Networking Hour', tag: 'expo' },
    ],
    3: [
      { time: '09:00', session: 'Next-Gen Satellite Communications — Muhammad Hassan', tag: 'keynote' },
      { time: '10:30', session: 'Space Policy & Regulation in Pakistan', tag: 'panel' },
      { time: '12:00', session: 'Lunch & Expo Tour', tag: 'break' },
      { time: '13:30', session: 'AI in Space Technology Workshop', tag: 'workshop' },
      { time: '17:00', session: 'Gala Dinner & Award Ceremony', tag: 'networking' },
    ],
    4: [
      { time: '09:30', session: 'Student Research Presentations', tag: 'panel' },
      { time: '11:00', session: 'Future of Space Tourism Panel', tag: 'panel' },
      { time: '12:30', session: 'Lunch Break', tag: 'break' },
      { time: '14:00', session: 'Closing Keynote & Vision for 2030', tag: 'keynote' },
      { time: '15:30', session: 'Closing Ceremony & Networking', tag: 'networking' },
    ],
  };

  function tagClass(tag) {
    return 'agenda-tag tag-' + tag;
  }

  function tagLabel(tag) {
    const map = { keynote: 'Keynote', workshop: 'Workshop', break: 'Break', expo: 'Expo', panel: 'Panel', networking: 'Networking' };
    return map[tag] || tag;
  }

  function renderDay(day) {
    const rows = agendaData[day];
    if (!rows) return;
    preview.innerHTML = rows.map(function(r) {
      return '<div class="agenda-row">' +
        '<span class="agenda-time">' + r.time + '</span>' +
        '<span class="agenda-session">' + r.session + '</span>' +
        '<span class="' + tagClass(r.tag) + '">' + tagLabel(r.tag) + '</span>' +
        '</div>';
    }).join('');
  }

  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      tabs.forEach(function(t) { t.classList.remove('active'); });
      tab.classList.add('active');
      renderDay(parseInt(tab.dataset.day));
    });
  });
})();

// ======== NEWSLETTER FORM ========
(function() {
  const form = document.getElementById('newsletterForm');
  const success = document.getElementById('newsletterSuccess');

  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    form.style.display = 'none';
    if (success) success.style.display = 'block';
  });
})();

// ======== SCROLL FADE IN ========
(function() {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    // Gracefully degrade: show elements immediately if unsupported.
    elements.forEach(function(el) { el.classList.add('visible'); });
    return;
  }

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  elements.forEach(function(el) { observer.observe(el); });
})();

// ======== REGISTRATION FORM ========
(function() {
  const form = document.getElementById('registerForm');
  const success = document.getElementById('formSuccess');

  if (!form) return;

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showError(input, message) {
    input.classList.add('error');
    const hint = input.parentElement.querySelector('.form-error');
    if (hint) { hint.textContent = message; hint.style.display = 'block'; }
  }

  function clearError(input) {
    input.classList.remove('error');
    const hint = input.parentElement.querySelector('.form-error');
    if (hint) hint.style.display = 'none';
  }

  function validateField(input) {
    const value = input.value.trim();
    if (input.required && !value) {
      showError(input, 'This field is required.');
      return false;
    }
    if (input.type === 'email' && value && !validateEmail(value)) {
      showError(input, 'Please enter a valid email address.');
      return false;
    }
    if (input.id === 'password' && value && value.length < 8) {
      showError(input, 'Password must be at least 8 characters.');
      return false;
    }
    if (input.id === 'confirmPassword') {
      const pwd = document.getElementById('password');
      if (pwd && value !== pwd.value) {
        showError(input, 'Passwords do not match.');
        return false;
      }
    }
    clearError(input);
    return true;
  }

  // Live validation
  form.querySelectorAll('input, select').forEach(function(input) {
    input.addEventListener('blur', function() { validateField(input); });
    input.addEventListener('input', function() {
      if (input.classList.contains('error')) validateField(input);
    });
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('input[required], select[required]').forEach(function(input) {
      if (!validateField(input)) valid = false;
    });

    if (!valid) return;

    // Simulate submission
    form.style.display = 'none';
    if (success) success.style.display = 'block';
  });
})();

// ======== AGENDA FILTER ========
(function() {
  const filterBtns = document.querySelectorAll('[data-filter]');
  const rows = document.querySelectorAll('.agenda-full-row[data-type]');

  if (!filterBtns.length) return;

  filterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      filterBtns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      rows.forEach(function(row) {
        if (filter === 'all' || row.dataset.type === filter) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });
})();

