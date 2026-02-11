// ENNY MEDICAL - User Authentication System

class AuthSystem {
  constructor() {
    this.users = this.loadUsers();
    this.currentUser = this.loadCurrentUser();
  }

  // Load users from localStorage
  loadUsers() {
    const stored = localStorage.getItem('enny_users');
    return stored ? JSON.parse(stored) : {};
  }

  // Load current logged-in user
  loadCurrentUser() {
    const stored = localStorage.getItem('enny_current_user');
    return stored ? JSON.parse(stored) : null;
  }

  // Save users to localStorage
  saveUsers() {
    localStorage.setItem('enny_users', JSON.stringify(this.users));
  }

  // Save current user to localStorage
  saveCurrentUser() {
    if (this.currentUser) {
      localStorage.setItem('enny_current_user', JSON.stringify(this.currentUser));
    }
  }

  // Validate email format
  isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // Validate password strength
  isValidPassword(password) {
    return password && password.length >= 6;
  }

  // Create new account
  createAccount(fullName, email, password, confirmPassword) {
    const errors = [];

    // Validation checks
    if (!fullName || fullName.trim().length < 2) {
      errors.push('Full name must be at least 2 characters');
    }

    if (!this.isValidEmail(email)) {
      errors.push('Please enter a valid email address');
    }

    if (this.users[email]) {
      errors.push('Email already registered');
    }

    if (!this.isValidPassword(password)) {
      errors.push('Password must be at least 6 characters');
    }

    if (password !== confirmPassword) {
      errors.push('Passwords do not match');
    }

    if (errors.length > 0) {
      return { success: false, errors };
    }

    // Create new user (simple hash simulation - in production use bcrypt)
    this.users[email] = {
      email: email,
      fullName: fullName.trim(),
      password: this.simpleHash(password),
      phone: '',
      dateOfBirth: '',
      address: '',
      medicalHistory: '',
      appointments: [],
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    this.saveUsers();
    
    // Auto-login after signup
    this.currentUser = {
      email: email,
      fullName: fullName.trim()
    };
    this.saveCurrentUser();

    return { success: true };
  }

  // Login user
  login(email, password) {
    const errors = [];

    if (!this.isValidEmail(email)) {
      errors.push('Please enter a valid email address');
    }

    if (!password) {
      errors.push('Password is required');
    }

    if (!this.users[email]) {
      errors.push('Email not found');
    } else if (this.users[email].password !== this.simpleHash(password)) {
      errors.push('Incorrect password');
    }

    if (errors.length > 0) {
      return { success: false, errors };
    }

    // Update last login
    this.users[email].lastLogin = new Date().toISOString();
    this.saveUsers();

    // Set current user
    this.currentUser = {
      email: email,
      fullName: this.users[email].fullName
    };
    this.saveCurrentUser();

    return { success: true };
  }

  // Logout user
  logout() {
    this.currentUser = null;
    localStorage.removeItem('enny_current_user');
  }

  // Check if user is logged in
  isLoggedIn() {
    return this.currentUser !== null;
  }

  // Get current user info
  getCurrentUser() {
    return this.currentUser;
  }

  // Get user profile
  getUserProfile(email) {
    return this.users[email] || null;
  }

  // Update user profile
  updateProfile(email, updates) {
    if (!this.users[email]) {
      return { success: false, error: 'User not found' };
    }

    // Only update allowed fields
    const allowedFields = ['phone', 'dateOfBirth', 'address', 'medicalHistory'];
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        this.users[email][field] = updates[field];
      }
    });

    this.saveUsers();
    return { success: true };
  }

  // Add appointment to user's record
  addAppointment(email, appointment) {
    if (!this.users[email]) {
      return { success: false, error: 'User not found' };
    }

    if (!this.users[email].appointments) {
      this.users[email].appointments = [];
    }

    this.users[email].appointments.push({
      ...appointment,
      bookingDate: new Date().toISOString()
    });

    this.saveUsers();
    return { success: true };
  }

  // Get user's appointments
  getUserAppointments(email) {
    const user = this.users[email];
    return user ? user.appointments : [];
  }

  // Simple hash for passwords (for demo - use bcrypt in production)
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString();
  }
}

// Initialize auth system
const authSystem = new AuthSystem();

// Update navigation if user is logged in
function updateAuthNavigation() {
  const authLink = document.getElementById('auth-link');
  const userMenu = document.getElementById('user-menu');

  if (!authLink || !userMenu) return;

  if (authSystem.isLoggedIn()) {
    const user = authSystem.getCurrentUser();
    authLink.innerHTML = `
      <a href="javascript:void(0)" onclick="toggleUserMenu()" style="cursor: pointer;">
        👤 ${user.fullName}
      </a>
    `;
    userMenu.innerHTML = `
      <div style="background: var(--light-blue); padding: var(--spacing-md); border-radius: 8px; min-width: 200px; position: absolute; top: 100%; right: 0; z-index: 1000; box-shadow: var(--shadow-lg);">
        <a href="patient-dashboard.html" style="display: block; padding: 8px 0; color: var(--primary-blue); text-decoration: none; border-bottom: 1px solid #ddd;">📊 My Dashboard</a>
        <a href="patient-profile.html" style="display: block; padding: 8px 0; color: var(--primary-blue); text-decoration: none; border-bottom: 1px solid #ddd;">⚙️ My Profile</a>
        <a href="my-appointments.html" style="display: block; padding: 8px 0; color: var(--primary-blue); text-decoration: none; border-bottom: 1px solid #ddd;">📅 My Appointments</a>
        <a href="javascript:void(0)" onclick="logout()" style="display: block; padding: 8px 0; color: #dc3545; text-decoration: none; cursor: pointer;">🚪 Logout</a>
      </div>
    `;
  } else {
    authLink.innerHTML = `<a href="pages/login.html">🔐 Login / Sign Up</a>`;
    userMenu.innerHTML = '';
  }
}

// Toggle user menu
function toggleUserMenu() {
  const menu = document.getElementById('user-menu');
  if (menu) {
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
  }
}

// Logout function
function logout() {
  authSystem.logout();
  alert('You have been logged out successfully!');
  window.location.href = 'index.html';
}

// Check if user is logged in (for protected pages)
function requireLogin() {
  if (!authSystem.isLoggedIn()) {
    alert('Please login to access this page');
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updateAuthNavigation);
} else {
  updateAuthNavigation();
}
