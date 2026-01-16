(function () {
  const root = document.documentElement;

  // Theme (unchanged behavior)
  const themeToggle = document.getElementById("themeToggle");
  const saved = localStorage.getItem("ops_theme");
  if (saved) root.setAttribute("data-theme", saved);

  themeToggle?.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") || "dark";
    const next = current === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    localStorage.setItem("ops_theme", next);
  });

  // Resources search + filter
  const searchInput = document.getElementById("searchInput");
  const categorySelect = document.getElementById("categorySelect");
  const grid = document.getElementById("tileGrid"); // this is your resourcegrid container

  // Normalize helper: makes search more forgiving
  function norm(s) {
    return (s || "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function applyFilters() {
    if (!grid) return;

    const q = norm(searchInput?.value);
    const cat = categorySelect?.value || "all";

    // Tiles can be nested now, so grab ALL tiles inside grid
    const tiles = Array.from(grid.querySelectorAll(".tile"));
    const sections = Array.from(grid.querySelectorAll(".resource-section"));

    // Show/hide each tile
    tiles.forEach((tile) => {
      const tileCat = tile.getAttribute("data-category") || "all";

      // Title is the "smart" target
      const titleEl = tile.querySelector(".resource-item__name, .tile__title");
      const title = norm(titleEl?.textContent);

      // Also allow matches from the URL text (secondary)
      const urlEl = tile.querySelector(".resource-item__link, .tile__sub");
      const urlText = norm(urlEl?.textContent);

      // Category match
      const matchCat = cat === "all" || tileCat === cat;

      // Smart search behavior:
      // 1) Starts-with match on TITLE (best)
      // 2) If no starts-with, allow "contains" on title or url (fallback)
      let matchQ = true;
      if (q) {
        const startsWithTitle = title.startsWith(q);
        const contains = title.includes(q) || urlText.includes(q);
        matchQ = startsWithTitle || contains;
      }

      tile.style.display = matchCat && matchQ ? "" : "none";
    });

    // Hide section containers if none of their items are visible
    sections.forEach((section) => {
      const visibleTiles = Array.from(section.querySelectorAll(".tile"))
        .some((t) => t.style.display !== "none");
      section.style.display = visibleTiles ? "" : "none";
    });
  }

  // Run on input (live “type-ahead”)
  searchInput?.addEventListener("input", applyFilters);
  categorySelect?.addEventListener("change", applyFilters);

  // Run once on load
  applyFilters();
})();
