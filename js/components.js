/**
 * Component Classes
 * Reusable UI components
 */

import { debounce, throttle, isInViewport, smoothScrollTo } from './utils.js';

// Navigation Component
export class Navigation {
  constructor() {
    this.navbar = document.getElementById('navbar');
    this.navToggle = document.getElementById('nav-toggle');
    this.navMenu = document.getElementById('nav-menu');
    this.navLinks = document.querySelectorAll('.nav-link');

    this.init();
  }

  init() {
    this.bindEvents();
    this.handleScroll();
  }

  bindEvents() {
    // Toggle mobile menu
    this.navToggle?.addEventListener('click', () => this.toggleMobileMenu());

    // Close mobile menu when clicking on links
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {

        // Only prevent default if it's a hash (in-page navigation)
        if (target.startsWith('#')) {
          e.preventDefault();
          this.navigateToSection(target);
          this.closeMobileMenu();
        }
      });
    });

    // Handle scroll for navbar styling
    window.addEventListener('scroll', throttle(() => this.handleScroll(), 100));

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.navbar.contains(e.target)) {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    this.navMenu.classList.toggle('active');
    this.navToggle.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  }

  closeMobileMenu() {
    this.navMenu?.classList.remove('active');
    this.navToggle?.classList.remove('active');
    document.body.classList.remove('menu-open');
  }

  navigateToSection(target) {
    const element = document.querySelector(target);
    if (element) {
      smoothScrollTo(element, 80);
      this.setActiveLink(target);
    }
  }

  setActiveLink(target) {
    this.navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === target) {
        link.classList.add('active');
      }
    });
  }

  handleScroll() {
    const scrollY = window.scrollY;

    // Add scrolled class to navbar
    if (scrollY > 50) {
      this.navbar.classList.add('scrolled');
    } else {
      this.navbar.classList.remove('scrolled');
    }

    // Update active link based on scroll position
    this.updateActiveLink();
  }

  updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        this.setActiveLink(`#${sectionId}`);
      }
    });
  }
}

// Testimonials Slider Component
export class TestimonialsSlider {
  constructor() {
    this.track = document.getElementById('testimonial-track');
    this.prevBtn = document.getElementById('prev-testimonial');
    this.nextBtn = document.getElementById('next-testimonial');
    this.dots = document.querySelectorAll('#testimonial-dots .dot');
    this.cards = document.querySelectorAll('.testimonial-card');

    this.currentSlide = 0;
    this.totalSlides = this.cards.length;
    this.autoPlayInterval = null;
    this.autoPlayDelay = 5000;

    this.init();
  }

  init() {
    if (!this.track || this.totalSlides === 0) return;

    this.bindEvents();
    this.startAutoPlay();
  }

  bindEvents() {
    this.prevBtn?.addEventListener('click', () => this.prevSlide());
    this.nextBtn?.addEventListener('click', () => this.nextSlide());

    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index));
    });

    // Pause autoplay on hover
    this.track.addEventListener('mouseenter', () => this.stopAutoPlay());
    this.track.addEventListener('mouseleave', () => this.startAutoPlay());

    // Handle touch events for mobile
    this.handleTouchEvents();
  }

  handleTouchEvents() {
    let startX = 0;
    let endX = 0;

    this.track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });

    this.track.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      this.handleSwipe(startX, endX);
    });
  }

  handleSwipe(startX, endX) {
    const threshold = 50;
    const diff = startX - endX;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
    }
  }

  goToSlide(index) {
    this.currentSlide = index;
    this.updateSlider();
    this.updateDots();
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    this.updateSlider();
    this.updateDots();
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    this.updateSlider();
    this.updateDots();
  }

  updateSlider() {
    const translateX = -this.currentSlide * 100;
    this.track.style.transform = `translateX(${translateX}%)`;
  }

  updateDots() {
    this.dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentSlide);
    });
  }

  startAutoPlay() {
    this.stopAutoPlay();
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, this.autoPlayDelay);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }
}

// Fleet Tabs Component
export class FleetTabs {
  constructor() {
    this.tabButtons = document.querySelectorAll('.tab-btn');
    this.tabContents = document.querySelectorAll('.tab-content');

    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    this.tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const tabId = button.getAttribute('data-tab');
        this.switchTab(tabId, button);
      });
    });
  }

  switchTab(tabId, activeButton) {
    // Remove active class from all buttons and contents
    this.tabButtons.forEach(btn => btn.classList.remove('active'));
    this.tabContents.forEach(content => content.classList.remove('active'));

    // Add active class to clicked button and corresponding content
    activeButton.classList.add('active');
    const targetContent = document.getElementById(tabId);
    if (targetContent) {
      targetContent.classList.add('active');
    }
  }
}

// Back to Top Component
export class BackToTop {
  constructor() {
    this.button = document.getElementById('back-to-top');
    this.threshold = 300;

    this.init();
  }

  init() {
    if (!this.button) return;

    this.bindEvents();
    this.handleScroll();
  }

  bindEvents() {
    this.button.addEventListener('click', () => this.scrollToTop());
    window.addEventListener('scroll', throttle(() => this.handleScroll(), 100));
  }

