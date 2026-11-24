(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // A short cinematic brand reveal, shown once per tab/session and always skippable.
  const intro = document.getElementById('startupIntro');
  let introSeen = false;
  try { introSeen = sessionStorage.getItem('adwinIntroSeen') === '1'; } catch (_) {}
  if (intro && !reduceMotion && !introSeen) {
    document.documentElement.classList.add('intro-playing');
    document.body.classList.add('intro-lock');
    const skip = document.getElementById('introSkip');
    let finished = false;
    const finishIntro = () => {
      if (finished) return;
      finished = true;
      try { sessionStorage.setItem('adwinIntroSeen', '1'); } catch (_) {}
      document.documentElement.classList.remove('intro-playing');
      document.body.classList.remove('intro-lock');
      intro.classList.add('intro-finished');
      window.setTimeout(() => intro.remove(), 650);
      document.removeEventListener('keydown', onIntroKey);
    };
    const onIntroKey = (event) => { if (event.key === 'Escape') finishIntro(); };
    skip?.addEventListener('click', finishIntro);
    document.addEventListener('keydown', onIntroKey);
    window.setTimeout(finishIntro, 3300);
  } else if (intro) {
    intro.remove();
  }

  if (reduceMotion) return;

  const groups = [
    ['.hero-title-col', '.hero-desc-col', '.hero-media-wrapper'],
    ['.section-header-split', '.search-filter-card', '.grid-section-header'],
    ['.property-card', '.agent-card', '.inv-horizontal-card'],
    ['.trust-row', '.cta-banner-card', '.footer-grid > *']
  ];

  let order = 0;
  groups.forEach((selectors) => {
    document.querySelectorAll(selectors.join(',')).forEach((el, i) => {
      if (el.closest('.modal-backdrop')) return;
      el.classList.add('motion-reveal');
      el.style.setProperty('--motion-delay', `${Math.min(i * 75, 360)}ms`);
      order++;
    });
  });

  if ('IntersectionObserver' in window) {
    document.documentElement.classList.add('motion-ready');
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('motion-visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -45px 0px' });
    document.querySelectorAll('.motion-reveal').forEach((el) => observer.observe(el));
  } else {
    document.querySelectorAll('.motion-reveal').forEach((el) => el.classList.add('motion-visible'));
  }

  // Pointer-based, restrained 3D response on large-screen cards.
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.property-card, .agent-card, .inv-horizontal-card').forEach((card) => {
      card.classList.add('motion-tilt');
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty('--tilt-x', `${x * 3.5}deg`);
        card.style.setProperty('--tilt-y', `${y * -3.5}deg`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
      });
    });
  }

  // Slim reading-progress indicator integrated into the existing sticky header.
  let ticking = false;
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? window.scrollY / max : 0;
    document.documentElement.style.setProperty('--page-progress', progress.toFixed(4));
    document.documentElement.classList.toggle('has-scrolled', window.scrollY > 16);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateProgress);
    }
  }, { passive: true });
  updateProgress();
})();
