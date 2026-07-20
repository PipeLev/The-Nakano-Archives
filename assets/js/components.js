/**
 * The Nakano Archives v1.2.0 — components.js
 * Componentes reutilizables: Lightbox, FavoritesManager, Modals
 */

/* ---------- Lightbox Profesional ---------- */
export class Lightbox {
  constructor() {
    this.images = [];
    this.currentIndex = 0;
    this.isOpen = false;
    this.scale = 1;
    this.lightbox = document.getElementById('professionalLightbox');
    this.mainImage = document.getElementById('lightboxMainImage');
    this.currentSpan = document.getElementById('lightboxCurrent');
    this.totalSpan = document.getElementById('lightboxTotal');
    if (!this.lightbox) return;
    this.collectImages();
    this.bindEvents();
  }

  collectImages() {
    const imgs = document.querySelectorAll('.gallery-item img, .galeria-preview-item img, .modal-gallery-grid img');
    this.images = [];
    imgs.forEach(img => {
      if (!this.images.find(i => i.src === img.src)) {
        this.images.push({ src: img.src, alt: img.alt || '' });
      }
    });
    if (this.totalSpan) this.totalSpan.textContent = this.images.length;
  }

  bindEvents() {
    document.addEventListener('click', (e) => {
      const img = e.target.closest('.gallery-item img, .galeria-preview-item img, .modal-gallery-grid img');
      if (img) {
        e.preventDefault();
        this.collectImages();
        const index = this.images.findIndex(i => i.src === img.src);
        this.open(index >= 0 ? index : 0);
      }
      if (e.target.closest('.lightbox-close') || e.target === this.lightbox?.querySelector('.lightbox-backdrop')) {
        this.close();
      }
      if (e.target.closest('.lightbox-prev')) this.prev();
      if (e.target.closest('.lightbox-next')) this.next();
      if (e.target.closest('.lightbox-zoom-in')) this.zoom(0.25);
      if (e.target.closest('.lightbox-zoom-out')) this.zoom(-0.25);
      if (e.target.closest('.lightbox-zoom-reset')) this.resetZoom();
    });

    document.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;
      switch(e.key) {
        case 'Escape': this.close(); break;
        case 'ArrowLeft': this.prev(); break;
        case 'ArrowRight': this.next(); break;
        case '+': case '=': this.zoom(0.25); break;
        case '-': this.zoom(-0.25); break;
        case '0': this.resetZoom(); break;
      }
    });

    this.mainImage?.addEventListener('wheel', (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
        this.zoom(e.deltaY > 0 ? -0.1 : 0.1);
      }
    });
  }

  open(index = 0) {
    if (this.images.length === 0) return;
    this.currentIndex = Math.max(0, Math.min(index, this.images.length - 1));
    this.isOpen = true;
    this.resetZoom();
    this.updateImage();
    this.lightbox.classList.add('active');
    this.lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.isOpen = false;
    this.lightbox.classList.remove('active');
    this.lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    this.resetZoom();
  }

  updateImage() {
    const img = this.images[this.currentIndex];
    if (this.mainImage) {
      this.mainImage.src = img.src;
      this.mainImage.alt = img.alt;
    }
    if (this.currentSpan) this.currentSpan.textContent = this.currentIndex + 1;
    if (this.totalSpan) this.totalSpan.textContent = this.images.length;
  }

  prev() { if (this.images.length) { this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length; this.resetZoom(); this.updateImage(); } }
  next() { if (this.images.length) { this.currentIndex = (this.currentIndex + 1) % this.images.length; this.resetZoom(); this.updateImage(); } }

  zoom(amount) {
    this.scale = Math.max(0.5, Math.min(3, this.scale + amount));
    if (this.mainImage) this.mainImage.style.transform = `scale(${this.scale})`;
  }
  resetZoom() {
    this.scale = 1;
    if (this.mainImage) this.mainImage.style.transform = 'scale(1)';
  }
}

/* ---------- Favoritos ---------- */
export class FavoritesManager {
  constructor() {
    this.storageKey = 'nakano-favs-v2';
    this.data = this.load();
    this.updateStats();
  }

  load() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : { images: [], songs: [] };
    } catch { return { images: [], songs: [] }; }
  }

  save() {
    try { localStorage.setItem(this.storageKey, JSON.stringify(this.data)); } catch {}
    this.updateStats();
  }

  toggle(type, id) {
    const arr = this.data[type] || [];
    const index = arr.findIndex(item => (typeof item === 'string' ? item === id : item.id === id));
    if (index > -1) {
      arr.splice(index, 1);
      this.save();
      return false;
    } else {
      arr.push({ id, date: new Date().toISOString() });
      this.save();
      return true;
    }
  }

  has(type, id) {
    return (this.data[type] || []).some(item => (typeof item === 'string' ? item === id : item.id === id));
  }

  getAll(type) { return [...(this.data[type] || [])]; }
  getCount(type) { return (this.data[type] || []).length; }
  getTotal() { return this.getCount('images') + this.getCount('songs'); }
  clear(type) { if (type) { this.data[type] = []; } else { this.data = { images: [], songs: [] }; } this.save(); }

  updateStats() {
    const totalEl = document.getElementById('favTotal');
    if (totalEl) totalEl.textContent = this.getTotal();
  }

  initUI() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.fav-btn');
      if (!btn) return;
      e.preventDefault();
      const type = btn.dataset.favType;
      const id = btn.dataset.favId;
      if (type && id) {
        const isNowFav = this.toggle(type, id);
        btn.classList.toggle('active', isNowFav);
        if (isNowFav) {
          btn.innerHTML = '❤️';
        } else {
          btn.innerHTML = '☆';
        }
      }
    });

    // Marcar como activos los existentes
    document.querySelectorAll('.fav-btn').forEach(btn => {
      const type = btn.dataset.favType;
      const id = btn.dataset.favId;
      if (type && id && this.has(type, id)) {
        btn.classList.add('active');
        btn.innerHTML = '❤️';
      }
    });
  }
}

/* ---------- Modales Genéricos ---------- */
export function initModals() {
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-modal]');
    if (trigger) {
      const modalId = trigger.dataset.modal;
      const modal = document.getElementById(modalId);
      if (modal) openModal(modal);
    }
    if (e.target.classList.contains('modal') && e.target.classList.contains('active')) {
      closeActiveModal();
    }
    if (e.target.closest('.modal-close-btn')) {
      closeActiveModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeActiveModal();
  });
}

function openModal(modal) {
  closeActiveModal();
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (firstFocusable) firstFocusable.focus();
  modal._activeModal = true;
  document._activeModalInstance = modal;
}

function closeActiveModal() {
  const modal = document._activeModalInstance;
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    modal._activeModal = false;
    document._activeModalInstance = null;
  }
}