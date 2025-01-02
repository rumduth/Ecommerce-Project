const mongoose = require("mongoose");
const Product = require("../models/Product");
const faker = require("faker");
const { connectToDatabase } = require("./database");

const seedProducts = async () => {
  // Clear the existing collection
  await Product.deleteMany({});

  const brands = ["Apple", "Samsung", "Microsoft", "Google", "LG"];
  const types = ["Phone", "Laptop", "Camera"];
  const products = [];

  // Generate 30 products
  for (let i = 0; i < 30; i++) {
    const randomBrand = brands[i % brands.length]; // Rotate through brands
    const randomType = types[i % types.length]; // Rotate through types
    const randomImage = `https://picsum.photos/200/300?random=${Math.floor(
      Math.random() * 1000
    )}`; // Use random image service    console.log(randomImage);

    products.push({
      brand: randomBrand,
      type: randomType,
      images: randomImage,
    });
  }

  // Insert products into the database
  await Product.insertMany(products);

  console.log("Database seeded with 30 products!");
};

// Connect to MongoDB and run the seeding function
async function startSeeding() {
  try {
    await connectToDatabase();
    await seedProducts();
  } catch (err) {
    console.log(err);
  } finally {
    await mongoose.connection.close();
  }
}

startSeeding();
