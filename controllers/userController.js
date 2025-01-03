const User = require("../models/User");
const jwt = require("jsonwebtoken");

const createUser = async function (req, res, next) {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });
    const token = jwt.sign(
      { username: user.username, id: user.id },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true, // Prevent JavaScript access to the cookie
      secure: process.env.NODE_ENV === "production", // Ensure cookies are sent over HTTPS in production
      maxAge: 3600000, // 1 hour
    });
    res.status(201).json({ message: "Succesfully create the account" });
  } catch (err) {
    next(err);
  }
};

const signIn = async function (req, res, next) {
  try {
    const { username, password } = req.body;
    let user;
    if (username.includes("@")) {
      user = await User.findOne({ email: username });
    } else {
      user = await User.findOne({ username });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await user.isValidPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { username: user.username, id: user.id },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true, // Prevent JavaScript access to the cookie
      secure: process.env.NODE_ENV === "production", // Ensure cookies are sent over HTTPS in production
      maxAge: 3600000, // 1 hour
    });
    res.status(200).json({ status: "success", message: "Login successful" });
  } catch (err) {
    res.status(404).json(err);
  }
};

const authenticate = async function (req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return next(); // Proceed without authentication if no token exists
    }

    // Verify the JWT token
    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
      if (err) {
        return next(); // If verification fails, proceed without user data
      }

      res.locals.user = await User.findById(decoded.id);
      req.user = res.locals.user;
      // Call next() to pass control to the next middleware/route handler
      next();
    });
  } catch (error) {
    return next(error); // Handle any unexpected errors and proceed
  }
};

const logout = async function (req, res, next) {
  res.clearCookie("token"); // 'token' is the name of the cookie
  return res.status(200).json({ message: "Logout succesfully" });
};

const addOrRemoveFav = async function (req, res, next) {
  try {
    const { id } = req.body;
    if (!req.user)
      return res.status(404).json({ message: "You have to sign in first" });

    let user = req.user;
    let isExisted = false;

    // Check if the product is already in the favorites list
    for (let product_id of user.productsFavorites) {
      if (product_id == id) {
        isExisted = true;
        break;
      }
    }

    // If product exists, remove it from favorites
    if (isExisted) {
      user.productsFavorites = user.productsFavorites.filter((el) => el != id);
    } else {
      // Otherwise, add it to the favorites
      user.productsFavorites.push(id);
    }

    // Save the updated user
    await user.save();

    // Return success message based on action
    if (isExisted) {
      res
        .status(200)
        .json({ message: "Removed from your favourite list successfully" });
    } else {
      res
        .status(200)
        .json({ message: "Added to your favourite list successfully" });
    }
  } catch (err) {
    res.status(404).json(err);
  }
};

const deleteAllFav = async function (req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "You have to sign in first" });
    }
    let user = req.user;
    user.productsFavorites = []; // Clear the favorites array

    // Save the updated user
    await user.save();

    // Return success message
    res.status(200).json({ message: "Deleted all favorites successfully" });
  } catch (err) {
    console.error("Error deleting favorites:", err); // Log the error for debugging
    res.status(500).json({
      message: "An error occurred while deleting favorites",
      error: err.message,
    });
  }
};

module.exports = {
  createUser,
  signIn,
  authenticate,
  logout,
  addOrRemoveFav,
  deleteAllFav,
};
