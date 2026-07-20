/**
 * The Nakano Archives v1.2.0 — pages.js
 * Lógica específica de cada página
 */

export function initPersonajesPage() {
  const hash = window.location.hash.slice(1);
  if (hash) {
    const target = document.getElementById(hash);
    if (target) {
      setTimeout(() => {
        const headerH = document.getElementById('header')?.offsetHeight || 72;
        window.scrollTo({ top: target.offsetTop - headerH - 30, behavior: 'smooth' });
      }, 300);
    }
  }
  // Animación de perfiles con Intersection Observer
  const profiles = document.querySelectorAll('.personaje-profile');
  if (!profiles.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  profiles.forEach(p => {
    p.style.opacity = '0';
    p.style.transform = 'translateY(40px)';
    p.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    observer.observe(p);
  });
}

export function initGaleriaPage() {
  const filterBtns = document.querySelectorAll('.gallery-filters .filter-btn');
  const items = document.querySelectorAll('.gallery-item');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      let visibleIndex = 0;
      items.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.classList.remove('hidden');
          const img = item.querySelector('img');
          if (img) img.style.opacity = '1';
          item.style.animation = `fadeInUp 0.4s ease ${visibleIndex * 0.05}s both`;
          visibleIndex++;
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // Lazy loading específico con Intersection Observer
  const lazyImgs = document.querySelectorAll('.gallery-item img[loading="lazy"]');
  if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          img.style.opacity = '1';
          imgObserver.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });
    lazyImgs.forEach(img => imgObserver.observe(img));
  }
}

export function initMusicaPage() {
  const filterBtns = document.querySelectorAll('.playlist-filters .filter-btn');
  const cards = document.querySelectorAll('.cancion-card');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      let index = 0;
      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
          card.style.animation = `fadeInUp 0.4s ease ${index * 0.06}s both`;
          index++;
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

export function initCuriosidadesPage() {
  const searchInput = document.getElementById('curiosidadesSearch');
  const filterBtns = document.querySelectorAll('.category-filters .filter-btn');
  const cards = document.querySelectorAll('.curiosidad-card');
  if (!searchInput) return;

  let currentCategory = 'all';
  let searchTerm = '';

  function applyFilters() {
    let visible = 0;
    cards.forEach(card => {
      const cat = card.dataset.category;
      const text = card.textContent.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      const query = searchTerm.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      const matchCat = currentCategory === 'all' || cat === currentCategory;
      const matchSearch = query === '' || text.includes(query);
      if (matchCat && matchSearch) {
        card.classList.remove('hidden');
        visible++;
      } else {
        card.classList.add('hidden');
      }
    });
    const noRes = document.querySelector('.no-results-message');
    if (visible === 0) {
      if (!noRes) {
        const msg = document.createElement('p');
        msg.className = 'no-results-message';
        msg.textContent = 'No se encontraron curiosidades. 🌸';
        document.getElementById('curiosidadesGrid')?.appendChild(msg);
      }
    } else if (noRes) {
      noRes.remove();
    }
  }

  searchInput.addEventListener('input', () => {
    searchTerm = searchInput.value.trim();
    applyFilters();
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentCategory = btn.dataset.category;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilters();
    });
  });
}

export function initAcercaPage() {
  // No requiere lógica especial actualmente
}