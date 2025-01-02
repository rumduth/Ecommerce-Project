const express = require("express");

const router = express.Router();
const controller = require("../controllers/productController");

router.get("/", controller.getAllProducts);
router.get("/details/:id", controller.getProduct);

module.exports = router;
