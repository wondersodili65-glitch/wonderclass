// ENNY MEDICAL - Appointment Booking System

class AppointmentBooking {
  constructor() {
    this.selectedDate = null;
    this.selectedTime = null;
    this.selectedDoctor = null;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadAppointmentData();
  }

  setupEventListeners() {
    const form = document.getElementById('appointmentForm');
    if (form) {
      form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    // Date picker
    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
      dateInput.addEventListener('change', (e) => {
        this.selectedDate = e.target.value;
        this.updateAvailableTimes();
      });

      // Set minimum date to today
      const today = new Date().toISOString().split('T')[0];
      dateInput.setAttribute('min', today);
    }

    // Time picker
    const timeInput = document.getElementById('appointmentTime');
    if (timeInput) {
      timeInput.addEventListener('change', (e) => {
        this.selectedTime = e.target.value;
      });
    }

    // Doctor selector
    const doctorSelect = document.getElementById('doctorSelect');
    if (doctorSelect) {
      doctorSelect.addEventListener('change', (e) => {
        this.selectedDoctor = e.target.value;
      });
    }

    // Quick appointment buttons
    document.querySelectorAll('.quick-appointment-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const doctorId = e.target.getAttribute('data-doctor-id');
        this.openAppointmentModal(doctorId);
      });
    });
  }

  loadAppointmentData() {
    // Load available doctors and their schedules
    const doctors = [
      { id: 1, name: 'Dr. Sarah Johnson', specialty: 'Cardiology', availability: [9, 10, 14, 15] },
      { id: 2, name: 'Dr. Michael Chen', specialty: 'Orthopedics', availability: [8, 9, 13, 14] },
      { id: 3, name: 'Dr. Emily Rodriguez', specialty: 'Pediatrics', availability: [9, 10, 11, 14] },
      { id: 4, name: 'Dr. James Wilson', specialty: 'General Medicine', availability: [8, 9, 10, 14, 15] }
    ];

    this.doctors = doctors;
    this.populateDoctorSelect(doctors);
  }

  populateDoctorSelect(doctors) {
    const select = document.getElementById('doctorSelect');
    if (!select) return;

    select.innerHTML = '<option value="">Select a Doctor</option>';
    doctors.forEach(doctor => {
      const option = document.createElement('option');
      option.value = doctor.id;
      option.textContent = `${doctor.name} - ${doctor.specialty}`;
      select.appendChild(option);
    });
  }

  updateAvailableTimes() {
    if (!this.selectedDate || !this.selectedDoctor) return;

    const doctor = this.doctors.find(d => d.id == this.selectedDoctor);
    if (!doctor) return;

    const timeInput = document.getElementById('appointmentTime');
    timeInput.innerHTML = '<option value="">Select Time</option>';

    doctor.availability.forEach(hour => {
      const option = document.createElement('option');
      const timeStr = `${String(hour).padStart(2, '0')}:00`;
      option.value = timeStr;
      option.textContent = timeStr;
      timeInput.appendChild(option);
    });
  }

  openAppointmentModal(doctorId) {
    const modal = document.getElementById('appointmentModal');
    if (modal) {
      const doctorSelect = document.getElementById('doctorSelect');
      if (doctorSelect) {
        doctorSelect.value = doctorId;
        this.selectedDoctor = doctorId;
      }
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(document.getElementById('appointmentForm'));
    const appointmentData = {
      patientName: formData.get('patientName'),
      patientEmail: formData.get('patientEmail'),
      patientPhone: formData.get('patientPhone'),
      doctorId: this.selectedDoctor,
      date: this.selectedDate,
      time: this.selectedTime,
      reason: formData.get('reason'),
      notes: formData.get('notes'),
      timestamp: new Date().toISOString()
    };

    if (this.validateAppointment(appointmentData)) {
      this.submitAppointment(appointmentData);
    }
  }

  validateAppointment(data) {
    const errors = [];

    if (!data.patientName || data.patientName.trim().length < 2) {
      errors.push('Please enter a valid name');
    }

    if (!data.patientEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.patientEmail)) {
      errors.push('Please enter a valid email');
    }

    if (!data.patientPhone || !/^[\d\s\-\+\(\)]+$/.test(data.patientPhone)) {
      errors.push('Please enter a valid phone number');
    }

    if (!data.doctorId) {
      errors.push('Please select a doctor');
    }

    if (!data.date) {
      errors.push('Please select a date');
    }

    if (!data.time) {
      errors.push('Please select a time');
    }

    if (errors.length > 0) {
      alert(errors.join('\n'));
      return false;
    }

    return true;
  }

  submitAppointment(data) {
    // Simulate API call
    console.log('Appointment submitted:', data);

    // Save to localStorage for demo purposes
    let appointments = JSON.parse(localStorage.getItem('enny_appointments') || '[]');
    appointments.push(data);
    localStorage.setItem('enny_appointments', JSON.stringify(appointments));

    // If user is logged in, save to their profile
    if (typeof authSystem !== 'undefined' && authSystem.isLoggedIn()) {
      const user = authSystem.getCurrentUser();
      const appointmentForProfile = {
        id: 'apt_' + new Date().getTime(),
        doctorName: document.querySelector(`#doctorSelect [value="${this.selectedDoctor}"]`)?.textContent || data.doctorId,
        date: data.date,
        time: data.time,
        reason: data.reason,
        notes: data.notes,
        specialty: 'General',
        status: 'upcoming'
      };
      authSystem.addAppointment(user.email, appointmentForProfile);
    }

    // Show success message
    const modal = document.getElementById('appointmentModal');
    const message = document.createElement('div');
    message.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #27ae60, #1e8449);
      color: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
      z-index: 3000;
      animation: slideInRight 0.3s ease-out;
      max-width: 350px;
    `;
    message.innerHTML = `
      <strong>Success!</strong><br>
      Your appointment has been booked for ${data.date} at ${data.time}.<br>
      A confirmation email will be sent to ${data.patientEmail}.
    `;
    document.body.appendChild(message);

    // Reset form and close modal
    document.getElementById('appointmentForm').reset();
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }

    // Remove success message after 5 seconds
    setTimeout(() => {
      message.style.opacity = '0';
      message.style.transform = 'translateX(400px)';
      setTimeout(() => message.remove(), 300);
    }, 5000);
  }

  getAppointments() {
    return JSON.parse(localStorage.getItem('enny_appointments') || '[]');
  }

  cancelAppointment(appointmentId) {
    let appointments = this.getAppointments();
    appointments = appointments.filter((_, index) => index !== appointmentId);
    localStorage.setItem('enny_appointments', JSON.stringify(appointments));
    console.log('Appointment cancelled');
  }
}

// Online Test Booking
class OnlineTestBooking {
  constructor() {
    this.selectedTests = [];
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadTestData();
  }

  setupEventListeners() {
    const testCheckboxes = document.querySelectorAll('input[data-test-id]');
    testCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        if (e.target.checked) {
          this.selectedTests.push(e.target.dataset.testId);
        } else {
          this.selectedTests = this.selectedTests.filter(t => t !== e.target.dataset.testId);
        }
        this.updateTestCart();
      });
    });

    const bookButton = document.getElementById('bookTestsBtn');
    if (bookButton) {
      bookButton.addEventListener('click', () => this.bookTests());
    }
  }

  loadTestData() {
    const tests = [
      { id: 1, name: 'Complete Blood Count (CBC)', price: 500, time: '2-3 hours' },
      { id: 2, name: 'Lipid Profile', price: 600, time: '24 hours' },
      { id: 3, name: 'Thyroid Function Test', price: 800, time: '24 hours' },
      { id: 4, name: 'Liver Function Test', price: 700, time: '24 hours' },
      { id: 5, name: 'Kidney Function Test', price: 650, time: '24 hours' },
      { id: 6, name: 'Blood Sugar Test', price: 300, time: '2-3 hours' }
    ];

    this.tests = tests;
  }

  updateTestCart() {
    const cartTotal = document.getElementById('testCartTotal');
    if (!cartTotal) return;

    const total = this.selectedTests.reduce((sum, testId) => {
      const test = this.tests.find(t => t.id == testId);
      return sum + (test ? test.price : 0);
    }, 0);

    cartTotal.textContent = `₹${total}`;
  }

  bookTests() {
    if (this.selectedTests.length === 0) {
      alert('Please select at least one test');
      return;
    }

    const testForm = document.getElementById('testBookingForm');
    if (!testForm) {
      alert('Tests selected. Proceeding to checkout...');
      return;
    }

    const formData = new FormData(testForm);
    const testData = {
      patientName: formData.get('patientName'),
      patientEmail: formData.get('patientEmail'),
      patientPhone: formData.get('patientPhone'),
      tests: this.selectedTests,
      sampleCollectionDate: formData.get('sampleCollectionDate'),
      address: formData.get('address'),
      timestamp: new Date().toISOString()
    };

    console.log('Test booking submitted:', testData);
    alert('Your test booking has been confirmed! You will receive a confirmation email shortly.');
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new AppointmentBooking();
    new OnlineTestBooking();
  });
} else {
  new AppointmentBooking();
  new OnlineTestBooking();
}
