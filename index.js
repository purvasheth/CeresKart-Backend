const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 4000;
app.use(cors());
app.use(bodyParser.json());
const productsRouter = require("./products-router");
const genericRouter = require("./generic-router");

app.get("/", (req, res) => {
  res.send("API for CeresKart");
});

app.use("/products", productsRouter);
app.use("/cart", genericRouter);
app.use("/wishlist", genericRouter);

app.listen(port, () => {
  console.log(`App started on ${port}!`);
});
