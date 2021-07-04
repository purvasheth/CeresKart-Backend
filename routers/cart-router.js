const express = require("express");
const { Cart } = require("../models/cart-model");
const { wrapWithTryCatch } = require("../utils");

const router = express.Router();

async function getCart(req, res, next) {
  wrapWithTryCatch(res, async () => {
    const {
      user: { _id: userId },
    } = req;
    if (req.method === "GET") {
      const cart = await Cart.findById(userId).populate("cart._id");
      req.cart = cart ? cart.cart : [];
      return next();
    }
    const userCart = await Cart.findById(userId);
    req.userCart = userCart;
    return next();
  });
}

router
  .route("/")
  .get((req, res) => {
    wrapWithTryCatch(
      res,
      async () => {
        const { cart } = req;
        const normalizedCart = cart.map((item) => {
          const { _id, ...doc } = item._id._doc;
          return { id: _id, ...doc, qty: item.qty, __v: undefined };
        });
        return res.json(normalizedCart);
      },
      502
    );
  })
  .post((req, res) => {
    wrapWithTryCatch(res, async () => {
      const product = req.body;
      const { id, qty } = product;
      const { userCart } = req;
      if (userCart) {
        userCart.cart.push({ _id: id, qty });
        await userCart.save();
      } else {
        const {
          user: { _id: userId },
        } = req;
        const newUserCart = new Cart({
          _id: userId,
          cart: [{ _id: id, qty }],
        });
        await newUserCart.save();
      }
      res.status(201).json(product);
    });
  });

router
  .route("/:id")
  .post((req, res) => {
    wrapWithTryCatch(res, async () => {
      const { qty } = req.body;
      const { id } = req.params;
      const { userCart } = req;
      if (userCart) {
        const index = userCart.cart.findIndex(({ _id }) => _id == id);
        if (index !== -1) {
          userCart.cart[index].qty = qty;
          await userCart.save();
          return res.status(201).json({ qty });
        } else {
          throw new Error("Item not present in cart");
        }
      }
      throw new Error("No items in cart");
    });
  })
  .delete((req, res) => {
    wrapWithTryCatch(res, async () => {
      const { id } = req.params;
      const { userCart } = req;
      if (userCart) {
        userCart.cart = userCart.cart.filter(({ _id }) => _id != id);
        await userCart.save();
        return res.status(204).json({});
      }
      throw new Error("No items in cart");
    });
  });

module.exports = { cartRouter: router, getCart };
