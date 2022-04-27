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
  const imgs = [
    "imgs/home-page-icons/sideproject0.svg",
    "imgs/home-page-icons/sideproject1.svg",
    "imgs/home-page-icons/sideproject2.svg",
  ];
  const alts = [
    "[Qup.gg Home Page]",
    "[Qup.gg Game Selection]",
    "[Qup.gg Profile Swiping]",
  ];
  let currImgIndex = 0;

  function init() {
    id("left-arrow-button").addEventListener("click", showPrevImage);
    id("right-arrow-button").addEventListener("click", showNextImage);
  }

  function showPrevImage() {
    const prevIndex = (NUM_IMAGES + currImgIndex - 1) % NUM_IMAGES;
    showImage(prevIndex);
    currImgIndex = prevIndex;
  }

  function showNextImage() {
    const nextIndex = (currImgIndex + 1) % NUM_IMAGES;
    showImage(nextIndex);
    currImgIndex = nextIndex;
  }

  function showImage(imageIndex) {
    let newImg = gen("img");
    newImg.src = imgs[imageIndex];
    newImg.alt = alts[imageIndex];
    const parentElement = id("home-current-side-project");
    const oldImg = qs("#home-current-side-project > img");
    parentElement.replaceChild(newImg, oldImg);
  }

  init();
})();
