// =========================================================
// Joshua Bandola — Portfolio Interactivity
// Vanilla JavaScript only, no dependencies
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ===== Header + scroll progress ===== */
  const header = document.getElementById('header');
  const progressBar = document.getElementById('progressBar');
  const backToTop = document.getElementById('backToTop');

  const onScroll = () => {
    const scrollTop = window.scrollY;
    header.classList.toggle('scrolled', scrollTop > 10);
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
    backToTop.classList.toggle('visible', scrollTop > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ===== Mobile nav ===== */
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ===== Scroll reveal ===== */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ===== Active nav link on scroll ===== */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '-80px 0px -40% 0px' });
  sections.forEach(section => navObserver.observe(section));

  /* ===== Expandable experience timeline ===== */
  document.querySelectorAll('.timeline-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.timeline-item');
      const isOpen = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen);
    });
  });

  /* ===== Koh-Hee-Hausu menu filtering ===== */
  const khhFilterBtns = document.querySelectorAll('.khh-filter-btn');
  const khhItems = document.querySelectorAll('.khh-item');
  khhFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      khhFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      khhItems.forEach(item => {
        const show = filter === 'all' || item.getAttribute('data-cat') === filter;
        item.classList.toggle('is-hidden', !show);
      });
    });
  });

  /* ===== Koh-Hee-Hausu "Add to Order" micro-interaction (demo only) ===== */
  document.querySelectorAll('.khh-add').forEach(btn => {
    btn.addEventListener('click', () => {
      const original = btn.textContent;
      btn.textContent = 'Added ✓';
      setTimeout(() => { btn.textContent = original; }, 1400);
    });
  });

  /* ===== Back to top ===== */
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  });

  /* ===== Toast ===== */
  const toast = document.getElementById('toast');
  let toastTimer;
  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
  };

  /* ===== Contact form validation ===== */
  const form = document.getElementById('contactForm');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const subjectError = document.getElementById('subjectError');
  const messageError = document.getElementById('messageError');

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const setFieldError = (input, errorEl, message) => {
    input.closest('.form-row').classList.toggle('has-error', !!message);
    errorEl.textContent = message || '';
  };

  const validateField = (input) => {
    if (input === nameInput) {
      if (!nameInput.value.trim()) { setFieldError(nameInput, nameError, 'Please enter your name.'); return false; }
      setFieldError(nameInput, nameError, ''); return true;
    }
    if (input === emailInput) {
      if (!emailInput.value.trim()) { setFieldError(emailInput, emailError, 'Please enter your email.'); return false; }
      if (!emailPattern.test(emailInput.value.trim())) { setFieldError(emailInput, emailError, 'Please enter a valid email address.'); return false; }
      setFieldError(emailInput, emailError, ''); return true;
    }
    if (input === subjectInput) {
      if (!subjectInput.value.trim()) { setFieldError(subjectInput, subjectError, 'Please add a subject.'); return false; }
      setFieldError(subjectInput, subjectError, ''); return true;
    }
    if (input === messageInput) {
      if (!messageInput.value.trim()) { setFieldError(messageInput, messageError, 'Please enter a message.'); return false; }
      if (messageInput.value.trim().length < 10) { setFieldError(messageInput, messageError, 'Message should be at least 10 characters.'); return false; }
      setFieldError(messageInput, messageError, ''); return true;
    }
    return true;
  };

  [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.closest('.form-row').classList.contains('has-error')) validateField(input);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const validName = validateField(nameInput);
    const validEmail = validateField(emailInput);
    const validSubject = validateField(subjectInput);
    const validMessage = validateField(messageInput);

    if (!validName || !validEmail || !validSubject || !validMessage) {
      showToast('Please fix the highlighted fields.');
      return;
    }

    const subject = encodeURIComponent(subjectInput.value.trim());
    const body = encodeURIComponent(
      `Name: ${nameInput.value.trim()}\nEmail: ${emailInput.value.trim()}\n\n${messageInput.value.trim()}`
    );
    window.location.href = `mailto:joshuabandola.vl@gmail.com?subject=${subject}&body=${body}`;

    showToast('Opening your email client...');
    form.reset();
    [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
      input.closest('.form-row').classList.remove('has-error');
    });
  });

});