(function () {
  "use strict";
  // Anywhere IMGS is used, we will replace with an API Call
  const IMGS = [
    "lol10.jpg",
    "lol25.jpg",
    "lol50.jpg",
    "lol100.jpg",
    "valorant10.jpg",
    "valorant25.jpg",
    "valorant50.jpg",
    "valorant100.jpg",
    "crunchyroll25.jpg",
    "hulu25.jpg",
    "hulu50.jpg",
    "hulu100.jpg",
    "netflix15.jpg",
    "netflix30.jpg",
    "netflix50.jpg",
  ];

  // Anywhere TITLES is used, we will replace with an API Call
  const TITLES = [
    "League of Legends $10 Gift Card",
    "League of Legends $25 Gift Card",
    "League of Legends $50 Gift Card",
    "League of Legends $100 Gift Card",
    "Valorant $10 Gift Card",
    "Valorant $25 Gift Card",
    "Valorant $50 Gift Card",
    "Valorant $100 Gift Card",
    "Crunchyroll $25 Gift Card",
    "Hulu $25 Gift Card",
    "Hulu $50 Gift Card",
    "Hulu $100 Gift Card",
    "Netflix $15 Gift Card",
    "Netflix $30 Gift Card",
    "Netflix $50 Gift Card",
  ];

  // Anywhere CATEGORIES is used, we will replace with an API Call
  const CATEGORIES = [
    "League of Legends",
    "League of Legends",
    "League of Legends",
    "League of Legends",
    "Valorant",
    "Valorant",
    "Valorant",
    "Valorant",
    "Crunchyroll",
    "Hulu",
    "Hulu",
    "Hulu",
    "Netflix",
    "Netflix",
    "Netflix",
  ];

  /**
   * Initialize necessary event listeners and create all item cards.
   * No parameters.
   * @returns {void}
   */
  function init() {
    id("search-bar").addEventListener("input", populateProducts);
    id("dropdown").addEventListener("change", populateProducts);
    populateProducts();
  }

  /**
   * Handle opening the modal when a product card is clicked on.
   * @param {Element} modal - The modal to be opened
   * @returns {void}
   */
  function openCardModal(modal) {
    modal.classList.add("modal-open");
    const exits = modal.querySelectorAll(".modal-exit");
    for (let i = 0; i < exits.length; i++) {
      exits[i].addEventListener("click", () => {
        modal.classList.remove("modal-open");
      });
    }
  }

  /**
   * Handle adding item to cart
   * No parameters - this will change when we have APIs
   * @returns {void}
   */
  function onAddToCart() {
    // handle with API Calls
  }

  /**
   * Create a modal
   * @param {string} title - name of the product
   * @param {string} img_path - path to image of the product
   * @param {string} category_name - game or platform category
   * @returns {Element} - the modal that was just created
   */
  function makeModal(title, img_path, category_name) {
    /* Modal */
    let modal = gen("div");
    modal.classList.add("modal");

    /* Background - takes up the whole page */
    let bg = gen("div");
    bg.classList.add("modal-bg", "modal-exit");

    /* The actual modal pop up */
    let container = gen("div");
    container.classList.add("modal-container");

    /* Make heading */
    let heading = gen("h3");
    heading.textContent = title;
    container.appendChild(heading);

    /* Make body */
    let info = gen("section");

    /* Make image */
    let image = gen("img");
    image.src = "imgs/" + img_path;
    image.alt = title + " Image";
    info.appendChild(image);

    /* Make text info */
    let text_info = gen("div");
    let stock = gen("p");
    stock.textContent = "Stock Remaining: 35"; // Will be replaced with API Call
    let category = gen("p");
    category.textContent = "Category: " + category_name;
    let last_sold = gen("p");
    last_sold.textContent = "Last Sold: May 9, 2022"; // Will be replaced with API Call
    let add_to_cart = gen("button");
    add_to_cart.textContent = "Add to Cart";
    // im using an arrow function here since we will pass arguments when we use API call
    add_to_cart.addEventListener("click", () => {
      onAddToCart();
    });
    text_info.appendChild(stock);
    text_info.appendChild(category);
    text_info.append(last_sold);
    text_info.append(add_to_cart);
    info.append(text_info);

    /* Add close button */
    let close_button = gen("button");
    close_button.classList.add("modal-close", "modal-exit");
    close_button.textContent = "X"; // X works pretty well as a close button

    container.appendChild(info);
    container.appendChild(close_button);

    modal.appendChild(bg);
    modal.appendChild(container);

    qs("body").appendChild(modal);

    return modal;
  }

  /**
   * Create a product card
   * @param {string} title - name of the product
   * @param {string} img_path - path to image of the product
   * @param {string} category - game or platform category
   * @returns {void}
   */
  function makeCard(title, img_path, category) {
    let card = gen("div");
    let image = gen("img");
    // All images taken from corresponding platform websites.
    image.src = "imgs/" + img_path;
    image.alt = title + " Preview Image";
    let text = gen("p");
    text.textContent = title;

    card.classList.add("product-card");
    image.classList.add("card-img");

    card.appendChild(image);
    card.appendChild(text);

    id("products").appendChild(card);

    const modal = makeModal(title, img_path, category);
    card.addEventListener("click", () => openCardModal(modal));
  }

  /**
   * Update product listing based on search and dropdown filter queries
   * No parameters.
   * @return {void}
   */
  function populateProducts() {
    // Remove all products
    const products = id("products");
    while (products.firstChild) {
      products.removeChild(products.lastChild);
    }

    const search_query = id("search-bar").value;
    const dropdown_query = id("dropdown").value;
    // Add all products that pass the filter checks
    for (let i = 0; i < IMGS.length; i++) {
      if (!TITLES[i].toLowerCase().includes(search_query.toLowerCase())) {
        continue;
      }

      if (
        dropdown_query !== "All" &&
        !(dropdown_query === CATEGORIES[i]) &&
        dropdown_query !== "" // If default option, should make card
      ) {
        continue;
      }

      makeCard(TITLES[i], IMGS[i], CATEGORIES[i]);
    }
  }

  init();
})();
