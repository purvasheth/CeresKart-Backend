const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const { connectDB } = require("./db/db");
const { fillProductsCollection } = require("./models/products-model");
const productsRouter = require("./routers/products-router");
const cartRouter = require("./routers/cart-router");
const wishlistRouter = require("./routers/wishlist-router");

const app = express();
const port = 4000;
app.use(cors());
app.use(bodyParser.json());

connectDB();
console.log("prints this")
// run once
// fillProductsCollection()

app.get("/", (req, res) => {
  res.send("API for CeresKart");
});

app.use("/products", productsRouter);
app.use("/cart", cartRouter);
app.use("/wishlist", wishlistRouter);

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: err.message });
});

app.listen(port, () => {
  console.log(`App started on ${port}!`);
});
