/* ==========================================================================
   RoamBite — Unified Role-Based Auth Portal Controller
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page !== "auth") return;

  const State = window.RoamBiteState;
  const UI = window.RoamBiteUI;

  const modeBtns = document.querySelectorAll("[data-mode]");
  const panels = document.querySelectorAll(".auth-panel");
  const alertBox = document.getElementById("authAlert");

  let loginRole = "customer";
  let signupRole = "customer";

  function showAlert(msg, isError = true) {
    if (!alertBox) return;
    alertBox.style.display = "block";
    alertBox.style.background = isError ? "var(--danger-bg)" : "var(--success-bg)";
    alertBox.style.color = isError ? "var(--danger)" : "var(--success)";
    alertBox.textContent = msg;
  }

  function clearAlert() {
    if (alertBox) alertBox.style.display = "none";
  }

  function setMode(mode) {
    clearAlert();
    modeBtns.forEach((b) => b.classList.toggle("active", b.dataset.mode === mode));
    panels.forEach((p) => {
      p.style.display = p.id === `mode-${mode}` ? "block" : "none";
    });
  }

  function setLoginRole(role) {
    loginRole = role;
    document.querySelectorAll("[data-login-role]").forEach((b) => {
      b.classList.toggle("active", b.dataset.loginRole === role);
    });
  }

  function setSignupRole(role) {
    signupRole = role;
    document.querySelectorAll("[data-signup-role]").forEach((b) => {
      b.classList.toggle("active", b.dataset.signupRole === role);
    });
    document.querySelectorAll(".vendor-only-field").forEach((el) => {
      el.style.display = role === "vendor" ? "flex" : "none";
      const input = el.querySelector("input");
      if (input) input.required = role === "vendor";
    });
  }

  // URL params (?mode=signup&role=vendor)
  const params = new URLSearchParams(window.location.search);
  if (params.get("mode")) setMode(params.get("mode"));
  if (params.get("role") && ["customer", "vendor", "admin"].includes(params.get("role"))) {
    setLoginRole(params.get("role"));
  }

  modeBtns.forEach((b) => b.addEventListener("click", () => setMode(b.dataset.mode)));
  document.querySelectorAll("[data-switch-mode]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      setMode(el.dataset.switchMode);
    });
  });

  document.querySelectorAll("[data-login-role]").forEach((b) => {
    b.addEventListener("click", () => setLoginRole(b.dataset.loginRole));
  });
  document.querySelectorAll("[data-signup-role]").forEach((b) => {
    b.addEventListener("click", () => setSignupRole(b.dataset.signupRole));
  });

  // Password visibility toggle
  document.querySelectorAll(".password-toggle").forEach((toggleBtn) => {
    toggleBtn.addEventListener("click", () => {
      const input = toggleBtn.previousElementSibling;
      if (!input) return;
      input.type = input.type === "password" ? "text" : "password";
    });
  });

  // Demo quick sign-in buttons
  function fillAndSubmitDemo(role, email, password) {
    setMode("login");
    setLoginRole(role);
    document.getElementById("portalLoginEmail").value = email;
    document.getElementById("portalLoginPassword").value = password;
    const res = State.login(email, password, role);
    if (res.ok) {
      UI.showToast(`Signed in as ${res.session.name} (${role})`);
      setTimeout(() => {
        window.location.href = role === "admin" ? "admin-dashboard.html" : "user-dashboard.html";
      }, 450);
    }
  }

  document.getElementById("demoCustomerBtn")?.addEventListener("click", () => {
    fillAndSubmitDemo("customer", "alex@foodie.com", "User@123");
  });
  document.getElementById("demoVendorBtn")?.addEventListener("click", () => {
    fillAndSubmitDemo("vendor", "chef@solsmoke.com", "Vendor@123");
  });
  document.getElementById("demoAdminBtn")?.addEventListener("click", () => {
    fillAndSubmitDemo("admin", "admin@roambite.com", "Admin@123");
  });

  // Login Form
  document.getElementById("portalLoginForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("portalLoginEmail").value;
    const password = document.getElementById("portalLoginPassword").value;
    const res = State.login(email, password, loginRole);
    if (!res.ok) {
      showAlert(res.error, true);
      return;
    }
    showAlert(`Welcome back, ${res.session.name}! Redirecting...`, false);
    setTimeout(() => {
      window.location.href = res.session.role === "admin" ? "admin-dashboard.html" : "user-dashboard.html";
    }, 500);
  });

  // Signup Form
  document.getElementById("portalSignupForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const res = State.register({
      name: document.getElementById("portalSignupName").value,
      city: document.getElementById("portalSignupCity").value,
      email: document.getElementById("portalSignupEmail").value,
      password: document.getElementById("portalSignupPassword").value,
      role: signupRole,
      truckName: document.getElementById("portalSignupTruckName").value,
      cuisine: document.getElementById("portalSignupCuisine").value
    });
    if (!res.ok) {
      showAlert(res.error, true);
      return;
    }
    showAlert("Account created! Opening your dashboard...", false);
    setTimeout(() => {
      window.location.href = "user-dashboard.html";
    }, 500);
  });

  // Forgot Password
  document.getElementById("portalForgotForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("portalForgotEmail").value;
    showAlert(`Password reset instructions sent to ${email}.`, false);
    e.target.reset();
  });
});

