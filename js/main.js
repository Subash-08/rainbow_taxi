/**
 * Main Application Entry Point
 * Initialize all components and handle global functionality
 */

import { 
  Navigation, 
  TestimonialsSlider, 
  FleetTabs, 
  BackToTop, 
  FormHandler, 
  Preloader,
  ScrollReveal,
  CounterAnimation
} from './components.js';

import {
  ParallaxController,
  FloatingAnimationController,
  HoverEffectController,
  LoadingAnimationController,
  ScrollAnimationController,
  RippleEffectController,
  MagneticEffectController,
  TextAnimationController,
  IntersectionAnimationController
} from './animations.js';

import { getCurrentDate, getCurrentTime, storage } from './utils.js';

class TaxiWebsiteApp {
  constructor() {
    this.components = {};
    this.animationControllers = {};
    this.isInitialized = false;
    
    this.init();
  }

  async init() {
    try {
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.initializeApp());
      } else {
        this.initializeApp();
      }
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  }

  initializeApp() {
    console.log('🚕 Initializing Rainbow Call Taxi Website...');
    
    // Initialize preloader first
    this.components.preloader = new Preloader();
    
    // Initialize core components
    this.initializeComponents();
    
    // Initialize animation controllers
    this.initializeAnimations();
    
    // Initialize AOS library if available
    this.initializeAOS();
    
    // Set up global event listeners
    this.setupGlobalEvents();
    
    // Initialize forms
    this.initializeForms();
    
    // Set default form values
    this.setDefaultFormValues();
    
    // Mark as initialized
    this.isInitialized = true;
    
    console.log('✅ Website initialized successfully!');
  }

  initializeComponents() {
    try {
      // Core navigation
      this.components.navigation = new Navigation();
      
      // Interactive components
      this.components.testimonialsSlider = new TestimonialsSlider();
      this.components.fleetTabs = new FleetTabs();
      this.components.backToTop = new BackToTop();
      this.components.scrollReveal = new ScrollReveal();
      this.components.counterAnimation = new CounterAnimation();
      
      console.log('📦 Components initialized');
    } catch (error) {
      console.error('Error initializing components:', error);
    }
  }

  initializeAnimations() {
    try {
      // Only initialize animations on devices that can handle them
      if (!this.isLowPerformanceDevice()) {
        this.animationControllers.parallax = new ParallaxController();
        this.animationControllers.floating = new FloatingAnimationController();
        this.animationControllers.magnetic = new MagneticEffectController();
        this.animationControllers.intersection = new IntersectionAnimationController();
      }
      
      // Always initialize these lightweight animations
      this.animationControllers.hover = new HoverEffectController();
      this.animationControllers.ripple = new RippleEffectController();
      this.animationControllers.text = new TextAnimationController();
      this.animationControllers.loading = new LoadingAnimationController();
      
      console.log('🎨 Animations initialized');
    } catch (error) {
      console.error('Error initializing animations:', error);
    }
  }

  initializeAOS() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 100,
        disable: 'mobile' // Disable on mobile for performance
      });
      console.log('🎭 AOS animations initialized');
    }
  }

  initializeForms() {
    try {
      // Booking form
      const bookingForm = document.getElementById('booking-form');
      if (bookingForm) {
        this.components.bookingForm = new FormHandler('booking-form', {
          showSuccess: true,
          resetOnSuccess: true
        });
        
        // Add custom booking form logic
        bookingForm.addEventListener('submit', (e) => this.handleBookingSubmit(e));
      }
      
      // Contact form
      const contactForm = document.getElementById('contact-form');
      if (contactForm) {
        this.components.contactForm = new FormHandler('contact-form', {
          showSuccess: true,
          resetOnSuccess: true
        });
      }
      
      console.log('📝 Forms initialized');
    } catch (error) {
      console.error('Error initializing forms:', error);
    }
  }

  setupGlobalEvents() {
    try {
      // Handle CTA button clicks
      this.setupCTAButtons();
      
      // Handle phone number clicks
      this.setupPhoneLinks();
      
      // Handle service booking buttons
      this.setupServiceButtons();
      
      // Handle fleet booking buttons
      this.setupFleetButtons();
      
      // Handle keyboard navigation
      this.setupKeyboardNavigation();
      
      // Handle window resize
      this.setupResizeHandler();
      
      console.log('🎯 Global events set up');
    } catch (error) {
      console.error('Error setting up global events:', error);
    }
  }

  setupCTAButtons() {
    const ctaButtons = document.querySelectorAll('.cta-book');
    ctaButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.scrollToBookingForm();
        this.trackEvent('CTA', 'click', 'hero-book-now');
      });
    });
  }

  setupPhoneLinks() {
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.trackEvent('Phone', 'click', 'call-driver');
      });
    });
  }

  setupServiceButtons() {
    const serviceButtons = document.querySelectorAll('.service-btn');
    serviceButtons.forEach(button => {
      button.addEventListener('click', () => {
        const serviceCard = button.closest('.service-card');
        const serviceName = serviceCard?.querySelector('.service-title')?.textContent || 'Unknown';
        
        this.scrollToBookingForm();
        this.trackEvent('Service', 'click', serviceName);
      });
    });
  }

  setupFleetButtons() {
    const fleetButtons = document.querySelectorAll('.fleet-card .btn');
    fleetButtons.forEach(button => {
      button.addEventListener('click', () => {
        const fleetCard = button.closest('.fleet-card');
        const vehicleName = fleetCard?.querySelector('.fleet-name')?.textContent || 'Unknown';
        
        this.scrollToBookingForm();
        this.trackEvent('Fleet', 'click', vehicleName);
      });
    });
  }

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // ESC key to close mobile menu
      if (e.key === 'Escape') {
        this.components.navigation?.closeMobileMenu();
      }
      
      // Enter key on focused elements
      if (e.key === 'Enter') {
        const focused = document.activeElement;
        if (focused && focused.classList.contains('nav-link')) {
          focused.click();
        }
      }
    });
  }

  setupResizeHandler() {
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleResize();
      }, 250);
    });
  }

  handleResize() {
    // Refresh AOS on resize
    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
    
    // Update parallax elements
    if (this.animationControllers.parallax) {
      this.animationControllers.parallax.handleResize();
    }
  }

  setDefaultFormValues() {
    try {
      // Set default date to today
      const dateInputs = document.querySelectorAll('input[type="date"]');
      dateInputs.forEach(input => {
        if (!input.value) {
          input.value = getCurrentDate();
        }
      });
      
      // Set default time to current time + 1 hour
      const timeInputs = document.querySelectorAll('input[type="time"]');
      timeInputs.forEach(input => {
        if (!input.value) {
          const now = new Date();
          now.setHours(now.getHours() + 1);
          const hours = String(now.getHours()).padStart(2, '0');
          const minutes = String(now.getMinutes()).padStart(2, '0');
          input.value = `${hours}:${minutes}`;
        }
      });
      
      console.log('📅 Default form values set');
    } catch (error) {
      console.error('Error setting default form values:', error);
    }
  }

  handleBookingSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const bookingData = {
      pickup: formData.get('pickup'),
      destination: formData.get('destination'),
      date: formData.get('date'),
      time: formData.get('time'),
      timestamp: new Date().toISOString()
    };
    
    // Save to local storage for later use
    storage.set('lastBooking', bookingData);
    
    // Track booking attempt
    this.trackEvent('Booking', 'submit', 'quick-booking');
    
    // Show success message (handled by FormHandler)
    console.log('🚕 Booking submitted:', bookingData);
  }

  scrollToBookingForm() {
    const bookingSection = document.querySelector('.quick-booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      
      // Focus on first input
      setTimeout(() => {
        const firstInput = bookingSection.querySelector('input');
        if (firstInput) {
          firstInput.focus();
        }
      }, 500);
    }
  }

  trackEvent(category, action, label) {
    // Google Analytics tracking (if available)
    if (typeof gtag !== 'undefined') {
      gtag('event', action, {
        event_category: category,
        event_label: label
      });
    }
    
    // Console log for development
    console.log(`📊 Event tracked: ${category} - ${action} - ${label}`);
  }

  isLowPerformanceDevice() {
    // Check for low-end devices
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const isSlow = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
    const isLowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    return isSlow || isLowMemory || (isMobile && window.innerWidth < 768);
  }

  // Public API methods
  showLoading() {
    return this.animationControllers.loading?.show();
  }

  hideLoading(overlay) {
    this.animationControllers.loading?.hide(overlay);
  }

  refreshAnimations() {
    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
    
    // Refresh custom animations
    if (this.components.scrollReveal) {
      this.components.scrollReveal.checkElements();
    }
  }

  // Error handling
  handleError(error, context = 'Unknown') {
    console.error(`Error in ${context}:`, error);
    
    // Track error (if analytics available)
    this.trackEvent('Error', 'javascript', context);
    
    // Show user-friendly message for critical errors
    if (context === 'Critical') {
      this.showErrorMessage('Something went wrong. Please refresh the page.');
    }
  }

  showErrorMessage(message) {
    const toast = document.createElement('div');
    toast.className = 'toast toast-error';
    toast.innerHTML = `
      <div class="toast-content">
        <i class="fas fa-exclamation-triangle"></i>
        <span>${message}</span>
      </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 5000);
  }
}

// Initialize the application
const app = new TaxiWebsiteApp();

// Make app globally available for debugging
window.TaxiApp = app;

// Handle unhandled errors
window.addEventListener('error', (e) => {
  app.handleError(e.error, 'Global');
});

window.addEventListener('unhandledrejection', (e) => {
  app.handleError(e.reason, 'Promise');
});

// Export for module usage
export default TaxiWebsiteApp;