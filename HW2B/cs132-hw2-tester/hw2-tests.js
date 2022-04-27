/**
 * Testing code for HW2 Part B.
 *
 * [Credit to Jack Venberg for initial versions of these tests]
 */

/*
eslint
  max-lines-per-function: 0,
  no-magic-numbers: 0,
  no-console: 0,
  no-eval: 0,
  no-lonely-if: 0,
  complexity: 0,
  no-prototype-builtins: 0,
  no-global-assign: 0
*/
/*
global
  toggleView,
  generateRandomAttributes,
  generateUniqueCard,
  isASet,
  cardSelected,
  startTimer,
  timerId,
  secondsRemaining,
  Tester,
  lolex */
"use strict";
(function() {
  /* --------------------------------- MAIN FUNCTIONS --------------------------------- */
  let oldGenerateRandom = null;
  let tester = new Tester("../set.js", runTests, () => {
    if (typeof generateRandomAttributes !== "undefined") {
      generateRandomAttributes = oldGenerateRandom;
    }
    if (typeof timerId !== "undefined") {
      timerId = null;
    }
  });

  /** Runs Javascript Unit Tests */
  function runTests() {
    if (typeof generateRandomAttributes !== "undefined") {
      oldGenerateRandom = generateRandomAttributes;
    }

    let testOutput = {};

    // Part A Tests
    testOutput["Part A Tests"] = {};
    testOutput["Part A Tests"]["Provided Function Tests"] = [];
    testOutput["Part A Tests"]["Provided Function Tests"].push(tester.runTest(
      "toggleView() function",
      testToggleView
    ));

    testOutput["Part A Tests"]["Overall Tests"] = [];
    testOutput["Part A Tests"]["Overall Tests"].push(tester.runTest(
      "Test that given styles haven't changed",
      testGivenStyles
    ));
    testOutput["Part A Tests"]["Overall Tests"].push(tester.runTest(
      "Test #board styles",
      testBoardStyles
    ));
    testOutput["Part A Tests"]["Overall Tests"].push(tester.runTest(
      "Start button toggle view behavior",
      testStartView
    ));
    testOutput["Part A Tests"]["Overall Tests"].push(tester.runTest(
      "Back button toggle view behavior (depends on start button)",
      testBackView
    ));

    // Part B Tests
    testOutput["Part B Tests"] = {};
    testOutput["Part B Tests"]["Provided Function Tests"] = [];

    testOutput["Part B Tests"]["Provided Function Tests"].push(tester.runTest(
      "generateRandomAttributes() Difficult Mode",
      testGenerateAttributesDifficult
    ));
    testOutput["Part B Tests"]["Provided Function Tests"].push(tester.runTest(
      "generateRandomAttributes() Easy Mode",
      testGenerateAttributesEasy
    ));

    testOutput["Part B Tests"]["Provided Function Tests"].push(tester.runTest(
      "generateUniqueCard()",
      testCardGeneration
    ));
    testOutput["Part B Tests"]["Provided Function Tests"].push(tester.runTest(
      "generateUniqueCard() unique card generation in #game",
      testCardDuplicateAttributesGeneration
    ));
    testOutput["Part B Tests"]["Provided Function Tests"].push(tester.runTest(
      "isASet() (requires generateUniqueCard() implemented)",
      testIsASet
    ));
    testOutput["Part B Tests"]["Provided Function Tests"].push(tester.runTest(
      "Initial Time Displayed startTimer()",
      testStartTimerStart
    ));
    testOutput["Part B Tests"]["Provided Function Tests"].push(tester.runTest(
      "selectedCard() adding/removing .selected class",
      testCardSelectedAddRemoveClass
    ));
    testOutput["Part B Tests"]["Provided Function Tests"].push(tester.runTest(
      "selectedCard() display `SET!` message and CSS styles",
      testCardSelectedSetMessage
    ));
    testOutput["Part B Tests"]["Provided Function Tests"].push(tester.runTest(
      "selectedCard() display `Not a Set :(` message and CSS styles",
      testCardSelectedNonSetMessage
    ));
    testOutput["Part B Tests"]["Provided Function Tests"].push(tester.runTest(
      "Full Countdown Timer and Disable Board Functionality",
      testFullCountdownAndDisableTimer
    ));
    testOutput["Part B Tests"]["Provided Function Tests"].push(tester.runTest(
      "Countdown Timer with penalties",
      testCountdownWithPenalties
    ));

    testOutput["Part B Tests"]["Overall Tests"] = [];
    testOutput["Part B Tests"]["Overall Tests"].push(tester.runTest(
      "Testing overall button click functionality with difficult mode selected",
      testStartBackDifficult
    ));
    testOutput["Part B Tests"]["Overall Tests"].push(tester.runTest(
      "Testing overall button click functionality with easy mode selected",
      testStartBackEasy
    ));

    // Tester.consoleLogTest(testOutput);
    Tester.displayDomTest(testOutput);
  }

  /* ********************************* COMPLETED TESTS ********************************* */

  /* --------------------------------- UNIT TESTS --------------------------------- */

  /**
   * Tests generateRandomAttributes() difficult.
   * @returns {array} - Array of tests.
   */
  function testGenerateAttributesDifficult() {
    return testGenerateAttributesHelper(["solid", "outline", "striped"], false);
  }

  /**
   * Tests generateRandomAttributes() difficult.
   * @returns {array} - Array of tests.
   */
  function testGenerateAttributesEasy() {
    return testGenerateAttributesHelper(["solid"], true);
  }

  /**
   * Tests generateRandomAttributes() both difficulties.
   * @param {array} style - Test
   * @param {boolean} isEasy - Whether testing easy mode
   * @returns {array} - Array of tests.
   */
  function testGenerateAttributesHelper(style, isEasy) {
    let testFunctions = [];

    testFunctions.push(testRequirements({
      "generateRandomAttributes()": typeof generateRandomAttributes !== "undefined"
    }));

    const NUMBER_OF_GEN_ATTR_RUNS = 10000;

    const STYLE = style;
    const SHAPE = ["diamond", "oval", "squiggle"];
    const COLOR = ["green", "purple", "red"];
    const COUNT = [1, 2, 3];

    let foundStyle = new Set();
    let foundColor = new Set();
    let foundShape = new Set();
    let foundCount = new Set();

    testFunctions.push(() => {
      let output = {
        "name": "Testing if generateRandomAttributes produces values outside of spec."
      };
      for (let i = 0; i < NUMBER_OF_GEN_ATTR_RUNS; i++) {
        let attributes = generateRandomAttributes(isEasy);
        if (!(STYLE.includes(attributes[0]) &&
            SHAPE.includes(attributes[1]) &&
            COLOR.includes(attributes[2]) &&
            1 <= attributes[3] && attributes[3] <= 3)) {
          output.error = {
            "errorMessage": "Attributes array has incorrect values",
            "extra": ["Output Array:", attributes]
          };
        }
        foundStyle.add(attributes[0]);
        foundShape.add(attributes[1]);
        foundColor.add(attributes[2]);
        foundCount.add(attributes[3]);
      }
      return output;
    });

    testFunctions.push(() => {
      let output = {
        "name": "Testing if generateRandomAttributes does not produce every value in spec."
      };
      if (!(isSubset(new Set(STYLE), foundStyle) &&
          isSubset(new Set(COLOR), foundColor) &&
          isSubset(new Set(SHAPE), foundShape) &&
          isSubset(new Set(COUNT), foundCount))) {


        output.error = {
          "errorMessage": "Some attributes never appeared",
          "extra": [
            "Attributes that were outputted:",
            "Output Style:", Array.from(foundStyle).join(", "),
            "Output Color:", Array.from(foundColor).join(", "),
            "Output Shape:", Array.from(foundShape).join(", "),
            "Output Count:", Array.from(foundCount).join(", ")
          ]
        };
        if (isSubset(new Set(["1", "2", "3"]), foundCount)) {
          output.error["errorMessage"] += ". Make sure your count values are Numbers, not Strings.";
        }
      }
      return output;
    });

    return testFunctions;
  }

  /**
   * Test Card Generation
   * @returns {array} - Array of test functions.
   */
  function testCardGeneration() {
    let testFunctions = [];

    const DUMMY_ATTRIBUTES = [
      ["solid", "diamond", "red", 3],
      ["outline", "oval", "green", 2],
      ["striped", "squiggle", "purple", 1]
    ];

    testFunctions.push(testRequirements({
      "generateRandomAttributes()": typeof generateRandomAttributes !== "undefined",
      "generateUniqueCard()": typeof generateUniqueCard !== "undefined"
    }));

    testFunctions.push(() => {
      let output = {
        "name": `Test that generateUniqueCard() isEasy parameter is passed into
          generateRandomAttributes() correctly`
      };

      let passedInIsEasyValue = null;

      generateRandomAttributes = (isEasyParam) => {
        passedInIsEasyValue = isEasyParam;
        return DUMMY_ATTRIBUTES[0];
      };

      generateUniqueCard(true);
      if (passedInIsEasyValue !== true) {
        output.error = {
          "errorMessage": "isEasy parameter not passed into generateRandomAttributes() correctly"
        };
        return output;
      }

      generateUniqueCard(false);
      if (passedInIsEasyValue !== false) {
        output.error = {
          "errorMessage": "isEasy parameter not passed into generateRandomAttributes() correctly"
        };
        return output;
      }

      tester.resetCustom();
      return output;
    });

    testFunctions.push(() => {
      let output = {
        "name": "Testing if card can create every attribute type and is property formatted."
      };

      replaceGenerateRandomAttributeRandom(DUMMY_ATTRIBUTES);
      for (let i = 0; i < DUMMY_ATTRIBUTES.length; i++) {
        let card = generateUniqueCard(false);
        let cardResult = eqCard(card, DUMMY_ATTRIBUTES[i]);
        if (cardResult.errorMessage) {
          output.error = cardResult;
          return output;
        }
      }

      return output;
    });

    return testFunctions;
  }

  /**
   * Test Unique Card Generation
   * @returns {array} - Array of test functions.
   */
  function testCardDuplicateAttributesGeneration() {
    let testFunctions = [];

    document.getElementById("board").innerHTML = "";
    const DUPLICATE_ATTRIBUTES = [
      ["striped", "oval", "purple", 2],
      ["striped", "oval", "purple", 2],
      ["striped", "oval", "purple", 2],
      ["solid", "diamond", "red", 3],
      ["solid", "diamond", "red", 3],
      ["solid", "diamond", "red", 2],
      ["solid", "diamond", "red", 2],
      ["outline", "diamond", "red", 2]
    ];
    const NON_DUPLICATE_ATTRIBUTES = [
      ["striped", "oval", "purple", 2],
      ["solid", "diamond", "red", 3],
      ["solid", "diamond", "red", 2],
      ["outline", "diamond", "red", 2]
    ];

    testFunctions.push(testRequirements({
      "generateRandomAttributes()": typeof generateRandomAttributes !== "undefined",
      "generateUniqueCard()": typeof generateUniqueCard !== "undefined"
    }));

    testFunctions.push(() => {
      let output = {
        "name": `Test calling generateUniqueCard() without appending to #board. (Should create
          duplicates)`
      };

      replaceGenerateRandomAttributeRandom(DUPLICATE_ATTRIBUTES);
      for (let dummyAttribute of DUPLICATE_ATTRIBUTES) { // Not adding to board
        let card = generateUniqueCard(false);
        let cardResult = eqCard(card, dummyAttribute);
        if (cardResult.errorMessage) {
          cardResult.extra.unshift(`<em>If the attributes don't match up, this could be because you
          are not using generateRandomAttributes() correctly, or you are identifying duplicates in
          #game when there isn't.</em>`);
          output.error = cardResult;
          return output;
        }
      }
      return output;
    });

    testFunctions.push(() => {
      let output = {
        "name": `Test calling generateUniqueCard() with appending to #board. (Should not create
          duplicates)`
      };

      replaceGenerateRandomAttributeRandom(DUPLICATE_ATTRIBUTES);
      for (let nonDuplicateAttribute of NON_DUPLICATE_ATTRIBUTES) { // Adding to board
        let card = generateUniqueCard(false);
        document.getElementById("board").appendChild(card);
        let cardResult = eqCard(card, nonDuplicateAttribute);
        if (cardResult.errorMessage) {
          cardResult.extra.unshift(`If the attributes don't match up, this could be because you are
          not using generateRandomAttributes() correctly, or you are not identifying duplicates in
          #game correctly.`);
          output.error = cardResult;
          return output;
        }
      }

      return output;
    });

    return testFunctions;
  }

  /**
   * Tests isASet() function behavior
   * @returns {array} - Array of test functions.
   */
  function testIsASet() {
    let testFunctions = [];

    document.getElementById("board").innerHTML = "";

    testFunctions.push(testRequirements({
      "generateRandomAttributes()": typeof generateRandomAttributes !== "undefined",
      "generateUniqueCard()": typeof generateUniqueCard !== "undefined",
      "isASet()": typeof isASet !== "undefined"
    }));

    const EXAMPLE_SETS = [
      ["solid", "diamond", "red", 3],
        ["solid", "diamond", "red", 3],
        ["solid", "diamond", "red", 3],
      ["solid", "diamond", "red", 3],
        ["solid", "diamond", "red", 2],
        ["solid", "diamond", "red", 1],
      ["solid", "diamond", "red", 3],
        ["solid", "diamond", "green", 2],
        ["solid", "diamond", "purple", 1],
      ["outline", "diamond", "red", 3],
        ["solid", "diamond", "green", 2],
        ["striped", "diamond", "purple", 1],
      ["outline", "oval", "red", 3],
        ["solid", "diamond", "green", 2],
        ["striped", "squiggle", "purple", 1]
    ];
    const EXAMPLE_NON_SETS = [
      ["solid", "diamond", "blue", 3],
        ["solid", "diamond", "red", 3],
        ["solid", "diamond", "red", 3],
      ["solid", "diamond", "blue", 3],
        ["solid", "squiggle", "red", 3],
        ["solid", "diamond", "red", 3],
      ["solid", "diamond", "blue", 3],
        ["solid", "squiggle", "red", 3],
        ["outline", "diamond", "red", 3],
      ["solid", "diamond", "blue", 3],
        ["solid", "squiggle", "red", 1],
        ["outline", "diamond", "red", 3],
      ["outline", "diamond", "red", 3],
        ["solid", "diamond", "green", 2],
        ["striped", "squiggle", "purple", 1],
      ["striped", "oval", "red", 3],
        ["solid", "diamond", "green", 2],
        ["striped", "squiggle", "purple", 1],
      ["outline", "oval", "red", 3],
        ["solid", "diamond", "green", 2],
        ["striped", "squiggle", "purple", 3],
      ["outline", "oval", "red", 3],
        ["solid", "diamond", "green", 2],
        ["striped", "squiggle", "green", 3],
      ["solid", "oval", "blue", 3],
        ["solid", "squiggle", "red", 3],
        ["solid", "diamond", "red", 3]
    ];

    testFunctions.push(() => {
      let output = {
        "name": "Testing check set on set pairs."
      };

      replaceGenerateRandomAttributeRandom(EXAMPLE_SETS);
      for (let i = 0; i < EXAMPLE_SETS.length / 3; i++) {
        let cards = [
          generateUniqueCard(false),
          generateUniqueCard(false),
          generateUniqueCard(false)
        ];
        if (!isASet(cards)) {
          output.error = {
            "errorMessage": "Failed to identify correct sets",
            "extra": [
              "This set was not identified when it should have been:",
              "Attributes",
              EXAMPLE_SETS[i],
              EXAMPLE_SETS[i + 1],
              EXAMPLE_SETS[i + 2]
            ]
          };
        }
      }

      return output;
    });

    testFunctions.push(() => {
      let output = {
        "name": "Testing check set on non-set pairs."
      };

      replaceGenerateRandomAttributeRandom(EXAMPLE_NON_SETS);
      for (let i = 0; i < EXAMPLE_NON_SETS.length / 3; i++) {
        let cards = [
          generateUniqueCard(false),
          generateUniqueCard(false),
          generateUniqueCard(false)
        ];
        if (isASet(cards)) {
          output.error = {
            "errorMessage": "Failed to identify incorrect sets",
            "extra": [
              "This set was identified when it shouldn't have been:",
              "Attributes",
              EXAMPLE_NON_SETS[i],
              EXAMPLE_NON_SETS[i + 1],
              EXAMPLE_NON_SETS[i + 2]
            ]
          };
        }
      }

      return output;
    });

    return testFunctions;
  }

  /**
   * Tests startTimer() function behavior at start
   * @returns {array} - Array of test functions.
   */
  function testStartTimerStart() {
    let testFunctions = [];

    testFunctions.push(testRequirements({
      "startTimer()": typeof startTimer !== "undefined",
      "advanceTimer()": typeof advanceTimer !== "undefined",
      "Module-global timerId": typeof timerId !== "undefined",
      "Module-global secondsRemaining": typeof secondsRemaining !== "undefined"
    }));

    tester.clock = lolex.install();

    testFunctions.push(() => {
      return testAssert(
        "Testing if timer is already running.",
        `A timer is already running before calling startTimer() (probably because you didn't stop
          when #back-btn is clicked).`,
        false,
        tester.clock.countTimers() === 0
      )();
    });

    testFunctions.push(() => {
      let output = {
        "name": "Test starting time 3 minutes default selected"
      };

      startTimer();
      if (timerId === null) {
        output.error = {
          "errorMessage": "Module-global timerId not updated to keep track of timer ID."
        };
        return output;
      }

      let timeTestResult = timeCheckHelper(180);
      if (timeTestResult.errorMessage) {
        output.error = timeTestResult;
        return output;
      }

      return output;
    });

    testFunctions.push(() => {
      let output = {
        "name": "Test starting time 1 minutes when option is selected"
      };

      tester.clock.reset();
      tester.resetBody();

      document.querySelector('#menu-view select [value="60"]').selected = true;
      startTimer();

      let timeTestResult = timeCheckHelper(60);
      if (timeTestResult.errorMessage) {
        output.error = timeTestResult;
        return output;
      }

      return output;
    });

    testFunctions.push(() => {
      let output = {
        "name": "Test starting time 5 minutes when option is selected"
      };

      tester.clock.reset();
      tester.resetBody();

      document.querySelector('#menu-view select [value="300"]').selected = true;
      startTimer();

      let timeTestResult = timeCheckHelper(300);
      if (timeTestResult.errorMessage) {
        output.error = timeTestResult;
        return output;
      }

      return output;
    });

    return testFunctions;
  }

  /**
   * Tests startTimer() and advanceTimer() function behavior throughout whole countdown
   * @returns {array} - Array of test functions.
   */
  function testFullCountdownAndDisableTimer() {
    let testFunctions = [];

    testFunctions.push(testRequirements({
      "generateRandomAttributes()": typeof generateRandomAttributes !== "undefined",
      "generateUniqueCard()": typeof generateUniqueCard !== "undefined",
      "isASet()": typeof isASet !== "undefined",
      "cardSelected()": typeof cardSelected !== "undefined",
      "startTimer()": typeof startTimer !== "undefined",
      "advanceTimer()": typeof advanceTimer !== "undefined",
      "Module-global timerId": typeof timerId !== "undefined",
      "Module-global secondsRemaining": typeof secondsRemaining !== "undefined"
    }));

    let timesCardSelectedCalled = null;
    let oldCardSelected = null;
    let card = null;
    document.getElementById("game-view").classList.remove("hidden");
    tester.clock = lolex.install();

    testFunctions.push(() => {
      let output = {
        "name": `Test board countdown from 5 minutes to zero and tests correct displaying and
                  module-global values`
      };

      timesCardSelectedCalled = 0;
      oldCardSelected = cardSelected;
      cardSelected = () => {
        timesCardSelectedCalled++;
        oldCardSelected();
      };

      card = generateUniqueCard(false);
      card.classList.add("selected");
      document.getElementById("board").appendChild(card);

      document.querySelector('#menu-view select [value="300"]').selected = true;
      startTimer();
      for (let i = 300; i >= 0; i--) { // 3 minute test
        let timeTestResult = timeCheckHelper(i);
        if (timeTestResult.errorMessage) {
          output.error = timeTestResult;
          return output;
        }
        tester.clock.tick(1000);
      }

      return output;
    });

    testFunctions.push(() => {
      return testAssert(
        "Testing that no timer is running when hits zero.",
        "Timer still running when clock hits zero",
        false,
        tester.clock.countTimers() === 0
      )();
    });

    testFunctions.push(() => {
      let output = {
        "name": `Test that when time is called past zero, the test does not display less than 0`
      };
      tester.clock.tick(2000);
      let boardTime = parseTime();
      if (!boardTime) {
        output.error = {
          "errorMessage": "Time format displayed on board incorrect",
          "extra": ["Incorrectly Formatted Time:", document.getElementById("time").innerText]
        };
        return output;
      }
      if (boardTime.total !== 0) {
        output.error = {
          "errorMessage": "Wrong time displayed",
          "extra": ["Expected seconds:", 0, "Outputted seconds:", boardTime.total]
        };
        return output;
      }
      return output;
    });

    testFunctions.push(testAssert(
      "Testing that game-view is still showing.",
      "Game view is not displayed",
      false,
      !document.getElementById("game-view").classList.contains("hidden")
    ));

    testFunctions.push(() => {
      return testAssert(
        "Testing that game-view is still showing.",
        "Game view is not displayed",
        false,
        !document.getElementById("game-view").classList.contains("hidden")
      )();
    });

    testFunctions.push(() => {
      return testAssert(
        "Testing that refresh button is disabled.",
        "Refresh button is not disabled when timer runs to zero",
        false,
        document.getElementById("refresh-btn").disabled === true
      )();
    });

    testFunctions.push(() => {
      return testAssert(
        "Testing if timerId was reset to 'null'.",
        "Module-global timerId was not reset to null after #back-btn is clicked.",
        false,
        timerId === null,
        [`It is always best practice to set your timer variables to null when there is
          no timer running in order to keep track of when the timer is running.`]
      )();
    });

    testFunctions.push(() => {
      let output = {
        "name": `Testing if clicking card triggers cardSelected function.`
      };

      timesCardSelectedCalled = 0;

      card.click();

      if (timesCardSelectedCalled !== 0) {
        output.error = {
          "errorMessage": `Clicking card called cardSelected function call after it should be
                          disabled`
        };
      }
      cardSelected = oldCardSelected;
      return output;
    });

    return testFunctions;
  }

  /**
   * Tests timer board and state against given format.
   * @param {number} seconds - Seconds to test start for.
   * @param {string} stringFormat - String to display in error.
   * @param {string} option - Corresponding option on select.
   * @returns {JSON} - Test result.
   */
  function timeCheckHelper(seconds) {
    let boardTime = parseTime();
    let stateTime = secondsRemaining;
    if (!boardTime) {
      return {
        "errorMessage": "Time format displayed on board incorrect",
        "extra": ["Your Output:", document.getElementById("time").innerText]
      };
    }
    if (boardTime.total !== seconds) {
      return {
        "errorMessage": `Time on board is not correct`,
        "extra": [
          "Your Output:", document.getElementById("time").innerText,
          "Expected Seconds", seconds
        ]
      };
    }

    if (stateTime !== seconds) {
      return {
        "errorMessage": `Module global 'secondsRemaining' does not store the right seconds value as
                         a number.`,
        "extra": [
          "Your Output:", stateTime,
          "Variable Type:", typeof stateTime,
          "Expected:", seconds
        ]
      };
    }
    return true;
  }

  /**
   * Tests cardSelected() .selected class function behavior
   * @returns {array} - Array of test functions.
   */
  function testCardSelectedAddRemoveClass() {
    let testFunctions = [];

    testFunctions.push(testRequirements({
      "generateRandomAttributes()": typeof generateRandomAttributes !== "undefined",
      "generateUniqueCard()": typeof generateUniqueCard !== "undefined",
      "isASet()": typeof isASet !== "undefined",
      "cardSelected()": typeof cardSelected !== "undefined"
    }));

    let card = null;
    testFunctions.push(() => {
      let output = {
        "name": "Testing if newly generated card does not have .selected class at start."
      };

      document.getElementById("board").innerHTML = "";
      card = generateUniqueCard(false);
      document.getElementById("board").appendChild(card);

      if (card.classList.contains("selected")) {
        output.error = {
          "errorMessage": "Card has .selected class before being clicked"
        };
      }
      return output;
    });

    testFunctions.push(() => {
      let output = {
        "name": "Testing if newly generated card has .selected class after cardSelected call."
      };
      cardSelected.call(card); // Calls selected with this bound to card.
      if (!card.classList.contains("selected")) {
        output.error = {
          "errorMessage": "Card does not have selected class after being called",
          "extra": [`Make sure that you are using the "this" keyword to refer to the card. The test
            binds the triggered card to "this" inside of cardSelected.`]
        };
      }
      return output;
    });

    testFunctions.push(() => {
      let output = {
        "name": `Testing if newly generated card has .selected class removed after second
          cardSelected call.`
      };
      cardSelected.call(card); // Calls selected with this bound to card.
      if (card.classList.contains("selected")) {
        output.error = {
          "errorMessage": "Card has selected class after being called twice",
          "extra": [`Make sure that you are using the "this" keyword to refer to the card. The test
            binds the triggered card to "this" inside of cardSelected.`]
        };
      }
      return output;
    });

    testFunctions.push(() => {
      let output = {
        "name": `Testing if clicking card triggers cardSelected function.`
      };
      let isClicked = 0;
      let oldCardSelected = cardSelected;
      cardSelected = () => {
        isClicked++;
        oldCardSelected();
      };

      document.getElementById("board").innerHTML = "";
      card = generateUniqueCard(false);
      document.getElementById("board").appendChild(card);

      let cards = document.querySelectorAll(".card");
      if (cards.length === 0) {
        output.error = {
          "errorMessage": "Card are not on board, so can't test if clicking triggers."
        };
        cardSelected = oldCardSelected;
        return output;
      }

      for (let currentCard of cards) {
        currentCard.click();
      }
      if (isClicked !== cards.length) {
        output.error = {
          "errorMessage": "Clicking card did not trigger cardSelected function call"
        };
      }
      cardSelected = oldCardSelected;
      return output;
    });

    return testFunctions;
  }

  /**
   * Tests cardSelected() Set message function behavior
   * @returns {array} - Array of test functions.
   */
  function testCardSelectedSetMessage() {
    // Test 3 Selected Set Check With Message
    return testCardSelectedMessageHelper(
      [
        ["solid", "diamond", "red", 3],
          ["solid", "diamond", "red", 2],
          ["solid", "diamond", "red", 1],
        ["solid", "oval", "green", 3],
          ["solid", "oval", "green", 2],
          ["solid", "oval", "green", 1]
      ],
      "SET!",
      true
    );
  }

  /**
   * Tests cardSelected() non set message function behavior
   * @returns {array} - Array of test functions.
   */
  function testCardSelectedNonSetMessage() {
    return testCardSelectedMessageHelper(
      [
        ["solid", "oval", "blue", 3],
          ["solid", "squiggle", "red", 3],
          ["solid", "diamond", "red", 3],
        ["bad", "bad", "bad", 1],
          ["bad", "bad", "bad", 2],
          ["bad", "bad", "bad", 3]
      ],
      "Not a Set :(",
      false
    );
  }

  /**
   * Tests cardSelected() message function behavior
   * @param {array} exampleAttributes - Array of attributes to use.
   * @param {string} message - Message to test for.
   * @param {boolean} replaceCardTest - Whether to test for card replaced.
   * @returns {array} - Array of test functions.
   */
  function testCardSelectedMessageHelper(exampleAttributes, message, replaceCardTest) {
    let testFunctions = [];

    testFunctions.push(testRequirements({
      "generateRandomAttributes()": typeof generateRandomAttributes !== "undefined",
      "generateUniqueCard()": typeof generateUniqueCard !== "undefined",
      "isASet()": typeof isASet !== "undefined",
      "cardSelected()": typeof cardSelected !== "undefined"
    }));

    testFunctions.push(() => {
      let output = {
        "name": `Testing that set count starts at 0`
      };
      if (parseInt(document.getElementById("set-count").textContent) !== 0) {
        output.error = {
          "errorMessage": "Set count does not start at 0 before cards clicked."
        };
      }
      return output;
    });

    let cards = [];
    testFunctions.push(() => {
      let output = {
        "name": `Testing that all cards have been unselected right away.`
      };

      document.getElementById("board").innerHTML = "";
      tester.clock = lolex.install(); // Installs fake timers

      replaceGenerateRandomAttributeRandom(exampleAttributes);

      for (let i = 0; i < 3; i++) {
        let card = generateUniqueCard(false);
        document.getElementById("board").appendChild(card);

        cardSelected.call(card);

        cards.push(card);
      }

      let selectedCards = document.querySelectorAll(".selected");
      if (selectedCards.length !== 0) {
        output.error = {
          "errorMessage": "Not all cards have been unselected."
        };
        return output;
      }

      return output;
    });

    testFunctions.push(() => {
      let output = {
        "name": `Testing that set count is incremented or stays the same correctly.`
      };
      if (replaceCardTest) {
        if (parseInt(document.getElementById("set-count").textContent) !== 1) {
          output.error = {
            "errorMessage": "Set count does increment after set is selected."
          };
        }
      } else {
        if (parseInt(document.getElementById("set-count").textContent) !== 0) {
          output.error = {
            "errorMessage": "Set count does stay the same after non set is selected."
          };
        }
      }
      return output;
    });

    testFunctions.push(() => {
      let output = {
        "name": `Testing that message is properly added to card and stays for 1 second.`
      };

      // Before message goes away.
      tester.clock.tick(999);
      for (let card of cards) {
        if (card.querySelector("p") === null ||
              !card.querySelector("p").innerText.includes(message)) {
          output.error = {
            "errorMessage": `'` + message + `' message failed to display for 1 second in paragraph
                inside of card when Set selected. <p> element must be last element directly inside
                of card.`
          };
        }
      }
      return output;
    });

    testFunctions.push(() => {
      let output = {
        "name": `Testing that all images are hidden while message is displayed.`
      };

      let imgs = document.querySelectorAll(".card > img");
      if (imgs.length === 0) {
        output.error = {
          "errorMessage": "Images are not in card."
        };
        return output;
      }

      output.error = Tester.checkStyle(
        document.querySelectorAll(".card > img"),
        "display",
        "none",
        "Images inside of card are not properly hidden when message is displayed."
      );

      return output;
    });

    testFunctions.push(() => {
      let testOutput = {
        "name": "Testing card message CSS is bold."
      };
      testOutput.error = Tester.checkStyle(
        document.querySelector(".card p:last-child"),
        "font-weight",
        "700",
        "'font-weight: bold' is not applied to card message"
      );
      return testOutput;
    });

    testFunctions.push(() => {
      let testOutput = {
        "name": "Testing card message font-size."
      };
      testOutput.error = Tester.checkStyle(
        document.querySelector(".card p:last-child"),
        "font-size",
        21.3333,
        "'font-size is not set to 16pt on the card message"
      );
      return testOutput;
    });

    testFunctions.push(() => {
      let testOutput = {
        "name": "Testing that card message text is centered."
      };
      testOutput.error = Tester.checkStyle(
        document.querySelector(".card p:last-child"),
        "text-align",
        "center",
        "'text-align is not set to center on the card message"
      );
      return testOutput;
    });

    testFunctions.push(() => {
      let output = {
        "name": `Testing that message is properly removed after 1 second.`
      };

      // After message goes away and cards replaced.
      tester.clock.tick(1);
      for (let i = 0; i < cards.length; i++) {
        let card = cards[i];
        if (replaceCardTest && card.parentNode !== null) {
          output.error = {
            "errorMessage": "Old cards failed to be removed after 1 second when Set selected."
          };
          return output;
        }

        if (!replaceCardTest && card.querySelector("p") !== null) {
          output.error = {
            "errorMessage": "Message failed to be removed after 1 second when no set is selected"
          };
          return output;
        }
      }

      return output;
    });

    if (replaceCardTest) {
      testFunctions.push(() => {
        let output = {
          "name": `Testing that message is replaced with new cards after 1 second.`
        };

        let boardCards = document.getElementById("board").children;
        for (let i = 0; i < 3; i++) {
          let card = boardCards[i];
          if (eqCard(card, exampleAttributes[i + 3]) !== true) {
            output.error = {
              "errorMessage": "Cards not correctly replaced with random new card when Set selected.",
              "extra": [
                `Make sure you are replacing the cards in the order that they are inside of #board
                for this test to work.`
              ]
            };
          }
        }
        return output;
      });
    } else {
      testFunctions.push(() => {
        let output = {
          "name": `Testing that all images are unhidden after message is displayed.`
        };

        let imgs = document.querySelectorAll(".card > img");
        if (imgs.length === 0) {
          output.error = {
            "errorMessage": "Images are not in card."
          };
          return output;
        }

        output.error = Tester.checkStyle(
          document.querySelectorAll(".card > img"),
          "display",
          "block",
          "Images inside of card are not properly unhidden after message is displayed."
        );

        return output;
      });

      testFunctions.push(() => {
        let output = {
          "name": `Testing previous cards are the same.`
        };

        let boardCards = document.getElementById("board").children;
        for (let i = 0; i < 3; i++) {
          let card = boardCards[i];
          if (eqCard(card, exampleAttributes[i]) !== true) {
            output.error = {
              "errorMessage": "Cards not correctly returned original state."
            };
          }
        }
        return output;
      });
    }

    return testFunctions;
  }

  /**
   * Tests penalty/timer behavior
   * @returns {array} - Array of test functions.
   */
  function testCountdownWithPenalties() {
    let testFunctions = [];
    const BOARD_CARDS = [
      ["striped", "oval", "purple", 1],
      ["striped", "oval", "purple", 2],
      ["striped", "oval", "purple", 3],
      ["solid", "oval", "purple", 1],
      ["solid", "oval", "green", 2],
      ["solid", "oval", "red", 2],
      ["outline", "oval", "purple", 1],
      ["outline", "oval", "purple", 2],
      ["outline", "oval", "purple", 3]
    ];
    tester.clock = lolex.install();

    testFunctions.push(testRequirements({
      "generateRandomAttributes()": typeof generateRandomAttributes !== "undefined",
      "generateUniqueCard()": typeof generateUniqueCard !== "undefined",
      "isASet()": typeof isASet !== "undefined",
      "cardSelected()": typeof cardSelected !== "undefined",
      "startTimer()": typeof startTimer !== "undefined",
      "advanceTimer()": typeof advanceTimer !== "undefined",
      "Module-global timerId": typeof timerId !== "undefined",
      "Module-global secondsRemaining": typeof secondsRemaining !== "undefined"
    }));

    let cards = [];
    testFunctions.push(() => {
      let output = {
        "name": "Testing starting time"
      };

      document.getElementById("board").innerHTML = "";
      startTimer();

      replaceGenerateRandomAttributeRandom(BOARD_CARDS);
      for (let i = 0; i < 6; i++) {
        let card = generateUniqueCard(false);
        cards.push(card);
        document.getElementById("board").appendChild(card);
      }


      let timeTestResult = timeCheckHelper(180);
      if (timeTestResult.errorMessage) {
        output.error = timeTestResult;
      }

      return output;
    });

    testFunctions.push(() => {
      let output = {
        "name": "Testing time after one incorrect set clicked"
      };

      for (let i = 3; i < cards.length; i++) {
        cards[i].click();
      }

      let timeTestResult = timeCheckHelper(165);
      if (timeTestResult.errorMessage) {
        output.error = timeTestResult;
      }

      return output;
    });

    testFunctions.push(() => {
      let output = {
        "name": "Testing time after one correct set clicked"
      };

      for (let i = 0; i < 3; i++) {
        cards[i].click();
      }

      let timeTestResult = timeCheckHelper(165);
      if (timeTestResult.errorMessage) {
        output.error = timeTestResult;
      }

      return output;
    });

    testFunctions.push(() => {
      let output = {
        "name": "Testing penalty when less than 15 seconds left"
      };

      tester.clock.tick(160000);

      for (let i = 3; i < cards.length; i++) {
        cards[i].click();
      }

      let timeTestResult = timeCheckHelper(0);
      if (timeTestResult.errorMessage) {
        output.error = timeTestResult;
      }

      return output;
    });

    return testFunctions;
  }

  /* --------------------------------- INTEGRATION TESTS --------------------------------- */

  /**
   * Tests generate board on start behavior
   * @returns {array} - Array of test functions.
   */
  function testStartBackEasy() {
    return testStartBackClickHelper(true);
  }

  /**
   * Tests generate board on start behavior
   * @returns {array} - Array of test functions.
   */
  function testStartBackDifficult() {
    return testStartBackClickHelper(false);
  }

  /**
   * Tests generate board on start behavior
   * @param {boolean} isEasy - If testing easy generate board.
   * @returns {array} - Array of test functions.
   */
  function testStartBackClickHelper(isEasy) {
    let testFunctions = [];

    const EASY_BOARD = [
      ["solid", "oval", "green", 2],
      ["solid", "squiggle", "red", 1],
      ["solid", "squiggle", "red", 2],
      ["solid", "oval", "green", 1],
      ["solid", "diamond", "purple", 1],
      ["solid", "squiggle", "purple", 3],
      ["solid", "oval", "red", 3],
      ["solid", "diamond", "green", 1],
      ["solid", "squiggle", "purple", 2],
      ["solid", "oval", "red", 1],
      ["solid", "oval", "purple", 2],
      ["solid", "oval", "purple", 3],
      ["solid", "diamond", "purple", 1],
      ["solid", "oval", "green", 2],
      ["solid", "squiggle", "green", 1],
      ["solid", "diamond", "green", 1],
      ["solid", "diamond", "red", 1],
      ["solid", "squiggle", "red", 3]
    ];

    const HARD_BOARD = [
      ["outline", "diamond", "purple", 1],
      ["outline", "oval", "purple", 2],
      ["outline", "oval", "purple", 3],
      ["striped", "diamond", "purple", 2],
      ["solid", "squiggle", "green", 2],
      ["solid", "oval", "green", 1],
      ["striped", "diamond", "purple", 1],
      ["striped", "diamond", "green", 3],
      ["outline", "squiggle", "green", 1],
      ["outline", "diamond", "green", 1],
      ["striped", "squiggle", "red", 3],
      ["solid", "diamond", "purple", 1],
      ["striped", "squiggle", "green", 1],
      ["striped", "squiggle", "red", 3],
      ["solid", "squiggle", "red", 2],
      ["solid", "oval", "green", 1],
      ["solid", "squiggle", "red", 3],
      ["striped", "diamond", "purple", 2],
      ["outline", "oval", "green", 2],
      ["striped", "squiggle", "red", 2],
      ["striped", "squiggle", "red", 1],
      ["outline", "diamond", "purple", 3],
      ["striped", "squiggle", "green", 2],
      ["solid", "diamond", "purple", 2]
    ];

    testFunctions.push(testRequirements({
      "toggleView()": typeof generateRandomAttributes !== "undefined",
      "generateRandomAttributes()": typeof generateRandomAttributes !== "undefined",
      "generateUniqueCard()": typeof generateUniqueCard !== "undefined",
      "isASet()": typeof isASet !== "undefined",
      "cardSelected()": typeof cardSelected !== "undefined",
      "startTimer()": typeof startTimer !== "undefined",
      "advanceTimer()": typeof advanceTimer !== "undefined",
      "Module-global timerId": typeof timerId !== "undefined",
      "Module-global secondsRemaining": typeof secondsRemaining !== "undefined"
    }));

    let startTimerOld = null;
    let startTimerCalled = 0;
    let toggleViewOld = null;
    let toggleViewCalled = 0;

    testFunctions.push(() => {
      let output = {
        "name": "Test that startTimer and toggleView are both called when start is clicked."
      };

      startTimerOld = startTimer;
      toggleViewOld = toggleView;

      startTimer = () => {
        startTimerCalled++;
        startTimerOld();
      };

      toggleView = () => {
        toggleViewCalled++;
        toggleViewOld();
      };

      dispatchEvent(new Event('load'));

      tester.clock = lolex.install();
      if (!isEasy) {
        document.querySelector("input[value='standard']").checked = true;
      }

      document.getElementById("board").innerHTML = "";
      replaceGenerateRandomAttributeRandom(isEasy ? EASY_BOARD : HARD_BOARD);
      document.getElementById("start-btn").click();

      if (startTimerCalled !== 1) {
        output.error = {
          "errorMessage": "startTimer is not called when #start-btn is clicked"
        };
      }

      if (toggleViewCalled !== 1) {
        output.error = {
          "errorMessage": "toggleView is not called when #start-btn is clicked"
        };
      }

      startTimer = startTimerOld;
      toggleView = toggleViewOld;

      return output;
    });

    testFunctions.push(() => {
      let output = {
        "name": "Testing if timer is started."
      };

      let timeTestResult = timeCheckHelper(180);
      if (timeTestResult.errorMessage) {
        output.error = timeTestResult;
        return output;
      }

      tester.clock.tick(5000);
      timeTestResult = timeCheckHelper(175);
      if (timeTestResult.errorMessage) {
        output.error = timeTestResult;
        return output;
      }

      return output;
    });

    testFunctions.push(() => {
      let output = {
        "name": "Testing if board was generated with correct cards."
      };

      let expectedNumOfCards = isEasy ? 9 : 12;
      if (document.getElementById("board").children.length !== expectedNumOfCards) {
        output.error = {
          "errorMessage": "Expected number of cards not in #board at start.",
          "extra": [
            "Expected", expectedNumOfCards,
            "Actual", document.getElementById("board").children.length
          ]
        };
      }

      let attributes = isEasy ? EASY_BOARD : HARD_BOARD;
      let cards = document.querySelectorAll(".card");
      for (let i = 0; i < cards.length; i++) {
        let card = cards[i];
        let cardResult = eqCard(card, attributes[i]);
        if (cardResult.errorMessage) {
          output.error = cardResult;
          return output;
        }
      }

      return output;
    });

    testFunctions.push(() => {
      let output = {
        "name": "Testing refresh button replaces cards."
      };

      document.getElementById("refresh-btn").click();

      let expectedNumOfCards = isEasy ? 9 : 12;
      if (document.getElementById("board").children.length !== expectedNumOfCards) {
        output.error = {
          "errorMessage": "Expected number of cards not in #board after refresh.",
          "extra": [
            "Expected", expectedNumOfCards,
            "Actual", document.getElementById("board").children.length
          ]
        };
      }

      let attributes = isEasy ? EASY_BOARD : HARD_BOARD;
      let cards = document.querySelectorAll(".card");
      for (let i = 0; i < cards.length; i++) {
        let card = cards[i];
        let cardResult = eqCard(card, attributes[i + expectedNumOfCards]);
        if (cardResult.errorMessage) {
          output.error = cardResult;
          return output;
        }
      }

      return output;
    });

    testFunctions.push(() => {
      let output = {
        "name": "Test that toggleView is called when back button is clicked."
      };

      toggleViewOld = toggleView;
      toggleViewCalled = 0;

      toggleView = () => {
        toggleViewCalled++;
        toggleViewOld();
      };

      // Set up next test to see if set-count and disabled btn is reset.
      document.getElementById("set-count").textContent = "1";
      document.getElementById("refresh-btn").disabled = true;

      document.getElementById("back-btn").click();

      if (toggleViewCalled !== 1) {
        output.error = {
          "errorMessage": "toggleView is not called when #back-btn is clicked"
        };
      }

      toggleView = toggleViewOld;

      return output;
    });

    testFunctions.push(() => {
      return testAssert(
        "Testing that no timer is running when back-btn is hit.",
        "Timer still running when back-btn is hit.",
        false,
        tester.clock.countTimers() === 0
      )();
    });

    const SECOND_START_GAME_CARDS = [
      ["solid", "squiggle", "purple", 2],
      ["solid", "squiggle", "red", 2],
      ["solid", "squiggle", "purple", 3],
      ["solid", "oval", "green", 2],
      ["solid", "diamond", "purple", 1],
      ["solid", "diamond", "green", 2],
      ["solid", "oval", "purple", 2],
      ["solid", "squiggle", "red", 1],
      ["solid", "oval", "purple", 3],
      ["solid", "diamond", "purple", 2],
      ["solid", "diamond", "red", 3],
      ["solid", "diamond", "purple", 3],

      ["outline", "squiggle", "purple", 2],
      ["outline", "squiggle", "red", 2],
      ["outline", "squiggle", "purple", 3],
      ["outline", "oval", "green", 2],
      ["outline", "diamond", "purple", 1],
      ["outline", "diamond", "green", 2],
      ["outline", "oval", "purple", 2],
      ["outline", "squiggle", "red", 1],
      ["outline", "oval", "purple", 3],
      ["outline", "diamond", "purple", 2],
      ["outline", "diamond", "red", 3],
      ["outline", "diamond", "purple", 3]
    ];

    testFunctions.push(() => {
      let output = {
        "name": "Testing if restarting game generates new board."
      };

      replaceGenerateRandomAttributeRandom(SECOND_START_GAME_CARDS);

      document.getElementById("start-btn").click();

      let expectedNumOfCards = isEasy ? 9 : 12;
      if (document.getElementById("board").children.length !== expectedNumOfCards) {
        output.error = {
          "errorMessage": "Expected number of cards not in #board at start.",
          "extra": [
            "Expected", expectedNumOfCards,
            "Actual", document.getElementById("board").children.length
          ]
        };
      }

      let attributes = SECOND_START_GAME_CARDS;
      let cards = document.querySelectorAll(".card");
      for (let i = 0; i < cards.length; i++) {
        let card = cards[i];
        let cardResult = eqCard(card, attributes[i]);
        if (cardResult.errorMessage) {
          output.error = cardResult;
          return output;
        }
      }

      return output;
    });

    testFunctions.push(() => {
      return testAssert(
        "Testing set count is reset to zero second game start.",
        "Set count is not reset to zero on board.",
        false,
        parseInt(document.getElementById("set-count").innerText) === 0
      )();
    });

    testFunctions.push(() => {
      return testAssert(
        "Testing that refresh button no longer disabled after starting another game.",
        "Refresh button is enabled when another game starts",
        false,
        document.getElementById("refresh-btn").disabled === false
      )();
    });

    testFunctions.push(() => {
      let output = {
        "name": "Testing that refresh board works on second game play."
      };

      document.getElementById("refresh-btn").click();

      let expectedNumOfCards = isEasy ? 9 : 12;
      if (document.getElementById("board").children.length !== expectedNumOfCards) {
        output.error = {
          "errorMessage": "Expected number of cards not in #board at start.",
          "extra": [
            "Expected", expectedNumOfCards,
            "Actual", document.getElementById("board").children.length
          ]
        };
      }

      let attributes = SECOND_START_GAME_CARDS;
      let cards = document.querySelectorAll(".card");
      for (let i = 0; i < cards.length; i++) {
        let card = cards[i];
        let cardResult = eqCard(card, attributes[i + expectedNumOfCards]);
        if (cardResult.errorMessage) {
          output.error = cardResult;
          return output;
        }
      }

      return output;
    });

    return testFunctions;
  }

  /* --------------------------------- HELPER FUNCTIONS --------------------------------- */

  /**
   * Generates test to test if function exists
   * @param {JSON} requirements - Requirement formatted JSON
   * @returns {function} - Test to run
   */
  function testRequirements(requirements) {
    return () => {
      let output = {
        "name": "Testing function requirements"
      };
      let extra = ["The following function(s) are required to run this test:"];

      for (let key in requirements) {
        let isDefined = requirements[key];
        if (!isDefined) {
          extra.push(key);
        }
      }

      if (extra.length > 1) {
        output.error = {
          "errorMessage": "Required functions are not defined",
          "extra": extra
        };
        output.stopFollowingTests = true;
      }

      return output;
    };
  }

  /**
   * Generates test to test if assert is true
   * @param {string} testName - Name of test
   * @param {string} errorMessage - Error message if false
   * @param {boolean} stopFollowingTests - Whether to stop following tests after
   * @param {boolean} assertResult - Result of assert
   * @param {JSON} extra - Extra error messages
   * @returns {function} - Test to run
   */
  function testAssert(testName, errorMessage, stopFollowingTests, assertResult, extra) {
    return () => {
      let output = {
        "name": testName
      };

      if (!assertResult) {
        output.error = {
          "errorMessage": errorMessage
        };
        output.error.extra = extra;
        output.stopFollowingTests = stopFollowingTests;
      }
      return output;
    };
  }

  /**
   * Checks for Set equality
   * @param {Set} set - Original set
   * @param {Set} subset - Subset to compare
   * @returns {boolean} - If sets are equal
   */
  function isSubset(set, subset) {
    for (let element of set) {
      if (!subset.has(element)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Checks if card is equal to given attributes
   * @param {DOMElement} card - Card element to test
   * @param {array} attributes - Array of attribute strings to test
   * @returns {JSON} - JSON formatted error response.
   */
  function eqCard(card, attributes) {
    if (card.children.length !== parseInt(attributes[3])) {
      return {
        "errorMessage": "Incorrect number of DOM children in card",
        "extra": ["Your Card:", card, "Expected Attributes:", attributes.join("-")]
      };
    }
    if (card.tagName !== "DIV") {
      return {
        "errorMessage": "Card is not constructed with a div element",
        "extra": ["Your Card:", card, "Expected Attributes:", attributes.join("-")]
      };
    }
    for (let child of card.children) {
      if (child.tagName !== "IMG") {
        return {
          "errorMessage": "Card does not contain img elements",
          "extra": ["Your Card:", card, "Expected Attributes:", attributes.join("-")]
        };
      }
      if (!child.src.includes("imgs/" + attributes.slice(0, 3).join("-") + ".png")) {
        return {
          "errorMessage": "Image path incorrect",
          "extra": ["Your Card:", card, "Expected Attributes:", attributes.join("-")]
        };
      }
      if (child.alt.toLowerCase() !== attributes.join("-")) {
        return {
          "errorMessage": "Image alt attribute does not match card attributes format",
          "extra": ["Your Card:", card, "Expected Attributes:", attributes.join("-")]
        };
      }
    }
    if (card.id !== attributes.join("-")) {
      return {
        "errorMessage": "ID does not match attributes format",
        "extra": ["Your Card:", card, "Expected Attributes:", attributes.join("-")]
      };
    }
    if (!card.classList.contains("card")) {
      return {
        "errorMessage": "Card does not have the correct 'card' class on it",
        "extra": ["Your Card:", card, "Expected Attributes:", attributes.join("-")]
      };
    }
    if (card.classList.contains("selected")) {
      return {
        "errorMessage": "Card should not start out selected",
        "extra": ["Your Card:", card, "Expected Attributes:", attributes.join("-")]
      };
    }
    return true;
  }

  /**
   * Replaces original generateRandomAttributes() with dummy one
   * @param {array} attributesList - Array of attribute arrays to test return in dummy function.
   */
  function replaceGenerateRandomAttributeRandom(attributesList) {
    if (typeof generateRandomAttributes !== "undefined") {
      let currentAttributeIndex = 0;
      generateRandomAttributes = () => {
        return attributesList[currentAttributeIndex++];
      };
    }
  }

  /**
   * Parses time from #time on #board and returns converted result
   * @returns {JSON} - Formatted time result.
   */
  function parseTime() {
    let time = document.getElementById("time").innerText;
    if (/^([0-5][0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.exec(time) === null) {
      return false;
    }
    let splitTime = time.split(":");
    let secs = parseInt(splitTime[1]);
    let mins = parseInt(splitTime[0]);
    return {
      seconds: secs,
      minutes: mins,
      total: secs + 60 * mins
    };
  }

  /* ********************************* MILESTONE TESTS ********************************* */

  /* --------------------------------- INTEGRATION TESTS --------------------------------- */

  /**
   * Tests that the clicking start view works.
   * @returns {JSON} - Test results JSON.
   */
  function testStartView() {
    let testFunctions = [];

    testFunctions.push(() => {
      let output = {
        "name": "Testing initialization."
      };

      dispatchEvent(new Event('load'));

      let startBtnID = "start-btn";
      let startBtn = document.getElementById(startBtnID);
      if (!startBtn) {
        output.error = {
          "errorMessage": "Start button with ID " + startBtnID + " doesn't exist"
        };
      }

      return output;
    });

    testFunctions.push(() => {
      let output = {
        "name": "Testing before #start-btn click."
      };

      // Before click
      if (document.getElementById("menu-view").classList.contains("hidden")) {
        output.error = {
          "errorMessage": "#menu-view does not start out without .hidden class"
        };
        return output;
      }
      if (!document.getElementById("game-view").classList.contains("hidden")) {
        output.error = {
          "errorMessage": "#game-view does not start out with .hidden class"
        };
        return output;
      }

      return output;
    });

    testFunctions.push(() => {
      let output = {
        "name": "Testing after #start-btn click."
      };

      document.getElementById("start-btn").click();

      // After first click
      if (!document.getElementById("menu-view").classList.contains("hidden")) {
        output.error = {
          "errorMessage": "#menu-view does not have .hidden class after first toggle"
        };
        return output;
      }
      if (document.getElementById("game-view").classList.contains("hidden")) {
        output.error = {
          "errorMessage": "#game-view has .hidden class after first toggle"
        };
        return output;
      }

      return output;
    });

    return testFunctions;
  }

  /**
   * Tests that the clicking back works.
   * @returns {JSON} - Test results JSON.
   */
  function testBackView() {
    let testFunctions = [];

    testFunctions.push(() => {
      let output = {
        "name": "Testing initialization."
      };

      dispatchEvent(new Event('load'));

      let startBtnID = "start-btn";
      let startBtn = document.getElementById(startBtnID);
      if (!startBtn) {
        output.error = {
          "errorMessage": "Start button with ID " + startBtnID + " doesn't exist"
        };
        return output;
      }

      let backBtnID = "back-btn";
      let backBtn = document.getElementById(backBtnID);
      if (!backBtn) {
        output.error = {
          "errorMessage": "Back button with ID " + backBtnID + " doesn't exist"
        };
        return output;
      }

      return output;
    });

    testFunctions.push(() => {
      let output = {
        "name": "Testing initial state."
      };

      // Before click
      if (document.getElementById("menu-view").classList.contains("hidden")) {
        output.error = {
          "errorMessage": "#menu-view does not start out without .hidden class"
        };
        return output;
      }
      if (!document.getElementById("game-view").classList.contains("hidden")) {
        output.error = {
          "errorMessage": "#game-view does not start out with .hidden class"
        };
        return output;
      }

      return output;
    });

    testFunctions.push(() => {
      let output = {
        "name": "Testing after #start-btn click."
      };

      document.getElementById("start-btn").click();

      // After start click
      if (!document.getElementById("menu-view").classList.contains("hidden")) {
        output.error = {
          "errorMessage": "#menu-view does not have .hidden class after first toggle"
        };
        return output;
      }
      if (document.getElementById("game-view").classList.contains("hidden")) {
        output.error = {
          "errorMessage": "#game-view has .hidden class after first toggle"
        };
        return output;
      }

      return output;
    });

    testFunctions.push(() => {
      let output = {
        "name": "Testing after #start-btn click."
      };

      document.getElementById("back-btn").click();

      // After back click
      if (document.getElementById("menu-view").classList.contains("hidden")) {
        output.error = {
          "errorMessage": "#menu-view has .hidden class after second toggle"
        };
        return output;
      }
      if (!document.getElementById("game-view").classList.contains("hidden")) {
        output.error = {
          "errorMessage": "#game-view does not have .hidden class after second toggle"
        };
        return output;
      }

      return output;
    });

    return testFunctions;
  }

  /* --------------------------------- STYLE TESTS --------------------------------- */

  /**
   * Tests that the given styles haven't been overwritten or changed.
   * @returns {JSON} - Test results JSON.
   */
  function testGivenStyles() {
    let testFunctions = [];

    testFunctions.push(() => {
      let testOutput = {
        "name": "Testing given font family styles on all elements."
      };
      testOutput.error = Tester.checkStyle(
        document.querySelectorAll("header *, main *"),
        "font-family",
        "Helvetica, Verdana, sans-serif",
        "'font-family: Helvetica, Verdana, sans-serif' is not applied to all elements"
      );
      return testOutput;
    });

    testFunctions.push(() => {
      let testOutput = {
        "name": "Testing given text-align center styles on all elements."
      };
      testOutput.error = Tester.checkStyle(
        document.querySelectorAll("header *, main *"),
        "text-align",
        "center",
        "'text-align: center' is not applied to all elements"
      );
      return testOutput;
    });

    testFunctions.push(() => {
      let testOutput = {
        "name": "Testing font-size 12pt on all elements besides header tags"
      };
      testOutput.error = Tester.checkStyle(
        document.querySelectorAll(`header *:not(h2):not(h1), #menu-view *:not(h2):not(h1),
          select, input, button`),
        "font-size",
        16,
        "'font-size: 12pt' is not applied to all elements"
      );
      return testOutput;
    });

    testFunctions.push(() => {
      let testOutput = {
        "name": "Testing font-size 16pt on all h2 elements"
      };
      testOutput.error = Tester.checkStyle(
        document.querySelectorAll("h2"),
        "font-size",
        21.3333,
        "'font-size: 16pt' is not applied to all 'h2' elements"
      );
      return testOutput;
    });

    testFunctions.push(() => {
      let testOutput = {
        "name": "Testing underline text-decoration on all h2 elements"
      };
      testOutput.error = Tester.checkStyle(
        document.querySelectorAll("h2"),
        "text-decoration",
        "underline",
        "'text-decoration: underlined' is not applied to all 'h2' elements",
        true
      );
      return testOutput;
    });

    testFunctions.push(() => {
      let testOutput = {
        "name": "Testing padding of 8px on all button and select elements"
      };
      testOutput.error = Tester.checkStyle(
        document.querySelectorAll("button"),
        "padding",
        "8px",
        "'padding: 8px' is not applied to all button and select elements"
      );
      return testOutput;
    });

    testFunctions.push(() => {
      let testOutput = {
        "name": "Testing background-color set to white on all button and select elements"
      };
      testOutput.error = Tester.checkStyle(
        document.querySelectorAll("button, select"),
        "background-color",
        "rgb(255, 255, 255)",
        "'background-color: white' is not applied to all button and select elements"
      );
      return testOutput;
    });

    testFunctions.push(() => {
      let testOutput = {
        "name": "Testing border set to 2pt solid black set on all button and select elements"
      };
      testOutput.error = Tester.checkStyle(
        document.querySelectorAll("button, select"),
        "border",
        [2.65625, "solid", "rgb(0, 0, 0)"],
        "'border: 2pt solid black' is not applied to all button and select elements"
      );
      return testOutput;
    });

    testFunctions.push(() => {
      let testOutput = {
        "name": "Testing main container width set to 80%"
      };
      testOutput.error = Tester.checkStyle(
        document.querySelector("main"),
        "width",
        "80%",
        "'width: 80%' is not applied to main element"
      );
      return testOutput;
    });

    testFunctions.push(() => {
      let testOutput = {
        "name": "Testing main margin set to auto"
      };
      testOutput.error = Tester.checkStyle(
        document.querySelector("main"),
        "margin",
        "auto",
        "'margin: auto' is not applied to main element"
      );
      return testOutput;
    });

    testFunctions.push(() => {
      let testOutput = {
        "name": "Testing start button width set to 100px"
      };
      testOutput.error = Tester.checkStyle(
        document.getElementById("start-btn"),
        "width",
        "100px",
        "'width: 100px' is not applied to start button element"
      );
      return testOutput;
    });

    testFunctions.push(() => {
      let testOutput = {
        "name": "Testing start button margin-top set to 10px"
      };
      testOutput.error = Tester.checkStyle(
        document.getElementById("start-btn"),
        "margin-top",
        "10px",
        "'margin-top: 10px' is not applied to start button element"
      );
      return testOutput;
    });

    testFunctions.push(() => {
      let testOutput = {
        "name": "Testing start button margin-bottom set to 20px"
      };
      testOutput.error = Tester.checkStyle(
        document.getElementById("start-btn"),
        "margin-bottom",
        "20px",
        "'margin-bottom: 20px' is not applied to start button element"
      );
      return testOutput;
    });

    testFunctions.push(() => {
      let testOutput = {
        "name": "Testing background-color is set to #6F77ED on #menu-view article element"
      };
      testOutput.error = Tester.checkStyle(
        document.querySelector("#menu-view > article"),
        "background-color",
        "rgb(111, 119, 237)",
        "'background-color: #6F77ED' is not applied to #menu-view article element"
      );
      return testOutput;
    });

    testFunctions.push(() => {
      let testOutput = {
        "name": "Testing border-radius set to 5.6px on #menu-view article element"
      };
      testOutput.error = Tester.checkStyle(
        document.querySelector("#menu-view > article"),
        "border-radius", "5.6px",
        `'border-radius: 0.35em' is not applied to #menu-view article element or font-size
          of #menu-view is not correct`
      );
      return testOutput;
    });

    testFunctions.push(() => {
      let testOutput = {
        "name": "Testing border set to 5pt solid black on #menu-view article element"
      };
      testOutput.error = Tester.checkStyle(
        document.querySelector("#menu-view > article"),
        "border",
        [6.65625, "solid", "rgb(0, 0, 0)"],
        "'border: 5pt solid black' is not applied to #menu-view article element"
      );
      return testOutput;
    });

    testFunctions.push(() => {
      let testOutput = {
        "name": "Testing color set to white on #menu-view article element"
      };
      testOutput.error = Tester.checkStyle(
        document.querySelector("#menu-view > article"),
        "color",
        "rgb(255, 255, 255)",
        "color not set to white on #menu-view article element"
      );
      return testOutput;
    });

    return testFunctions;
  }

  /**
   * Tests that the new styles are correct on the board.
   * @returns {JSON} - Test results JSON.
   */
  function testBoardStyles() {
    let testFunctions = [];

    testFunctions.push(() => {
      let testOutput = {
        "name": "Testing flex on cards, details-bar, and board."
      };
      testOutput.error = Tester.checkStyle(
        document.querySelectorAll(".card, #details-bar, #board"),
        "display",
        "flex",
        "flex is not applied to all cards, the details bar, and the board"
      );
      return testOutput;
    });

    testFunctions.push(() => {
      let testOutput = {
        "name": "Testing space-evenly justify-content on cards, details-bar, and board."
      };
      testOutput.error = Tester.checkStyle(
        document.querySelectorAll(".card, #details-bar, #board"),
        "justify-content",
        "space-evenly",
        "elements are spaced evenly horizontally in the cards, the details bar, or the board"
      );
      return testOutput;
    });

    testFunctions.push(() => {
      let testOutput = {
        "name": "Testing center align-items on cards and details-bar."
      };
      testOutput.error = Tester.checkStyle(
        document.querySelectorAll(".card, #details-bar"),
        "align-items",
        "center",
        "children are not aligned vertically in the center of cards or the details bar"
      );
      return testOutput;
    });

    testFunctions.push(() => {
      let testOutput = {
        "name": "Testing details bar color property set to white."
      };
      testOutput.error = Tester.checkStyle(
        document.getElementById("details-bar"),
        "color",
        "rgb(255, 255, 255)",
        "color is not set to white on the details bar"
      );
      return testOutput;
    });

    testFunctions.push(() => {
      let testOutput = {
        "name": "Testing details bar background color set to black."
      };
      testOutput.error = Tester.checkStyle(
        document.getElementById("details-bar"),
        "background-color", "rgb(0, 0, 0)",
        "background is not set to black on the details bar"
      );
      return testOutput;
    });

    testFunctions.push(() => {
      let testOutput = {
        "name": "Testing details bar font-size set to 14pt."
      };
      testOutput.error = Tester.checkStyle(
        document.querySelectorAll("#details-bar"),
        "font-size", 18.6667,
        "font-size is not set to 14pt on the details bar besides buttons"
      );
      return testOutput;
    });

    testFunctions.push(() => {
      let testOutput = {
        "name": "Testing top left border radius set to 0.5em."
      };
      testOutput.error = Tester.checkStyle(
        document.getElementById("details-bar"),
        "border-top-left-radius", 9.33333,
        `top left border radius is not set to 0.5em on the details bar or font-size of details bar
        is not correct`
      );
      return testOutput;
    });

    testFunctions.push(() => {
      let testOutput = {
        "name": "Testing top right border radius set to 0.5em."
      };
      testOutput.error = Tester.checkStyle(
        document.getElementById("details-bar"),
        "border-top-right-radius", 9.33333,
        `top right border radius is not set to 0.5em on the details bar or font-size of details bar
        is not correct`
      );
      return testOutput;
    });

    testFunctions.push(() => {
      let testOutput = {
        "name": "Testing cards width set to 220px."
      };
      testOutput.error = Tester.checkStyle(
        document.querySelectorAll(".card"),
        "width", "220px",
        "width is not set to 220px on the cards"
      );
      return testOutput;
    });

    testFunctions.push(() => {
      let testOutput = {
        "name": "Testing cards height set to 95px."
      };
      testOutput.error = Tester.checkStyle(
        document.querySelectorAll(".card"),
        "height", "95px",
        "height is not set to 95px on the cards"
      );
      return testOutput;
    });

    testFunctions.push(() => {
      let testOutput = {
        "name": "Testing cards border set to 0.35em solid black."
      };
      testOutput.error = Tester.checkStyle(
        document.querySelectorAll(".card"),
        "border", [5.59375, "solid", "rgb(0, 0, 0)"],
        "border is not set to 0.35em solid black on the cards or card font-size is not correct"
      );
      return testOutput;
    });

    testFunctions.push(() => {
      let testOutput = {
        "name": "Testing cards border-radius set to 1em."
      };
      testOutput.error = Tester.checkStyle(
        document.querySelectorAll(".card"),
        "border-radius",
        16,
        "border-radius is not set to 1em on the cards or card font-size is not correct"
      );
      return testOutput;
    });

    /*
     * Removed until spec is fixed
     * testFunctions.push(() => {
     *   let testOutput = {
     *     "name": "Testing cards cursor set to pointer."
     *   };
     *   testOutput.error = Tester.checkStyle(
     *     document.querySelectorAll(".card"),
     *     "cursor", "pointer",
     *     "cursor is not set to pointer on the cards"
     *   );
     *   return testOutput;
     * });
     */

    testFunctions.push(() => {
      let testOutput = {
        "name": "Testing cards top margin set to 5px."
      };
      testOutput.error = Tester.checkStyle(
        document.querySelectorAll(".card"),
        "margin-top",
        "5px",
        "top margin is not 5px on the cards"
      );
      return testOutput;
    });

    testFunctions.push(() => {
      let testOutput = {
        "name": "Testing cards bottom margin set to 5px."
      };
      testOutput.error = Tester.checkStyle(
        document.querySelectorAll(".card"),
        "margin-bottom", "5px",
        "bottom margin is not 5px on the cards"
      );
      return testOutput;
    });

    testFunctions.push(() => {
      let testOutput = {
        "name": "Testing box-shadow on cards."
      };
      testOutput.error = Tester.checkStyle(
        document.querySelectorAll(".card.selected"),
        "box-shadow", "rgb(99, 99, 99) 6px 6px 0px 0px",
        `box-shadow on the selected cards is not set to have a color of #636363 and an offset of 6px
          in each direction`
      );
      return testOutput;
    });

    testFunctions.push(() => {
      let testOutput = {
        "name": "Testing height of images on cards."
      };
      testOutput.error = Tester.checkStyle(
        document.querySelectorAll(".card img"),
        "height", "85%",
        "height on the imgs on cards is not set to 85%"
      );
      return testOutput;
    });

    testFunctions.push(() => {
      let testOutput = {
        "name": "Testing right border on #board."
      };
      testOutput.error = Tester.checkStyle(
        document.getElementById("board"),
        "border-right", [6.65625, "solid", "rgb(0, 0, 0)"],
        "the right side of the border on the board is not set to black solid 5pt"
      );
      return testOutput;
    });

    testFunctions.push(() => {
      let testOutput = {
        "name": "Testing left border on #board."
      };
      testOutput.error = Tester.checkStyle(
        document.getElementById("board"),
        "border-left", [6.65625, "solid", "rgb(0, 0, 0)"],
        "the left side of the border on the board is not set to black solid 5pt"
      );
      return testOutput;
    });

    testFunctions.push(() => {
      let testOutput = {
        "name": "Testing bottom border on #board."
      };
      testOutput.error = Tester.checkStyle(
        document.getElementById("board"),
        "border-bottom", [6.65625, "solid", "rgb(0, 0, 0)"],
        "the bottom side of the border on the board is not set to black solid 5pt"
      );
      return testOutput;
    });

    testFunctions.push(() => {
      let testOutput = {
        "name": "Testing top border on #board."
      };
      testOutput.error = Tester.checkStyle(
        document.getElementById("board"),
        "border-top", "0px none rgb(0, 0, 0)",
        "the top side of the border on the board has a border when it shouldn't"
      );
      return testOutput;
    });

    testFunctions.push(() => {
      let testOutput = {
        "name": "Testing padding on #board."
      };
      testOutput.error = Tester.checkStyle(
        document.getElementById("board"),
        "padding", "20px",
        "padding of the board is not 20px"
      );
      return testOutput;
    });

    testFunctions.push(() => {
      let testOutput = {
        "name": "Testing flex-wrap on #board."
      };
      testOutput.error = Tester.checkStyle(
        document.getElementById("board"),
        "flex-wrap", "wrap",
        "board cards are not set to wrap around"
      );
      return testOutput;
    });

    testFunctions.push(() => {
      let testOutput = {
        "name": "Testing .hidden class."
      };
      testOutput.error = Tester.checkStyle(
        document.querySelectorAll(".hidden"),
        "display", "none",
        ".hidden class is not correctly hidden"
      );
      return testOutput;
    });

    return testFunctions;
  }

  /* --------------------------------- UNIT TESTS --------------------------------- */

  /**
   * Tests the toggleView() function
   * @returns {JSON} - Test results JSON.
   */
  function testToggleView() {
    let testFunctions = [];

    testFunctions.push(testRequirements({
      "toggleView()": typeof toggleView !== "undefined"
    }));

    testFunctions.push(() => {
      let output = {
        "name": "Testing initial state"
      };

      // Before toggle
      if (document.getElementById("menu-view").classList.contains("hidden")) {
        output.error = {
          "errorMessage": "#menu-view does not start out without .hidden class"
        };
        return output;
      }
      if (!document.getElementById("game-view").classList.contains("hidden")) {
        output.error = {
          "errorMessage": "#game-view does not start out with .hidden class"
        };
        return output;
      }
      return output;
    });

    testFunctions.push(() => {
      let output = {
        "name": "Testing first call of toggleView"
      };
      toggleView();

      // After first toggle
      if (!document.getElementById("menu-view").classList.contains("hidden")) {
        output.error = {
          "errorMessage": "#menu-view does not have .hidden class after first toggle"
        };
        return output;
      }
      if (document.getElementById("game-view").classList.contains("hidden")) {
        output.error = {
          "errorMessage": "#game-view has .hidden class after first toggle"
        };
        return output;
      }
      return output;
    });

    testFunctions.push(() => {
      let output = {
        "name": "Testing second call of toggleView"
      };
      toggleView();

      // After second toggle
      if (document.getElementById("menu-view").classList.contains("hidden")) {
        output.error = {
          "errorMessage": "#menu-view has .hidden class after second toggle"
        };
        return output;
      }
      if (!document.getElementById("game-view").classList.contains("hidden")) {
        output.error = {
          "errorMessage": "#game-view does not have .hidden class after second toggle"
        };
        return output;
      }
      return output;
    });

    return testFunctions;
  }
})();
