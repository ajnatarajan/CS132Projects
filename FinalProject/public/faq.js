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
   * API call to get FAQs
   * No parameters
   * @returns {JSON} faqsResp - faqs and their answers
   */
  async function getFaqs() {
    let faqsResp = await fetch("/faqs");
    faqsResp = checkStatus(faqsResp);
    faqsResp = await faqsResp.json();
    return faqsResp;
  }

  /**
   * Populate the page with the FAQs and corresponding answers
   * @param {JSON} faqsResp - faqs and their answers
   */
  function populateFaqs(faqsResp) {
    const faqs = id("faqs");
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

  /**
   * Make error message
   * No parameters
   * @returns {void}
   */
  function makeErrorMsg() {
    let errorBox = gen("div");
    let errorMsg = gen("p");
    errorMsg.textContent = "Store is currently down. Please visit again later.";
    errorBox.appendChild(errorMsg);
    id("faqs").appendChild(errorBox);
  }

  /**
   * Initialize page by populating all FAQs
   * No parameters.
   * @returns {void}
   */
  async function init() {
    let faqsResp;
    try {
      faqsResp = await getFaqs();
    } catch (err) {
      makeErrorMsg();
      return;
    }

    populateFaqs(faqsResp);
  }

  init();
})();
