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
{"1":{"pid":1,"title":"League of Legends $10 Gift Card","image_name":"lol10.jpg","category":"League of Legends","last_sold":"2022-05-31T04:27:01.000Z","stock":0},"2":{"pid":2,"title":"League of Legends $25 Gift Card","image_name":"lol25.jpg","category":"League of Legends","last_sold":"2022-05-31T09:29:22.000Z","stock":15},"3":{"pid":3,"title":"League of Legends $50 Gift Card","image_name":"lol50.jpg","category":"League of Legends","last_sold":"2022-05-31T09:26:12.000Z","stock":21},"4":{"pid":4,"title":"League of Legends $100 Gift Card","image_name":"lol100.jpg","category":"League of Legends","last_sold":"2022-05-31T06:57:17.000Z","stock":38},"5":{"pid":5,"title":"Valorant $10 Gift Card","image_name":"valorant10.jpg","category":"Valorant","last_sold":"2022-05-31T04:27:01.000Z","stock":50},"6":{"pid":6,"title":"Valorant $25 Gift Card","image_name":"valorant25.jpg","category":"Valorant","last_sold":"2022-05-31T07:17:15.000Z","stock":57},"7":{"pid":7,"title":"Valorant $50 Gift Card","image_name":"valorant50.jpg","category":"Valorant","last_sold":"2022-05-31T06:58:22.000Z","stock":68},"8":{"pid":8,"title":"Valorant $100 Gift Card","image_name":"valorant100.jpg","category":"Valorant","last_sold":"2022-05-31T04:27:01.000Z","stock":79},"9":{"pid":9,"title":"Crunchyroll $25 Gift Card","image_name":"crunchyroll25.jpg","category":"Crunchyroll","last_sold":"2022-05-31T04:27:01.000Z","stock":90},"10":{"pid":10,"title":"Hulu $25 Gift Card","image_name":"hulu25.jpg","category":"Hulu","last_sold":"2022-05-31T04:27:01.000Z","stock":100},"11":{"pid":11,"title":"Hulu $50 Gift Card","image_name":"hulu50.jpg","category":"Hulu","last_sold":"2022-05-31T08:43:32.000Z","stock":106},"12":{"pid":12,"title":"Hulu $100 Gift Card","image_name":"hulu100.jpg","category":"Hulu","last_sold":"2022-05-31T07:30:13.000Z","stock":114},"13":{"pid":13,"title":"Netflix $15 Gift Card","image_name":"netflix15.jpg","category":"Netflix","last_sold":"2022-05-31T04:27:01.000Z","stock":130},"14":{"pid":14,"title":"Netflix $30 Gift Card","image_name":"netflix30.jpg","category":"Netflix","last_sold":"2022-05-31T04:27:01.000Z","stock":140},"15":{"pid":15,"title":"Netflix $50 Gift Card","image_name":"netflix50.jpg","category":"Netflix","last_sold":"2022-05-31T04:27:01.000Z","stock":150}}
```

**Error Handling:**
{ message: "Error fetching products" } (ERROR: 400)

## *Info*
**Request Format:** */info?pid=value*

**Request Type:** *GET*

**Returned Data Format**: JSON

**Description:** *Returns all information about one product given the product id*

**Example Request:** *localhost:8000/info?pid=3*

**Example Response:**

```json
{"3":{"pid":3,"title":"League of Legends $50 Gift Card","image_name":"lol50.jpg","category":"League of Legends","last_sold":"2022-05-31T09:26:12.000Z","stock":21}}
```

**Error Handling:**
{ message: "Error fetching product info" } (ERROR: 400)

## *Cart*
**Request Format:** */cart*

**Request Type:** *GET*

**Returned Data Format**: JSON

**Description:** *Returns all items currently in the user's cart*

**Example Request:** *localhost:8000/cart*

**Example Response:**

```json
{"2":{"pid":2,"quantity":1},"4":{"pid":4,"quantity":3},"7":{"pid":7,"quantity":1}}
```

**Error Handling:**
{ message: "Error fetching items in cart" } (ERROR: 400)

## *Category Filter*
**Request Format:** */category/:category*

**Request Type:** *GET*

**Returned Data Format**: JSON

**Description:** *Returns all items that are in the given category.*

**Example Request:** *localhost:8000/category/Netflix*

**Example Response:**

```json
{"13":{"pid":13,"title":"Netflix $15 Gift Card","image_name":"netflix15.jpg","category":"Netflix","last_sold":"2022-05-31T04:27:01.000Z","stock":130},"14":{"pid":14,"title":"Netflix $30 Gift Card","image_name":"netflix30.jpg","category":"Netflix","last_sold":"2022-05-31T04:27:01.000Z","stock":140},"15":{"pid":15,"title":"Netflix $50 Gift Card","image_name":"netflix50.jpg","category":"Netflix","last_sold":"2022-05-31T04:27:01.000Z","stock":150}}
```

**Error Handling:**
{ message: "Error filtering by category" } (ERROR: 400)
