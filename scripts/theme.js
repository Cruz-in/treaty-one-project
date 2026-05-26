// 1. DARK MODE TOGGLE & SYSTEM DEFAULT

const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const body = document.body;

if (themeToggle && themeIcon) {
  if (body.classList.contains("dark-theme")) {
    themeIcon.innerHTML = "&#9728;"; // Sun icon
  } else {
    themeIcon.innerHTML = "&#127769;"; // Moon icon
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
}

// 2. MOBILE HAMBURGER MENU (WITH MORPH ANIMATION & ARIA)

const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    // 1. Toggle the menu visibility
    navLinks.classList.toggle("nav-active");

    // 2. Toggle the "X" morphing animation
    hamburger.classList.toggle("is-active");

    // 3. Accessibility: Tell screen readers if the menu is open or closed
    const isExpanded = hamburger.classList.contains("is-active");
    hamburger.setAttribute("aria-expanded", isExpanded);
  });

  document.addEventListener("click", (event) => {
    const isMenuOpen = navLinks.classList.contains("nav-active");
    const clickOutsideMenu = !navLinks.contains(event.target);
    const clickOutsideHamburger = !hamburger.contains(event.target);

    // If they click away, close the menu AND reverse the "X" animation
    if (isMenuOpen && clickOutsideMenu && clickOutsideHamburger) {
      navLinks.classList.remove("nav-active");
      hamburger.classList.remove("is-active");
      hamburger.setAttribute("aria-expanded", "false");
    }
  });
}

// 3. SCALABLE QUIZ LOGIC

function setupQuiz(formId, resultId) {
  const form = document.getElementById(formId);
  const resultContainer = document.getElementById(resultId);

  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    //   I use the spread operator [...] to convert the raw NodeList of HTML inputs
    //   into a standard JavaScript Array. Then, we use the .reduce() method to automatically
    //   group the radio buttons together based on their 'name' attribute (q1, q2, etc.) so we
    //   don't have to hardcode them!
    const questions = [...form.querySelectorAll('input[type="radio"]')].reduce(
      (groups, input) => {
        groups[input.name] = groups[input.name] || [];
        groups[input.name].push(input);
        return groups;
      },
      {},
    );

    /*
      .every() checks if ALL question groups meet a condition. 
      .some() checks if AT LEAST ONE radio button in that group was checked by the user.
    */
    const allAnswered = Object.values(questions).every((group) =>
      group.some((input) => input.checked),
    );

    if (!allAnswered) {
      resultContainer.textContent =
        "Please answer all questions before submitting.";
      resultContainer.className = "quiz-result result-fail";
      return;
    }

    const allCorrect = Object.values(questions).every(
      (group) => group.find((input) => input.checked)?.value === "correct",
    );

    if (allCorrect) {
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

// 4. "COMING SOON" SHAKE ANIMATION FOR MOBILE

const wipElements = document.querySelectorAll(".work-in-progress");

wipElements.forEach((element) => {
  element.addEventListener("click", function () {
    this.classList.add("is-shaking");
    setTimeout(() => {
      this.classList.remove("is-shaking");
    }, 500);
  });
});

// 5. SMART BACK TO TOP BUTTON

const backToTopBtn = document.querySelector(".back-to-top");

if (backToTopBtn) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add("show-btn");
    } else {
      backToTopBtn.classList.remove("show-btn");
    }
  });
}

// 6. BUTTERY SMOOTH VERTICAL PROGRESS BAR

const progressBar = document.getElementById("progress-bar");

if (progressBar) {
  let ticking = false;

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight =
          document.documentElement.scrollHeight -
          document.documentElement.clientHeight;

        let scrollPercentage =
          scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        scrollPercentage = Math.max(0, Math.min(100, scrollPercentage));

        progressBar.style.height = scrollPercentage + "%";
        ticking = false;
      });
      ticking = true;
    }
  });
}

// 7. SEARCH BAR LOGIC

const searchDropdown = document.querySelector(".search-dropdown");
const searchToggleBtn = document.querySelector(".search-toggle");

if (searchDropdown && searchToggleBtn) {
  searchToggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    searchDropdown.classList.toggle("active");
    const isExpanded = searchDropdown.classList.contains("active");
    searchToggleBtn.setAttribute("aria-expanded", isExpanded);
  });

  document.addEventListener("click", (e) => {
    if (!searchDropdown.contains(e.target)) {
      searchDropdown.classList.remove("active");
      searchToggleBtn.setAttribute("aria-expanded", "false");
    }
  });
}

const searchForm = document.getElementById("mini-search");

if (searchForm) {
  searchForm.addEventListener("submit", function (e) {
    /*
      EXPLANATION: Prevents the default HTML form behavior which automatically 
      refreshes the entire webpage when a user clicks the submit button.
    */
    e.preventDefault();
    const query = document.getElementById("search-input").value;
    const found = window.find(query);

    if (!found) {
      alert(
        `Could not find "${query}". \n\nPro Tip: Mobile browsers block custom search bars! Please use the "Find on Page" tool located in your phone's browser menu.`,
      );
    }
  });
}

// 8. INTERSECTION OBSERVER (SCROLL REVEAL)

const observerOptions = {
  root: null,
  rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll(".reveal-on-scroll").forEach((element) => {
  observer.observe(element);
});

// 9. DEVELOPER SIGNATURE (CONSOLE EASTER EGG)
const signatureText =
  "%c  Built by Cruz Plamondon | PTEC Web Dev 2026 \n Treaty 1 Education Platform ";
const signatureStyle =
  "font-size: 13px; font-weight: 600; color: #f1f5f9; background: #5a8bfd; padding: 10px; border-radius: 6px; line-height: 1.5;";
console.log(signatureText, signatureStyle);
console.log(
  "Welcome to the 3,000 Lines of Code Club! I have poured my heart and soul into this project refining every single line of element!",
);
console.log(
  "thank you for being an amazing teacher Mr.Hardman. I would never been able to achieve this mastercraft of websites without your support and help",
);