  handleScroll() {
    const scrollY = window.scrollY;

    if (scrollY > this.threshold) {
      this.button.classList.add('visible');
    } else {
      this.button.classList.remove('visible');
    }
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}

// Form Handler Component
export class FormHandler {
  constructor(formId, options = {}) {
    this.form = document.getElementById(formId);
    this.options = {
      showSuccess: true,
      showError: true,
      resetOnSuccess: true,
      ...options
    };

    this.init();
  }

  init() {
    if (!this.form) return;

    this.bindEvents();
  }

  bindEvents() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));

    // Real-time validation
    const inputs = this.form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });
  }

  async handleSubmit(e) {
    e.preventDefault();

    if (!this.validateForm()) {
      return;
    }

    const formData = this.getFormData();
    const submitButton = this.form.querySelector('button[type="submit"]');

    try {
      this.setSubmitState(submitButton, true);

      // Simulate API call (replace with actual endpoint)
      await this.submitForm(formData);

      if (this.options.showSuccess) {
        this.showMessage('Form submitted successfully!', 'success');
      }

      if (this.options.resetOnSuccess) {
        this.form.reset();
      }

    } catch (error) {
      if (this.options.showError) {
        this.showMessage('Error submitting form. Please try again.', 'error');
      }
      console.error('Form submission error:', error);
    } finally {
      this.setSubmitState(submitButton, false);
    }
  }

  validateForm() {
    const inputs = this.form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    let isValid = true;
    let message = '';

    // Required field validation
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      message = 'This field is required';
    }

    // Email validation
    if (type === 'email' && value && !this.isValidEmail(value)) {
      isValid = false;
      message = 'Please enter a valid email address';
    }

    // Phone validation
    if (type === 'tel' && value && !this.isValidPhone(value)) {
      isValid = false;
      message = 'Please enter a valid phone number';
    }

    this.setFieldError(field, isValid ? '' : message);
    return isValid;
  }

  setFieldError(field, message) {
    const errorElement = field.parentNode.querySelector('.field-error');

    if (message) {
      field.classList.add('error');
      if (errorElement) {
        errorElement.textContent = message;
      } else {
        const error = document.createElement('div');
        error.className = 'field-error';
        error.textContent = message;
        field.parentNode.appendChild(error);
      }
    } else {
      field.classList.remove('error');
      if (errorElement) {
        errorElement.remove();
      }
    }
  }

  clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
      errorElement.remove();
    }
  }

  getFormData() {
    const formData = new FormData(this.form);
    const data = {};

    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }

    return data;
  }

  async submitForm(data) {
    // Simulate API call - replace with actual implementation
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate success/failure
        if (Math.random() > 0.1) {
          resolve(data);
        } else {
          reject(new Error('Submission failed'));
        }
      }, 1000);
    });
  }

  setSubmitState(button, isSubmitting) {
    if (isSubmitting) {
      button.disabled = true;
      button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    } else {
      button.disabled = false;
      button.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    }
  }

  showMessage(message, type = 'info') {
    // Create and show toast message
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
      </div>
    `;

    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => toast.classList.add('show'), 100);

    // Remove after delay
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  }
}

// Preloader Component
export class Preloader {
  constructor() {
    this.preloader = document.getElementById('preloader');
    this.minDisplayTime = 1000; // Minimum time to show preloader
    this.startTime = Date.now();

    this.init();
  }

  init() {
    if (!this.preloader) return;

    // Hide preloader when page is loaded
    if (document.readyState === 'complete') {
      this.hide();
    } else {
      window.addEventListener('load', () => this.hide());
    }
  }

  hide() {
    const elapsedTime = Date.now() - this.startTime;
    const remainingTime = Math.max(0, this.minDisplayTime - elapsedTime);

    setTimeout(() => {
      this.preloader.classList.add('hidden');

      // Remove from DOM after animation
      setTimeout(() => {
        if (this.preloader.parentNode) {
          this.preloader.parentNode.removeChild(this.preloader);
        }
      }, 500);
    }, remainingTime);
  }
}

// Scroll Reveal Component
export class ScrollReveal {
  constructor() {
    this.elements = document.querySelectorAll('.reveal');
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
      if (isInViewport(element, 50)) {
        element.classList.add('revealed');
      }
    });
  }
}

// Counter Animation Component
export class CounterAnimation {
  constructor() {
    this.counters = document.querySelectorAll('[data-count]');
    this.hasAnimated = false;

    this.init();
  }

  init() {
    if (this.counters.length === 0) return;

    this.bindEvents();
  }

  bindEvents() {
    window.addEventListener('scroll', throttle(() => this.checkCounters(), 100));
  }

  checkCounters() {
    if (this.hasAnimated) return;

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats && isInViewport(heroStats, 100)) {
      this.animateCounters();
      this.hasAnimated = true;
    }
  }

  animateCounters() {
    this.counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count'));
      const duration = 2000;
      const start = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(target * easeOutQuart);

        counter.textContent = current;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          counter.textContent = target;
        }
      };

      requestAnimationFrame(animate);
    });
  }
}