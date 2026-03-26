 
    // ── CURSOR ──────────────────────────────────────────────
    const cursor = document.getElementById('cursor');
    const ring   = document.getElementById('cursorRing');
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    function animCursor() {
      cursor.style.transform = `translate(${mx - 5}px, ${my - 5}px)`;
      rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
      ring.style.transform = `translate(${rx - 17}px, ${ry - 17}px)`;
      requestAnimationFrame(animCursor);
    }
    animCursor();
    document.querySelectorAll('a, button, .service-card, .project-card, .skill-item').forEach(el => {
      el.addEventListener('mouseenter', () => { ring.style.opacity = '0.15'; ring.style.transform += ' scale(1.4)'; });
      el.addEventListener('mouseleave', () => { ring.style.opacity = '0.4'; });
    });
 
    // ── HAMBURGER / MOBILE MENU ─────────────────────────────
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    let menuOpen = false;
    function openMenu()  { menuOpen = true;  hamburger.classList.add('open');    mobileMenu.classList.add('open');    document.body.style.overflow = 'hidden'; }
    function closeMenu() { menuOpen = false; hamburger.classList.remove('open'); mobileMenu.classList.remove('open'); document.body.style.overflow = ''; }
    hamburger.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && menuOpen) closeMenu(); });
 
    // ── NAVBAR SCROLL ────────────────────────────────────────
    window.addEventListener('scroll', () => {
      document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 60);
    });
 
    // ── REVEAL ON SCROLL ─────────────────────────────────────
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
 
    // ── SKILL BARS ────────────────────────────────────────────
    const skillObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); skillObserver.unobserve(entry.target); }
      });
    }, { threshold: 0.3 });
    document.querySelectorAll('.skill-item').forEach(el => skillObserver.observe(el));
 
    // ── COUNTER ANIMATION ─────────────────────────────────────
    function animateCounter(el, target, suffix = '') {
      let start = 0;
      const duration = 1800;
      const step = timestamp => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(ease * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
    const statsObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const nums = entry.target.querySelectorAll('.stat-number');
          nums[0] && animateCounter(nums[0], 1,   '+');
          nums[1] && animateCounter(nums[1], 10,  '+');
          nums[2] && animateCounter(nums[2], 100, '%');
          nums[3] && animateCounter(nums[3], 2);
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    document.querySelector('.stats') && statsObserver.observe(document.querySelector('.stats'));
 
    // ── CONTACT FORM → WEB3FORMS ─────────────────────────
    // No init needed for Web3Forms
 
    async function handleSubmit() {
      const name    = document.getElementById('fieldName').value.trim();
      const email   = document.getElementById('fieldEmail').value.trim();
      const subject = document.getElementById('fieldSubject').value.trim();
      const message = document.getElementById('fieldMessage').value.trim();
      const status  = document.getElementById('formStatus');
      const btn     = document.getElementById('submitBtn');
 
      if (!name || !email || !subject || !message) {
        showStatus('Veuillez remplir tous les champs.', 'error'); return;
      }
 
      btn.disabled = true; btn.classList.add('loading');
      btn.querySelector('.btn-text').textContent = 'Envoi en cours…';
      status.className = 'form-status'; status.style.display = 'none';

      const formData = new FormData();
      formData.append('access_key', '77236ab6-8bb7-4efd-9814-dbe23435fd89');
      formData.append('name', name);
      formData.append('email', email);
      formData.append('subject', subject);
      formData.append('message', message);

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });
        const result = await response.json();
        if (result.success) {
          showStatus('Message envoyé avec succès ! Merci de m\'avoir contacté.', 'success');
          document.getElementById('contactForm').reset();
          btn.querySelector('.btn-text').textContent = 'Envoyé ✓';
          btn.style.background = 'var(--accent2)';
          setTimeout(() => {
            btn.querySelector('.btn-text').textContent = 'Envoyer le message →';
            btn.style.background = '';
          }, 4000);
        } else {
          throw new Error(result.message || 'Erreur inconnue');
        }
      } catch (err) {
        console.error(err);
        showStatus('Une erreur est survenue. Veuillez réessayer ou me contacter directement.', 'error');
        btn.querySelector('.btn-text').textContent = 'Envoyer le message →';
      } finally {
        btn.disabled = false; btn.classList.remove('loading');
      }
    }
 
    function showStatus(msg, type) {
      const el = document.getElementById('formStatus');
      el.textContent = msg;
      el.className = `form-status ${type} visible`;
      el.style.display = 'block';
    }
  