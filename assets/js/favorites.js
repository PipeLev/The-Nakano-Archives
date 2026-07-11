/**
 * Sistema de Favoritos - The Nakano Archives v1.1.0
 * Gestiona favoritos con LocalStorage
 */

class FavoritesManager {
  constructor() {
    this.storageKey = 'nakano-favorites';
    this.favorites = {
      images: [],
      wallpapers: [],
      songs: []
    };
    this.init();
  }

  init() {
    this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.favorites = {
          images: parsed.images || [],
          wallpapers: parsed.wallpapers || [],
          songs: parsed.songs || []
        };
      }
    } catch (error) {
      console.warn('Error al cargar favoritos:', error);
      this.favorites = { images: [], wallpapers: [], songs: [] };
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.favorites));
    } catch (error) {
      console.warn('Error al guardar favoritos:', error);
    }
  }

  add(type, id) {
    if (!this.favorites[type]) {
      this.favorites[type] = [];
    }
    if (!this.favorites[type].includes(id)) {
      this.favorites[type].push(id);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  remove(type, id) {
    if (!this.favorites[type]) return false;
    const index = this.favorites[type].indexOf(id);
    if (index > -1) {
      this.favorites[type].splice(index, 1);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  toggle(type, id) {
    if (this.has(type, id)) {
      this.remove(type, id);
      return false;
    } else {
      this.add(type, id);
      return true;
    }
  }

  has(type, id) {
    if (!this.favorites[type]) return false;
    return this.favorites[type].includes(id);
  }

  getAll(type) {
    if (!this.favorites[type]) return [];
    return [...this.favorites[type]];
  }

  getCount(type) {
    if (!this.favorites[type]) return 0;
    return this.favorites[type].length;
  }

  getTotalCount() {
    return this.getCount('images') + this.getCount('wallpapers') + this.getCount('songs');
  }

  clear(type) {
    if (type) {
      this.favorites[type] = [];
    } else {
      this.favorites = { images: [], wallpapers: [], songs: [] };
    }
    this.saveToStorage();
  }
}

const favoritesManager = new FavoritesManager();
window.favoritesManager = favoritesManager;

export default FavoritesManager;