/* Mortgage Calculator Action Buttons Handler */

(function() {
  'use strict';

  function initCalculatorButtons() {
    const buttons = document.querySelectorAll('.mortgage-cta-btn');
    
    buttons.forEach(btn => {
      if (btn.textContent.includes('Save Calculation')) {
        btn.addEventListener('click', openSaveCalculationModal);
      } else if (btn.textContent.includes('Get Pre-Qualified')) {
        btn.addEventListener('click', openPreQualifiedModal);
      }
    });
  }

  function getCalculatorData() {
    return {
      price: document.getElementById('mortgage-price')?.value || '0',
      downPayment: document.getElementById('mortgage-down-payment')?.value || '0',
      downPercent: document.getElementById('mortgage-down-percent')?.value || '0',
      rate: document.getElementById('mortgage-rate')?.value || '0',
      term: document.getElementById('mortgage-term')?.value || '30',
      hoa: document.getElementById('mortgage-hoa')?.value || '0',
      propertyTax: document.getElementById('mortgage-property-tax')?.value || '0',
      monthlyPayment: document.getElementById('mortgage-total-monthly')?.textContent || '0',
      totalInterest: document.getElementById('mortgage-total-interest')?.textContent || '0',
      totalPaid: document.getElementById('mortgage-total-paid')?.textContent || '0'
    };
  }

  function openSaveCalculationModal() {
    const data = getCalculatorData();
    const modal = createModal('Save Your Calculation', true, data);
    document.body.appendChild(modal);
  }

  function openPreQualifiedModal() {
    const modal = createModal('Get Pre-Qualified', false);
    document.body.appendChild(modal);
  }

  function createModal(title, isSave, calculatorData = null) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'calc-modal-overlay';
    overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 9999; animation: fadeIn 0.3s ease-out;';
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'calc-modal-content';
    modal.style.cssText = 'position: relative; background: white; border-radius: 8px; padding: 40px; max-width: 550px; width: 90%; max-height: 85vh; overflow-y: auto; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3); animation: slideIn 0.3s ease-out;';
    
    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = 'position: absolute; top: 15px; right: 20px; background: none; border: none; font-size: 28px; cursor: pointer; color: #666; padding: 0; width: 30px; height: 30px;';
    closeBtn.addEventListener('click', () => closeModals());
    
    // Title
    const titleEl = document.createElement('h2');
    titleEl.textContent = title;
    titleEl.style.cssText = 'margin: 0 0 25px 0; font-size: 24px; color: #2d3e50; font-weight: 700;';
    
    // Content
    const contentDiv = document.createElement('div');
    
    if (isSave) {
      // Save calculation - show data and export option
      const dataDisplay = document.createElement('div');
      dataDisplay.style.cssText = 'background: #f8f9fa; padding: 20px; border-radius: 6px; margin-bottom: 20px; font-size: 13px;';
      dataDisplay.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div>
            <div style="color: #666; font-weight: 600; margin-bottom: 5px;">Property Price</div>
            <div style="font-size: 16px; color: #2d3e50; font-weight: 700;">$${parseFloat(calculatorData.price).toLocaleString()}</div>
          </div>
          <div>
            <div style="color: #666; font-weight: 600; margin-bottom: 5px;">Down Payment</div>
            <div style="font-size: 16px; color: #2d3e50; font-weight: 700;">$${parseFloat(calculatorData.downPayment).toLocaleString()} (${calculatorData.downPercent}%)</div>
          </div>
          <div>
            <div style="color: #666; font-weight: 600; margin-bottom: 5px;">Interest Rate</div>
            <div style="font-size: 16px; color: #2d3e50; font-weight: 700;">${calculatorData.rate}%</div>
          </div>
          <div>
            <div style="color: #666; font-weight: 600; margin-bottom: 5px;">Loan Term</div>
            <div style="font-size: 16px; color: #2d3e50; font-weight: 700;">${calculatorData.term} Years</div>
          </div>
          <div>
            <div style="color: #666; font-weight: 600; margin-bottom: 5px;">Monthly Payment</div>
            <div style="font-size: 16px; color: #4a7c8c; font-weight: 700;">$${calculatorData.monthlyPayment}</div>
          </div>
          <div>
            <div style="color: #666; font-weight: 600; margin-bottom: 5px;">Total Interest</div>
            <div style="font-size: 16px; color: #2d3e50; font-weight: 700;">$${calculatorData.totalInterest}</div>
          </div>
        </div>
      `;
      contentDiv.appendChild(dataDisplay);
      
      // Form to send calculations
      const formLabel = document.createElement('div');
      formLabel.style.cssText = 'font-size: 13px; color: #666; font-weight: 600; margin-bottom: 15px; margin-top: 10px;';
      formLabel.textContent = 'Share these calculations to your email:';
      contentDiv.appendChild(formLabel);
      
      const form = document.createElement('form');
      form.style.cssText = 'display: flex; flex-direction: column; gap: 12px;';
      
      const emailInput = document.createElement('input');
      emailInput.type = 'email';
      emailInput.placeholder = 'Your Email Address';
      emailInput.required = true;
      emailInput.style.cssText = 'padding: 10px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;';
      
      const submitBtn = document.createElement('button');
      submitBtn.type = 'submit';
      submitBtn.textContent = 'Save & Email Calculations';
      submitBtn.style.cssText = 'padding: 12px; background: linear-gradient(135deg, #4a7c8c, #2d5a6f); color: white; border: none; border-radius: 4px; font-weight: 700; cursor: pointer; font-size: 14px;';
      
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Calculations saved and sent to ' + emailInput.value);
        closeModals();
      });
      
      form.appendChild(emailInput);
      form.appendChild(submitBtn);
      contentDiv.appendChild(form);
      
    } else {
      // Pre-qualified form
      const form = document.createElement('form');
      form.style.cssText = 'display: flex; flex-direction: column; gap: 15px;';
      
      const fields = [
        { id: 'pq-first-name', label: 'First Name', type: 'text', required: true },
        { id: 'pq-last-name', label: 'Last Name', type: 'text', required: true },
        { id: 'pq-email', label: 'Email Address', type: 'email', required: true },
        { id: 'pq-phone', label: 'Phone Number', type: 'tel', required: true },
        { id: 'pq-credit-score', label: 'Estimated Credit Score', type: 'select', 
          options: ['Select...', 'Excellent (750+)', 'Good (700-749)', 'Fair (650-699)', 'Poor (<650)'], required: true }
      ];
      
      fields.forEach(field => {
        if (field.type === 'select') {
          const wrapper = document.createElement('div');
          wrapper.style.cssText = 'display: flex; flex-direction: column; gap: 5px;';
          
          const label = document.createElement('label');
          label.textContent = field.label;
          label.style.cssText = 'font-size: 13px; font-weight: 600; color: #666;';
          
          const select = document.createElement('select');
          select.id = field.id;
          select.required = field.required;
          select.style.cssText = 'padding: 10px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;';
          
          field.options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt;
            option.textContent = opt;
            select.appendChild(option);
          });
          
          wrapper.appendChild(label);
          wrapper.appendChild(select);
          form.appendChild(wrapper);
        } else {
          const wrapper = document.createElement('div');
          wrapper.style.cssText = 'display: flex; flex-direction: column; gap: 5px;';
          
          const label = document.createElement('label');
          label.textContent = field.label;
          label.style.cssText = 'font-size: 13px; font-weight: 600; color: #666;';
          
          const input = document.createElement('input');
          input.type = field.type;
          input.id = field.id;
          input.placeholder = field.label;
          input.required = field.required;
          input.style.cssText = 'padding: 10px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;';
          
          wrapper.appendChild(label);
          wrapper.appendChild(input);
          form.appendChild(wrapper);
        }
      });
      
      const submitBtn = document.createElement('button');
      submitBtn.type = 'submit';
      submitBtn.textContent = 'Get Pre-Qualified';
      submitBtn.style.cssText = 'padding: 12px; background: linear-gradient(135deg, #4a7c8c, #2d5a6f); color: white; border: none; border-radius: 4px; font-weight: 700; cursor: pointer; font-size: 14px; margin-top: 10px;';
      
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you! A loan officer will contact you shortly.');
        closeModals();
      });
      
      form.appendChild(submitBtn);
      contentDiv.appendChild(form);
    }
    
    // Assemble modal
    modal.appendChild(closeBtn);
    modal.appendChild(titleEl);
    modal.appendChild(contentDiv);
    overlay.appendChild(modal);
    
    // Close on overlay click
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        closeModals();
      }
    });
    
    // Close on Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeModals();
      }
    });
    
    addModalStyles();
    return overlay;
  }

  function closeModals() {
    const overlays = document.querySelectorAll('.calc-modal-overlay');
    overlays.forEach(overlay => {
      overlay.style.animation = 'fadeOut 0.3s ease-out';
      setTimeout(() => overlay.remove(), 300);
    });
  }

  function addModalStyles() {
    if (document.getElementById('calc-modal-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'calc-modal-styles';
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
    `;
    document.head.appendChild(style);
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCalculatorButtons);
  } else {
    initCalculatorButtons();
  }
})();
