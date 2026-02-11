// ENNY MEDICAL - Search & Filter Functionality

class SearchAndFilter {
  constructor() {
    this.data = [];
    this.filteredData = [];
    this.currentType = 'doctors'; // doctors, services, news, etc.
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadData();
  }

  setupEventListeners() {
    // Search input
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.search(e.target.value);
      });
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.search(e.target.value);
        }
      });
    }

    // Filter buttons
    document.querySelectorAll('[data-filter]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const filterValue = e.target.getAttribute('data-filter');
        this.applyFilter(filterValue);
      });
    });

    // Category filters
    document.querySelectorAll('[data-category]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const category = e.target.getAttribute('data-category');
        this.filterByCategory(category);
      });
    });

    // Specialty filter for doctors
    const specialtyFilter = document.getElementById('specialtyFilter');
    if (specialtyFilter) {
      specialtyFilter.addEventListener('change', (e) => {
        this.filterBySpecialty(e.target.value);
      });
    }

    // Experience filter
    const experienceFilter = document.getElementById('experienceFilter');
    if (experienceFilter) {
      experienceFilter.addEventListener('change', (e) => {
        this.filterByExperience(parseInt(e.target.value));
      });
    }

    // Sort options
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.sort(e.target.value);
      });
    }

    // Reset filters
    const resetBtn = document.querySelector('.reset-filters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetFilters());
    }
  }

  loadData() {
    // Load sample data
    this.doctors = [
      {
        id: 1,
        name: 'Dr. Sarah Johnson',
        specialty: 'Cardiology',
        experience: 15,
        rating: 4.8,
        image: '👩‍⚕️'
      },
      {
        id: 2,
        name: 'Dr. Michael Chen',
        specialty: 'Orthopedics',
        experience: 12,
        rating: 4.7,
        image: '👨‍⚕️'
      },
      {
        id: 3,
        name: 'Dr. Emily Rodriguez',
        specialty: 'Pediatrics',
        experience: 8,
        rating: 4.9,
        image: '👩‍⚕️'
      },
      {
        id: 4,
        name: 'Dr. James Wilson',
        specialty: 'General Medicine',
        experience: 20,
        rating: 4.6,
        image: '👨‍⚕️'
      },
      {
        id: 5,
        name: 'Dr. Lisa Anderson',
        specialty: 'Cardiology',
        experience: 10,
        rating: 4.8,
        image: '👩‍⚕️'
      },
      {
        id: 6,
        name: 'Dr. Robert Brown',
        specialty: 'Neurology',
        experience: 18,
        rating: 4.7,
        image: '👨‍⚕️'
      }
    ];

    this.services = [
      { id: 1, name: 'General Checkup', category: 'General', price: 500 },
      { id: 2, name: 'Cardiac Checkup', category: 'Cardiology', price: 2000 },
      { id: 3, name: 'X-Ray', category: 'Radiology', price: 800 },
      { id: 4, name: 'MRI Scan', category: 'Radiology', price: 5000 },
      { id: 5, name: 'Blood Test', category: 'Laboratory', price: 600 },
      { id: 6, name: 'Ultrasound', category: 'Radiology', price: 1500 }
    ];

    this.filteredData = this.doctors;
  }

  search(query) {
    if (!query.trim()) {
      this.filteredData = this.data || this.doctors;
      this.displayResults();
      return;
    }

    const lowerQuery = query.toLowerCase();
    this.filteredData = this.data.filter(item => {
      return item.name.toLowerCase().includes(lowerQuery) ||
        (item.specialty && item.specialty.toLowerCase().includes(lowerQuery)) ||
        (item.category && item.category.toLowerCase().includes(lowerQuery));
    });

    this.displayResults();
  }

  applyFilter(filterValue) {
    // Update active state
    document.querySelectorAll('[data-filter]').forEach(btn => {
      btn.classList.remove('active');
    });
    event.target?.classList.add('active');

    // Apply filter
    switch (filterValue) {
      case 'top-rated':
        this.filteredData.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        this.filteredData.sort((a, b) => b.id - a.id);
        break;
      case 'experience':
        this.filteredData.sort((a, b) => (b.experience || 0) - (a.experience || 0));
        break;
    }

    this.displayResults();
  }

  filterByCategory(category) {
    this.data = this.services;
    this.filteredData = this.services.filter(item => 
      category === 'all' || item.category === category
    );
    this.displayResults();
  }

  filterBySpecialty(specialty) {
    if (!specialty || specialty === 'all') {
      this.filteredData = this.doctors;
    } else {
      this.filteredData = this.doctors.filter(doctor => doctor.specialty === specialty);
    }
    this.displayResults();
  }

  filterByExperience(years) {
    if (years === 0) {
      this.filteredData = this.doctors;
    } else {
      this.filteredData = this.doctors.filter(doctor => doctor.experience >= years);
    }
    this.displayResults();
  }

  sort(sortOption) {
    switch (sortOption) {
      case 'name-asc':
        this.filteredData.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        this.filteredData.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'rating':
        this.filteredData.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'experience':
        this.filteredData.sort((a, b) => (b.experience || 0) - (a.experience || 0));
        break;
      case 'price':
        this.filteredData.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
    }
    this.displayResults();
  }

  displayResults() {
    const resultsContainer = document.querySelector('.results-container');
    if (!resultsContainer) return;

    if (this.filteredData.length === 0) {
      resultsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">No results found.</p>';
      return;
    }

    resultsContainer.innerHTML = this.filteredData.map(item => this.createResultCard(item)).join('');
  }

  createResultCard(item) {
    if (item.specialty) {
      // Doctor card
      return `
        <div class="search-result-card">
          <div class="result-image">${item.image}</div>
          <div class="result-content">
            <h3>${item.name}</h3>
            <p class="specialty">${item.specialty}</p>
            <div class="result-info">
              <span>Experience: ${item.experience} years</span>
              <span>⭐ ${item.rating}</span>
            </div>
            <button class="btn btn-small btn-primary" onclick="window.location.href='doctor-detail.html?id=${item.id}'">
              View Profile
            </button>
          </div>
        </div>
      `;
    } else if (item.category) {
      // Service card
      return `
        <div class="search-result-card">
          <div class="result-content">
            <h3>${item.name}</h3>
            <p class="category">${item.category}</p>
            <p class="price">₹${item.price}</p>
            <button class="btn btn-small btn-primary">Book Now</button>
          </div>
        </div>
      `;
    }
  }

  resetFilters() {
    document.querySelectorAll('.search-input').forEach(input => input.value = '');
    document.querySelectorAll('[data-filter]').forEach(btn => btn.classList.remove('active'));
    document.getElementById('specialtyFilter').value = 'all';
    document.getElementById('experienceFilter').value = '0';
    document.getElementById('sortSelect').value = 'default';

    this.filteredData = this.doctors;
    this.displayResults();
  }
}

