const express = require("express");
const { WishlistItem } = require("./wishlist-model")
const { wrapWithTryCatch } = require("./utils")

const router = express.Router();

router
  .route("/")
  .get((req, res) => {
    wrapWithTryCatch(res, async () => {
      const wishlistItems = await WishlistItem.find().populate('_id')
      const normalizedWishlistItems = wishlistItems.map((item) => {
        const { _id, ...doc } = item._id._doc
        return ({ id: _id, ...doc })
      })
      res.json(normalizedWishlistItems)
    })
  })
  .post((req, res) => {
    wrapWithTryCatch(res, async () => {
      const product = req.body
      const { id } = product
      const wishlistItem = new WishlistItem({ _id: id })
      await wishlistItem.save()
      res.status(201).json(product)
    })
  });

router
  .delete("/:id", ((req, res) => {
    wrapWithTryCatch(res, async () => {
      const { id } = req.params
      await WishlistItem.findByIdAndDelete(id)
      res.status(204).json({})
    })
  }));

module.exports = router
