/* ==========================================================================
   RoamBite — Vendor Authentication Portal (Login, Signup, Forgot Password)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page !== "vendor-auth") return;

  const UI = window.RoamBiteUI;
  const tabBtns = document.querySelectorAll(".auth-tab");
  const panels = document.querySelectorAll(".auth-panel");

  function activateTab(tabName) {
    tabBtns.forEach((b) => b.classList.toggle("active", b.dataset.tab === tabName));
    panels.forEach((p) => {
      p.style.display = p.id === `panel-${tabName}` ? "block" : "none";
    });
  }

  // Check URL ?tab=login|signup|forgot
  const params = new URLSearchParams(window.location.search);
  const initialTab = params.get("tab");
  if (initialTab && ["login", "signup", "forgot"].includes(initialTab)) {
    activateTab(initialTab);
  } else {
    activateTab("login");
  }

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => activateTab(btn.dataset.tab));
  });

  // Switch links inside panels (e.g. "Forgot Password?" link)
  document.querySelectorAll("[data-switch-tab]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      activateTab(link.dataset.switchTab);
    });
  });

  // Password Visibility Toggle
  document.querySelectorAll(".password-toggle").forEach((toggleBtn) => {
    toggleBtn.addEventListener("click", () => {
      const input = toggleBtn.previousElementSibling;
      if (!input) return;
      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
      toggleBtn.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
      toggleBtn.innerHTML = isPassword
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
    });
  });

  // Form Handlers
  document.getElementById("vendorLoginForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    UI.showToast(`Welcome back! Signed in as ${email}.`);
    e.target.reset();
  });

  document.getElementById("vendorSignupForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const truck = document.getElementById("signupTruckName").value;
    UI.showToast(`Application submitted for "${truck}"! Check your email to verify.`);
    e.target.reset();
  });

  document.getElementById("vendorForgotForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("forgotEmail").value;
    UI.showToast(`Password reset link sent to ${email}.`);
    e.target.reset();
  });
});

