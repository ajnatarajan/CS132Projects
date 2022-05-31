# *GameAnime* API Documentation
*This API is used to support the Game Anime Shop, an e-commerce site built as my CS 132 Spring 2022 Final Project. It supports the sale of several gift cards to popular anime streaming platforms and online video games. Any errors due to the server return a 500-level error *

## *Products*
**Request Format:** */products*

**Request Type:** *GET*

**Returned Data Format**: JSON

**Description:** *This endpoint returns all information about all products.*


**Example Request:** *localhost:8000/products*

**Example Response:**

```json
{
  "products":
    [
      {
        "pid":1,
        "title":"League of Legends $10 Gift Card",
        "image_name":"lol10.jpg",
        "category":"League of Legends",
        "last_sold":"2022-05-31T04:27:01.000Z",
        "stock":0
     },
     {
        "pid":2,
        "title":"League of Legends $25 Gift Card",
        "image_name":"lol25.jpg",
        "category":"League of Legends",
        "last_sold":"2022-05-31T21:39:07.000Z",
        "stock":8
     },
     .
     .
     .
   ]
}
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
{
  "pid":3,
  "title":"League of Legends $50 Gift Card",
  "image_name":"lol50.jpg",
  "category":"League of Legends",
  "last_sold":"2022-05-31T20:48:18.000Z",
  "stock":14
}
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
{
  "cart":
    [
      {"pid":2,"quantity":2},
      {"pid":3,"quantity":2}
    ]
}
```

**Error Handling:**
{ message: "Error fetching items in cart" } (ERROR: 500)

## *categoryFilter*
**Request Format:** */category/:category*

**Request Type:** *GET*

**Returned Data Format**: JSON

**Description:** *Returns all items that are in the given category.*

**Example Request:** *localhost:8000/category/Netflix*

**Example Response:**

```json
{
  "13":
    {
      "pid":13,
      "title":"Netflix $15 Gift Card",
      "image_name":"netflix15.jpg",
      "category":"Netflix",
      "last_sold":"2022-05-31T04:27:01.000Z",
      "stock":130
    },
 "14":
    {
      "pid":14,
      "title":"Netflix $30 Gift Card",
      "image_name":"netflix30.jpg",
      "category":"Netflix",
      "last_sold":"2022-05-31T04:27:01.000Z",
      "stock":140
    },
 "15":
    {
      "pid":15,
      "title":"Netflix $50 Gift Card",
      "image_name":"netflix50.jpg",
      "category":"Netflix",
      "last_sold":"2022-05-31T04:27:01.000Z",
      "stock":150}
    }
}
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
{
  "categories":
    [
      "League of Legends",
      "Valorant",
      "Crunchyroll",
      "Hulu",
      "Netflix"
    ]
}
```

**Error Handling:**
{ message: "Error fetching categories" } (ERROR: 500)

## *addToCart*
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
{ "message": "Error: Invalid PID" } (ERROR: 400)

## *removeFromCart*
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
{ "message": "Error: Invalid PID" } (ERROR: 400)

## *reduceStock*
**Request Format:** */reduceStock*

**Request Type:** *POST*

**Returned Data Format**: JSON

**Description:** *Reduces the remaining stock of a given product by a given quantity.*

**Example Request:** *localhost:8000/reduceStock*

**Example Response:**

```json
{ "message": "Successfully reduced stock of item! " }
```

**Error Handling:**
{ "message": "Error: Invalid PID" } (ERROR: 400)

## *isEnoughStock*
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
{ "message": "Error checking availability of item" } (ERROR: 500)

## *updateLastSold*
**Request Format:** */updateLastSold*

**Request Type:** *POST*

**Returned Data Format**: JSON

**Description:** *Update product to having been last sold at the current timestamp.*

**Example Request:** *localhost:8000/updateLastSold*

**Example Response:**

```json
{ "message": "Successfully updated last sold time. " }
```

**Error Handling:**
{ "message": "Error while updating last sold time. " } (ERROR: 500)

## *clearCart*
**Request Format:** */clearCart*

**Request Type:** *POST*

**Returned Data Format**: JSON

**Description:** *Remove all items from the cart table.*

**Example Request:** *localhost:8000/clearCart*

**Example Response:**

```json
{ "message": "Successfully updated last sold time. " }
```

**Error Handling:**
{ "message": "Error clearing cart." } (ERROR: 500)

## *Faqs*
**Request Format:** */faqs*

**Request Type:** *GET*

**Returned Data Format**: JSON

**Description:** *Get all FAQs and their answers.*

**Example Request:** *localhost:8000/faqs*

**Example Response:**

```json
{
  "faqs":
    [
      {
        "faq_id":1,
        "question":"How long did it take to make this e-commerce site?",
        "answer":"Though people often like to say Rome wasn't built in a day, this final project proposal was indeed built in a single day. It was quite the grind if I do say so myself."
      },
      {
        "faq_id":2,
        "question":"It's been 10 days, why haven't my items shipped to me?",
        "answer":"Great observation! So the issue is this e-commerce store doesn't actually handle payment and shipping which means your purchase was actually a phantom transaction and you will never actually receive the goods you ordered. On the bright side, you didn't actually pay any money so I'd say all's well that ends well."
      },
      {
        "faq_id":3,
        "question":"How long would it take me to make a site as beautiful as this?",
        "answer":"The process is quite simple really- get into Caltech, take CS 132, and in six short weeks, you'll be ready to built sites like this one."
      },
      {
        "faq_id":4,
        "question":"Are there any other sites I should check out?",
        "answer":"Visit qup.gg and sign up to be among our first batch of beta testers!"
      },
      {
        "faq_id":5,
        "question":"How did you make these super aesthetic gradients, Ajay?",
        "answer":"Figma magic, baby."
      },
      {
        "faq_id":6,
        "question":"Any cool life hacks you know?",
        "answer":"When in doubt, drink water."
      }
    ]
}
```

**Error Handling:**
{ "message": "Error fetching FAQs." } (ERROR: 500)

## *Feedback*
**Request Format:** */feedback*

**Request Type:** *POST*

**Returned Data Format**: JSON

**Description:** *Send contact form submission to database.*

**Example Request:** *localhost:8000/feedback*

**Example Response:**

```json
{ "message": "Successfully submitted feedback" }
```

**Error Handling:**
{ "message": "Error submitting feedback. " } (ERROR: 500)
