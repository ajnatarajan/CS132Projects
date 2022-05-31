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
  function onCheckout() {
    // Will make API Calls to handle checkout
  }

  /**
   * Handle removal of item from cart.
   * No parameters. (Will change when we have API calls)
   * @returns {void}
   */
  async function onRemoveFromCart(pid) {
    try {
      let resp = await fetch(`/removeFromCart/?pid=${pid}`);
      resp = checkStatus(resp);
      resp = await resp.json();
      console.log(resp);
    } catch (err) {
      console.error(err);
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
      onRemoveFromCart(info.pid);
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
      console.error(err);
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
        console.error(err);
      }
      for (let j = 0; j < data[keys[i]].quantity; j++) {
        makeCard(info[pid]);
      }
    }
  }

  init();
})();
