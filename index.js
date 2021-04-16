const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { connectDB } = require("./db")
const {populateProductsCollection} = require("./products-model")
const productsRouter = require("./products-router");
const genericRouter = require("./generic-router");


const app = express();
const port = 4000;
app.use(cors());
app.use(bodyParser.json());

connectDB()

populateProductsCollection()



app.get("/", (req, res) => {
  res.send("API for CeresKart");
});

app.use("/products", productsRouter);
app.use("/cart", genericRouter);
app.use("/wishlist", genericRouter);

app.listen(port, () => {
  console.log(`App started on ${port}!`);
});
