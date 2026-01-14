window.addEventListener("load", () => {
  setTimeout(() => {
    const intro = document.getElementById("intro");
    if (intro) intro.remove();
    document.body.style.opacity = "1";
  }, 4000);
});

document.getElementById("lastUpdated").textContent =
  new Date().toLocaleString();
