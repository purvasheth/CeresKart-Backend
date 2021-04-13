const express = require("express");
const router = express.Router();

const data = [];

router
  .route("/")
  .get((req, res) => {
    res.json(data.filter((product) => !product.deleted));
  })
  .post((req, res) => {
    const product = req.body;
    let isPresent = false;
    data.forEach((item) => {
      if (item.id === product.id) {
        item.deleted = false;
        isPresent = true;
        return;
      }
    });
    if (!isPresent) {
      data.push(product);
    }
    res.status(201).json(product);
  });

router
  .route("/:id")
  .post((req, res) => {
    const { qty } = req.body;
    const { id } = req.params;
    data.forEach((product) => {
      if (product.id === id) {
        product.qty = qty;
        res.status(201).json(product);
        return;
      }
    });
  })
  .delete((req, res) => {
    const { id } = req.params;
    data.forEach((product) => {
      if (product.id == id) {
        product["deleted"] = true;
        res.status(204).json({});
        return;
      }
    });
  });

module.exports = router;
