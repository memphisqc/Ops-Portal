// ==========================
// Intro video (play ONCE per browser session/tab)
// ==========================
const INTRO_KEY = "portal_intro_played";

const introOverlay = document.getElementById("introOverlay");
const introVideo = document.getElementById("introVideo");
const skipIntro = document.getElementById("skipIntro");
const siteContent = document.getElementById("siteContent");

function showSiteImmediately() {
  // Hide overlay instantly
  if (introOverlay) {
    introOverlay.classList.add("intro-hide");
    introOverlay.style.display = "none";
  }

  // Show site
  if (siteContent) {
    siteContent.classList.remove("site-hidden");
    siteContent.classList.add("site-visible");
  }
}

function revealSiteWithFade() {
  // Fade overlay out
  if (introOverlay) {
    introOverlay.classList.add("intro-hide");
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

// If there is no intro overlay on this page (ex: dashboard.html), do nothing
if (!introOverlay || !siteContent) {
  // no-op
} else {
  // If already played this session, skip intro
  if (sessionStorage.getItem(INTRO_KEY) === "true") {
    showSiteImmediately();
  } else {
    // IMPORTANT: mark it played immediately (so it won't replay if you navigate away)
    sessionStorage.setItem(INTRO_KEY, "true");

    // Normal intro behavior
    // If autoplay blocked, show the site anyway after a moment
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
