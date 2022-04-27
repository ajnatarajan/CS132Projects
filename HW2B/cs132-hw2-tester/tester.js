/**
 * Functionality for Testing UI used in HW2 Tester.
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
  no-prototype-builtins: 0
*/
"use strict";
class Tester {
  constructor(javascriptPath, runTests, resetCustom) {
    // Checks to see if locally hosted on just opened in broswer.
    window.addEventListener("load", () => {
      if (location.hostname === "localhost" || location.hostname === "127.0.0.1" ||
          location.hostname === "192.168.0.106") {
        this.loadAndRunJavascript();
      } else {
        document.getElementById("tester-input").classList.remove("no-show");
        document.getElementById("run-tests").addEventListener("click", () => {
          this.uploadedJavascriptRun();
        });
      }
    });

    this.runTests = runTests;
    this.oldBody = null;
    this.resetCustom = resetCustom;
    this.clock = null;
    this.loadedJavascript = false;
  }

  /** Loads Javascript file, removes module-pattern, and executes it */
  loadAndRunJavascript() {
    if (!this.loadedJavascript) {
      fetch("../set.js", {mode: "no-cors"})
        .then(Tester.checkStatus)
        .then((res) => {
          this.processAndRunJavascript(res);
        })
        .catch(console.error);
    }
  }

  /** Loads chosen Javascript file */
  uploadedJavascriptRun() {
    let mySetJS = document.getElementById("my-set-js").files[0];
    const reader = new FileReader();
    reader.addEventListener("load", (response) => {
      this.processAndRunJavascript(response.target.result);
    });
    reader.readAsText(mySetJS);
    document.getElementById("run-tests").textContent = "Reset";
    document.getElementById("run-tests").addEventListener("click", () => {
      location.reload();
    });
  }

