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
      const params = new FormData(qs("form"));
      try {
        let resp = await fetch("/feedback", {
          method: "POST",
          body: params,
        });
        resp = checkStatus(resp);
        resp = await resp.json();
        console.log(resp);
        msg.classList.remove("red-text");
        msg.textContent = "Message successfully sent!";
      } catch (err) {
        console.log(err);
      }
    }
    qs("form").appendChild(msg);
  }

  init();
})();
