const express = require("express");
const productsData = require("./products-data")
const {Product} = require("./products-model")
const router = express.Router();

router.route("/").get((req, res) => {
  const products = Product.find()
  res.json(products)
});

router.route("/:id").get(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id).exec()
  console.log(product)
  res.json(product);
});

module.exports = router;
