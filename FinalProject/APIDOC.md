# *GameAnime* API Documentation
*This API is used to support the Game Anime Shop, an e-commerce site built as my CS 132 Spring 2022 Final Project. It supports the sale of several gift cards to popular anime streaming platforms and online video games.*

## *Products*
**Request Format:** */products*

**Request Type:** *GET*

**Returned Data Format**: JSON

**Description:** *This endpoint returns all information about all products.*


**Example Request:** *localhost:8000/products*

**Example Response:**

```json
{"products":[{"pid":1,"title":"League of Legends $10 Gift Card","image_name":"lol10.jpg","category":"League of Legends","last_sold":"2022-05-31T04:27:01.000Z","stock":0},{"pid":2,"title":"League of Legends $25 Gift Card","image_name":"lol25.jpg","category":"League of Legends","last_sold":"2022-05-31T21:39:07.000Z","stock":8},{"pid":3,"title":"League of Legends $50 Gift Card","image_name":"lol50.jpg","category":"League of Legends","last_sold":"2022-05-31T20:48:18.000Z","stock":14},{"pid":4,"title":"League of Legends $100 Gift Card","image_name":"lol100.jpg","category":"League of Legends","last_sold":"2022-05-31T17:13:24.000Z","stock":36},{"pid":5,"title":"Valorant $10 Gift Card","image_name":"valorant10.jpg","category":"Valorant","last_sold":"2022-05-31T04:27:01.000Z","stock":50},{"pid":6,"title":"Valorant $25 Gift Card","image_name":"valorant25.jpg","category":"Valorant","last_sold":"2022-05-31T07:17:15.000Z","stock":57},{"pid":7,"title":"Valorant $50 Gift Card","image_name":"valorant50.jpg","category":"Valorant","last_sold":"2022-05-31T16:44:22.000Z","stock":67},{"pid":8,"title":"Valorant $100 Gift Card","image_name":"valorant100.jpg","category":"Valorant","last_sold":"2022-05-31T17:15:41.000Z","stock":77},{"pid":9,"title":"Crunchyroll $25 Gift Card","image_name":"crunchyroll25.jpg","category":"Crunchyroll","last_sold":"2022-05-31T04:27:01.000Z","stock":90},{"pid":10,"title":"Hulu $25 Gift Card","image_name":"hulu25.jpg","category":"Hulu","last_sold":"2022-05-31T04:27:01.000Z","stock":100},{"pid":11,"title":"Hulu $50 Gift Card","image_name":"hulu50.jpg","category":"Hulu","last_sold":"2022-05-31T08:43:32.000Z","stock":106},{"pid":12,"title":"Hulu $100 Gift Card","image_name":"hulu100.jpg","category":"Hulu","last_sold":"2022-05-31T20:48:18.000Z","stock":113},{"pid":13,"title":"Netflix $15 Gift Card","image_name":"netflix15.jpg","category":"Netflix","last_sold":"2022-05-31T04:27:01.000Z","stock":130},{"pid":14,"title":"Netflix $30 Gift Card","image_name":"netflix30.jpg","category":"Netflix","last_sold":"2022-05-31T04:27:01.000Z","stock":140},{"pid":15,"title":"Netflix $50 Gift Card","image_name":"netflix50.jpg","category":"Netflix","last_sold":"2022-05-31T04:27:01.000Z","stock":150}]}
```

**Error Handling:**
{ message: "Error fetching products" } (ERROR: 500)

## *Info*
**Request Format:** */info?pid=value*

**Request Type:** *GET*

**Returned Data Format**: JSON

**Description:** *Returns all information about one product given the product id*

**Example Request:** *localhost:8000/info?pid=3*

**Example Response:**

```json
{"pid":3,"title":"League of Legends $50 Gift Card","image_name":"lol50.jpg","category":"League of Legends","last_sold":"2022-05-31T20:48:18.000Z","stock":14}
```

**Error Handling:**
{ message: "Error fetching product info" } (ERROR: 500)

## *Cart*
**Request Format:** */cart*

**Request Type:** *GET*

**Returned Data Format**: JSON

**Description:** *Returns all items currently in the user's cart*

**Example Request:** *localhost:8000/cart*

**Example Response:**

```json
{"cart":[{"pid":2,"quantity":2},{"pid":3,"quantity":2}]}
```

**Error Handling:**
{ message: "Error fetching items in cart" } (ERROR: 500)

## *Category Filter*
**Request Format:** */category/:category*

**Request Type:** *GET*

**Returned Data Format**: JSON

**Description:** *Returns all items that are in the given category.*

**Example Request:** *localhost:8000/category/Netflix*

**Example Response:**

```json
{"13":{"pid":13,"title":"Netflix $15 Gift Card","image_name":"netflix15.jpg","category":"Netflix","last_sold":"2022-05-31T04:27:01.000Z","stock":130},"14":{"pid":14,"title":"Netflix $30 Gift Card","image_name":"netflix30.jpg","category":"Netflix","last_sold":"2022-05-31T04:27:01.000Z","stock":140},"15":{"pid":15,"title":"Netflix $50 Gift Card","image_name":"netflix50.jpg","category":"Netflix","last_sold":"2022-05-31T04:27:01.000Z","stock":150},"products":[]}
```

**Error Handling:**
{ message: "Error filtering by category" } (ERROR: 500)

## *Categories*
**Request Format:** */categories*

**Request Type:** *GET*

**Returned Data Format**: JSON

**Description:** *Returns all distinct categories.*

**Example Request:** *localhost:8000/categories*

**Example Response:**

```json
{"categories":["League of Legends","Valorant","Crunchyroll","Hulu","Netflix"]}
```

**Error Handling:**
{ message: "Error fetching categories" } (ERROR: 500)

## *Add to Cart*
**Request Format:** */addToCart*

**Request Type:** *POST*

**Returned Data Format**: JSON

**Description:** *Adds an item to a user's cart.*

**Example Request:** *localhost:8000/addToCart*

**Example Response:**

```json
{"message":"Successfully added item to cart!"}
```

**Error Handling:**
{ message: "Error: Invalid PID" } (ERROR: 400)

## *Remove from Cart*
**Request Format:** */removeFromCart*

**Request Type:** *POST*

**Returned Data Format**: JSON

**Description:** *Removes an item from a user's cart.*

**Example Request:** *localhost:8000/removeFromCart*

**Example Response:**

```json
{"message":"Successfully removed item from cart!"}
```

**Error Handling:**
{ message: "Error: Invalid PID" } (ERROR: 400)

## *Reduce Stock*
**Request Format:** */reduceStock*

**Request Type:** *POST*

**Returned Data Format**: JSON

**Description:** *Reduces the remaining stock of a given product by a given quantity.*

**Example Request:** *localhost:8000/reduceStock*

**Example Response:**

```json
{ message: "Successfully reduced stock of item! " }
```

**Error Handling:**
{ message: "Error: Invalid PID" } (ERROR: 400)

## *Reduce Stock*
**Request Format:** */isEnoughStock?pid=value&qty=value*

**Request Type:** *GET*

**Returned Data Format**: JSON

**Description:** *Checks to see if there is enough stock to support the given quantity of the given product.*

**Example Request:** *localhost:8000/isEnoughStock?pid=3&qty=15*

**Example Response:**

```json
{ "isEnoughStock":true }
```

**Error Handling:**
{ message: "Error checking availability of item" } (ERROR: 500)
