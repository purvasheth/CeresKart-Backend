const express = require("express");
const productsData = require("./products-data");
const router = express.Router();

router.route("/").get((req, res) => {
  res.json(productsData);
});

router.route("/:id").get((req, res) => {
  const { id } = req.params;
  res.json(productsData.find((product) => product.id === id));
});

module.exports = router;
