(function () {
  "use strict";

  function init() {
    id("search-bar").addEventListener("input", () => {
      console.log("Updating search...");
    });
  }

  init();
})();
