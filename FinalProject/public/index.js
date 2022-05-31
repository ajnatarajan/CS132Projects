(function () {
  "use strict";

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
  async function onAddToCart(data, parent) {
    let msg = qs(".response-msg");
    if (msg) {
      msg.remove();
    }
    msg = gen("p");
    msg.classList.add("response-msg");
    msg.textContent = "Added to cart!";
    try {
      let resp = await fetch(`/addToCart?pid=${data.pid}`);
      resp = checkStatus(resp);
      resp = await resp.json();
    } catch (err) {
      msg.textContent = "Something went wrong.";
      msg.classList.add("red-text");
    }
    parent.appendChild(msg);
  }

  /**
   * Create a modal
   * @param {string} title - name of the product
   * @param {string} imgPath - path to image of the product
   * @param {string} categoryName - game or platform category
   * @returns {Element} - the modal that was just created
   */
  async function makeModal(data) {
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
    heading.textContent = data.title;
    container.appendChild(heading);

    /* Make body */
    let info = gen("section");

    /* Make image */
    let image = gen("img");
    image.src = "imgs/" + data.image_name;
    image.alt = data.title + " Image";
    info.appendChild(image);

    /* Make text info */
    let textInfo = gen("div");
    let stock = gen("p");
    stock.textContent = `Stock Remaining: ${data.stock}`;
    let category = gen("p");
    category.textContent = `Category: ${data.category}`;
    let lastSold = gen("p");
    let date = new Date(data.last_sold);
    lastSold.textContent = `Last Sold: ${date.toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
    })}`;
    let addToCart = gen("button");
    addToCart.textContent = "Add to Cart";
    addToCart.addEventListener("click", () => {
      onAddToCart(data, textInfo);
    });
    textInfo.appendChild(stock);
    textInfo.appendChild(category);
    textInfo.append(lastSold);
    textInfo.append(addToCart);
    info.append(textInfo);

    /* Add close button */
    let closeButton = gen("button");
    closeButton.classList.add("modal-close", "modal-exit");
    closeButton.textContent = "X"; // X works pretty well as a close button

    container.appendChild(info);
    container.appendChild(closeButton);

    modal.appendChild(bg);
    modal.appendChild(container);

    qs("body").appendChild(modal);

    return modal;
  }

  /**
   * Create a product card
   * @param {string} title - name of the product
   * @param {string} imgPath - path to image of the product
   * @param {string} category - game or platform category
   * @returns {void}
   */
  async function makeCard(data) {
    // title, imgPath, category
    let card = gen("div");
    let image = gen("img");
    // All images taken from corresponding platform websites.
    /* NB: I'm using camel case here since it's from my DB and I'm just 
    following the convention established in setup-oh.sql which was an example
    file given in lecture. I have removed all other camel case variables in my
    JS code though.
    */
    image.src = "imgs/" + data.image_name;
    image.alt = data.title + " Preview Image";
    let text = gen("p");
    text.textContent = data.title;

    card.classList.add("product-card");
    image.classList.add("card-img");

    card.appendChild(image);
    card.appendChild(text);

    id("products").appendChild(card);

    const modal = await makeModal(data);
    card.addEventListener("click", () => openCardModal(modal));
  }

  /**
   * Update product listing based on search and dropdown filter queries
   * No parameters.
   * @return {void}
   */
  async function populateProducts() {
    // Remove all products
    const products = id("products");
    while (products.firstChild) {
      products.removeChild(products.lastChild);
    }

    const searchQuery = id("search-bar").value;
    const dropdownQuery = id("dropdown").value;

    let allProducts;
    try {
      allProducts = await fetch("/products");
      allProducts = checkStatus(allProducts);
      allProducts = await allProducts.json();
    } catch (err) {
      let errorMsg = gen("p");
      errorMsg.textContent =
        "Store is currently down. Please visit again later";
      id("products").appendChild(errorMsg);
      return;
    }

    // Get products that are in the dropdown category selected
    let productsInSelectedCategory;
    if (dropdownQuery !== "All" && dropdownQuery !== "") {
      try {
        productsInSelectedCategory = await fetch(`/category/${dropdownQuery}`);
        productsInSelectedCategory = checkStatus(productsInSelectedCategory);
        productsInSelectedCategory = await productsInSelectedCategory.json();
      } catch (err) {
        let errorMsg = gen("p");
        errorMsg.textContent =
          "Store is currently down. Please visit again later";
        id("products").appendChild(errorMsg);
        return;
      }
    }

    // Add all products that pass the filter checks
    let keys = Object.keys(allProducts);
    keys.sort((e) => parseInt(e));
    for (let i = 0; i < keys.length; i++) {
      let data = allProducts[keys[i]];
      if (!data.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        continue;
      }

      // Check that this product is in the list of products that satisfy category
      if (
        productsInSelectedCategory &&
        !(data.pid in productsInSelectedCategory)
      ) {
        continue;
      }

      makeCard(data);
    }
  }

  init();
})();