const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: [true, "Product must have a brand"],
    enum: {
      values: ["Apple", "Samsung", "Microsoft", "Google", "LG"], // Array of brands
      message: "Brand is not valid", // Custom error message if the value is not in the enum
    },
  },
  type: {
    type: String,
    required: [true, "Product must have a type"],
    enum: {
      values: ["Phone", "Laptop", "Camera"], // Array of product types
      message: "Product type is not valid", // Custom error message for invalid type
    },
  },
  images: {
    type: String,
    required: [true, "Product must have image"],
  },
  favourites: {
    type: Number,
    default: 0,
    min: [0, "Favourites cannot be negative"], // Ensures no negative favourites
  },
  description: {
    type: String,
    required: [true, "Product must have description"],
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
