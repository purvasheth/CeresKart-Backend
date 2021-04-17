const express = require("express");
const { CartItem } = require("../models/cart-model");
const { wrapWithTryCatch } = require("../utils");

const router = express.Router();

router
  .route("/")
  .get((req, res) => {
    wrapWithTryCatch(res, async () => {
      const cartItems = await CartItem.find().populate("_id");
      const normalizedCartItems = cartItems.map((item) => {
        const { _id, ...doc } = item._id._doc;
        return { id: _id, ...doc, qty: item.qty };
      });
      res.json(normalizedCartItems);
    });
  })
  .post((req, res) => {
    wrapWithTryCatch(res, async () => {
      const product = req.body;
      const { id, qty } = product;
      const cartItem = new CartItem({ _id: id, qty });
      await cartItem.save();
      res.status(201).json(product);
    });
  });

router
  .route("/:id")
  .post((req, res) => {
    wrapWithTryCatch(res, async () => {
      const { qty } = req.body;
      const { id } = req.params;
      await CartItem.findByIdAndUpdate(id, { qty });
      res.status(201).json({ qty });
    });
  })
  .delete((req, res) => {
    wrapWithTryCatch(res, async () => {
      const { id } = req.params;
      await CartItem.findByIdAndDelete(id);
      res.status(204).json({});
    });
  });

module.exports = router;
