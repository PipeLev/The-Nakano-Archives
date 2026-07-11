/**
 * Easter Eggs - The Nakano Archives v1.1.0
 * Pétalos de sakura y efectos visuales discretos
 */

class EasterEggs {
  constructor() {
    this.petalInterval = null;
    this.konamiCode = [];
    this.konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    this.init();
  }

  init() {
    this.setupSakuraPetals();
    this.setupKonamiCode();
    this.setupSecretMessage();
  }

  setupSakuraPetals() {
    const createPetal = () => {
      const petal = document.createElement('div');
      petal.className = 'sakura-petal';
      petal.textContent = '🌸';
      petal.style.left = Math.random() * 100 + 'vw';
      petal.style.fontSize = (Math.random() * 1.5 + 0.8) + 'rem';
      petal.style.animationDuration = (Math.random() * 8 + 6) + 's';
      petal.style.animationDelay = Math.random() * 2 + 's';
      document.body.appendChild(petal);

      petal.addEventListener('animationend', () => {
        petal.remove();
      });
    };

    setInterval(() => {
      if (Math.random() < 0.3) {
        createPetal();
      }
    }, 3000);

    for (let i = 0; i < 5; i++) {
      setTimeout(() => createPetal(), i * 600);
    }
  }

  setupKonamiCode() {
    document.addEventListener('keydown', (e) => {
      this.konamiCode.push(e.key);
      this.konamiCode = this.konamiCode.slice(-10);

      if (this.konamiCode.join(',') === this.konamiSequence.join(',')) {
        this.activateKonami();
      }
    });
  }

  activateKonami() {
    const body = document.body;
    body.style.transition = 'all 0.5s ease';

    const originalBg = body.style.backgroundColor;
    body.style.backgroundColor = '#f2a0b5';

    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        const petal = document.createElement('div');
        petal.className = 'sakura-petal';
        petal.textContent = ['🌸', '💮', '🏵️', '💖', '✨'][Math.floor(Math.random() * 5)];
        petal.style.left = Math.random() * 100 + 'vw';
        petal.style.fontSize = (Math.random() * 2 + 1) + 'rem';
        petal.style.animationDuration = (Math.random() * 5 + 4) + 's';
        petal.style.zIndex = '99999';
        document.body.appendChild(petal);
        petal.addEventListener('animationend', () => petal.remove());
      }, i * 80);
    }

    setTimeout(() => {
      body.style.backgroundColor = originalBg;
    }, 2000);
  }

  setupSecretMessage() {
    let clickCount = 0;
    const footerVersion = document.querySelector('.footer-version');

    if (footerVersion) {
      footerVersion.style.cursor = 'default';
      footerVersion.addEventListener('click', () => {
        clickCount++;
        if (clickCount >= 5) {
          clickCount = 0;
          footerVersion.textContent = '🌸 Las quintillizas te saludan 🌸';
          setTimeout(() => {
            footerVersion.textContent = 'v1.1.0 — Hecho con 🌸';
          }, 3000);
        }
      });
    }
  }
}

export default EasterEggs;