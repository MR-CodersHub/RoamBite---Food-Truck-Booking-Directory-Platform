/* ==========================================================================
   RoamBite — Reusable UI Components (Header, Footer, Cards, Modals, Toasts)
   ========================================================================== */

(function () {
  const NAV_ITEMS = [
    { label: "Home", href: "index.html", page: "home" },
    { label: "Home 2", href: "home2.html", page: "home2" },
    { label: "About", href: "about.html", page: "about" },
    { label: "For Vendors", href: "for-vendors.html", page: "for-vendors" },
    { label: "Directory", href: "directory.html", page: "directory" },
    { label: "Blog", href: "blog.html", page: "blog" },
    { label: "Contact", href: "contact.html", page: "contact" }
  ];

  function getActivePage() {
    return document.body.dataset.page || "home";
  }

  function renderHeader() {
    const mount = document.getElementById("site-header");
    if (!mount) return;
    const active = getActivePage();

    const navHtml = NAV_ITEMS.map(
      (item) =>
        `<a href="${item.href}" class="nav-link ${active === item.page ? "active" : ""}">${item.label}</a>`
    ).join("");

    const mobileNavHtml = NAV_ITEMS.map(
      (item) =>
        `<a href="${item.href}" class="${active === item.page ? "active" : ""}"><span>${item.label}</span><span>→</span></a>`
    ).join("");

    mount.className = "site-header";
    mount.innerHTML = `
      <div class="container header-inner">
        <a href="index.html" class="brand-logo" aria-label="RoamBite Home">
          <div class="brand-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 17h4V5H2v12h3"/>
              <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h1"/>
              <circle cx="7.5" cy="17.5" r="2.5"/>
              <circle cx="17.5" cy="17.5" r="2.5"/>
            </svg>
          </div>
          <span>Roam<em>Bite</em></span>
        </a>

        <nav class="nav-links" aria-label="Main Navigation">
          ${navHtml}
        </nav>

        <div class="header-actions">
          <button type="button" class="header-icon-btn" id="rtlToggle" title="Toggle RTL / LTR" aria-label="Toggle RTL Layout">RTL</button>

          <button type="button" class="header-icon-btn" id="themeToggle" title="Toggle Light / Dark Theme" aria-label="Toggle Theme">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </button>

          <div class="account-dropdown" id="accountDropdown">
            <button type="button" class="account-trigger" id="accountTrigger" aria-expanded="false" aria-haspopup="true" aria-label="Vendor Account Menu" title="Vendor Account">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </button>
            <div class="account-menu" role="menu">
              <div class="account-menu-header">Account & Portals</div>
              <a href="auth.html" role="menuitem">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                Login / Signup
              </a>
              <a href="admin-dashboard.html" role="menuitem">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                Admin Dashboard
              </a>
              <a href="user-dashboard.html" role="menuitem">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                User Dashboard
              </a>
            </div>
          </div>

          <a href="directory.html" class="btn btn-primary btn-sm">Explore Trucks</a>

          <button type="button" class="mobile-toggle" id="mobileToggle" aria-label="Toggle Menu" aria-expanded="false">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="mobile-drawer" id="mobileDrawer">
        <div class="mobile-nav-list">
          ${mobileNavHtml}
        </div>
        <a href="directory.html" class="btn btn-primary" style="width:100%;">Explore Trucks</a>
        <div style="display:grid; grid-template-columns:1fr; gap:8px;">
          <a href="auth.html" class="btn btn-outline">Login / Signup</a>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
            <a href="admin-dashboard.html" class="btn btn-purple btn-sm">Admin Dashboard</a>
            <a href="user-dashboard.html" class="btn btn-cream btn-sm">User Dashboard</a>
          </div>
        </div>
      </div>
    `;
  }

  function renderFooter() {
    const mount = document.getElementById("site-footer");
    if (!mount) return;

    mount.className = "site-footer";
    mount.innerHTML = `
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <a href="index.html" class="brand-logo">
              <div class="brand-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M10 17h4V5H2v12h3"/>
                  <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h1"/>
                  <circle cx="7.5" cy="17.5" r="2.5"/>
                  <circle cx="17.5" cy="17.5" r="2.5"/>
                </svg>
              </div>
              <span>Roam<em>Bite</em></span>
            </a>
            <p>Discover top-rated local food trucks, explore street food menus, and book mobile kitchens for weddings, corporate lunches, and neighborhood festivals.</p>
            <div class="social-links">
              <a href="#instagram" class="social-link" aria-label="Instagram" onclick="event.preventDefault(); window.RoamBiteUI.showToast('Opening RoamBite Instagram feed...');">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="#tiktok" class="social-link" aria-label="TikTok" onclick="event.preventDefault(); window.RoamBiteUI.showToast('Opening RoamBite TikTok...');">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
                </svg>
              </a>
              <a href="#facebook" class="social-link" aria-label="Facebook" onclick="event.preventDefault(); window.RoamBiteUI.showToast('Opening RoamBite Community...');">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="#youtube" class="social-link" aria-label="YouTube" onclick="event.preventDefault(); window.RoamBiteUI.showToast('Opening RoamBite Video Stories...');">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </a>
            </div>
          </div>

          <div class="footer-col">
            <h4>Explore</h4>
            <ul class="footer-links">
              <li><a href="index.html">Home</a></li>
              <li><a href="home2.html">Home 2 (Showcase)</a></li>
              <li><a href="directory.html">Food Truck Directory</a></li>
              <li><a href="about.html">About RoamBite</a></li>
              <li><a href="blog.html">Street Food Blog</a></li>
              <li><a href="contact.html">Contact & Support</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>For Vendors</h4>
            <ul class="footer-links">
              <li><a href="for-vendors.html">Why Join RoamBite</a></li>
              <li><a href="for-vendors.html#pricing">Vendor Pricing Plans</a></li>
              <li><a href="vendor-auth.html?tab=signup">Register Your Truck</a></li>
              <li><a href="vendor-auth.html?tab=login">Vendor Portal Login</a></li>
              <li><a href="vendor-auth.html?tab=forgot">Reset Vendor Password</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Weekly Street Food Drops</h4>
            <p style="font-size:0.9rem; color:rgba(255,255,255,0.72);">Get weekend rally lineups, new truck alerts, and catering promos.</p>
            <form class="footer-newsletter-form" id="footerNewsletterForm">
              <input type="email" placeholder="you@example.com" required aria-label="Email address">
              <button type="submit" class="btn btn-primary btn-sm">Join</button>
            </form>
            <div class="footer-contact-list">
              <span style="display:flex; align-items:center; gap:8px;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--orange-warm)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                412 Congress Ave, Suite 300, Austin, TX
              </span>
              <span style="display:flex; align-items:center; gap:8px;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--orange-warm)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                (512) 555-0194
              </span>
              <span style="display:flex; align-items:center; gap:8px;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--orange-warm)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                hello@roambite.com
              </span>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <span>© 2026 RoamBite Inc. All rights reserved.</span>
          <div style="display:flex; gap:20px;">
            <a href="contact.html#faq">Booking Policy</a>
            <a href="for-vendors.html#vendor-faq">Vendor Terms</a>
            <a href="contact.html">Privacy & Support</a>
          </div>
        </div>
      </div>
    `;
  }

  function renderModalsAndToast() {
    if (document.getElementById("roambite-modals")) return;
    const wrapper = document.createElement("div");
    wrapper.id = "roambite-modals";
    wrapper.innerHTML = `
      <!-- Truck Details Modal -->
      <div class="modal-backdrop" id="truckDetailsModal" aria-hidden="true">
        <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="detailModalTitle">
          <div class="modal-header">
            <div>
              <span class="badge badge-pink" id="detailModalCuisine">Cuisine</span>
              <h3 id="detailModalTitle" style="margin-top:6px; color:var(--purple-deep);">Truck Name</h3>
            </div>
            <button type="button" class="modal-close" data-close-modal="truckDetailsModal" aria-label="Close">×</button>
          </div>
          <div class="modal-body" id="detailModalBody"></div>
        </div>
      </div>

      <!-- Book Now Modal -->
      <div class="modal-backdrop" id="bookingModal" aria-hidden="true">
        <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="bookingModalTitle">
          <div class="modal-header">
            <div>
              <span class="badge badge-booking">Instant Booking Request</span>
              <h3 id="bookingModalTitle" style="margin-top:6px; color:var(--purple-deep);">Book Food Truck</h3>
            </div>
            <button type="button" class="modal-close" data-close-modal="bookingModal" aria-label="Close">×</button>
          </div>
          <div class="modal-body">
            <form id="bookingForm" class="form-grid">
              <input type="hidden" id="bookingTruckId">
              <div class="form-group full">
                <label class="form-label" for="bookingTruckSelect">Selected Food Truck</label>
                <select id="bookingTruckSelect" class="form-control" required></select>
              </div>
              <div class="form-group">
                <label class="form-label" for="bookingName">Your Full Name</label>
                <input type="text" id="bookingName" class="form-control" placeholder="Alex Rivera" required>
              </div>
              <div class="form-group">
                <label class="form-label" for="bookingEmail">Email Address</label>
                <input type="email" id="bookingEmail" class="form-control" placeholder="alex@company.com" required>
              </div>
              <div class="form-group">
                <label class="form-label" for="bookingDate">Event Date</label>
                <input type="date" id="bookingDate" class="form-control" required>
              </div>
              <div class="form-group">
                <label class="form-label" for="bookingGuests">Estimated Guests</label>
                <input type="number" id="bookingGuests" class="form-control" min="15" max="2000" value="75" required>
              </div>
              <div class="form-group">
                <label class="form-label" for="bookingEventType">Event Type</label>
                <select id="bookingEventType" class="form-control">
                  <option>Corporate Lunch</option>
                  <option>Wedding / Reception</option>
                  <option>Birthday / Private Party</option>
                  <option>Community Festival</option>
                  <option>Campus Pop-Up</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label" for="bookingCity">Event Location / Neighborhood</label>
                <input type="text" id="bookingCity" class="form-control" placeholder="Downtown Austin, TX" required>
              </div>
              <div class="form-group full">
                <label class="form-label" for="bookingNotes">Menu Preferences or Notes</label>
                <textarea id="bookingNotes" class="form-control" rows="3" placeholder="Any dietary needs, parking notes, or favorite dishes..."></textarea>
              </div>
              <div class="form-group full" style="margin-top:6px;">
                <button type="submit" class="btn btn-primary btn-lg" style="width:100%;">Confirm Booking Request</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Toast Container -->
      <div class="toast-container" id="toastContainer"></div>
    `;
    document.body.appendChild(wrapper);

    // Populate truck select in booking modal
    const select = document.getElementById("bookingTruckSelect");
    if (select && window.ROAMBITE_DATA) {
      select.innerHTML = window.ROAMBITE_DATA.trucks
        .map((t) => `<option value="${t.id}">${t.name} (${t.cuisine} • ${t.city})</option>`)
        .join("");
    }
  }

  function createTruckCard(truck) {
    const availClass =
      truck.availability === "Open Now" ? "badge-open" : "badge-booking";

    return `
      <article class="truck-card" data-truck-id="${truck.id}">
        <div class="truck-card-media">
          <img src="${truck.image}" alt="${truck.name} — ${truck.cuisine}" loading="lazy">
          <div class="truck-card-badges">
            <span class="badge ${availClass}">${truck.availability}</span>
            <span class="truck-price-pill">${truck.priceRange}</span>
          </div>
        </div>
        <div class="truck-card-body">
          <div class="truck-card-top">
            <h3 class="truck-name">${truck.name}</h3>
            <span class="truck-rating" title="${truck.reviews} verified reviews">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              ${truck.rating.toFixed(1)}
            </span>
          </div>
          <div class="truck-cuisine">${truck.cuisine}</div>
          <p class="truck-desc">${truck.description}</p>
          <div class="truck-meta">
            <div class="truck-meta-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--orange-warm)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>${truck.neighborhood}, ${truck.city}</span>
            </div>
            <div class="truck-meta-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--purple-mid)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>${truck.hours} • ${truck.cateringMin}</span>
            </div>
          </div>
          <div class="truck-card-actions">
            <button type="button" class="btn btn-outline btn-sm" data-view-truck="${truck.id}">View Details</button>
            <button type="button" class="btn btn-primary btn-sm" data-book-truck="${truck.id}">Book Now</button>
          </div>
        </div>
      </article>
    `;
  }

  function openTruckModal(truckId) {
    const truck = window.ROAMBITE_DATA.trucks.find((t) => t.id === truckId);
    if (!truck) return;

    document.getElementById("detailModalCuisine").textContent = `${truck.cuisine} • ${truck.priceRange}`;
    document.getElementById("detailModalTitle").textContent = truck.name;

    const dishesHtml = truck.dishes
      .map((d) => `<span class="badge badge-pink">${d}</span>`)
      .join("");
    const amenitiesHtml = truck.amenities
      .map((a) => `<span class="badge badge-open">✓ ${a}</span>`)
      .join("");

    document.getElementById("detailModalBody").innerHTML = `
      <img src="${truck.image}" alt="${truck.name}" style="width:100%; height:240px; border-radius:var(--radius-md); margin-bottom:18px;">
      <p style="color:var(--text-secondary); margin-bottom:16px;">${truck.description}</p>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; background:var(--cream-soft); padding:16px; border-radius:var(--radius-md); margin-bottom:18px; font-size:0.9rem;">
        <div><strong>Location:</strong> ${truck.neighborhood}, ${truck.city}</div>
        <div><strong>Hours:</strong> ${truck.hours}</div>
        <div><strong>Rating:</strong> ★ ${truck.rating} (${truck.reviews} reviews)</div>
        <div><strong>Event Minimum:</strong> ${truck.cateringMin}</div>
      </div>
      <h4 style="color:var(--purple-deep); margin-bottom:8px;">Signature Menu Highlights</h4>
      <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:18px;">${dishesHtml}</div>
      <h4 style="color:var(--purple-deep); margin-bottom:8px;">Amenities & Event Fit</h4>
      <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:24px;">${amenitiesHtml}</div>
      <div style="display:flex; gap:12px;">
        <button type="button" class="btn btn-primary btn-lg" style="flex:1;" onclick="window.RoamBiteUI.closeModal('truckDetailsModal'); window.RoamBiteUI.openBookingModal('${truck.id}');">Book ${truck.name}</button>
      </div>
    `;

    openModal("truckDetailsModal");
  }

  function openBookingModal(truckId) {
    const select = document.getElementById("bookingTruckSelect");
    if (select && truckId) {
      select.value = truckId;
    }
    const dateInput = document.getElementById("bookingDate");
    if (dateInput && !dateInput.value) {
      const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];
      dateInput.value = nextWeek;
    }
    openModal("bookingModal");
  }

  function openModal(id) {
    const el = document.getElementById(id);
    if (el) {
      el.classList.add("open");
      el.setAttribute("aria-hidden", "false");
    }
  }

  function closeModal(id) {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove("open");
      el.setAttribute("aria-hidden", "true");
    }
  }

  function showToast(message) {
    const container = document.getElementById("toastContainer");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(20px)";
      setTimeout(() => toast.remove(), 250);
    }, 3600);
  }

  window.RoamBiteUI = {
    renderHeader,
    renderFooter,
    renderModalsAndToast,
    createTruckCard,
    openTruckModal,
    openBookingModal,
    openModal,
    closeModal,
    showToast
  };
})();

