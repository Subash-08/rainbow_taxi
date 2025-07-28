/**
 * Animation Controllers
 * Handle complex animations and interactions
 */

import { throttle, debounce } from './utils.js';

// Parallax Animation Controller
export class ParallaxController {
  constructor() {
    this.elements = document.querySelectorAll('.parallax');
    this.isActive = true;

    this.init();
  }

  init() {
    if (this.elements.length === 0) return;

    // Disable on mobile for performance
    if (window.innerWidth <= 768) {
      this.isActive = false;
      return;
    }

    this.bindEvents();
  }

  bindEvents() {
    if (!this.isActive) return;

    window.addEventListener('scroll', throttle(() => this.updateParallax(), 16));
    window.addEventListener('resize', debounce(() => this.handleResize(), 250));
  }

  updateParallax() {
    const scrollY = window.pageYOffset;

    this.elements.forEach(element => {
      const speed = element.dataset.speed || 0.5;
      const yPos = -(scrollY * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
  }

  handleResize() {
    if (window.innerWidth <= 768) {
      this.isActive = false;
      this.resetElements();
    } else {
      this.isActive = true;
    }
  }

  resetElements() {
    this.elements.forEach(element => {
      element.style.transform = 'translateY(0)';
    });
  }
}

// Floating Animation Controller
export class FloatingAnimationController {
  constructor() {
    this.elements = document.querySelectorAll('.float');
    this.init();
  }

  init() {
    this.elements.forEach((element, index) => {
      // Stagger the animation start times
      element.style.animationDelay = `${index * 0.5}s`;
    });
  }
}

// Hover Effect Controller
export class HoverEffectController {
  constructor() {
    this.init();
  }

  init() {
    this.initCardHovers();
    this.initButtonHovers();
    this.initImageHovers();
  }

  initCardHovers() {
    const cards = document.querySelectorAll('.service-card, .fleet-card, .testimonial-card');

    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) scale(1.02)';
        card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
        card.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      });
    });
  }

  initButtonHovers() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
      button.addEventListener('mouseenter', () => {
        if (!button.classList.contains('btn-outline')) {
          button.style.transform = 'translateY(-2px)';
          button.style.boxShadow = '0 8px 25px rgba(255, 215, 0, 0.3)';
        }
      });

      button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = 'none';
      });
    });
  }

  initImageHovers() {
    const images = document.querySelectorAll('.fleet-image img, .about-image img');

    images.forEach(img => {
      const container = img.parentElement;

      container.addEventListener('mouseenter', () => {
        img.style.transform = 'scale(1.1)';
      });

      container.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1)';
      });
    });
  }
}

// Loading Animation Controller
export class LoadingAnimationController {
  constructor() {
    this.init();
  }

  init() {
    this.createLoadingSpinner();
  }

