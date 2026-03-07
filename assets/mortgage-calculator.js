(function() {
  'use strict';

  // ===== CONFIGURATION =====
  const CONFIG = {
    defaultPrice: 450000,
    defaultDownPercent: 20,
    defaultRate: 6.5,
    defaultTerm: 30,
    minPrice: 50000,
    maxPrice: 2000000,
    minRate: 0.1,
    maxRate: 15,
    minTerm: 5,
    maxTerm: 50
  };

  // ===== DOM ELEMENTS =====
  const DOM = {
    // Inputs
    price: document.getElementById('mortgage-price'),
    downPayment: document.getElementById('mortgage-down-payment'),
    downPercent: document.getElementById('mortgage-down-percent'),
    rate: document.getElementById('mortgage-rate'),
    term: document.getElementById('mortgage-term'),
    hoa: document.getElementById('mortgage-hoa'),
    propertyTax: document.getElementById('mortgage-property-tax'),
    priceSlider: document.getElementById('mortgage-price-slider'),
    downPercentSlider: document.getElementById('mortgage-down-percent-slider'),
    rateSlider: document.getElementById('mortgage-rate-slider'),
    termButtons: document.querySelectorAll('.mortgage-term-btn-premium'),

    // Displays
    loanAmount: document.getElementById('mortgage-loan-amount'),
    pi: document.getElementById('mortgage-pi'),
    otherCosts: document.getElementById('mortgage-other-costs'),
    totalMonthly: document.getElementById('mortgage-total-monthly'),
    totalInterest: document.getElementById('mortgage-total-interest'),
    totalPaid: document.getElementById('mortgage-total-paid'),
    chartLegend: document.getElementById('mortgage-chart-legend'),

    // Canvas
    chartCanvas: document.getElementById('mortgage-pie-chart'),
    chartCtx: null
  };

  // Initialize canvas context
  if (DOM.chartCanvas) {
    DOM.chartCtx = DOM.chartCanvas.getContext('2d');
  }

  // ===== UTILITY FUNCTIONS =====
  function formatCurrency(num) {
    return Math.round(num).toLocaleString('en-US');
  }

  function validateInput(value, min, max) {
    value = parseFloat(value) || 0;
    return Math.max(min, Math.min(max, value));
  }

  // Amortization formula
  function calculateMonthlyPayment(principal, annualRate, years) {
    if (principal <= 0 || years <= 0) return 0;

    const monthlyRate = (annualRate / 100) / 12;
    const numberOfPayments = years * 12;

    if (monthlyRate === 0) {
      return principal / numberOfPayments;
    }

    const rate1 = Math.pow(1 + monthlyRate, numberOfPayments);
    return (principal * (monthlyRate * rate1)) / (rate1 - 1);
  }

  // ===== CALCULATION LOGIC =====
  function calculate() {
    // Get and validate inputs
    const price = validateInput(DOM.price.value, CONFIG.minPrice, CONFIG.maxPrice);
    const downPercent = validateInput(DOM.downPercent.value, 0, 100);
    const rate = validateInput(DOM.rate.value, CONFIG.minRate, CONFIG.maxRate);
    const term = validateInput(DOM.term.value, CONFIG.minTerm, CONFIG.maxTerm);
    const hoa = validateInput(DOM.hoa.value, 0, Infinity);
    const propertyTax = validateInput(DOM.propertyTax.value, 0, Infinity);

    // Derived values
    const downPayment = (price * downPercent) / 100;
    const loanAmount = price - downPayment;
    const monthlyPI = calculateMonthlyPayment(loanAmount, rate, term);
    const monthlyTax = propertyTax / 12;
    const monthlyHOA = hoa;
    const totalMonthlyPayment = monthlyPI + monthlyTax + monthlyHOA;

    // Totals
    const totalLoanPayments = monthlyPI * (term * 12);
    const totalInterest = totalLoanPayments - loanAmount;
    const totalAmountPaid =
      totalLoanPayments +
      (propertyTax * term) +
      (monthlyHOA * term * 12);

    updateDisplayValues({
      loanAmount,
      monthlyPI,
      monthlyTax,
      monthlyHOA,
      totalMonthlyPayment,
      totalInterest,
      totalAmountPaid,
      downPayment
    });

    if (DOM.chartCtx && totalMonthlyPayment > 0) {
      drawPieChart(DOM.chartCtx, monthlyPI, monthlyTax, monthlyHOA);
      updateChartLegend(monthlyPI, monthlyTax, monthlyHOA, totalMonthlyPayment);
    }
  }

  function updateDisplayValues(values) {
    const {
      loanAmount,
      monthlyPI,
      monthlyTax,
      monthlyHOA,
      totalMonthlyPayment,
      totalInterest,
      totalAmountPaid,
      downPayment
    } = values;

    DOM.loanAmount.textContent = formatCurrency(loanAmount);
    DOM.downPayment.value = Math.round(downPayment);

    DOM.pi.textContent = formatCurrency(monthlyPI);
    DOM.otherCosts.textContent = formatCurrency(monthlyTax + monthlyHOA);
    DOM.totalMonthly.textContent = formatCurrency(totalMonthlyPayment);
    DOM.totalInterest.textContent = formatCurrency(totalInterest);
    DOM.totalPaid.textContent = formatCurrency(totalAmountPaid);
  }

  // ===== PIE CHART =====
  function drawPieChart(ctx, piAmount, taxAmount, hoaAmount) {
    const total = piAmount + taxAmount + hoaAmount;
    if (total <= 0) return;

    const canvas = DOM.chartCanvas;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) / 2 - 20;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const segments = [
      { amount: piAmount, color: '#1a3d4d', label: 'P & I' },
      { amount: taxAmount, color: '#4a7c8c', label: 'Tax' },
      { amount: hoaAmount, color: '#a8c5d1', label: 'HOA' }
    ];

    let currentAngle = -Math.PI / 2;
    const whiteSpace = 2;

    segments.forEach(segment => {
      if (segment.amount <= 0) {
        return;
      }

      const sliceAngle = (segment.amount / total) * 2 * Math.PI;

      ctx.fillStyle = segment.color;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(
        centerX,
        centerY,
        radius,
        currentAngle,
        currentAngle + sliceAngle - (whiteSpace / radius)
      );
      ctx.lineTo(centerX, centerY);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#f9f8f6';
      ctx.lineWidth = 3;
      ctx.stroke();

      currentAngle += sliceAngle;
    });

    ctx.fillStyle = '#1a3d4d';
    ctx.font = 'bold 16px "Lato", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Monthly', centerX, centerY - 8);
    ctx.fillText('Payment', centerX, centerY + 8);
  }

  function updateChartLegend(piAmount, taxAmount, hoaAmount, total) {
    const piPercent = total > 0 ? ((piAmount / total) * 100).toFixed(1) : 0;
    const taxPercent = total > 0 ? ((taxAmount / total) * 100).toFixed(1) : 0;
    const hoaPercent = total > 0 ? ((hoaAmount / total) * 100).toFixed(1) : 0;

    let legendHtml = `
      <div class="mortgage-legend-item">
        <div class="mortgage-legend-swatch mortgage-legend-swatch--pi"></div>
        <span class="mortgage-legend-text"><strong>P &amp; I:</strong> $${formatCurrency(piAmount)}</span>
        <span class="mortgage-legend-percent">${piPercent}%</span>
      </div>
      <div class="mortgage-legend-item">
        <div class="mortgage-legend-swatch mortgage-legend-swatch--tax"></div>
        <span class="mortgage-legend-text"><strong>Tax:</strong> $${formatCurrency(taxAmount)}</span>
        <span class="mortgage-legend-percent">${taxPercent}%</span>
      </div>
    `;

    if (hoaAmount > 0) {
      legendHtml += `
        <div class="mortgage-legend-item">
          <div class="mortgage-legend-swatch mortgage-legend-swatch--hoa"></div>
          <span class="mortgage-legend-text"><strong>HOA:</strong> $${formatCurrency(hoaAmount)}</span>
          <span class="mortgage-legend-percent">${hoaPercent}%</span>
        </div>
      `;
    }

    DOM.chartLegend.innerHTML = legendHtml;
  }

  // ===== SLIDER PROGRESS =====
  function updateSliderProgress(slider) {
    if (!slider) return;
    
    const min = parseFloat(slider.min) || 0;
    const max = parseFloat(slider.max) || 100;
    const value = parseFloat(slider.value) || min;
    const percent = ((value - min) / (max - min)) * 100;
    
    slider.style.background = `linear-gradient(
      to right,
      var(--mortgage-accent-soft) 0%,
      var(--mortgage-accent-soft) ${percent}%,
      #d9d6cf ${percent}%,
      #d9d6cf 100%
    )`;
  }

  // ===== EVENTS & INTERACTION =====
  function syncInput(input, slider) {
    if (!input || !slider) return;

    input.addEventListener('input', function() {
      slider.value = this.value;
      updateSliderProgress(slider);
      calculate();
    });

    slider.addEventListener('input', function() {
      input.value = this.value;
      updateSliderProgress(slider);
      calculate();
    });
  }

  function setupEventListeners() {
    syncInput(DOM.price, DOM.priceSlider);
    syncInput(DOM.downPercent, DOM.downPercentSlider);
    syncInput(DOM.rate, DOM.rateSlider);

    if (DOM.downPayment) {
      DOM.downPayment.addEventListener('input', function() {
        const downPayment = parseFloat(this.value) || 0;
        const price = parseFloat(DOM.price.value) || 0;
        const downPercent = price > 0 ? (downPayment / price) * 100 : 0;

        DOM.downPercent.value = Math.round(downPercent);
        if (DOM.downPercentSlider) {
          DOM.downPercentSlider.value = downPercent;
          updateSliderProgress(DOM.downPercentSlider);
        }

        calculate();
      });
    }

    if (DOM.termButtons && DOM.termButtons.length) {
      DOM.termButtons.forEach(btn => {
        btn.addEventListener('click', function() {
          const term = this.getAttribute('data-term');
          if (!term) return;

          DOM.term.value = term;

          DOM.termButtons.forEach(b => {
            if (b.getAttribute('data-term') === term) {
              b.classList.add('active');
            } else {
              b.classList.remove('active');
            }
          });

          calculate();
        });
      });
    }

    if (DOM.term) {
      DOM.term.addEventListener('input', calculate);
    }
    if (DOM.hoa) {
      DOM.hoa.addEventListener('input', calculate);
    }
    if (DOM.propertyTax) {
      DOM.propertyTax.addEventListener('input', calculate);
    }
  }

  function setupInputStyles() {
    const inputs = document.querySelectorAll('.mortgage-input-premium');
    inputs.forEach(input => {
      input.addEventListener('focus', function() {
        this.classList.add('is-focused');
      });
      input.addEventListener('blur', function() {
        this.classList.remove('is-focused');
      });
    });
  }

  // ===== INITIALIZATION =====
  function init() {
    if (!DOM.price || !DOM.rate) {
      return;
    }

    // Initialize slider progress
    updateSliderProgress(DOM.priceSlider);
    updateSliderProgress(DOM.downPercentSlider);
    updateSliderProgress(DOM.rateSlider);

    setupEventListeners();
    setupInputStyles();
    calculate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

