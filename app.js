(function () {
  const root = document.documentElement;

  // Set last updated
  const lastUpdated = document.getElementById("lastUpdated");
  if (lastUpdated) lastUpdated.textContent = new Date().toLocaleString();

  // Theme toggle (stores preference)
  const themeToggle = document.getElementById("themeToggle");
  const saved = localStorage.getItem("ops_theme");
  if (saved) root.setAttribute("data-theme", saved);

  themeToggle?.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") || "dark";
    const next = current === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    localStorage.setItem("ops_theme", next);
  });

  // Search + category filter for tiles
  const searchInput = document.getElementById("searchInput");
  const categorySelect = document.getElementById("categorySelect");
  const tileGrid = document.getElementById("tileGrid");

  function applyFilters() {
    if (!tileGrid) return;
    const q = (searchInput?.value || "").trim().toLowerCase();
    const cat = categorySelect?.value || "all";

    const tiles = Array.from(tileGrid.querySelectorAll(".tile"));
    tiles.forEach((tile) => {
      const text = tile.innerText.toLowerCase();
      const tileCat = tile.getAttribute("data-category") || "all";
      const matchQ = !q || text.includes(q);
      const matchCat = cat === "all" || tileCat === cat;
      tile.style.display = matchQ && matchCat ? "" : "none";
    });
  }

  searchInput?.addEventListener("input", applyFilters);
  categorySelect?.addEventListener("change", applyFilters);
})();
