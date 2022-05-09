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
      let card = document.createElement("div");
      let image = document.createElement("img");
      image.src = "imgs/" + IMGS[i];
      image.alt = TITLES[i] + " Image";
      let text = document.createElement("p");
      text.textContent = TITLES[i];

      card.classList.add("product-card");
      image.classList.add("card-img");

      card.appendChild(image);
      card.appendChild(text);

      id("products").appendChild(card);
    }
  }

  init();
})();
