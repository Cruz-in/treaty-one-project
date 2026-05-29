// prevents flashing of the wrong theme
const savedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
  document.body.classList.add("dark-theme");
}

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

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("nav-active");
      hamburger.classList.remove("is-active");
      hamburger.setAttribute("aria-expanded", "false");
    });
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
    //   into a standard JavaScript Array. Then, use the .reduce() method to automatically
    //   group the radio buttons together based on their 'name' attribute (q1, q2, etc.) so i
    //   don't have to hardcode them
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
        "50% correct. Review the content above and try again.";
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

// search bar logic
// 7. PREMIUM SEARCH DRAWER LOGIC

const openSearchBtn = document.getElementById("openSearchBtn");
const closeSearchBtn = document.getElementById("closeSearchBtn");
const searchDrawer = document.getElementById("searchDrawer");
const searchOverlay = document.getElementById("searchOverlay");

const drawerSearchInput = document.getElementById("drawer-search-input");
const drawerResultsList = document.getElementById("drawer-results-list");
const drawerHeading = document.getElementById("drawer-heading");

if (openSearchBtn && searchDrawer) {
  // --- 1. OPEN / CLOSE DRAWER LOGIC ---

  function openDrawer() {
    searchDrawer.classList.add("active");
    searchOverlay.classList.add("active");

    //Locks the main website from scrolling
    document.body.style.overflow = "hidden";

    // Small delay to let the drawer slide in before focusing the keyboard
    setTimeout(() => drawerSearchInput.focus(), 100);
    renderList(siteDirectory, "Quick Links");
  }

  function closeDrawer() {
    searchDrawer.classList.remove("active");
    searchOverlay.classList.remove("active");

    //Unlocks the background scroll when closed
    document.body.style.overflow = "";

    drawerSearchInput.value = "";
  }

  openSearchBtn.addEventListener("click", openDrawer);
  closeSearchBtn.addEventListener("click", closeDrawer);
  searchOverlay.addEventListener("click", closeDrawer); // Close if clicking the dark overlay

  // Allow 'Escape' key to close the drawer
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && searchDrawer.classList.contains("active")) {
      closeDrawer();
    }
  });

  // --- 2. THE RENDER LOGIC (Builds the clickable links) ---

  function renderList(items, headingText) {
    drawerResultsList.innerHTML = "";
    drawerHeading.textContent = headingText;

    if (items.length === 0) {
      drawerResultsList.innerHTML = `<li style="pointer-events: none; color: var(--text-body);">No results found...</li>`;
      return;
    }

    const query = drawerSearchInput.value.trim();

    items.forEach((item) => {
      const li = document.createElement("li");

      if (query) {
        const regex = new RegExp(`(${query})`, "gi");
        li.innerHTML = item.title.replace(regex, `<mark>$1</mark>`);
      } else {
        li.textContent = item.title;
      }

      li.addEventListener("click", () => {
        closeDrawer();
        window.location.href = item.url;
      });

      drawerResultsList.appendChild(li);
    });
  }

  // --- 3. THE LIVE SEARCH AUTOFILL ---

  drawerSearchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();

    // If input is empty, reset back to Quick Links
    if (query === "") {
      renderList(siteDirectory, "Quick Links");
      return;
    }

    // Filter the database array for matches
    const matches = siteDirectory.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.keywords.some((kw) => kw.includes(query)),
    );

    renderList(matches, "Search Results");
  });

  // Stop the form from refreshing the page if they press 'Enter'
  document
    .getElementById("drawer-search-form")
    .addEventListener("submit", (e) => {
      e.preventDefault();
    });
}

// 8. INTERSECTION OBSERVER (SCROLL REVEAL)

const observerOptions = {
  root: null,
  rootMargin: "0px 0px -50px 0px", // Triggers slightly earlier for mobile users
  threshold: 0.1, // Forces the browser to trigger when 10% of the card is visible
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
