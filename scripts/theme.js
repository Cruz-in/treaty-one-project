// dark mode button
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const body = document.body;

if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark-theme");
  themeIcon.innerHTML = "&#9728;";
}

themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-theme");

  if (body.classList.contains("dark-theme")) {
    localStorage.setItem("theme", "dark");
    themeIcon.innerHTML = "&#9728;";
  } else {
    localStorage.setItem("theme", "light");
    themeIcon.innerHTML = "&#127769;";
  }
});

// --- hamburger button for mobile nav or smaller screens ---

const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

// 1. Toggle menu when the hamburger is clicked
hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("nav-active");
});

// 2. Close menu when clicking outside of it
document.addEventListener("click", (event) => {
  // Check if the menu is currently open
  const isMenuOpen = navLinks.classList.contains("nav-active");

  // Check if the click happened OUTSIDE the menu and OUTSIDE the hamburger button
  const clickOutsideMenu = !navLinks.contains(event.target);
  const clickOutsideHamburger = !hamburger.contains(event.target);

  // If the menu is open, and the user clicked away from it, close it!
  if (isMenuOpen && clickOutsideMenu && clickOutsideHamburger) {
    navLinks.classList.remove("nav-active");
  }
});
