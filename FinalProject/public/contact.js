/*
  Name: Ajay Natarajan
  CS 132 Spring 2022
  Date: May 31st, 2022
  This is the contact.js for my gaming and anime e-commerce site which is serving
  as my final project for CS 132. It handles and stores form submissions from
  users who are giving feedback on the site and/or different products.
 */

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
    e.preventDefault();
    let msg = qs("form > p");
    if (msg) {
      msg.remove();
    }
    msg = gen("p");
    msg.classList.add("red-text");
    if (id("name").value === "") {
      msg.textContent = "Name field required";
    } else if (id("email").value === "") {
      msg.textContent = "Email field required";
    } else if (id("subject").value === "") {
      msg.textContent = "Subject field required";
    } else if (id("message-body").value === "") {
      msg.textContent = "Message field required";
    } else {
      postFeedback(msg);
    }
    qs("form").appendChild(msg);
  }

  /**
   * Makes the actual fetch post request to store the feedback in the database.
   * @param {Element} msg - message to display back to user upon completion
   * @returns {void}
   */
  async function postFeedback(msg) {
    const params = new FormData(qs("form"));
    try {
      let resp = await fetch("/feedback", {
        method: "POST",
        body: params,
      });
      resp = checkStatus(resp);
      resp = await resp.json();
      msg.classList.remove("red-text");
      msg.textContent = "Message successfully sent!";
    } catch (err) {
      msg.textContent = "Message failed to send. Try again later.";
    }
  }

  init();
})();
