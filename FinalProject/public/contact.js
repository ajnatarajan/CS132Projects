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
  async function onSubmit(e) {
    // Will make API Call to handle submission
    // if (id("name").value === "") {
    //   alert("Must enter name");
    // } else if (id("email").value === "") {
    //   alert("Must enter email");
    // } else if (id("subject").value === "") {
    //   alert("Must enter message subject");
    // } else if (id("message-body").value === "") {
    //   alert("Must enter message");
    // } else {
    //   alert("Message sent");
    //   return;
    // }
    e.preventDefault();

    const params = new FormData(id("contact-form"));
    let resp = await fetch("/feedback", {
      method: "POST",
      body: params,
    });
    resp = checkStatus(resp);
    resp = await resp.json();
    console.log(resp);
  }

  init();
})();
