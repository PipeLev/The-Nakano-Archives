import { $, $$, addClass, removeClass } from './utils.js';

/**
 * Maneja la página de música
 * Animaciones, enlaces externos y playlist mejorada con filtros
 */
class MusicaPage {
  constructor() {
    this.pageSection = $('.musica-page-section');
    this.filterButtons = $$('.playlist-filters .filter-btn');
    this.currentFilter = 'all';
    this.init();
  }

  init() {
    if (!this.pageSection) return;

    this.setupCardAnimations();
    this.setupExternalLinks();
    this.setupPlaylistFilters();
    this.setupFavoriteButtons();
  }

  setupCardAnimations() {
    const cards = $$('.cancion-card');

    if (!('IntersectionObserver' in window)) {
      cards.forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -20px 0px'
      }
    );

    cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(35px)';
      card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      observer.observe(card);
    });
  }

  setupExternalLinks() {
    const externalLinks = $$('a[target="_blank"][rel*="noopener"]');

    externalLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const userConfirmed = confirm(
          'Serás redirigido a YouTube. ¿Deseas continuar?'
        );
        if (!userConfirmed) {
          e.preventDefault();
        }
      });
    });
  }

  setupPlaylistFilters() {
    if (this.filterButtons.length === 0) return;

    this.filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filterValue = btn.dataset.filter;
        this.applyFilter(filterValue);

        this.filterButtons.forEach(b => removeClass(b, 'active'));
        addClass(btn, 'active');
      });
    });
  }

  applyFilter(filter) {
    this.currentFilter = filter;
    const cards = $$('.cancion-card');
    let visibleIndex = 0;

    cards.forEach(card => {
      const category = card.dataset.category;

      if (filter === 'all' || category === filter) {
        removeClass(card, 'hidden');
        card.style.animation = 'none';
        card.offsetHeight;
        card.style.animation = `fadeInUp 0.4s ease-out ${visibleIndex * 0.06}s both`;
        visibleIndex++;
      } else {
        addClass(card, 'hidden');
      }
    });
  }

  setupFavoriteButtons() {
    const favButtons = $$('.cancion-card .fav-btn');
    favButtons.forEach(btn => {
      const type = btn.dataset.favType;
      const id = btn.dataset.favId;
      if (type && id && window.favoritesManager && window.favoritesManager.has(type, id)) {
        addClass(btn, 'active');
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new MusicaPage();
});

export default MusicaPage;