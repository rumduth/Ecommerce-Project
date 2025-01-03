const express = require("express");
const productRouter = require("./routes/productRoute");
const userRouter = require("./routes/userRoute");
const viewController = require("./controllers/viewController");
const path = require("path"); // For handling paths
const cookieParser = require("cookie-parser");
const { authenticate } = require("./controllers/userController");
const app = express();

// Set the view engine to Pug
app.set("view engine", "pug");

// Set the views directory (optional if not in 'views')
app.set("views", path.join(__dirname, "views"));

// Middleware for parsing incoming JSON requests
app.use(express.json());
app.use(cookieParser());

// Middleware for parsing URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Middleware for serving static files

app.use(authenticate);

// Redirect logged-in users from login.html and signup.html to the main page
app.get("/login.html", (req, res) => {
  if (req.user) return res.redirect(301, "/");
  res.sendFile(path.join(__dirname, "public", "login.html")); // Serve the file manually if needed
});

app.get("/signup.html", (req, res) => {
  if (req.user) return res.redirect(301, "/");
  res.sendFile(path.join(__dirname, "public", "signup.html")); // Serve the file manually if needed
});

// Serve static files after the specific route handlers
app.use(express.static(path.join(__dirname, "public")));

// Use authentication middleware globally

// Mount routers
app.use("/products", productRouter); // Routes for product-related requests
app.use("/users", userRouter); // Routes for user-related requests

// app.get()

// Default route (optional)
app.get("/", viewController.getHomepage);
app.get("/admin", viewController.getAdminPage);
app.get("/user/*", (req, res) => {
  res.redirect(301, "/");
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).render("pagenotfound");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .render("error", { title: "Error", message: "Something went wrong!" });
});

module.exports = app;
