/* ============================================================
   3W ENGENHARIA — JavaScript Principal
   ============================================================ */

/* ── Preloader (6 segundos) ────────────────────────────────── */
(function () {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  setTimeout(() => preloader.classList.add('hidden'), 6000);
})();

document.addEventListener('DOMContentLoaded', () => {

  /* ── Header scroll ─────────────────────────────────────── */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  /* ── Menu mobile ───────────────────────────────────────── */
  const toggle      = document.getElementById('menuToggle');
  const navMenu     = document.getElementById('navMenu');
  const mobileLinks = navMenu.querySelectorAll('a');

  toggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    toggle.classList.toggle('active', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ── Smooth scroll ─────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const headerH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--header-h')
      ) || 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - headerH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── Botão voltar ao topo ──────────────────────────────── */
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Aviso LGPD ────────────────────────────────────────── */
  const lgpdNotice  = document.getElementById('lgpd-notice');
  const lgpdAccept  = document.getElementById('lgpd-accept');
  if (lgpdNotice && !localStorage.getItem('lgpd-accepted')) {
    setTimeout(() => lgpdNotice.classList.add('visible'), 1800);
    lgpdAccept?.addEventListener('click', () => {
      lgpdNotice.classList.remove('visible');
      localStorage.setItem('lgpd-accepted', '1');
    });
  }

  /* ── Barra de progresso de scroll ─────────────────────── */
  const scrollProgress = document.getElementById('scroll-progress');
  if (scrollProgress) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const total    = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.style.width = (scrolled / total * 100) + '%';
    }, { passive: true });
  }

  /* ── Animações de entrada ──────────────────────────────── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in, .fade-left, .fade-right').forEach(el => observer.observe(el));

  /* ── Underline animada nos títulos de seção ────────────── */
  const headerObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        headerObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.section-header').forEach(el => headerObs.observe(el));

  /* ── Geração da galeria ────────────────────────────────── */
  const mp4s     = new Set([11, 12, 29, 48, 59, 61, 72, 76, 86, 113]);
  const jpgNums  = [];
  for (let i = 1; i <= 120; i++) {
    if (!mp4s.has(i)) jpgNums.push(i);
  }

  const INITIAL_SHOW = 24;
  const galleryGrid  = document.getElementById('galleryGrid');
  const loadMoreBtn  = document.getElementById('loadMoreBtn');

  if (galleryGrid) {
    jpgNums.forEach((num, idx) => {
      const item = document.createElement('div');
      item.className = 'gallery-item' + (idx >= INITIAL_SHOW ? ' hidden' : '');
      item.innerHTML = `
        <img
          src="images/gallery/midia_${num}.jpg"
          alt="Obra realizada pela 3W Engenharia e Construção"
          loading="lazy"
        >
        <div class="gallery-item-overlay">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/>
          </svg>
        </div>
      `;
      galleryGrid.appendChild(item);
    });
  }

  /* ── Carregar mais ─────────────────────────────────────── */
  if (loadMoreBtn) {
    const hiddenItems = () => galleryGrid.querySelectorAll('.gallery-item.hidden');

    if (hiddenItems().length === 0) {
      loadMoreBtn.closest('.gallery-more').style.display = 'none';
    }

    loadMoreBtn.addEventListener('click', () => {
      hiddenItems().forEach(item => {
        item.classList.remove('hidden');
        item.classList.add('fade-in');
        requestAnimationFrame(() => item.classList.add('visible'));
      });
      loadMoreBtn.closest('.gallery-more').style.display = 'none';
    });
  }

  /* ── Lightbox ──────────────────────────────────────────── */
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev  = document.getElementById('lightboxPrev');
  const lightboxNext  = document.getElementById('lightboxNext');

  let currentIndex = 0;

  const getVisibleItems = () =>
    [...(galleryGrid?.querySelectorAll('.gallery-item:not(.hidden)') || [])];

  function openLightbox(index) {
    const items = getVisibleItems();
    currentIndex = index;
    lightboxImg.src = items[currentIndex].querySelector('img').src;
    lightboxImg.alt = items[currentIndex].querySelector('img').alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigate(dir) {
    const items = getVisibleItems();
    currentIndex = (currentIndex + dir + items.length) % items.length;
    lightboxImg.src = items[currentIndex].querySelector('img').src;
  }

  if (galleryGrid) {
    galleryGrid.addEventListener('click', e => {
      const item = e.target.closest('.gallery-item');
      if (!item) return;
      const visible = getVisibleItems();
      const idx = visible.indexOf(item);
      if (idx !== -1) openLightbox(idx);
    });
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev)  lightboxPrev.addEventListener('click', () => navigate(-1));
  if (lightboxNext)  lightboxNext.addEventListener('click', () => navigate(1));
  if (lightbox) {
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', e => {
    if (!lightbox?.classList.contains('active')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });

  /* ── Nav link ativo no scroll ──────────────────────────── */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-desktop a[href^="#"]');

  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = `#${entry.target.id}`;
        navLinks.forEach(link => {
          const active = link.getAttribute('href') === id;
          link.style.color = active ? 'var(--primary)' : '';
          link.style.fontWeight = active ? '700' : '';
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => sectionObs.observe(s));

  /* ── Contador animado nos stats ────────────────────────── */
  const statsSection = document.querySelector('.stats');
  if (statsSection) {
    const statsObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        statsSection.querySelectorAll('.count').forEach(el => {
          const target  = parseInt(el.dataset.target, 10);
          const suffix  = el.dataset.suffix || '';
          let current   = 0;
          const step    = Math.ceil(target / 40);
          const ticker  = setInterval(() => {
            current += step;
            if (current >= target) { current = target; clearInterval(ticker); }
            el.textContent = current + suffix;
          }, 40);
        });

        statsObs.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    statsObs.observe(statsSection);
  }

});
