/* Popup Modal JavaScript */

(function() {
  'use strict';

  // Configuration
  const SCROLL_THRESHOLD = 0.6; // 60% scroll
  let scrollPopupShown = false;

  // DOM Elements
  const touchBtn = document.querySelector('.btn-cta-contact');
  const tourBtn = document.querySelector('.book-showing-trigger');
  const form = document.getElementById('property-lead-form');

  // Modal Elements
  let touchModal = null;
  let tourModal = null;

  // Initialize
  function init() {
    createModals();
    attachEventListeners();
    setupScrollListener();
  }

  // Create modal elements
  function createModals() {
    // Get in Touch Modal
    touchModal = document.createElement('div');
    touchModal.id = 'touch-modal';
    touchModal.className = 'modal-overlay';
    touchModal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">Get in Touch</h2>
          <button class="modal-close" aria-label="Close">&times;</button>
        </div>
        <div class="modal-body">
          <form class="contact-modal-form" id="touch-form">
            <div class="form-group">
              <label for="touch-first-name">First Name *</label>
              <input type="text" id="touch-first-name" name="first_name" placeholder="Your First Name" required>
            </div>
            <div class="form-group">
              <label for="touch-last-name">Last Name *</label>
              <input type="text" id="touch-last-name" name="last_name" placeholder="Your Last Name" required>
            </div>
            <div class="form-group">
              <label for="touch-email">Email *</label>
              <input type="email" id="touch-email" name="email" placeholder="Your Email" required>
            </div>
            <div class="form-group">
              <label for="touch-phone">Phone *</label>
              <input type="text" id="touch-phone" name="phone" placeholder="Your Phone Number" required>
            </div>
            <div class="form-group">
              <label for="touch-message">Message *</label>
              <textarea id="touch-message" name="message" placeholder="Your Message" required></textarea>
            </div>
            <div class="form-actions">
              <button type="submit" class="form-submit">Send Message</button>
            </div>
          </form>
        </div>
      </div>
    `;
    document.body.appendChild(touchModal);

    // Schedule a Tour Modal
    tourModal = document.createElement('div');
    tourModal.id = 'tour-modal';
    tourModal.className = 'modal-overlay';
    tourModal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">Schedule a Tour</h2>
          <button class="modal-close" aria-label="Close">&times;</button>
        </div>
        <div class="modal-body">
          <form class="tour-modal-form" id="tour-form">
            <div class="form-group">
              <label for="tour-first-name">First Name *</label>
              <input type="text" id="tour-first-name" name="first_name" placeholder="Your First Name" required>
            </div>
            <div class="form-group">
              <label for="tour-last-name">Last Name *</label>
              <input type="text" id="tour-last-name" name="last_name" placeholder="Your Last Name" required>
            </div>
            <div class="form-group">
              <label for="tour-email">Email *</label>
              <input type="email" id="tour-email" name="email" placeholder="Your Email" required>
            </div>
            <div class="form-group">
              <label for="tour-phone">Phone *</label>
              <input type="text" id="tour-phone" name="phone" placeholder="Your Phone Number" required>
            </div>
            <div class="form-group">
              <label for="tour-date">Preferred Date *</label>
              <input type="date" id="tour-date" name="date" required>
            </div>
            <div class="form-group">
              <label for="tour-time">Preferred Time *</label>
              <select id="tour-time" name="time" required>
                <option value="">Select a time</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="12:00">12:00 PM</option>
                <option value="13:00">1:00 PM</option>
                <option value="14:00">2:00 PM</option>
                <option value="15:00">3:00 PM</option>
                <option value="16:00">4:00 PM</option>
                <option value="17:00">5:00 PM</option>
              </select>
            </div>
            <div class="form-group">
              <label for="tour-message">Additional Notes</label>
              <textarea id="tour-message" name="message" placeholder="Any special requests?"></textarea>
            </div>
            <div class="form-actions">
              <button type="submit" class="form-submit">Schedule Tour</button>
            </div>
          </form>
        </div>
      </div>
    `;
    document.body.appendChild(tourModal);
  }

  // Attach event listeners
  function attachEventListeners() {
    // Get in Touch button
    if (touchBtn) {
      touchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(touchModal);
      });
    }

    // Schedule a Tour button
    if (tourBtn) {
      tourBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(tourModal);
      });
    }

    // Close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal-overlay');
        if (modal) closeModal(modal);
      });
    });

    // Close on overlay click
    [touchModal, tourModal].forEach(modal => {
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            closeModal(modal);
          }
        });
      }
    });

    // Form submissions
    const touchForm = document.getElementById('touch-form');
    const tourForm = document.getElementById('tour-form');

    if (touchForm) {
      touchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleFormSubmit('touch');
      });
    }

    if (tourForm) {
      tourForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleFormSubmit('tour');
      });
    }

    // Keyboard close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal(touchModal);
        closeModal(tourModal);
      }
    });
  }

  // Open modal
  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Close modal
  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  // Setup scroll listener for 60% threshold
  function setupScrollListener() {
    window.addEventListener('scroll', () => {
      if (scrollPopupShown) return;

      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

      if (scrollPercent >= (SCROLL_THRESHOLD * 100)) {
        scrollPopupShown = true;
        showScrollIndicator();
        
        // Auto-open popup after 3 seconds if user hasn't dismissed
        setTimeout(() => {
          const indicator = document.querySelector('.scroll-indicator');
          if (indicator && indicator.classList.contains('show')) {
            openModal(touchModal);
            indicator.remove();
          }
        }, 3000);
      }
    });
  }

  // Show scroll indicator
  function showScrollIndicator() {
    const existing = document.querySelector('.scroll-indicator');
    if (existing) return;

    const indicator = document.createElement('div');
    indicator.className = 'scroll-indicator show';
    indicator.innerHTML = '📝 Get in Touch?<br><small>Click here</small>';
    indicator.addEventListener('click', () => {
      openModal(touchModal);
      indicator.remove();
    });

    // Auto-remove after 5 seconds if not clicked
    setTimeout(() => {
      if (indicator.parentNode) {
        indicator.remove();
      }
    }, 5000);

    document.body.appendChild(indicator);
  }

  // Handle form submission
  function handleFormSubmit(formType) {
    // Here you would typically send the data to your server
    // For now, we'll just show a success message
    alert(`${formType === 'touch' ? 'Thank you! We\'ll be in touch soon.' : 'Tour scheduled! Check your email for confirmation.'}`);
    
    const modal = formType === 'touch' ? touchModal : tourModal;
    const form = formType === 'touch' ? document.getElementById('touch-form') : document.getElementById('tour-form');
    
    form.reset();
    closeModal(modal);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
