// Remove intro after animation finishes
window.addEventListener("load", () => {
  setTimeout(() => {
    const intro = document.getElementById("intro");
    if (intro) intro.remove();
  }, 4500);
});

// Last updated timestamp
const lastUpdated = document.getElementById("lastUpdated");
if (lastUpdated) {
  lastUpdated.textContent = new Date().toLocaleString();
}

// Theme toggle
const root = document.documentElement;
const toggle = document.getElementById("themeToggle");

toggle.onclick = () => {
  const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
  root.setAttribute("data-theme", next);
};
