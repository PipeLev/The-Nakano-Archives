/**
 * Tema Claro/Oscuro - The Nakano Archives v1.1.0
 * Sistema global unificado - Una sola implementación para todo el sitio
 */

class ThemeManager {
  constructor() {
    this.storageKey = 'nakano-theme-preference';
    this.currentTheme = this.getSavedTheme();
    this.metaThemeColor = document.querySelector('meta[name="theme-color"]');
    this.toggleBtn = null;
    this.init();
  }

  getSavedTheme() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved === 'dark' || saved === 'light') return saved;
    } catch (e) {}
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  }

  init() {
    this.applyTheme();
    this.createToggleButton();
    this.listenForSystemChanges();
  }

  applyTheme() {
    const isDark = this.currentTheme === 'dark';
    const html = document.documentElement;

    if (isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }

    if (this.metaThemeColor) {
      this.metaThemeColor.setAttribute('content', isDark ? '#1a1219' : '#f2a0b5');
    }

    if (this.toggleBtn) {
      this.toggleBtn.innerHTML = isDark ? '☀️' : '🌙';
      this.toggleBtn.setAttribute('aria-label', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    }

    try { localStorage.setItem(this.storageKey, this.currentTheme); } catch (e) {}

    window.dispatchEvent(new CustomEvent('theme:changed', { detail: { theme: this.currentTheme } }));
  }

  createToggleButton() {
    const headerContainer = document.querySelector('.header-container');
    if (!headerContainer || document.querySelector('.theme-toggle-btn')) return;

    this.toggleBtn = document.createElement('button');
    this.toggleBtn.className = 'theme-toggle-btn';
    this.toggleBtn.setAttribute('aria-label', 'Cambiar tema');
    this.toggleBtn.innerHTML = this.currentTheme === 'dark' ? '☀️' : '🌙';
    this.toggleBtn.addEventListener('click', () => this.toggleTheme());

    const hamburger = headerContainer.querySelector('.hamburger-btn');
    if (hamburger) {
      hamburger.insertAdjacentElement('beforebegin', this.toggleBtn);
    } else {
      headerContainer.appendChild(this.toggleBtn);
    }
  }

  listenForSystemChanges() {
    if (!window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => {
      if (!localStorage.getItem(this.storageKey)) {
        this.currentTheme = e.matches ? 'dark' : 'light';
        this.applyTheme();
      }
    };
    if (mediaQuery.addEventListener) mediaQuery.addEventListener('change', handler);
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme();
    return this.currentTheme;
  }

  getCurrentTheme() { return this.currentTheme; }
}

let themeManagerInstance = null;
document.addEventListener('DOMContentLoaded', () => {
  if (!themeManagerInstance) {
    themeManagerInstance = new ThemeManager();
    window.themeManager = themeManagerInstance;
  }
});
export default ThemeManager;