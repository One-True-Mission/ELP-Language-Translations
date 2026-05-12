/* =========================================================
   ELP Language Translation Services
   Site scripts with bilingual EN/ES toggle
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Bilingual Toggle ---------- */
  const STORAGE_KEY = 'elp-lang';
  const langToggle = document.querySelector('.lang-toggle');
  let currentLang = 'en';

  const applyLanguage = (lang) => {
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-lang-en]').forEach(el => {
      const enText = el.getAttribute('data-lang-en');
      const esText = el.getAttribute('data-lang-es');
      if (lang === 'es' && esText) {
        el.innerHTML = esText;
      } else {
        el.innerHTML = enText;
      }
    });

    document.querySelectorAll('[data-placeholder-en]').forEach(el => {
      const enText = el.getAttribute('data-placeholder-en');
      const esText = el.getAttribute('data-placeholder-es');
      el.placeholder = (lang === 'es' && esText) ? esText : enText;
    });

    if (langToggle) {
      if (lang === 'es') {
        // Currently showing Spanish, so button offers English translation
        langToggle.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.4rem; vertical-align: middle;"><path d="M5 8l6 6"/><path d="M4 14l6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="M22 22l-5-10-5 10"/><path d="M14 18h6"/></svg>Translate';
        langToggle.setAttribute('aria-label', 'Translate to English');
      } else {
        // Currently showing English, so button offers Spanish translation
        langToggle.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.4rem; vertical-align: middle;"><path d="M5 8l6 6"/><path d="M4 14l6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="M22 22l-5-10-5 10"/><path d="M14 18h6"/></svg>Traducir';
        langToggle.setAttribute('aria-label', 'Traducir al español');
      }
    }

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  };

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'es' || saved === 'en') currentLang = saved;
  } catch (e) {}
  applyLanguage(currentLang);

  if (langToggle) {
    langToggle.addEventListener('click', () => {
      currentLang = (currentLang === 'en') ? 'es' : 'en';
      applyLanguage(currentLang);
    });
  }

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  /* ---------- Active nav link ---------- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });

  /* ---------- Schedule button placeholder ---------- */
  document.querySelectorAll('.schedule-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (btn.getAttribute('href') === '#') {
        e.preventDefault();
        const service = btn.querySelector('.schedule-btn-title')?.textContent || 'this service';
        const msg = (currentLang === 'es')
          ? `El enlace de reservación para "${service}" se agregará aquí. Una vez que configure sus seis tipos de citas en Google Calendar, envíeme los enlaces y los conectaré.`
          : `Booking link for "${service}" will go here. Once you set up your six appointment types in Google Calendar, send me the links and I'll wire them up.`;
        alert(msg);
      }
    });
  });

  /* ---------- Contact form submission ---------- */
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const submitBtn = contactForm.querySelector('.btn-submit');
      const originalHTML = submitBtn.innerHTML;

      const sendingText = (currentLang === 'es') ? 'Enviando...' : 'Sending...';
      const successText = (currentLang === 'es') ? '¡Mensaje enviado!' : 'Message sent!';
      const errorText = (currentLang === 'es') ? 'Error. Intente de nuevo.' : 'Error. Try again.';

      submitBtn.disabled = true;
      submitBtn.textContent = sendingText;

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          submitBtn.textContent = successText;
          contactForm.reset();
          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalHTML;
          }, 3000);
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        submitBtn.textContent = errorText;
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalHTML;
        }, 3000);
      }
    });
  }

  /* ---------- Smooth scroll for anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---------- Animated stat counters ---------- */
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');

  if (statNumbers.length > 0) {
    const animateCounter = (el) => {
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1800;
      const startTime = performance.now();

      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

      const step = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);
        const value = Math.floor(eased * target);

        el.innerHTML = value + (suffix ? `<span class="stat-suffix">${suffix}</span>` : '');

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.innerHTML = target + (suffix ? `<span class="stat-suffix">${suffix}</span>` : '');
        }
      };

      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          entry.target.dataset.animated = 'true';
          animateCounter(entry.target);
        }
      });
    }, { threshold: 0.4 });

    statNumbers.forEach(el => observer.observe(el));
  }

});