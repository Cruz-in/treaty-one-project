// --- dark mode toggle and system defult
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const body = document.body;

// 1. Check what the inline HTML script already decided and set the correct icon
if (body.classList.contains("dark-theme")) {
  themeIcon.innerHTML = "&#9728;"; // Sun icon for dark mode
} else {
  themeIcon.innerHTML = "&#127769;"; // Moon icon for light mode
}

// 2. The Toggle Button Logic
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
// i did not like the instant snap when opening the menu. so i made the menu opacity zero so when pressed it changes the value to 100% and i made a transtion to make smooth.

// 2. Close menu when clicking outside of it
document.addEventListener("click", (event) => {
  // Check if the menu is currently open
  const isMenuOpen = navLinks.classList.contains("nav-active");

  // Check if the click happened OUTSIDE the menu and OUTSIDE the hamburger button
  const clickOutsideMenu = !navLinks.contains(event.target);
  const clickOutsideHamburger = !hamburger.contains(event.target);

  // If the menu is open, and the user clicked away from it, it closes.
  if (isMenuOpen && clickOutsideMenu && clickOutsideHamburger) {
    navLinks.classList.remove("nav-active");
  }
});
//i added this because the small things that users are used too. being forced click the button to close it can be annyoing.
// ---- quiz logic ----
function setupQuiz(formId, resultId) {
  const form = document.getElementById(formId);
  const resultContainer = document.getElementById(resultId);

  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const q1 = form.querySelector('input[name="q1"]:checked');
    const q2 = form.querySelector('input[name="q2"]:checked');

    if (!q1 || !q2) {
      resultContainer.textContent =
        "Please answer all questions before submitting.";
      resultContainer.className = "quiz-result result-fail";
      return;
    }

    if (q1.value === "correct" && q2.value === "correct") {
      resultContainer.textContent =
        "100% - Great job! You know your Treaty 1 facts.";
      resultContainer.className = "quiz-result result-pass";
    } else {
      resultContainer.textContent =
        "Not quite. Review the content above and try again.";
      resultContainer.className = "quiz-result result-fail";
    }
  });
}

setupQuiz("history-quiz", "history-result");
setupQuiz("modern-quiz", "modern-result");

// --- "COMING SOON" SHAKE ANIMATION FOR MOBILE ---
const wipElements = document.querySelectorAll(".work-in-progress");

wipElements.forEach((element) => {
  element.addEventListener("click", function () {
    // Add the shaking class
    this.classList.add("is-shaking");

    // Remove the class after 500ms so it can be clicked/shaken again
    setTimeout(() => {
      this.classList.remove("is-shaking");
    }, 500);
  });
});

// --- SMART BACK TO TOP BUTTON ---
const backToTopBtn = document.querySelector(".back-to-top");

window.addEventListener("scroll", () => {
  // If the user scrolls down more than 300 pixels, show the button
  if (window.scrollY > 300) {
    backToTopBtn.classList.add("show-btn");
  } else {
    // Otherwise, hide it
    backToTopBtn.classList.remove("show-btn");
  }
});

// --- BUTTERY SMOOTH VERTICAL PROGRESS BAR ---
const progressBar = document.getElementById("progress-bar");

if (progressBar) {
  let ticking = false; // The tollbooth to prevent math overload

  window.addEventListener("scroll", () => {
    // If a frame isn't already waiting to paint, request one
    if (!ticking) {
      window.requestAnimationFrame(() => {
        // 1. Calculate the math
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight =
          document.documentElement.scrollHeight -
          document.documentElement.clientHeight;

        let scrollPercentage =
          scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        scrollPercentage = Math.max(0, Math.min(100, scrollPercentage));

        // 2. Apply the visual update
        progressBar.style.height = scrollPercentage + "%";

        // 3. Open the gate for the next frame
        ticking = false;
      });

      // Lock the gate until the frame is drawn
      ticking = true;
    }
  });
}

// --- PART 1: OPENING AND CLOSING THE MAGNIFYING GLASS ---
const searchDropdown = document.querySelector(".search-dropdown");
const searchToggleBtn = document.querySelector(".search-toggle");

if (searchDropdown && searchToggleBtn) {
  // Toggle the menu when clicking the magnifying glass
  searchToggleBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevents the click from instantly closing it
    searchDropdown.classList.toggle("active");

    // Updates accessibility tag
    const isExpanded = searchDropdown.classList.contains("active");
    searchToggleBtn.setAttribute("aria-expanded", isExpanded);
  });

  // Close the search bar if the user clicks anywhere else on the screen
  document.addEventListener("click", (e) => {
    if (!searchDropdown.contains(e.target)) {
      searchDropdown.classList.remove("active");
      searchToggleBtn.setAttribute("aria-expanded", "false");
    }
  });
}

// --- PART 2: THE MOBILE-SAFE SEARCH ACTION ---
const searchForm = document.getElementById("mini-search");

if (searchForm) {
  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const query = document.getElementById("search-input").value;

    // 1. Try the desktop native find feature
    const found = window.find(query);

    // 2. The Mobile Fallback: If window.find is blocked or finds nothing
    if (!found) {
      alert(
        `Could not find "${query}". \n\nPro Tip: Mobile browsers block custom search bars! Please use the "Find on Page" tool located in your phone's browser menu.`,
      );
    }
  });
}
