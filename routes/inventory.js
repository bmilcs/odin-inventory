const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");

// get inventory homepage
router.get("/", productController.index);

module.exports = router;
