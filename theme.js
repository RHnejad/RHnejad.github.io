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

  // Hand-drawn icons inspired by Hades II: a crescent in a ritual circle
  // (moon magick) and a spear-rayed sunburst (Apollo). Original artwork.
  const moonIcon =
    '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">' +
    '<mask id="rh-moon-cut"><rect width="24" height="24" fill="#fff"/>' +
    '<circle cx="15.2" cy="9.4" r="5.4" fill="#000"/></mask>' +
    '<circle cx="12" cy="12" r="10.6" fill="none" stroke="currentColor" stroke-width="0.8" stroke-dasharray="0.6 2.1" stroke-linecap="round" opacity="0.7"/>' +
    '<circle cx="12" cy="12" r="6.6" fill="currentColor" mask="url(#rh-moon-cut)"/>' +
    '<path d="M18.4 4.4 L18.9 5.9 L20.4 6.4 L18.9 6.9 L18.4 8.4 L17.9 6.9 L16.4 6.4 L17.9 5.9 Z" fill="currentColor"/>' +
    '<path d="M6.2 16.6 L6.5 17.5 L7.4 17.8 L6.5 18.1 L6.2 19 L5.9 18.1 L5 17.8 L5.9 17.5 Z" fill="currentColor" opacity="0.8"/>' +
    "</svg>";

  const sunRays = Array.from({ length: 16 }, function (_, i) {
    const ray = i % 2 === 0
      ? "M12 0.9 L13 5.4 L11 5.4 Z"
      : "M12 3.1 L12.65 5.8 L11.35 5.8 Z";
    return '<path d="' + ray + '" transform="rotate(' + i * 22.5 + ' 12 12)"/>';
  }).join("");
  const sunIcon =
    '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">' +
    '<g fill="currentColor">' + sunRays + "</g>" +
    '<circle cx="12" cy="12" r="5.7" fill="none" stroke="currentColor" stroke-width="0.7"/>' +
    '<circle cx="12" cy="12" r="4.4" fill="currentColor"/>' +
    '<circle cx="12" cy="12" r="2.3" fill="none" stroke="var(--paper-2)" stroke-width="0.7" opacity="0.8"/>' +
    "</svg>";

  function applyTheme(theme) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;

    const toggle = document.querySelector(".theme-toggle");
    if (toggle) {
      const nextTheme = theme === "dark" ? "light" : "dark";
      toggle.innerHTML = theme === "dark" ? sunIcon : moonIcon;
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
