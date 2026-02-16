(function () {
  const root = document.documentElement;

// ==========================
// Intro video (play once per session)
// ==========================
const introOverlay = document.getElementById("introOverlay");
const introVideo = document.getElementById("introVideo");
const skipIntro = document.getElementById("skipIntro");
const siteContent = document.getElementById("siteContent");

function revealSiteWithFade() {
  if (introOverlay) {
    introOverlay.classList.add("intro-hide");
    setTimeout(() => {
      introOverlay.style.display = "none";
    }, 700);
  }

  if (siteContent) {
    siteContent.classList.remove("site-hidden");
    siteContent.classList.add("site-visible");
  }

  // Mark intro as played for this session
  sessionStorage.setItem("portal_intro_played", "true");
}

// If intro already played this session, skip it
if (sessionStorage.getItem("portal_intro_played") === "true") {
  if (introOverlay) introOverlay.style.display = "none";
  if (siteContent) {
    siteContent.classList.remove("site-hidden");
    siteContent.classList.add("site-visible");
  }
} else {
  // Normal intro behavior
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
}


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

  // ==========================
  // Search + filter (Resources)
  // ==========================
  const searchInput = document.getElementById("searchInput");
  const categorySelect = document.getElementById("categorySelect");
  const grid = document.getElementById("tileGrid");

  function norm(s) {
    return (s || "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function applyFilters() {
    if (!searchInput || !categorySelect || !grid) return;

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

  // Attach listeners only if Resources exists on this view
  if (searchInput && categorySelect) {
    searchInput.addEventListener("input", applyFilters);
    categorySelect.addEventListener("change", applyFilters);
  }

  // ==========================
  // Simple "page" routing
  // Home vs Resources inside ONE html
  // ==========================
  const homePage = document.getElementById("homePage");
  const resourcesPage = document.getElementById("resourcesPage");

  function setActivePage(page) {
    if (!homePage || !resourcesPage) return;

    if (page === "resources") {
      homePage.classList.remove("page--active");
      resourcesPage.classList.add("page--active");
      window.scrollTo({ top: 0, behavior: "smooth" });
      applyFilters();
    } else {
      resourcesPage.classList.remove("page--active");
      homePage.classList.add("page--active");
    }
  }

  function handleHashRoute() {
    const hash = (window.location.hash || "").toLowerCase();

    if (hash === "#resources") {
      setActivePage("resources");
      return;
    }

    // everything else lives on Home
    setActivePage("home");

    // allow normal section jumps on home
    if (hash && hash !== "#home") {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  window.addEventListener("hashchange", handleHashRoute);

  // Initial run
  handleHashRoute();
  applyFilters();
})();

