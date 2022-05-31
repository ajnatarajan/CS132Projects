/*
  Name: Ajay Natarajan
  CS 132 Spring 2022
  Date: May 31st, 2022
  This is the index.js for my gaming and anime e-commerce site which is serving
  as my final project for CS 132. It aids with updating DOM elements based on 
  filtering and searching, handles opening a modal with more product information
  when a product is clicked, and enables users to add items to their cart from
  the modal.
 */

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
    populateCategoryDropdown();
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
   * @param {JSON} data - relevant product data fetched from an API
   * @param {Element} parent - parent to add user feedback messages to
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
      let resp = await fetch("/addToCart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pid: data.pid,
        }),
      });
      resp = checkStatus(resp);
      resp = await resp.json();
    } catch (err) {
      msg.textContent = "Something went wrong.";
      msg.classList.add("red-text");
    }
    parent.appendChild(msg);
  }

  /**
   * Make text info for product modal
   * @param {JSON} data - relevant data for this product
   * @returns {Element} textInfo - the text to be added to the product modal
   */
  function makeTextInfo(data) {
    let textInfo = gen("div");
    let stock = gen("p");
    stock.textContent = `Stock Remaining: ${data.stock}`;
    let category = gen("p");
    category.textContent = `Category: ${data.category}`;
    let lastSold = gen("p");
    let date = new Date(data.last_sold); // See Line 242 in cart.js
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
    return textInfo;
  }

  /**
   * Add product cards for all cards that satisfy the search and dropdown filters.
   * @param {JSON} allProducts - all products returned from the products API response
   * @param {string} searchQuery - current value entered by user in search bar
   * @param {JSON} productsInSelectedCategory - products that satisfy chosen category
   */
  function addProductsThatSatisfyFilters(
    allProducts,
    searchQuery,
    productsInSelectedCategory
  ) {
    allProducts.products.forEach((data) => {
      if (!data.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return;
      }

      // Check that this product is in the list of products that satisfy category
      if (
        productsInSelectedCategory &&
        !(data.pid in productsInSelectedCategory)
      ) {
        return;
      }

      makeCard(data);
    });
  }

  /**
   * Create a modal
   * @param {JSON} data - relevant product data fetched from an API
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
    image.src = "imgs/" + data.image_name; // See Line 242 in cart.js
    image.alt = data.title + " Image";
    info.appendChild(image);

    /* Make text info */
    let textInfo = makeTextInfo(data);
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
   * Create a product card and attached modal
   * @param {JSON} data - relevant product data fetched from an API
   * @returns {void}
   */
  async function makeCard(data) {
    // title, imgPath, category
    let card = gen("div");
    let image = gen("img");
    // All images taken from corresponding platform websites.
    image.src = "imgs/" + data.image_name; // See Line 242 in cart.js
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
   * Populate dropdown with all categories that appear in the product database.
   * No parameters.
   * @returns {void}
   */
  async function populateCategoryDropdown() {
    let categories;
    try {
      categories = await fetch("/categories");
      categories = checkStatus(categories);
      categories = await categories.json();
    } catch (err) {
      let errorMsg = gen("p");
      errorMsg.classList.add("dropdown-error-msg");
      errorMsg.textContent = "Unexpected error. Please try again.";
      qs("body").insertBefore(errorMsg, id("products"));
      return;
    }

    categories = categories.categories;
    for (let i = 0; i < categories.length; i++) {
      let newOption = gen("option");
      newOption.setAttribute("value", categories[i]);
      newOption.textContent = categories[i];
      id("dropdown").appendChild(newOption);
    }
  }

  /**
   * Update product listing based on search and dropdown filter queries
   * No parameters.
   * @returns {void}
   */
  async function populateProducts() {
    // Remove all products
    const products = id("products");
    while (products.firstChild) {
      products.removeChild(products.lastChild);
    }

    // Get relevant filter values
    const searchQuery = id("search-bar").value;
    const dropdownQuery = id("dropdown").value;

    // NB: try-catch clauses where I must return from the catch clause can't
    // really be factored out into helper functions. The best I can do is create
    // a helper function for the block of code in the try clause but that's only
    // reducing 3 lines to 1 so it doesn't seem worth.
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
    addProductsThatSatisfyFilters(
      allProducts,
      searchQuery,
      productsInSelectedCategory
    );
  }

  init();
})();
