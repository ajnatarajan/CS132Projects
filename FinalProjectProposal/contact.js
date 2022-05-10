(function () {
  "use strict";

  function init() {
    id("submit").addEventListener("click", onSubmit);
  }

  function onSubmit(e) {
    // Will make API Call to handle submission
    e.preventDefault();
    console.log("OY LEVI");
  }

  init();
})();
