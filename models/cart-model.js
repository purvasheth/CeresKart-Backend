const mongoose = require("mongoose");
const { Schema } = mongoose;

const cartItemSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, ref: "Product" },
  qty: Number,
});

const cartSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, ref: "User" },
  cart: [{ type: cartItemSchema }],
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = { Cart };
