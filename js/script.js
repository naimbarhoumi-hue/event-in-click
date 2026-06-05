/* ============================================
   EVENT IN CLICK — Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ---- Année dynamique ---- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Vidéo de fond du hero : afficher seulement si le fichier existe ---- */
  var heroVideo = document.querySelector('.hero-video');
  if (heroVideo) {
    heroVideo.addEventListener('loadeddata', function () {
      if (heroVideo.readyState >= 2) heroVideo.classList.add('ready');
    });
    /* Si la vidéo ne se charge pas (fichier absent), le fond doré reste visible */
    heroVideo.addEventListener('error', function () {
      heroVideo.style.display = 'none';
    });
    var src = heroVideo.querySelector('source');
    if (src) {
      src.addEventListener('error', function () { heroVideo.style.display = 'none'; });
    }
  }


  /* ---- Navbar au scroll ---- */
  var navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  });

  /* ---- Menu mobile ---- */
  var toggle = document.querySelector('.nav-toggle');
  var mobileMenu = document.getElementById('mobileMenu');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', function () {
      toggle.classList.toggle('active');
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.classList.remove('active');
        mobileMenu.classList.remove('open');
      });
    });
  }

  /* ---- Scroll fluide ---- */
  document.querySelectorAll('[data-scroll]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = document.getElementById(btn.getAttribute('data-scroll'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ---- Apparition au scroll ---- */
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.fade-in').forEach(function (el) { observer.observe(el); });

  /* ---- Compteurs animés ---- */
  var counted = false;
  function animateCounters() {
    document.querySelectorAll('.stat-num').forEach(function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 1600, startTime = null;
      function step(ts) {
        if (!startTime) startTime = ts;
        var p = Math.min((ts - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }
  var statsSection = document.querySelector('.stats');
  if (statsSection) {
    var statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !counted) { counted = true; animateCounters(); }
      });
    }, { threshold: 0.4 });
    statObserver.observe(statsSection);
  }

  var currentLang = 'fr';

  /* ---- Galerie : chargement dynamique depuis le CMS ---- */
  var galleryGrid = document.getElementById('galleryGrid');

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* Extrait l'identifiant d'une vidéo YouTube depuis n'importe quel format de lien */
  function youtubeId(url) {
    var m = String(url || '').match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([A-Za-z0-9_-]{11})/);
    return m ? m[1] : '';
  }

  function categoryLabel(cat) {
    var dict = TRANSLATIONS[currentLang] || TRANSLATIONS.fr;
    if (cat === 'corporate') return dict.gal_f_corp;
    if (cat === 'prive') return dict.gal_f_priv;
    if (cat === 'culturel') return dict.gal_f_cult;
    return cat;
  }

  function renderGallery(items) {
    if (!galleryGrid || !items || !items.length) return;
    var html = '';
    items.forEach(function (it) {
      var tall = it.grande ? ' tall' : '';
      var cat = it.categorie || 'corporate';
      var titre = escapeHtml(it.titre);
      var media;
      if (it.type_media === 'video' && youtubeId(it.video_youtube)) {
        var vid = youtubeId(it.video_youtube);
        media = '<div class="gi-video"><iframe src="https://www.youtube-nocookie.com/embed/' + vid +
                '" title="' + titre + '" frameborder="0" loading="lazy" ' +
                'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ' +
                'allowfullscreen></iframe></div>';
      } else {
        var src = it.photo || '';
        media = '<img class="gi-photo" src="' + escapeHtml(src) + '" alt="' + titre + '" loading="lazy">';
      }
      html += '<figure class="gallery-item' + tall + '" data-cat="' + escapeHtml(cat) + '">' +
                media +
                '<div class="gi-overlay"><span class="gi-cat">' + escapeHtml(categoryLabel(cat)) +
                '</span><h4>' + titre + '</h4></div>' +
              '</figure>';
    });
    galleryGrid.innerHTML = html;
    bindFilters();
  }

  /* Charge le fichier géré par le CMS. En cas d'échec (ouverture directe
     du fichier sans serveur), le contenu de secours déjà dans la page reste affiché. */
  fetch('content/realisations.json', { cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (data) {
      if (data && data.items && data.items.length) renderGallery(data.items);
    })
    .catch(function () { /* on garde le contenu de secours */ });

  /* ---- Galerie : filtres (re-liables après chargement dynamique) ---- */
  var filterBtns = document.querySelectorAll('.filter-btn');

  function bindFilters() {
    var galleryItems = document.querySelectorAll('.gallery-item');
    filterBtns.forEach(function (btn) {
      btn.onclick = function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var filter = btn.getAttribute('data-filter');
        galleryItems.forEach(function (item) {
          var show = (filter === 'all' || item.getAttribute('data-cat') === filter);
          item.classList.toggle('hidden', !show);
        });
      };
    });
  }
  bindFilters();

  /* ---- Système multilingue ---- */
  function applyLanguage(lang) {
    if (!TRANSLATIONS[lang]) return;
    currentLang = lang;
    var dict = TRANSLATIONS[lang];

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-ph');
      if (dict[key] !== undefined) el.setAttribute('placeholder', dict[key]);
    });

    var html = document.documentElement;
    html.setAttribute('lang', lang);
    if (lang === 'ar') {
      html.setAttribute('dir', 'rtl');
      document.body.classList.add('rtl');
    } else {
      html.setAttribute('dir', 'ltr');
      document.body.classList.remove('rtl');
    }

    document.querySelectorAll('.lang-btn').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-lang') === lang);
    });

    try { localStorage.setItem('eic_lang', lang); } catch (e) {}
  }

  document.querySelectorAll('.lang-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyLanguage(btn.getAttribute('data-lang'));
    });
  });

  /* Restaurer la langue choisie */
  var saved = 'fr';
  try { saved = localStorage.getItem('eic_lang') || 'fr'; } catch (e) {}
  if (saved !== 'fr') applyLanguage(saved);

  /* ---- Validation + envoi du formulaire (Formspree) ---- */
  var form = document.getElementById('contactForm');
  var feedback = document.getElementById('formFeedback');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var dict = TRANSLATIONS[currentLang];
      var valid = true;
      form.querySelectorAll('[required]').forEach(function (field) {
        field.classList.remove('error');
        if (!field.value.trim()) { field.classList.add('error'); valid = false; }
      });
      var emailField = document.getElementById('email');
      if (emailField && emailField.value.trim()) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value.trim())) {
          emailField.classList.add('error'); valid = false;
        }
      }
      if (!valid) {
        feedback.style.color = '#d08a8a';
        feedback.textContent = dict.form_err;
        return;
      }

      var action = form.getAttribute('action') || '';
      /* Si Formspree n'est pas encore configuré, on affiche juste le message de confirmation */
      if (action.indexOf('VOTRE_ID_FORMSPREE') !== -1 || action === '') {
        feedback.style.color = 'var(--gold-light)';
        feedback.textContent = dict.form_ok;
        form.reset();
        return;
      }

      /* Envoi réel à Formspree */
      feedback.style.color = 'var(--gold-light)';
      feedback.textContent = dict.form_sending;
      var data = new FormData(form);
      fetch(action, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } })
        .then(function (response) {
          if (response.ok) {
            feedback.style.color = 'var(--gold-light)';
            feedback.textContent = dict.form_ok;
            form.reset();
          } else {
            feedback.style.color = '#d08a8a';
            feedback.textContent = dict.form_error_send;
          }
        })
        .catch(function () {
          feedback.style.color = '#d08a8a';
          feedback.textContent = dict.form_error_send;
        });
    });
  }

});
