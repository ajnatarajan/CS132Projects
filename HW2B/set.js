/*
  NAME: Ajay Natarajan
  DATE: 04/15/2022

  This is the set.js file which handles toggling the display in the
  milestone.html file between menu view and game view upon one of two buttons
  being clicked.
 */
(function () {
  "use strict";
  const STYLES = ["solid", "outline", "striped"];
  const SHAPES = ["diamond", "oval", "squiggle"];
  const COLORS = ["green", "purple", "red"];
  const COUNTS = [1, 2, 3];
  let timerId = 0;
  let secondsRemaining = 0;

  function init() {
    const startButton = document.querySelector("#start-btn");
    const backToMainButton = document.querySelector("#back-btn");
    const refreshButton = document.querySelector("#refresh-btn");

    startButton.addEventListener("click", handleStart);
    refreshButton.addEventListener("click", populateBoard);
    backToMainButton.addEventListener("click", handleBack);
  }

  function handleStart() {
    toggleView();
    startTimer();
    enableRefreshButton();
    populateBoard();
    resetSetsFound();
  }

  function handleBack() {
    toggleView();
    resetTimer();
  }

  /* Helper functions */
  function toggleView() {
    const menuSection = document.querySelector("#menu-view");
    const gameSection = document.querySelector("#game-view");
    menuSection.classList.toggle("hidden");
    gameSection.classList.toggle("hidden");
  }

  function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function allUnique(arr) {
    return new Set(arr).size === arr.length;
  }

  function allEqual(arr) {
    // taken from stack overflow:
    // https://stackoverflow.com/questions/14832603/check-if-all-values-of-array-are-equal
    return arr.every((e) => e === arr[0]);
  }

  function secondsToMMSS(seconds) {
    // Conversion to MM:SS taken from stack overflow
    // https://stackoverflow.com/questions/1322732/convert-seconds-to-hh-mm-ss-with-javascript
    return new Date(parseInt(seconds) * 1000).toISOString().substr(14, 5);
  }

  function disableBoard() {
    /* Make all cards unselected and unclickable */
    let cards = qsa("#board > .card");
    for (let i = 0; i < cards.length; i++) {
      cards[i].classList.remove("selected");
      cards[i].removeEventListener("click", cardSelected);
    }

    /* Disable refresh button */
    id("refresh-btn").disabled = true;

    /* Stop and clear timer */
    if (timerId) {
      clearInterval(timerId);
    }

    timerId = null;
  }

  function enableRefreshButton() {
    id("refresh-btn").disabled = false;
  }

  function populateBoard() {
    /* First remove any existing cards */
    while (id("board").firstChild) {
      id("board").removeChild(id("board").lastChild);
    }

    const isEasy = qs('input[name="diff"]:checked').value === "easy";
    let numCards = 12;
    if (isEasy) {
      numCards = 9;
    }
    for (let i = 0; i < numCards; i++) {
      const newCard = generateUniqueCard(isEasy);
      id("board").appendChild(newCard);
    }
  }

  function resetSetsFound() {
    id("set-count").textContent = "0";
  }

  function resetTimer() {
    if (timerId) {
      clearInterval(timerId);
    }
    timerId = null;
  }
  /* End helper functions */

  function generateRandomAttributes(isEasy) {
    let attributes = [];
    let options = [STYLES, SHAPES, COLORS, COUNTS];
    for (let i = 0; i < options.length; i++) {
      attributes.push(randomChoice(options[i]));
    }

    if (isEasy) {
      attributes[0] = "solid";
    }

    return attributes;
  }

  function generateUniqueCard(isEasy) {
    let ids = new Set();
    let cards = document.querySelectorAll("#board > div");
    for (let i = 0; i < cards.length; i++) {
      ids.add(cards[i].id);
    }

    let newCard = document.createElement("div");
    newCard.classList.add("card");

    /* Given that there are 9-12 cards on the board and a total number of
     * possibilities of 27 or 81 (depending on if isEasy is true or not),
     * this will generate random attributes until we get a unique card. This
     * is a decent approach since the probability it fails 5 times in a row
     * is < 1% and it's pretty clean in my opinion.
     */
    let isUniqueId = false;
    let attributes = null;
    let newId = null;
    while (!isUniqueId) {
      attributes = generateRandomAttributes(isEasy);
      newId = attributes.join("-");
      if (!ids.has(newId)) {
        isUniqueId = true;
      }
    }

    newCard.id = newId;
    // COUNT is attributes[3]
    for (let i = 0; i < attributes[3]; i++) {
      let newImg = document.createElement("img");
      newImg.src = "imgs/" + attributes.slice(0, 3).join("-") + ".png";
      newImg.alt = newId;
      newCard.appendChild(newImg);
    }
    newCard.addEventListener("click", cardSelected);
    return newCard;
  }

  function isASet(selected) {
    let attributesForEachCard = [];
    for (let i = 0; i < selected.length; i++) {
      attributesForEachCard.push(selected[i].id.split("-"));
    }
    for (let j = 0; j < attributesForEachCard[0].length; j++) {
      let attr_vals = [];
      for (let i = 0; i < attributesForEachCard.length; i++) {
        attr_vals.push(attributesForEachCard[i][j]);
      }
      if (!allUnique(attr_vals) && !allEqual(attr_vals)) {
        return false;
      }
    }
    return true;
  }

  function startTimer() {
    secondsRemaining = parseInt(qs("#menu-view select").value);
    qs("#time").textContent = secondsToMMSS(secondsRemaining);
    timerId = setInterval(() => advanceTimer(), 1000);
  }

  function advanceTimer() {
    // in case the next advanceTimer loop gets called before the prior loop
    // which reduced secondsRemaining to 0 gets finished executing.
    if (secondsRemaining <= 0) {
      return;
    }
    secondsRemaining = Math.max(0, secondsRemaining - 1);
    qs("#time").textContent = secondsToMMSS(secondsRemaining);
    if (secondsRemaining <= 0) {
      disableBoard();
    }
  }

  function cardSelected() {
    /* Set the clicked one to selected */
    id(this.id).classList.toggle("selected");

    /* Check if we have 3 selected */
    let potentialSet = qsa("#board > .selected");
    if (potentialSet.length < 3) {
      return;
    }

    /* Determine if they make a set */
    let isSet = isASet(potentialSet);

    /* Remove selected UI effect */
    for (let i = 0; i < potentialSet.length; i++) {
      potentialSet[i].classList.remove("selected");
    }

    /* Control flow for is set vs. is not a set */
    if (isSet) {
      id("set-count").textContent = parseInt(id("set-count").textContent) + 1;
      for (let i = 0; i < potentialSet.length; i++) {
        potentialSet[i].classList.add("hide-imgs"); // hide images
        let yesSet = document.createElement("p");
        yesSet.textContent = "SET!";
        potentialSet[i].appendChild(yesSet); // add yes text to card
        setTimeout(() => {
          // swap in new card after 1 second
          let newCard = generateUniqueCard(
            qs('input[name="diff"]:checked').value === "easy" // determine ifEasy
          );
          id("board").replaceChild(newCard, potentialSet[i]);
        }, 1000);
      }
    } else {
      for (let i = 0; i < potentialSet.length; i++) {
        potentialSet[i].classList.add("hide-imgs"); // hide images
        let noSet = document.createElement("p");
        noSet.textContent = "Not a Set :(";
        potentialSet[i].appendChild(noSet); // add no text to card
        setTimeout(() => {
          // go back to normal after 1 second
          potentialSet[i].removeChild(noSet);
          potentialSet[i].classList.remove("hide-imgs");
        }, 1000);
      }

      secondsRemaining = Math.max(0, secondsRemaining - 15);
      qs("#time").textContent = secondsToMMSS(secondsRemaining);
      if (secondsRemaining <= 0) {
        disableBoard();
      }
    }
  }

  init();
})();
