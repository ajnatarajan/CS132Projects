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

  function init() {
    id("search-bar").addEventListener("input", populateProducts);
    id("dropdown").addEventListener("change", populateProducts);
    populateProducts();
  }

  function openCardModal(modal) {
    modal.classList.add("modal-open");
    const exits = modal.querySelectorAll(".modal-exit");
    for (let i = 0; i < exits.length; i++) {
      exits[i].addEventListener("click", () => {
        modal.classList.remove("modal-open");
      });
    }
  }

  function onAddToCart(title) {
    // handle with API Calls
  }

  function makeModal(title, img_path, category_name) {
    /* Modal */
    let modal = document.createElement("div");
    modal.classList.add("modal");

    /* Background - takes up the whole page */
    let bg = document.createElement("div");
    bg.classList.add("modal-bg", "modal-exit");

    /* The actual modal pop up */
    let container = document.createElement("div");
    container.classList.add("modal-container");

    /* Make heading */
    let heading = document.createElement("h3");
    heading.textContent = title;
    container.appendChild(heading);

    /* Make body */
    let info = document.createElement("section");

    /* Make image */
    let image = document.createElement("img");
    image.src = "imgs/" + img_path;
    image.alt = title + " Image";
    info.appendChild(image);

    /* Make text info */
    let text_info = document.createElement("div");
    let stock = document.createElement("p");
    stock.textContent = "Stock Remaining: 35"; // Will be replaced with API Call
    let category = document.createElement("p");
    category.textContent = "Category: " + category_name;
    let last_sold = document.createElement("p");
    last_sold.textContent = "Last Sold: May 9, 2022"; // Will be replaced with API Call
    let add_to_cart = document.createElement("button");
    add_to_cart.textContent = "Add to Cart";
    add_to_cart.addEventListener("click", () => {
      onAddToCart(title);
    });
    text_info.appendChild(stock);
    text_info.appendChild(category);
    text_info.append(last_sold);
    text_info.append(add_to_cart);
    info.append(text_info);

    /* Add close button */
    let close_button = document.createElement("button");
    close_button.classList.add("modal-close", "modal-exit");
    close_button.textContent = "X"; // X works pretty well as a close button

    container.appendChild(info);
    container.appendChild(close_button);

    modal.appendChild(bg);
    modal.appendChild(container);

    document.querySelector("body").appendChild(modal);

    return modal;
  }

  function makeCard(title, img_path, category) {
    let card = document.createElement("div");
    let image = document.createElement("img");
    image.src = "imgs/" + img_path;
    image.alt = title + " Preview Image";
    let text = document.createElement("p");
    text.textContent = title;

    card.classList.add("product-card");
    image.classList.add("card-img");

    card.appendChild(image);
    card.appendChild(text);

    id("products").appendChild(card);

    const modal = makeModal(title, img_path, category);
    card.addEventListener("click", () => openCardModal(modal));
  }

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
