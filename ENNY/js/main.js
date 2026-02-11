// ENNY MEDICAL - Main JavaScript

// Mobile Menu Toggle
const hamburgerBtn = document.querySelector('.hamburger');
const navMenu = document.querySelector('nav ul');

if (hamburgerBtn) {
  hamburgerBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburgerBtn.classList.toggle('active');
  });

  // Close menu when link is clicked
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      hamburgerBtn.classList.remove('active');
    });
  });
}

// Dropdown Menu for Mobile
document.querySelectorAll('.dropdown').forEach(dropdown => {
  const toggle = dropdown.querySelector('a');
  
  if (toggle) {
    toggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        dropdown.classList.toggle('active');
      }
    });
  }
});

// Modal Management
class Modal {
  constructor(modalId) {
    this.modal = document.getElementById(modalId);
    this.closeBtn = this.modal?.querySelector('.modal-close');
    this.init();
  }

  init() {
    if (!this.modal) return;

    this.closeBtn?.addEventListener('click', () => this.close());
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });
  }

  open() {
    if (this.modal) {
      this.modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  close() {
    if (this.modal) {
      this.modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }
}

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#' && document.querySelector(href)) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Intersection Observer for Animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = getComputedStyle(entry.target).animation;
      entry.target.classList.add('animate-in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all elements with animation data
document.querySelectorAll('[data-animate]').forEach(el => {
  observer.observe(el);
});

// Sticky Header on Scroll
let lastScrollTop = 0;
const header = document.querySelector('header');

if (header) {
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 100) {
      header.style.boxShadow = 'var(--shadow-lg)';
    } else {
      header.style.boxShadow = 'var(--shadow-md)';
    }

    lastScrollTop = scrollTop;
  });
}

// Scroll to Top Button
function createScrollToTop() {
  const button = document.createElement('button');
  button.innerHTML = '↑';
  button.className = 'scroll-to-top';
  button.setAttribute('aria-label', 'Scroll to top');
  document.body.appendChild(button);

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      button.classList.add('show');
    } else {
      button.classList.remove('show');
    }
  });

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Add CSS for scroll button
  const style = document.createElement('style');
  style.textContent = `
    .scroll-to-top {
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, #0066cc, #0052a3);
      color: white;
      border: none;
      cursor: pointer;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      z-index: 999;
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow-lg);
    }

    .scroll-to-top.show {
      opacity: 1;
      visibility: visible;
    }

    .scroll-to-top:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-xl);
    }

    @media (max-width: 480px) {
      .scroll-to-top {
        width: 40px;
        height: 40px;
        bottom: 20px;
        right: 20px;
        font-size: 18px;
      }
    }
  `;
  document.head.appendChild(style);
}

// Initialize scroll to top
createScrollToTop();

// Form Validation
class FormValidator {
  constructor(formId) {
    this.form = document.getElementById(formId);
    this.init();
  }

  init() {
    if (!this.form) return;

    this.form.addEventListener('submit', (e) => this.validate(e));
    this.form.querySelectorAll('input, textarea, select').forEach(field => {
      field.addEventListener('blur', () => this.validateField(field));
    });
  }

  validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Check required
    if (field.required && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    }
    // Check email
    else if (field.type === 'email' && value) {
      isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      errorMessage = 'Please enter a valid email';
    }
    // Check phone
    else if (field.type === 'tel' && value) {
      isValid = /^[\d\s\-\+\(\)]+$/.test(value);
      errorMessage = 'Please enter a valid phone number';
    }
    // Check minimum length
    else if (field.minLength && value.length < field.minLength) {
      isValid = false;
      errorMessage = `Minimum ${field.minLength} characters required`;
    }

    this.setFieldStatus(field, isValid, errorMessage);
    return isValid;
  }

  setFieldStatus(field, isValid, errorMessage) {
    const group = field.closest('.form-group');
    if (!group) return;

    let errorEl = group.querySelector('.error-message');

    if (isValid) {
      field.style.borderColor = 'var(--border-gray)';
      if (errorEl) errorEl.remove();
    } else {
      field.style.borderColor = 'var(--danger)';
      if (!errorEl) {
        errorEl = document.createElement('small');
        errorEl.className = 'error-message';
        errorEl.style.color = 'var(--danger)';
        errorEl.style.display = 'block';
        errorEl.style.marginTop = '4px';
        group.appendChild(errorEl);
      }
      errorEl.textContent = errorMessage;
    }
  }

  validate(e) {
    e.preventDefault();

    const fields = this.form.querySelectorAll('input, textarea, select');
    let isFormValid = true;

    fields.forEach(field => {
      if (!this.validateField(field)) {
        isFormValid = false;
      }
    });

    if (isFormValid) {
      this.submitForm();
    }
  }

  submitForm() {
    // Implement form submission logic
    console.log('Form submitted successfully');
    alert('Thank you! Your request has been submitted.');
    this.form.reset();
  }
}

// Number Counter Animation
function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count'));
    const duration = 2000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        counter.textContent = Math.floor(current).toLocaleString();
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target.toLocaleString();
      }
    };

    // Trigger when counter comes into view
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          updateCounter();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(counter);
  });
}

// Initialize counters
animateCounters();

// Lazy Loading Images
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// Newsletter Subscription
function initNewsletterForm() {
  const forms = document.querySelectorAll('.newsletter-form');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = form.querySelector('input[type="email"]');
      
      if (email.value) {
        // Simulate API call
        console.log('Newsletter subscription:', email.value);
        alert('Thank you for subscribing!');
        form.reset();
      }
    });
  });
}

initNewsletterForm();

// Search Functionality
function initSearch() {
  const searchBtn = document.querySelector('.search-btn');
  const searchInput = document.querySelector('.search-input');

  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => {
      const query = searchInput.value;
      if (query) {
        console.log('Search query:', query);
        // Implement search functionality
      }
    });

    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        searchBtn.click();
      }
    });
  }
}

initSearch();

// Accessibility: Keyboard Navigation
document.addEventListener('keydown', (e) => {
  // Close modals with Escape
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal.active').forEach(modal => {
      const closeBtn = modal.querySelector('.modal-close');
      if (closeBtn) closeBtn.click();
    });
  }
});

// Breadcrumb Navigation
function initBreadcrumbs() {
  const breadcrumbContainer = document.querySelector('.breadcrumbs');
  if (!breadcrumbContainer) return;

  const path = window.location.pathname.split('/').filter(p => p);
  const breadcrumbs = ['Home'];
  
  path.forEach(segment => {
    breadcrumbs.push(segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '));
  });

  breadcrumbContainer.innerHTML = breadcrumbs
    .map((crumb, index) => {
      if (index === breadcrumbs.length - 1) {
        return `<span aria-current="page">${crumb}</span>`;
      }
      return `<a href="#">${crumb}</a> / `;
    })
    .join('');
}

initBreadcrumbs();

// Window Resize Handler
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    console.log('Window resized');
  }, 250);
});

// Document Ready Alternative
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

function initApp() {
  console.log('ENNY Medical website initialized');
  // All initialization happens above automatically
}

// Error Tracking
window.addEventListener('error', (e) => {
  console.error('Error:', e.message);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});
