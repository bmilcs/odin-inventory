const asyncHandler = require("express-async-handler");

const Product = require("../models/product");
const Category = require("../models/category");

//
// READ PRODUCTS
//

// GET inventory stats / main homepage
exports.index = asyncHandler(async (req, res, next) => {
  const [numProducts, numCategories] = await Promise.all([
    Product.countDocuments({}).exec(),
    Category.countDocuments({}).exec(),
  ]);

  res.render("index", {
    productCount: numProducts,
    categoryCount: numCategories,
  });
});

// GET all products in the inventory
exports.all = asyncHandler(async (req, res, next) => {
  const allProducts = await Product.find({}).populate("category").exec();
  res.send(allProducts);
  // res.render("products", { products: allProducts });
});

// GET a product's details by id
exports.productById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).exec();
  res.send(product);
  // res.render("product", { product: product });
});

//
// CREATE PRODUCTS
//

// GET create product form
exports.createProductGet = asyncHandler(async (req, res, next) => {
  res.send("create product: form render");
});

// POST create product in db
exports.createProductPost = asyncHandler(async (req, res, next) => {
  res.send("create product: perform create");
});

//
// UPDATE PRODUCTS
//

// GET update product form
exports.updateProductGet = asyncHandler(async (req, res, next) => {
  res.send("update product: form render");
});

// POST update product in db
exports.updateProductPost = asyncHandler(async (req, res, next) => {
  res.send("update product: perform update");
});

//
// DELETE PRODUCTS
//

// GET delete product form
exports.deleteProductGet = asyncHandler(async (req, res, next) => {
  res.send("delete product: form render");
});

// POST delete product in db
exports.deleteProductPost = asyncHandler(async (req, res, next) => {
  res.send("delete product: perform delete");
});
