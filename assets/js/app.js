/**
 * The Nakano Archives v1.2.0 — app.js
 * Orquestador principal. Importa componentes y páginas.
 */
import { Lightbox, FavoritesManager, initModals } from './components.js';
import { initPersonajesPage, initGaleriaPage, initMusicaPage, initCuriosidadesPage, initAcercaPage } from './pages.js';

class App {
  constructor() {
    this.initTheme();
    this.initNavigation();
    this.initScrollEffects();
    this.initSearch();
    this.initGlobalComponents();
    this.initEasterEggs();
    this.routePage();
  }

  /* ---------- TEMA ---------- */
  initTheme() {
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        const html = document.documentElement;
        const isDark = html.classList.toggle('dark');
        localStorage.setItem('nakano-theme', isDark ? 'dark' : 'light');
        toggle.innerHTML = isDark ? '☀️' : '🌙';
        toggle.setAttribute('aria-label', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
      });
      // Sincronizar icono con el estado actual (el script inline ya aplicó la clase)
      const isDark = document.documentElement.classList.contains('dark');
      toggle.innerHTML = isDark ? '☀️' : '🌙';
    }
  }

  /* ---------- NAVEGACIÓN ---------- */
  initNavigation() {
    const hamburger = document.getElementById('hamburgerBtn');
    const nav = document.getElementById('primaryNav');
    const overlay = document.getElementById('navOverlay');
    if (!hamburger || !nav) return;

    const closeMenu = () => {
      nav.classList.remove('open');
      hamburger.classList.remove('active');
      overlay?.classList.remove('visible');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    hamburger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      overlay?.classList.toggle('visible', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    overlay?.addEventListener('click', closeMenu);

    // Cerrar al hacer clic en un enlace
    nav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Scroll effect
    window.addEventListener('scroll', () => {
      const header = document.getElementById('header');
      if (header) {
        header.classList.toggle('scrolled', window.scrollY > 50);
      }
    }, { passive: true });

    // Highlight active link
    const currentPath = window.location.pathname;
    nav.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href && currentPath.endsWith(href.replace(/^\.\.\//, ''))) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  /* ---------- SCROLL TO TOP ---------- */
  initScrollEffects() {
    const btn = document.getElementById('scrollTopBtn');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // Intersection Observer para animaciones reveal
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => observer.observe(el));
  }

  /* ---------- BUSCADOR GLOBAL ---------- */
  initSearch() {
    const overlay = document.getElementById('searchOverlay');
    const input = document.getElementById('searchGlobalInput');
    const resultsDiv = document.getElementById('searchResults');
    const toggleBtn = document.getElementById('searchToggle');
    const closeBtn = document.getElementById('searchCloseBtn');
    if (!overlay || !input) return;

    let searchData = [];

    function collectData() {
      searchData = [];
      document.querySelectorAll('.personaje-preview-card, .personaje-profile').forEach(el => {
        const name = el.querySelector('h2, h3')?.textContent || '';
        const desc = el.querySelector('p')?.textContent || '';
        const img = el.querySelector('img')?.src || '';
        searchData.push({ type: 'personaje', name, desc: desc.slice(0, 80), img });
      });
      document.querySelectorAll('.cancion-card').forEach(el => {
        const name = el.querySelector('h3')?.textContent || '';
        const desc = el.querySelector('.cancion-type')?.textContent || '';
        const img = el.querySelector('img')?.src || '';
        searchData.push({ type: 'cancion', name, desc, img });
      });
      document.querySelectorAll('.gallery-item img, .galeria-preview-item img').forEach(img => {
        searchData.push({ type: 'imagen', name: img.alt || '', desc: '', img: img.src });
      });
      // Eliminar duplicados
      searchData = searchData.filter((v, i, a) => a.findIndex(t => t.name === v.name && t.type === v.type) === i);
    }

    function open() {
      collectData();
      overlay.classList.add('active');
      input.value = '';
      resultsDiv.innerHTML = '<p class="search-hint">Escribe al menos 2 caracteres para buscar...</p>';
      input.focus();
      document.body.style.overflow = 'hidden';
    }

    function close() {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    toggleBtn?.addEventListener('click', open);
    closeBtn?.addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('active')) close();
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        open();
      }
    });

    input.addEventListener('input', () => {
      const query = input.value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
      if (query.length < 2) {
        resultsDiv.innerHTML = '<p class="search-hint">Escribe al menos 2 caracteres...</p>';
        return;
      }
      const filtered = searchData.filter(item => {
        const name = (item.name || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        const desc = (item.desc || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        return name.includes(query) || desc.includes(query);
      }).slice(0, 12);

      if (!filtered.length) {
        resultsDiv.innerHTML = '<p class="search-no-results">🌸 No se encontraron resultados</p>';
        return;
      }

      resultsDiv.innerHTML = filtered.map(item => `
        <div class="search-result-item">
          ${item.img ? `<img src="${item.img}" alt="${item.name}" class="search-result-img" loading="lazy">` : ''}
          <div>
            <div class="search-result-name">${item.name || 'Sin nombre'}</div>
            <div class="search-result-desc">${item.type}${item.desc ? ' · ' + item.desc : ''}</div>
          </div>
        </div>
      `).join('');
    });
  }

  /* ---------- COMPONENTES GLOBALES ---------- */
  initGlobalComponents() {
    // Lightbox
    window.lightbox = new Lightbox();

    // Favoritos
    const favManager = new FavoritesManager();
    favManager.initUI();
    window.favManager = favManager;

    // Modales
    initModals();

    // Estadísticas
    this.updateStats(favManager);
    setInterval(() => this.updateStats(favManager), 2000);
  }

  updateStats(favManager) {
    const totalImg = document.querySelectorAll('.gallery-item img').length + document.querySelectorAll('.profile-main-image').length;
    const totalSongs = document.querySelectorAll('.cancion-card').length;
    const totalFavs = favManager.getTotal();

    const setStat = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };
    setStat('statImages', totalImg);
    setStat('statSongs', totalSongs);
    setStat('statFavs', totalFavs);
  }

  /* ---------- EASTER EGGS ---------- */
  initEasterEggs() {
    // Pétalos
    setInterval(() => {
      if (Math.random() < 0.3) {
        const petal = document.createElement('div');
        petal.className = 'sakura-petal';
        petal.textContent = '🌸';
        petal.style.left = Math.random() * 100 + 'vw';
        petal.style.animationDuration = (Math.random() * 8 + 6) + 's';
        document.body.appendChild(petal);
        petal.addEventListener('animationend', () => petal.remove());
      }
    }, 3000);

    // Konami Code
    const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let keys = [];
    document.addEventListener('keydown', (e) => {
      keys.push(e.key);
      keys = keys.slice(-10);
      if (keys.join(',') === konami.join(',')) {
        for (let i = 0; i < 30; i++) {
          setTimeout(() => {
            const petal = document.createElement('div');
            petal.className = 'sakura-petal';
            petal.textContent = ['🌸','💮','🏵️','💖','✨'][Math.floor(Math.random()*5)];
            petal.style.left = Math.random() * 100 + 'vw';
            petal.style.animationDuration = (Math.random() * 5 + 4) + 's';
            document.body.appendChild(petal);
            petal.addEventListener('animationend', () => petal.remove());
          }, i * 80);
        }
      }
    });

    // Click en versión
    let clickCount = 0;
    const ver = document.querySelector('.footer-version');
    if (ver) {
      ver.addEventListener('click', () => {
        clickCount++;
        if (clickCount >= 5) {
          clickCount = 0;
          const original = ver.textContent;
          ver.textContent = '🌸 Las quintillizas te saludan 🌸';
          setTimeout(() => { ver.textContent = original; }, 3000);
        }
      });
    }
  }

  /* ---------- ENRUTADOR ---------- */
  routePage() {
    const path = window.location.pathname;
    if (path.includes('personajes')) initPersonajesPage();
    else if (path.includes('galeria')) initGaleriaPage();
    else if (path.includes('musica')) initMusicaPage();
    else if (path.includes('curiosidades')) initCuriosidadesPage();
    else if (path.includes('acerca')) initAcercaPage();
  }
}

// Arranque
document.addEventListener('DOMContentLoaded', () => {
  new App();
});