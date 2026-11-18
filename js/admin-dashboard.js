/* ==========================================================================
   RoamBite — Admin Dashboard Controller
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
    const next = htmlEl.getAttribute("data-theme") === "dark" ? "light" : "dark";
    localStorage.setItem("roambite_theme", next);
    syncPrefs();
  });
  rtlBtn?.addEventListener("click", () => {
    const next = htmlEl.getAttribute("dir") === "rtl" ? "ltr" : "rtl";
    localStorage.setItem("roambite_dir", next);
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

  // Direct Admin Workspace Access (auto-initialize admin profile if none active)
  let session = S.getSession();
  if (!session || session.role !== "admin") {
    session = {
      id: "u-admin",
      name: "Camila Reyes",
      email: "admin@roambite.com",
      role: "admin",
      city: "Austin, TX"
    };
  }
  const gate = document.getElementById("adminAccessGate");
  const shell = document.getElementById("adminAppShell");

  if (gate) gate.style.display = "none";
  shell.style.display = "grid";

  function doLogout() {
    S.logout();
    window.location.href = "auth.html";
  }
  document.getElementById("adminLogoutBtn")?.addEventListener("click", doLogout);
  document.getElementById("adminMenuLogout")?.addEventListener("click", doLogout);

  // Mobile Sidebar & Dropdowns
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
    const btn = document.getElementById(btnId);
    btn?.addEventListener("click", (e) => {
      e.stopPropagation();
      wrap.classList.toggle("open");
    });
    document.addEventListener("click", (e) => {
      if (!wrap?.contains(e.target)) wrap?.classList.remove("open");
    });
  }
  setupDropdown("adminNotifWrap", "adminNotifBtn");
  setupDropdown("adminProfileWrap", "adminProfileBtn");

  function renderNotifs() {
    const notifs = S.get(K.NOTIFICATIONS, []).filter((n) => n.role === "admin");
    const menu = document.getElementById("adminNotifMenu");
    const dot = document.getElementById("adminNotifDot");
    const hasUnread = notifs.some((n) => n.unread);
    if (dot) dot.style.display = hasUnread ? "block" : "none";
    if (!menu) return;
    menu.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; padding-bottom:8px; border-bottom:1px solid var(--cream-border); margin-bottom:8px;">
        <strong>Admin Alerts</strong>
        <button type="button" class="btn btn-sm btn-outline" id="markAdminReadBtn" style="padding:3px 10px; font-size:0.75rem;">Mark Read</button>
      </div>
      ${notifs.length ? notifs.map((n) => `<div style="padding:8px 0; border-bottom:1px dashed var(--cream-border); font-size:0.84rem;"><div>${n.text}</div><small style="color:var(--text-muted);">${n.time}</small></div>`).join("") : `<p style="font-size:0.85rem; color:var(--text-muted);">All caught up.</p>`}
    `;
    document.getElementById("markAdminReadBtn")?.addEventListener("click", () => {
      const all = S.get(K.NOTIFICATIONS, []).map((n) => (n.role === "admin" ? { ...n, unread: false } : n));
      S.set(K.NOTIFICATIONS, all);
      renderNotifs();
    });
  }
  renderNotifs();

  let currentSection = "overview";
  let searchQuery = "";
  const view = document.getElementById("adminMainView");

  document.getElementById("adminGlobalSearch")?.addEventListener("input", (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    renderSection(currentSection);
  });

  document.querySelectorAll("#adminNav .dash-nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#adminNav .dash-nav-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentSection = btn.dataset.section;
      sidebar.classList.remove("open");
      backdrop.classList.remove("open");
      renderSection(currentSection);
    });
  });

  function renderSection(sec) {
    const users = S.get(K.USERS, []);
    const trucks = S.get(K.TRUCKS, []);
    const bookings = S.get(K.BOOKINGS, []);
    const cuisines = S.get(K.CUISINES, []);
    const transactions = S.get(K.TRANSACTIONS, []);
    const promos = S.get(K.PROMOS, []);
    const reviews = S.get(K.REVIEWS, []);
    const blog = S.get(K.BLOG, []);
    const enquiries = S.get(K.ENQUIRIES, []);
    const settings = S.get(K.SETTINGS, {});

    if (sec === "overview") {
      const vendors = users.filter((u) => u.role === "vendor");
      const activeBookings = bookings.filter((b) => ["Confirmed", "In Progress"].includes(b.status));
      const completedBookings = bookings.filter((b) => b.status === "Completed");
      const pendingBookings = bookings.filter((b) => b.status === "Pending");
      const pendingTrucks = trucks.filter((t) => t.approvalStatus === "Pending");
      const totalRev = transactions.reduce((sum, t) => sum + Number(t.total || 0), 0);

      view.innerHTML = `
        <div class="dash-view-header">
          <div>
            <span class="eyebrow">Platform Analytics</span>
            <h1>Admin Overview</h1>
          </div>
          <div style="display:flex; gap:10px;">
            <button type="button" class="btn btn-outline btn-sm" onclick="document.querySelector('[data-section=trucks]').click()">Pending Trucks (${pendingTrucks.length})</button>
            <button type="button" class="btn btn-primary btn-sm" onclick="document.querySelector('[data-section=bookings]').click()">Manage Bookings</button>
          </div>
        </div>

        <div class="kpi-mosaic">
          <div class="kpi-lead-card">
            <div>
              <span class="badge badge-booking">Gross Booking Volume</span>
              <div style="font-family:var(--font-display); font-size:2.4rem; font-weight:900; margin:10px 0 4px;">$${totalRev.toLocaleString()}</div>
              <p style="font-size:0.86rem; opacity:0.82;">${bookings.length} total platform bookings • ${completedBookings.length} completed</p>
            </div>
            <div style="font-size:0.82rem; opacity:0.85; padding-top:12px; border-top:1px solid rgba(255,255,255,0.16);">
              Active Bookings: <strong>${activeBookings.length}</strong> • Pending: <strong>${pendingBookings.length}</strong>
            </div>
          </div>
          <div class="kpi-tile cream">
            <span style="font-size:0.82rem; font-weight:700; color:var(--text-muted);">Registered Users</span>
            <div class="kpi-val">${users.length}</div>
            <span class="badge badge-open" style="align-self:flex-start;">${vendors.length} Vendors</span>
          </div>
          <div class="kpi-tile pink">
            <span style="font-size:0.82rem; font-weight:700; color:var(--text-muted);">Listed Food Trucks</span>
            <div class="kpi-val">${trucks.length}</div>
            <span class="badge badge-booking" style="align-self:flex-start;">${pendingTrucks.length} Awaiting Approval</span>
          </div>
          <div class="kpi-tile">
            <span style="font-size:0.82rem; font-weight:700; color:var(--text-muted);">Active Bookings</span>
            <div class="kpi-val">${activeBookings.length}</div>
            <span class="badge badge-purple" style="align-self:flex-start;">${pendingBookings.length} Pending Requests</span>
          </div>
        </div>

        <div class="dash-split-2">
          <div class="dash-panel">
            <div class="dash-panel-title">
              <span>Monthly Booking Velocity</span>
              <span class="badge badge-pink">Last 6 Months</span>
            </div>
            <div class="bar-chart">
              ${[
                { m: "Jun", h: 48 },
                { m: "Jul", h: 62 },
                { m: "Aug", h: 74 },
                { m: "Sep", h: 68 },
                { m: "Oct", h: 86 },
                { m: "Nov", h: 95 }
              ]
                .map(
                  (d) => `<div class="bar-col"><div class="bar-fill" style="height:${d.h}%;"></div><span class="bar-label">${d.m}</span></div>`
                )
                .join("")}
            </div>
          </div>

          <div class="dash-panel">
            <div class="dash-panel-title"><span>Recent Platform Activity</span></div>
            <div style="display:flex; flex-direction:column; gap:12px;">
              ${bookings
                .slice(0, 4)
                .map(
                  (b) => `
                <div style="padding:10px 12px; border-radius:var(--radius-sm); background:var(--cream-soft); border-left:4px solid var(--orange-warm); font-size:0.86rem;">
                  <strong>${b.id} • ${b.truckName}</strong>
                  <div style="color:var(--text-muted);">${b.customerName} (${b.guests} guests) — <strong>${b.status}</strong></div>
                </div>`
                )
                .join("")}
            </div>
          </div>
        </div>
      `;
    } else if (sec === "users") {
      const list = users.filter((u) => !searchQuery || u.name.toLowerCase().includes(searchQuery) || u.email.toLowerCase().includes(searchQuery));
      view.innerHTML = `
        <div class="dash-view-header"><h1>User Management</h1><span class="badge badge-purple">${list.length} Users</span></div>
        <div class="dash-panel dash-table-wrap">
          <table class="dash-table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>City</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              ${list
                .map(
                  (u) => `
                <tr>
                  <td><strong>${u.name}</strong></td>
                  <td>${u.email}</td>
                  <td><span class="badge badge-pink">${u.role}</span></td>
                  <td>${u.city}</td>
                  <td><span class="badge ${u.status === "Active" ? "badge-open" : "badge-booking"}">${u.status}</span></td>
                  <td style="display:flex; gap:8px;">
                    ${u.role !== "admin" ? `<button class="btn btn-outline btn-sm" data-toggle-user="${u.id}">${u.status === "Active" ? "Suspend" : "Activate"}</button><button class="btn btn-sm" style="background:var(--danger-bg); color:var(--danger);" data-del-user="${u.id}">Delete</button>` : `<span style="font-size:0.8rem; color:var(--text-muted);">Protected</span>`}
                  </td>
                </tr>`
                )
                .join("")}
            </tbody>
          </table>
        </div>
      `;
    } else if (sec === "vendors") {
      const vendors = users.filter((u) => u.role === "vendor");
      view.innerHTML = `
        <div class="dash-view-header"><h1>Food Truck Vendor Management</h1><span class="badge badge-booking">${vendors.length} Vendors</span></div>
        <div class="dash-panel dash-table-wrap">
          <table class="dash-table">
            <thead><tr><th>Owner Name</th><th>Email</th><th>City</th><th>Joined</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              ${vendors
                .map(
                  (v) => `
                <tr>
                  <td><strong>${v.name}</strong></td>
                  <td>${v.email}</td>
                  <td>${v.city}</td>
                  <td>${v.joined}</td>
                  <td><span class="badge ${v.status === "Active" ? "badge-open" : "badge-booking"}">${v.status}</span></td>
                  <td><button class="btn btn-outline btn-sm" data-toggle-user="${v.id}">${v.status === "Active" ? "Suspend Vendor" : "Approve Vendor"}</button></td>
                </tr>`
                )
                .join("")}
            </tbody>
          </table>
        </div>
      `;
    } else if (sec === "trucks") {
      const list = trucks.filter((t) => !searchQuery || t.name.toLowerCase().includes(searchQuery) || t.city.toLowerCase().includes(searchQuery));
      view.innerHTML = `
        <div class="dash-view-header"><h1>Food Truck Approvals & Listings</h1><span class="badge badge-purple">${list.length} Trucks</span></div>
        <div class="dash-panel dash-table-wrap">
          <table class="dash-table">
            <thead><tr><th>Truck</th><th>Cuisine</th><th>Location</th><th>Rating</th><th>Approval</th><th>Actions</th></tr></thead>
            <tbody>
              ${list
                .map(
                  (t) => `
                <tr>
                  <td style="display:flex; align-items:center; gap:10px;"><img src="${t.image}" alt="${t.name}" style="width:48px; height:38px; border-radius:8px;"><strong>${t.name}</strong></td>
                  <td>${t.cuisine}</td>
                  <td>${t.city}</td>
                  <td>★ ${t.rating}</td>
                  <td><span class="badge ${t.approvalStatus === "Approved" ? "badge-open" : "badge-booking"}">${t.approvalStatus || "Approved"}</span></td>
                  <td style="display:flex; gap:6px;">
                    <button class="btn btn-primary btn-sm" data-approve-truck="${t.id}">Approve</button>
                    <button class="btn btn-outline btn-sm" data-reject-truck="${t.id}">Reject</button>
                    <button class="btn btn-sm" style="background:var(--danger-bg); color:var(--danger);" data-del-truck="${t.id}">Remove</button>
                  </td>
                </tr>`
                )
                .join("")}
            </tbody>
          </table>
        </div>
      `;
    } else if (sec === "cuisines") {
      view.innerHTML = `
        <div class="dash-view-header"><h1>Cuisine Category Management</h1></div>
        <div class="dash-split-2">
          <div class="dash-panel dash-table-wrap">
            <table class="dash-table">
              <thead><tr><th>Cuisine Name</th><th>Trucks</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                ${cuisines
                  .map(
                    (c) => `
                  <tr>
                    <td><strong>${c.name}</strong></td>
                    <td>${c.count}</td>
                    <td><span class="badge ${c.active ? "badge-open" : "badge-booking"}">${c.active ? "Active" : "Hidden"}</span></td>
                    <td><button class="btn btn-outline btn-sm" data-toggle-cuisine="${c.id}">Toggle</button></td>
                  </tr>`
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
          <div class="dash-panel">
            <div class="dash-panel-title"><span>Add Cuisine Category</span></div>
            <form id="adminAddCuisineForm" style="display:flex; flex-direction:column; gap:14px;">
              <div class="form-group">
                <label class="form-label">Category Name</label>
                <input type="text" id="newCuisineName" class="form-control" placeholder="e.g. Korean BBQ" required>
              </div>
              <button type="submit" class="btn btn-primary">Add Category</button>
            </form>
          </div>
        </div>
      `;
    } else if (sec === "bookings") {
      const list = bookings.filter((b) => !searchQuery || b.truckName.toLowerCase().includes(searchQuery) || b.customerName.toLowerCase().includes(searchQuery));
      view.innerHTML = `
        <div class="dash-view-header"><h1>Booking & Order Management</h1><span class="badge badge-purple">${list.length} Bookings</span></div>
        <div class="dash-panel dash-table-wrap">
          <table class="dash-table">
            <thead><tr><th>ID</th><th>Food Truck</th><th>Customer</th><th>Event Date</th><th>Guests</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>
              ${list
                .map(
                  (b) => `
                <tr>
                  <td><strong>${b.id}</strong></td>
                  <td>${b.truckName}</td>
                  <td>${b.customerName}</td>
                  <td>${b.date}</td>
                  <td>${b.guests}</td>
                  <td>$${b.amount}</td>
                  <td>
                    <select class="form-control" data-booking-status="${b.id}" style="padding:6px 10px; font-size:0.84rem;">
                      ${["Pending", "Confirmed", "In Progress", "Completed", "Rejected"].map((st) => `<option ${b.status === st ? "selected" : ""}>${st}</option>`).join("")}
                    </select>
                  </td>
                </tr>`
                )
                .join("")}
            </tbody>
          </table>
        </div>
      `;
    } else if (sec === "transactions") {
      view.innerHTML = `
        <div class="dash-view-header"><h1>Payments & Transaction Records</h1></div>
        <div class="dash-panel dash-table-wrap">
          <table class="dash-table">
            <thead><tr><th>Tx ID</th><th>Booking</th><th>Truck</th><th>Customer</th><th>Total</th><th>Platform Fee</th><th>Net Payout</th><th>Status</th></tr></thead>
            <tbody>
              ${transactions
                .map(
                  (tx) => `
                <tr>
                  <td><strong>${tx.id}</strong></td>
                  <td>${tx.bookingId}</td>
                  <td>${tx.truckName}</td>
                  <td>${tx.customer}</td>
                  <td>$${tx.total}</td>
                  <td>$${tx.fee}</td>
                  <td><strong>$${tx.net}</strong></td>
                  <td><span class="badge badge-open">${tx.status}</span></td>
                </tr>`
                )
                .join("")}
            </tbody>
          </table>
        </div>
      `;
    } else if (sec === "promos") {
      view.innerHTML = `
        <div class="dash-view-header"><h1>Promotional Offers</h1></div>
        <div class="dash-split-2">
          <div class="dash-panel dash-table-wrap">
            <table class="dash-table">
              <thead><tr><th>Code</th><th>Discount</th><th>Min Order</th><th>Expiry</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                ${promos
                  .map(
                    (p) => `
                  <tr>
                    <td><strong>${p.code}</strong></td>
                    <td>${p.discount}</td>
                    <td>${p.minOrder}</td>
                    <td>${p.expiry}</td>
                    <td><span class="badge ${p.active ? "badge-open" : "badge-booking"}">${p.active ? "Active" : "Paused"}</span></td>
                    <td><button class="btn btn-outline btn-sm" data-toggle-promo="${p.id}">Toggle</button></td>
                  </tr>`
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
          <div class="dash-panel">
            <div class="dash-panel-title"><span>Create Promo Code</span></div>
            <form id="adminAddPromoForm" style="display:flex; flex-direction:column; gap:12px;">
              <input type="text" id="promoCodeInput" class="form-control" placeholder="Code (e.g. TACO25)" required>
              <input type="text" id="promoDiscountInput" class="form-control" placeholder="Discount (e.g. $25 Off)" required>
              <input type="date" id="promoExpiryInput" class="form-control" required>
              <button type="submit" class="btn btn-primary">Launch Promo</button>
            </form>
          </div>
        </div>
      `;
    } else if (sec === "reviews") {
      view.innerHTML = `
        <div class="dash-view-header"><h1>Customer Reviews & Feedback</h1></div>
        <div class="dash-panel dash-table-wrap">
          <table class="dash-table">
            <thead><tr><th>Truck</th><th>Author</th><th>Rating</th><th>Comment</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              ${reviews
                .map(
                  (r) => `
                <tr>
                  <td><strong>${r.truckName}</strong></td>
                  <td>${r.author}</td>
                  <td>★ ${r.rating}</td>
                  <td style="max-width:320px;">${r.comment}</td>
                  <td><span class="badge ${r.status === "Published" ? "badge-open" : "badge-booking"}">${r.status}</span></td>
                  <td><button class="btn btn-outline btn-sm" data-toggle-review="${r.id}">${r.status === "Published" ? "Hide" : "Publish"}</button></td>
                </tr>`
                )
                .join("")}
            </tbody>
          </table>
        </div>
      `;
    } else if (sec === "blog") {
      view.innerHTML = `
        <div class="dash-view-header"><h1>Blog & Content Management</h1></div>
        <div class="dash-split-2">
          <div class="dash-panel dash-table-wrap">
            <table class="dash-table">
              <thead><tr><th>Title</th><th>Category</th><th>Author</th><th>Action</th></tr></thead>
              <tbody>
                ${blog
                  .map(
                    (a) => `
                  <tr>
                    <td><strong>${a.title}</strong></td>
                    <td><span class="badge badge-pink">${a.category}</span></td>
                    <td>${a.author}</td>
                    <td><button class="btn btn-sm" style="background:var(--danger-bg); color:var(--danger);" data-del-blog="${a.id}">Delete</button></td>
                  </tr>`
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
          <div class="dash-panel">
            <div class="dash-panel-title"><span>Publish New Article</span></div>
            <form id="adminAddBlogForm" style="display:flex; flex-direction:column; gap:12px;">
              <input type="text" id="blogTitleInput" class="form-control" placeholder="Article Headline" required>
              <select id="blogCatInput" class="form-control"><option>Guides</option><option>Vendor Stories</option><option>Events</option><option>Trends</option></select>
              <textarea id="blogExcerptInput" class="form-control" rows="3" placeholder="Short summary..." required></textarea>
              <button type="submit" class="btn btn-primary">Publish Post</button>
            </form>
          </div>
        </div>
      `;
    } else if (sec === "enquiries") {
      view.innerHTML = `
        <div class="dash-view-header"><h1>Contact Enquiries</h1></div>
        <div class="dash-panel dash-table-wrap">
          <table class="dash-table">
            <thead><tr><th>Sender</th><th>Topic</th><th>Message</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              ${enquiries
                .map(
                  (e) => `
                <tr>
                  <td><strong>${e.name}</strong><br><small style="color:var(--text-muted);">${e.email}</small></td>
                  <td>${e.topic}</td>
                  <td style="max-width:300px;">${e.message}</td>
                  <td><span class="badge ${e.status === "Resolved" ? "badge-open" : "badge-booking"}">${e.status}</span></td>
                  <td><button class="btn btn-outline btn-sm" data-resolve-enq="${e.id}">${e.status === "Resolved" ? "Reopen" : "Mark Resolved"}</button></td>
                </tr>`
                )
                .join("")}
            </tbody>
          </table>
        </div>
      `;
    } else if (sec === "settings") {
      view.innerHTML = `
        <div class="dash-view-header"><h1>Website & Platform Settings</h1></div>
        <div class="dash-panel" style="max-width:680px;">
          <form id="adminSettingsForm" class="form-grid">
            <div class="form-group">
              <label class="form-label">Platform Name</label>
              <input type="text" id="setPlatformName" class="form-control" value="${settings.platformName || "RoamBite"}" required>
            </div>
            <div class="form-group">
              <label class="form-label">Support Email</label>
              <input type="email" id="setSupportEmail" class="form-control" value="${settings.supportEmail || "hello@roambite.com"}" required>
            </div>
            <div class="form-group">
              <label class="form-label">Booking Commission (%)</label>
              <input type="number" id="setCommission" class="form-control" value="${settings.commissionRate || 10}" min="0" max="30">
            </div>
            <div class="form-group">
              <label class="form-label">Booking Deposit (%)</label>
              <input type="number" id="setDeposit" class="form-control" value="${settings.depositPercent || 25}" min="5" max="100">
            </div>
            <div class="form-group full">
              <button type="submit" class="btn btn-primary">Save Platform Settings</button>
            </div>
          </form>
        </div>
      `;
    }
  }

  // Event Delegation for Admin Actions
  view.addEventListener("click", (e) => {
    const toggleUser = e.target.closest("[data-toggle-user]");
    if (toggleUser) {
      const users = S.get(K.USERS, []).map((u) => (u.id === toggleUser.dataset.toggleUser ? { ...u, status: u.status === "Active" ? "Suspended" : "Active" } : u));
      S.set(K.USERS, users);
      toast("User status updated.");
      renderSection(currentSection);
      return;
    }

    const delUser = e.target.closest("[data-del-user]");
    if (delUser) {
      S.set(K.USERS, S.get(K.USERS, []).filter((u) => u.id !== delUser.dataset.delUser));
      toast("User removed.");
      renderSection(currentSection);
      return;
    }

    const appTruck = e.target.closest("[data-approve-truck]");
    if (appTruck) {
      S.set(K.TRUCKS, S.get(K.TRUCKS, []).map((t) => (t.id === appTruck.dataset.approveTruck ? { ...t, approvalStatus: "Approved" } : t)));
      toast("Food truck listing approved!");
      renderSection("trucks");
      return;
    }

    const rejTruck = e.target.closest("[data-reject-truck]");
    if (rejTruck) {
      S.set(K.TRUCKS, S.get(K.TRUCKS, []).map((t) => (t.id === rejTruck.dataset.rejectTruck ? { ...t, approvalStatus: "Rejected" } : t)));
      toast("Food truck listing marked Rejected.");
      renderSection("trucks");
      return;
    }

    const delTruck = e.target.closest("[data-del-truck]");
    if (delTruck) {
      S.set(K.TRUCKS, S.get(K.TRUCKS, []).filter((t) => t.id !== delTruck.dataset.delTruck));
      toast("Food truck deleted.");
      renderSection("trucks");
      return;
    }

    const togCuisine = e.target.closest("[data-toggle-cuisine]");
    if (togCuisine) {
      S.set(K.CUISINES, S.get(K.CUISINES, []).map((c) => (c.id === togCuisine.dataset.toggleCuisine ? { ...c, active: !c.active } : c)));
      toast("Cuisine visibility updated.");
      renderSection("cuisines");
      return;
    }

    const togPromo = e.target.closest("[data-toggle-promo]");
    if (togPromo) {
      S.set(K.PROMOS, S.get(K.PROMOS, []).map((p) => (p.id === togPromo.dataset.togglePromo ? { ...p, active: !p.active } : p)));
      toast("Promo status updated.");
      renderSection("promos");
      return;
    }

    const togRev = e.target.closest("[data-toggle-review]");
    if (togRev) {
      S.set(K.REVIEWS, S.get(K.REVIEWS, []).map((r) => (r.id === togRev.dataset.toggleReview ? { ...r, status: r.status === "Published" ? "Hidden" : "Published" } : r)));
      toast("Review visibility updated.");
      renderSection("reviews");
      return;
    }

    const delBlog = e.target.closest("[data-del-blog]");
    if (delBlog) {
      S.set(K.BLOG, S.get(K.BLOG, []).filter((a) => a.id !== delBlog.dataset.delBlog));
      toast("Blog post deleted.");
      renderSection("blog");
      return;
    }

    const resEnq = e.target.closest("[data-resolve-enq]");
    if (resEnq) {
      S.set(K.ENQUIRIES, S.get(K.ENQUIRIES, []).map((en) => (en.id === resEnq.dataset.resolveEnq ? { ...en, status: en.status === "Resolved" ? "Open" : "Resolved" } : en)));
      toast("Enquiry status updated.");
      renderSection("enquiries");
    }
  });

  view.addEventListener("change", (e) => {
    if (e.target.dataset.bookingStatus) {
      const id = e.target.dataset.bookingStatus;
      const newStatus = e.target.value;
      S.set(K.BOOKINGS, S.get(K.BOOKINGS, []).map((b) => (b.id === id ? { ...b, status: newStatus } : b)));
      toast(`Booking ${id} updated to ${newStatus}.`);
    }
  });

  view.addEventListener("submit", (e) => {
    e.preventDefault();
    if (e.target.id === "adminAddCuisineForm") {
      const list = S.get(K.CUISINES, []);
      list.push({ id: "c-" + Date.now(), name: document.getElementById("newCuisineName").value.trim(), count: 1, active: true });
      S.set(K.CUISINES, list);
      toast("Cuisine category added!");
      renderSection("cuisines");
    } else if (e.target.id === "adminAddPromoForm") {
      const list = S.get(K.PROMOS, []);
      list.unshift({
        id: "pr-" + Date.now(),
        code: document.getElementById("promoCodeInput").value.trim().toUpperCase(),
        discount: document.getElementById("promoDiscountInput").value.trim(),
        minOrder: "$350",
        expiry: document.getElementById("promoExpiryInput").value,
        active: true
      });
      S.set(K.PROMOS, list);
      toast("Promo code launched!");
      renderSection("promos");
    } else if (e.target.id === "adminAddBlogForm") {
      const list = S.get(K.BLOG, []);
      list.unshift({
        id: "art-" + Date.now(),
        title: document.getElementById("blogTitleInput").value.trim(),
        category: document.getElementById("blogCatInput").value,
        author: session.name,
        date: "Nov 17, 2026",
        readTime: "4 min read",
        image: "assets/images/hero-festival.jpg",
        excerpt: document.getElementById("blogExcerptInput").value.trim(),
        content: [document.getElementById("blogExcerptInput").value.trim()]
      });
      S.set(K.BLOG, list);
      toast("New blog article published!");
      renderSection("blog");
    } else if (e.target.id === "adminSettingsForm") {
      S.set(K.SETTINGS, {
        platformName: document.getElementById("setPlatformName").value.trim(),
        supportEmail: document.getElementById("setSupportEmail").value.trim(),
        commissionRate: Number(document.getElementById("setCommission").value),
        depositPercent: Number(document.getElementById("setDeposit").value),
        instantBooking: true
      });
      toast("Website settings saved!");
    }
  });

  renderSection("overview");
});

