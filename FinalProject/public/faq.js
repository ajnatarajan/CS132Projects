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
