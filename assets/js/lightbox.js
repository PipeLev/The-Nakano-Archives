/**
 * Lightbox Profesional - The Nakano Archives v1.1.0
 * Pantalla completa, navegación, zoom, teclado
 */

class Lightbox {
  constructor() {
    this.images = [];
    this.currentIndex = 0;
    this.isOpen = false;
    this.scale = 1;
    this.lightbox = null;
    this.init();
  }

  init() {
    this.createLightboxElement();
    this.setupEvents();
    this.collectImages();
  }

  createLightboxElement() {
    const lightboxHTML = `
      <div class="professional-lightbox" id="professionalLightbox" aria-hidden="true">
        <div class="lightbox-backdrop"></div>
        <button class="lightbox-close" aria-label="Cerrar">&times;</button>
        <button class="lightbox-prev" aria-label="Anterior">&#10094;</button>
        <button class="lightbox-next" aria-label="Siguiente">&#10095;</button>
        <div class="lightbox-zoom-controls">
          <button class="lightbox-zoom-in" aria-label="Acercar">+</button>
          <button class="lightbox-zoom-out" aria-label="Alejar">−</button>
          <button class="lightbox-zoom-reset" aria-label="Restablecer zoom">1:1</button>
        </div>
        <div class="lightbox-image-container">
          <img src="" alt="" class="lightbox-main-image" id="lightboxMainImage">
        </div>
        <div class="lightbox-counter"><span id="lightboxCurrent">1</span> / <span id="lightboxTotal">1</span></div>
      </div>
    `;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = lightboxHTML;
    document.body.appendChild(tempDiv.firstElementChild);

    this.lightbox = document.getElementById('professionalLightbox');
    this.mainImage = document.getElementById('lightboxMainImage');
    this.currentSpan = document.getElementById('lightboxCurrent');
    this.totalSpan = document.getElementById('lightboxTotal');
    this.imageContainer = this.lightbox.querySelector('.lightbox-image-container');
  }

  setupEvents() {
    if (!this.lightbox) return;

    this.lightbox.querySelector('.lightbox-close').addEventListener('click', () => this.close());
    this.lightbox.querySelector('.lightbox-prev').addEventListener('click', () => this.prev());
    this.lightbox.querySelector('.lightbox-next').addEventListener('click', () => this.next());
    this.lightbox.querySelector('.lightbox-backdrop').addEventListener('click', () => this.close());
    this.lightbox.querySelector('.lightbox-zoom-in').addEventListener('click', () => this.zoom(0.25));
    this.lightbox.querySelector('.lightbox-zoom-out').addEventListener('click', () => this.zoom(-0.25));
    this.lightbox.querySelector('.lightbox-zoom-reset').addEventListener('click', () => this.resetZoom());

    document.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;
      switch(e.key) {
        case 'Escape': this.close(); break;
        case 'ArrowLeft': this.prev(); break;
        case 'ArrowRight': this.next(); break;
        case '+':
        case '=': this.zoom(0.25); break;
        case '-': this.zoom(-0.25); break;
        case '0': this.resetZoom(); break;
      }
    });

    this.mainImage.addEventListener('wheel', (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
        this.zoom(e.deltaY > 0 ? -0.1 : 0.1);
      }
    });
  }

  collectImages() {
    this.images = [];
    const imgs = document.querySelectorAll('.gallery-item img, .galeria-preview-item img, .modal-gallery-grid img');
    imgs.forEach(img => {
      if (!this.images.find(i => i.src === img.src)) {
        this.images.push({ src: img.src, alt: img.alt || '' });
      }
    });
  }

  open(index = 0) {
    this.collectImages();
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
    this.mainImage.src = img.src;
    this.mainImage.alt = img.alt;
    this.currentSpan.textContent = this.currentIndex + 1;
    this.totalSpan.textContent = this.images.length;
  }

  prev() {
    if (this.images.length === 0) return;
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.resetZoom();
    this.updateImage();
  }

  next() {
    if (this.images.length === 0) return;
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.resetZoom();
    this.updateImage();
  }

  zoom(amount) {
    this.scale = Math.max(0.5, Math.min(3, this.scale + amount));
    this.mainImage.style.transform = `scale(${this.scale})`;
  }

  resetZoom() {
    this.scale = 1;
    this.mainImage.style.transform = 'scale(1)';
  }
}

export default Lightbox;