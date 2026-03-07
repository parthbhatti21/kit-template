/* Skylight Modal Handler */

(function() {
  'use strict';

  function initSkylightModal() {
    const skylightBtn = document.getElementById('skylight-btn');
    
    if (!skylightBtn) return;

    skylightBtn.addEventListener('click', function(e) {
      e.preventDefault();
      openSkylightModal();
    });
  }

  function openSkylightModal() {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'skylight-modal-overlay';
    overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 9999; animation: fadeIn 0.3s ease-out;';
    
    // Create modal content
    const modal = document.createElement('div');
    modal.className = 'skylight-modal-content';
    modal.style.cssText = 'position: relative; background: white; border-radius: 8px; padding: 40px; max-width: 500px; width: 90%; max-height: 80vh; overflow-y: auto; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3); animation: slideIn 0.3s ease-out;';
    
    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = 'position: absolute; top: 15px; right: 20px; background: none; border: none; font-size: 28px; cursor: pointer; color: #666; padding: 0; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;';
    closeBtn.addEventListener('click', closeModal);
    
    // Modal title
    const title = document.createElement('h2');
    title.textContent = 'Get Skylight for Your Listings';
    title.style.cssText = 'margin: 0 0 20px 0; font-size: 24px; color: #2d3e50; font-weight: 700;';
    
    // Modal body
    const body = document.createElement('div');
    body.style.cssText = 'margin-bottom: 25px; color: #555; line-height: 1.6; font-size: 14px;';
    body.innerHTML = `
      <p>Transform your property listings with <strong>Skylight</strong> - the leading platform for real estate professionals.</p>
      <p><strong>Benefits:</strong></p>
      <ul style="margin: 10px 0; padding-left: 20px;">
        <li>Interactive virtual tours</li>
        <li>Professional photography showcase</li>
        <li>Advanced property analytics</li>
        <li>Lead generation tools</li>
        <li>Mobile-optimized listings</li>
      </ul>
      <p>Learn more about how Skylight can help you sell faster and reach more buyers.</p>
    `;
    
    // Form
    const form = document.createElement('form');
    form.style.cssText = 'display: flex; flex-direction: column; gap: 15px;';
    
    // Name input
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = 'Full Name';
    nameInput.required = true;
    nameInput.style.cssText = 'padding: 10px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; font-family: inherit;';
    
    // Email input
    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.placeholder = 'Email Address';
    emailInput.required = true;
    emailInput.style.cssText = 'padding: 10px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; font-family: inherit;';
    
    // Phone input
    const phoneInput = document.createElement('input');
    phoneInput.type = 'tel';
    phoneInput.placeholder = 'Phone Number';
    phoneInput.required = true;
    phoneInput.style.cssText = 'padding: 10px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; font-family: inherit;';
    
    // Message input
    const messageInput = document.createElement('textarea');
    messageInput.placeholder = 'Tell us about your business';
    messageInput.rows = 4;
    messageInput.style.cssText = 'padding: 10px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; font-family: inherit; resize: vertical;';
    
    // Submit button
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.textContent = 'Get Started';
    submitBtn.style.cssText = 'padding: 12px 30px; background: linear-gradient(135deg, #4a7c8c, #2d5a6f); color: white; border: none; border-radius: 4px; font-weight: 700; cursor: pointer; transition: opacity 0.3s; font-size: 14px;';
    submitBtn.onmouseover = function() { this.style.opacity = '0.9'; };
    submitBtn.onmouseout = function() { this.style.opacity = '1'; };
    
    // Form submission
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Thank you! We will contact you shortly about Skylight for your listings.');
      closeModal();
    });
    
    form.appendChild(nameInput);
    form.appendChild(emailInput);
    form.appendChild(phoneInput);
    form.appendChild(messageInput);
    form.appendChild(submitBtn);
    
    // Add styles to document
    addModalStyles();
    
    // Assemble modal
    modal.appendChild(closeBtn);
    modal.appendChild(title);
    modal.appendChild(body);
    modal.appendChild(form);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Close on overlay click
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        closeModal();
      }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeModal();
      }
    });
  }

  function closeModal() {
    const overlay = document.querySelector('.skylight-modal-overlay');
    if (overlay) {
      overlay.style.animation = 'fadeOut 0.3s ease-out';
      setTimeout(() => overlay.remove(), 300);
    }
  }

  function addModalStyles() {
    if (document.getElementById('skylight-modal-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'skylight-modal-styles';
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateY(-50px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
      
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      
      @keyframes fadeOut {
        from {
          opacity: 1;
        }
        to {
          opacity: 0;
        }
      }
      
      .skylight-modal-content ul {
        list-style: disc;
      }
      
      .skylight-modal-content li {
        margin-bottom: 8px;
      }
    `;
    document.head.appendChild(style);
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSkylightModal);
  } else {
    initSkylightModal();
  }
})();
