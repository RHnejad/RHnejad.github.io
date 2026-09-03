(function () {
  const storageKey = "rh-theme";
  const root = document.documentElement;
  const systemPreference = window.matchMedia("(prefers-color-scheme: dark)");

  function savedTheme() {
    try {
      return localStorage.getItem(storageKey);
    } catch (_) {
      return null;
    }
  }

  function preferredTheme() {
    return savedTheme() || (systemPreference.matches ? "dark" : "light");
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;

    const toggle = document.querySelector(".theme-toggle");
    if (toggle) {
      const nextTheme = theme === "dark" ? "light" : "dark";
      toggle.textContent = theme === "dark" ? "☀" : "☾";
      toggle.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
      toggle.setAttribute("title", `Switch to ${nextTheme} theme`);
      toggle.setAttribute("aria-pressed", String(theme === "dark"));
    }
  }

  applyTheme(preferredTheme());

  document.addEventListener("DOMContentLoaded", function () {
    const nav = document.querySelector(".nav-links");
    if (!nav) return;

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "theme-toggle";
    nav.appendChild(toggle);
    applyTheme(root.dataset.theme);

    toggle.addEventListener("click", function () {
      const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(storageKey, nextTheme);
      } catch (_) {
        // The theme still works when storage is unavailable.
      }
      applyTheme(nextTheme);
    });
  });

  function followSystemPreference() {
    if (!savedTheme()) applyTheme(preferredTheme());
  }

  if (systemPreference.addEventListener) {
    systemPreference.addEventListener("change", followSystemPreference);
  } else {
    systemPreference.addListener(followSystemPreference);
  }
})();
