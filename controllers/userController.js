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
    res.status(404).json(err);
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

      // Call next() to pass control to the next middleware/route handler
      next();
    });
  } catch (error) {
    console.error("Authentication error:", error);
    return next(); // Handle any unexpected errors and proceed
  }
};

const logout = async function (req, res, next) {
  res.clearCookie("token"); // 'token' is the name of the cookie
  return res.status(200).json({ message: "Logout succesfully" });
};

module.exports = { createUser, signIn, authenticate, logout };
