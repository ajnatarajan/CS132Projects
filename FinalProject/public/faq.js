/*
  Name: Ajay Natarajan
  CS 132 Spring 2022
  Date: May 31st, 2022
  This is the faq.js for my gaming and anime e-commerce site which is serving
  as my final project for CS 132. It fetches the proper FAQs stored in the
  database and adds them as DOM elements to the faq.html page.
 */

(function () {
  "use strict";
  /**
   * Initialize page by populating all FAQs
   * No parameters.
   * @returns {void}
   */
  async function init() {
    const faqs = id("faqs");
    let faqsResp;
    try {
      faqsResp = await fetch("/faqs");
      faqsResp = checkStatus(faqsResp);
      faqsResp = await faqsResp.json();
    } catch (err) {
      console.error(err);
      let errorBox = gen("div");
      let errorMsg = gen("p");
      errorMsg.textContent =
        "Store is currently down. Please visit again later.";
      errorBox.appendChild(errorMsg);
      id("faqs").appendChild(errorBox);
      return;
    }

    let keys = Object.keys(faqsResp);
    keys.sort();
    for (let i = 0; i < keys.length; i++) {
      let data = faqsResp[keys[i]];
      let faq = gen("div");
      let question = gen("h3");
      question.textContent = data.question;
      let answer = gen("p");
      answer.textContent = data.answer;
      faq.appendChild(question);
      faq.appendChild(answer);
      faqs.appendChild(faq);
    }
  }

  init();
})();
