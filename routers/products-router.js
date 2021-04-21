const express = require("express");
const { wrapWithTryCatch } = require("../utils");
const { Product } = require("../models/products-model");
const router = express.Router();

router.get("/", (req, res) => {
  wrapWithTryCatch(res, async () => {
    const products = await Product.find();
    res.json(products);
  });
});

router.get("/:id", (req, res) => {
  wrapWithTryCatch(res, async () => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.json(product);
  });
});

module.exports = router;
