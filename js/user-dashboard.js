/* ==========================================================================
   RoamBite — Role-Based User & Vendor Dashboard Controller
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const S = window.RoamBiteState;
  const K = S.KEYS;

  const htmlEl = document.documentElement;
  const themeBtn = document.getElementById("dashThemeToggle");
  const rtlBtn = document.getElementById("dashRtlToggle");

  function syncPrefs() {
    const theme = localStorage.getItem("roambite_theme") || "light";
    const dir = localStorage.getItem("roambite_dir") || "ltr";
    htmlEl.setAttribute("data-theme", theme);
    htmlEl.setAttribute("dir", dir);
    if (rtlBtn) rtlBtn.textContent = dir === "rtl" ? "LTR" : "RTL";
  }
  syncPrefs();

  themeBtn?.addEventListener("click", () => {
    localStorage.setItem("roambite_theme", htmlEl.getAttribute("data-theme") === "dark" ? "light" : "dark");
    syncPrefs();
  });
  rtlBtn?.addEventListener("click", () => {
    localStorage.setItem("roambite_dir", htmlEl.getAttribute("dir") === "rtl" ? "ltr" : "rtl");
    syncPrefs();
  });

  function toast(msg) {
    const c = document.getElementById("toastContainer");
    if (!c) return;
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    c.appendChild(t);
    setTimeout(() => t.remove(), 3200);
  }

  // Direct User/Vendor Dashboard Access (no blocking gate)
  let session = S.getSession();
  if (!session || (session.role !== "customer" && session.role !== "vendor")) {
    session = {
      id: "u-vendor-1",
      name: "Mateo Morales",
      email: "chef@solsmoke.com",
      role: "vendor",
      truckId: "sol-birria",
      city: "Austin, TX"
    };
    S.set(K.SESSION, session);
  }

  const gate = document.getElementById("userAccessGate");
  const shell = document.getElementById("userAppShell");

  if (gate) gate.style.display = "none";
  shell.style.display = "grid";

  let isVendor = session.role === "vendor";
  document.getElementById("userRoleBadge").textContent = isVendor ? "Food Truck Vendor" : "Customer Account";

  function doLogout() {
    S.logout();
    window.location.href = "auth.html";
  }
  document.getElementById("userLogoutBtn")?.addEventListener("click", doLogout);
  document.getElementById("userMenuLogout")?.addEventListener("click", doLogout);

  const switchRoleBtn = document.getElementById("switchRoleViewBtn");
  if (switchRoleBtn) {
    switchRoleBtn.textContent = isVendor ? "Switch to Customer View" : "Switch to Vendor View";
    switchRoleBtn.addEventListener("click", () => {
      if (isVendor) {
        S.login("alex@foodie.com", "User@123", "customer");
      } else {
        S.login("chef@solsmoke.com", "Vendor@123", "vendor");
      }
      window.location.reload();
    });
  }

  // Mobile Drawer & Dropdowns
  const sidebar = document.getElementById("dashSidebar");
  const backdrop = document.getElementById("dashBackdrop");
  document.getElementById("dashMenuToggle")?.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    backdrop.classList.toggle("open");
  });
  backdrop?.addEventListener("click", () => {
    sidebar.classList.remove("open");
    backdrop.classList.remove("open");
  });

  function setupDropdown(wrapId, btnId) {
    const wrap = document.getElementById(wrapId);
    document.getElementById(btnId)?.addEventListener("click", (e) => {
      e.stopPropagation();
      wrap.classList.toggle("open");
    });
    document.addEventListener("click", (e) => {
      if (!wrap?.contains(e.target)) wrap?.classList.remove("open");
    });
  }
  setupDropdown("userNotifWrap", "userNotifBtn");
  setupDropdown("userProfileWrap", "userProfileBtn");

  function renderNotifs() {
    const notifs = S.get(K.NOTIFICATIONS, []).filter((n) => n.role === session.role);
    const menu = document.getElementById("userNotifMenu");
    const dot = document.getElementById("userNotifDot");
    if (dot) dot.style.display = notifs.some((n) => n.unread) ? "block" : "none";
    if (!menu) return;
    menu.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; padding-bottom:8px; border-bottom:1px solid var(--cream-border); margin-bottom:8px;">
        <strong>Notifications</strong>
        <button type="button" class="btn btn-sm btn-outline" id="markUserReadBtn" style="padding:3px 10px; font-size:0.75rem;">Mark Read</button>
      </div>
      ${notifs.length ? notifs.map((n) => `<div style="padding:8px 0; border-bottom:1px dashed var(--cream-border); font-size:0.84rem;"><div>${n.text}</div><small style="color:var(--text-muted);">${n.time}</small></div>`).join("") : `<p style="font-size:0.85rem; color:var(--text-muted);">No new alerts.</p>`}
    `;
    document.getElementById("markUserReadBtn")?.addEventListener("click", () => {
      S.set(K.NOTIFICATIONS, S.get(K.NOTIFICATIONS, []).map((n) => (n.role === session.role ? { ...n, unread: false } : n)));
      renderNotifs();
    });
  }
  renderNotifs();

  const VENDOR_NAV = [
    { id: "overview", label: "Vendor Overview" },
    { id: "truck-profile", label: "Truck Profile & Hours" },
    { id: "schedule", label: "Live Location & Calendar" },
    { id: "menu", label: "Menu Management" },
    { id: "bookings", label: "Bookings & Orders" },
    { id: "earnings", label: "Sales & Payouts" },
    { id: "reviews", label: "Customer Reviews" },
    { id: "settings", label: "Account Settings" }
  ];

  const CUSTOMER_NAV = [
    { id: "overview", label: "My Overview" },
    { id: "discover", label: "Discover Food Trucks" },
    { id: "favorites", label: "Favorite Trucks" },
    { id: "bookings", label: "Bookings & Tracking" },
    { id: "payments", label: "Payment History" },
    { id: "reviews", label: "My Reviews" },
    { id: "locations", label: "Saved Locations" },
    { id: "settings", label: "Profile & Settings" }
  ];

  const navItems = isVendor ? VENDOR_NAV : CUSTOMER_NAV;
  const navEl = document.getElementById("userNav");
  let currentSection = "overview";
  let searchQuery = "";

  navEl.innerHTML = navItems
    .map((item, idx) => `<button type="button" class="dash-nav-btn ${idx === 0 ? "active" : ""}" data-section="${item.id}">${item.label}</button>`)
    .join("");

  navEl.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-section]");
    if (!btn) return;
    navEl.querySelectorAll(".dash-nav-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentSection = btn.dataset.section;
    sidebar.classList.remove("open");
    backdrop.classList.remove("open");
    renderView();
  });

  document.getElementById("userGlobalSearch")?.addEventListener("input", (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    renderView();
  });

  const view = document.getElementById("userMainView");

  function getVendorTruck() {
    const trucks = S.get(K.TRUCKS, []);
    return trucks.find((t) => t.id === session.truckId) || trucks[0];
  }

  function renderView() {
    if (isVendor) renderVendorView();
    else renderCustomerView();
  }

  /* ========================================================================
     VENDOR DASHBOARD VIEWS
     ======================================================================== */
  function renderVendorView() {
    const truck = getVendorTruck();
    const allBookings = S.get(K.BOOKINGS, []);
    const vendorBookings = allBookings.filter((b) => b.truckId === truck.id);
    const schedules = S.get(K.SCHEDULES, []).filter((s) => s.truckId === truck.id);
    const menusMap = S.get(K.MENUS, {});
    const menuItems = menusMap[truck.id] || [];
    const reviews = S.get(K.REVIEWS, []).filter((r) => r.truckId === truck.id);
    const txs = S.get(K.TRANSACTIONS, []).filter((t) => t.truckName === truck.name);

    const totalEarned = vendorBookings.filter((b) => b.status !== "Rejected").reduce((s, b) => s + Number(b.amount || 0), 0);
    const pendingCount = vendorBookings.filter((b) => b.status === "Pending").length;

    if (currentSection === "overview") {
      view.innerHTML = `
        <div class="dash-view-header">
          <div><span class="eyebrow">Vendor Workspace</span><h1>Welcome, ${session.name}</h1></div>
          <span class="badge ${truck.availability === "Open Now" ? "badge-open" : "badge-booking"}">${truck.name} • ${truck.availability}</span>
        </div>

        <div class="kpi-mosaic">
          <div class="kpi-lead-card">
            <div>
              <span class="badge badge-booking">Total Catering Revenue</span>
              <div style="font-family:var(--font-display); font-size:2.35rem; font-weight:900; margin:10px 0 4px;">$${totalEarned.toLocaleString()}</div>
              <p style="font-size:0.86rem; opacity:0.82;">${vendorBookings.length} bookings • ${pendingCount} pending action</p>
            </div>
            <div style="font-size:0.84rem; opacity:0.85; padding-top:12px; border-top:1px solid rgba(255,255,255,0.16);">Next Stop: ${schedules[0]?.location || truck.neighborhood}</div>
          </div>
          <div class="kpi-tile cream">
            <span style="font-size:0.82rem; font-weight:700; color:var(--text-muted);">Menu Items Live</span>
            <div class="kpi-val">${menuItems.length}</div>
            <span class="badge badge-purple" style="align-self:flex-start;">${truck.cuisine}</span>
          </div>
          <div class="kpi-tile pink">
            <span style="font-size:0.82rem; font-weight:700; color:var(--text-muted);">Average Rating</span>
            <div class="kpi-val">★ ${truck.rating}</div>
            <span class="badge badge-open" style="align-self:flex-start;">${truck.reviews} Reviews</span>
          </div>
          <div class="kpi-tile">
            <span style="font-size:0.82rem; font-weight:700; color:var(--text-muted);">Scheduled Stops</span>
            <div class="kpi-val">${schedules.length}</div>
            <span class="badge badge-booking" style="align-self:flex-start;">This Month</span>
          </div>
        </div>

        <div class="dash-split-2">
          <div class="dash-panel">
            <div class="dash-panel-title"><span>Weekly Window & Catering Sales</span></div>
            <div class="bar-chart">
              ${[
                { d: "Mon", h: 35 },
                { d: "Tue", h: 48 },
                { d: "Wed", h: 55 },
                { d: "Thu", h: 70 },
                { d: "Fri", h: 92 },
                { d: "Sat", h: 100 },
                { d: "Sun", h: 78 }
              ]
                .map((x) => `<div class="bar-col"><div class="bar-fill" style="height:${x.h}%;"></div><span class="bar-label">${x.d}</span></div>`)
                .join("")}
            </div>
          </div>

          <div class="dash-panel">
            <div class="dash-panel-title"><span>Incoming Requests</span></div>
            <div style="display:flex; flex-direction:column; gap:12px;">
              ${vendorBookings
                .slice(0, 3)
                .map(
                  (b) => `
                <div style="padding:12px; border-radius:var(--radius-sm); background:var(--cream-soft); border-left:4px solid var(--orange-warm); font-size:0.86rem;">
                  <strong>${b.customerName} • ${b.guests} Guests</strong>
                  <div style="color:var(--text-muted);">${b.date} • ${b.eventType}</div>
                  <div style="margin-top:6px;"><span class="badge badge-purple">${b.status}</span></div>
                </div>`
                )
                .join("")}
            </div>
          </div>
        </div>
      `;
    } else if (currentSection === "truck-profile") {
      view.innerHTML = `
        <div class="dash-view-header"><h1>Food Truck Profile & Operating Hours</h1><span class="badge badge-open">${truck.approvalStatus || "Approved"}</span></div>
        <div class="dash-panel" style="max-width:780px;">
          <form id="vendorTruckForm" class="form-grid">
            <div class="form-group">
              <label class="form-label">Food Truck Name</label>
              <input type="text" id="vtName" class="form-control" value="${truck.name}" required>
            </div>
            <div class="form-group">
              <label class="form-label">Cuisine Category</label>
              <input type="text" id="vtCuisine" class="form-control" value="${truck.cuisine}" required>
            </div>
            <div class="form-group">
              <label class="form-label">City</label>
              <input type="text" id="vtCity" class="form-control" value="${truck.city}" required>
            </div>
            <div class="form-group">
              <label class="form-label">Current Neighborhood / Spot</label>
              <input type="text" id="vtHood" class="form-control" value="${truck.neighborhood}" required>
            </div>
            <div class="form-group">
              <label class="form-label">Operating Hours</label>
              <input type="text" id="vtHours" class="form-control" value="${truck.hours}" required>
            </div>
            <div class="form-group">
              <label class="form-label">Availability Status</label>
              <select id="vtAvail" class="form-control">
                ${["Open Now", "Booking Available", "Weekend Events", "Offline"].map((st) => `<option ${truck.availability === st ? "selected" : ""}>${st}</option>`).join("")}
              </select>
            </div>
            <div class="form-group full">
              <label class="form-label">Truck Description</label>
              <textarea id="vtDesc" class="form-control" rows="3">${truck.description}</textarea>
            </div>
            <div class="form-group full">
              <button type="submit" class="btn btn-primary">Save Truck Listing</button>
            </div>
          </form>
        </div>
      `;
    } else if (currentSection === "schedule") {
      const days = Array.from({ length: 30 }, (_, i) => i + 1);
      view.innerHTML = `
        <div class="dash-view-header"><h1>Live Location & Schedule Calendar</h1><span class="badge badge-open">Live Spot: ${truck.neighborhood}</span></div>
        <div class="dash-split-2">
          <div class="dash-panel">
            <div class="dash-panel-title"><span>November 2026 Schedule</span><span class="badge badge-pink">${schedules.length} Stops Planned</span></div>
            <div class="calendar-grid">
              ${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => `<div class="calendar-day-hdr">${d}</div>`).join("")}
              ${days
                .map((day) => {
                  const dateStr = `2026-11-${String(day).padStart(2, "0")}`;
                  const ev = schedules.find((s) => s.date === dateStr);
                  return `<div class="calendar-cell ${ev ? "has-event" : ""}" data-cal-date="${dateStr}"><strong>${day}</strong>${ev ? `<span class="calendar-event-tag">${ev.type}</span>` : ""}</div>`;
                })
                .join("")}
            </div>
          </div>

          <div class="dash-panel">
            <div class="dash-panel-title"><span>Add Scheduled Stop</span></div>
            <form id="vendorAddScheduleForm" style="display:flex; flex-direction:column; gap:12px;">
              <input type="date" id="schDate" class="form-control" value="2026-11-26" required>
              <input type="text" id="schLoc" class="form-control" placeholder="Location (e.g. Zilker Food Park)" required>
              <input type="text" id="schTime" class="form-control" placeholder="Time (e.g. 12:00 PM – 8:00 PM)" required>
              <select id="schType" class="form-control"><option>Street Service</option><option>Private Catering</option><option>Festival</option></select>
              <button type="submit" class="btn btn-primary">Add to Calendar</button>
            </form>
            <div style="margin-top:20px; display:flex; flex-direction:column; gap:10px;">
              ${schedules.map((s) => `<div style="padding:10px; border-radius:var(--radius-sm); background:var(--cream-soft); font-size:0.84rem;"><strong>${s.date} • ${s.type}</strong><div>${s.location} (${s.time})</div></div>`).join("")}
            </div>
          </div>
        </div>
      `;
    } else if (currentSection === "menu") {
      view.innerHTML = `
        <div class="dash-view-header"><h1>Menu Management</h1><span class="badge badge-purple">${menuItems.length} Dishes</span></div>
        <div class="dash-panel" style="margin-bottom:24px;">
          <div class="dash-panel-title"><span>Add New Food Item</span></div>
          <form id="vendorAddMenuForm" class="form-grid">
            <div class="form-group"><label class="form-label">Food Name</label><input type="text" id="menuName" class="form-control" placeholder="e.g. Elote Street Corn Cup" required></div>
            <div class="form-group"><label class="form-label">Price ($)</label><input type="number" step="0.5" id="menuPrice" class="form-control" value="9.50" required></div>
            <div class="form-group"><label class="form-label">Category</label><select id="menuCat" class="form-control"><option>Mains</option><option>Specials</option><option>Sides</option><option>Desserts</option><option>Drinks</option></select></div>
            <div class="form-group"><label class="form-label">Food Photo</label><select id="menuImg" class="form-control"><option value="assets/images/truck-tacos.jpg">Tacos Photo</option><option value="assets/images/truck-burger.jpg">Burger Photo</option><option value="assets/images/truck-pizza.jpg">Pizza Photo</option><option value="assets/images/truck-bao.jpg">Bao Photo</option><option value="assets/images/truck-churros.jpg">Churros Photo</option><option value="assets/images/truck-boba.jpg">Boba Drinks Photo</option></select></div>
            <div class="form-group full"><label class="form-label">Description</label><input type="text" id="menuDesc" class="form-control" placeholder="Short appetizing description..." required></div>
            <div class="form-group full"><button type="submit" class="btn btn-primary">Add Dish to Menu</button></div>
          </form>
        </div>
        <div class="menu-item-grid">
          ${menuItems
            .map(
              (m) => `
            <article class="menu-food-card">
              <img src="${m.image}" alt="${m.name}">
              <div style="padding:16px; flex:1; display:flex; flex-direction:column;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                  <span class="badge badge-pink">${m.category}</span>
                  <strong style="color:var(--orange-warm);">$${Number(m.price).toFixed(2)}</strong>
                </div>
                <h4 style="color:var(--purple-deep); margin-bottom:6px;">${m.name}</h4>
                <p style="font-size:0.86rem; color:var(--text-secondary); flex:1; margin-bottom:12px;">${m.desc}</p>
                <div style="display:flex; gap:8px;">
                  <button type="button" class="btn btn-outline btn-sm" data-toggle-menu="${m.id}">${m.available ? "Available" : "Sold Out"}</button>
                  <button type="button" class="btn btn-sm" style="background:var(--danger-bg); color:var(--danger);" data-del-menu="${m.id}">Delete</button>
                </div>
              </div>
            </article>`
            )
            .join("")}
        </div>
      `;
    } else if (currentSection === "bookings") {
      view.innerHTML = `
        <div class="dash-view-header"><h1>Incoming Bookings & Order Status</h1></div>
        <div class="dash-panel dash-table-wrap">
          <table class="dash-table">
            <thead><tr><th>ID</th><th>Customer</th><th>Event</th><th>Date & Location</th><th>Guests</th><th>Total</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              ${vendorBookings
                .map(
                  (b) => `
                <tr>
                  <td><strong>${b.id}</strong></td>
                  <td>${b.customerName}<br><small style="color:var(--text-muted);">${b.customerEmail}</small></td>
                  <td>${b.eventType}</td>
                  <td>${b.date}<br><small style="color:var(--text-muted);">${b.location}</small></td>
                  <td>${b.guests}</td>
                  <td><strong>$${b.amount}</strong></td>
                  <td><span class="badge ${b.status === "Confirmed" || b.status === "Completed" ? "badge-open" : "badge-booking"}">${b.status}</span></td>
                  <td style="display:flex; gap:6px; flex-wrap:wrap;">
                    ${b.status === "Pending" ? `<button class="btn btn-primary btn-sm" data-vendor-bk="${b.id}" data-val="Confirmed">Accept</button><button class="btn btn-outline btn-sm" data-vendor-bk="${b.id}" data-val="Rejected">Reject</button>` : `<select class="form-control" data-vendor-status="${b.id}" style="padding:5px 8px; font-size:0.82rem;">${["Confirmed", "In Progress", "Completed"].map((st) => `<option ${b.status === st ? "selected" : ""}>${st}</option>`).join("")}</select>`}
                  </td>
                </tr>`
                )
                .join("")}
            </tbody>
          </table>
        </div>
      `;
    } else if (currentSection === "earnings") {
      view.innerHTML = `
        <div class="dash-view-header"><h1>Sales & Payout History</h1><span class="badge badge-open">Net Earnings: $${totalEarned.toLocaleString()}</span></div>
        <div class="dash-panel dash-table-wrap">
          <table class="dash-table">
            <thead><tr><th>Tx ID</th><th>Booking</th><th>Customer</th><th>Gross</th><th>Platform Fee</th><th>Net Payout</th><th>Status</th></tr></thead>
            <tbody>
              ${txs.map((tx) => `<tr><td><strong>${tx.id}</strong></td><td>${tx.bookingId}</td><td>${tx.customer}</td><td>$${tx.total}</td><td>$${tx.fee}</td><td><strong>$${tx.net}</strong></td><td><span class="badge badge-open">${tx.status}</span></td></tr>`).join("")}
            </tbody>
          </table>
        </div>
      `;
    } else if (currentSection === "reviews") {
      view.innerHTML = `
        <div class="dash-view-header"><h1>Customer Reviews</h1></div>
        <div style="display:flex; flex-direction:column; gap:16px;">
          ${reviews
            .map(
              (r) => `
            <div class="dash-panel">
              <div style="display:flex; justify-content:space-between; margin-bottom:8px;"><strong>${r.author} • ★ ${r.rating}</strong><span style="font-size:0.84rem; color:var(--text-muted);">${r.date}</span></div>
              <p style="color:var(--text-secondary); margin-bottom:12px;">“${r.comment}”</p>
              ${r.reply ? `<div style="background:var(--cream-soft); padding:10px 14px; border-radius:var(--radius-sm); font-size:0.88rem;"><strong>Your Reply:</strong> ${r.reply}</div>` : `<form data-reply-review="${r.id}" style="display:flex; gap:8px;"><input type="text" class="form-control" placeholder="Write a thank-you reply..." required><button class="btn btn-purple btn-sm">Reply</button></form>`}
            </div>`
            )
            .join("")}
        </div>
      `;
    } else if (currentSection === "settings") {
      renderAccountSettings();
    }
  }

  /* ========================================================================
     CUSTOMER DASHBOARD VIEWS
     ======================================================================== */
  function renderCustomerView() {
    const trucks = S.get(K.TRUCKS, []).filter((t) => t.approvalStatus !== "Rejected");
    const bookings = S.get(K.BOOKINGS, []).filter((b) => b.customerEmail.toLowerCase() === session.email.toLowerCase());
    const favIds = S.get(K.FAVORITES, []);
    const favTrucks = trucks.filter((t) => favIds.includes(t.id));
    const locations = S.get(K.LOCATIONS, []);
    const reviews = S.get(K.REVIEWS, []).filter((r) => r.author === session.name);
    const totalSpent = bookings.reduce((s, b) => s + Number(b.amount || 0), 0);

    if (currentSection === "overview") {
      const nextBk = bookings.find((b) => b.status === "Confirmed" || b.status === "In Progress") || bookings[0];
      view.innerHTML = `
        <div class="dash-view-header">
          <div><span class="eyebrow">Customer Hub</span><h1>Welcome back, ${session.name}</h1></div>
          <button type="button" class="btn btn-primary btn-sm" onclick="document.querySelector('[data-section=discover]').click()">Book a Food Truck</button>
        </div>

        <div class="kpi-mosaic">
          <div class="kpi-lead-card">
            <div>
              <span class="badge badge-booking">Next Scheduled Event</span>
              <div style="font-family:var(--font-display); font-size:1.55rem; font-weight:800; margin:10px 0 4px;">${nextBk ? nextBk.truckName : "No Upcoming Event"}</div>
              <p style="font-size:0.86rem; opacity:0.84;">${nextBk ? `${nextBk.date} • ${nextBk.location}` : "Browse our directory to book your first truck."}</p>
            </div>
            <div style="font-size:0.84rem; padding-top:12px; border-top:1px solid rgba(255,255,255,0.16);">Status: <strong>${nextBk ? nextBk.status : "Ready"}</strong></div>
          </div>
          <div class="kpi-tile cream"><span style="font-size:0.82rem; font-weight:700; color:var(--text-muted);">Total Bookings</span><div class="kpi-val">${bookings.length}</div><span class="badge badge-purple" style="align-self:flex-start;">Active & Past</span></div>
          <div class="kpi-tile pink"><span style="font-size:0.82rem; font-weight:700; color:var(--text-muted);">Favorite Trucks</span><div class="kpi-val">${favTrucks.length}</div><span class="badge badge-open" style="align-self:flex-start;">Saved</span></div>
          <div class="kpi-tile"><span style="font-size:0.82rem; font-weight:700; color:var(--text-muted);">Total Event Spend</span><div class="kpi-val">$${totalSpent.toLocaleString()}</div><span class="badge badge-booking" style="align-self:flex-start;">${locations.length} Saved Spots</span></div>
        </div>
      `;
    } else if (currentSection === "discover") {
      const list = trucks.filter((t) => !searchQuery || t.name.toLowerCase().includes(searchQuery) || t.cuisine.toLowerCase().includes(searchQuery));
      view.innerHTML = `
        <div class="dash-view-header"><h1>Discover Food Trucks</h1><span class="badge badge-purple">${list.length} Trucks</span></div>
        <div class="menu-item-grid">
          ${list
            .map(
              (t) => `
            <article class="menu-food-card">
              <img src="${t.image}" alt="${t.name}">
              <div style="padding:16px; flex:1; display:flex; flex-direction:column;">
                <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                  <span class="badge badge-pink">${t.cuisine}</span>
                  <strong>★ ${t.rating}</strong>
                </div>
                <h4 style="color:var(--purple-deep); margin-bottom:4px;">${t.name}</h4>
                <p style="font-size:0.84rem; color:var(--text-muted); margin-bottom:12px;">${t.neighborhood}, ${t.city} • ${t.cateringMin}</p>
                <div style="display:flex; gap:8px; margin-top:auto;">
                  <button type="button" class="btn btn-outline btn-sm" data-toggle-fav="${t.id}">${favIds.includes(t.id) ? "♥ Saved" : "♡ Save"}</button>
                  <button type="button" class="btn btn-primary btn-sm" data-quick-book="${t.id}" style="flex:1;">Quick Book</button>
                </div>
              </div>
            </article>`
            )
            .join("")}
        </div>
      `;
    } else if (currentSection === "favorites") {
      view.innerHTML = `
        <div class="dash-view-header"><h1>Favorite Food Trucks</h1><span class="badge badge-pink">${favTrucks.length} Saved</span></div>
        <div class="menu-item-grid">
          ${favTrucks
            .map(
              (t) => `
            <article class="menu-food-card">
              <img src="${t.image}" alt="${t.name}">
              <div style="padding:16px;">
                <h4 style="color:var(--purple-deep); margin-bottom:4px;">${t.name}</h4>
                <p style="font-size:0.86rem; color:var(--text-muted); margin-bottom:12px;">${t.cuisine} • ${t.city}</p>
                <div style="display:flex; gap:8px;">
                  <button type="button" class="btn btn-outline btn-sm" data-toggle-fav="${t.id}">Remove</button>
                  <button type="button" class="btn btn-primary btn-sm" data-quick-book="${t.id}">Book Now</button>
                </div>
              </div>
            </article>`
            )
            .join("")}
        </div>
      `;
    } else if (currentSection === "bookings") {
      const stepIdx = { Pending: 1, Confirmed: 2, "In Progress": 3, Completed: 4, Rejected: 0 };
      view.innerHTML = `
        <div class="dash-view-header"><h1>Bookings & Live Order Tracking</h1></div>
        <div style="display:flex; flex-direction:column; gap:16px;">
          ${bookings
            .map((b) => {
              const lvl = stepIdx[b.status] || 1;
              return `
              <div class="dash-panel">
                <div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:10px; margin-bottom:10px;">
                  <div><strong>${b.id} • ${b.truckName}</strong><div style="font-size:0.86rem; color:var(--text-muted);">${b.date} • ${b.guests} Guests • ${b.location}</div></div>
                  <div style="display:flex; align-items:center; gap:10px;"><strong style="color:var(--purple-deep);">$${b.amount}</strong><span class="badge ${b.status === "Completed" || b.status === "Confirmed" ? "badge-open" : "badge-booking"}">${b.status}</span></div>
                </div>
                <div class="tracking-stepper">
                  <div class="track-step ${lvl >= 1 ? "done" : ""}" title="Pending"></div>
                  <div class="track-step ${lvl >= 2 ? "done" : ""}" title="Confirmed"></div>
                  <div class="track-step ${lvl >= 3 ? "done" : ""}" title="In Progress"></div>
                  <div class="track-step ${lvl >= 4 ? "done" : ""}" title="Completed"></div>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-muted); margin-top:6px;">
                  <span>Requested</span><span>Confirmed</span><span>On the Way</span><span>Completed</span>
                </div>
              </div>`;
            })
            .join("")}
        </div>
      `;
    } else if (currentSection === "payments") {
      view.innerHTML = `
        <div class="dash-view-header"><h1>Payment History</h1></div>
        <div class="dash-panel dash-table-wrap">
          <table class="dash-table">
            <thead><tr><th>Booking ID</th><th>Food Truck</th><th>Event Date</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>${bookings.map((b) => `<tr><td><strong>${b.id}</strong></td><td>${b.truckName}</td><td>${b.date}</td><td><strong>$${b.amount}</strong></td><td><span class="badge badge-open">Paid</span></td></tr>`).join("")}</tbody>
          </table>
        </div>
      `;
    } else if (currentSection === "reviews") {
      view.innerHTML = `
        <div class="dash-view-header"><h1>My Food Truck Reviews</h1></div>
        <div class="dash-split-2">
          <div style="display:flex; flex-direction:column; gap:14px;">
            ${reviews.map((r) => `<div class="dash-panel"><strong>${r.truckName} • ★ ${r.rating}</strong><p style="margin-top:6px; color:var(--text-secondary);">“${r.comment}”</p></div>`).join("")}
          </div>
          <div class="dash-panel">
            <div class="dash-panel-title"><span>Write a Review</span></div>
            <form id="customerAddReviewForm" style="display:flex; flex-direction:column; gap:12px;">
              <select id="revTruckId" class="form-control">${trucks.map((t) => `<option value="${t.id}">${t.name}</option>`).join("")}</select>
              <select id="revRating" class="form-control"><option value="5">5 Stars</option><option value="4">4 Stars</option><option value="3">3 Stars</option></select>
              <textarea id="revComment" class="form-control" rows="3" placeholder="Share your street food experience..." required></textarea>
              <button type="submit" class="btn btn-primary">Submit Review</button>
            </form>
          </div>
        </div>
      `;
    } else if (currentSection === "locations") {
      view.innerHTML = `
        <div class="dash-view-header"><h1>Saved Event Locations</h1></div>
        <div class="dash-split-2">
          <div style="display:flex; flex-direction:column; gap:14px;">
            ${locations.map((l) => `<div class="dash-panel" style="display:flex; justify-content:space-between; align-items:center;"><div><strong>${l.label}</strong><div style="font-size:0.88rem; color:var(--text-muted);">${l.address}</div></div><button class="btn btn-sm" style="background:var(--danger-bg); color:var(--danger);" data-del-loc="${l.id}">Remove</button></div>`).join("")}
          </div>
          <div class="dash-panel">
            <div class="dash-panel-title"><span>Add New Location</span></div>
            <form id="customerAddLocForm" style="display:flex; flex-direction:column; gap:12px;">
              <input type="text" id="locLabel" class="form-control" placeholder="Label (e.g. Office Courtyard)" required>
              <input type="text" id="locAddress" class="form-control" placeholder="Full Street Address" required>
              <button type="submit" class="btn btn-primary">Save Location</button>
            </form>
          </div>
        </div>
      `;
    } else if (currentSection === "settings") {
      renderAccountSettings();
    }
  }

  function renderAccountSettings() {
    view.innerHTML = `
      <div class="dash-view-header"><h1>Account Profile & Settings</h1></div>
      <div class="dash-panel" style="max-width:600px;">
        <form id="userSettingsForm" style="display:flex; flex-direction:column; gap:14px;">
          <div class="form-group"><label class="form-label">Full Name</label><input type="text" id="setAccName" class="form-control" value="${session.name}" required></div>
          <div class="form-group"><label class="form-label">City</label><input type="text" id="setAccCity" class="form-control" value="${session.city || "Austin, TX"}" required></div>
          <div class="form-group"><label class="form-label">Email (Read-Only)</label><input type="email" class="form-control" value="${session.email}" disabled></div>
          <button type="submit" class="btn btn-primary">Save Profile</button>
        </form>
      </div>
    `;
  }

  // Event Delegation
  view.addEventListener("click", (e) => {
    const calCell = e.target.closest("[data-cal-date]");
    if (calCell) {
      const dInput = document.getElementById("schDate");
      if (dInput) dInput.value = calCell.dataset.calDate;
      toast(`Selected ${calCell.dataset.calDate} for scheduling.`);
      return;
    }

    const togMenu = e.target.closest("[data-toggle-menu]");
    if (togMenu) {
      const truck = getVendorTruck();
      const map = S.get(K.MENUS, {});
      map[truck.id] = (map[truck.id] || []).map((m) => (m.id === togMenu.dataset.toggleMenu ? { ...m, available: !m.available } : m));
      S.set(K.MENUS, map);
      toast("Dish availability updated.");
      renderView();
      return;
    }

    const delMenu = e.target.closest("[data-del-menu]");
    if (delMenu) {
      const truck = getVendorTruck();
      const map = S.get(K.MENUS, {});
      map[truck.id] = (map[truck.id] || []).filter((m) => m.id !== delMenu.dataset.delMenu);
      S.set(K.MENUS, map);
      toast("Dish removed from menu.");
      renderView();
      return;
    }

    const vBk = e.target.closest("[data-vendor-bk]");
    if (vBk) {
      S.set(K.BOOKINGS, S.get(K.BOOKINGS, []).map((b) => (b.id === vBk.dataset.vendorBk ? { ...b, status: vBk.dataset.val } : b)));
      toast(`Booking ${vBk.dataset.vendorBk} marked ${vBk.dataset.val}.`);
      renderView();
      return;
    }

    const togFav = e.target.closest("[data-toggle-fav]");
    if (togFav) {
      let favs = S.get(K.FAVORITES, []);
      const id = togFav.dataset.toggleFav;
      favs = favs.includes(id) ? favs.filter((f) => f !== id) : [...favs, id];
      S.set(K.FAVORITES, favs);
      toast("Favorites updated.");
      renderView();
      return;
    }

    const qBook = e.target.closest("[data-quick-book]");
    if (qBook) {
      const truck = S.get(K.TRUCKS, []).find((t) => t.id === qBook.dataset.quickBook);
      if (!truck) return;
      const bks = S.get(K.BOOKINGS, []);
      bks.unshift({
        id: "BK-" + Math.floor(1050 + Math.random() * 8900),
        truckId: truck.id,
        truckName: truck.name,
        customerEmail: session.email,
        customerName: session.name,
        eventType: "Private Event",
        date: "2026-12-05",
        guests: 60,
        location: session.city || truck.city,
        amount: 900,
        status: "Pending"
      });
      S.set(K.BOOKINGS, bks);
      toast(`Booking request sent to ${truck.name}!`);
      return;
    }

    const delLoc = e.target.closest("[data-del-loc]");
    if (delLoc) {
      S.set(K.LOCATIONS, S.get(K.LOCATIONS, []).filter((l) => l.id !== delLoc.dataset.delLoc));
      toast("Saved location removed.");
      renderView();
    }
  });

  view.addEventListener("change", (e) => {
    if (e.target.dataset.vendorStatus) {
      const id = e.target.dataset.vendorStatus;
      S.set(K.BOOKINGS, S.get(K.BOOKINGS, []).map((b) => (b.id === id ? { ...b, status: e.target.value } : b)));
      toast(`Order ${id} updated to ${e.target.value}.`);
      renderView();
    }
  });

  view.addEventListener("submit", (e) => {
    e.preventDefault();
    if (e.target.id === "vendorTruckForm") {
      const truck = getVendorTruck();
      const updated = S.get(K.TRUCKS, []).map((t) =>
        t.id === truck.id
          ? {
              ...t,
              name: document.getElementById("vtName").value.trim(),
              cuisine: document.getElementById("vtCuisine").value.trim(),
              city: document.getElementById("vtCity").value.trim(),
              neighborhood: document.getElementById("vtHood").value.trim(),
              hours: document.getElementById("vtHours").value.trim(),
              availability: document.getElementById("vtAvail").value,
              description: document.getElementById("vtDesc").value.trim()
            }
          : t
      );
      S.set(K.TRUCKS, updated);
      toast("Food truck profile updated!");
    } else if (e.target.id === "vendorAddScheduleForm") {
      const truck = getVendorTruck();
      const list = S.get(K.SCHEDULES, []);
      list.push({
        id: "sch-" + Date.now(),
        truckId: truck.id,
        date: document.getElementById("schDate").value,
        location: document.getElementById("schLoc").value.trim(),
        time: document.getElementById("schTime").value.trim(),
        type: document.getElementById("schType").value
      });
      S.set(K.SCHEDULES, list);
      toast("Schedule stop added to calendar!");
      renderView();
    } else if (e.target.id === "vendorAddMenuForm") {
      const truck = getVendorTruck();
      const map = S.get(K.MENUS, {});
      map[truck.id] = map[truck.id] || [];
      map[truck.id].unshift({
        id: "m-" + Date.now(),
        name: document.getElementById("menuName").value.trim(),
        price: Number(document.getElementById("menuPrice").value),
        category: document.getElementById("menuCat").value,
        image: document.getElementById("menuImg").value,
        desc: document.getElementById("menuDesc").value.trim(),
        available: true
      });
      S.set(K.MENUS, map);
      toast("New dish added to your menu!");
      renderView();
    } else if (e.target.dataset.replyReview) {
      const id = e.target.dataset.replyReview;
      const val = e.target.querySelector("input").value.trim();
      S.set(K.REVIEWS, S.get(K.REVIEWS, []).map((r) => (r.id === id ? { ...r, reply: val } : r)));
      toast("Reply posted!");
      renderView();
    } else if (e.target.id === "customerAddReviewForm") {
      const sel = document.getElementById("revTruckId");
      const list = S.get(K.REVIEWS, []);
      list.unshift({
        id: "rev-" + Date.now(),
        truckId: sel.value,
        truckName: sel.options[sel.selectedIndex].text,
        author: session.name,
        rating: Number(document.getElementById("revRating").value),
        comment: document.getElementById("revComment").value.trim(),
        date: new Date().toISOString().split("T")[0],
        status: "Published",
        reply: ""
      });
      S.set(K.REVIEWS, list);
      toast("Review submitted!");
      renderView();
    } else if (e.target.id === "customerAddLocForm") {
      const list = S.get(K.LOCATIONS, []);
      list.push({ id: "loc-" + Date.now(), label: document.getElementById("locLabel").value.trim(), address: document.getElementById("locAddress").value.trim() });
      S.set(K.LOCATIONS, list);
      toast("Location saved!");
      renderView();
    } else if (e.target.id === "userSettingsForm") {
      const newName = document.getElementById("setAccName").value.trim();
      const newCity = document.getElementById("setAccCity").value.trim();
      S.set(K.SESSION, { ...session, name: newName, city: newCity });
      toast("Profile saved!");
      setTimeout(() => window.location.reload(), 500);
    }
  });

  renderView();
});

