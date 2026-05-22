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