  createLoadingSpinner() {
    const style = document.createElement('style');
    style.textContent = `
      .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
      }
      
      .loading-overlay.active {
        opacity: 1;
        visibility: visible;
      }
      
      .loading-spinner {
        width: 50px;
        height: 50px;
        border: 4px solid rgba(255, 215, 0, 0.3);
        border-top: 4px solid #FFD700;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  show() {
    let overlay = document.querySelector('.loading-overlay');

    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'loading-overlay';
      overlay.innerHTML = '<div class="loading-spinner"></div>';
      document.body.appendChild(overlay);
    }

    setTimeout(() => overlay.classList.add('active'), 10);
    return overlay;
  }

  hide(overlay) {
    if (overlay) {
      overlay.classList.remove('active');
      setTimeout(() => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      }, 300);
    }
  }
}

// Scroll Animation Controller
export class ScrollAnimationController {
  constructor() {
    this.elements = document.querySelectorAll('[data-aos]');
    this.threshold = 0.1;
    this.init();
  }

  init() {
    if (this.elements.length === 0) return;

    this.bindEvents();
    this.checkElements();
  }

  bindEvents() {
    window.addEventListener('scroll', throttle(() => this.checkElements(), 100));
    window.addEventListener('resize', debounce(() => this.checkElements(), 250));
  }

  checkElements() {
    this.elements.forEach(element => {
      if (this.isInViewport(element)) {
        this.animateElement(element);
      }
    });
  }

  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    return (
      rect.top >= 0 &&
      rect.top <= windowHeight * (1 - this.threshold)
    );
  }

  animateElement(element) {
    const animation = element.getAttribute('data-aos');
    const delay = element.getAttribute('data-aos-delay') || 0;
    const duration = element.getAttribute('data-aos-duration') || 600;

    setTimeout(() => {
      element.classList.add('aos-animate');
      element.style.animationDuration = `${duration}ms`;

      switch (animation) {
        case 'fade-up':
          element.style.animation = `fadeInUp ${duration}ms ease-out forwards`;
          break;
        case 'fade-down':
          element.style.animation = `fadeInDown ${duration}ms ease-out forwards`;
          break;
        case 'fade-left':
          element.style.animation = `fadeInLeft ${duration}ms ease-out forwards`;
          break;
        case 'fade-right':
          element.style.animation = `fadeInRight ${duration}ms ease-out forwards`;
          break;
        case 'zoom-in':
          element.style.animation = `scaleIn ${duration}ms ease-out forwards`;
          break;
        default:
          element.style.animation = `fadeIn ${duration}ms ease-out forwards`;
      }
    }, delay);
  }
}

// Ripple Effect Controller
export class RippleEffectController {
  constructor() {
    this.init();
  }

  init() {
    const buttons = document.querySelectorAll('.btn, .service-card, .fleet-card');

    buttons.forEach(button => {
      button.addEventListener('click', (e) => this.createRipple(e, button));
    });
  }

  createRipple(event, element) {
    const circle = document.createElement('span');
    const diameter = Math.max(element.clientWidth, element.clientHeight);
    const radius = diameter / 2;

    const rect = element.getBoundingClientRect();
    const left = event.clientX - rect.left - radius;
    const top = event.clientY - rect.top - radius;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${left}px`;
    circle.style.top = `${top}px`;
    circle.classList.add('ripple');

    // Add ripple styles
    if (!document.querySelector('#ripple-styles')) {
      const style = document.createElement('style');
      style.id = 'ripple-styles';
      style.textContent = `
        .ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: scale(0);
          animation: ripple-animation 0.6s linear;
          pointer-events: none;
        }
        
        @keyframes ripple-animation {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    const ripple = element.querySelector('.ripple');
    if (ripple) {
      ripple.remove();
    }

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(circle);

    // Remove ripple after animation
    setTimeout(() => {
      circle.remove();
    }, 600);
  }
}

// Magnetic Effect Controller (for buttons and cards)
export class MagneticEffectController {
  constructor() {
    this.elements = document.querySelectorAll('.btn-primary, .service-card');
    this.init();
  }

  init() {
    this.elements.forEach(element => {
      element.addEventListener('mousemove', (e) => this.handleMouseMove(e, element));
      element.addEventListener('mouseleave', () => this.handleMouseLeave(element));
    });
  }

  handleMouseMove(e, element) {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const moveX = x * 0.1;
    const moveY = y * 0.1;

    element.style.transform = `translate(${moveX}px, ${moveY}px)`;
  }

  handleMouseLeave(element) {
    element.style.transform = 'translate(0px, 0px)';
  }
}

// Text Animation Controller
export class TextAnimationController {
  constructor() {
    this.init();
  }

  init() {
    this.animateHeroTitle();
    this.animateCounters();
  }

  animateHeroTitle() {
    const title = document.querySelector('.hero-title');
    if (!title) return;

    const text = title.textContent;
    title.innerHTML = '';

    // Split text into spans
    text.split('').forEach((char, index) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? ' ' : char;
      span.style.opacity = '0';
      span.style.transform = 'translateY(20px)';
      span.style.transition = `opacity 0.5s ease ${index * 0.05}s, transform 0.5s ease ${index * 0.05}s`;
      title.appendChild(span);
    });

    // Animate in
    setTimeout(() => {
      title.querySelectorAll('span').forEach(span => {
        span.style.opacity = '1';
        span.style.transform = 'translateY(0)';
      });
    }, 500);
  }

  animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    let hasAnimated = false;

    const animateNumber = (element, target) => {
      const duration = 2000;
      const start = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);

        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(target * easeOutQuart);

        element.textContent = current;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          element.textContent = target;
        }
      };

      requestAnimationFrame(animate);
    };

    const checkCounters = () => {
      if (hasAnimated) return;

      const heroStats = document.querySelector('.hero-stats1');
      if (heroStats) {
        const rect = heroStats.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            animateNumber(counter, target);
          });
          hasAnimated = true;
        }
      }
    };

    window.addEventListener('scroll', throttle(checkCounters, 100));
    checkCounters(); // Check on load
  }
}

// Intersection Observer Animation Controller
export class IntersectionAnimationController {
  constructor() {
    this.observer = null;
    this.init();
  }

  init() {
    if (!('IntersectionObserver' in window)) {
      // Fallback for older browsers
      this.fallbackAnimation();
      return;
    }

    this.createObserver();
    this.observeElements();
  }

  createObserver() {
    const options = {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.1
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, options);
  }

  observeElements() {
    const elements = document.querySelectorAll('.service-card, .fleet-card, .feature-item, .contact-method');
    elements.forEach(element => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      this.observer.observe(element);
    });
  }

  animateElement(element) {
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
  }

  fallbackAnimation() {
    // Simple fallback for browsers without IntersectionObserver
    const elements = document.querySelectorAll('.service-card, .fleet-card, .feature-item, .contact-method');
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, index * 200);
    });
  }
}