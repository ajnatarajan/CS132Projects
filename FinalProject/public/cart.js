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
   * Handle checkout
   * No parameters.
   * @returns {void}
   */
  async function onCheckout() {
    /* Format error message */
    let errorMsg = qs(".error-msg");
    if (errorMsg) {
      errorMsg.remove();
    }
    errorMsg = gen("p");
    errorMsg.classList.add("error-msg");
    errorMsg.textContent = "Error with checking out. Try again later.";

    let resp;
    try {
      resp = await fetch("/cart");
      resp = checkStatus(resp);
      resp = await resp.json();
    } catch (err) {
      id("checkout").appendChild(errorMsg);
      return;
    }

    /* Check if we have enough stock */
    try {
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
    } catch (err) {
      errorMsg.textContent = "Insufficient stock to satisfy your request.";
      id("checkout").appendChild(errorMsg);
      return;
    }

    /* Reduce the stock remaining */
    try {
      for (let i = 0; i < Object.keys(resp).length; i++) {
        let data = resp[Object.keys(resp)[i]];
        let reduceResp = await fetch(
          `/reduceStock?pid=${data.pid}&qty=${data.quantity}`
        );
        reduceResp = checkStatus(reduceResp);
        reduceResp = await reduceResp.json();
      }
    } catch (err) {
      id("checkout").appendChild(errorMsg);
      return;
    }

    /* Update last sold time */
    try {
      for (let i = 0; i < Object.keys(resp).length; i++) {
        let data = resp[Object.keys(resp)[i]];
        let lastSoldResp = await fetch(`/updateLastSold?pid=${data.pid}`);
        lastSoldResp = checkStatus(lastSoldResp);
        lastSoldResp = await lastSoldResp.json();
      }
    } catch (err) {
      id("checkout").appendChild(errorMsg);
      return;
    }

    try {
      /* Clear the cart and display message for user indicating purchase */
      let clearResp = await fetch("/clearCart");
      clearResp = checkStatus(clearResp);
      clearResp = await clearResp.json();
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
   * No parameters. (Will change when we have API calls)
   * @returns {void}
   */
  async function onRemoveFromCart(pid, parent) {
    try {
      let resp = await fetch(`/removeFromCart/?pid=${pid}`);
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
   * @param {string} title - name of the product
   * @param {string} imgPath - path to the image
   * @returns {void}
   */
  async function makeCard(info) {
    let cardContainer = gen("div");
    cardContainer.classList.add("card-container");
    /* Create card and add to container */
    let card = gen("div");
    let image = gen("img");
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
   * Show the products in the cart
   * No parameters.
   * @returns {void}
   */
  async function populateCart() {
    // Remove any other elements first
    const products = id("products");
    while (products.firstChild) {
      products.removeChild(products.lastChild);
    }

    let data;
    try {
      let resp = await fetch("/cart");
      resp = checkStatus(resp);
      data = await resp.json();
    } catch (err) {
      let errorMsg = gen("p");
      errorMsg.textContent =
        "Store is currently down. Please visit again later";
      id("products").appendChild(errorMsg);
      return;
    }

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
      for (let j = 0; j < data[keys[i]].quantity; j++) {
        makeCard(info[pid]);
      }
    }
  }

  init();
})();
