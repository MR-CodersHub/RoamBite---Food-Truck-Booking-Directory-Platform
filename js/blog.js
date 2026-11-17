/* ==========================================================================
   RoamBite — Blog Category Filtering & Article Reader Modal
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page !== "blog") return;

  const UI = window.RoamBiteUI;
  const articles = window.ROAMBITE_DATA.articles;

  const grid = document.getElementById("blogArticlesGrid");
  const filterBtns = document.querySelectorAll("#blogCategoryPills .cat-pill");
  const searchInput = document.getElementById("blogSearchInput");

  function renderArticles(category = "All", query = "") {
    const q = query.trim().toLowerCase();
    const list = articles.filter((art) => {
      const catOk = category === "All" || art.category === category;
      const qOk =
        !q ||
        art.title.toLowerCase().includes(q) ||
        art.excerpt.toLowerCase().includes(q) ||
        art.category.toLowerCase().includes(q);
      return catOk && qOk;
    });

    if (!grid) return;
    if (list.length === 0) {
      grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:48px; background:var(--white); border-radius:var(--radius-lg);">No articles found matching your search.</div>`;
      return;
    }

    grid.innerHTML = list
      .map(
        (art) => `
      <article class="blog-card">
        <div class="blog-card-img">
          <img src="${art.image}" alt="${art.title}" loading="lazy">
        </div>
        <div class="blog-card-body">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <span class="badge badge-pink">${art.category}</span>
            <span style="font-size:0.8rem; color:var(--text-muted);">${art.readTime}</span>
          </div>
          <h3 style="color:var(--purple-deep); font-size:1.18rem; margin-bottom:10px;">${art.title}</h3>
          <p style="font-size:0.92rem; color:var(--text-secondary); margin-bottom:18px; flex:1;">${art.excerpt}</p>
          <div style="display:flex; justify-content:space-between; align-items:center; padding-top:14px; border-top:1px solid var(--cream-border);">
            <span style="font-size:0.83rem; font-weight:700; color:var(--text-muted);">${art.author} • ${art.date}</span>
            <button type="button" class="btn btn-outline btn-sm" data-read-article="${art.id}">Read More</button>
          </div>
        </div>
      </article>`
      )
      .join("");
  }

  let activeCat = "All";
  renderArticles(activeCat, "");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeCat = btn.dataset.category;
      renderArticles(activeCat, searchInput?.value || "");
    });
  });

  searchInput?.addEventListener("input", () => {
    renderArticles(activeCat, searchInput.value);
  });

  // Article Reader Modal
  document.addEventListener("click", (e) => {
    const readBtn = e.target.closest("[data-read-article]");
    if (!readBtn) return;
    const art = articles.find((a) => a.id === readBtn.dataset.readArticle);
    if (!art) return;

    document.getElementById("detailModalCuisine").textContent = `${art.category} • ${art.readTime}`;
    document.getElementById("detailModalTitle").textContent = art.title;
    document.getElementById("detailModalBody").innerHTML = `
      <img src="${art.image}" alt="${art.title}" style="width:100%; height:240px; border-radius:var(--radius-md); margin-bottom:18px;">
      <div style="font-size:0.88rem; color:var(--text-muted); margin-bottom:16px;">By <strong>${art.author}</strong> • Published ${art.date}</div>
      ${art.content.map((p) => `<p style="color:var(--text-secondary); margin-bottom:14px; line-height:1.7;">${p}</p>`).join("")}
      <div style="margin-top:24px; padding-top:18px; border-top:1px solid var(--cream-border); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        <span style="font-weight:700; color:var(--purple-deep);">Ready to book a truck for your next event?</span>
        <a href="directory.html" class="btn btn-primary btn-sm">Browse Directory</a>
      </div>
    `;
    UI.openModal("truckDetailsModal");
  });
});

