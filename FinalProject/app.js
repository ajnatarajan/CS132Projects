"use strict";
const express = require("express");
const mysql = require("promise-mysql");
const app = express();

async function getDB() {
  const db = await mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "password",
    database: "commercedb",
  });
  return db;
}

app.use(express.static("public"));

/* Display all products */
app.get("/products", async (req, res) => {
  let db;
  try {
    db = await getDB();
    let qry = "SELECT * FROM products";
    const rows = await db.query(qry);
    let products = {};
    for (let i = 0; i < rows.length; i++) {
      products[rows[i].pid] = { ...rows[i] };
    }
    res.json(products);
  } catch (err) {
    res.status(400).json({ message: "Error fetching products" });
  }
  if (db) {
    db.end();
  }
});

/* Display all information about one product */
app.get("/info", async (req, res) => {
  if (req.query["pid"]) {
    let db;
    try {
      db = await getDB();
      let qry = `SELECT * FROM products WHERE pid = ${req.query["pid"]}`;
      const rows = await db.query(qry);
      let info = {};
      info[req.query["pid"]] = { ...rows[0] }; // There will only be one row
      res.json(info);
    } catch (err) {
      res.status(400).json({ message: "Error fetching product info" });
    }
    if (db) {
      db.end();
    }
  } else {
    res.status(400).json({ message: "Missing required query parameter: pid" });
  }
});

/* Display all items in the cart */
app.get("/cart", async (req, res) => {
  let db;
  try {
    db = await getDB();
    let qry = "SELECT * FROM cart WHERE quantity > 0";
    const rows = await db.query(qry);
    let cart = {};
    for (let i = 0; i < rows.length; i++) {
      cart[rows[i].pid] = { ...rows[i] };
    }
    res.json(cart);
  } catch (err) {
    res.status(400).json({ message: "Error fetching items in cart" });
  }
  if (db) {
    db.end();
  }
});

/* Filter by category */
app.get("/category/:category", async (req, res) => {
  let db;
  try {
    db = await getDB();
    let qry = `SELECT * FROM products WHERE category = '${req.params["category"]}'`;
    const rows = await db.query(qry);
    let products = {};
    for (let i = 0; i < rows.length; i++) {
      products[rows[i].pid] = { ...rows[i] };
    }
    res.json(products);
  } catch (err) {
    res.status(400).json({ message: "Error fetching items in cart" });
  }
  if (db) {
    db.end();
  }
});

/* Add item to cart */
app.get("/addToCart", async (req, res) => {
  if (req.query["pid"]) {
    let db;
    try {
      db = await getDB();
      let isValidPID =
        (
          await db.query(
            `SELECT * FROM products WHERE pid = ${req.query["pid"]}`
          )
        ).length > 0;
      let isInCart =
        (await db.query(`SELECT * FROM cart WHERE pid = ${req.query["pid"]}`))
          .length > 0;
      if (!isValidPID) {
        res.status(400).json({ message: "Error: Invalid PID" });
      } else {
        if (isInCart) {
          await db.query(
            `UPDATE cart SET quantity = (quantity + 1) WHERE pid = ${req.query["pid"]}`
          );
        } else {
          await db.query(
            `INSERT INTO cart(pid, quantity) VALUES (${req.query["pid"]}, 1)`
          );
        }
        res.json({ message: "Successfully added item to cart!" });
      }
    } catch (err) {
      res.status(400).json({ message: "Error adding item to cart" });
    }
    if (db) {
      db.end();
    }
  } else {
    res.status(400).json({ message: "Missing required parameter: pid" });
  }
});

/* Delete item from cart. */
app.get("/removeFromCart", async (req, res) => {
  if (req.query["pid"]) {
    let db;
    try {
      db = await getDB();
      let rows = await db.query(
        `SELECT * FROM cart WHERE pid = ${req.query["pid"]}`
      );
      if (rows.length === 0 || rows[0].quantity === 0) {
        res.status(400).json({
          message: "Error: Cannot delete an item that is not in the cart",
        });
      } else {
        await db.query(
          `UPDATE cart SET quantity = (quantity - 1) WHERE pid = ${req.query["pid"]}`
        );
        res.json({ message: "Successfully removed item from cart!" });
      }
    } catch (err) {
      res.status(400).json({ message: "Error removing item from cart" });
    }
    if (db) {
      db.end();
    }
  } else {
    res.status(400).json({ message: "Missing required parameter: pid" });
  }
});

app.get("/reduceStock", async (req, res) => {
  if (req.query["pid"] && req.query["qty"]) {
    let db;
    try {
      db = await getDB();
      let row = await db.query(
        `SELECT * FROM products WHERE pid = ${req.query["pid"]}`
      );
      if (row.length === 0) {
        res.status(400).json({ message: "Invalid PID" });
      } else if (row[0].stock < req.query["qty"]) {
        res
          .status(400)
          .json({ message: "Not enough stock to support order. " });
      } else {
        await db.query(
          `UPDATE products SET stock = (stock - ${req.query["qty"]}) WHERE pid = ${req.query["pid"]}`
        );
        res.json({ message: "Successfully reduced stock of item! " });
      }
    } catch (err) {
      res.status(400).json({ message: "Error reducing stock of item" });
    }
    if (db) {
      db.end();
    }
  } else {
    res.status(400).json({ message: "Missing required parameter, pid or qty" });
  }
});

app.get("/isEnoughStock", async (req, res) => {
  if (req.query["pid"] && req.query["qty"]) {
    let db;
    try {
      db = await getDB();
      let row = await db.query(
        `SELECT * FROM products WHERE pid = ${req.query["pid"]}`
      );
      if (row.length === 0) {
        res.status(400).json({ message: "Invalid PID" });
      } else if (row[0].stock < req.query["qty"]) {
        res.json({ isEnoughStock: false });
      } else {
        res.json({ isEnoughStock: true });
      }
    } catch (err) {
      res.status(400).json({ message: "Error reducing stock of item" });
    }
    if (db) {
      db.end();
    }
  } else {
    res.status(400).json({ message: "Missing required parameter, pid or qty" });
  }
});

app.get("/clearCart", async (req, res) => {
  let db;
  try {
    db = await getDB();
    await db.query("DELETE FROM cart");
    res.json({ message: "Successfully cleared cart. " });
  } catch (err) {
    res.status(400).json({ message: "Error clearing cart." });
  }
  if (db) {
    db.end();
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log("Listening on port " + PORT));
