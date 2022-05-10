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

  function init() {
    document
      .querySelector("#checkout > button")
      .addEventListener("click", onCheckout);
    populateCart();
  }

  function onCheckout() {
    // Will make API Calls to handle checkout
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
  }

  function populateCart() {
    for (let i = 0; i < IMGS.length; i++) {
      makeCard(TITLES[i], IMGS[i]);
    }
  }

  init();
})();
