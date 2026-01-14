// Last updated timestamp
document.getElementById("lastUpdated").textContent =
  new Date().toLocaleString();

// Theme toggle
const root = document.documentElement;
const btn = document.getElementById("themeToggle");
const saved = localStorage.getItem("ops_theme");

if (saved) root.setAttribute("data-theme", saved);

btn.onclick = () => {
  const next =
    root.getAttribute("data-theme") === "light" ? "dark" : "light";
  root.setAttribute("data-theme", next);
  localStorage.setItem("ops_theme", next);
};

// Tool search + filter
const search = document.getElementById("searchInput");
const category = document.getElementById("categorySelect");
const grid = document.getElementById("tileGrid");

function filterTiles(){
  const q = search.value.toLowerCase();
  const cat = category.value;

  [...grid.children].forEach(tile=>{
    const text = tile.textContent.toLowerCase();
    const tcat = tile.dataset.category;
    const show =
      (!q || text.includes(q)) &&
      (cat === "all" || tcat === cat);
    tile.style.display = show ? "block" : "none";
  });
}

search.oninput = filterTiles;
category.onchange = filterTiles;
