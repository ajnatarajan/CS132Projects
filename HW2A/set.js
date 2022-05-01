/*
  NAME: Ajay Natarajan
  DATE: 04/15/2022

  This is the set.js file which handles toggling the display in the
  milestone.html file between menu view and game view upon one of two buttons
  being clicked.
 */
(function () {
  "use strict";

  /**
   * Add all necessary event listeners to handle toggling.
   * No parameters.
   * @returns {void}
   */
  function init() {
    const startButton = document.querySelector("#start-btn");
    const backToMainButton = document.querySelector("#back-btn");

    startButton.addEventListener("click", toggleView);
    backToMainButton.addEventListener("click", toggleView);
  }

  /**
   * Toggle between menu and game views.
   * No parameters.
   * @returns {void}
   */
  function toggleView() {
    const menuSection = document.querySelector("#menu-view");
    const gameSection = document.querySelector("#game-view");
    menuSection.classList.toggle("hidden");
    gameSection.classList.toggle("hidden");
  }

  init();
})();
