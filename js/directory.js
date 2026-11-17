/* ==========================================================================
   RoamBite — Directory Search & Filter Engine
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page !== "directory") return;

  const UI = window.RoamBiteUI;
  const trucks = window.ROAMBITE_DATA.trucks;

  const searchInput = document.getElementById("dirSearchInput");
  const locationSelect = document.getElementById("dirLocationSelect");
  const cuisineSelect = document.getElementById("dirCuisineSelect");
  const availSelect = document.getElementById("dirAvailSelect");
  const ratingSelect = document.getElementById("dirRatingSelect");
  const priceSelect = document.getElementById("dirPriceSelect");
  const sortSelect = document.getElementById("dirSortSelect");
  const resetBtn = document.getElementById("dirResetBtn");
  const catPills = document.querySelectorAll("#dirCategoryPills .cat-pill");
  const grid = document.getElementById("directoryTrucksGrid");
  const countEl = document.getElementById("dirResultsCount");

  // Read URL Query Params (from Home search or Cuisine links)
  const params = new URLSearchParams(window.location.search);
  if (params.get("q") && searchInput) searchInput.value = params.get("q");
  if (params.get("city") && locationSelect) {
    const cityParam = params.get("city").toLowerCase();
    const matchOpt = Array.from(locationSelect.options).find((o) =>
      o.value.toLowerCase().includes(cityParam)
    );
    if (matchOpt) locationSelect.value = matchOpt.value;
    else if (searchInput && !searchInput.value) searchInput.value = params.get("city");
  }
  if (params.get("cuisine") && cuisineSelect) cuisineSelect.value = params.get("cuisine");
  if (params.get("availability") && availSelect) availSelect.value = params.get("availability");

  function syncPillsWithSelect() {
    const current = cuisineSelect.value || "All";
    catPills.forEach((pill) => {
      pill.classList.toggle("active", pill.dataset.cuisine === current);
    });
  }

  function applyFilters() {
    const q = (searchInput?.value || "").trim().toLowerCase();
    const location = locationSelect?.value || "All";
    const cuisine = cuisineSelect?.value || "All";
    const avail = availSelect?.value || "All";
    const minRating = parseFloat(ratingSelect?.value || "0");
    const price = priceSelect?.value || "All";
    const sortBy = sortSelect?.value || "recommended";

    let filtered = trucks.filter((t) => {
      const matchesQ =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.city.toLowerCase().includes(q) ||
        t.neighborhood.toLowerCase().includes(q) ||
        t.cuisine.toLowerCase().includes(q);
      const matchesLocation = location === "All" || t.city === location;
      const matchesCuisine = cuisine === "All" || t.cuisine === cuisine;
      const matchesAvail = avail === "All" || t.availability === avail;
      const matchesRating = t.rating >= minRating;
      const matchesPrice = price === "All" || t.priceRange === price;
      return matchesQ && matchesLocation && matchesCuisine && matchesAvail && matchesRating && matchesPrice;
    });

    if (sortBy === "rating") {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "reviews") {
      filtered.sort((a, b) => b.reviews - a.reviews);
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    countEl.textContent = `Showing ${filtered.length} of ${trucks.length} food trucks`;

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column:1/-1; text-align:center; padding:56px 24px; background:var(--white); border-radius:var(--radius-xl); border:1px solid var(--cream-border);">
          <div style="width:56px; height:56px; margin:0 auto 14px; border-radius:16px; background:var(--pink-light); color:var(--purple-deep); display:grid; place-items:center;">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h1"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
          </div>
          <h3 style="color:var(--purple-deep); margin-bottom:8px;">No Food Trucks Match Those Filters</h3>
          <p style="color:var(--text-secondary); margin-bottom:20px;">Try clearing a filter or searching another city or cuisine.</p>
          <button type="button" class="btn btn-primary" id="emptyResetBtn">Reset All Filters</button>
        </div>
      `;
      document.getElementById("emptyResetBtn")?.addEventListener("click", resetAll);
    } else {
      grid.innerHTML = filtered.map(UI.createTruckCard).join("");
    }
    syncPillsWithSelect();
  }

  function resetAll() {
    if (searchInput) searchInput.value = "";
    if (locationSelect) locationSelect.value = "All";
    if (cuisineSelect) cuisineSelect.value = "All";
    if (availSelect) availSelect.value = "All";
    if (ratingSelect) ratingSelect.value = "0";
    if (priceSelect) priceSelect.value = "All";
    if (sortSelect) sortSelect.value = "recommended";
    applyFilters();
  }

  [searchInput, locationSelect, cuisineSelect, availSelect, ratingSelect, priceSelect, sortSelect].forEach((el) => {
    el?.addEventListener("input", applyFilters);
    el?.addEventListener("change", applyFilters);
  });

  catPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      cuisineSelect.value = pill.dataset.cuisine;
      applyFilters();
    });
  });

  resetBtn?.addEventListener("click", resetAll);

  applyFilters();
});

