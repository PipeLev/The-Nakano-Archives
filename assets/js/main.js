/**
 * The Nakano Archives v1.1.0 - Archivo principal
 * Inicializa todos los módulos del sitio
 * Gotoubun no Hanayome Fan Project
 */

import Navigation from './navigation.js';
import ScrollAnimator from './scroll.js';
import ThemeManager from './theme.js';
import AnimationController from './animations.js';
import FavoritesManager from './favorites.js';
import GlobalSearch from './search.js';
import Lightbox from './lightbox.js';
import StatsManager from './stats.js';
import EasterEggs from './eastereggs.js';

import PersonajesPage from './personajes.js';
import GaleriaPage from './galeria.js';
import MusicaPage from './musica.js';
import CuriosidadesPage from './curiosidades.js';

class App {
  constructor() {
    this.initialized = false;
    this.modules = {};
    this.version = '1.1.0';
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.boot());
    } else {
      this.boot();
    }
  }

  boot() {
    if (this.initialized) {
      console.warn('⚠️ The Nakano Archives ya está inicializado.');
      return;
    }

    console.log(`🌸 The Nakano Archives v${this.version} - Iniciando...`);

    try {
      this.initCoreModules();
      this.initPageModules();
      this.setupGlobalErrorHandling();
      this.setupScrollTopButton();
      this.setupFavoritesIntegration();

      this.initialized = true;
      console.log('✅ The Nakano Archives listo.');
    } catch (error) {
      console.error('❌ Error crítico al inicializar:', error);
    }
  }

  initCoreModules() {
    this.modules.navigation = new Navigation();
    this.modules.scrollAnimator = new ScrollAnimator();
    this.modules.themeManager = new ThemeManager();
    this.modules.animationController = new AnimationController();
    this.modules.favoritesManager = window.favoritesManager || new FavoritesManager();
    this.modules.globalSearch = new GlobalSearch();
    this.modules.lightbox = new Lightbox();
    this.modules.statsManager = new StatsManager();
    this.modules.easterEggs = new EasterEggs();

    window.app = this;
    window.lightbox = this.modules.lightbox;
  }

  initPageModules() {
    const path = window.location.pathname;

    try {
      if (path.includes('personajes')) {
        this.modules.personajes = new PersonajesPage();
      } else if (path.includes('galeria')) {
        this.modules.galeria = new GaleriaPage();
      } else if (path.includes('musica')) {
        this.modules.musica = new MusicaPage();
      } else if (path.includes('curiosidades')) {
        this.modules.curiosidades = new CuriosidadesPage();
      }
    } catch (error) {
      console.warn('⚠️ Error al cargar módulo de página:', error.message);
    }
  }

  setupGlobalErrorHandling() {
    window.addEventListener('error', (event) => {
      if (event.filename && event.filename.includes('assets/js/')) {
        console.error('❌ Error en módulo:', {
          mensaje: event.message,
          archivo: event.filename,
          linea: event.lineno
        });
      }
    });

    window.addEventListener('unhandledrejection', (event) => {
      console.error('❌ Promesa no manejada:', event.reason);
    });
  }

  setupScrollTopButton() {
    const btn = document.createElement('button');
    btn.className = 'scroll-top-btn';
    btn.innerHTML = '↑';
    btn.setAttribute('aria-label', 'Volver arriba');
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  setupFavoritesIntegration() {
    document.addEventListener('click', (e) => {
      const favBtn = e.target.closest('.fav-btn');
      if (!favBtn) return;

      e.preventDefault();
      e.stopPropagation();

      const type = favBtn.dataset.favType;
      const id = favBtn.dataset.favId;

      if (type && id) {
        const isFav = window.favoritesManager.toggle(type, id);
        if (isFav) {
          favBtn.classList.add('active');
        } else {
          favBtn.classList.remove('active');
        }
        window.dispatchEvent(new CustomEvent('favorites:updated'));
      }
    });
  }
}

const app = new App();
export default app;