// Advanced Search
class AdvancedSearch {
  constructor() {
    this.init();
  }

  init() {
    const advancedSearchBtn = document.querySelector('.advanced-search-btn');
    if (advancedSearchBtn) {
      advancedSearchBtn.addEventListener('click', () => this.openAdvancedSearch());
    }

    const advancedSearchForm = document.getElementById('advancedSearchForm');
    if (advancedSearchForm) {
      advancedSearchForm.addEventListener('submit', (e) => this.handleAdvancedSearch(e));
    }
  }

  openAdvancedSearch() {
    const modal = document.getElementById('advancedSearchModal');
    if (modal) {
      modal.classList.add('active');
    }
  }

  handleAdvancedSearch(e) {
    e.preventDefault();
    const formData = new FormData(document.getElementById('advancedSearchForm'));
    
    const searchParams = {
      keyword: formData.get('keyword'),
      type: formData.get('searchType'),
      location: formData.get('location'),
      dateRange: formData.get('dateRange'),
      rating: formData.get('minRating')
    };

    console.log('Advanced search:', searchParams);
    alert('Search completed. Results shown above.');
  }
}

// Department Search
class DepartmentSearch {
  constructor() {
    this.departments = [
      { id: 1, name: 'Cardiology', icon: '❤️', doctors: 5 },
      { id: 2, name: 'Orthopedics', icon: '🦴', doctors: 4 },
      { id: 3, name: 'Pediatrics', icon: '👶', doctors: 6 },
      { id: 4, name: 'Neurology', icon: '🧠', doctors: 3 },
      { id: 5, name: 'Diagnostics', icon: '🔬', doctors: 8 }
    ];

    this.init();
  }

  init() {
    document.querySelectorAll('[data-department-id]').forEach(element => {
      element.addEventListener('click', (e) => {
        const deptId = e.currentTarget.getAttribute('data-department-id');
        this.showDepartmentDetails(deptId);
      });
    });
  }

  showDepartmentDetails(deptId) {
    const dept = this.departments.find(d => d.id == deptId);
    if (dept) {
      console.log('Department selected:', dept);
      // Navigate to department page or show modal
      window.location.href = `department-detail.html?id=${deptId}`;
    }
  }
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new SearchAndFilter();
    new AdvancedSearch();
    new DepartmentSearch();
  });
} else {
  new SearchAndFilter();
  new AdvancedSearch();
  new DepartmentSearch();
}

// Add CSS for search results
const searchStyles = document.createElement('style');
searchStyles.textContent = `
  .search-result-card {
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    display: flex;
    gap: 1rem;
  }

  .search-result-card:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    transform: translateY(-4px);
  }

  .result-image {
    font-size: 3rem;
    line-height: 1;
  }

  .result-content {
    flex: 1;
  }

  .result-content h3 {
    margin-bottom: 0.5rem;
    color: #0066cc;
  }

  .specialty, .category {
    color: #00b386;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  .result-info {
    display: flex;
    gap: 1rem;
    font-size: 0.85rem;
    margin: 0.5rem 0;
    color: #555;
  }

  .price {
    font-weight: bold;
    color: #0066cc;
    font-size: 1.1rem;
    margin: 0.5rem 0;
  }

  .results-container {
    display: grid;
    gap: 1rem;
    margin-top: 2rem;
  }

  @media (max-width: 768px) {
    .search-result-card {
      flex-direction: column;
    }
  }
`;
document.head.appendChild(searchStyles);
