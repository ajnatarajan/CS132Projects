/*
  NAME: Ajay Natarajan
  DATE: 04/15/2022

  This is the set.js file which handles all interactivity for the set.html 
  file. It implements toggling between menu view and game view and all
  subsequent necessary interactive elements for the Set game including
  changing UI for selecting cards, determining if a chosen set of three cards
  comprises a set, refreshing the board, and more.
 */
(function () {
  "use strict";
  const STYLES = ["solid", "outline", "striped"];
  const SHAPES = ["diamond", "oval", "squiggle"];
  const COLORS = ["green", "purple", "red"];
  const COUNTS = [1, 2, 3];
  let timerId = 0;
  let secondsRemaining = 0;

  /**
   * Initializes game by adding all relevant event listeners.
   * No parameters.
   * @returns {void}
   */
  function init() {
    const startButton = document.querySelector("#start-btn");
    const backToMainButton = document.querySelector("#back-btn");
    const refreshButton = document.querySelector("#refresh-btn");

    startButton.addEventListener("click", handleStart);
    refreshButton.addEventListener("click", populateBoard);
    refreshButton.addEventListener("click", penalizeIfValidSetExists); // optional challenge
    backToMainButton.addEventListener("click", handleBack);
  }

  /**
   * Handle all necessary things to start a game
   * No parameters.
   * @returns {void}
   */
  function handleStart() {
    toggleView();
    startTimer();
    enableRefreshButton();
    populateBoard();
    resetSetsFound();
  }

  /**
   * Handle all necessary things to end a game
   * No parameters.
   * @returns {void}
   */
  function handleBack() {
    toggleView();
    resetTimer();
  }

  /* Helper functions */
  /**
   * Toggle view between menu and game.
   * @returns {void}
   */
  function toggleView() {
    const menuSection = document.querySelector("#menu-view");
    const gameSection = document.querySelector("#game-view");
    menuSection.classList.toggle("hidden");
    gameSection.classList.toggle("hidden");
  }

  /**
   * Get a random element
   * @param {Array} arr - array of elements
   * @returns {Element} - random element from the array
   */
  function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /**
   * Determine whether all elements in an array are all unique.
   * @param {Array} arr - array of elements
   * @returns {boolean} - truth value of "all elements are unique".
   */
  function allUnique(arr) {
    return new Set(arr).size === arr.length;
  }

  /**
   * Determine whether all elements in an array are all same.
   * @param {Array} arr - array of elements
   * @returns {boolean} - truth value of "all elements are the same".
   */
  function allEqual(arr) {
    // taken from stack overflow:
    // https://stackoverflow.com/questions/14832603/check-if-all-values-of-array-are-equal
    return arr.every((e) => e === arr[0]);
  }

  /**
   * Convert seconds to MMSS form.
   * @param {Number} seconds - number of seconds, nonnegative
   * @returns {Date} - MM:SS conversion of seconds
   */
  function secondsToMMSS(seconds) {
    const raw_minutes = Math.floor(seconds / 60);
    const raw_seconds = seconds % 60;
    const mm = (raw_minutes < 10 ? "0" : "") + raw_minutes.toString();
    const ss = (raw_seconds < 10 ? "0" : "") + raw_seconds.toString();
    return mm + ":" + ss;
  }

  /**
   * Handle all necessary operations to disable the board
   * No parameters
   * @returns {void}
   */
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

  /**
   * Un-disable the refresh button
   * No parameters
   * @returns {void}
   */
  function enableRefreshButton() {
    id("refresh-btn").disabled = false;
  }

  /**
   * Delete all remaining cards and add new ones in.
   * No parameters
   * @returns {void}
   */
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

  /**
   * Reset set count
   * No parameters
   * @returns {void}
   */
  function resetSetsFound() {
    id("set-count").textContent = "0";
  }

  /**
   * Reset timer
   * No parameters
   * @returns {void}
   */
  function resetTimer() {
    if (timerId) {
      clearInterval(timerId);
    }
    timerId = null;
  }

  /**
   * Apply fifteen second penalty by deducting 15 from seconds remaining and
   * updating the time display.
   * No parameters
   * @returns {void}
   */
  function fifteenSecondPenalty() {
    secondsRemaining = Math.max(0, secondsRemaining - 15);
    qs("#time").textContent = secondsToMMSS(secondsRemaining);
    if (secondsRemaining <= 0) {
      disableBoard();
    }
  }

  /**
   * Returns if there is a valid set on the board at the moment.
   * No parameters
   * @returns {boolean} - whether a valid set exists
   */
  function validSetExists() {
    let cards = qsa("#board > .card");
    for (let i = 0; i < cards.length; i++) {
      for (let j = i + 1; j < cards.length; j++) {
        for (let k = j + 1; k < cards.length; k++) {
          if (isASet([cards[i], cards[j], cards[k]])) {
            return true;
          }
        }
      }
    }

    return false;
  }

  /**
   * Apply fifteen second penalty and produce an alert if valid set exists.
   * This function is called when refresh board is clicked.
   * No parameters.
   * @returns {void}
   */
  function penalizeIfValidSetExists() {
    if (validSetExists()) {
      fifteenSecondPenalty();
      alert("(15 second penalty) there were Sets left on the board!");
    }
  }
  /* End helper functions */

  /**
   * Generate all random attributes for a card and return as a list. Style
   * attribute will always be solid if isEasy flag is true.
   * @param {boolean} isEasy - setting of the board, true for easy and false for standard
   * @returns {Array} attributes - list of randomly chosen attributes
   */
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

  /**
   * Generate a unique card that is not already on the board. Will have style of
   * solid if isEasy flag is true.
   * @param {boolean} isEasy - setting of the board, true for easy and false for standard
   * @returns {DOM Element} newCard - unique card
   */
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

  /**
   * Returns whether the three cards passed in comprise a set.
   * @param {Array} selected - array of cards
   * @returns {boolean} - whether this array is a set
   */
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

  /**
   * Start game timer depending on selection made.
   * No params
   * @returns {void}
   */
  function startTimer() {
    secondsRemaining = parseInt(qs("#menu-view select").value);
    qs("#time").textContent = secondsToMMSS(secondsRemaining);
    timerId = setInterval(() => advanceTimer(), 1000);
  }

  /**
   * Advance timer by decrementing remaining time.
   * No params
   * @returns {void}
   */
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

  /**
   * Handle activity for when a card is clicked.
   * No params
   * @returns {void}
   */
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

      fifteenSecondPenalty();
    }
  }

  init();
})();
