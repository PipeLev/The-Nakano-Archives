/**
 * Estadísticas Locales - The Nakano Archives v1.1.0
 * Calcula totales de imágenes, canciones, fondos y favoritos
 */

class StatsManager {
  constructor() {
    this.init();
  }

  init() {
    this.updateStats();
    this.setupFavoritesListener();
  }

  updateStats() {
    const totalImages = document.querySelectorAll('.gallery-item img, .profile-main-image, .card-image, .modal-gallery-grid img').length;
    const totalSongs = document.querySelectorAll('.cancion-card').length;
    const totalWallpapers = document.querySelectorAll('.galeria-preview-item img').length;
    const totalFavorites = window.favoritesManager ? window.favoritesManager.getTotalCount() : 0;

    this.injectStatsBar(totalImages, totalSongs, totalWallpapers, totalFavorites);
  }

  injectStatsBar(images, songs, wallpapers, favorites) {
    let statsBar = document.querySelector('.stats-bar');

    if (!statsBar) {
      statsBar = document.createElement('div');
      statsBar.className = 'stats-bar';
      const footer = document.querySelector('.main-footer');
      if (footer) {
        footer.parentNode.insertBefore(statsBar, footer);
      }
    }

    statsBar.innerHTML = `
      <div class="stats-container">
        <div class="stat-badge">
          <span class="stat-icon">🖼️</span>
          <span class="stat-value">${images}</span>
          <span class="stat-name">Imágenes</span>
        </div>
        <div class="stat-badge">
          <span class="stat-icon">🎵</span>
          <span class="stat-value">${songs}</span>
          <span class="stat-name">Canciones</span>
        </div>
        <div class="stat-badge">
          <span class="stat-icon">🖼</span>
          <span class="stat-value">${wallpapers}</span>
          <span class="stat-name">Fondos</span>
        </div>
        <div class="stat-badge">
          <span class="stat-icon">⭐</span>
          <span class="stat-value">${favorites}</span>
          <span class="stat-name">Favoritos</span>
        </div>
      </div>
    `;
  }

  setupFavoritesListener() {
    window.addEventListener('favorites:updated', () => {
      this.updateStats();
    });

    const originalAdd = window.favoritesManager?.add;
    const originalRemove = window.favoritesManager?.remove;

    if (window.favoritesManager) {
      const self = this;
      window.favoritesManager.add = function(...args) {
        const result = originalAdd.apply(this, args);
        self.updateStats();
        window.dispatchEvent(new CustomEvent('favorites:updated'));
        return result;
      };
      window.favoritesManager.remove = function(...args) {
        const result = originalRemove.apply(this, args);
        self.updateStats();
        window.dispatchEvent(new CustomEvent('favorites:updated'));
        return result;
      };
    }
  }
}

export default StatsManager;