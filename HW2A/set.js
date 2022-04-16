/*
  NAME: Ajay Natarajan
  DATE: 04/15/2022

  This is the set.js file which handles toggling the display in the
  milestone.html file between menu view and game view upon one of two buttons
  being clicked.
 */
(function () {
  "use strict";

  function init() {
    const startButton = document.querySelector("#start-btn");
    const backToMainButton = document.querySelector("#back-btn");

    startButton.addEventListener("click", toggleView);
    backToMainButton.addEventListener("click", toggleView);
  }

  function toggleView() {
    const menuSection = document.querySelector("#menu-view");
    const gameSection = document.querySelector("#game-view");
    if (gameSection.classList.contains("hidden")) {
      gameSection.classList.remove("hidden");
      menuSection.classList.add("hidden");
    } else {
      gameSection.classList.add("hidden");
      menuSection.classList.remove("hidden");
    }
  }

  init();
})();
