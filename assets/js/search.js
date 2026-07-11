import { $$, debounce } from './utils.js';

/**
 * Buscador Global - The Nakano Archives v1.1.0
 * Búsqueda en tiempo real de personajes, canciones, imágenes y fondos
 */

class GlobalSearch {
  constructor() {
    this.searchInput = null;
    this.searchResults = null;
    this.isOpen = false;
    this.searchData = [];
    this.init();
  }

  init() {
    this.createSearchUI();
    this.collectSearchData();
    this.setupEvents();
  }

  createSearchUI() {
    const searchHTML = `
      <div class="global-search">
        <button class="search-toggle-btn" aria-label="Abrir buscador" id="searchToggle">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </button>
        <div class="search-overlay" id="searchOverlay">
          <div class="search-modal">
            <div class="search-header">
              <input type="text" class="search-global-input" id="searchGlobalInput" placeholder="Buscar personajes, canciones, imágenes...">
              <button class="search-close-btn" id="searchClose" aria-label="Cerrar buscador">&times;</button>
            </div>
            <div class="search-results" id="searchResults">
              <p class="search-hint">Escribe para comenzar a buscar...</p>
            </div>
          </div>
        </div>
      </div>
    `;

    const headerContainer = document.querySelector('.header-container');
    if (headerContainer) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = searchHTML;
      const searchElement = tempDiv.firstElementChild;
      headerContainer.appendChild(searchElement);
    }

    this.searchInput = document.getElementById('searchGlobalInput');
    this.searchResults = document.getElementById('searchResults');
    this.searchOverlay = document.getElementById('searchOverlay');
    this.searchToggle = document.getElementById('searchToggle');
    this.searchClose = document.getElementById('searchClose');
  }

  collectSearchData() {
    this.searchData = [];

    const personajes = $$('.personaje-card, .personaje-profile');
    personajes.forEach(p => {
      const name = p.querySelector('h2, h3')?.textContent || '';
      const desc = p.querySelector('p')?.textContent || '';
      const img = p.querySelector('img')?.src || '';
      const link = p.querySelector('a')?.href || p.id || '';
      this.searchData.push({
        type: 'personaje',
        name: name,
        description: desc.substring(0, 80),
        image: img,
        link: link,
        keywords: name.toLowerCase() + ' ' + desc.toLowerCase()
      });
    });

    const canciones = $$('.cancion-card');
    canciones.forEach(c => {
      const name = c.querySelector('h3')?.textContent || '';
      const desc = c.querySelector('p')?.textContent || '';
      const type = c.querySelector('.cancion-type')?.textContent || '';
      this.searchData.push({
        type: 'cancion',
        name: name,
        description: desc.substring(0, 80),
        image: c.querySelector('img')?.src || '',
        link: '#',
        keywords: name.toLowerCase() + ' ' + desc.toLowerCase() + ' ' + type.toLowerCase()
      });
    });

    const imagenes = $$('.gallery-item img, .galeria-preview-item img');
    imagenes.forEach(img => {
      const alt = img.alt || '';
      const src = img.src || '';
      this.searchData.push({
        type: 'imagen',
        name: alt,
        description: '',
        image: src,
        link: src,
        keywords: alt.toLowerCase()
      });
    });
  }

  setupEvents() {
    if (!this.searchToggle || !this.searchOverlay || !this.searchClose || !this.searchInput) return;

    this.searchToggle.addEventListener('click', () => this.open());

    this.searchClose.addEventListener('click', () => this.close());

    this.searchOverlay.addEventListener('click', (e) => {
      if (e.target === this.searchOverlay) this.close();
    });

    const debouncedSearch = debounce((term) => this.performSearch(term), 200);
    this.searchInput.addEventListener('input', (e) => debouncedSearch(e.target.value));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.close();
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.open();
      }
    });
  }

  open() {
    this.isOpen = true;
    this.searchOverlay.classList.add('active');
    this.searchInput.value = '';
    this.searchResults.innerHTML = '<p class="search-hint">Escribe para comenzar a buscar...</p>';
    document.body.style.overflow = 'hidden';
    setTimeout(() => this.searchInput.focus(), 100);
    this.collectSearchData();
  }

  close() {
    this.isOpen = false;
    this.searchOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  performSearch(term) {
    if (!term || term.trim().length < 2) {
      this.searchResults.innerHTML = '<p class="search-hint">Escribe al menos 2 caracteres...</p>';
      return;
    }

    const query = term.toLowerCase().trim();
    const results = this.searchData.filter(item => item.keywords.includes(query));

    if (results.length === 0) {
      this.searchResults.innerHTML = '<p class="search-no-results">🌸 No se encontraron resultados</p>';
      return;
    }

    const limitedResults = results.slice(0, 12);
    const typeLabels = { personaje: '👩 Personaje', cancion: '🎵 Canción', imagen: '🖼 Imagen' };

    this.searchResults.innerHTML = limitedResults.map(item => `
      <div class="search-result-item" data-type="${item.type}">
        ${item.image ? `<img src="${item.image}" alt="${item.name}" class="search-result-img" loading="lazy">` : ''}
        <div class="search-result-info">
          <span class="search-result-type">${typeLabels[item.type] || item.type}</span>
          <h4 class="search-result-name">${item.name || 'Sin nombre'}</h4>
          ${item.description ? `<p class="search-result-desc">${item.description}</p>` : ''}
        </div>
      </div>
    `).join('');
  }
}

export default GlobalSearch;