(function () {
  const root = document.documentElement;

  // ==========================
  // Intro video (play ONCE per browser session/tab)
  // ==========================
  const INTRO_KEY = "portal_intro_played";

  const introOverlay = document.getElementById("introOverlay");
  const introVideo = document.getElementById("introVideo");
  const skipIntro = document.getElementById("skipIntro");
  const siteContent = document.getElementById("siteContent");

  function showSiteImmediately() {
    if (introOverlay) {
      introOverlay.classList.add("intro-hide");
      introOverlay.style.display = "none";
    }
    if (siteContent) {
      siteContent.classList.remove("site-hidden");
      siteContent.classList.add("site-visible");
    }
  }

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
  }

  // Only run intro logic on pages that actually have the intro overlay (index.html)
  if (introOverlay && siteContent) {
    if (sessionStorage.getItem(INTRO_KEY) === "true") {
      showSiteImmediately();
    } else {
      // Mark played immediately so it won't replay if you navigate away and back
      sessionStorage.setItem(INTRO_KEY, "true");

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
    }
  }

  // ==========================
  // Theme toggle (works on ALL pages)
  // ==========================
  const themeToggle = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("portal_theme");
  if (savedTheme) root.setAttribute("data-theme", savedTheme);

  themeToggle?.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") || "dark";
    const next = current === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    localStorage.setItem("portal_theme", next);
  });

  // ==========================
  // Last updated (optional)
  // ==========================
  const lastUpdated = document.getElementById("lastUpdated");
  if (lastUpdated) {
    const d = new Date();
    lastUpdated.textContent = d.toLocaleString();
  }

  // ==========================
  // Resources Search + Filter
  // ==========================
  const searchInput = document.getElementById("searchInput");
  const categorySelect = document.getElementById("categorySelect");
  const grid = document.getElementById("tileGrid");

  function norm(s) {
    return (s || "").toLowerCase().replace(/\s+/g, " ").trim();
  }

  function applyFilters() {
    // If we're on a page without resources (dashboard.html), just skip
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

      let matchQ = true;
      if (q) {
        matchQ = title.startsWith(q) || title.includes(q) || link.includes(q);
      }

      item.style.display = matchCat && matchQ ? "" : "none";
    });

    // Hide whole sections with zero visible items
    sections.forEach((section) => {
      const anyVisible = Array.from(section.querySelectorAll(".tile"))
        .some((it) => it.style.display !== "none");
      section.style.display = anyVisible ? "" : "none";
    });
  }

  if (searchInput) searchInput.addEventListener("input", applyFilters);
  if (categorySelect) categorySelect.addEventListener("change", applyFilters);

  // ==========================
  // Single-file "Pages" routing (Home vs Resources) - index.html only
  // ==========================
  const homePage = document.getElementById("homePage");
  const resourcesPage = document.getElementById("resourcesPage");

  function setActivePage(which) {
    if (!homePage || !resourcesPage) return; // not on index.html

    if (which === "resources") {
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
    if (!homePage || !resourcesPage) return; // not on index.html

    const hash = (window.location.hash || "").toLowerCase();

    if (hash === "#resources") {
      setActivePage("resources");
      return;
    }

    // Everything else is home
    setActivePage("home");

    // Smooth scroll to sections on home (#home, #dashboard, #updates)
    if (hash) {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  window.addEventListener("hashchange", handleHashRoute);

  // initial run
  handleHashRoute();
  applyFilters();
})();
