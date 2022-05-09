(function () {
  "use strict";
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

  function makeModal(title, img_path) {
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
    stock.textContent = "Stock Remaining: 35";
    let category = document.createElement("p");
    category.textContent = "Category: League of Legends";
    let last_sold = document.createElement("p");
    last_sold.textContent = "Last Sold: May 9, 2022";
    let add_to_cart = document.createElement("button");
    add_to_cart.textContent = "Add to Cart";
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

  function makeCard(title, img_path) {
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

    const modal = makeModal(title, img_path);
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
      if (!TITLES[i].includes(search_query)) {
        continue;
      }

      if (dropdown_query !== "All" && !TITLES[i].includes(dropdown_query)) {
        continue;
      }

      makeCard(TITLES[i], IMGS[i]);
    }
  }

  init();
})();
