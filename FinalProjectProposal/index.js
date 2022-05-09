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

  const ALTS = [
    "League $10 Gift Card",
    "League $25 Gift Card",
    "League $50 Gift Card",
    "League $100 Gift Card",
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
    id("search-bar").addEventListener("input", () => {
      console.log("Updating search...");
    });

    populateProducts();
  }

  function populateProducts() {
    for (let i = 0; i < IMGS.length; i++) {
      let card = document.createElement("div");
      let image = document.createElement("img");
      image.src = "imgs/" + IMGS[i];
      image.alt = ALTS[i] + " Image";
      let text = document.createElement("p");
      text.textContent = ALTS[i];

      card.classList.add("product-card");
      image.classList.add("card-img");

      card.appendChild(image);
      card.appendChild(text);

      id("products").appendChild(card);
    }
  }

  init();
})();
