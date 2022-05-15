/*
  Name: Ajay Natarajan
  CS 132 Spring 2022
  Date: April 26th, 2022
  This is the handleToggle.js file for my personal website. This is used for all
  pages of the site (index.html and contact.html) to toggle the required
  elements from "light mode" to "dark mode".
 */

(function () {
  "use strict";

  /**
   * Adds event listener to the toggle switch.
   * No parameters
   * @returns {void}
   */
  function init() {
    id("toggle-switch").addEventListener("click", toggleMode);
  }

  /**
   * Toggles between light and dark mode.
   * No parameters.
   * @returns {void}
   */
  function toggleMode() {
    /* Handle body background and text */
    qs("body").classList.toggle("light-body");
    qs("body").classList.toggle("dark-body");

    /* Handle nav background */
    qs("nav").classList.toggle("nav-light");
    qs("nav").classList.toggle("nav-dark");

    /* Handle nav links */
    const aTags = qsa("nav a");
    for (let i = 0; i < aTags.length; i++) {
      aTags[i].classList.toggle("light-text");
      aTags[i].classList.toggle("dark-text");
    }

    /* Handle nav icons */
    const navIcons = qsa("nav img");
    for (let i = 0; i < navIcons.length; i++) {
      navIcons[i].classList.toggle("hidden");
    }

    /* Handle Contact Icons */
    const contactIcons = qsa("#contact-section img");
    for (let i = 0; i < contactIcons.length; i++) {
      contactIcons[i].classList.toggle("hidden");
    }

    /* Handle contact section background */
    const contactSection = qs("#contact-section");
    if (contactSection) {
      contactSection.classList.toggle("light-mode");
      contactSection.classList.toggle("dark-mode");
    }

    /* Handle footer */
    qs("footer").classList.toggle("nav-light");
    qs("footer").classList.toggle("nav-dark");
  }

  init();
})();
