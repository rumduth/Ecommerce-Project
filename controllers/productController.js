const Product = require("../models/Product");

function filter(req, brandsChecked, typesChecked, disabledBtns) {
  let { page = 1, limit = 9, brand: brands, type: types } = req.query;

  // Initialize the filter object
  const filterObject = {};

  // Convert brands and types into arrays if provided
  if (brands) brands = brands.split(";");
  if (types) types = types.split(";");

  // Add filters to the filterObject
  if (brands && brands.length > 0) {
    filterObject.brand = { $in: brands }; // Filter by brand
    for (let brand of brands) brandsChecked[brand] = true;
  }

  if (types && types.length > 0) {
    filterObject.type = { $in: types }; // Filter by type
    for (let type of types) typesChecked[type] = true;
  }

  // Convert the page and limit into numbers
  page = parseInt(page);
  limit = parseInt(limit);

  // Add pagination parameters
  const skip = (page - 1) * limit;

  if (page === 1) disabledBtns.prevBtn = true;

  return { filterObject, skip, limit };
}

const getAllProducts = async (req, res, next) => {
  try {
    const brandsChecked = {
      Apple: false,
      Samsung: false,
      Microsoft: false,
      Google: false,
      LG: false,
    };

    const typesChecked = { Phone: false, Laptop: false, Camera: false };
    const disabledBtns = { prevBtn: false, nextBtn: false };
    const { filterObject, skip, limit } = filter(
      req,
      brandsChecked,
      typesChecked,
      disabledBtns
    );

    const products = await Product.find(filterObject).skip(skip).limit(limit);
    if (!products.length) {
      return res
        .status(200)
        .json({ status: "success", message: "No Product found" });
    }
    const totalCount = await Product.countDocuments(filterObject);
    if (skip + limit >= totalCount) disabledBtns.nextBtn = true;

    if (req.user) {
      const faveList = {};
      for (let id of req.user.productsFavorites)
        faveList[id] = await Product.findById(id);
      return res.status(200).render("main", {
        products,
        brandsChecked,
        typesChecked,
        disabledBtns,
        faveList,
      });
    }

    res.status(200).render("main", {
      products,
      brandsChecked,
      typesChecked,
      disabledBtns,
    });
  } catch (err) {
    next(err);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let otherBrandProducts = await Product.find({ brand: product.brand });
    otherBrandProducts = otherBrandProducts.filter(
      (el) => el._id.toString() !== product._id.toString()
    );

    let currentFav = false;
    if (req.user) {
      currentFav = req.user.productsFavorites.some(
        (product_id) => product_id.toString() === id
      );
    }

    res.status(200).render("product", {
      product,
      similarProducts: otherBrandProducts,
      currentFav,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllProducts, getProduct };
