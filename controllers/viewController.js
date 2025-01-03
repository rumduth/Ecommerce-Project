const Product = require("../models/Product");
const User = require("../models/User");
const getHomepage = async (req, res) => {
  const products = await Product.find({}).skip(0).limit(9);
  if (req.user) {
    const faveList = {};
    for (let id of req.user.productsFavorites)
      faveList[id] = await Product.findById(id);
    return res.status(200).render("main", {
      products,
      disabledBtns: { prevBtn: true, nextBtn: false },
      faveList,
    });
  }
  res.status(200).render("main", {
    products,
    disabledBtns: { prevBtn: true, nextBtn: false },
  });
};

const getAdminPage = async (req, res) => {
  try {
    if (!req.user || req.user.role === "user")
      return res.status(403).render("unauthorized");
    console.log(req.user);
    const users = await User.find({ _id: { $ne: req.user.id } }).populate(
      "productsFavorites"
    );

    res.status(200).render("admin", { users });
  } catch (err) {
    next(err);
  }
};

module.exports = { getHomepage, getAdminPage };
