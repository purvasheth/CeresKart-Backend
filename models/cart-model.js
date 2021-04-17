const mongoose = require("mongoose");
const { Schema } = mongoose;

const cartItemSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, ref: "Product" },
  qty: Number,
});

const CartItem = mongoose.model("CartItem", cartItemSchema);

module.exports = { CartItem };
