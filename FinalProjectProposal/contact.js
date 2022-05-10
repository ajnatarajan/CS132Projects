(function () {
  "use strict";

  /**
   * Initialize all necessary event listeners.
   * No parameters.
   * @returns {void}
   */
  function init() {
    id("submit").addEventListener("click", onSubmit);
  }

  /**
   * Handle submission of contact form
   * @param {Event} e - submit event
   * @returns {void}
   */
  function onSubmit(e) {
    // Will make API Call to handle submission
    e.preventDefault();
  }

  init();
})();
