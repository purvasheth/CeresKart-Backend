const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const { connectDB } = require("./db/db");
const { fillProductsCollection } = require("./models/products-model");
const productsRouter = require("./routers/products-router");
const { cartRouter, getCart } = require("./routers/cart-router");
const { wishlistRouter, getWishlist } = require("./routers/wishlist-router");
const authRouter = require("./routers/auth-router");
const errorHandler = require("./middleware/error-handler");
const routeNotFound = require("./middleware/route-not-found");
const verifyAuth = require("./middleware/verify-auth");

const app = express();
const port = 4000;
app.use(cors());
app.use(bodyParser.json());

connectDB();
// run once
// fillProductsCollection()

app.get("/", (req, res) => {
  res.send("API for CeresKart");
});
app.use(authRouter);
app.use("/products", productsRouter);
app.use("/cart", verifyAuth, getCart, cartRouter);
app.use("/wishlist", verifyAuth, getWishlist, wishlistRouter);

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: err.message });
});

app.use(routeNotFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`App started on ${port}!`);
});
