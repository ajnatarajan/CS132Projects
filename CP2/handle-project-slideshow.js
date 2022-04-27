/*
  Name: Ajay Natarajan
  CS 132 Spring 2022
  Date: April 26th, 2022
  This is the handleProjectSlideshow.js file for my personal website. It is used
  by index.html to handle user input to the two buttons to go back and forth
  between images showcasing my most recent side project.
 */

(function () {
  "use strict";
  const NUM_IMAGES = 3;
  let currImgIndex = 0;

  /**
   * Adds event listeners to left and right arrow buttons for the slideshow.
   * No parameters.
   * @returns {void}
   */
  function init() {
    id("left-arrow-button").addEventListener("click", showPrevImage);
    id("right-arrow-button").addEventListener("click", showNextImage);
  }

  /**
   * Gets previous image index and calls showImage helper function to render it.
   * No parameters.
   * @returns {void}
   */
  function showPrevImage() {
    const prevIndex = (NUM_IMAGES + currImgIndex - 1) % NUM_IMAGES;
    showImage(prevIndex);
    currImgIndex = prevIndex;
  }

  /**
   * Gets next image index and calls showImage helper function to render it.
   * No parameters.
   * @returns {void}
   */
  function showNextImage() {
    const nextIndex = (currImgIndex + 1) % NUM_IMAGES;
    showImage(nextIndex);
    currImgIndex = nextIndex;
  }

  /**
   * Replace the old slideshow image with the image at imageIndex.
   * @param {Number} imageIndex - index of image in img and alt arrays.
   * @returns {void}
   */
  function showImage(imageIndex) {
    const IMGS = [
      "imgs/home-page-icons/side-project-0.svg",
      "imgs/home-page-icons/side-project-1.svg",
      "imgs/home-page-icons/side-project-2.svg",
    ];
    const ALTS = [
      "[Qup.gg Home Page]",
      "[Qup.gg Game Selection]",
      "[Qup.gg Profile Swiping]",
    ];
    let newImg = gen("img");
    newImg.src = IMGS[imageIndex];
    newImg.alt = ALTS[imageIndex];
    const parentElement = id("home-current-side-project");
    const oldImg = qs("#home-current-side-project > img");
    parentElement.replaceChild(newImg, oldImg);
  }

  init();
})();
