/*
 */

(function () {
  "use strict";

  function init() {
    id("toggle-switch").addEventListener("click", toggleMode);
  }

  function toggleMode() {
    /* Handle body background and text */
    qs("body").classList.toggle("light-body");
    qs("body").classList.toggle("dark-body");

    /* Handle nav background */
    qs("nav").classList.toggle("nav-light");
    qs("nav").classList.toggle("nav-dark");

    /* Handle nav links */
    const a_tags = qsa("nav a");
    for (let i = 0; i < a_tags.length; i++) {
      a_tags[i].classList.toggle("light-text");
      a_tags[i].classList.toggle("dark-text");
    }

    /* Handle nav icons */
    const nav_icons = qsa("nav img");
    for (let i = 0; i < nav_icons.length; i++) {
      nav_icons[i].classList.toggle("hidden");
    }
  }

  init();
})();
