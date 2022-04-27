/*
 */

(function () {
  "use strict";

  function init() {
    id("toggle-switch").addEventListener("click", toggleMode);
  }

  function toggleMode() {
    qs("body").classList.toggle("light-body");
    qs("body").classList.toggle("dark-body");
    const aTags = qsa("nav a");
    for (let i = 0; i < aTags.length; i++) {
      aTags[i].classList.toggle("light-text");
      aTags[i].classList.toggle("dark-text");
    }
  }

  init();
})();
