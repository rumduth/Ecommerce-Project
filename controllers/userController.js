const User = require("../models/User");
const createUser = async function (req, res, next) {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });
    res.status(201).json({ status: "success", user });
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
    res.status(200).json({ status: "success", message: "Login successful" });
  } catch (err) {
    res.status(404).json(err);
  }
};

module.exports = { createUser, signIn };
