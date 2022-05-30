(function () {
  "use strict";
  // These arrays will be replaced with API calls
  const QUESTIONS = [
    "How long did it take to make this e-commerce site?",
    "It's been 10 days, why haven't my items shipped to me?",
    "How long would it take me to make a site as beautiful as this?",
    "Are there any other sites I should check out?",
    "How did you make these super aesthetic gradients, Ajay?",
    "Any cool life hacks you know?",
  ];
  const ANSWERS = [
    "Though people often like to say Rome wasn't built in a day, this final \
    project proposal was indeed built in a single day. It was quite the grind \
    if I do say so myself.",
    "Great observation! So the issue is this e-commerce store doesn't actually \
    handle payment and shipping which means your purchase was actually a \
    phantom transaction and you will never actually receive the goods you \
    ordered. On the bright side, you didn't actually pay any money so I'd say \
    all's well that ends well.",
    "The process is quite simple really- get into Caltech, take CS 132, and in \
    six short weeks, you'll be ready to built sites like this one.",
    "Visit qup.gg and sign up to be among our first batch of beta testers!",
    "Figma magic, baby.",
    "When in doubt, drink water.",
  ];

  /**
   * Initialize page by populating all FAQs
   * No parameters.
   * @returns {void}
   */
  function init() {
    const faqs = id("faqs");
    for (let i = 0; i < QUESTIONS.length; i++) {
      let faq = gen("div");
      let question = gen("h3");
      question.textContent = QUESTIONS[i];
      let answer = gen("p");
      answer.textContent = ANSWERS[i];
      faq.appendChild(question);
      faq.appendChild(answer);
      faqs.appendChild(faq);
    }
  }

  init();
})();
