/**
 * ADWIN REALTY — Interactive Client Application
 * Handles filtering, currency toggles, modals, steppers, and notifications.
 * Content reflects verified Adwin Realty / Adwin Infra Realty listings (Hyderabad).
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. DATA REPOSITORY FOR PROPERTIES
  // ==========================================
  const propertyData = [
    {
      id: 1,
      title: "Sree Ananda Sai Nagar — 150 Sq. Yd",
      location: "Chintapalli Sai Baba Temple, Nagarjuna Sagar Road",
      type: "DTCP Plot",
      priceInr: "₹7,49,850",
      priceUsd: "$9,034",
      rawInr: 749850,
      rawUsd: 9034,
      area: "150 sq. yd.",
      floor: "Open plot",
      beds: "Residential",
      baths: "DTCP layout",
      image: "assets/property_1.jpg?v=20261124-2",
      badge: "DTCP Approved",
      badgeClass: "badge-blue",
      description: "A DTCP-approved residential plot in Sree Ananda Sai Nagar, just off the Nagarjuna Sagar Road near the Chintapalli Sai Baba Temple. The layout carries TLP No. 227/2021/H with premium amenities, planted avenues and spot registration available, so you can complete the purchase and start building without delay.",
      amenities: ["DTCP Approved (TLP 227/2021/H)", "Spot Registration Available", "₹4,999 per sq. yd.", "Near Chintapalli Sai Baba Temple", "Near RRR & Greenfield Highway", "Appreciation Assured"]
    },
    {
      id: 2,
      title: "Sree Ananda Sai Nagar — 250 Sq. Yd",
      location: "Chintapalli Sai Baba Temple, Nagarjuna Sagar Road",
      type: "DTCP Plot",
      priceInr: "₹12,49,750",
      priceUsd: "$15,058",
      rawInr: 1249750,
      rawUsd: 15058,
      area: "250 sq. yd.",
      floor: "Open plot",
      beds: "Residential",
      baths: "DTCP layout",
      image: "assets/property_2.jpg?v=20261124-2",
      badge: "Sandalwood",
      badgeClass: "badge-orange",
      description: "A larger plot in the same DTCP-approved Sree Ananda Sai Nagar layout, ideal for a weekend home, guest house with pool or a sandalwood plantation. Land in this corridor benefits from the Nagarjuna Sagar Highway, the Regional Ring Road and the Fourth City development, and Adwin Realty handles spot registration on your behalf.",
      amenities: ["DTCP Approved (TLP 227/2021/H)", "Plant Sandalwood Trees", "Spot Registration Available", "Weekend Home Potential", "Near Future City", "Premium Amenities"]
    },
    {
      id: 3,
      title: "Sree Ananda Sai Nagar — 500 Sq. Yd",
      location: "Chintapalli Sai Baba Temple, Nagarjuna Sagar Road",
      type: "Farm Plot",
      priceInr: "₹24,99,500",
      priceUsd: "$30,114",
      rawInr: 2499500,
      rawUsd: 30114,
      area: "500 sq. yd.",
      floor: "Farm plot",
      beds: "Farmhouse",
      baths: "DTCP layout",
      image: "assets/property_3.jpg?v=20261124-2",
      badge: "500 Sq. Yd.",
      badgeClass: "badge-dark",
      description: "Half an acre inside the Sree Ananda Sai Nagar DTCP layout — large enough for a farmhouse, pool, guest house and a working sandalwood plantation. The same TLP No. 227/2021/H approval and spot registration process applies, with the land positioned on the Nagarjuna Sagar Highway growth corridor.",
      amenities: ["DTCP Approved (TLP 227/2021/H)", "500 sq. yd. Farm Plot", "Sandalwood Farming", "Farmhouse & Pool Possible", "Spot Registration Available", "Near RRR & Fourth City"]
    },
    {
      id: 4,
      title: "Adwin Golden Meadows — Custom Villa",
      location: "Brahmanapally — Turkayamjal, Hyderabad",
      type: "Villa",
      priceInr: "On request",
      priceUsd: "On request",
      rawInr: 0,
      rawUsd: 0,
      area: "Customised",
      floor: "Villa",
      beds: "4 BHK",
      baths: "Custom build",
      image: "assets/property_4.jpg?v=20261124-2",
      badge: "Inside ORR",
      badgeClass: "badge-orange",
      description: "Adwin Golden Meadows is a future-ready villa community at Brahmanapally–Turkamjal, close to the city and inside the ORR. Villas are customised to your plan and sit within easy reach of the Nagarjuna Sagar Highway, Bharat Future City, RGIA Airport and Gachibowli.",
      amenities: ["Customised Villa Designs", "Close to the City, Inside ORR", "Near RGIA Airport", "Near Bharat Future City", "Near Gachibowli", "Nagarjuna Sagar Highway Access"]
    },
    {
      id: 6,
      title: "Farm & Cottage Land — Sagar Corridor",
      location: "Nagarjuna Sagar Highway & RRR Corridor, Hyderabad",
      type: "Farm Plot",
      priceInr: "On request",
      priceUsd: "On request",
      rawInr: 0,
      rawUsd: 0,
      area: "Farm land",
      floor: "Farm land",
      beds: "Cottages",
      baths: "Pool & guest house",
      image: "assets/property_6.jpg?v=20261124-2",
      badge: "Farm & Cottage",
      badgeClass: "badge-dark",
      description: "Farm land along the Nagarjuna Sagar Highway and Regional Ring Road corridor, suited to sandalwood farming, farmhouses, guest houses with a pool and luxury cottages. Land in this belt benefits from the Fourth City and Future City corridors and from the Hyderabad–Amaravati link road.",
      amenities: ["Sandalwood Farming", "Guest House with Pool", "Luxury Cottages", "Near RRR", "Near Fourth City & Future City", "Hyderabad–Amaravati Corridor"]
    }
  ];

  // How it works steps data
  const howItWorksSteps = [
    {
      title: "Request & requirements",
      desc: "Tell us whether you are looking for an open plot in the Sagar Highway corridor or a custom villa inside the ORR. We map your budget, preferred layout and timeline before suggesting an option."
    },
    {
      title: "Property selection",
      desc: "Adwin Realty advisors share our live DTCP and HMDA approved layouts, with plot sizes, road widths, amenities and pricing confirmed before you visit. Site visits to Sree Ananda Sai Nagar and Adwin Golden Meadows are arranged on request."
    },
    {
      title: "Approvals & documentation",
      desc: "Every layout we market carries its approval reference — TLP No. 227/2021/H for Sree Ananda Sai Nagar, HMDA and DTCP approvals elsewhere — along with title documents, layout plans and payment schedules you can verify."
    },
    {
      title: "Spot registration & possession",
      desc: "Spot registration is available on our plots, so the deed and registration happen quickly at the sub-registrar. From there we help with the handover, plantation for sandalwood plots and ongoing support after you take possession."
    }
  ];

  // ==========================================
  // 2. CURRENCY TOGGLE (INR vs USD)
  // ==========================================
  let currentCurrency = 'INR';
  const currButtons = document.querySelectorAll('.curr-btn');

  function updateCurrency(currency) {
    currentCurrency = currency;
    currButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.curr === currency);
    });

    // Update Property Grid prices
    document.querySelectorAll('.property-card').forEach(card => {
      const priceEl = card.querySelector('.card-price');
      if (priceEl) {
        priceEl.textContent = currency === 'INR' ? priceEl.dataset.inr : priceEl.dataset.usd;
      }
    });

    // Update Investment prices
    document.querySelectorAll('.inv-price').forEach(el => {
      el.textContent = currency === 'INR' ? el.dataset.inr : el.dataset.usd;
    });

    showToast(`Currency switched to ${currency === 'INR' ? 'Indian Rupee (₹)' : 'US Dollar ($)'} — indicative rates`);
  }

  currButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      updateCurrency(btn.dataset.curr);
    });
  });

  // ==========================================
  // 3. SEARCH & FILTER LOGIC
  // ==========================================
  const filterTabs = document.querySelectorAll('.filter-tab');
  const locationSelect = document.getElementById('locationSelect');
  const propertyTypeSelect = document.getElementById('propertyTypeSelect');
  const priceRangeSelect = document.getElementById('priceRangeSelect');
  const sizeSelect = document.getElementById('sizeSelect');
  const toggleMoreOptions = document.getElementById('toggleMoreOptions');
  const moreOptionsPanel = document.getElementById('moreOptionsPanel');
  const clearFiltersBtn = document.getElementById('clearFiltersBtn');
  const showPropertiesBtn = document.getElementById('showPropertiesBtn');
  const propertiesCount = document.getElementById('propertiesCount');
  const statusHint = document.getElementById('statusHint');
  const noResultsMsg = document.getElementById('noResultsMsg');
  const propertyCards = document.querySelectorAll('.property-card');

  // Active tab types (comma separated list, or 'all')
  let activeTabTypes = 'all';

  // Category Tabs
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      activeTabTypes = tab.dataset.types || 'all';
      applyFilters();
    });
  });

  // More options drawer toggle
  if (toggleMoreOptions && moreOptionsPanel) {
    toggleMoreOptions.addEventListener('click', () => {
      const isOpen = moreOptionsPanel.classList.toggle('open');
      toggleMoreOptions.setAttribute('aria-expanded', isOpen);
      toggleMoreOptions.innerHTML = isOpen
        ? `<span class="plus-icon">−</span> Less options`
        : `<span class="plus-icon">+</span> More options`;
    });
  }

  function applyFilters() {
    const loc = locationSelect ? locationSelect.value : 'all';
    const type = propertyTypeSelect ? propertyTypeSelect.value : 'all';
    const price = priceRangeSelect ? priceRangeSelect.value : 'all';
    const size = sizeSelect ? sizeSelect.value : 'all';

    const checkedApprovals = Array.from(document.querySelectorAll('input[name="approval"]:checked')).map(i => i.value);
    const checkedAmenities = Array.from(document.querySelectorAll('input[name="amenity"]:checked')).map(i => i.value);

    const tabTypes = activeTabTypes === 'all' ? null : activeTabTypes.split(',');
    let visibleCount = 0;

    propertyCards.forEach(card => {
      const cardLoc = card.dataset.location;
      const cardType = card.dataset.type;
      const cardPriceInr = parseInt(card.dataset.priceInr, 10);
      const cardSize = parseInt(card.dataset.size, 10);
      const cardText = (card.textContent || '').toLowerCase();

      let matchLoc = (loc === 'all' || cardLoc === loc);
      let matchType = (type === 'all' || cardType === type);
      let matchTab = (!tabTypes || tabTypes.includes(cardType));

      let matchPrice = true;
      if (cardPriceInr > 0) {
        if (price === 'tier1') matchPrice = cardPriceInr <= 1000000;
        else if (price === 'tier2') matchPrice = cardPriceInr > 1000000 && cardPriceInr <= 2500000;
        else if (price === 'tier3') matchPrice = cardPriceInr > 2500000 && cardPriceInr <= 5000000;
        else if (price === 'tier4') matchPrice = cardPriceInr > 5000000;
      }

      let matchSize = true;
      if (cardSize > 0) {
        if (size === 'small') matchSize = cardSize <= 150;
        else if (size === 'medium') matchSize = cardSize > 150 && cardSize <= 250;
        else if (size === 'large') matchSize = cardSize > 250 && cardSize <= 500;
        else if (size === 'xl') matchSize = cardSize > 500;
      }

      // Approval & amenity chips match against visible card text
      let matchApprovals = true;
      if (checkedApprovals.length) {
        matchApprovals = checkedApprovals.some(key => {
          if (key === 'dtcp') return cardText.includes('dtcp');
          if (key === 'hmda') return cardText.includes('hmda');
          if (key === 'spot') return cardText.includes('spot registration');
          return false;
        });
      }

      let matchAmenities = true;
      if (checkedAmenities.length) {
        matchAmenities = checkedAmenities.some(key => {
          if (key === 'sandalwood') return cardText.includes('sandalwood');
          if (key === 'highway') return cardText.includes('sagar highway');
          if (key === 'orr') return cardText.includes('inside the orr') || cardText.includes('inside orr');
          if (key === 'future') return cardText.includes('future city');
          return false;
        });
      }

      if (matchLoc && matchType && matchTab && matchPrice && matchSize && matchApprovals && matchAmenities) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (propertiesCount) propertiesCount.textContent = visibleCount;
    if (statusHint) statusHint.textContent = `Showing ${visibleCount} verified Hyderabad listings`;

    if (noResultsMsg) {
      noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  // Bind change events
  [locationSelect, propertyTypeSelect, priceRangeSelect, sizeSelect].forEach(select => {
    if (select) select.addEventListener('change', applyFilters);
  });

  // Approval / amenity checkboxes
  document.querySelectorAll('.more-options-panel input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', applyFilters);
  });

  // Clear filters
  function resetAllFilters() {
    if (locationSelect) locationSelect.value = 'all';
    if (propertyTypeSelect) propertyTypeSelect.value = 'all';
    if (priceRangeSelect) priceRangeSelect.value = 'all';
    if (sizeSelect) sizeSelect.value = 'all';
    document.querySelectorAll('.more-options-panel input[type="checkbox"]').forEach(cb => { cb.checked = false; });
    filterTabs.forEach((t, i) => {
      t.classList.toggle('active', i === 0);
      t.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    });
    activeTabTypes = 'all';
    applyFilters();
    showToast('Filters reset to default view');
  }

  if (clearFiltersBtn) clearFiltersBtn.addEventListener('click', resetAllFilters);
  const resetBtn = document.getElementById('resetFiltersBtn');
  if (resetBtn) resetBtn.addEventListener('click', resetAllFilters);

  if (showPropertiesBtn) {
    showPropertiesBtn.addEventListener('click', () => {
      const grid = document.getElementById('propertiesGrid');
      if (grid) {
        grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // Dropdown nav links filter directly
  document.querySelectorAll('[data-filter-location]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const locTarget = link.getAttribute('data-filter-location');
      if (locationSelect) {
        locationSelect.value = locTarget;
        applyFilters();
      }
      const propSec = document.getElementById('properties');
      if (propSec) propSec.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // ==========================================
  // 4. "HOW IT WORKS" DYNAMIC STEPPER
  // ==========================================
  const stepperItems = document.querySelectorAll('.hw-stepper-item');
  const hwStepTitle = document.getElementById('hwStepTitle');
  const hwStepDesc = document.getElementById('hwStepDesc');

  stepperItems.forEach(item => {
    item.addEventListener('click', () => {
      const stepIdx = parseInt(item.dataset.step, 10);
      stepperItems.forEach(s => s.classList.remove('active'));
      item.classList.add('active');

      if (howItWorksSteps[stepIdx]) {
        hwStepTitle.style.opacity = '0';
        hwStepDesc.style.opacity = '0';
        setTimeout(() => {
          hwStepTitle.textContent = howItWorksSteps[stepIdx].title;
          hwStepDesc.textContent = howItWorksSteps[stepIdx].desc;
          hwStepTitle.style.opacity = '1';
          hwStepDesc.style.opacity = '1';
        }, 150);
      }
    });
  });

  // ==========================================
  // 5. SERVICES HORIZONTAL SCROLLER
  // ==========================================
  const agentsSlider = document.getElementById('agentsSlider');
  const agentPrevBtn = document.getElementById('agentPrevBtn');
  const agentNextBtn = document.getElementById('agentNextBtn');

  if (agentPrevBtn && agentsSlider) {
    agentPrevBtn.addEventListener('click', () => {
      agentsSlider.scrollBy({ left: -320, behavior: 'smooth' });
    });
  }

  if (agentNextBtn && agentsSlider) {
    agentNextBtn.addEventListener('click', () => {
      agentsSlider.scrollBy({ left: 320, behavior: 'smooth' });
    });
  }

  // ==========================================
  // 6. MODAL SYSTEM
  // ==========================================
  const consultModal = document.getElementById('consultModal');
  const postPropModal = document.getElementById('postPropModal');
  const propDetailModal = document.getElementById('propDetailModal');
  const floorplanModal = document.getElementById('floorplanModal');

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Close triggers
  document.querySelectorAll('.modal-close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal(btn.closest('.modal-backdrop'));
    });
  });

  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal(backdrop);
    });
  });

  // ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.open').forEach(closeModal);
    }
  });

  const consultForm = document.getElementById('consultForm');
  const consultFormStatus = document.getElementById('consultFormStatus');
  const consultSubmitBtn = document.getElementById('consultSubmitBtn');
  const consultFallbackBox = document.getElementById('consultFallbackBox');
  const consultFallbackTitle = document.getElementById('consultFallbackTitle');
  const consultFallbackDesc = document.getElementById('consultFallbackDesc');
  const consultCallLink = document.getElementById('consultCallLink');
  const consultMailLink = document.getElementById('consultMailLink');
  const consultBackBtn = document.getElementById('consultBackBtn');
  let consultSource = 'Website Consultation Modal';

  function resetConsultModalState() {
    if (consultForm) consultForm.hidden = false;
    if (consultFallbackBox) consultFallbackBox.hidden = true;
    if (consultMailLink) {
      consultMailLink.hidden = true;
      consultMailLink.href = '#';
    }
    if (consultFormStatus) {
      consultFormStatus.hidden = true;
      consultFormStatus.textContent = '';
    }
    if (consultSubmitBtn) {
      consultSubmitBtn.disabled = false;
      consultSubmitBtn.textContent = 'Submit Request';
    }
  }

  function selectConsultPref(label) {
    const pref = document.getElementById('consultPref');
    if (!pref || !label) return;
    const normalized = label.trim().toLowerCase();
    const aliasMap = {
      'dtcp & hmda open plots': 'hmda & dtcp open plots'
    };
    const target = aliasMap[normalized] || normalized;
    const match = Array.from(pref.options).find(o => o.textContent.trim().toLowerCase() === target);
    if (match) pref.value = match.value;
  }

  function showConsultFallback(titleText, descText, mailtoUrl) {
    if (consultForm) consultForm.hidden = true;
    if (consultFallbackTitle) consultFallbackTitle.textContent = titleText;
    if (consultFallbackDesc) consultFallbackDesc.textContent = descText;
    if (consultMailLink) {
      if (mailtoUrl) {
        consultMailLink.href = mailtoUrl;
        consultMailLink.hidden = false;
      } else {
        consultMailLink.href = '#';
        consultMailLink.hidden = true;
      }
    }
    if (consultFallbackBox) consultFallbackBox.hidden = false;
  }

  if (consultBackBtn) {
    consultBackBtn.addEventListener('click', () => {
      if (consultForm) consultForm.hidden = false;
      if (consultFallbackBox) consultFallbackBox.hidden = true;
    });
  }

  if (consultCallLink) {
    consultCallLink.addEventListener('click', () => {
      setTimeout(() => {
        if (consultForm) consultForm.reset();
        resetConsultModalState();
        closeModal(consultModal);
      }, 150);
    });
  }

  if (consultMailLink) {
    consultMailLink.addEventListener('click', () => {
      setTimeout(() => {
        if (consultForm) consultForm.reset();
        resetConsultModalState();
        closeModal(consultModal);
        showToast('Opening your email app to send the consultation request.');
      }, 150);
    });
  }

  // Open Consult Modal triggers
  const consultTriggerSources = [
    [document.getElementById('openBookCallHeader'), 'Header: Book a call'],
    [document.getElementById('heroBookCallBtn'), 'Hero: Book a call'],
    [document.getElementById('hwConsultBtn'), 'How It Works: Get consultation'],
    [document.getElementById('ctaConsultBtn'), 'CTA Banner: Get consultation'],
    [document.getElementById('mBookCallBtn'), 'Mobile Menu: Book a call']
  ];
  consultTriggerSources.forEach(([btn, label]) => {
    if (btn) {
      btn.addEventListener('click', () => {
        consultSource = label;
        resetConsultModalState();
        openModal(consultModal);
      });
    }
  });

  // Post Property Triggers
  const postTriggers = [
    document.getElementById('openPostPropBtn'),
    document.getElementById('mPostPropBtn')
  ];
  postTriggers.forEach(btn => {
    if (btn) btn.addEventListener('click', () => openModal(postPropModal));
  });

  // Floor plan trigger
  const floorplanCard = document.getElementById('floorplanCard');
  if (floorplanCard) {
    floorplanCard.addEventListener('click', () => openModal(floorplanModal));
  }

  // Quick View Details
  document.querySelectorAll('.view-details-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id, 10);
      const prop = propertyData.find(p => p.id === id);
      if (!prop) return;

      const detailContent = document.getElementById('propDetailContent');
      if (detailContent) {
        detailContent.innerHTML = `
          <div class="prop-detail-media">
            <img src="${prop.image}" alt="${prop.title}">
          </div>
          <div class="prop-detail-info">
            <span class="card-badge ${prop.badgeClass}" style="align-self: flex-start; margin-bottom: 8px;">${prop.badge}</span>
            <h3 class="modal-title">${prop.title}</h3>
            <p class="card-location">${prop.location}</p>
            <div class="detail-price">${currentCurrency === 'INR' ? prop.priceInr : prop.priceUsd}</div>
            <p style="font-size: 0.9rem; color: #64748b; line-height: 1.6; margin-bottom: 16px;">${prop.description}</p>
            <div class="detail-specs-grid">
              <div><strong>Area:</strong> ${prop.area}</div>
              <div><strong>Type:</strong> ${prop.type}</div>
              <div><strong>Layout:</strong> ${prop.floor}</div>
              <div><strong>Status:</strong> ${prop.beds}</div>
            </div>
            <div style="margin-bottom: 20px;">
              <span style="font-size: 0.8rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Highlights:</span>
              <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px;">
                ${prop.amenities.map(a => `<span class="fp-tag">${a}</span>`).join('')}
              </div>
            </div>
            <div style="display: flex; gap: 12px; margin-top: auto;">
              <button class="btn btn-primary w-full schedule-visit-btn" data-title="${prop.title}">Book a Site Visit</button>
            </div>
          </div>
        `;

        const scheduleBtn = detailContent.querySelector('.schedule-visit-btn');
        if (scheduleBtn) {
          scheduleBtn.addEventListener('click', () => {
            closeModal(propDetailModal);
            consultSource = `Property Quick View: ${prop.title}`;
            resetConsultModalState();
            openModal(consultModal);
            selectConsultPref(prop.title.split(' — ')[0]);
          });
        }
      }

      openModal(propDetailModal);
    });
  });

  // Service enquiry button click
  document.querySelectorAll('.open-contact-agent').forEach(btn => {
    btn.addEventListener('click', () => {
      const service = btn.dataset.agent;
      consultSource = `Service Card: ${service}`;
      resetConsultModalState();
      openModal(consultModal);
      selectConsultPref(service);
      showToast(`Enquiring about ${service}`);
    });
  });

  // Book invest buttons
  document.querySelectorAll('.book-invest-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.dataset.title;
      consultSource = `Featured Project: ${title}`;
      resetConsultModalState();
      openModal(consultModal);
      selectConsultPref(title);
      showToast(`Booking inquiry for ${title}`);
    });
  });

  // Download brochure / layout buttons
  document.querySelectorAll('.download-brochure-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const project = btn.dataset.project || 'Project';
      showToast(`Requesting layout details for ${project} — our team will call you back.`);
    });
  });

  // ==========================================
  // 7. FORM SUBMISSIONS
  // ==========================================
  if (consultForm) {
    consultForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (consultFormStatus) {
        consultFormStatus.hidden = true;
        consultFormStatus.textContent = '';
      }

      const payload = {
        name: (document.getElementById('consultName')?.value || '').trim(),
        phone: (document.getElementById('consultPhone')?.value || '').trim(),
        email: (document.getElementById('consultEmail')?.value || '').trim(),
        project: (document.getElementById('consultPref')?.value || 'General Consultation').trim(),
        notes: (document.getElementById('consultMsg')?.value || '').trim(),
        source: consultSource
      };

      if (consultSubmitBtn) {
        consultSubmitBtn.disabled = true;
        consultSubmitBtn.textContent = 'Sending request...';
      }

      try {
        const response = await fetch('/api/consultation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await response.json().catch(() => null);

        if (response.status === 400 && data && data.error) {
          if (consultFormStatus) {
            consultFormStatus.textContent = data.error;
            consultFormStatus.hidden = false;
          }
          return;
        }

        if (response.ok && data && data.delivered) {
          closeModal(consultModal);
          consultForm.reset();
          resetConsultModalState();
          showToast('Thank you! Your consultation request has been sent to our team.');
          return;
        }

        const mailtoUrl = data && data.mailtoUrl ? data.mailtoUrl : null;
        const title = data && data.configured
          ? 'Could not deliver automatically right now'
          : 'Email alert setup pending';
        const desc = data && data.configured
          ? 'Automatic email delivery hit a temporary delay. You can reach our advisory team directly by phone or email below.'
          : 'Your details were recorded, and Gmail delivery is awaiting server setup. Call +91 8686878887 directly for immediate assistance.';

        showConsultFallback(title, desc, mailtoUrl);
      } catch {
        showConsultFallback(
          'Reach our advisory team',
          'Could not reach the server right now. Please call +91 8686878887 directly to book your consultation.',
          null
        );
      } finally {
        if (consultSubmitBtn) {
          consultSubmitBtn.disabled = false;
          consultSubmitBtn.textContent = 'Submit Request';
        }
      }
    });
  }

  const postPropForm = document.getElementById('postPropForm');
  if (postPropForm) {
    postPropForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeModal(postPropModal);
      showToast('Layout details received! Our marketing team will contact you shortly.');
      postPropForm.reset();
    });
  }

  // Accessible responsive navigation drawer
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const siteHeader = document.getElementById('siteHeader');
  if (mobileToggle && mobileDrawer) {
    const setMobileMenu = (open, restoreFocus = false) => {
      mobileDrawer.classList.toggle('open', open);
      mobileToggle.setAttribute('aria-expanded', String(open));
      mobileToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
      if (restoreFocus) mobileToggle.focus();
    };

    mobileToggle.addEventListener('click', () => {
      setMobileMenu(!mobileDrawer.classList.contains('open'));
    });
    mobileDrawer.querySelectorAll('a, button').forEach(control => {
      control.addEventListener('click', () => setMobileMenu(false));
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        setMobileMenu(false, true);
      }
    });
    document.addEventListener('pointerdown', event => {
      if (mobileDrawer.classList.contains('open') && siteHeader && !siteHeader.contains(event.target)) {
        setMobileMenu(false);
      }
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 980 && mobileDrawer.classList.contains('open')) setMobileMenu(false);
    }, { passive: true });
  }

  // Privacy & Terms link triggers
  const privacyLink = document.getElementById('privacyLink');
  const termsLink = document.getElementById('termsLink');
  [privacyLink, termsLink].forEach(l => {
    if (l) {
      l.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('Your details stay with Adwin Realty and are only used to respond to your enquiry.');
      });
    }
  });

  // ==========================================
  // 8. TOAST NOTIFICATION
  // ==========================================
  let toastTimer = null;
  function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

});
