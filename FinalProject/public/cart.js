/*
  Name: Ajay Natarajan
  CS 132 Spring 2022
  Date: May 31st, 2022
  This is the cart.js for my gaming and anime e-commerce site which is serving
  as my final project for CS 132. It handles all things related to the cart - 
  displaying which products are in the cart, allowing the user to remove items 
  from the cart, and checking out.
 */

(function () {
  "use strict";

  /**
   * Initialize all necessary event listeners and update products in cart.
   * No parameters.
   * @returns {void}
   */
  function init() {
    qs("#checkout > button").addEventListener("click", onCheckout);
    populateCart();
  }

  /**
   * Get all items in cart. Throws error if API call fails
   * No parameters.
   * @returns {JSON} - items in cart
   */
  async function getCart() {
    let resp = await fetch("/cart");
    resp = checkStatus(resp);
    resp = await resp.json();
    return resp;
  }

  /**
   * Create the message to be displayed upon checkout
   * No parameters.
   * @returns {Element} errormsg - the constructed error message for checkout
   */
  function makeCheckoutMsg() {
    let checkoutMsg = qs(".error-msg");
    if (checkoutMsg) {
      checkoutMsg.remove();
    }
    checkoutMsg = gen("p");
    checkoutMsg.classList.add("error-msg");
    checkoutMsg.textContent = "Error with checking out. Try again later.";
    return checkoutMsg;
  }

  /**
   * Throws error if not enough stock for any product to satisfy order request
   * @param {JSON} resp - fetched data for the product in question
   * @returns {void}
   */
  async function checkEnoughStock(resp) {
    for (let i = 0; i < Object.keys(resp).length; i++) {
      let data = resp[Object.keys(resp)[i]];
      let enoughStock = await fetch(
        `/isEnoughStock?pid=${data.pid}&qty=${data.quantity}`
      );
      enoughStock = checkStatus(enoughStock);
      enoughStock = await enoughStock.json();
      if (!enoughStock.isEnoughStock) {
        throw Error;
      }
    }
  }

  /**
   * Reduce stock for all products in cart by proper quantities upon checkout.
   * @param {JSON} resp - products and quantities in cart
   * @returns {void}
   */
  async function reduceStock(resp) {
    for (let i = 0; i < Object.keys(resp).length; i++) {
      let data = resp[Object.keys(resp)[i]];
      let reduceResp = await fetch("/reduceStock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pid: data.pid,
          qty: data.quantity,
        }),
      });
      reduceResp = checkStatus(reduceResp);
      reduceResp = await reduceResp.json();
    }
  }

  /**
   * Updates the last sold time for all items in cart to now.
   * @param {JSON} resp - products and quantities in cart
   * @returns {void}
   */
  async function updateLastSold(resp) {
    for (let i = 0; i < Object.keys(resp).length; i++) {
      let data = resp[Object.keys(resp)[i]];
      let lastSoldResp = await fetch("/updateLastSold", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pid: data.pid,
        }),
      });
      lastSoldResp = checkStatus(lastSoldResp);
      lastSoldResp = await lastSoldResp.json();
    }
  }

  /**
   * Clear cart
   * No parameters.
   * @returns {void}
   */
  async function clearCart() {
    let clearResp = await fetch("/clearCart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    clearResp = checkStatus(clearResp);
    clearResp = await clearResp.json();
  }

  /**
   * Handle checkout - check that all products have enough stock to satisfy
   * order, reduce the remaining stock appropriately, update last sold times
   * for all products in cart, and clear the cart.
   * No parameters.
   * @returns {void}
   */
  async function onCheckout() {
    // NB: I made helper functions since spec says to break up functions more
    // than 30 lines long, but I want to return from this function if I ever
    // end up in a catch clause (since the rest should not execute). As a
    // result, I keep the try-catch logic for each helper function in here and
    // thus the body is over 30 lines long but I think it's alright since I've
    // already factored out as much as I can.

    /* Format error message */
    let errorMsg = makeCheckoutMsg();

    /* Get items in cart */
    let resp;
    try {
      resp = await getCart();
    } catch (err) {
      id("checkout").appendChild(errorMsg);
      return;
    }

    /* Check if we have enough stock to satisfy all items in cart */
    try {
      await checkEnoughStock(resp);
    } catch (err) {
      errorMsg.textContent = "Insufficient stock to satisfy your request.";
      id("checkout").appendChild(errorMsg);
      return;
    }

    /* Reduce the stock remaining */
    try {
      await reduceStock(resp);
    } catch (err) {
      id("checkout").appendChild(errorMsg);
      return;
    }

    /* Update last sold time */
    try {
      await updateLastSold(resp);
    } catch (err) {
      id("checkout").appendChild(errorMsg);
      return;
    }

    /* Clear the cart and display message for user indicating purchase */
    try {
      await clearCart();
    } catch (err) {
      id("checkout").appendChild(errorMsg);
      return;
    }

    errorMsg.textContent = "Successfully checked out!";
    id("checkout").appendChild(errorMsg);

    /* Update cart display */
    populateCart();
  }

  /**
   * Handle removal of item from cart.
   * @param {int} pid - id of the product being removed
   * @param {Element} parent - parent to attach potential error messages to
   * @returns {void}
   */
  async function onRemoveFromCart(pid, parent) {
    try {
      let resp = await fetch("/removeFromCart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pid: pid,
        }),
      });
      resp = checkStatus(resp);
      resp = await resp.json();
    } catch (err) {
      let errorMsg = qs(".card-container > p");
      if (errorMsg) {
        errorMsg.remove();
      }
      errorMsg = gen("p");
      errorMsg.textContent = "Error. Try later.";
      parent.appendChild(errorMsg);
      return;
    }
    populateCart();
  }

  /**
   * Create a product card in the cart.
   * @param {JSON} info - relevant product data fetched from an API
   * @returns {void}
   */
  async function makeCard(info) {
    let cardContainer = gen("div");
    cardContainer.classList.add("card-container");
    /* Create card and add to container */
    let card = gen("div");
    let image = gen("img");
    /* NB: I'm using camel case here since it's from my DB and I'm just 
    following the convention established in setup-oh.sql which was an example
    file given in lecture. I have removed all other camel case variables in my
    JS code though.
    */
    image.src = "imgs/" + info.image_name;
    image.alt = info.title + " Preview Image";
    let text = gen("p");
    text.textContent = info.title;

    card.classList.add("product-card");
    image.classList.add("card-img");

    card.appendChild(image);
    card.appendChild(text);

    cardContainer.appendChild(card);

    /* Create remove button and add to container */
    let removeButton = gen("button");
    removeButton.textContent = "Remove from Cart";
    removeButton.addEventListener("click", () => {
      onRemoveFromCart(info.pid, cardContainer);
    });
    cardContainer.appendChild(removeButton);

    id("products").appendChild(cardContainer);
  }

  /**
   * Update what products to show in the cart
   * No parameters.
   * @returns {void}
   */
  async function populateCart() {
    // Remove any product elements currently on this page
    const products = id("products");
    while (products.firstChild) {
      products.removeChild(products.lastChild);
    }

    // Get all products in cart
    let data;
    try {
      data = await getCart();
    } catch (err) {
      let errorMsg = gen("p");
      errorMsg.textContent =
        "Store is currently down. Please visit again later";
      id("products").appendChild(errorMsg);
      return;
    }

    // Get more information about each individual product
    let keys = Object.keys(data);
    keys.sort((e) => parseInt(e));
    for (let i = 0; i < keys.length; i++) {
      let info;
      let pid = data[keys[i]].pid;
      try {
        let resp = await fetch(`/info?pid=${pid}`);
        resp = checkStatus(resp);
        info = await resp.json();
      } catch (err) {
        let errorMsg = gen("p");
        errorMsg.textContent =
          "Store is currently down. Please visit again later";
        id("products").appendChild(errorMsg);
        return;
      }

      // Make product card
      for (let j = 0; j < data[keys[i]].quantity; j++) {
        makeCard(info[pid]);
      }
    }
  }

  init();
})();
