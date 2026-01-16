(function () {
  const root = document.documentElement;

  // ==========================
  // Intro video (fade to site)
  // ==========================
  const introOverlay = document.getElementById("introOverlay");
  const introVideo = document.getElementById("introVideo");
  const skipIntro = document.getElementById("skipIntro");
  const siteContent = document.getElementById("siteContent");

  function revealSiteWithFade() {
    // Fade overlay out
    if (introOverlay) {
      introOverlay.classList.add("intro-hide");
      // After fade, remove overlay from layout
      setTimeout(() => {
        introOverlay.style.display = "none";
      }, 700);
    }

    // Fade site in
    if (siteContent) {
      siteContent.classList.remove("site-hidden");
      siteContent.classList.add("site-visible");
    }
  }

  // If autoplay is blocked, show the site anyway after a moment
  setTimeout(() => {
    if (introVideo && introVideo.paused && introVideo.currentTime === 0) {
      revealSiteWithFade();
    }
  }, 1200);

  introVideo?.addEventListener("ended", revealSiteWithFade);

  skipIntro?.addEventListener("click", () => {
    try { introVideo?.pause(); } catch (e) {}
    revealSiteWithFade();
  });

  // Theme toggle
  const themeToggle = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("portal_theme");
  if (savedTheme) root.setAttribute("data-theme", savedTheme);

  themeToggle?.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") || "dark";
    const next = current === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    localStorage.setItem("portal_theme", next);
  });

  // Status + last updated (optional)
  const lastUpdated = document.getElementById("lastUpdated");
  if (lastUpdated) {
    const d = new Date();
    lastUpdated.textContent = d.toLocaleString();
  }

  // Search + filter (FIXED for grouped sections)
  const searchInput = document.getElementById("searchInput");
  const categorySelect = document.getElementById("categorySelect");
  const grid = document.getElementById("tileGrid");

  if (!searchInput || !categorySelect || !grid) return;

  function norm(s) {
    return (s || "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function applyFilters() {
    const q = norm(searchInput.value);
    const cat = categorySelect.value || "all";

    const items = Array.from(grid.querySelectorAll(".tile"));
    const sections = Array.from(grid.querySelectorAll(".resource-section"));

    items.forEach((item) => {
      const itemCat = item.getAttribute("data-category") || "all";

      const titleEl = item.querySelector(".resource-item__name, .tile__title");
      const linkEl = item.querySelector(".resource-item__link, .tile__sub");

      const title = norm(titleEl ? titleEl.textContent : "");
      const link = norm(linkEl ? linkEl.textContent : "");

      const matchCat = cat === "all" || itemCat === cat;

      // Smart search: starts-with title OR contains title/url
      let matchQ = true;
      if (q) {
        matchQ = title.startsWith(q) || title.includes(q) || link.includes(q);
      }

      item.style.display = matchCat && matchQ ? "" : "none";
    });

    // Hide sections with zero visible items
    sections.forEach((section) => {
      const visible = Array.from(section.querySelectorAll(".tile"))
        .some((it) => it.style.display !== "none");
      section.style.display = visible ? "" : "none";
    });
  }

  searchInput.addEventListener("input", applyFilters);
  categorySelect.addEventListener("change", applyFilters);

  applyFilters();
})();
