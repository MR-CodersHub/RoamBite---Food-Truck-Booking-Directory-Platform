/* ==========================================================================
   RoamBite — Contact Form, FAQ Accordions & Vendor Pricing Toggle
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const UI = window.RoamBiteUI;
  const DATA = window.ROAMBITE_DATA;

  // Render Contact FAQs
  const contactFaqContainer = document.getElementById("contactFaqList");
  if (contactFaqContainer && DATA.faqsContact) {
    contactFaqContainer.innerHTML = renderFaqHtml(DATA.faqsContact);
  }

  // Render Vendor FAQs
  const vendorFaqContainer = document.getElementById("vendorFaqList");
  if (vendorFaqContainer && DATA.faqsVendor) {
    vendorFaqContainer.innerHTML = renderFaqHtml(DATA.faqsVendor);
  }

  // FAQ Accordion Click Handler
  document.addEventListener("click", (e) => {
    const qBtn = e.target.closest(".faq-question");
    if (!qBtn) return;
    const item = qBtn.closest(".faq-item");
    const wasOpen = item.classList.contains("open");
    item.parentElement.querySelectorAll(".faq-item").forEach((el) => {
      el.classList.remove("open");
      el.querySelector(".faq-icon").textContent = "+";
    });
    if (!wasOpen) {
      item.classList.add("open");
      item.querySelector(".faq-icon").textContent = "−";
    }
  });

  // Contact Form Submission
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      contactForm.reset();
      UI.showToast("Message received! Our RoamBite team will reply within 1 business day.");
    });
  }

  // For Vendors Pricing Toggle (Monthly vs Annual)
  const billingToggle = document.getElementById("billingToggle");
  if (billingToggle) {
    billingToggle.addEventListener("change", () => {
      const isAnnual = billingToggle.checked;
      document.querySelectorAll("[data-monthly]").forEach((el) => {
        el.textContent = isAnnual ? el.dataset.annual : el.dataset.monthly;
      });
      document.querySelectorAll(".billing-period").forEach((el) => {
        el.textContent = isAnnual ? "/mo (billed annually)" : "/month";
      });
    });
  }
});

function renderFaqHtml(items) {
  return items
    .map(
      (item, idx) => `
    <div class="faq-item ${idx === 0 ? "open" : ""}">
      <button type="button" class="faq-question">
        <span>${item.q}</span>
        <span class="faq-icon" style="font-size:1.3rem; font-weight:800;">${idx === 0 ? "−" : "+"}</span>
      </button>
      <div class="faq-answer">
        <p>${item.a}</p>
      </div>
    </div>`
    )
    .join("");
}