  /**
   * Removes the module pattern, runs the code, and run the tests.
   * @param {string} javascript - Given javascript code.
   */
  processAndRunJavascript(javascript) {
    // Remove Module Pattern
    javascript = javascript.replace(/("|')use strict("|');/gi, "");
    javascript = javascript.replace(/\(function\s*\(\)\s*{/i, "");
    javascript = javascript.replace(/}\)\s*\(\);*/gi, "");
    javascript = javascript.replace(/alert\(.*\);/gi, "");
    javascript = javascript.replace(/let\s*timerId;*/gi, "var timerId");
    javascript = javascript.replace(/let\s*secondsRemaining;*/gi, "var secondsRemaining");
    javascript = javascript.replace(/init\(\);/g, "");
    javascript += "window.addEventListener('load', init);\n";
    let geval = eval; // You should NEVER use eval() in your Javascript :)
    geval(javascript);
    this.loadedJavascript = true;
    this.oldBody = document.querySelector("main").innerHTML;

    this.runTests();
  }

  /* --------------------------------- DISPLAY FUNCTIONS --------------------------------- */

  /**
   * Displays all test results on the DOM.
   * @param {JSON} testOutput - Formatted test output.
   */
  static displayDomTest(testOutput) {
    let container = document.getElementById("tester-output");
    container.innerHTML = "";
    for (let section in testOutput) {
      let sectionContainer = document.createElement("section");
      let sectionHeader = document.createElement("h2");
      sectionHeader.textContent = section;
      sectionContainer.appendChild(sectionHeader);

      for (let subSection in testOutput[section]) {
        let subSectionContainer = document.createElement("section");
        let subSectionHeader = document.createElement("h3");
        subSectionHeader.textContent = subSection;
        subSectionContainer.appendChild(subSectionHeader);

        for (let test of testOutput[section][subSection]) {
          this.displayDomTestHelper(subSectionContainer, test.name, test.testResults);
        }
        sectionContainer.appendChild(subSectionContainer);
      }
      container.appendChild(sectionContainer);
    }
  }

  /**
   * Helper to display specific test output.
   * @param {DOMElement} container - Dom Element of the container.
   * @param {string} name - Name of test.
   * @param {JSON} testResults - JSON formatted test results.
   */
  static displayDomTestHelper(container, name, testResults) {
    let overallTestDetails = document.createElement("details");
    let overallTestSummary = document.createElement("summary");
    let overallTestSummarySpan = document.createElement("span");
    let allPassed = true;

    overallTestDetails.appendChild(overallTestSummary);
    overallTestSummary.textContent = name;

    for (let testResult of testResults) {
      let singleTestDetails = document.createElement("details");
      let singleTestSummary = document.createElement("summary");

      singleTestDetails.appendChild(singleTestSummary);

      if (!testResult.error) {
        singleTestSummary.textContent = testResult.name;
        singleTestSummary.classList.add("passed");

        let testSuccessMessage = document.createElement("p");
        testSuccessMessage.textContent = "Test Passed";
        singleTestDetails.appendChild(testSuccessMessage);
      } else {
        allPassed = false;

        singleTestSummary.textContent = testResult.name;
        singleTestSummary.classList.add("error");
        singleTestDetails.open = true;

        let testErrorMessage = document.createElement("p");
        testErrorMessage.textContent = "Error Message: " + testResult.error.errorMessage;
        singleTestDetails.appendChild(testErrorMessage);

        if (testResult.error.extra) {
          for (let extraOutput of testResult.error.extra) {
            let testExtraMessage = document.createElement("p");
            if (extraOutput && extraOutput.tagName) {
              testExtraMessage.textContent = extraOutput.outerHTML;
            } else {
              testExtraMessage.innerHTML = extraOutput;
            }
            singleTestDetails.appendChild(testExtraMessage);
          }
        }
      }

      overallTestDetails.append(singleTestDetails);
    }

    if (allPassed) {
      overallTestSummarySpan.textContent = "Tests: Passed";
      overallTestSummary.classList.add("passed");
    } else {
      overallTestSummarySpan.textContent = "Tests: Failed";
      overallTestSummary.classList.add("error");
      overallTestDetails.open = true;
    }

    overallTestSummary.appendChild(overallTestSummarySpan);

    container.appendChild(overallTestDetails);
  }

  /**
   * Displays all tests in console.
   * @param {JSON} testOutput - Formatted test output.
   */
  static consoleLogTest(testOutput) {
    console.clear();
    for (let section in testOutput) {
      console.group(section);
      for (let subSection in testOutput[section]) {
        console.group(subSection);
        for (let test of testOutput[section][subSection]) {
          Tester.consoleLogTestHelper(test.name, test.result);
        }
        console.groupEnd();
      }
      console.groupEnd();
    }
  }

  /**
   * Helper to display specific test output.
   * @param {string} name - Name of test.
   * @param {JSON} testResult - JSON formatted test result.
   */
  static consoleLogTestHelper(name, testResult) {
    if (testResult && testResult["passed"]) {
      console.log("%c" + name + " Test: Passed", "background: green; color: white");
    } else if (testResult) {
      console.group("%c" + name + " Test: Failed", "background: red; color: white");
      if (testResult["extra"]) {
        console.group("Error Message: " + testResult["error"]);
        for (let extraOutput of testResult["extra"]) {
          console.log(extraOutput);
        }
        console.groupEnd();
      } else {
        console.log("Error Message: " + testResult["error"]);
      }
      console.groupEnd();
    }
  }

  /* --------------------------------- DISPLAY FUNCTIONS --------------------------------- */

  /**
   * Style-checking function
   * @param {DOMElement/List} element - Element to test for style.
   * @param {string} property - CSS property to test.
   * @param {string} expected - Expected CSS property value.
   * @param {string} errorMessage - Error message output.
   * @param {boolean} checkIncludes - If true, check if expected is in value, otherwise check for
   * equality.
   * @returns {JSON} - Test results JSON.
   */
  static checkStyle(element, property, expected, errorMessage, checkIncludes) {
    if (NodeList.prototype.isPrototypeOf(element)) {
      if (element.length === 0) {
        return {
          "errorMessage": "Elements being tested for style do not exist, so cannot check style."
        };
      }
      for (let el of element) {
        let result = this.checkStyleHelper(el, property, expected, errorMessage, checkIncludes);
        if (result) {
          return result;
        }
      }
    } else {
      return this.checkStyleHelper(element, property, expected, errorMessage, checkIncludes);
    }
  }

  /**
   * Style-checking function helper
   * @param {DOMElement/List} element - Element to test for style.
   * @param {string} property - CSS property to test.
   * @param {string} expected - Expected CSS property value.
   * @param {string} errorMessage - Error message output.
   * @param {boolean} checkIncludes - If true, check if expected is in value, otherwise check for
   * equality.
   * @returns {JSON} - Test results JSON.
   */
  static checkStyleHelper(element, property, expected, errorMessage, checkIncludes) {
    let value = window.getComputedStyle(element).getPropertyValue(property);
    if (Array.isArray(expected)) {
      value = value.split(/ (?!\d)/);
      if (value.length !== expected.length) {
        return {
          "errorMessage": errorMessage,
          "extra": ["Expected value: " + expected, "Value: " + value.join(" "), "Tag:", element]
        };
      }
      for (let i = 0; i < expected.length; i++) {
        if (typeof (expected[i]) === "number") {
          if (!this.numbersNear(parseFloat(value[i]), expected[i])) {
            return {
              "errorMessage": errorMessage,
              "extra": ["Expected value: " + expected, "Value: " + value, "Tag:", element]
            };
          }
        } else if (value[i] !== expected[i] && !(checkIncludes && value[i].includes(expected[i]))) {
          return {
            "errorMessage": errorMessage,
            "extra": ["Expected value: " + expected, "Value: " + value, "Tag:", element]
          };
        }
      }
    } else {
      if (typeof expected === "number") {
        if (!this.numbersNear(parseFloat(value), expected)) {
          return {
            "errorMessage": errorMessage,
            "extra": ["Expected value: " + expected, "Value: " + value, "Tag:", element]
          };
        }
      } else if (value !== expected && !(checkIncludes && value.includes(expected))) {
        return {
          "errorMessage": errorMessage,
          "extra": ["Expected value: " + expected, "Value: " + value, "Tag:", element]
        };
      }
    }
    return false;
  }

  /**
   * Check if values are "near" (within 0.1 error margin).
   * @param {number} value - Value to test.
   * @param {number} expected - Expected value.
   * @returns {boolean} - True if near equal, false otherwise.
   */
  static numbersNear(value, expected) {
    return Math.abs(value - expected) < 0.1;
  }

  /* --------------------------------- HELPER FUNCTIONS --------------------------------- */

  /**
   * Runs a particular test.
   * @param {string} testName - Name of test
   * @param {function} testFunc - Function to run and test.
   * @returns {JSON} - Test results JSON.
   */
  runTest(testName, testFunc) {
    let output = {};
    output.name = testName;
    output.testResults = [];
    let allTests = testFunc();

    for (let test of allTests) {
      try {
        let result = test();
        output.testResults.push(result);
        if (result.stopFollowingTests) {
          break;
        }
      } catch (exception) {
        output.testResults.push({
          "name": "Execution Error In Test (Sometimes due to previous tests failing)",
          "error": {
            "errorMessage": "Failed to run test (Make sure all preceding tests are passing)",
            "extra": [
              "Stack Trace:",
              exception.stack.replace(/(<|>)/g, "").replace(/at /g, "<br>at ")
            ]
          }
        });
      }
    }

    if (this.clock) {
      this.clock.reset();
      this.clock.uninstall();
      this.clock = null;
    }
    this.resetBody();
    if (this.resetCustom) {
      this.resetCustom();
    }

    return output;
  }

  /**
   * Resets the main element to the original.
   */
  resetBody() {
    document.querySelector("main").innerHTML = this.oldBody;
  }

  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} response - response to check for success/error
   * @return {object} - valid result text if response was successful, otherwise rejected
   *                    Promise result
   */
  static checkStatus(response) {
    const STATUS_GOOD = 200;
    const STATUS_BAD = 300;
    if (response.status >= STATUS_GOOD && response.status < STATUS_BAD || response.status === 0) {
      return response.text();
    }
    return Promise.reject(new Error(response.status + ": " + response.statusText));
  }
}
