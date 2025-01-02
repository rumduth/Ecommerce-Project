const express = require("express");
const productRouter = require("./routes/productRoute");
const userRouter = require("./routes/userRoute");
const path = require("path"); // For handling paths
const Product = require("./models/Product");
const app = express();

// Set the view engine to Pug
app.set("view engine", "pug");

// Set the views directory (optional if not in 'views')
app.set("views", path.join(__dirname, "views"));

// Middleware for parsing incoming JSON requests
app.use(express.json());

// Middleware for parsing URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Middleware for serving static files
app.use(express.static(path.join(__dirname, "public")));

// Mount routers
app.use("/products", productRouter); // Routes for product-related requests
app.use("/users", userRouter); // Routes for user-related requests

// Default route (optional)
app.get("/", async (req, res) => {
  const products = await Product.find({}).skip(0).limit(9);
  res.status(200).render("main", {
    products,
    disabledBtns: { prevBtn: true, nextBtn: false },
  });
});

// Handle 404 errors
app.use((req, res) => {
  //   res.status(404).render("404", { title: "Page Not Found" });
  res.status(404).json({ message: "Page not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .render("error", { title: "Error", message: "Something went wrong!" });
});

module.exports = app;
