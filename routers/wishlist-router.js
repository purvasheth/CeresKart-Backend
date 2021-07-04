const express = require("express");
const { Wishlist } = require("../models/wishlist-model");
const { wrapWithTryCatch } = require("../utils");

const router = express.Router();

async function getWishlist(req, res, next) {
  wrapWithTryCatch(res, async () => {
    const {
      user: { _id: userId },
    } = req;
    if (req.method === "GET") {
      const wishlist = await Wishlist.findById(userId).populate("wishlist._id");
      req.wishlist = wishlist ? wishlist.wishlist : [];
      return next();
    }
    const userWishlist = await Wishlist.findById(userId);
    req.userWishlist = userWishlist;
    return next();
  });
}

router
  .route("/")
  .get((req, res) => {
    wrapWithTryCatch(
      res,
      async () => {
        const { wishlist } = req;
        const normalizedWishlistItems = wishlist.map((item) => {
          const { _id, ...doc } = item._id._doc;
          return { id: _id, ...doc };
        });
        res.json(normalizedWishlistItems);
      },
      502
    );
  })
  .post((req, res) => {
    wrapWithTryCatch(res, async () => {
      const product = req.body;
      const { id } = product;
      let { userWishlist } = req;
      if (!userWishlist) {
        const {
          user: { _id: userId },
        } = req;
        userWishlist = new Wishlist({ _id: userId, wishlist: [{ _id: id }] });
      } else {
        userWishlist.wishlist.push({ _id: id });
      }
      await userWishlist.save();
      res.status(201).json(product);
    });
  });

router.delete("/:id", (req, res) => {
  wrapWithTryCatch(res, async () => {
    const { userWishlist } = req;
    if (!userWishlist) {
      return res.status(403).json({ message: "No items in wishlist" });
    }
    const { id } = req.params;
    userWishlist.wishlist = userWishlist.wishlist.filter(
      ({ _id }) => _id != id
    );
    await userWishlist.save();
    res.status(204).json({});
  });
});

module.exports = { getWishlist, wishlistRouter: router };
