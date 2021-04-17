const mongoose = require("mongoose");
const { Schema } = mongoose;
const productsData = require("./products-data");

const productSchema = new Schema({
  id: Schema.Types.ObjectId,
  name: String,
  image: String,
  price: Number,
  inStock: Boolean,
  fastDelivery: Boolean,
  rating: Number,
  discount: Number,
  category: String,
});

const Product = mongoose.model("Product", productSchema);

// one time add in db
async function fillProductsCollection() {
  try {
    productsData.forEach(async (product) => {
      const newProduct = new Product(product);
      const savedProduct = await newProduct.save();
      console.log(savedProduct);
    });
  } catch (e) {
    console.log(e);
  }
}

module.exports = { Product, fillProductsCollection };
