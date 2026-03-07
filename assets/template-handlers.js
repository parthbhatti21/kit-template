/* Template Handlers: Overlays and Email Forms */

(function() {
  'use strict';

  function initHandlers() {
    initOverlayButtons();
    initEmailForms();
    initMainGalleryButton();
  }

  // Main gallery button handler
  function initMainGalleryButton() {
    const mainGalleryBtn = document.querySelector('.main-gallery-cta');
    
    if (mainGalleryBtn) {
      mainGalleryBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const firstImage = document.querySelector('button[data="ps-open"][data-ps-url]');
        if (firstImage) {
          // Trigger the click to open PhotoSwipe
          firstImage.click();
        }
      });
    }
  }

  // Overlay button handler - using event delegation
  function initOverlayButtons() {
    document.addEventListener('click', function(e) {
      const overlayTarget = e.target.closest('[overlay-target]');
      if (overlayTarget) {
        e.preventDefault();
        const targetId = overlayTarget.getAttribute('overlay-target');
        showOverlay(targetId);
      }

      const closeBtn = e.target.closest('.close-overlay');
      if (closeBtn) {
        e.preventDefault();
        closeAllOverlays();
      }
    });

    // Close on escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeAllOverlays();
      }
    });
  }

  function showOverlay(targetId) {
    closeAllOverlays();
    const overlay = document.getElementById('overlay-description');
    if (!overlay) {
      console.warn('Overlay not found:', targetId);
      return;
    }
    
    overlay.style.display = 'flex';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.zIndex = '10000';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.7)';
    overlay.style.animation = 'fadeIn 0.3s ease-out';
    
    // Hide all content items
    const items = overlay.querySelectorAll('.overlay-content-item');
    items.forEach(item => item.style.display = 'none');
    
    // Show selected content
    const target = overlay.querySelector(`[overlay-content="${targetId}"]`);
    if (target) {
      target.style.display = 'block';
      const inner = overlay.querySelector('.inner');
      if (inner) {
        inner.style.background = 'white';
        inner.style.borderRadius = '8px';
        inner.style.padding = '40px';
        inner.style.maxWidth = '600px';
        inner.style.width = '90%';
        inner.style.maxHeight = '80vh';
        inner.style.overflow = 'auto';
        inner.style.position = 'relative';
        inner.style.animation = 'slideIn 0.3s ease-out';
      }
    }
  }

  function closeAllOverlays() {
    const overlay = document.getElementById('overlay-description');
    if (overlay) {
      overlay.style.display = 'none';
    }
  }

  // Email form handler
  function initEmailForms() {
    document.addEventListener('submit', function(e) {
      if (e.target.id === 'docs-email-form') {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        alert('Documents will be sent to ' + email + ' shortly!');
        e.target.reset();
      } else if (e.target.id === 'brochure-email-form') {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        alert('Brochure will be sent to ' + email + ' shortly!');
        e.target.reset();
      }
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHandlers);
  } else {
    initHandlers();
  }
})();
