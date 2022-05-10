(function () {
  "use strict";
  // Anywhere IMGS is used, we will replace with an API Call
  const IMGS = [
    "lol10.jpg",
    "valorant50.jpg",
    "crunchyroll25.jpg",
    "hulu100.jpg",
    "netflix15.jpg",
  ];

  // Anywhere TITLES is used, we will replace with an API Call
  const TITLES = [
    "League of Legends $10 Gift Card",
    "Valorant $50 Gift Card",
    "Crunchyroll $25 Gift Card",
    "Hulu $100 Gift Card",
    "Netflix $15 Gift Card",
  ];

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
  function onRemove() {
    // Will make API Calls to handle removing item
  }

  /**
   * Create a product card in the cart.
   * @param {string} title - name of the product
   * @param {string} img_path - path to the image
   * @returns {void}
   */
  function makeCard(title, img_path) {
    let card_container = gen("div");
    card_container.classList.add("card-container");
    /* Create card and add to container */
    let card = gen("div");
    let image = gen("img");
    image.src = "imgs/" + img_path;
    image.alt = title + " Preview Image";
    let text = gen("p");
    text.textContent = title;

    card.classList.add("product-card");
    image.classList.add("card-img");

    card.appendChild(image);
    card.appendChild(text);

    card_container.appendChild(card);

    /* Create remove button and add to container */
    let remove_button = gen("button");
    remove_button.textContent = "Remove from Cart";
    remove_button.addEventListener("click", onRemove);
    card_container.appendChild(remove_button);

    id("products").appendChild(card_container);
  }

  /**
   * Show the products in the cart
   * No parameters.
   * @returns {void}
   */
  function populateCart() {
    for (let i = 0; i < IMGS.length; i++) {
      makeCard(TITLES[i], IMGS[i]);
    }
  }

  init();
})();
