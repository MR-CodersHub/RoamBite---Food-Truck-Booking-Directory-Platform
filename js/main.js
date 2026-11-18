/* ==========================================================================
   RoamBite — Main Global Controller
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const UI = window.RoamBiteUI;
  const DATA = window.ROAMBITE_DATA;

  UI.renderHeader();
  UI.renderFooter();
  UI.renderModalsAndToast();

  // Theme & RTL Persistence
  const htmlEl = document.documentElement;
  const themeBtn = document.getElementById("themeToggle");
  const rtlBtn = document.getElementById("rtlToggle");

  function applyTheme(theme) {
    htmlEl.setAttribute("data-theme", theme);
    localStorage.setItem("roambite_theme", theme);
    if (themeBtn) {
      themeBtn.classList.toggle("active", theme === "dark");
      themeBtn.innerHTML =
        theme === "dark"
          ? `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
          : `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    }
  }

  function applyDirection(dir) {
    htmlEl.setAttribute("dir", dir);
    localStorage.setItem("roambite_dir", dir);
    if (rtlBtn) {
      rtlBtn.classList.toggle("active", dir === "rtl");
      rtlBtn.textContent = dir === "rtl" ? "LTR" : "RTL";
    }
  }

  applyTheme(localStorage.getItem("roambite_theme") || "light");
  applyDirection(localStorage.getItem("roambite_dir") || "ltr");

  themeBtn?.addEventListener("click", () => {
    const next = htmlEl.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    UI.showToast(`Switched to ${next === "dark" ? "Dark" : "Light"} theme`);
  });

  rtlBtn?.addEventListener("click", () => {
    const next = htmlEl.getAttribute("dir") === "rtl" ? "ltr" : "rtl";
    applyDirection(next);
    UI.showToast(`Layout direction set to ${next.toUpperCase()}`);
  });

  // Sticky Header Scroll State
  const header = document.querySelector(".site-header");
  window.addEventListener("scroll", () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 18);
  });

  // Account Dropdown
  const accountDropdown = document.getElementById("accountDropdown");
  const accountTrigger = document.getElementById("accountTrigger");
  if (accountDropdown && accountTrigger) {
    accountTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = accountDropdown.classList.toggle("open");
      accountTrigger.setAttribute("aria-expanded", String(isOpen));
    });
    document.addEventListener("click", (e) => {
      if (!accountDropdown.contains(e.target)) {
        accountDropdown.classList.remove("open");
        accountTrigger.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Mobile Hamburger Menu
  const mobileToggle = document.getElementById("mobileToggle");
  const mobileDrawer = document.getElementById("mobileDrawer");
  if (mobileToggle && mobileDrawer) {
    const hamburgerSvg = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
    const closeSvg = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

    mobileToggle.addEventListener("click", () => {
      const isOpen = mobileDrawer.classList.toggle("open");
      mobileToggle.setAttribute("aria-expanded", String(isOpen));
      mobileToggle.innerHTML = isOpen ? closeSvg : hamburgerSvg;
      document.body.style.overflow = isOpen ? "hidden" : "";
    });
  }

  // Global Click Delegation (Modals & Truck Cards)
  document.addEventListener("click", (e) => {
    const viewBtn = e.target.closest("[data-view-truck]");
    if (viewBtn) {
      UI.openTruckModal(viewBtn.dataset.viewTruck);
      return;
    }

    const bookBtn = e.target.closest("[data-book-truck]");
    if (bookBtn) {
      UI.openBookingModal(bookBtn.dataset.bookTruck);
      return;
    }

    const closeBtn = e.target.closest("[data-close-modal]");
    if (closeBtn) {
      UI.closeModal(closeBtn.dataset.closeModal);
      return;
    }

    if (e.target.classList.contains("modal-backdrop")) {
      e.target.classList.remove("open");
      e.target.setAttribute("aria-hidden", "true");
    }
  });

  // Booking Form Submission
  const bookingForm = document.getElementById("bookingForm");
  if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const truckSelect = document.getElementById("bookingTruckSelect");
      const truckId = truckSelect.value;
      const truckName = truckSelect.options[truckSelect.selectedIndex]?.text.split(" (")[0] || "Food Truck";
      const dateVal = document.getElementById("bookingDate").value;
      const guests = parseInt(document.getElementById("bookingGuests").value || "75", 10);
      const customerName = document.getElementById("bookingName").value.trim();
      const customerEmail = document.getElementById("bookingEmail").value.trim();
      const eventType = document.getElementById("bookingEventType").value;
      const location = document.getElementById("bookingCity").value.trim();

      if (window.RoamBiteState) {
        const bookings = window.RoamBiteState.get(window.RoamBiteState.KEYS.BOOKINGS, []);
        bookings.unshift({
          id: "BK-" + Math.floor(1050 + Math.random() * 8900),
          truckId,
          truckName,
          customerEmail,
          customerName,
          eventType,
          date: dateVal,
          guests,
          location,
          amount: guests * 15,
          status: "Pending"
        });
        window.RoamBiteState.set(window.RoamBiteState.KEYS.BOOKINGS, bookings);
      }

      UI.closeModal("bookingModal");
      bookingForm.reset();
      UI.showToast(`Booking request sent to ${truckName} for ${dateVal}!`);
    });
  }

  // Footer Newsletter Submission
  const footerNewsletter = document.getElementById("footerNewsletterForm");
  if (footerNewsletter) {
    footerNewsletter.addEventListener("submit", (e) => {
      e.preventDefault();
      footerNewsletter.reset();
      UI.showToast("Subscribed! Weekly street food lineups are on the way.");
    });
  }

  // Home Page Dynamic Renders
  initHomePage(UI, DATA);
  initHome2Page(UI, DATA);

  // Scroll Reveal Animation
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    reveals.forEach((el) => observer.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("visible"));
  }
});

function initHomePage(UI, DATA) {
  if (document.body.dataset.page !== "home") return;

  // Hero Search Form -> Redirects to Directory with query params
  const heroSearchForm = document.getElementById("heroSearchForm");
  if (heroSearchForm) {
    heroSearchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = document.getElementById("heroQueryInput")?.value.trim() || "";
      const city = document.getElementById("heroCitySelect")?.value || "";
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (city) params.set("city", city);
      window.location.href = `directory.html?${params.toString()}`;
    });
  }

  // Nearby Trucks by Location Chips
  const nearbyGrid = document.getElementById("nearbyTrucksGrid");
  const chips = document.querySelectorAll(".location-chip");

  function renderNearby(cityFilter) {
    if (!nearbyGrid) return;
    let list = DATA.trucks;
    if (cityFilter && cityFilter !== "All") {
      list = DATA.trucks.filter((t) => t.city.includes(cityFilter));
    }
    if (list.length === 0) list = DATA.trucks.slice(0, 3);
    nearbyGrid.innerHTML = list
      .slice(0, 3)
      .map(
        (t) => `
      <article class="truck-row-card" data-truck-id="${t.id}">
        <img src="${t.image}" alt="${t.name}" loading="lazy">
        <div class="truck-row-body">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px;">
            <div>
              <span class="badge ${t.availability === "Open Now" ? "badge-open" : "badge-booking"}" style="margin-bottom:6px;">${t.availability}</span>
              <h3 style="font-size:1.12rem; color:var(--purple-deep);">${t.name}</h3>
            </div>
            <span class="truck-rating">★ ${t.rating.toFixed(1)}</span>
          </div>
          <div style="font-size:0.86rem; color:var(--text-secondary);">
            <strong style="color:var(--orange-warm);">${t.cuisine}</strong> • ${t.neighborhood}, ${t.city}
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap; padding-top:8px; border-top:1px dashed var(--cream-border);">
            <span style="font-size:0.82rem; color:var(--text-muted);">${t.hours}</span>
            <div style="display:flex; gap:8px;">
              <button type="button" class="btn btn-outline btn-sm" data-view-truck="${t.id}">Details</button>
              <button type="button" class="btn btn-primary btn-sm" data-book-truck="${t.id}">Book Now</button>
            </div>
          </div>
        </div>
      </article>`
      )
      .join("");
  }

  renderNearby("All");
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      renderNearby(chip.dataset.city);
    });
  });

  // Featured Trucks Horizontal Scroll Showcase
  const featuredGrid = document.getElementById("featuredTrucksGrid");
  if (featuredGrid) {
    featuredGrid.innerHTML = DATA.trucks.slice(2, 8).map(UI.createTruckCard).join("");
    document.getElementById("featuredScrollPrev")?.addEventListener("click", () => {
      featuredGrid.scrollBy({ left: -370, behavior: "smooth" });
    });
    document.getElementById("featuredScrollNext")?.addEventListener("click", () => {
      featuredGrid.scrollBy({ left: 370, behavior: "smooth" });
    });
  }

  // Popular Cuisines Grid
  const cuisineGrid = document.getElementById("popularCuisinesGrid");
  if (cuisineGrid) {
    cuisineGrid.innerHTML = DATA.cuisines
      .map(
        (c) => `
      <a href="directory.html?cuisine=${encodeURIComponent(c.name)}" class="cuisine-card">
        <div class="cuisine-emoji">${c.icon}</div>
        <h3>${c.name}</h3>
        <span>${c.count}</span>
      </a>`
      )
      .join("");
  }

  // Upcoming Events Grid
  const eventsGrid = document.getElementById("upcomingEventsGrid");
  if (eventsGrid) {
    eventsGrid.innerHTML = DATA.events
      .map(
        (ev) => `
      <article class="event-card">
        <div class="event-card-img">
          <img src="${ev.image}" alt="${ev.title}" loading="lazy">
          <div class="event-date-badge">
            <div style="font-size:1.25rem;">${ev.day}</div>
            <div style="font-size:0.72rem; letter-spacing:0.08em;">${ev.month}</div>
          </div>
        </div>
        <div class="event-card-body">
          <span class="badge badge-pink" style="align-self:flex-start; margin-bottom:10px;">${ev.trucksCount}</span>
          <h3 style="color:var(--purple-deep); margin-bottom:8px; font-size:1.2rem;">${ev.title}</h3>
          <p style="font-size:0.92rem; color:var(--text-secondary); margin-bottom:14px; flex:1;">${ev.description}</p>
          <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:16px; display:flex; flex-direction:column; gap:5px;">
            <div style="display:flex; align-items:center; gap:7px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--orange-warm)" stroke-width="2.2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              ${ev.location}
            </div>
            <div style="display:flex; align-items:center; gap:7px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--purple-mid)" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              ${ev.time}
            </div>
          </div>
          <a href="directory.html?availability=Weekend%20Events" class="btn btn-outline btn-sm" style="width:100%;">Explore Event Trucks</a>
        </div>
      </article>`
      )
      .join("");
  }

  // Testimonials Editorial Layout
  const testimonialsGrid = document.getElementById("homeTestimonialsGrid");
  if (testimonialsGrid) {
    const [lead, second, third] = DATA.testimonials;
    testimonialsGrid.innerHTML = `
      <article class="testimonial-feature-block">
        <div>
          <span class="badge badge-booking" style="margin-bottom:18px;">Featured Event Review</span>
          <p style="font-size:1.35rem; font-weight:600; line-height:1.5; margin-bottom:24px;">“${lead.quote}”</p>
        </div>
        <div class="testimonial-author" style="border-top-color:rgba(255,255,255,0.16);">
          <div class="author-avatar" style="background:var(--orange-warm); color:#fff;">${lead.initials}</div>
          <div>
            <strong style="display:block; color:#fff;">${lead.name}</strong>
            <span style="font-size:0.86rem; color:rgba(255,255,255,0.75);">${lead.role}</span>
          </div>
        </div>
      </article>
      <div class="testimonial-side-stack">
        ${[second, third]
          .map(
            (t) => `
          <article class="testimonial-card" style="background:var(--cream-soft);">
            <div class="testimonial-stars">★★★★★</div>
            <p class="testimonial-quote">“${t.quote}”</p>
            <div class="testimonial-author">
              <div class="author-avatar">${t.initials}</div>
              <div>
                <strong style="display:block; color:var(--purple-deep);">${t.name}</strong>
                <span style="font-size:0.84rem; color:var(--text-muted);">${t.role}</span>
              </div>
            </div>
          </article>`
          )
          .join("")}
      </div>
    `;
  }

  // Copy Promo Code Button
  const copyPromoBtn = document.getElementById("copyPromoBtn");
  if (copyPromoBtn) {
    copyPromoBtn.addEventListener("click", () => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText("ROAM50").catch(() => {});
      }
      UI.showToast("Promo code ROAM50 copied! Apply it at booking.");
    });
  }
}

function initHome2Page(UI, DATA) {
  if (document.body.dataset.page !== "home2") return;

  // Interactive Discovery Tabs
  const discoveryGrid = document.getElementById("home2DiscoveryGrid");
  const tabs = document.querySelectorAll("#home2Tabs .tab-pill");

  function renderDiscovery(filter) {
    if (!discoveryGrid) return;
    let items = DATA.trucks;
    if (filter === "open") items = DATA.trucks.filter((t) => t.availability === "Open Now");
    else if (filter === "top") items = [...DATA.trucks].sort((a, b) => b.rating - a.rating);
    else if (filter === "budget") items = DATA.trucks.filter((t) => t.priceRange === "$");
    else if (filter === "catering") items = DATA.trucks.filter((t) => t.bookingReady);

    discoveryGrid.innerHTML = items.slice(0, 4).map(UI.createTruckCard).join("");
  }

  renderDiscovery("all");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      renderDiscovery(tab.dataset.tab);
    });
  });

  // Trending Trucks Large Image-Overlay Showcase
  const trendingGrid = document.getElementById("home2TrendingGrid");
  if (trendingGrid) {
    trendingGrid.innerHTML = DATA.trucks
      .slice(4, 8)
      .map(
        (t) => `
      <article class="trending-overlay-card">
        <img src="${t.image}" alt="${t.name}" loading="lazy">
        <div class="trending-overlay-content">
          <div>
            <span class="badge badge-booking" style="margin-bottom:8px;">${t.cuisine} • ★ ${t.rating.toFixed(1)}</span>
            <h3 style="font-size:1.45rem; margin-bottom:4px;">${t.name}</h3>
            <p style="font-size:0.88rem; opacity:0.85;">${t.neighborhood}, ${t.city} • ${t.cateringMin}</p>
          </div>
          <div style="display:flex; gap:8px; flex-shrink:0;">
            <button type="button" class="btn btn-cream btn-sm" data-view-truck="${t.id}">Menu</button>
            <button type="button" class="btn btn-primary btn-sm" data-book-truck="${t.id}">Book</button>
          </div>
        </div>
      </article>`
      )
      .join("");
  }

  // Home 2 Newsletter Form
  const home2News = document.getElementById("home2NewsletterForm");
  if (home2News) {
    home2News.addEventListener("submit", (e) => {
      e.preventDefault();
      home2News.reset();
      UI.showToast("Welcome to RoamBite Insider! Check your inbox for local drops.");
    });
  }
}

